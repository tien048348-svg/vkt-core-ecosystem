// VKT VEO Automation - Background Service Worker

interface PromptConfig {
  mode: string; concurrentRuns: string; minDelay: number; maxDelay: number;
  outputsPerPrompt: string; folderName: string; model: string;
  aspectRatio: string; duration: string; retries: number; autoRename: boolean;
}

interface PromptTask {
  id: string; prompt: string;
  status: 'pending' | 'running' | 'done' | 'error';
  retries: number; config: PromptConfig;
  logs: string[];
  sourceTabId?: number;
}

let queue: PromptTask[] = [];
let flowTabId: number | null = null;

// ─── Broadcast to popup ───────────────────────────────────────────────────────
function notifyQueueUpdate() {
  chrome.runtime.sendMessage({ type: 'QUEUE_UPDATED', queue }).catch(() => {});
}

// ─── Find the Google Flow tab ─────────────────────────────────────────────────
async function getFlowTabId(): Promise<number | null> {
  if (flowTabId) {
    try {
      const tab = await chrome.tabs.get(flowTabId);
      if (tab?.url?.includes('labs.google')) return flowTabId;
    } catch { flowTabId = null; }
  }
  try {
    // Only query labs.google tabs — requires host_permission for this pattern
    const tabs = await chrome.tabs.query({});
    const flowTab = tabs.find(t => t.url?.includes('labs.google') && t.url?.includes('flow'));
    if (flowTab?.id) {
      flowTabId = flowTab.id;
      return flowTabId;
    }
  } catch (e) {
    console.error('[VKT] getFlowTabId error:', e);
  }
  return null;
}

// ─── Process the queue ────────────────────────────────────────────────────────
async function processQueue() {
  const running = queue.filter(t => t.status === 'running').length;
  const pending = queue.find(t => t.status === 'pending');
  if (!pending) return;

  const maxConcurrent = parseInt(pending.config.concurrentRuns) || 1;
  if (running >= maxConcurrent) return;

  pending.status = 'running';
  notifyQueueUpdate();

  const tabId = await getFlowTabId();
  if (!tabId) {
    pending.status = 'error';
    pending.logs.push('❌ Không tìm thấy tab Google Flow. Hãy mở labs.google/fx/tools/flow');
    notifyQueueUpdate();
    return;
  }

  try {
    await chrome.tabs.sendMessage(tabId, {
      type: 'RUN_PROMPT',
      taskId: pending.id,
      prompt: pending.prompt,
      config: pending.config,
    });
  } catch (err) {
    // Content script chưa inject — inject thủ công
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['assets/content-A54u3Ld_.js'],
      });
      await new Promise(r => setTimeout(r, 500));
      await chrome.tabs.sendMessage(tabId, {
        type: 'RUN_PROMPT',
        taskId: pending.id,
        prompt: pending.prompt,
        config: pending.config,
      });
    } catch (e2) {
      pending.status = 'error';
      pending.logs.push(`❌ Không thể inject content script: ${e2}`);
      notifyQueueUpdate();
      processQueue();
    }
  }
}

