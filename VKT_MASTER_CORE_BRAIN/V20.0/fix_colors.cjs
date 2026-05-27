const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/SpyModule.tsx',
  'src/pages/ScriptModule.tsx', 
  'src/pages/StudioModule.tsx',
  'src/pages/SeoModule.tsx',
  'src/pages/MarketModule.tsx',
];

const replacements = [
  ['emerald-900', 'amber-900'],
  ['emerald-800', 'amber-800'],
  ['emerald-600', 'amber-600'],
  ['emerald-500', 'amber-500'],
  ['emerald-400', 'amber-400'],
  ['emerald-300', 'amber-300'],
  ['emerald-200', 'amber-200'],
  ['emerald-100', 'amber-100'],
  // Also update old dark backgrounds to gold theme
  ['bg-[#0f0f11]', 'bg-[#12161e]'],
  ['bg-black border border-white/10', 'bg-[#0a0e14] border border-slate-700/50'],
  ['border-white/5', 'border-slate-700/30'],
  ['border-white/10', 'border-slate-700/30'],
  ['border-white/20', 'border-slate-600'],
  ['hover:border-white/20', 'hover:border-slate-600'],
  ['bg-white/5', 'bg-slate-800/20'],
  ['placeholder-white/20', 'placeholder-slate-600'],
  ['bg-[#1a1a1a]', 'bg-[#12161e]'],
  ['bg-[#151515]', 'bg-[#10141c]'],
  ['bg-[#252525]', 'bg-[#1e2230]'],
  ['bg-black/50', 'bg-[#0a0e14]/50'],
  ['bg-black', 'bg-[#0a0e14]'],
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.log('SKIP:', file);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf-8');
  let count = 0;
  replacements.forEach(([from, to]) => {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) count += matches.length;
    content = content.replace(regex, to);
  });
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`Fixed: ${file} (${count} replacements)`);
});

console.log('All done!');
