import React from 'react';

interface ProgressBarProps {
  percent: number;
  text: string;
  subText?: string;
  colorTheme?: 'teal' | 'purple' | 'amber' | 'blue' | 'pink';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent, text, subText, colorTheme = 'teal' }) => {
  const themeClasses = {
    teal: {
      border: 'border-teal-500/50',
      bgFill: 'bg-teal-900/40',
      barFill: 'bg-teal-400',
      barShadow: 'shadow-[0_0_10px_rgba(45,212,191,1)]',
      iconBg: 'bg-teal-950',
      iconColor: 'text-teal-400',
      textColor: 'text-teal-300',
      subTextColor: 'text-teal-500/60',
      gradientText: 'from-teal-300 to-emerald-500',
      shadowText: 'drop-shadow-[0_2px_10px_rgba(45,212,191,0.5)]'
    },
    purple: {
      border: 'border-purple-500/50',
      bgFill: 'bg-purple-900/40',
      barFill: 'bg-purple-400',
      barShadow: 'shadow-[0_0_10px_rgba(192,132,252,1)]',
      iconBg: 'bg-purple-950',
      iconColor: 'text-purple-400',
      textColor: 'text-purple-300',
      subTextColor: 'text-purple-500/60',
      gradientText: 'from-purple-300 to-fuchsia-500',
      shadowText: 'drop-shadow-[0_2px_10px_rgba(192,132,252,0.5)]'
    },
    amber: {
      border: 'border-amber-500/50',
      bgFill: 'bg-amber-900/40',
      barFill: 'bg-amber-400',
      barShadow: 'shadow-[0_0_10px_rgba(251,191,36,1)]',
      iconBg: 'bg-amber-950',
      iconColor: 'text-amber-400',
      textColor: 'text-amber-300',
      subTextColor: 'text-amber-500/60',
      gradientText: 'from-amber-300 to-orange-500',
      shadowText: 'drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]'
    },
    blue: {
      border: 'border-blue-500/50',
      bgFill: 'bg-blue-900/40',
      barFill: 'bg-blue-400',
      barShadow: 'shadow-[0_0_10px_rgba(96,165,250,1)]',
      iconBg: 'bg-blue-950',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-300',
      subTextColor: 'text-blue-500/60',
      gradientText: 'from-blue-300 to-cyan-500',
      shadowText: 'drop-shadow-[0_2px_10px_rgba(96,165,250,0.5)]'
    },
    pink: {
      border: 'border-pink-500/50',
      bgFill: 'bg-pink-900/40',
      barFill: 'bg-pink-400',
      barShadow: 'shadow-[0_0_10px_rgba(244,114,182,1)]',
      iconBg: 'bg-pink-950',
      iconColor: 'text-pink-400',
      textColor: 'text-pink-300',
      subTextColor: 'text-pink-500/60',
      gradientText: 'from-pink-300 to-rose-500',
      shadowText: 'drop-shadow-[0_2px_10px_rgba(244,114,182,0.5)]'
    }
  };

  const theme = themeClasses[colorTheme];

  return (
    <div className={`w-full bg-[#0a0e14] border ${theme.border} rounded-xl p-4 relative overflow-hidden flex flex-col justify-center shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
      <div className={`absolute top-0 left-0 h-full ${theme.bgFill} transition-all duration-700 ease-out`} style={{ width: `${percent}%` }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
        <div className={`h-full ${theme.barFill} transition-all duration-700 ease-out ${theme.barShadow}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="relative z-10 flex items-center justify-between mt-1">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full ${theme.iconBg} border ${theme.border} flex items-center justify-center`}>
            <i className={`fa-solid fa-fan animate-spin ${theme.iconColor} text-lg`} />
          </div>
          <div>
            <div className={`${theme.textColor} font-bold text-sm tracking-wide`}>{text}</div>
            {subText && <div className={`${theme.subTextColor} text-[10px] mt-0.5 uppercase tracking-wider font-bold`}>{subText}</div>}
          </div>
        </div>
        <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText} ${theme.shadowText}`}>
          {Math.round(percent)}%
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);
