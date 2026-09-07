import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className="flex items-center gap-3 select-none" id="battle-club-brand-logo">
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-md"></div>

        {/* Outer Shield Emblem */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="innerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Shield Outline */}
          <path
            d="M50 5 L88 20 L80 65 L50 95 L20 65 L12 20 Z"
            fill="url(#innerGrad)"
            stroke="url(#shieldGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Accent Line */}
          <path
            d="M50 14 L80 26 L73 60 L50 85 L27 60 L20 26 Z"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Crossed Battle Blades */}
          <path
            d="M28 28 L72 72 M72 28 L28 72"
            stroke="url(#bladeGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Sword Hilts */}
          <circle cx="28" cy="28" r="3" fill="#fbbf24" />
          <circle cx="72" cy="28" r="3" fill="#fbbf24" />
          <circle cx="28" cy="72" r="3" fill="#f97316" />
          <circle cx="72" cy="72" r="3" fill="#f97316" />

          {/* Crown / Star Crest at Center */}
          <path
            d="M50 34 L54 44 L64 45 L56 52 L59 62 L50 56 L41 62 L44 52 L36 45 L46 44 Z"
            fill="#f59e0b"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-2xl font-bold tracking-wider text-white uppercase">
              BATTLE <span className="text-amber-400">CLUB</span>
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-tech font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
              Official
            </span>
          </div>
          <span className="text-[11px] font-tech font-semibold tracking-widest text-slate-400 uppercase">
            Esports Championship &bull; Season 2026
          </span>
        </div>
      )}
    </div>
  );
};
