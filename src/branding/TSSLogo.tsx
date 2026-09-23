import React from 'react';
import { BRAND_CONFIG } from './brandingConfig';

export type TSSLogoVariant = 'icon' | 'compact' | 'full' | 'wordmark' | 'app-icon';
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
 * TSS Monogram Vector Symbol (Mathematical SVG)
 * Blends Modern Islamic Octagram symmetry with structured T, S, S typography.
 */
export const TSSMonogramSymbol: React.FC<{
  sizePx: number;
  theme?: TSSLogoTheme;
  isAppIcon?: boolean;
  className?: string;
}> = ({ sizePx, theme = 'light', isAppIcon = false, className = '' }) => {
  // Theme color maps for symbol
  const getColors = () => {
    switch (theme) {
      case 'emerald':
        return {
          bg: '#0F5132',
          border: '#198754',
          accent: '#B45309',
          accentLight: '#F59E0B',
          letterT: '#FFFFFF',
          letterS: '#FCD34D',
          innerStar: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(245, 158, 11, 0.25)',
        };
      case 'dark':
        return {
          bg: '#0A3622',
          border: '#198754',
          accent: '#F59E0B',
          accentLight: '#FCD34D',
          letterT: '#FFFFFF',
          letterS: '#F59E0B',
          innerStar: 'rgba(255, 255, 255, 0.06)',
          glow: 'rgba(245, 158, 11, 0.3)',
        };
      case 'monochrome':
        return {
          bg: '#1E293B',
          border: '#475569',
          accent: '#FFFFFF',
          accentLight: '#F1F5F9',
          letterT: '#FFFFFF',
          letterS: '#CBD5E1',
          innerStar: 'rgba(255, 255, 255, 0.05)',
          glow: 'none',
        };
      case 'amber':
        return {
          bg: '#B45309',
          border: '#D97706',
          accent: '#FEF3C7',
          accentLight: '#FFFFFF',
          letterT: '#FFFFFF',
          letterS: '#FEF3C7',
          innerStar: 'rgba(255, 255, 255, 0.12)',
          glow: 'rgba(254, 243, 199, 0.3)',
        };
      case 'light':
      default:
        return {
          bg: '#0F5132',
          border: '#0A3622',
          accent: '#B45309',
          accentLight: '#F59E0B',
          letterT: '#FFFFFF',
          letterS: '#FCD34D',
          innerStar: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(15, 81, 50, 0.2)',
        };
    }
  };

  const colors = getColors();
  const radius = isAppIcon ? sizePx * 0.22 : sizePx * 0.24;

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Soft Linear Gradient for Primary Background */}
        <linearGradient id={`tss-bg-grad-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.bg} />
          <stop offset="100%" stopColor={theme === 'dark' ? '#041d12' : theme === 'emerald' ? '#083c24' : '#0a3a24'} />
        </linearGradient>

        {/* Amber Gold Accent Gradient for S Monograms */}
        <linearGradient id={`tss-gold-grad-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.accentLight} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>

        {/* Star Glow Filter */}
        <filter id={`tss-shadow-${theme}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.15)" />
        </filter>
      </defs>

      {/* Outer Rounded Container with Subtle Inset Border */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx={radius}
        fill={`url(#tss-bg-grad-${theme})`}
        stroke={colors.border}
        strokeWidth="2.5"
      />

      {/* Subtle Islamic 8-Pointed Star Geometrical Grid (Subtle Watermark) */}
      <g opacity="0.45" stroke={colors.innerStar} strokeWidth="1.2" fill="none">
        {/* Diamond 1 */}
        <rect x="23" y="23" width="54" height="54" rx="4" transform="rotate(0 50 50)" />
        {/* Diamond 2 rotated 45 deg */}
        <rect x="23" y="23" width="54" height="54" rx="4" transform="rotate(45 50 50)" />
      </g>

      {/* Central TSS Monogram Construction */}
      <g id="tss-monogram-core">
        {/* T-BAR (Top Anchor - Clean Modernist Bar) */}
        <path
          d="M 22 26 L 78 26 C 80.2 26 82 27.8 82 30 C 82 32.2 80.2 34 78 34 L 56 34 L 56 74 C 56 76.2 54.2 78 52 78 C 49.8 78 48 76.2 48 74 L 48 34 L 22 34 C 19.8 34 18 32.2 18 30 C 18 27.8 19.8 26 22 26 Z"
          fill={colors.letterT}
          filter={`url(#tss-shadow-${theme})`}
        />

        {/* LEFT 'S' (Interlocking Geometric Wave on Left Flank) */}
        <path
          d="M 44 42 C 44 38.5 39 37 34 37 C 28.5 37 24 40.5 24 45.5 C 24 51 29 53 35 55 C 41 57 44 59.5 44 64.5 C 44 70 39 73 33 73 C 27 73 23 69.5 22.5 65.5 C 22.3 64 23.5 62.5 25 62.5 C 26.3 62.5 27.4 63.5 27.7 64.8 C 28.2 67 30.5 68.8 33 68.8 C 36.5 68.8 39.5 67 39.5 64.2 C 39.5 60.5 35.5 59 30.5 57 C 25 54.8 20 52 20 46 C 20 39.5 25.5 33 34 33 C 41 33 46 36.8 46.5 41.5 C 46.7 42.8 45.6 44 44.3 44 C 44.1 44 44 43 44 42 Z"
          fill={`url(#tss-gold-grad-${theme})`}
        />

        {/* RIGHT 'S' (Symmetric Geometric Wave on Right Flank) */}
        <path
          d="M 77.5 42 C 77.5 38.5 72.5 37 67.5 37 C 62 37 57.5 40.5 57.5 45.5 C 57.5 51 62.5 53 68.5 55 C 74.5 57 77.5 59.5 77.5 64.5 C 77.5 70 72.5 73 66.5 73 C 60.5 73 56.5 69.5 56 65.5 C 55.8 64 57 62.5 58.5 62.5 C 59.8 62.5 60.9 63.5 61.2 64.8 C 61.7 67 64 68.8 66.5 68.8 C 70 68.8 73 67 73 64.2 C 73 60.5 69 59 64 57 C 58.5 54.8 53.5 52 53.5 46 C 53.5 39.5 59 33 67.5 33 C 74.5 33 79.5 36.8 80 41.5 C 80.2 42.8 79.1 44 77.8 44 C 77.6 44 77.5 43 77.5 42 Z"
          fill={`url(#tss-gold-grad-${theme})`}
        />

        {/* Small Bottom Halal Seal Dot (Golden Geometric Diamond) */}
        <polygon
          points="50,81 53,84 50,87 47,84"
          fill={colors.accentLight}
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
  // Size mapping (px)
  const sizeMap: Record<TSSLogoSize, { px: number; titleClass: string; subClass: string; tagClass: string; gap: string }> = {
    xs: { px: 22, titleClass: 'text-xs font-bold', subClass: 'text-[9px]', tagClass: 'text-[8px]', gap: 'gap-1.5' },
    sm: { px: 28, titleClass: 'text-sm font-bold', subClass: 'text-[10px]', tagClass: 'text-[9px]', gap: 'gap-2' },
    md: { px: 38, titleClass: 'text-base font-bold', subClass: 'text-xs', tagClass: 'text-[10px]', gap: 'gap-2.5' },
    lg: { px: 48, titleClass: 'text-lg font-bold', subClass: 'text-xs', tagClass: 'text-[11px]', gap: 'gap-3' },
    xl: { px: 64, titleClass: 'text-2xl font-extrabold', subClass: 'text-sm', tagClass: 'text-xs', gap: 'gap-3.5' },
    '2xl': { px: 88, titleClass: 'text-3xl font-extrabold', subClass: 'text-base', tagClass: 'text-sm', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size];

  // Text color mapping according to theme
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
        };
      case 'monochrome':
        return {
          brand: 'text-slate-900',
          brandSub: 'text-slate-600',
          accent: 'text-slate-800',
          tagline: 'text-slate-500',
          badge: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      case 'amber':
        return {
          brand: 'text-amber-950',
          brandSub: 'text-amber-900',
          accent: 'text-amber-700',
          tagline: 'text-amber-800/90',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'light':
      default:
        return {
          brand: 'text-slate-900',
          brandSub: 'text-slate-600',
          accent: 'text-[#B45309]',
          tagline: 'text-slate-500',
          badge: 'bg-emerald-50 text-[#0F5132] border-emerald-200',
        };
    }
  };

  const textColors = getTextColor();

  // 1. Icon Only / App Icon variant
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

  // 2. Wordmark Only variant
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
          <span className="text-slate-300 font-light">•</span>
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

  // 3. Compact Logo: Symbol + TSS + (Bangla/Subtext)
  if (variant === 'compact') {
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
            <span className={`font-mono tracking-tight font-extrabold leading-none ${currentSize.titleClass} ${textColors.brand}`}>
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

  // 4. Full Logo (Default): Symbol + TSS + Full English Name + Full Bangla Name + Optional Tagline
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
          <span className={`font-mono tracking-tight font-extrabold leading-none ${currentSize.titleClass} ${textColors.brand}`}>
            {BRAND_CONFIG.shortName}
          </span>
          <span className="text-slate-400 text-xs font-light">|</span>
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
