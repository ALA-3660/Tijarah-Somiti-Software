import React from 'react';
import { BRAND_CONFIG } from './brandingConfig';

export type TSSLogoVariant = 'icon' | 'compact' | 'full' | 'horizontal' | 'stacked' | 'wordmark' | 'app-icon';
export type TSSLogoTheme = 'light' | 'dark' | 'emerald' | 'monochrome' | 'amber';
export type TSSLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface TSSLogoProps {
  variant?: TSSLogoVariant;
  theme?: TSSLogoTheme;
  size?: TSSLogoSize;
  showTagline?: boolean;
  showBangla?: boolean;
  className?: string;
  id?: string;
  onClick?: () => void;
}

/**
 * TSS Professional Monogram Vector Symbol (Geometric Master Mark)
 * 
 * Design Philosophy:
 * - Unified Monogram combining T (Tijarah - Foundation/Pillar), S (Samity - Cooperative Circulation), S (Software - Technology/Flow).
 * - Islamic Geometric Foundation: 8-fold rotational equilibrium, faceted octagonal geometry, precision 45° chamfers.
 * - Negative Space Architecture: Clear 3.5px isolation channels ensuring zero blur at 20px–24px.
 * - Central Golden Node: Islamic diamond node representing halal audit integrity and transparency.
 */
