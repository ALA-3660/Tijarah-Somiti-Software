import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Layers, 
  Maximize2, 
  FileText, 
  Printer, 
  Eye, 
  Info, 
  Award,
  Download,
  AlertTriangle,
  Compass,
  Grid,
  Hexagon
} from 'lucide-react';
import { BRAND_CONFIG } from './brandingConfig';
import { TSSLogo, TSSMonogramSymbol, TSSLogoVariant, TSSLogoTheme, TSSLogoSize } from './TSSLogo';
import { TSSReportHeader, TSSReportFooter } from './TSSReportHeader';
import { OrganizationContext } from '../types';

export const TSSBrandSpecimen: React.FC<{
  currentOrg: OrganizationContext;
}> = ({ currentOrg }) => {
  const [selectedTheme, setSelectedTheme] = useState<TSSLogoTheme>('light');
  const [selectedVariant, setSelectedVariant] = useState<TSSLogoVariant>('full');
  const [selectedSize, setSelectedSize] = useState<TSSLogoSize>('md');
  const [showTagline, setShowTagline] = useState<boolean>(true);
  const [showBangla, setShowBangla] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* 1. Brand Identity Overview Hero */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#0F5132] to-emerald-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-emerald-950 uppercase tracking-wider font-numeric shadow-xs">
                TSS BRAND IDENTITY SPECIFICATION
              </span>
              <span className="text-xs text-emerald-200 font-mono">
                {BRAND_CONFIG.version}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-wider text-white">
                {BRAND_CONFIG.shortName}
              </h1>
              <span className="text-emerald-300 text-2xl font-light">|</span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-emerald-100">
                {BRAND_CONFIG.fullName}
              </h2>
            </div>

            <p className="text-sm sm:text-base font-semibold text-amber-300 font-heading">
              {BRAND_CONFIG.banglaName}
            </p>

            <p className="text-xs sm:text-sm text-emerald-100/90 font-body max-w-2xl leading-relaxed pt-1">
              "{BRAND_CONFIG.tagline}"
            </p>
          </div>

          {/* Quick Monogram Hero Badge */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner shrink-0">
            <TSSMonogramSymbol sizePx={76} theme="emerald" isAppIcon={true} />
            <span className="text-xs font-mono font-bold mt-2 text-white">TSS Geometric Monogram</span>
            <span className="text-[10px] text-amber-300 font-numeric">Islamic Symmetry + Modern Tech</span>
          </div>
        </div>

        {/* Brand Principles Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-emerald-700/60 text-xs">
          <div className="flex items-center gap-2 bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-700/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-white">স্থায়ী প্রাইমারি ব্র্যান্ড: TSS</strong>
              <span className="text-emerald-200 text-[11px]">কখনো শুধু "Tijarah" একা সফটওয়্যার ব্র্যান্ড নয়</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-700/30">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <strong className="block text-white">Modern Islamic + Halal Business</strong>
              <span className="text-emerald-200 text-[11px]">সূক্ষ্ম জ্যামিতি ও সুদমুক্ত ব্যবসার আধুনিক মানদণ্ড</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-700/30">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-white">সফটওয়্যার vs অর্গানাইজেশন পৃথকীকরণ</strong>
              <span className="text-emerald-200 text-[11px]">TSS সফটওয়্যার, আর সমিতি হলো ক্লায়েন্ট</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Logo Redesign Philosophy & Construction Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ১. লোগো আর্কিটেকচার ও জ্যামিতিক বিনির্মাণ (Geometric Construction & Monogram Philosophy)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold">
            Unified T-S-S Synthesis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* T-Pillar Concept */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-heading font-bold text-sm">
              <span className="w-6 h-6 rounded-md bg-emerald-800 text-white flex items-center justify-center text-xs font-mono">T</span>
              <span>তিজারাহ (Tijarah) — মূল স্তম্ভ ও ভিত</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              সেন্ট্রাল টি-অ্যাঙ্করটি একটি সুদৃঢ় ভিত্তি ও কাঠামোর প্রতীক। এটি নৈতিক ব্যবসা, নিয়মতান্ত্রিকতা ও আর্থিক স্থিতিশীলতার প্রতিনিধিত্ব করে।
            </p>
          </div>

          {/* S-Ribbon Concept */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-950 font-heading font-bold text-sm">
              <span className="w-6 h-6 rounded-md bg-amber-600 text-white flex items-center justify-center text-xs font-mono">S</span>
              <span>সমিতি (Samity) — পারস্পরিক আবর্তন ও ঐক্য</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              দ্বৈত ইন্টারলকিং গোল্ডেন রিবন ফিতাগুলোর অবিচ্ছিন্ন প্রবাহ পারস্পরিক সঞ্চয়, সমবায় অংশীদারিত্ব এবং হালাল অর্থ সঞ্চালনের প্রতীক।
            </p>
          </div>

          {/* S-Software Concept & Diamond Node */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
              <span className="w-6 h-6 rounded-md bg-slate-800 text-white flex items-center justify-center text-xs font-mono">✦</span>
              <span>সফটওয়্যার (Software) — ডিজিটাল স্বচ্ছতা ও অডিট</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              কেন্দ্রে অবস্থিত ৮-কৌণিক জ্যামিতিক ইসলামিক হীরক নোড স্বচ্ছ হিসাবরক্ষণ, ডিজিটাল অডিট ট্রেইল এবং শরিয়াহ নির্ভুলতার প্রতিনিধিত্ব করে।
            </p>
          </div>
        </div>
      </div>

      {/* 3. Centralized Brand Configuration & Tokens */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ২. সেন্ট্রালাইজড ব্র্যান্ড কনফিগারেশন টোকেন (Centralized Brand Config)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            src/branding/brandingConfig.ts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Short Brand (Official)</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-extrabold font-mono text-emerald-950">{BRAND_CONFIG.shortName}</span>
              <button
                onClick={() => handleCopy(BRAND_CONFIG.shortName, 'shortName')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
                title="Copy"
              >
                {copiedKey === 'shortName' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">সর্বত্র প্রাইমারি ব্র্যান্ড হিসেবে ব্যবহার্য</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full English Name</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-heading text-slate-900">{BRAND_CONFIG.fullName}</span>
              <button
                onClick={() => handleCopy(BRAND_CONFIG.fullName, 'fullName')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
                title="Copy"
              >
                {copiedKey === 'fullName' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">অফিসিয়াল ইংরেজি পূর্ণ নাম</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bangla Name</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-heading text-emerald-900">{BRAND_CONFIG.banglaName}</span>
              <button
                onClick={() => handleCopy(BRAND_CONFIG.banglaName, 'banglaName')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
                title="Copy"
              >
                {copiedKey === 'banglaName' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">বাংলা ইন্টারফেস ও ডকুমেন্টে ব্যবহৃত</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Tagline</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold font-body text-slate-800 truncate">{BRAND_CONFIG.tagline}</span>
              <button
                onClick={() => handleCopy(BRAND_CONFIG.tagline, 'tagline')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded shrink-0 ml-1"
                title="Copy"
              >
                {copiedKey === 'tagline' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">হেডার, স্প্ল্যাশ ও ব্র্যান্ডিং টেক্সট</p>
          </div>
        </div>
      </div>

      {/* 4. Logo Matrix & Variants Showcase */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ৩. লোগো ভ্যারিয়েন্ট ও ফর্ম্যাট ম্যাট্রিক্স (Logo Variations Matrix)
            </h3>
          </div>
          <span className="text-xs text-slate-500">সব আকারের জন্য ভেক্টর স্কেলেবল (SVG)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* A. Full Logo */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-950 font-heading">A. Full / Primary Logo</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-semibold">
                  Desktop / Print
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[95px]">
                <TSSLogo variant="full" theme="light" size="sm" showBangla={true} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-body">
              সিম্বল + TSS + ইংরেজি পূর্ণ নাম + বাংলা নাম। ব্যবহৃত হবে: ডেস্কটপ হেডার, অফিশিয়াল ডকুমেন্টেশন ও ল্যান্ডিং পেজে।
            </p>
          </div>

          {/* B. Compact Logo */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-950 font-heading">B. Compact / Header Logo</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded font-semibold">
                  Header / Tablet
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[95px]">
                <TSSLogo variant="compact" theme="light" size="md" showBangla={true} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-body">
              সিম্বল + TSS + সংক্ষেপ বাংলা নাম। ব্যবহৃত হবে: ট্যাবলেট হেডার, অ্যাপ বার ও স্ট্যান্ডার্ড নেভিগেশনে।
            </p>
          </div>

          {/* C. Stacked Logo */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-950 font-heading">C. Stacked Centered Logo</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-mono px-2 py-0.5 rounded font-semibold">
                  Login / Splash
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[95px]">
                <TSSLogo variant="stacked" theme="light" size="xs" showBangla={true} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-body">
              সেন্টার্ড সিম্বল ও নিচে ব্র্যান্ড নাম। ব্যবহৃত হবে: লগইন ও সাইন-ইন স্ক্রিন, কার্ড ব্যাজ ও স্প্ল্যাশ ইন্টারফেসে।
            </p>
          </div>

          {/* D. Icon Only */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-950 font-heading">D. Standalone Monogram</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-semibold">
                  Favicon / Mobile
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[95px]">
                <TSSLogo variant="icon" theme="emerald" size="lg" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-body">
              একক TSS জ্যামিতিক মনোগ্রাম সিম্বল। ব্যবহৃত হবে: মোবাইল কম্প্যাক্ট হেডার, সংকুচিত সাইডবার, Favicon ও বোতামে।
            </p>
          </div>

          {/* E. App Icon (Android Launcher) */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-950 font-heading">E. Android App Icon</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded font-semibold">
                  APK / Launcher
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[95px]">
                <TSSLogo variant="app-icon" theme="emerald" size="lg" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-body">
              Android Adaptive & Legacy Launcher Icon (৪র্থ স্তরের স্ট্যান্ডার্ড ২২% কর্নার রেডিয়াস সহ)।
            </p>
          </div>
        </div>
      </div>

      {/* 5. Theme & Background Adaptation Specimen */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ৪. ব্যাকগ্রাউন্ড ও কালার থিম অ্যাডাপ্টেশন (Theme Matrix)
            </h3>
          </div>
          <span className="text-xs text-slate-500">সকল ব্যাকগ্রাউন্ডে ১০০% কনট্রাস্ট ও দৃশ্যমানতা</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Light Theme */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Light Theme</span>
              <span className="text-[10px] font-mono text-slate-400">#FFFFFF / #F8FAFC</span>
            </div>
            <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-lg flex items-center justify-center min-h-[100px]">
              <TSSLogo variant="full" theme="light" size="sm" showBangla={true} />
            </div>
            <p className="text-[11px] text-slate-500">হোয়াইট ও হালকা ব্যাকগ্রাউন্ডে স্বচ্ছ ও মার্জিত পাঠযোগ্যতা।</p>
          </div>

          {/* Dark / Islamic Emerald Theme */}
          <div className="p-5 rounded-xl border border-slate-700 bg-slate-900 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Dark / Emerald Theme</span>
              <span className="text-[10px] font-mono text-emerald-400">#0F5132 / #0A3622</span>
            </div>
            <div className="p-4 bg-[#0A3622] border border-emerald-800 rounded-lg flex items-center justify-center min-h-[100px]">
              <TSSLogo variant="full" theme="emerald" size="sm" showBangla={true} />
            </div>
            <p className="text-[11px] text-emerald-200/80">ডার্ক মোড, অ্যাপ বার ও হেডার ব্যানারে উচ্চ কনট্রাস্ট।</p>
          </div>

          {/* Monochrome / Print Mode */}
          <div className="p-5 rounded-xl border border-slate-300 bg-slate-100 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Monochrome / Print</span>
              <span className="text-[10px] font-mono text-slate-500">Grayscale / A4</span>
            </div>
            <div className="p-4 bg-white border border-slate-300 rounded-lg flex items-center justify-center min-h-[100px]">
              <TSSLogo variant="full" theme="monochrome" size="sm" showBangla={true} />
            </div>
            <p className="text-[11px] text-slate-500">সাদা-কালো প্রিন্ট, ভাউচার ও রসিদে পরিষ্কার প্রিন্ট স্ট্যাম্প।</p>
          </div>

          {/* Warm Amber Accent Theme */}
          <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950">Amber Gold Accent</span>
              <span className="text-[10px] font-mono text-amber-700">#B45309</span>
            </div>
            <div className="p-4 bg-[#B45309] border border-amber-600 rounded-lg flex items-center justify-center min-h-[100px]">
              <TSSLogo variant="full" theme="amber" size="sm" showBangla={true} />
            </div>
            <p className="text-[11px] text-amber-800">বিশেষ শরিয়াহ সার্টিফিকেট ও গোল্ডেন ব্যাজে ব্যবহারযোগ্য।</p>
          </div>
        </div>
      </div>

      {/* 6. Live Interactive Logo Sandbox & Generator */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ৫. লাইভ ইন্টারঅ্যাক্টিভ লোগো স্যান্ডবক্স (Live Logo Tester)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            Interactive Test
          </span>
        </div>

        {/* Controls Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          {/* Variant Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ভ্যারিয়েন্ট (Variant)</label>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value as TSSLogoVariant)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="full">Full / Primary</option>
              <option value="compact">Compact Logo</option>
              <option value="stacked">Stacked Logo</option>
              <option value="horizontal">Horizontal Logo</option>
              <option value="icon">Icon Only</option>
              <option value="app-icon">App Icon</option>
              <option value="wordmark">Wordmark Only</option>
            </select>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">কালার থিম (Theme)</label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as TSSLogoTheme)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="light">Light</option>
              <option value="emerald">Emerald</option>
              <option value="dark">Dark</option>
              <option value="monochrome">Monochrome</option>
              <option value="amber">Amber</option>
            </select>
          </div>

          {/* Size Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">সাইজ (Size)</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as TSSLogoSize)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="xs">XS (22px)</option>
              <option value="sm">SM (28px)</option>
              <option value="md">MD (38px)</option>
              <option value="lg">LG (48px)</option>
              <option value="xl">XL (64px)</option>
              <option value="2xl">2XL (88px)</option>
            </select>
          </div>

          {/* Toggle Tagline */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer pb-1.5">
              <input
                type="checkbox"
                checked={showTagline}
                onChange={(e) => setShowTagline(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[11px] font-medium text-slate-700">ট্যাগলাইন দেখান</span>
            </label>
          </div>

          {/* Toggle Bangla */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer pb-1.5">
              <input
                type="checkbox"
                checked={showBangla}
                onChange={(e) => setShowBangla(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[11px] font-medium text-slate-700">বাংলা নাম দেখান</span>
            </label>
          </div>
        </div>

        {/* Live Preview Display Box */}
        <div
          className={`p-8 rounded-2xl border flex items-center justify-center min-h-[180px] transition-colors duration-200 ${
            selectedTheme === 'emerald'
              ? 'bg-[#0F5132] border-emerald-800'
              : selectedTheme === 'dark'
              ? 'bg-slate-950 border-slate-800'
              : selectedTheme === 'amber'
              ? 'bg-[#B45309] border-amber-700'
              : selectedTheme === 'monochrome'
              ? 'bg-slate-100 border-slate-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <TSSLogo
            variant={selectedVariant}
            theme={selectedTheme}
            size={selectedSize}
            showTagline={showTagline}
            showBangla={showBangla}
          />
        </div>
      </div>

      {/* 7. Reports & A4 Print Branding Standard */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ৬. রিপোর্ট ও A4 প্রিন্ট ব্র্যান্ডিং কাঠামো (Report & Print Standard)
            </h3>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
            TSSReportHeader
          </span>
        </div>

        <p className="text-xs text-slate-600 font-body">
          ভবিষ্যতের সকল রিপোর্ট ও A4 প্রিন্ট ডকুমেন্টে সফটওয়্যার ব্র্যান্ড (TSS) এবং সমিতি/প্রতিষ্ঠানের নিজস্ব নাম সুনির্দিষ্টভাবে আলাদা থাকবে।
        </p>

        {/* Live Sample Report Header Frame */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <TSSReportHeader
            organization={currentOrg}
            reportTitle="মাসিক সাধারণ সঞ্চয় ও আর্থিক হিসাব বিবরণী (নমুনা প্রিন্ট লেআউট)"
            reportSubtitle="শরিয়াহ নীতিমালা অনুযায়ী অডিটকৃত হিসাব বিবরণী"
            reportCode="RPT-TSS-2026-09"
            dateRange="০১ সেপ্টেম্বর ২০২৬ হতে ৩০ সেপ্টেম্বর ২০২৬"
          />
          
          <div className="my-6 p-4 bg-white border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-400 font-body">
            [রিপোর্ট বডি ও আর্থিক ডেটা কনটেন্ট এরিয়া — Phase 5 ফিন্যান্স ইঞ্জিনের আওতায় পরবর্তীতে বাস্তবায়িত হবে]
          </div>

          <TSSReportFooter />
        </div>
      </div>

      {/* 8. Brand Compliance & Safety Guardrails */}
      <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-amber-900 font-heading">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <h3 className="text-base font-bold">
            ৭. ব্র্যান্ড নিরাপত্তা ও ব্যবহারবিধি (Brand Safety Rules)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-amber-950 font-body">
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 font-semibold">কখনো শুধু "Tijarah" একা ব্যবহার নয়:</strong>
              সফটওয়্যারের অফিসিয়াল ব্র্যান্ড সর্বদাই <strong>TSS</strong> (Tijarah Samity Software)।
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 font-semibold">ক্লিয়ার স্পেস ও অনুপাত সুরক্ষা:</strong>
              লোগো কখনো স্ট্রেচ বা ডিসটর্ট করা যাবে না। কমপক্ষে লোগোর উচ্চতার ২০% ক্লিয়ার স্পেস রাখতে হবে।
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 font-semibold">নিষিদ্ধ ধর্মীয় ফান্ড নামমুক্ত:</strong>
              ব্র্যান্ডিং ও ডিফল্ট সিডে কোনো হার্ডকোডেড Zakat/Waqf/Sadaqa ফান্ড টার্ম তৈরি করা হবে না।
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 font-semibold">মাল্টি-টেন্যান্ট আইসোলেশন:</strong>
              ডেমো প্রতিষ্ঠানের নাম যেমন "খুরুশকুল ওলামা সমিতি" কখনো সফটওয়্যারের নিজস্ব নাম নয়, এটি কেবল নমুনা ক্লায়েন্ট।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
