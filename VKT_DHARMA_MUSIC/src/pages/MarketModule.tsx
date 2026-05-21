import React, { useState } from 'react';
import { callAI } from '../services/aiService';
import { SYSTEM_PROMPT_MARKET_ANALYST } from '../data/prompts';
import { showToast } from '../components/Toast';

interface Props { initialTopic?: string; }

const MarketModule: React.FC<Props> = ({ initialTopic = '' }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  React.useEffect(() => { if (initialTopic) setTopic(initialTopic); }, [initialTopic]);

  const handleAnalyze = async () => {
    if (!topic) return showToast('Nhập chủ đề Âm nhạc Phật giáo!');
    setLoading(true);
    try {
      const json = await callAI(`TOPIC: "${topic}"\nGENERATE JSON FOR MEDITATION MUSIC / BUDDHIST ZEN MONETIZATION.`, SYSTEM_PROMPT_MARKET_ANALYST);
      setResult(json);
    } catch (e: any) { showToast(e.message); }
    finally { setLoading(false); }
  };

  const persona = result?.customer_persona || {};
  const potential = result?.market_potential || {};
  const products = Array.isArray(result?.product_recommendations) ? result.product_recommendations : [];
  const strategy = result?.sales_strategy || {};
  const calculator = result?.profit_calculator || {};

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#0b0f14] border border-emerald-950/40 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><i className="fa-solid fa-shopping-bag text-emerald-400" /> Kinh Tế Âm Nhạc Phật Giáo & Chữa Lành</h2>
        <div className="flex gap-2 md:gap-4 mb-6 flex-col sm:flex-row">
          <input value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 bg-[#05080b] border border-emerald-950/50 rounded-lg p-3 text-sm text-white outline-none focus:border-emerald-500/50 placeholder-slate-600" placeholder="Nhập ngách nhạc (VD: Nhạc ngủ Solfeggio 528Hz, Thiền Trà Tịnh Tâm)..." />
          <button onClick={handleAnalyze} disabled={loading} className="px-6 py-3 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shrink-0">
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> ĐANG PHÂN TÍCH...</> : <><i className="fa-solid fa-chart-line" /> Phân Tích Mô Hình</>}
          </button>
        </div>

        {!result ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-emerald-950/30 border-dashed rounded-xl bg-emerald-950/10">
            <i className="fa-solid fa-seedling mb-2 text-emerald-500/60 text-2xl" /><p className="text-sm">Nhập chủ đề để AI lập kế hoạch khai thác doanh thu âm nhạc</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Persona + Potential Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-900/10 to-teal-900/10 border border-emerald-500/20 rounded-xl p-5">
                <h3 className="text-sm font-bold text-emerald-400 mb-4 uppercase flex items-center gap-2"><i className="fa-solid fa-user-astronaut" /> CHÂN DUNG THÍNH GIẢ THIỀN</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Demographics</div>
                    <div><b className="text-emerald-300/70">Tuổi:</b> {persona.demographics?.age_range || 'N/A'}</div>
                    <div><b className="text-emerald-300/70">Giới tính:</b> {persona.demographics?.gender_split || 'N/A'}</div>
                    <div><b className="text-emerald-300/70">Hành vi:</b> {persona.demographics?.income_level || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Tâm lý học</div>
                    <div className="flex flex-wrap gap-1">{(persona.psychographics?.interests || []).slice(0, 4).map((i: string, x: number) => <span key={x} className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-slate-300">{i}</span>)}</div>
                  </div>
                </div>
                {persona.psychographics?.pain_points && (
                  <div className="mt-4 p-3 bg-[#05080b]/40 rounded border border-emerald-950/40">
                    <div className="text-[10px] text-emerald-300 font-bold mb-1 italic">Nhu cầu cốt lõi:</div>
                    <p className="text-[11px] text-slate-400">{persona.psychographics.pain_points.join(', ')}</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-br from-teal-900/10 to-emerald-900/10 border border-teal-500/20 rounded-xl p-5">
                <h3 className="text-sm font-bold text-teal-400 mb-4 uppercase flex items-center gap-2"><i className="fa-solid fa-chart-line" /> TIỀM NĂNG PHÂN PHỐI NHẠC</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#05080b]/40 rounded border border-emerald-950/40"><div className="text-[10px] text-slate-500 uppercase mb-1">Lượt Nghe Tiềm Năng</div><div className="text-sm text-white font-black font-mono">{potential.market_size || 'N/A'}</div></div>
                  <div className="p-3 bg-[#05080b]/40 rounded border border-emerald-950/40"><div className="text-[10px] text-slate-500 uppercase mb-1">Tốc Độ Lan Truyền</div><div className="text-sm text-emerald-400 font-black font-mono">{potential.growth_rate || 'N/A'}</div></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1"><i className="fa-solid fa-shield-halved text-emerald-500" /> Cạnh tranh ngách: {potential.competition_level || 'N/A'}</div>
                  <div className="flex items-center gap-1"><i className="fa-solid fa-money-bill-trend-up text-teal-500" /> Khả năng tạo BGM: {potential.profit_margin || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Products */}
            {products.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><i className="fa-solid fa-boxes-packing text-emerald-400" /> PHÂN PHỐI & THƯƠNG MẠI HÓA</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {products.map((cat: any, ci: number) => (
                    <div key={ci} className="bg-[#0b0f14] border border-emerald-950/40 rounded-xl overflow-hidden hover:border-emerald-500/20 transition-colors">
                      <div className="p-3 bg-emerald-950/20 border-b border-emerald-950/40"><div className="text-[10px] text-emerald-400 font-bold uppercase">{cat.category}</div></div>
                      <div className="p-3 space-y-3">
                        <div className="space-y-2">{(cat.products || []).map((p: any, pi: number) => (
                          <div key={pi} className="flex justify-between items-start gap-2">
                            <div className="text-xs text-slate-300 font-medium">{p.name}</div>
                            <div className="text-[10px] text-right"><div className="text-slate-500">{p.price_range}</div><div className="text-emerald-500/70 font-bold">Lợi thế: {p.margin}</div></div>
                          </div>
                        ))}</div>
                        {Array.isArray(cat.sourcing_links) && (
                          <div className="pt-2 border-t border-emerald-950/40 space-y-1">
                            <div className="text-[9px] text-slate-600 font-bold">KÊNH DOANH THU:</div>
                            {cat.sourcing_links.map((link: any, li: number) => (
                              <a key={li} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-1.5 rounded bg-[#05080b]/40 hover:bg-emerald-900/20 border border-transparent hover:border-emerald-500/30 transition-all">
                                <span className="text-[10px] text-slate-400 hover:text-emerald-400 font-bold">{link.platform}</span>
                                <i className="fa-solid fa-external-link text-[8px] text-slate-600" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy + Profit */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0b0f14] border border-emerald-950/40 rounded-xl p-5">
                <h3 className="text-sm font-bold text-teal-400 mb-4 uppercase flex items-center gap-2"><i className="fa-solid fa-bullseye" /> CHIẾN LƯỢC QUẢNG BÁ</h3>
                <div className="space-y-3">
                  {['content_marketing', 'affiliate_approach', 'digital_products'].map(k => strategy[k] && (
                    <div key={k} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-lg bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center shrink-0"><i className="fa-solid fa-bolt text-emerald-400 text-xs" /></div>
                      <div><div className="text-[10px] text-slate-500 font-bold uppercase">{k.replace(/_/g, ' ')}</div><div className="text-xs text-slate-300">{strategy[k]}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-900/10 to-teal-900/10 border border-emerald-500/20 rounded-xl p-5">
                <h3 className="text-sm font-bold text-emerald-400 mb-4 uppercase flex items-center gap-2"><i className="fa-solid fa-calculator" /> DỰ TOÁN HIỆU QUẢ DOANH THU</h3>
                <div className="space-y-3">
                  {Object.values(calculator).map((scen: any, i: number) => (
                    <div key={i} className="bg-[#05080b]/50 p-3 rounded-lg border border-emerald-950/40 flex justify-between items-center">
                      <div><div className="text-xs text-white font-bold">{scen.model}</div><div className="text-[10px] text-slate-500">{scen.monthly_sales}</div></div>
                      <div className="text-right"><div className="text-sm text-emerald-400 font-black font-mono">{scen.profit}</div><div className="text-[9px] text-slate-600">ước tính</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketModule;
