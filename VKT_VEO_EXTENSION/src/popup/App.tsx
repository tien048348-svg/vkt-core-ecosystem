import React, { useState, useEffect } from 'react';

interface QueueItem {
  id: string; prompt: string; status: 'pending'|'running'|'done'|'error'; retries: number;
}

const NARRATORS = [
  'Không cấu hình giọng nói',
  'Achernar - Nữ - Nhẹ nhàng, giọng cao',
  'Achird - Nam - Thân thiện, giọng trung',
  'Algenib - Nam - Trầm khàn, giọng thấp',
  'Algieba - Nam - Thoải mái, giọng trung-thấp',
  'Alnilam - Nam - Cứng rắn, giọng trung-thấp',
  'Aoede - Nữ - Nhẹ nhàng, giọng trung',
  'Autonoe - Nữ - Tươi sáng, giọng trung',
  'Callirrhoe - Nữ - Thoải mái, giọng trung',
  'Charon - Nam - Thông tin, giọng thấp',
  'Despina - Nữ - Mượt mà, giọng trung',
  'Enceladus - Nam - Nhẹ nhàng, giọng thấp',
];

const DEFAULT_SETTINGS = {
  mode: 'text-to-video', concurrentRuns: '6 prompt', minDelay: 20, maxDelay: 30,
  outputsPerPrompt: '2', folderName: 'veo-folder-1',
  defaultMode: 'Văn bản thành video', model: 'Veo 3.1 - Lite [Lower Priority]',
  aspectRatio: '16:9 (YouTube)', duration: '8 giây', imageMode: 'Ảnh mới', retries: 5,
};

const G = '#10b981'; // emerald green accent

