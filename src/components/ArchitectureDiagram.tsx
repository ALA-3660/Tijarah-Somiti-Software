import React from 'react';
import { Layers, ShieldCheck, Database, Server, Smartphone, ArrowDown, CheckCircle2 } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700" />
          ক্লিন লেয়ার্ড আর্কিটেকচার (Clean Layered Architecture)
        </h3>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          UI, Business Logic এবং Data Access একে অপরের সঙ্গে টাইটলি কাপলড না রেখে স্বতন্ত্র স্তরে ভাগ করা হয়েছে।
          এর ফলে ভবিষ্যতে কোনো নতুন মডিউল যোগ করতে বা ব্যাকএন্ড পরিবর্তন করতে কোড ভেঙে পড়বে না।
        </p>
      </div>

      {/* 4 Layers Visual Grid */}
      <div className="space-y-3">
        {/* Layer 1: Presentation Layer */}
        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">১</span>
              <h4 className="text-sm font-bold text-emerald-950">Presentation Layer (উপস্থাপনা স্তর)</h4>
            </div>
            <span className="text-[10px] font-mono font-semibold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded">
              lib/features/, lib/shared/
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-normal">
            UI Screen, Widgets, State Management এবং Navigation পরিচালনা করে। এখানে কোনো সরাসরি ডাটাবেজ কোয়েরি বা রিমোট API কল থাকে না।
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 bg-white rounded border border-emerald-200 font-mono text-emerald-800">ApplicationShellScreen</span>
            <span className="px-2 py-0.5 bg-white rounded border border-emerald-200 font-mono text-emerald-800">AppScaffold</span>
            <span className="px-2 py-0.5 bg-white rounded border border-emerald-200 font-mono text-emerald-800">PrimaryButton</span>
            <span className="px-2 py-0.5 bg-white rounded border border-emerald-200 font-mono text-emerald-800">AppLoading / AppError</span>
          </div>
        </div>

        <div className="flex justify-center -my-1 text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Layer 2: Domain Layer */}
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-800 text-white text-xs font-bold flex items-center justify-center">২</span>
              <h4 className="text-sm font-bold text-blue-950">Domain Layer (ব্যবসায়িক নিয়ম ও সত্তা)</h4>
            </div>
            <span className="text-[10px] font-mono font-semibold bg-blue-200/70 text-blue-900 px-2 py-0.5 rounded">
              lib/domain/ (Pure Dart)
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-normal">
            অ্যাপের কোর বিজনেস লজিক, রুলস ও এন্টিটি ধারণ করে। এটি সম্পূর্ণ ফ্রেমওয়ার্ক-স্বাধীন (কোনো Flutter বা HTTP লাইব্রেরির উপর নির্ভরশীল নয়)।
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 bg-white rounded border border-blue-200 font-mono text-blue-800">Organization (Entity)</span>
            <span className="px-2 py-0.5 bg-white rounded border border-blue-200 font-mono text-blue-800">FinancialDimension (Rule 21)</span>
            <span className="px-2 py-0.5 bg-white rounded border border-blue-200 font-mono text-blue-800">OrganizationRepository (Contract)</span>
            <span className="px-2 py-0.5 bg-white rounded border border-blue-200 font-mono text-blue-800">AuditMeta (Rule 22)</span>
          </div>
        </div>

        <div className="flex justify-center -my-1 text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Layer 3: Data Layer */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center">৩</span>
              <h4 className="text-sm font-bold text-amber-950">Data Layer (উপাত্ত সংরক্ষণ ও রিট্রিভাল)</h4>
            </div>
            <span className="text-[10px] font-mono font-semibold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded">
              lib/data/
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-normal">
            রিমোট Django API এবং লোকাল স্টোরেজ থেকে ডেটা সংগ্রহ করে। ডোমেইন রিপোজিটরির বাস্তবায়ন (Implementation) এখানে থাকে।
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 bg-white rounded border border-amber-200 font-mono text-amber-800">OrganizationModel (DTO)</span>
            <span className="px-2 py-0.5 bg-white rounded border border-amber-200 font-mono text-amber-800">OrganizationRemoteDataSource</span>
            <span className="px-2 py-0.5 bg-white rounded border border-amber-200 font-mono text-amber-800">OrganizationLocalDataSource</span>
            <span className="px-2 py-0.5 bg-white rounded border border-amber-200 font-mono text-amber-800">OrganizationRepositoryImpl</span>
          </div>
        </div>

        <div className="flex justify-center -my-1 text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Layer 4: Core Layer */}
        <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-800 text-white text-xs font-bold flex items-center justify-center">৪</span>
              <h4 className="text-sm font-bold text-purple-950">Core Layer (কেন্দ্রীয় ইউটিলিটি ও নিরাপত্তা)</h4>
            </div>
            <span className="text-[10px] font-mono font-semibold bg-purple-200/70 text-purple-900 px-2 py-0.5 rounded">
              lib/core/
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-normal">
            ক্রসবর্ডার নেটওয়ার্ক ক্লায়েন্ট, এক্সেপশন ও ফেইলিউর মডেল, সিকিউর স্টোরেজ ও টাইপ-সেফ Result মন্যাদ প্রদান করে।
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 bg-white rounded border border-purple-200 font-mono text-purple-800">ApiClient (X-Organization-Id)</span>
            <span className="px-2 py-0.5 bg-white rounded border border-purple-200 font-mono text-purple-800">Result&lt;T&gt; (Type-safe)</span>
            <span className="px-2 py-0.5 bg-white rounded border border-purple-200 font-mono text-purple-800">AppException & Failure</span>
            <span className="px-2 py-0.5 bg-white rounded border border-purple-200 font-mono text-purple-800">SecureStorageService</span>
          </div>
        </div>
      </div>

      {/* Future Full Stack Ecosystem Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
          <Server className="w-4 h-4" />
          ভবিষ্যতের ব্যাকএন্ড ইকোসিস্টেম (Future Django + PostgreSQL)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1">
              <Smartphone className="w-3.5 h-3.5" />
              Flutter Android App
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              স্বয়ংক্রিয়ভাবে হেডার পাঠায়:
              <br /><code className="text-emerald-400">X-Organization-Id</code>
              <br /><code className="text-emerald-400">Authorization: Bearer</code>
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
              <Server className="w-3.5 h-3.5" />
              Django REST API
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              TenantContextMiddleware এর মাধ্যমে প্রতিটি রিকোয়েস্টে সমিতি যাচাই এবং পারমিশন ফিল্টারিং করে।
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="flex items-center gap-2 font-bold text-blue-300 mb-1">
              <Database className="w-3.5 h-3.5" />
              PostgreSQL DB
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Row-Level Security (RLS) ও ফরেন কি এর মাধ্যমে এক সমিতির তথ্য অপর সমিতির সাথে মিশ্রণ সম্পূর্ণ রোধ করে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