export const TSSMonogramSymbol: React.FC<{
  sizePx: number;
  theme?: TSSLogoTheme;
  isAppIcon?: boolean;
  className?: string;
}> = ({ sizePx, theme = 'light', isAppIcon = false, className = '' }) => {
  // Theme-specific color palettes
  const getThemePalette = () => {
    switch (theme) {
      case 'dark':
        return {
          bgGradStart: '#0A3622',
          bgGradEnd: '#041D12',
          chassisBorder: '#1E5E3A',
          primaryPillar: '#FFFFFF',
          primaryPillarGrad: '#E2E8F0',
          ribbonAmberLight: '#FBBF24',
          ribbonAmberDark: '#D97706',
          centerStar: '#FDE68A',
          haloGlow: 'rgba(245, 158, 11, 0.25)',
          geoGrid: 'rgba(255, 255, 255, 0.08)',
        };
      case 'emerald':
        return {
          bgGradStart: '#0F5132',
          bgGradEnd: '#083C24',
          chassisBorder: '#198754',
          primaryPillar: '#FFFFFF',
          primaryPillarGrad: '#F8FAFC',
          ribbonAmberLight: '#FCD34D',
          ribbonAmberDark: '#B45309',
          centerStar: '#FEF3C7',
          haloGlow: 'rgba(252, 211, 77, 0.3)',
          geoGrid: 'rgba(255, 255, 255, 0.1)',
        };
      case 'monochrome':
        return {
          bgGradStart: '#0F172A',
          bgGradEnd: '#1E293B',
          chassisBorder: '#475569',
          primaryPillar: '#FFFFFF',
          primaryPillarGrad: '#F1F5F9',
          ribbonAmberLight: '#E2E8F0',
          ribbonAmberDark: '#94A3B8',
          centerStar: '#FFFFFF',
          haloGlow: 'none',
          geoGrid: 'rgba(255, 255, 255, 0.06)',
        };
      case 'amber':
        return {
          bgGradStart: '#B45309',
          bgGradEnd: '#78350F',
          chassisBorder: '#F59E0B',
          primaryPillar: '#FFFFFF',
          primaryPillarGrad: '#FEF3C7',
          ribbonAmberLight: '#FEF3C7',
          ribbonAmberDark: '#FDE68A',
          centerStar: '#FFFFFF',
          haloGlow: 'rgba(254, 243, 199, 0.35)',
          geoGrid: 'rgba(255, 255, 255, 0.12)',
        };
      case 'light':
      default:
        return {
          bgGradStart: '#0F5132',
          bgGradEnd: '#0A3622',
          chassisBorder: '#0F5132',
          primaryPillar: '#FFFFFF',
          primaryPillarGrad: '#F8FAFC',
          ribbonAmberLight: '#F59E0B',
          ribbonAmberDark: '#B45309',
          centerStar: '#FDE68A',
          haloGlow: 'rgba(15, 81, 50, 0.15)',
          geoGrid: 'rgba(255, 255, 255, 0.08)',
        };
    }
  };

  const palette = getThemePalette();
  const radius = isAppIcon ? 22 : 24;

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none transition-transform duration-200 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Background Radial Gradient */}
        <linearGradient id={`tss-bg-gradient-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.bgGradStart} />
          <stop offset="100%" stopColor={palette.bgGradEnd} />
        </linearGradient>

        {/* Primary Pillar Gradient (T-Anchor) */}
        <linearGradient id={`tss-pillar-gradient-${theme}`} x1="50%" y1="18%" x2="50%" y2="82%">
          <stop offset="0%" stopColor={palette.primaryPillar} />
          <stop offset="100%" stopColor={palette.primaryPillarGrad} />
        </linearGradient>

        {/* Golden Interlocking Ribbon Gradient (Samity/Software Flow) */}
        <linearGradient id={`tss-ribbon-gradient-${theme}`} x1="20%" y1="20%" x2="80%" y2="80%">
          <stop offset="0%" stopColor={palette.ribbonAmberLight} />
          <stop offset="100%" stopColor={palette.ribbonAmberDark} />
        </linearGradient>

        {/* Reverse Golden Gradient for Dynamic Depth */}
        <linearGradient id={`tss-ribbon-rev-gradient-${theme}`} x1="80%" y1="20%" x2="20%" y2="80%">
          <stop offset="0%" stopColor={palette.ribbonAmberLight} />
          <stop offset="100%" stopColor={palette.ribbonAmberDark} />
        </linearGradient>

        {/* Crisp Shadow Filter for Elevation */}
        <filter id={`tss-elevation-${theme}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="rgba(0,0,0,0.28)" />
        </filter>
      </defs>

      {/* 1. Outer Chassis: Rounded Octagonal/Square Emblem with Precision Bevel */}
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx={radius}
        fill={`url(#tss-bg-gradient-${theme})`}
        stroke={palette.chassisBorder}
        strokeWidth="2"
      />

      {/* 2. Architectural 8-Pointed Islamic Geometric Watermark Grid */}
      <g opacity="0.35" stroke={palette.geoGrid} strokeWidth="1" fill="none">
        {/* Diamond 1 (Square) */}
        <rect x="24" y="24" width="52" height="52" rx="6" />
        {/* Diamond 2 (Rotated 45 degrees) */}
        <rect x="24" y="24" width="52" height="52" rx="6" transform="rotate(45 50 50)" />
      </g>

      {/* 3. Central Unified Monogram Mark (T-S-S Geometric Synthesis) */}
      <g id="tss-unified-symbol" filter={`url(#tss-elevation-${theme})`}>
        
        {/* UPPER S-SWEEP: Geometric Halal Flow (Top Ribbon looping around central node) */}
        <path
          d="M 28 36 
             C 28 28, 38 24, 50 24 
             C 62 24, 72 28, 72 36 
             C 72 43, 64 47, 50 50
             C 36 47, 28 43, 28 36 Z"
          fill={`url(#tss-ribbon-gradient-${theme})`}
          opacity="0.95"
        />

        {/* LOWER S-SWEEP: Dynamic Financial Circulation Ribbon */}
        <path
          d="M 50 50 
             C 36 53, 28 57, 28 64 
             C 28 72, 38 76, 50 76 
             C 62 76, 72 72, 72 64 
             C 72 57, 64 53, 50 50 Z"
          fill={`url(#tss-ribbon-rev-gradient-${theme})`}
          opacity="0.95"
        />

        {/* CENTRAL T-ARCHITECTURAL PILLAR & CROSS-BAR (Tijarah & Stability Anchor) */}
        {/* Horizontal T-Cap with Chamfered Precision Terminals */}
        <path
          d="M 21 27 L 79 27 C 80.5 27 81.5 28.2 81.5 29.8 C 81.5 31.4 80.5 32.6 79 32.6 L 56 32.6 L 56 72 C 56 73.8 54.5 75.2 52.8 75.2 L 47.2 75.2 C 45.5 75.2 44 73.8 44 72 L 44 32.6 L 21 32.6 C 19.5 32.6 18.5 31.4 18.5 29.8 C 18.5 28.2 19.5 27 21 27 Z"
          fill={`url(#tss-pillar-gradient-${theme})`}
        />

        {/* INTERLOCKING S-CURVE FACETS (Interlocking Bands with Precision Negative Gap) */}
        {/* Left 'S' Dynamic Ribbon Segment */}
        <path
          d="M 40 40 
             C 35 41, 30 43.5, 30 48.5 
             C 30 53.5, 35 55.5, 42 57.5 
             L 42 63.5 
             C 34 61.5, 25 58, 25 50 
             C 25 41.5, 33 36.5, 40 34.5 Z"
          fill={`url(#tss-ribbon-gradient-${theme})`}
        />

        {/* Right 'S' Dynamic Ribbon Segment (Symmetric Interlocking Loop) */}
        <path
          d="M 60 60 
             C 65 59, 70 56.5, 70 51.5 
             C 70 46.5, 65 44.5, 58 42.5 
             L 58 36.5 
             C 66 38.5, 75 42, 75 50 
             C 75 58.5, 67 63.5, 60 65.5 Z"
          fill={`url(#tss-ribbon-rev-gradient-${theme})`}
        />

        {/* CENTRAL ISLAMIC 8-POINTED DIAMOND STAR KEYSTONE (Halal Audit & Trust Core) */}
        <g transform="translate(50, 50)">
          {/* Outer Golden Glow Rhombus */}
          <polygon
            points="0,-6.5 4.5,-2 6.5,0 4.5,2 0,6.5 -4.5,2 -6.5,0 -4.5,-2"
            fill={palette.centerStar}
          />
          {/* Core White Diamond Spark */}
          <polygon
            points="0,-3.5 2.5,0 0,3.5 -2.5,0"
            fill="#FFFFFF"
          />
        </g>

        {/* BOTTOM FOUNDATION BEVEL (Solid Base Terminal) */}
        <polygon
          points="50,78 54,82 50,86 46,82"
          fill={palette.ribbonAmberLight}
        />
      </g>
    </svg>
  );
};

