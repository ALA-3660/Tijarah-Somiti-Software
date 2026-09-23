import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Layers, 
  Scale, 
  Wifi, 
  Battery, 
  Signal, 
  ChevronDown,
  Info,
  Sparkles,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { EnvironmentType, OrganizationContext, UiSimulatorState } from '../types';
import { TSSLogo } from '../branding';

interface AndroidDeviceFrameProps {
  environment: EnvironmentType;
  onEnvironmentChange: (env: EnvironmentType) => void;
  activeOrg: OrganizationContext;
  allOrgs: OrganizationContext[];
  onOrgChange: (org: OrganizationContext) => void;
  uiState: UiSimulatorState;
  onUiStateChange: (state: UiSimulatorState) => void;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  environment,
  onEnvironmentChange,
  activeOrg,
  allOrgs,
  onOrgChange,
  uiState,
  onUiStateChange,
}) => {
  const [showOrgDropdown, setShowOrgDropdown] = React.useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* Device Top Label */}
      <div className="flex items-center justify-between w-full max-w-[380px] mb-3 px-1 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Android Mobile Device Simulator
        </span>
        <span className="font-mono text-[11px]">390 × 844 dp</span>
      </div>

      {/* Android Device Outer Chassis */}
      <div className="relative w-[380px] h-[780px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/60 ring-1 ring-black/40 flex flex-col overflow-hidden">
        
        {/* Device Punch Hole Camera */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-30 border border-slate-800"></div>

        {/* Device Screen Area */}
        <div className="relative w-full h-full bg-[#F8F9FA] rounded-[34px] overflow-hidden flex flex-col text-slate-800 select-none">
          
          {/* Android Status Bar */}
          <div className="h-9 px-6 bg-[#0F5132] text-white flex items-center justify-between text-[11px] font-medium z-20 font-numeric">
            <span>১০:৩০ পূর্বাহ্ন</span>
            <div className="flex items-center gap-1.5 text-white/90">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Flutter AppBar: TSS Brand Header */}
          <div className="bg-[#0F5132] text-white px-4 pt-2.5 pb-3.5 shadow-md z-10">
            <div className="flex items-start justify-between">
              <TSSLogo variant="compact" theme="emerald" size="sm" showBangla={true} />

              {/* Environment Chip */}
              <button
                onClick={() => {
                  const next: Record<EnvironmentType, EnvironmentType> = {
                    development: 'staging',
                    staging: 'production',
                    production: 'development',
                  };
                  onEnvironmentChange(next[environment]);
                }}
                title="Click to toggle environment"
                className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-colors font-mono"
              >
                {environment === 'development' ? 'DEV' : environment === 'staging' ? 'STG' : 'PROD'}
              </button>
            </div>
          </div>

          {/* Screen Body Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-body">
            
            {/* Condition: Production Safety Block when Demo Org is Selected */}
            {environment === 'production' && activeOrg.isDemo && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
                <div className="flex items-center gap-2 font-bold font-heading text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  প্রোডাকশন সুরক্ষা লক (Demo Org Blocked)
                </div>
                <p className="text-[11px] text-rose-700 mt-1 font-body">
                  নিরাপত্তা নীতি অনুযায়ী, <strong>খুরুশকুল ওলামা সমিতি (DEMO)</strong> প্রোডাকশন পরিবেশে সক্রিয় করা যাবে না। নিচে অন্য সমিতি নির্বাচন করুন বা Dev মোডে ফিরুন।
                </p>
              </div>
            )}

            {/* Condition 1: Loading State */}
            {uiState === 'loading' && (
              <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h4 className="text-sm font-semibold text-slate-800 font-heading">লোড হচ্ছে...</h4>
                <p className="text-xs text-slate-500 mt-1 font-body">
                  সমিতির তথ্য ও কেন্দ্রীয় কনফিগারেশন সিঙ্ক করা হচ্ছে।
                </p>
                <button
                  onClick={() => onUiStateChange('success')}
                  className="mt-5 text-xs text-emerald-700 underline font-medium hover:text-emerald-800 font-numeric"
                >
                  স্বাভাবিক অবস্থায় ফিরুন
                </button>
              </div>
            )}

            {/* Condition 2: Empty State */}
            {uiState === 'empty' && (
              <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 mb-3 border border-emerald-200">
                  <Layers className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800 font-heading">কোনো তথ্য পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[220px] font-body">
                  প্রম্পট ১.২ পর্যন্ত শুধুমাত্র ডিজাইন সিস্টেম ও টাইপোগ্রাফি আর্কিটেকচার বাস্তবায়িত।
                </p>
                <button
                  onClick={() => onUiStateChange('success')}
                  className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-emerald-800 transition font-numeric"
                >
                  অ্যাপ্লিকেশন শেল দেখুন
                </button>
              </div>
            )}

            {/* Condition 3: Error State */}
            {uiState === 'error' && (
              <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-3 border border-rose-200">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800 font-heading">সংযোগের সমস্যা দেখা দিয়েছে</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[240px] font-body">
                  সার্ভারে সংযোগ পাওয়া যায়নি। ApiClient টাইমআউট অথবা নেটওয়ার্ক ফেইলিউর শনাক্ত হয়েছে।
                </p>
                <button
                  onClick={() => onUiStateChange('success')}
                  className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition font-numeric"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  পুনরায় চেষ্টা করুন (Retry)
                </button>
              </div>
            )}

            {/* Condition 4: Submitting State */}
            {uiState === 'submitting' && (
              <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h4 className="text-sm font-semibold text-slate-800 font-heading">তথ্য প্রক্রিয়াকরণ হচ্ছে...</h4>
                <p className="text-xs text-slate-500 mt-1 font-body">
                  সংবেদনশীল রিকোয়েস্ট নিরাপদ টোকেনসহ প্রসেস হচ্ছে।
                </p>
                <button
                  onClick={() => onUiStateChange('success')}
                  className="mt-4 text-xs text-emerald-700 underline font-medium font-numeric"
                >
                  রিসেট করুন
                </button>
              </div>
            )}

            {/* Condition 5: Normal Shell View (Success / Initial) */}
            {(uiState === 'success' || uiState === 'initial') && (
              <>
                {/* Multi-Tenant / Demo Organization Header Card */}
                <div className={`rounded-xl p-3.5 shadow-sm border ${
                  activeOrg.isDemo 
                    ? 'bg-amber-50/40 border-amber-300' 
                    : 'bg-white border-emerald-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        activeOrg.isDemo ? 'bg-amber-700 text-white' : 'bg-emerald-800 text-white'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block font-numeric">
                            {activeOrg.isDemo ? 'ডেমো অর্গানাইজেশন (UI Testing)' : 'সক্রিয় সমিতি কনটেক্সট (Tenant)'}
                          </span>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                            className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-emerald-800 text-left transition font-heading"
                          >
                            <span>{activeOrg.name}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          </button>

                          {/* Dropdown for Tenant Switching */}
                          {showOrgDropdown && (
                            <div className="absolute top-6 left-0 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-30">
                              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase font-numeric">
                                সমিতি পরিবর্তন করুন (Data Isolation)
                              </div>
                              {allOrgs.map((org) => (
                                <button
                                  key={org.id}
                                  onClick={() => {
                                    onOrgChange(org);
                                    setShowOrgDropdown(false);
                                  }}
                                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 ${
                                    org.id === activeOrg.id ? 'font-bold text-emerald-800 bg-emerald-50/60' : 'text-slate-700'
                                  }`}
                                >
                                  <div>
                                    <div className="font-heading flex items-center gap-1.5">
                                      <span>{org.name}</span>
                                    </div>
                                    {org.isDemo && (
                                      <span className="text-[9px] text-amber-700 font-semibold font-mono uppercase block">
                                        [DEMO ORGANIZATION]
                                      </span>
                                    )}
                                  </div>
                                  {org.id === activeOrg.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {activeOrg.isDemo ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300 font-mono tracking-wide uppercase">
                        DEMO ORGANIZATION
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 font-numeric">
                        সক্রিয়
                      </span>
                    )}
                  </div>

                  {activeOrg.isDemo ? (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/80 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-amber-900 font-numeric font-medium">
                        <span>স্ট্যাটাস: <strong className="text-amber-800 font-bold">DEMO / SAMPLE DATA</strong></span>
                        <span className="font-mono text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                          {activeOrg.code}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-tight font-body">
                        উদ্দেশ্য: শুধুমাত্র UI Preview, Typography, Header ও App Shell টেস্টিং। কোনো বাস্তব আর্থিক/সদস্য ডেটা সংরক্ষিত নয়।
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-body">
                      <span>রেজিস্ট্রেশন: {activeOrg.regNumber}</span>
                      <span className="font-mono text-emerald-800 font-semibold">{activeOrg.code}</span>
                    </div>
                  )}
                </div>

                {/* Prompt 1.2 Design System Status Card */}
                <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <h3 className="text-xs font-bold text-slate-800 font-heading">টাইপোগ্রাফি ও ডিজাইন সিস্টেম</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-numeric">
                      প্রম্পট ১.২
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-body">হেডিংস ফন্ট</span>
                      <span className="font-semibold text-emerald-800 font-heading">Hind Siliguri</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-body">সংখ্যা ও বাটন ফন্ট</span>
                      <span className="font-semibold text-amber-800 font-numeric">Baloo Da 2</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-body">বডি টেক্সট ফন্ট</span>
                      <span className="font-semibold text-slate-700 font-body">Tiro Bangla</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-body">ব্র্যান্ড কালার</span>
                      <span className="font-mono text-xs text-emerald-700 font-semibold">#0F5132 (পান্না সবুজ)</span>
                    </div>
                  </div>
                </div>

                {/* Live Bengali Currency Typography Preview (Explicit Demo Value) */}
                <div className="bg-emerald-900 text-white rounded-xl p-3.5 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-emerald-200">
                    <span className="font-body">টাইপোগ্রাফি স্যাম্পল — কেন্দ্রীয় তহবিল ব্যালেন্স</span>
                    <span className="bg-emerald-800/90 text-amber-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-emerald-700">
                      DEMO VALUE
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-numeric mt-1 tracking-tight text-white">
                    ৳ ১,২৫,০০,০০০
                  </div>
                  <div className="mt-2 pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[10px] text-emerald-200/90 font-numeric">
                    <span>সংক্ষিপ্ত রূপ: ৳ ১.২৫ কোটি</span>
                    <span className="text-amber-300 font-semibold">UI টেস্ট স্যাম্পল</span>
                  </div>
                  <div className="mt-1 text-[9px] text-emerald-300/70 font-body">
                    * টাইপোগ্রাফি ও সংখ্যা ফরম্যাটিং পরীক্ষার জন্য নমুনা মান (কোনো বাস্তব ব্যালেন্স নয়)।
                  </div>
                </div>

                {/* Islamic Accounting Rule 21: Head ≠ Fund ≠ Account */}
                <div className="bg-white rounded-xl p-3.5 shadow-sm border border-amber-200/80">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Scale className="w-4 h-4 text-amber-700" />
                    <h3 className="text-xs font-bold text-slate-800 font-heading">ইসলামি আর্থিক নীতি (রুল ২১)</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2.5 font-body">
                    ইসলামি সমবায় পরিচালনায় ৩টি স্বাধীন মাত্রা সুসংহত:
                  </p>

                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-900 font-heading">১. খাত (Head)</span>
                        <span className="text-[9px] bg-emerald-200/60 text-emerald-900 px-1 rounded font-mono">উদ্দেশ্য</span>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-body">
                        টাকা কেন এসেছে বা খরচ হয়েছে (যেমন: সদস্য ফি, অফিস ভাড়া, অনুদান)।
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-900 font-heading">২. তহবিল (Fund)</span>
                        <span className="text-[9px] bg-amber-200/60 text-amber-900 px-1 rounded font-mono">বরাদ্দ</span>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-body">
                        টাকা কোন উদ্দেশ্য বা ফান্ডের অন্তর্ভুক্ত (যেমন: প্রশাসনিক, সাধারণ, শেয়ার, প্রকল্প তহবিল)।
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-900 font-heading">৩. হিসাব (Account)</span>
                        <span className="text-[9px] bg-blue-200/60 text-blue-900 px-1 rounded font-mono">অবস্থান</span>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-body">
                        টাকা বর্তমানে কোথায় জমা আছে (যেমন: ক্যাশ বাক্স, ইসলামী ব্যাংক সঞ্চয়ী হিসাব)।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Development Rules Reminder Notice */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[10px] flex items-start gap-2 leading-relaxed font-body">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">কঠোর নির্দেশনা মানা হয়েছে:</span> ফুল সাইডবার বা মেম্বার মডিউলের কোনো ফেক ডেটা যোগ করা হয়নি। পরবর্তী প্রম্পট অনুযায়ী ধাপে ধাপে বিজনেস মডিউলসমূহ যুক্ত হবে।
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Android Bottom Navigation Gesture Bar */}
          <div className="h-6 bg-[#F8F9FA] flex items-center justify-center">
            <div className="w-28 h-1 bg-slate-400 rounded-full"></div>
          </div>

        </div>

      </div>

      {/* State Switcher Test Bar below the phone */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-[380px] bg-white p-2 rounded-xl shadow-sm border border-slate-200 font-numeric">
        <span className="text-[10px] font-bold text-slate-500 uppercase px-1">টেস্ট স্টেট:</span>
        {(['success', 'loading', 'empty', 'error', 'submitting'] as UiSimulatorState[]).map((state) => (
          <button
            key={state}
            onClick={() => onUiStateChange(state)}
            className={`px-2 py-1 rounded text-[10px] font-medium transition ${
              uiState === state
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {state === 'success' ? 'Normal' : state}
          </button>
        ))}
      </div>
    </div>
  );
};
