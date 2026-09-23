import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Ruler, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  Copy, 
  Check, 
  Layers, 
  Square,
  Activity,
  Award
} from 'lucide-react';
import { TSSLogo } from '../branding';

export const DesignSystemSpecimen: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [testNumber, setTestNumber] = useState<number>(1250000);
  const [inputVal, setInputVal] = useState<string>('1250000');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const toBengaliNumber = (input: number | string): string => {
    const bengaliDigits: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯', '.': '.'
    };
    return input.toString().split('').map(c => bengaliDigits[c] || c).join('');
  };

  const formatWithCommas = (num: number): string => {
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    const numStr = absNum.toString();
    const parts = numStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    if (integerPart.length > 3) {
      const lastThree = integerPart.substring(integerPart.length - 3);
      const remaining = integerPart.substring(0, integerPart.length - 3);
      const regex = /(\d+?)(?=(\d{2})+$)/g;
      const formattedRemaining = remaining.replace(regex, '$1,');
      integerPart = `${formattedRemaining},${lastThree}`;
    }

    const full = `${isNegative ? '-' : ''}${integerPart}${decimalPart}`;
    return toBengaliNumber(full);
  };

  const formatCurrency = (amount: number, showDecimal = false): string => {
    const formatted = formatWithCommas(amount);
    return `৳ ${formatted}${showDecimal ? '.০০' : ''}`;
  };

  const formatCompact = (amount: number): string => {
    const abs = Math.abs(amount);
    if (abs >= 10000000) {
      return `৳ ${toBengaliNumber((abs / 10000000).toFixed(2))} কোটি`;
    } else if (abs >= 100000) {
      return `৳ ${toBengaliNumber((abs / 100000).toFixed(2))} লক্ষ`;
    } else if (abs >= 1000) {
      return `৳ ${toBengaliNumber((abs / 1000).toFixed(1))} হাজার`;
    }
    return formatCurrency(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    const parsed = parseFloat(val.replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed)) {
      setTestNumber(parsed);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                PROMPT 1.2 — LOCKED SPECIFICATION
              </span>
              <span className="text-xs text-slate-500 font-medium">Design System & Typography</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1 font-heading">
              গ্লোবাল ডিজাইন সিস্টেম ও বাংলা টাইপোগ্রাফি স্পেসিমেন
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              WCAG AA অনুসারী
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              শরিয়াহ-বান্ধব ও মার্জিত
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-body">
          তিজারাহ সমিতি সফটওয়্যারের ডিজাইন দর্শন: <strong>মার্জিত, পরিষ্কার, আধুনিক, পেশাদার, সহজবোধ্য এবং বাংলা-কেন্দ্রিক</strong>।
          অতিরিক্ত আলঙ্কারিক ইসলামি প্যাটার্ন বা কৃত্রিম রঙ বাদ দিয়ে স্বচ্ছ ও আন্তর্জাতিক মানের ফিনটেক মানদণ্ডে নির্মিত।
        </p>
      </div>

      {/* 1. Typography Hierarchy */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Type className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-slate-900 font-heading">
            ১. সেন্ট্রাল বাংলা টাইপোগ্রাফি ম্যাট্রিক্স (Typography Matrix)
          </h3>
        </div>

        {/* 3 Font Family Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">হেডিংস ও শিরোনাম</span>
              <span className="text-[11px] font-mono bg-emerald-200/60 text-emerald-900 px-1.5 py-0.5 rounded">Hind Siliguri</span>
            </div>
            <h4 className="text-lg font-bold text-emerald-950 font-heading mb-1">
              ইসলামি সমবায় ব্যবস্থাপনা
            </h4>
            <p className="text-xs text-slate-600 font-body">
              ব্যবহার: অ্যাপ বার, পেজ টাইটেল, সেকশন হেডার, মডাল টাইটেল।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">সংখ্যা, টাকা ও বাটন</span>
              <span className="text-[11px] font-mono bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded">Baloo Da 2</span>
            </div>
            <h4 className="text-2xl font-bold text-amber-950 font-numeric mb-1">
              ৳ ১,২৫,০০,০০০.০০
            </h4>
            <p className="text-xs text-slate-600 font-body">
              ব্যবহার: টাকার অংক, ব্যালেন্স, শতাংশ (১২.৫%), বাটন টেক্সট, কাউন্টার।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">বডি টেক্সট ও বিবরণী</span>
              <span className="text-[11px] font-mono bg-blue-200/60 text-blue-900 px-1.5 py-0.5 rounded">Tiro Bangla</span>
            </div>
            <p className="text-sm text-slate-800 font-body leading-relaxed mb-1">
              হালাল ব্যবসায়িক লেনদেন ও পারস্পরিক কল্যাণে সমিতি পরিচালনা।
            </p>
            <p className="text-xs text-slate-600 font-body">
              ব্যবহার: সাধারণ বিবরণ, ফর্মের ইনপুট লেবেল, অডিট নোট ও নির্দেশনা।
            </p>
          </div>
        </div>

        {/* Detailed Typography Scale Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">স্টাইল নাম</th>
                <th className="p-3">ফন্ট ফ্যামিলি</th>
                <th className="p-3">সাইজ / ওয়েট</th>
                <th className="p-3">লাইভ স্পেসিমেন</th>
                <th className="p-3">ব্যবহারের ক্ষেত্র</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-mono font-semibold text-emerald-800">displayLarge</td>
                <td className="p-3 font-medium">Hind Siliguri</td>
                <td className="p-3 text-slate-500">32sp / Bold</td>
                <td className="p-3 font-heading text-2xl font-bold text-slate-900">তিজারাহ সমিতি সফটওয়্যার</td>
                <td className="p-3 text-slate-600">হিরো ব্যানার, অ্যাপ স্বাগত স্ক্রিন</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-semibold text-emerald-800">headlineLarge</td>
                <td className="p-3 font-medium">Hind Siliguri</td>
                <td className="p-3 text-slate-500">22sp / Bold</td>
                <td className="p-3 font-heading text-lg font-bold text-slate-900">সদস্য ও সঞ্চয় হিসাব সারসংক্ষেপ</td>
                <td className="p-3 text-slate-600">পেজ বা মডিউলের প্রধান শিরোনাম</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-semibold text-emerald-800">titleLarge</td>
                <td className="p-3 font-medium">Hind Siliguri</td>
                <td className="p-3 text-slate-500">17sp / SemiBold</td>
                <td className="p-3 font-heading text-base font-semibold text-slate-900">মাসিক সঞ্চয় কিস্তি বিবরণী</td>
                <td className="p-3 text-slate-600">কার্ড শিরোনাম, টেবিল কলাম হেডার</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-semibold text-amber-800">currencyHero</td>
                <td className="p-3 font-medium">Baloo Da 2</td>
                <td className="p-3 text-slate-500">32sp / ExtraBold</td>
                <td className="p-3 font-numeric text-2xl font-extrabold text-emerald-800">৳ ১,২৫,০০,০০০</td>
                <td className="p-3 text-slate-600">প্রধান ব্যালেন্স কার্ড, মোট তহবিল</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-semibold text-amber-800">currencyMedium</td>
                <td className="p-3 font-medium">Baloo Da 2</td>
                <td className="p-3 text-slate-500">18sp / Bold</td>
                <td className="p-3 font-numeric text-base font-bold text-slate-800">৳ ২৫,৫০০.০০</td>
                <td className="p-3 text-slate-600">ট্রানজেকশন তালিকা, কিস্তির পরিমাণ</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-semibold text-blue-800">bodyLarge</td>
                <td className="p-3 font-medium">Tiro Bangla</td>
                <td className="p-3 text-slate-500">16sp / Regular</td>
                <td className="p-3 font-body text-sm text-slate-700">সকল লেনদেন শরিয়াহ বোর্ডের অনুমোদন সাপেক্ষে সম্পন্ন হয়।</td>
                <td className="p-3 text-slate-600">প্রধান অনুচ্ছেদ ও পলিসি টেক্সট</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-semibold text-slate-700">voucherCode</td>
                <td className="p-3 font-medium">JetBrains Mono</td>
                <td className="p-3 text-slate-500">13sp / SemiBold</td>
                <td className="p-3 font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded inline-block">VR-2026-0841-ALF</td>
                <td className="p-3 text-slate-600">ভাউচার কোড, ক্রিপ্টো অডিট হ্যাশ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Color System & Semantic Tokens */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ২. কালার সিস্টেম ও সেমান্টিক টোকেন (Color Palette)
            </h3>
          </div>
          <span className="text-xs text-slate-500">যেকোনো রঙে ক্লিক করে হেক্স কোড কপি করুন</span>
        </div>

        {/* Brand Colors Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">ব্র্যান্ড ও অ্যাকসেন্ট রং (Brand Colors)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'Primary (পান্না সবুজ)', hex: '#0F5132', token: 'AppColors.primary', bg: 'bg-[#0F5132]', text: 'text-white' },
              { name: 'Primary Dark', hex: '#0A3622', token: 'AppColors.primaryDark', bg: 'bg-[#0A3622]', text: 'text-white' },
              { name: 'Primary Light', hex: '#198754', token: 'AppColors.primaryLight', bg: 'bg-[#198754]', text: 'text-white' },
              { name: 'Primary Container', hex: '#D1E7DD', token: 'AppColors.primaryContainer', bg: 'bg-[#D1E7DD]', text: 'text-emerald-950' },
              { name: 'Secondary (সোনালী)', hex: '#B45309', token: 'AppColors.secondary', bg: 'bg-[#B45309]', text: 'text-white' },
              { name: 'Secondary Container', hex: '#FEF3C7', token: 'AppColors.secondaryContainer', bg: 'bg-[#FEF3C7]', text: 'text-amber-950' },
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => copyToClipboard(c.hex)}
                className="group p-3 rounded-xl border border-slate-200 text-left transition hover:shadow-md hover:border-emerald-500 flex flex-col justify-between h-28"
              >
                <div className={`w-full h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                  {copiedHex === c.hex ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-80 transition text-white" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight truncate">{c.name}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>{c.hex}</span>
                    <span className="text-[9px] text-emerald-700">{copiedHex === c.hex ? 'Copied!' : ''}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Semantic Status Colors */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">স্ট্যাটাস ও অবস্থা নির্দেশক (Semantic Status)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Success (অনুমোদিত)', hex: '#198754', bg: 'bg-[#198754]', desc: 'সফল ভাউচার, সক্রিয় সদস্য' },
              { name: 'Warning (সতর্কতা)', hex: '#D97706', bg: 'bg-[#D97706]', desc: 'পেন্ডিং ভাউচার, বকেয়া কিস্তি' },
              { name: 'Error (ত্রুটি)', hex: '#DC3545', bg: 'bg-[#DC3545]', desc: 'বাতিলকৃত লেনদেন, অশরিয়াহ' },
              { name: 'Info (তথ্য)', hex: '#0284C7', bg: 'bg-[#0284C7]', desc: 'সাধারণ তথ্য, নোটিফিকেশন' },
            ].map((s) => (
              <button
                key={s.hex}
                onClick={() => copyToClipboard(s.hex)}
                className="p-3 rounded-xl border border-slate-200 text-left hover:border-slate-400 transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full ${s.bg}`}></div>
                  <span className="text-xs font-bold text-slate-800">{s.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-body">{s.desc}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">{s.hex}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Society Funds & Informational Shariah Workflow UI Indicators */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              তিজারাহ ফান্ড সেমান্টিক টোকেন (Generic Business & Society Funds)
            </h4>
            <p className="text-[11px] text-slate-500 font-body mb-2.5">
              তিজারাহর স্ট্যান্ডার্ড ফান্ড কাঠামো: অ্যাডমিনিস্ট্রেটিভ, জেনারেল, শেয়ার, প্রজেক্ট ও কাস্টম কনফিগারযোগ্য তহবিল।
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-900 border border-sky-200 text-xs font-semibold font-numeric">
                <Layers className="w-3.5 h-3.5 text-sky-700" />
                Administrative Fund — প্রশাসনিক তহবিল
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold font-numeric">
                <Coins className="w-3.5 h-3.5 text-emerald-700" />
                General Fund — সাধারণ তহবিল
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold font-numeric">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                Share Fund — শেয়ার তহবিল
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold font-numeric">
                <Activity className="w-3.5 h-3.5 text-amber-700" />
                Project Fund — প্রকল্প তহবিল
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-semibold font-numeric">
                <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
                Custom Fund — কনফিগারযোগ্য তহবিল
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              তথ্যবহুল শরিয়াহ ওয়ার্কফ্লো নির্দেশক (Informational UI Indicators)
            </h4>
            <p className="text-[11px] text-slate-500 font-body mb-2.5">
              * সফটওয়্যার কোনো স্বয়ংক্রিয় ফতোয়া বা হালাল/হারাম ঘোষণা দেয় না; এটি শুধুমাত্র প্রাতিষ্ঠানিক রিভিউ ও ওয়ার্কফ্লো নির্দেশক।
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold font-numeric">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                শরিয়াহ নীতিমালা অনুসরণকারী Workflow
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold font-numeric">
                <Activity className="w-3.5 h-3.5 text-amber-800" />
                শরিয়াহ নীতিমালা অনুযায়ী পর্যালোচনাধীন
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-100 text-orange-900 border border-orange-300 text-xs font-semibold font-numeric">
                <Sparkles className="w-3.5 h-3.5 text-orange-800" />
                শরিয়াহ Review Required
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Bengali Number & Currency Formatter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ৩. বাংলা সংখ্যা ও মুদ্রা রূপান্তরক (Number & Currency Formatter)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            Live Interactive
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-3">
            <label className="block text-xs font-bold text-slate-700 font-body">
              ইংরেজি সংখ্যা দিয়ে পরীক্ষা করুন (Type any number):
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                placeholder="যেমন: 1250000"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[500, 25000, 125000, 2500000, 15000000].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setInputVal(val.toString());
                    setTestNumber(val);
                  }}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-mono text-slate-700"
                >
                  {val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">পূর্ণাঙ্গ মুদ্রা ফরম্যাট (Full Currency)</span>
              <div className="text-2xl font-bold text-emerald-950 font-numeric mt-1">
                {formatCurrency(testNumber)}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                CurrencyFormatter.format({testNumber})
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">দশমিকসহ (With Decimals)</span>
              <div className="text-2xl font-bold text-amber-950 font-numeric mt-1">
                {formatCurrency(testNumber, true)}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                showDecimal: true
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">সংক্ষিপ্ত ফরম্যাট (Compact Lakh/Crore)</span>
              <div className="text-xl font-bold text-blue-950 font-numeric mt-1">
                {formatCompact(testNumber)}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                CurrencyFormatter.formatCompact({testNumber})
              </div>
            </div>

            <div className="p-3.5 bg-slate-100/80 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-700 block">বাংলা সংখ্যা রূপান্তর (Digits Only)</span>
              <div className="text-xl font-bold text-slate-900 font-numeric mt-1">
                {toBengaliNumber(inputVal)}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                BengaliNumberFormatter.toBengali()
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Spacing, Radius & Elevation Tokens */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Ruler className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-slate-900 font-heading">
            ৪. স্পেসিং, বর্ডার রেডিয়াস ও শ্যাডো টোকেন (Tokens)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spacing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">৪/৮ পিক্সেল গ্রিড স্পেসিং</h4>
            <div className="space-y-2 text-xs">
              {[
                { name: 'xs (4dp)', val: 'w-1 h-4', desc: 'আইকন ও টেক্সট ফাঁকা' },
                { name: 'sm (8dp)', val: 'w-2 h-4', desc: 'ব্যাজ ও চিপ স্পেস' },
                { name: 'md (12dp)', val: 'w-3 h-4', desc: 'ইনপুট লেবেল গ্যাপ' },
                { name: 'lg (16dp)', val: 'w-4 h-4', desc: 'কার্ড স্ট্যান্ডার্ড প্যাডিং' },
                { name: 'xxl (24dp)', val: 'w-6 h-4', desc: 'সেকশন ডিভাইডার গ্যাপ' },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-600 rounded-xs"></span>
                    <span className="font-mono font-semibold text-slate-800">{s.name}</span>
                  </div>
                  <span className="text-slate-500 text-[11px] font-body">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Radius */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">বর্ডার রেডিয়াস (Anti-Slop Rule)</h4>
            <div className="space-y-2 text-xs">
              {[
                { name: 'AppRadius.sm (6dp)', radius: 'rounded-md', desc: 'ব্যাজ, ছোট চিপ' },
                { name: 'AppRadius.md (8dp)', radius: 'rounded-lg', desc: 'বাটন, টেক্সট ইনপুট' },
                { name: 'AppRadius.lg (12dp)', radius: 'rounded-xl', desc: 'কার্ড, প্রধান প্যানেল' },
                { name: 'AppRadius.full (999dp)', radius: 'rounded-full', desc: 'পিল বাটন ও অ্যাভাটার' },
              ].map((r) => (
                <div key={r.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 bg-emerald-800 ${r.radius}`}></div>
                    <span className="font-mono font-semibold text-slate-800">{r.name}</span>
                  </div>
                  <span className="text-slate-500 text-[11px] font-body">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Component Heights & Touch Target */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">মাত্রা ও টাচ টার্গেট (Dimensions)</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                <span className="font-bold text-emerald-900 block">সর্বনিম্ন টাচ টার্গেট: ৪৮x৪৮ dp</span>
                <span className="text-[11px] text-slate-600 font-body">মোবাইল আঙুলের টাচ নির্ভুলতার জন্য WCAG নিয়ম।</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block">ইনপুট ফিল্ড উচ্চতা: ৪৮ dp</span>
                <span className="text-[11px] text-slate-600 font-body">আরামদায়ক টাইপিং ও প্যাডিং।</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block">অ্যাপ বার উচ্চতা: ৫৬ dp</span>
                <span className="text-[11px] text-slate-600 font-body">স্ট্যান্ডার্ড মেটেরিয়াল ৩ হেডার সাইজ।</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Shared UI Components Preview Gallery */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ৫. আপডেটেড শেয়ার্ড উইজেট গ্যালারি (Shared Component Gallery)
            </h3>
          </div>
          <span className="text-xs text-slate-500">ডার্ট ফাইলের সাথে সম্পূর্ণ সিঙ্কড</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buttons showcase */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase">বাটন ভ্যারিয়েন্ট (AppButton)</h4>
            <div className="space-y-2">
              <button className="w-full h-12 bg-[#0F5132] text-white rounded-lg font-numeric font-semibold text-sm hover:bg-[#0A3622] transition flex items-center justify-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>প্রাইমারি বাটন — সঞ্চয় জমা অনুমোদন (PrimaryButton)</span>
              </button>
              <button className="w-full h-12 bg-transparent text-[#0F5132] border-1.5 border-[#0F5132] rounded-lg font-numeric font-semibold text-sm hover:bg-emerald-50 transition flex items-center justify-center gap-2">
                <span>সেকেন্ডারি বাটন — বিবরণ দেখুন (SecondaryButton)</span>
              </button>
              <button className="w-full h-12 bg-[#B45309] text-white rounded-lg font-numeric font-semibold text-sm hover:bg-[#78350F] transition flex items-center justify-center gap-2 shadow-xs">
                <Coins className="w-4 h-4" />
                <span>অ্যাম্বার বাটন — বিশেষ হালাল ইনভেস্টমেন্ট (AmberButton)</span>
              </button>
            </div>
          </div>

          {/* Input & Badges Showcase */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase">ফর্ম ইনপুট ও ব্যাজ (TextField & Badges)</h4>
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 font-body mb-1">
                  সদস্যের নাম (Tiro Bangla Label)
                </label>
                <input
                  type="text"
                  readOnly
                  value="মুহাম্মদ আব্দুল্লাহ"
                  className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-body"
                />
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold font-numeric">
                  সক্রিয় সদস্য (Active)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-semibold font-numeric">
                  বকেয়া কিস্তি (Due)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-xs font-semibold font-numeric">
                  স্থগিত (Suspended)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Official TSS Brand System & Monogram */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              ৬. অফিশিয়াল ব্র্যান্ড সিস্টেম ও লোগো মনোগ্রাম (Official TSS Brand System)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-numeric">
            BRAND: TSS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">ফুল লোগো (Full)</span>
            <TSSLogo variant="full" theme="light" size="md" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">ডার্ক থিম (Dark Full)</span>
            <TSSLogo variant="full" theme="dark" size="md" />
          </div>

          <div className="p-4 rounded-xl bg-[#0F5132] border border-emerald-800 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-[10px] font-bold text-emerald-200 uppercase">এমারেল্ড কম্প্যাক্ট (Emerald)</span>
            <TSSLogo variant="compact" theme="emerald" size="md" showBangla={true} />
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-[10px] font-bold text-amber-800 uppercase">অ্যাপ আইকন (App Icon 48dp)</span>
            <TSSLogo variant="app-icon" theme="light" size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
