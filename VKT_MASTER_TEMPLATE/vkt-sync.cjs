const fs = require('fs');
const path = 'e:/HMKT/VKT_ECOSYSTEM_CORE/VKT_MASTER_TEMPLATE/src/pages/ScriptModule.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace SECONDS_PER_SCENE constant import
content = content.replace(
  /import \{\s*SECONDS_PER_SCENE,\s*TARGET_MARKETS,\s*VISUAL_STYLES\s*\} from '\.\.\/data\/constants';/,
  `import { TARGET_MARKETS, VISUAL_STYLES } from '../data/constants';\nimport { CURRENT_NICHE } from '../data/nicheConfig';`
);

// Remove DHARMA_TOPICS and MICRO_CONTEXTS completely
content = content.replace(/export const DHARMA_TOPICS = \[[\s\S]*?\];\s*const MICRO_CONTEXTS: Record<string, string\[\]> = \{[\s\S]*?\};\s*/, '');

// Add state variables
content = content.replace(
  /const \[duration, setDuration\] = useState<number \| string>\(1\);/,
  `const [duration, setDuration] = useState<number | string>(1);\n  const [isCustomDuration, setIsCustomDuration] = useState(false);\n  const [secondsPerScene, setSecondsPerScene] = useState(8);`
);

// Replace default market and dharmaTopic with CURRENT_NICHE defaults
content = content.replace(
  /const \[market, setMarket\] = useState\('vn_dharma'\);/,
  `const [market, setMarket] = useState(Object.keys(CURRENT_NICHE.targetMarkets)[0] || 'vn_kids');`
);
content = content.replace(
  /const \[dharmaTopic, setDharmaTopic\] = useState\('karma'\);/,
  `const [dharmaTopic, setDharmaTopic] = useState(CURRENT_NICHE.topics[0]?.id || '');`
);

// Replace SECONDS_PER_SCENE usage
content = content.replace(/SECONDS_PER_SCENE/g, 'secondsPerScene');

// Update UI
content = content.replace(
  /<label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2"><i className="fa-solid fa-clock text-teal-400" \/> \{uiLang === 'vi' \? 'THỜI LƯỢNG \(PHÚT\)' : 'DURATION \(MINS\)'\}<\/label>\s*<div className="flex items-center gap-5">/,
  `<div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><i className="fa-solid fa-clock text-teal-400" /> {uiLang === 'vi' ? 'THỜI LƯỢNG (PHÚT)' : 'DURATION (MINS)'}</label>
                <div className="flex items-center gap-2">
                  <span className={\`text-[10px] font-bold \${!isCustomDuration ? 'text-slate-500' : 'text-teal-400'}\`}>GIÂY/CẢNH</span>
                  <div 
                    className={\`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors \${isCustomDuration ? 'bg-teal-500' : 'bg-slate-700'}\`}
                    onClick={() => {
                      setIsCustomDuration(!isCustomDuration);
                      if (isCustomDuration) setSecondsPerScene(8);
                    }}
                  >
                    <div className={\`w-3 h-3 rounded-full bg-white transition-transform \${isCustomDuration ? 'translate-x-4' : 'translate-x-0'}\`} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
              <div className="flex items-center gap-5">`
);

content = content.replace(
  /<\/div>\s*<\/div>\s*<div className="bg-\[#10141c\] border border-slate-700\/30 rounded-xl p-4 flex flex-col justify-center">/,
  `  </div>
                {isCustomDuration && (
                  <div className="flex items-center gap-3 bg-[#0a0e14] p-2 rounded-lg border border-teal-500/30 animate-[fadeIn_0.2s_ease-out]">
                    <label className="text-[10px] text-teal-400 font-bold uppercase w-16">Thời gian/cảnh</label>
                    <input 
                      type="number" 
                      value={secondsPerScene} 
                      min={3}
                      max={30}
                      onChange={e => setSecondsPerScene(parseInt(e.target.value) || 8)}
                      className="w-16 bg-transparent border-b border-teal-500/50 text-white text-center outline-none font-mono font-bold"
                    />
                    <span className="text-xs text-slate-500">giây</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">`
);

// Update TARGET_MARKETS to CURRENT_NICHE.targetMarkets in UI and logic
content = content.replace(
  /const mk = TARGET_MARKETS\[market\] \|\| TARGET_MARKETS\['vn_dharma'\];/,
  `const mk = CURRENT_NICHE.targetMarkets[market] || Object.values(CURRENT_NICHE.targetMarkets)[0];`
);
content = content.replace(
  /\{Object\.values\(TARGET_MARKETS\)\.map\(m => <option key=\{m\.id\} value=\{m\.id\}>\{m\.flag\} \{m\.name\}<\/option>\)\}/,
  `{Object.values(CURRENT_NICHE.targetMarkets).map(m => <option key={m.id} value={m.id}>{m.flag} {m.name}</option>)}`
);

// Update DHARMA_TOPICS to CURRENT_NICHE.topics in UI and logic
content = content.replace(
  /const topicObj = DHARMA_TOPICS\.find\(t => t\.id === dharmaTopic\);/,
  `const topicObj = CURRENT_NICHE.topics.find(t => t.id === dharmaTopic);`
);
content = content.replace(
  /const contexts = MICRO_CONTEXTS\[dharmaTopic\] \|\| \['Trong chánh niệm'\];\s*const randomContext = contexts\[Math\.floor\(Math\.random\(\) \* contexts\.length\)\];\s*styleContext \+= \` - DHARMA TOPIC: \$\{topicObj\?\.label\}\. MICRO-CONTEXT \(CRITICAL\): \$\{randomContext\}\.\`;/,
  `styleContext += \` - NICHE: \$\{CURRENT_NICHE.nicheName\}. TOPIC: \$\{topicObj?.label\}.\`;`
);
content = content.replace(
  /\{uiLang === 'vi' \? 'CHỌN PHÂN PHÂN NGÁCH PHẬT PHÁP' : 'DHARMA SUB-TOPIC'\}/,
  `{CURRENT_NICHE.nicheName.toUpperCase()}`
);
content = content.replace(
  /\{DHARMA_TOPICS\.map\(t => <option key=\{t\.id\} value=\{t\.id\}>\{t\.label\}<\/option>\)\}/,
  `{CURRENT_NICHE.topics.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done modifying ScriptModule.tsx');
