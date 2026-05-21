// VKT VEO Automation - Content Script v2
// Hỗ trợ Shadow DOM và Custom Elements của Google Flow

// ─── Deep Shadow DOM Traversal ────────────────────────────────────────────────
function deepQuery(selector: string, root: Document | Element = document): Element | null {
  const direct = root.querySelector(selector);
  if (direct) return direct;
  const allElements = root.querySelectorAll('*');
  for (const el of Array.from(allElements)) {
    if ((el as any).shadowRoot) {
      const found = deepQuery(selector, (el as any).shadowRoot);
      if (found) return found;
    }
  }
  return null;
}

function deepQueryAll(selector: string, root: Document | Element = document): Element[] {
  const results: Element[] = Array.from(root.querySelectorAll(selector));
  const allElements = root.querySelectorAll('*');
  for (const el of Array.from(allElements)) {
    if ((el as any).shadowRoot) {
      results.push(...deepQueryAll(selector, (el as any).shadowRoot));
    }
  }
  return results;
}

// ─── Tìm ô nhập prompt (Google Flow - "Bạn muốn gì?") ──────────────────────
function findPromptInput(): Element | null {
  // Google Flow specific - bottom textarea with "Bạn muốn gì?" or "What do you want?"
  const flowSelectors = [
    'textarea[placeholder*="Bạn muốn gì"]',
    'textarea[placeholder*="What do you want"]',
    'textarea[placeholder*="Describe"]',
    'textarea[placeholder*="prompt"]',
    '[contenteditable][aria-label*="prompt" i]',
    '[contenteditable][aria-label*="muốn" i]',
    '[contenteditable][placeholder*="Bạn muốn"]',
  ];

  for (const sel of flowSelectors) {
    const el = deepQuery(sel);
    if (el) return el;
  }

  // Fallback: tất cả textarea visible, ưu tiên ở cuối trang (bottom)
  const textareas = deepQueryAll('textarea');
  const visible = textareas.filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && !(el as HTMLTextAreaElement).disabled;
  });
  // Ưu tiên textarea có top lớn nhất (ở cuối trang = prompt input)
  if (visible.length > 0) {
    return visible.sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
  }

  // Fallback: contenteditable visible
  const editables = deepQueryAll('[contenteditable="true"], [contenteditable="plaintext-only"]');
  const visibleEdit = editables.filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width > 50 && rect.height > 20;
  });
  if (visibleEdit.length > 0) return visibleEdit[visibleEdit.length - 1];

  return null;
}


// ─── Tìm nút Generate/Send của Google Flow ───────────────────────────────────
function findGenerateButton(): Element | null {
  // Strategy 1: Tìm button cạnh textarea prompt
  const promptInput = findPromptInput();
  if (promptInput) {
    // Tìm button trong cùng container với input
    let parent = promptInput.parentElement;
    for (let i = 0; i < 5 && parent; i++) {
      const btns = parent.querySelectorAll('button, [role="button"]');
      if (btns.length > 0) {
        // Ưu tiên button có icon (send/arrow) hoặc không có text
        for (const btn of Array.from(btns)) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const text = btn.textContent?.trim() || '';
            const aria = btn.getAttribute('aria-label')?.toLowerCase() || '';
            // Nếu button gần với input và có aria-label liên quan
            if (aria.includes('create') || aria.includes('send') || aria.includes('generate') ||
                aria.includes('tạo') || aria.includes('gửi') || text === '' || text.length < 5) {
              return btn;
            }
          }
        }
        // Fallback: lấy button cuối cùng trong container
        const lastBtn = Array.from(btns).filter(b => {
          const r = b.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }).pop();
        if (lastBtn) return lastBtn;
      }
      parent = parent.parentElement;
    }
  }

  // Strategy 2: Tìm button với keywords
  const allButtons = deepQueryAll('button, [role="button"]');
  const keywords = ['create', 'generate', 'run', 'send', 'submit', 'chạy', 'tạo', 'gửi'];
  for (const btn of allButtons) {
    const text = btn.textContent?.toLowerCase().trim() || '';
    const aria = btn.getAttribute('aria-label')?.toLowerCase() || '';
    if (keywords.some(kw => text.includes(kw) || aria.includes(kw))) {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return btn;
    }
  }
  return null;
}


