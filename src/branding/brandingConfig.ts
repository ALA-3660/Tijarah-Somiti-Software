/**
 * TSS Centralized Brand Configuration
 * 
 * Single source of truth for Tijarah Samity Software (TSS) brand identity.
 * Rule: Never use "Tijarah" alone as the primary software brand.
 * TSS = Software Brand, Organization = User's Society / Entity.
 */

export interface BrandColorDefinition {
  primary: string;         // #0F5132 (Islamic Emerald)
  primaryDark: string;     // #0A3622
  primaryLight: string;    // #198754
  primaryContainer: string;// #D1E7DD
  secondary: string;       // #B45309 (Warm Amber / Gold)
  secondaryDark: string;   // #78350F
  secondaryLight: string;  // #D97706
  secondaryContainer: string; // #FEF3C7
  neutralDark: string;     // #0F172A
  neutralLight: string;    // #F8FAFC
  white: string;           // #FFFFFF
  grayBorder: string;      // #E2E8F0
}

export interface BrandConfig {
  shortName: string;
  fullName: string;
  banglaName: string;
  fullBanglaTitle: string;
  tagline: string;
  subTagline: string;
  copyright: string;
  version: string;
  releaseYear: string;
  colors: BrandColorDefinition;
  typography: {
    headingFont: string;
    bodyFont: string;
    numericFont: string;
    codeFont: string;
  };
  standards: {
    wcagCompliance: string;
    designPhilosophy: string;
    shariahAlignment: string;
  };
}

export const BRAND_CONFIG: BrandConfig = {
  shortName: 'TSS',
  fullName: 'Tijarah Samity Software',
  banglaName: 'তিজারাহ সমিতি সফটওয়্যার',
  fullBanglaTitle: 'টিএসএস — তিজারাহ সমিতি সফটওয়্যার',
  tagline: 'ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা',
  subTagline: 'Modern Islamic & Halal Business Management Platform',
  copyright: '© ২০২৬ TSS (Tijarah Samity Software) — সর্বস্বত্ব সংরক্ষিত',
  version: 'v5.1.0-brand-foundation',
  releaseYear: '২০২৬',
  colors: {
    primary: '#0F5132',
    primaryDark: '#0A3622',
    primaryLight: '#198754',
    primaryContainer: '#D1E7DD',
    secondary: '#B45309',
    secondaryDark: '#78350F',
    secondaryLight: '#D97706',
    secondaryContainer: '#FEF3C7',
    neutralDark: '#0F172A',
    neutralLight: '#F8FAFC',
    white: '#FFFFFF',
    grayBorder: '#E2E8F0',
  },
  typography: {
    headingFont: 'Hind Siliguri',
    bodyFont: 'Tiro Bangla',
    numericFont: 'Baloo Da 2',
    codeFont: 'JetBrains Mono',
  },
  standards: {
    wcagCompliance: 'WCAG 2.1 AA Compliant (Contrast Ratio >= 4.5:1 for body, >= 3.0:1 for large text)',
    designPhilosophy: 'Modern Islamic + Premium Business + Minimal Technology',
    shariahAlignment: 'Zero-Interest (Riba-Free), Ethical Trade, Auditable Transparency',
  },
};