// ─── Message Listener ─────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === 'CONTENT_READY') {
    if (sender.tab?.id && msg.url?.includes('labs.google')) {
      flowTabId = sender.tab.id;
    }
    return;
  }

  if (msg.type === 'ADD_PROMPTS') {
    const prompts: string[] = msg.prompts;
    const config: PromptConfig = msg.config;
    const sourceTabId = sender.tab?.id;
    prompts.forEach(p => {
      queue.push({ id: crypto.randomUUID(), prompt: p, status: 'pending', retries: 0, config, logs: [], sourceTabId });
    });
    sendResponse({ ok: true });
    notifyQueueUpdate();
    processQueue();
    return true;
  }

  if (msg.type === 'GET_QUEUE') {
    sendResponse({ queue });
    return true;
  }

  if (msg.type === 'REMOVE_TASK') {
    queue = queue.filter(t => t.id !== msg.id);
    sendResponse({ ok: true });
    notifyQueueUpdate();
    return true;
  }

  if (msg.type === 'CLEAR_QUEUE') {
    queue = queue.filter(t => t.status === 'running');
    sendResponse({ ok: true });
    notifyQueueUpdate();
    return true;
  }

  if (msg.type === 'STOP_TASK') {
    const task = queue.find(t => t.id === msg.id);
    if (task && task.status === 'running') {
      task.status = 'error';
      task.logs.push('⛔ Đã dừng thủ công');
      // Báo content script dừng
      getFlowTabId().then(tabId => {
        if (tabId) chrome.tabs.sendMessage(tabId, { type: 'STOP_ALL' }).catch(() => {});
      });
    }
    sendResponse({ ok: true });
    notifyQueueUpdate();
    return true;
  }

  if (msg.type === 'SCAN_DOM') {
    getFlowTabId().then(tabId => {
      if (!tabId) { sendResponse({ error: 'Không tìm thấy tab Flow' }); return; }
      chrome.tabs.sendMessage(tabId, { type: 'SCAN_DOM' }, res => sendResponse(res));
    });
    return true;
  }

  if (msg.type === 'GET_LOGS') {
    const task = queue.find(t => t.id === msg.id);
    sendResponse({ logs: task?.logs || [] });
    return true;
  }

  // ─── Kết quả từ content script ─────────────────────────────────────────────

  if (msg.type === 'TASK_DONE') {
    const task = queue.find(t => t.id === msg.id);
    if (task) {
      task.status = 'done';
      task.logs.push('✅ Hoàn thành');
      if (msg.videoUrl) {
        const safeName = task.prompt.slice(0, 40).replace(/[^a-z0-9\u00C0-\u024F\s]/gi, '_').trim();
        const filename = task.config.autoRename
          ? `${task.config.folderName}/${safeName}_${Date.now()}.mp4`
          : `${task.config.folderName}/video_${Date.now()}.mp4`;
        chrome.downloads.download({ url: msg.videoUrl, filename }).catch(() => {});
      }
      if (task.sourceTabId) {
        chrome.tabs.sendMessage(task.sourceTabId, { type: 'TASK_DONE', id: task.id, videoUrl: msg.videoUrl }).catch(() => {});
      }
    }
    notifyQueueUpdate();
    // Delay trước khi xử lý task tiếp theo
    const cfg = task?.config;
    const delayMs = cfg ? ((cfg.minDelay + Math.random() * (cfg.maxDelay - cfg.minDelay)) * 1000) : 3000;
    setTimeout(processQueue, delayMs);
    return;
  }

  if (msg.type === 'TASK_ERROR') {
    const task = queue.find(t => t.id === msg.id);
    if (task) {
      task.retries++;
      task.logs.push(`❌ Lỗi lần ${task.retries}: ${msg.error}`);
      const maxRetries = task.config.retries || 5;
      if (task.retries < maxRetries) {
        task.status = 'pending';
        task.logs.push(`🔄 Thử lại lần ${task.retries + 1}/${maxRetries}...`);
        const delayMs = task.config.minDelay * 1000;
        setTimeout(processQueue, delayMs);
      } else {
        task.status = 'error';
        task.logs.push('❌ Đã hết số lần thử lại');
        setTimeout(processQueue, 2000);
        if (task.sourceTabId) {
          chrome.tabs.sendMessage(task.sourceTabId, { type: 'TASK_ERROR', id: task.id, error: msg.error }).catch(() => {});
        }
      }
    }
    notifyQueueUpdate();
    return;
  }

  if (msg.type === 'LOG') {
    const task = queue.find(t => t.id === msg.id);
    if (task) {
      task.logs.push(msg.message);
      notifyQueueUpdate();
    }
    return;
  }
});

// ─── Tab tracking ─────────────────────────────────────────────────────────────
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (tab.url?.includes('labs.google') && tab.url?.includes('flow') && changeInfo.status === 'complete') {
      flowTabId = tabId;
      console.log('[VKT] Flow tab detected:', tabId);
    }
  } catch (e) {
    // Ignore permission errors for non-permitted tabs
  }
});

console.log('[VKT VEO] Background service worker khởi động');