export const TSSLogo: React.FC<TSSLogoProps> = ({
  variant = 'compact',
  theme = 'light',
  size = 'md',
  showTagline = false,
  showBangla = true,
  className = '',
  id,
  onClick,
}) => {
  // Size metrics mapping
  const sizeMap: Record<TSSLogoSize, { px: number; titleClass: string; subClass: string; tagClass: string; gap: string }> = {
    xs: { px: 22, titleClass: 'text-xs font-bold', subClass: 'text-[9px]', tagClass: 'text-[8px]', gap: 'gap-1.5' },
    sm: { px: 28, titleClass: 'text-sm font-bold', subClass: 'text-[10px]', tagClass: 'text-[9px]', gap: 'gap-2' },
    md: { px: 38, titleClass: 'text-base font-bold', subClass: 'text-xs', tagClass: 'text-[10px]', gap: 'gap-2.5' },
    lg: { px: 48, titleClass: 'text-lg font-bold', subClass: 'text-xs', tagClass: 'text-[11px]', gap: 'gap-3' },
    xl: { px: 64, titleClass: 'text-2xl font-extrabold', subClass: 'text-sm', tagClass: 'text-xs', gap: 'gap-3.5' },
    '2xl': { px: 88, titleClass: 'text-3xl font-extrabold', subClass: 'text-base', tagClass: 'text-sm', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size];

  // Theme text color mapping
  const getTextColor = () => {
    switch (theme) {
      case 'dark':
      case 'emerald':
        return {
          brand: 'text-white',
          brandSub: 'text-emerald-100/90',
          accent: 'text-amber-300',
          tagline: 'text-emerald-100/80',
          badge: 'bg-emerald-800/80 text-emerald-100 border-emerald-600/50',
          divider: 'text-emerald-400/40',
        };
      case 'monochrome':
        return {
          brand: 'text-slate-900',
          brandSub: 'text-slate-600',
          accent: 'text-slate-800',
          tagline: 'text-slate-500',
          badge: 'bg-slate-100 text-slate-700 border-slate-300',
          divider: 'text-slate-300',
        };
      case 'amber':
        return {
          brand: 'text-amber-950',
          brandSub: 'text-amber-900',
          accent: 'text-amber-700',
          tagline: 'text-amber-800/90',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          divider: 'text-amber-400/40',
        };
      case 'light':
      default:
        return {
          brand: 'text-slate-950',
          brandSub: 'text-slate-600',
          accent: 'text-[#B45309]',
          tagline: 'text-slate-500',
          badge: 'bg-emerald-50 text-[#0F5132] border-emerald-200',
          divider: 'text-slate-300',
        };
    }
  };

  const textColors = getTextColor();

  // 1. Icon Only / App Icon Variant
  if (variant === 'icon' || variant === 'app-icon') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
        role="img"
        aria-label={`${BRAND_CONFIG.shortName} — ${BRAND_CONFIG.fullName}`}
      >
        <TSSMonogramSymbol
          sizePx={currentSize.px}
          theme={theme}
          isAppIcon={variant === 'app-icon'}
        />
      </div>
    );
  }

  // 2. Wordmark Only Variant
  if (variant === 'wordmark') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`flex flex-col select-none ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className={`font-mono tracking-wider font-extrabold ${currentSize.titleClass} ${textColors.brand}`}>
            {BRAND_CONFIG.shortName}
          </span>
          <span className={`${textColors.divider} font-light`}>•</span>
          <span className={`font-heading font-bold ${currentSize.subClass} ${textColors.accent}`}>
            {BRAND_CONFIG.fullName}
          </span>
        </div>
        {showBangla && (
          <span className={`font-heading font-medium ${currentSize.tagClass} ${textColors.brandSub}`}>
            {BRAND_CONFIG.banglaName}
          </span>
        )}
      </div>
    );
  }

  // 3. Stacked Logo Variant (Symbol above TSS & Descriptor)
  if (variant === 'stacked') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        role="img"
        aria-label={`${BRAND_CONFIG.shortName} — ${BRAND_CONFIG.fullName}`}
      >
        <TSSMonogramSymbol sizePx={currentSize.px * 1.3} theme={theme} />
        <div className="flex flex-col items-center mt-2.5">
          <span className={`font-mono tracking-wider font-extrabold leading-none ${currentSize.titleClass} ${textColors.brand}`}>
            {BRAND_CONFIG.shortName}
          </span>
          <span className={`font-heading font-bold tracking-tight mt-1 leading-tight ${currentSize.subClass} ${textColors.brandSub}`}>
            {BRAND_CONFIG.fullName}
          </span>
          {showBangla && (
            <span className={`font-heading font-semibold mt-0.5 leading-tight ${currentSize.tagClass} ${textColors.accent}`}>
              {BRAND_CONFIG.banglaName}
            </span>
          )}
          {showTagline && (
            <p className={`font-body leading-relaxed mt-1 font-normal max-w-xs ${currentSize.tagClass} ${textColors.tagline}`}>
              {BRAND_CONFIG.tagline}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 4. Horizontal / Compact Logo Variant (Symbol + TSS + Bangla Descriptor)
  if (variant === 'horizontal' || variant === 'compact') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`inline-flex items-center ${currentSize.gap} select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        role="img"
        aria-label={`${BRAND_CONFIG.shortName} — ${BRAND_CONFIG.fullName}`}
      >
        <TSSMonogramSymbol sizePx={currentSize.px} theme={theme} />
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-mono tracking-wider font-extrabold leading-none ${currentSize.titleClass} ${textColors.brand}`}>
              {BRAND_CONFIG.shortName}
            </span>
            {showBangla && (
              <span className={`font-heading font-bold leading-none ${currentSize.subClass} ${textColors.brandSub}`}>
                {BRAND_CONFIG.banglaName}
              </span>
            )}
          </div>
          {showTagline && (
            <span className={`font-body text-[10px] leading-tight mt-0.5 font-normal ${textColors.tagline}`}>
              {BRAND_CONFIG.tagline}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 5. Full Logo (Default): Symbol + TSS | Full English Name + Full Bangla Name + Optional Tagline
  return (
    <div
      id={id}
      onClick={onClick}
      className={`inline-flex items-center ${currentSize.gap} select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role="img"
      aria-label={`${BRAND_CONFIG.shortName} — ${BRAND_CONFIG.fullName} (${BRAND_CONFIG.banglaName})`}
    >
      <TSSMonogramSymbol sizePx={currentSize.px} theme={theme} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`font-mono tracking-wider font-extrabold leading-none ${currentSize.titleClass} ${textColors.brand}`}>
            {BRAND_CONFIG.shortName}
          </span>
          <span className={`${textColors.divider} text-xs font-light`}>|</span>
          <span className={`font-heading font-bold tracking-tight leading-none ${currentSize.subClass} ${textColors.brandSub}`}>
            {BRAND_CONFIG.fullName}
          </span>
        </div>

        {showBangla && (
          <span className={`font-heading font-semibold mt-1 leading-tight ${currentSize.subClass} ${textColors.accent}`}>
            {BRAND_CONFIG.banglaName}
          </span>
        )}

        {showTagline && (
          <p className={`font-body leading-relaxed mt-1 font-normal ${currentSize.tagClass} ${textColors.tagline}`}>
            {BRAND_CONFIG.tagline}
          </p>
        )}
      </div>
    </div>
  );
};