// ─── Set value React-aware ───────────────────────────────────────────────────
function setInputValue(el: Element, value: string) {
  const htmlEl = el as HTMLElement;
  if (el.getAttribute('contenteditable')) {
    htmlEl.focus();
    document.execCommand('selectAll', false, undefined);
    document.execCommand('delete', false, undefined);
    document.execCommand('insertText', false, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (nativeSetter) {
    nativeSetter.call(el, value);
  } else {
    (el as any).value = value;
  }
  ['focus', 'input', 'change', 'keyup'].forEach(ev => el.dispatchEvent(new Event(ev, { bubbles: true })));
}

// ─── Wait for element ─────────────────────────────────────────────────────────
function waitForEl(checkFn: () => Element | null, timeout = 12000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const existing = checkFn();
    if (existing) return resolve(existing);
    const observer = new MutationObserver(() => {
      const el = checkFn();
      if (el) { observer.disconnect(); clearTimeout(timer); resolve(el); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = setTimeout(() => { observer.disconnect(); reject(new Error('Timeout')); }, timeout);
  });
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Kích hoạt vùng tạo nội dung ─────────────────────────────────────────────
async function activateCreateArea(): Promise<void> {
  // Tìm elements với text "Bắt đầu tạo", "Start creating", hoặc buttons create
  const allEls = Array.from(document.querySelectorAll('*'));
  const candidates = allEls.filter(el => {
    const txt = el.textContent?.trim() || '';
    const aria = el.getAttribute('aria-label') || '';
    return (
      txt.includes('Bắt đầu tạo') ||
      txt.includes('Start creating') ||
      aria.toLowerCase().includes('create') ||
      aria.toLowerCase().includes('add')
    );
  }).filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  // Click element nhỏ nhất (button, not container)
  if (candidates.length > 0) {
    const target = candidates.sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return (ra.width * ra.height) - (rb.width * rb.height);
    })[0];
    (target as HTMLElement).click();
    console.log('[VKT VEO] Clicked:', target.tagName, target.textContent?.slice(0, 30));
    await delay(1500);
  } else {
    // Fallback: click vào trung tâm trang
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    if (el) (el as HTMLElement).click();
    await delay(1500);
  }
}

// ─── Automation chính ─────────────────────────────────────────────────────────
let shouldStop = false;

async function runPromptAutomation(taskId: string, prompt: string, config: any): Promise<void> {
  sendLog(taskId, `▶ Bắt đầu: "${prompt.slice(0, 40)}..."`);

  // Bước 1: Tìm input — nếu không thấy thì kích hoạt vùng tạo
  let inputEl: Element | null = findPromptInput();

  if (!inputEl) {
    sendLog(taskId, '⏳ Đang kích hoạt vùng tạo nội dung...');
    await activateCreateArea();

    try {
      inputEl = await waitForEl(findPromptInput, 10000);
    } catch {
      // Thử một lần nữa với click center
      const centerEl = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      if (centerEl) { (centerEl as HTMLElement).click(); await delay(2000); }
      inputEl = findPromptInput();
    }
  }

  if (!inputEl) {
    throw new Error('Không tìm thấy ô nhập prompt. Hãy click vào vùng tạo nội dung trên Flow rồi chạy lại.');
  }

  sendLog(taskId, `✓ Input: ${inputEl.tagName}.${(inputEl as HTMLElement).className.slice(0, 30)}`);

  // Bước 2: Nhập prompt
  (inputEl as HTMLElement).focus();
  await delay(300);
  setInputValue(inputEl, prompt);
  await delay(500);
  sendLog(taskId, '✓ Đã nhập prompt');

  // Bước 3: Click Generate hoặc Enter
  let genBtn = findGenerateButton();
  if (!genBtn) { await delay(1000); genBtn = findGenerateButton(); }

  if (genBtn) {
    sendLog(taskId, `✓ Nút: "${genBtn.textContent?.trim().slice(0, 20)}"`);
    (genBtn as HTMLButtonElement).click();
  } else {
    // Fallback: Enter key
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    sendLog(taskId, '⚠ Thử Enter key');
  }

  sendLog(taskId, '⏳ Đang chờ video sinh ra...');

  // Bước 4: Polling kết quả
  const maxWait = 180000;
  let waited = 0;
  let videoUrl = '';

  while (waited < maxWait) {
    if (shouldStop) { sendLog(taskId, '⛔ Đã dừng'); return; }

    for (const v of deepQueryAll('video')) {
      const src = (v as HTMLVideoElement).src || (v as HTMLVideoElement).currentSrc;
      if (src && src.startsWith('http')) { videoUrl = src; break; }
    }
    if (!videoUrl) {
      const dl = deepQueryAll('a[download], a[href*=".mp4"], a[href*=".webm"]');
      if (dl.length > 0) videoUrl = (dl[0] as HTMLAnchorElement).href;
    }

    if (videoUrl) {
      sendLog(taskId, `✅ Video: ${videoUrl.slice(0, 80)}`);
      chrome.runtime.sendMessage({ type: 'TASK_DONE', id: taskId, videoUrl });
      return;
    }

    await delay(3000);
    waited += 3000;
    if (waited % 15000 === 0) sendLog(taskId, `⏳ ${waited / 1000}s...`);
  }

  // Fallback: video cuối cùng trên trang
  const all = deepQueryAll('video');
  if (all.length > 0) {
    const src = (all[all.length - 1] as HTMLVideoElement).src;
    if (src) { chrome.runtime.sendMessage({ type: 'TASK_DONE', id: taskId, videoUrl: src }); return; }
  }

  throw new Error('Hết 3 phút chờ — không tìm thấy video');
}

// ─── Helper log ───────────────────────────────────────────────────────────────
function sendLog(taskId: string, message: string) {
  const time = new Date().toLocaleTimeString('vi-VN');
  chrome.runtime.sendMessage({ type: 'LOG', id: taskId, message: `[${time}] ${message}` }).catch(() => {});
  console.log('[VKT VEO]', message);
}

// ─── Message Listener ─────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'RUN_PROMPT') {
    shouldStop = false;
    runPromptAutomation(msg.taskId, msg.prompt, msg.config)
      .then(() => sendResponse({ status: 'ok' }))
      .catch(err => {
        sendLog(msg.taskId, `❌ ${err.message}`);
        chrome.runtime.sendMessage({ type: 'TASK_ERROR', id: msg.taskId, error: err.message });
        sendResponse({ status: 'error', error: err.message });
      });
    return true;
  }

  if (msg.type === 'STOP_ALL') {
    shouldStop = true;
    sendResponse({ ok: true });
  }

  if (msg.type === 'SCAN_DOM') {
    const result: Record<string, string> = {};
    deepQueryAll('textarea').forEach((el, i) => {
      result[`textarea_${i}`] = `placeholder="${(el as HTMLTextAreaElement).placeholder}" class="${el.className.slice(0, 50)}"`;
    });
    deepQueryAll('[contenteditable]').forEach((el, i) => {
      result[`editable_${i}`] = `${el.tagName} aria="${el.getAttribute('aria-label') || ''}"`;
    });
    deepQueryAll('button').slice(0, 30).forEach((el, i) => {
      const txt = el.textContent?.trim().slice(0, 25) || '';
      if (txt) result[`btn_${i}`] = `"${txt}" aria="${el.getAttribute('aria-label') || ''}"`;
    });
    sendResponse({ selectors: result });
    return true;
  }

  return false;
});

chrome.runtime.sendMessage({ type: 'CONTENT_READY', url: location.href }).catch(() => {});
console.log('[VKT VEO] Content script v2 ready:', location.href);