export default function App() {
  const [tab, setTab] = useState<'control'|'settings'|'logs'>('control');
  const [rawPrompts, setRawPrompts] = useState('');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [autoRename, setAutoRename] = useState(true);
  const [autoVoice, setAutoVoice] = useState(false);
  const [narrator, setNarrator] = useState('Không cấu hình giọng nói');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [notOnFlow, setNotOnFlow] = useState<'ok'|'homepage'|'not_flow'>('ok');

  useEffect(() => {
    chrome.storage.local.get(['vkt_settings','vkt_autoRename','vkt_prompts','vkt_autoVoice','vkt_narrator'], res => {
      if (res.vkt_settings) setSettings(s => ({...s, ...res.vkt_settings}));
      if (res.vkt_autoRename !== undefined) setAutoRename(res.vkt_autoRename);
      if (res.vkt_prompts) setRawPrompts(res.vkt_prompts);
      if (res.vkt_autoVoice !== undefined) setAutoVoice(res.vkt_autoVoice);
      if (res.vkt_narrator) setNarrator(res.vkt_narrator);
    });
    fetchQueue();
    const listener = (msg: any) => { if (msg.type === 'QUEUE_UPDATED') fetchQueue(); };
    chrome.runtime.onMessage.addListener(listener);
    // Check if on Flow PROJECT page (not just homepage)
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const url = tabs[0]?.url || '';
      const isOnFlow = url.includes('labs.google') && url.includes('flow');
      const isInProject = url.includes('/project/');
      if (!isOnFlow) {
        setNotOnFlow('not_flow');
      } else if (!isInProject) {
        setNotOnFlow('homepage');
      } else {
        setNotOnFlow('ok');
      }
    });
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  useEffect(() => { chrome.storage.local.set({vkt_settings: settings}); }, [settings]);
  useEffect(() => { chrome.storage.local.set({vkt_autoRename: autoRename, vkt_prompts: rawPrompts, vkt_autoVoice: autoVoice, vkt_narrator: narrator}); }, [autoRename, rawPrompts, autoVoice, narrator]);

  const set = (k: string, v: any) => setSettings(s => ({...s, [k]: v}));

  const fetchQueue = () => {
    chrome.runtime.sendMessage({type:'GET_QUEUE'}, res => { if (res?.queue) setQueue(res.queue); });
  };

  const handleRun = () => {
    const prompts = rawPrompts.split('\n\n').map(p => p.trim()).filter(Boolean);
    if (!prompts.length) return;
    chrome.runtime.sendMessage({type:'ADD_PROMPTS', prompts, config:{...settings, autoRename, autoVoice, narrator}}, res => {
      if (res?.ok) { setRawPrompts(''); fetchQueue(); }
    });
  };

  const removeTask = (id: string) => chrome.runtime.sendMessage({type:'REMOVE_TASK', id}, fetchQueue);
  const clearAll = () => { setQueue([]); chrome.runtime.sendMessage({type:'CLEAR_QUEUE'}, fetchQueue); };

  const Toggle = ({val, onChange}: {val:boolean, onChange:()=>void}) => (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${val ? 'bg-[#10b981]' : 'bg-[#334155]'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-200 shadow ${val ? 'right-0.5' : 'left-0.5'}`}/>
    </button>
  );

  const ModeBtn = ({id, label, icon}: {id:string, label:string, icon:string}) => (
    <button onClick={() => set('mode', id)} className={`flex items-center gap-2 py-2 px-3 rounded text-[13px] border transition-colors ${settings.mode===id ? 'text-black font-semibold border-transparent' : 'bg-[#111827] border-[#1e293b] text-gray-300 hover:bg-[#1e2230]'}`}
      style={settings.mode===id ? {background: G, borderColor: G} : {}}>
      <span>{icon}</span>{label}
    </button>
  );

  return (
    <div style={{width:'520px', minHeight:'600px'}} className="flex flex-col bg-[#0a0a0a] text-[#e5e5e5] font-sans overflow-x-hidden">

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1f2937]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-[15px]">VEO Automation</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-black" style={{background:G}}>v2.9.5</span>
          </div>
          <p className="text-[11px] text-gray-400">Tạo video và hình ảnh hàng loạt trên Google Flow.</p>
          <p className="text-[11px] text-gray-400">Tác giả: <span className="text-white font-medium">kylenguyen.me ↗</span></p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[12px] text-gray-300 hover:text-white flex items-center gap-1">📄 Hướng dẫn sử dụng</button>
          <button className="text-gray-400 hover:text-white text-[18px]">💬</button>
          <select className="bg-[#111827] border border-[#1f2937] text-[12px] text-white rounded px-2 py-1 outline-none">
            <option>Tiếng Việt</option>
          </select>
        </div>
      </div>

      {/* Subscription Banner */}
      <div className="px-4 py-2 border-b border-[#1f2937]">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-t text-[13px] font-bold text-black" style={{background:G}}>
          <span>⚡ Gói Miễn Phí</span>
          <button className="text-black">👤 Đăng nhập</button>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] border-t-0 px-3 py-2 rounded-b space-y-1.5">
          <p className="text-[11px] text-gray-400">0/10 lượt hôm nay</p>
          <button className="w-full py-1.5 rounded text-black text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{background:G}}>
            👑 Nâng cấp lên Max - 30.000đ/tháng
          </button>
          <p className="text-[11px] text-gray-500 text-center">30.000đ/tháng cho gói Không giới hạn cho tất cả extensions từ Truong Nguyen</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-2 border-b border-[#1f2937]">
        {([['control','≡ Điều khiển'],['settings','⚙ Cài đặt'],['logs','🔍 Nhật Ký Gỡ Lỗi']] as const).map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} className={`pb-2 px-3 text-[13px] font-semibold border-b-2 transition-colors mr-1 ${tab===id ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Not on Flow warning overlay */}
      {notOnFlow !== 'ok' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-[#1a1200] border border-[#f59e0b]/40 rounded-xl p-8 text-center max-w-xs shadow-2xl">
            <div className="text-[#f59e0b] text-2xl mb-2">ⓘ</div>
            {notOnFlow === 'not_flow' ? (
              <>
                <h2 className="text-[#f59e0b] font-bold text-[16px] mb-2">Không ở trang Google Flow</h2>
                <p className="text-[13px] text-gray-300 mb-4">Công cụ chỉ hoạt động khi bạn đang ở trang Google Flow.</p>
              </>
            ) : (
              <>
                <h2 className="text-[#f59e0b] font-bold text-[16px] mb-2">Bạn đang ở trang chủ Flow</h2>
                <p className="text-[13px] text-gray-300 mb-4">Hãy mở một <strong className="text-white">Dự án</strong> hoặc tạo <strong className="text-white">Dự án mới</strong> để bắt đầu tự động hóa.</p>
              </>
            )}
            <button onClick={()=>{ chrome.tabs.create({url:'https://labs.google/fx/tools/flow'}); setNotOnFlow('ok'); }}
              className="flex items-center gap-2 mx-auto px-5 py-2 rounded text-[13px] font-bold text-black hover:opacity-90" style={{background:'#10b981'}}>
              ↗ Đi tới Flow
            </button>
            <button onClick={()=>setNotOnFlow('ok')} className="mt-3 text-[11px] text-gray-500 hover:text-gray-300 block mx-auto">
              Đóng và tiếp tục
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-[70px]">
        <div className="max-w-2xl mx-auto w-full space-y-4">

          {tab === 'control' && (
            <>
              {/* Mode Buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <ModeBtn id="text-to-video" label="Văn bản thành video" icon="▷"/>
                  <ModeBtn id="image-to-video" label="Khung hình thành video" icon="🖼"/>
                  <ModeBtn id="components-to-video" label="Thành phần thành video" icon="⊞"/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ModeBtn id="text-to-image" label="Văn bản thành hình ảnh" icon="☆"/>
                  <ModeBtn id="image-to-image" label="Hình ảnh thành hình ảnh" icon="🔄"/>
                </div>
              </div>

              {/* Concurrent + Delay */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111827] border border-[#1f2937] rounded p-3">
                  <label className="text-[13px] font-bold text-white mb-2 flex items-center gap-1">⚡ Prompt đồng thời</label>
                  <select value={settings.concurrentRuns} onChange={e=>set('concurrentRuns',e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1f2937] rounded p-2 text-[13px] text-white outline-none focus:border-[#10b981]">
                    {['1 prompt','2 prompt','3 prompt','4 prompt','5 prompt','6 prompt'].map(v=><option key={v}>{v}</option>)}
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">Số lượng prompt cần xử lý cùng lúc.</p>
                </div>
                <div className="bg-[#111827] border border-[#1f2937] rounded p-3">
                  <label className="text-[13px] font-bold text-white mb-2 flex items-center gap-1">⏱ Thời gian chờ ngẫu nhiên</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={settings.minDelay} onChange={e=>set('minDelay',+e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#1f2937] rounded p-2 text-[13px] text-white outline-none focus:border-[#10b981]"/>
                    <span className="text-gray-400">⇄</span>
                    <input type="number" value={settings.maxDelay} onChange={e=>set('maxDelay',+e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#1f2937] rounded p-2 text-[13px] text-white outline-none focus:border-[#10b981]"/>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Thời gian chờ ngẫu nhiên trước khi xử lý prompt tiếp theo.</p>
                </div>
              </div>

              {/* Prompts */}
              <div className="bg-[#111827] border border-[#1f2937] rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-bold text-white flex items-center gap-1">▷ Prompts</label>
                  <div className="flex gap-3">
                    <button className="text-[12px] text-gray-400 hover:text-white">📄 Tải lên file .txt</button>
                    <button className="text-[12px] text-gray-400 hover:text-white">⊞ Tải lên .xlsx / .csv</button>
                  </div>
                </div>
                <textarea value={rawPrompts} onChange={e=>setRawPrompts(e.target.value)}
                  className="w-full h-36 p-3 text-[13px] bg-[#0a0a0a] border border-[#1f2937] rounded focus:border-[#10b981] outline-none resize-none text-gray-300 font-mono"
                  placeholder={'Ví dụ:\nPrompt dài đầu tiên.\nCó thể kéo dài nhiều dòng.\n\nPrompt thứ hai bắt đầu sau một dòng trống.\n\nPrompt thứ ba.'}/>
                <p className="text-[11px] text-gray-500 mt-1 italic">Tách mỗi prompt bằng một dòng trống.</p>
              </div>

              {/* Auto Voice */}
              <div className="bg-[#111827] border border-[#1f2937] rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-[13px] font-bold text-white flex items-center gap-1">🎙 Tự động thêm giọng nói theo diễn giá <span className="text-[10px] text-gray-400">(Yêu cầu gói Ultra)</span></p>
                    <p className="text-[11px] text-gray-500">Tự động chọn giọng nói khi tên diễn giá được đề cập trong prompt.</p>
                  </div>
                  <Toggle val={autoVoice} onChange={()=>setAutoVoice(!autoVoice)}/>
                </div>
                <div className="mt-2">
                  <p className="text-[12px] text-gray-400 mb-1">Diễn giá mặc định</p>
                  <select value={narrator} onChange={e=>setNarrator(e.target.value)} disabled={!autoVoice}
                    className="w-full bg-[#0a0a0a] border border-[#1f2937] rounded p-2 text-[13px] text-white outline-none focus:border-[#10b981] disabled:opacity-50">
                    {NARRATORS.map(n=><option key={n}>{n}</option>)}
                  </select>
                  {autoVoice && <p className="text-[11px] text-gray-500 mt-1">Bị tắt khi chế độ tự động thêm giọng nói đang bật.</p>}
                  {autoVoice && <button className="text-[11px] mt-1" style={{color:G}}>Xem 24 diễn giá được hỗ trợ</button>}
                </div>
              </div>

              {/* Output count + Folder */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111827] border border-[#1f2937] rounded p-3">
                  <label className="text-[13px] font-bold text-white mb-2 block">≡ Số đầu ra cần tạo từ 1 prompt</label>
                  <select value={settings.outputsPerPrompt} onChange={e=>set('outputsPerPrompt',e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1f2937] rounded p-2 text-[13px] text-white outline-none focus:border-[#10b981]">
                    {['1','2','3','4'].map(v=><option key={v}>{v}</option>)}
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">Số lượng ảnh/video cần tạo cho mỗi prompt.</p>
                </div>
                <div className="bg-[#111827] border border-[#1f2937] rounded p-3">
                  <label className="text-[13px] font-bold text-white mb-2 block">📁 Lưu vào thư mục</label>
                  <input type="text" value={settings.folderName} onChange={e=>set('folderName',e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1f2937] rounded p-2 text-[13px] text-white outline-none focus:border-[#10b981]"/>
                  <p className="text-[11px] text-gray-500 mt-1">Thư mục con để lưu file tải xuống.</p>
                </div>
              </div>

              {/* Auto rename toggle */}
              <div className="flex items-center justify-between py-1">
                <span className="text-[13px] text-gray-300">Tự động đổi tên file</span>
                <Toggle val={autoRename} onChange={()=>setAutoRename(!autoRename)}/>
              </div>

              <p className="text-[11px] text-gray-400">Tùy chỉnh tỷ lệ khung hình, thời lượng & số lượng trong tab Cài đặt để có thêm kiểm soát.</p>

              {/* Prompt Queue */}
              <div className="bg-[#111827] border border-[#1f2937] rounded overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-[#1e2230] border-b border-[#1f2937]">
                  <span className="font-bold text-[13px] text-white">≡ HÀNG ĐỢI PROMPT</span>
                  <span className="text-[12px] text-gray-400">{queue.length} nhóm</span>
                </div>
                {queue.length === 0 ? (
                  <div className="h-20"/>
                ) : (
                  <ul className="divide-y divide-[#1f2937] max-h-48 overflow-y-auto">
                    {queue.map(item=>(
                      <li key={item.id} className="flex items-center justify-between px-4 py-2 group hover:bg-[#1a1f2c]">
                        <p className="text-[12px] text-gray-300 truncate flex-1 pr-4">{item.prompt}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.status==='done'?'bg-emerald-900 text-emerald-400':item.status==='error'?'bg-rose-900 text-rose-400':item.status==='running'?'bg-amber-900 text-amber-400 animate-pulse':'bg-slate-800 text-slate-400'}`}>{item.status}</span>
                          <button onClick={()=>removeTask(item.id)} className="text-gray-500 hover:text-rose-400 opacity-0 group-hover:opacity-100">🗑</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {tab === 'settings' && (
            <div className="space-y-4">
              {[
                {key:'defaultMode', label:'⚙ Chế độ mặc định', opts:['Văn bản thành video','Khung hình thành video','Thành phần thành video','Văn bản thành hình ảnh','Hình ảnh thành hình ảnh'], desc:'Chế độ mặc định khi tạo video mới.'},
                {key:'aspectRatio', label:'⊡ Tỷ lệ khung hình mặc định', opts:['16:9 (YouTube)','9:16 (TikTok/Shorts)','1:1 (Instagram)'], desc:'Tỷ lệ khung hình video.'},
                {key:'duration', label:'▶ Tùy chọn video mặc định', opts:['8 giây','6 giây','10 giây'], desc:'Cài đặt thời lượng mặc định.'},
                {key:'imageMode', label:'🖼 Tùy chọn chế độ ảnh mặc định', opts:['Ảnh mới','Chỉnh sửa ảnh'], desc:'Tùy chọn đầu vào mặc định cho prompt ảnh.'},
              ].map(({key,label,opts,desc})=>(
                <div key={key} className="bg-[#111827] border border-[#1f2937] rounded p-3">
                  <label className="text-[14px] font-bold text-white mb-2 block">{label}</label>
                  <select value={(settings as any)[key]} onChange={e=>set(key,e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1f2937] rounded p-2 text-[13px] text-white outline-none focus:border-[#10b981]">
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">{desc}</p>
                </div>
              ))}

              {/* Model */}
              <div className="bg-[#111827] border border-[#1f2937] rounded p-3">
                <label className="text-[14px] font-bold text-white mb-2 block">⚙ Mô hình</label>
                <select value={settings.model} onChange={e=>set('model',e.target.value)}
                  className="w-full bg-[#0a0a0a] border rounded p-2 text-[13px] text-white outline-none mb-2" style={{borderColor:G}}>
                  {['Veo 3.1 Lite','Veo 3.1 - Lite [Lower Priority]','Veo 3.1 Fast','Veo 3.1 Quality'].map(m=><option key={m}>{m}</option>)}
                </select>
                <div className="flex items-center gap-2">
                  <span>🍌</span><span className="text-[13px] font-bold text-white">Nano Banana 2</span>
                </div>
              </div>

              {/* Retries */}
              <div className="bg-[#111827] border border-[#1f2937] rounded p-3">
                <label className="text-[14px] font-bold text-white mb-2 block">🔄 Số lần thử lại tối đa khi lỗi</label>
                <div className="flex items-center max-w-[180px]">
                  <button onClick={()=>set('retries',Math.max(1,settings.retries-1))} className="bg-[#0a0a0a] border border-[#1f2937] text-white w-9 py-1.5 rounded-l hover:bg-[#1e2230]">-</button>
                  <div className="bg-[#0a0a0a] border-y border-[#1f2937] flex-1 text-center py-1.5 text-[13px]">{settings.retries}</div>
                  <button onClick={()=>set('retries',Math.min(20,settings.retries+1))} className="bg-[#0a0a0a] border border-[#1f2937] text-white w-9 py-1.5 rounded-r hover:bg-[#1e2230]">+</button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Số lần thử lại tạo video nếu thất bại (1-20).</p>
              </div>
            </div>
          )}

          {tab === 'logs' && (
            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-white">Nhật ký hệ thống</span>
                <button onClick={() => chrome.runtime.sendMessage({type:'SCAN_DOM'}, res => {
                  alert(JSON.stringify(res?.selectors || res?.error || 'Không có kết quả', null, 2));
                })} className="text-[11px] px-3 py-1 rounded border border-[#1f2937] text-gray-400 hover:text-white">
                  🔍 Quét DOM Flow
                </button>
              </div>
              {queue.length === 0 ? (
                <div className="border border-dashed border-[#1f2937] rounded p-8 text-center text-gray-500 text-sm">
                  Chưa có nhật ký. Chạy một prompt để xem log.
                </div>
              ) : (
                queue.map(item => item.logs.length > 0 && (
                  <div key={item.id} className="bg-[#111827] border border-[#1f2937] rounded p-3">
                    <p className="text-[11px] font-bold text-gray-400 mb-2 truncate">Task: {item.prompt.slice(0,50)}...</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {item.logs.map((log, i) => (
                        <p key={i} className="text-[11px] font-mono text-gray-300">{log}</p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center gap-2 px-4 py-3 bg-[#0f1117] border-t border-[#1f2937] z-40">
        <button className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#111827] border border-[#1f2937] text-[13px] text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
          🚩 Báo lỗi
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#111827] border border-[#1f2937] text-[13px] text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
          💾 Xóa bộ nhớ đệm
        </button>
        <button onClick={clearAll} className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#111827] border border-[#1f2937] text-[13px] text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
          🧹 Dọn dẹp
        </button>
        <button onClick={handleRun} className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-[14px] font-bold text-black hover:opacity-90 transition-opacity" style={{background:G}}>
          ▶ Chạy
        </button>
      </div>
    </div>
  );
}
