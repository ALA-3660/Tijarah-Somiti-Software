import React from 'react';
import { Scale, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export const FinancialRulesView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Rule 21 Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-amber-700" />
          <h3 className="text-base font-bold text-slate-800">
            রুল ২১: ইসলামি আর্থিক নীতি — ত্রি-মাত্রিক হিসাব ব্যবস্থা
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          ইসলামি মূল্যবোধ ও স্বচ্ছতার ভিত্তিতে সমিতির অর্থ ব্যবস্থাপনায় ৩টি উপাদানকে সম্পূর্ণ পৃথক ও স্বাধীন রাখা হয়েছে:
          <strong className="text-emerald-800 ml-1">Head ≠ Fund ≠ Account</strong>।
          ভবিষ্যতের প্রতিটি আয়-ব্যয় ট্রানজেকশনে এই তিনটি মাত্রা পূরণ করা বাধ্যতামূলক।
        </p>
      </div>

      {/* 3 Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dimension 1: Head */}
        <div className="p-4 rounded-xl bg-white border-2 border-emerald-500 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">মাত্রা ১</span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">উদ্দেশ্য / কারণ</span>
          </div>
          <h4 className="text-base font-bold text-slate-800 mb-1">খাত (Head)</h4>
          <p className="text-xs text-slate-600 mb-3 leading-normal">
            টাকা <span className="font-semibold text-emerald-800">কেন এসেছে বা কেন খরচ হয়েছে</span>। এটি আয়ের বা ব্যয়ের কারণ নির্দেশ করে।
          </p>
          <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-700 text-[11px] mb-1">উদাহরণসমূহ:</div>
            <div>• নতুন সদস্য ভর্তি ফি</div>
            <div>• সমিতি অফিস ভাড়া</div>
            <div>• বাৎসরিক মিটিং খরচ</div>
            <div>• কম্পিউটার ও প্রিন্টার ক্রয়</div>
          </div>
        </div>

        {/* Dimension 2: Fund */}
        <div className="p-4 rounded-xl bg-white border-2 border-amber-500 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">মাত্রা ২</span>
            <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">বরাদ্দ / তহবিল</span>
          </div>
          <h4 className="text-base font-bold text-slate-800 mb-1">তহবিল (Fund)</h4>
          <p className="text-xs text-slate-600 mb-3 leading-normal">
            টাকা <span className="font-semibold text-amber-800">কোন নীতি বা ফান্ডের অন্তর্ভুক্ত</span>। ফান্ডের অর্থ অন্য ফান্ডের সাথে মিশ্রণ নিষিদ্ধ।
          </p>
          <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-700 text-[11px] mb-1">উদাহরণসমূহ:</div>
            <div>• প্রশাসনিক তহবিল (Administrative Fund)</div>
            <div>• সাধারণ তহবিল (General Fund)</div>
            <div>• শেয়ার তহবিল (Share Fund)</div>
            <div>• প্রকল্প তহবিল (Project Fund)</div>
            <div>• কাস্টম কনফিগারযোগ্য তহবিল (Custom Fund)</div>
          </div>
        </div>

        {/* Dimension 3: Account */}
        <div className="p-4 rounded-xl bg-white border-2 border-blue-500 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">মাত্রা ৩</span>
            <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">বস্তুগত অবস্থান</span>
          </div>
          <h4 className="text-base font-bold text-slate-800 mb-1">হিসাব (Account)</h4>
          <p className="text-xs text-slate-600 mb-3 leading-normal">
            টাকা <span className="font-semibold text-blue-800">বাস্তবিকভাবে কোথায় রক্ষিত</span>। এটি ব্যাংকিং চ্যানেল বা ক্যাশ মাধ্যম নির্দেশ করে।
          </p>
          <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-700 text-[11px] mb-1">উদাহরণসমূহ:</div>
            <div>• ক্যাশ ইন হ্যান্ড (অফিস ভল্ট)</div>
            <div>• ইসলামী ব্যাংক মুদারাবা হিসাব</div>
            <div>• আল-আরাফাহ ইসলামী ব্যাংক হিসাব</div>
            <div>• বিকাশ বা নগদ মার্চেন্ট ওয়ালেট</div>
          </div>
        </div>
      </div>

      {/* Practical Transaction Demonstration Box */}
      <div className="p-4 rounded-xl bg-emerald-900 text-white shadow-md">
        <h4 className="text-sm font-bold text-emerald-200 mb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          বাস্তব লেনদেনের চিত্রায়ন (How a Transaction is Structured)
        </h4>
        <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
          সমিতির একজন সদস্য যখন ১,০০০ টাকা সঞ্চয় জমা দিলেন, তখন সফটওয়্যার কীভাবে রেকর্ড করবে:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded bg-emerald-800/80 border border-emerald-700">
            <span className="text-[10px] text-emerald-300 font-semibold block uppercase">লেনদেন পরিমাণ</span>
            <span className="text-sm font-bold text-white">৳ ১,০০০ টাকা</span>
          </div>
          <div className="p-2.5 rounded bg-emerald-800/80 border border-emerald-700">
            <span className="text-[10px] text-emerald-300 font-semibold block uppercase">১. খাত (Head)</span>
            <span className="font-bold text-white">মাসিক সাধারণ সঞ্চয়</span>
          </div>
          <div className="p-2.5 rounded bg-emerald-800/80 border border-emerald-700">
            <span className="text-[10px] text-emerald-300 font-semibold block uppercase">২. তহবিল (Fund)</span>
            <span className="font-bold text-white">সাধারণ সদস্য তহবিল</span>
          </div>
          <div className="p-2.5 rounded bg-emerald-800/80 border border-emerald-700">
            <span className="text-[10px] text-emerald-300 font-semibold block uppercase">৩. হিসাব (Account)</span>
            <span className="font-bold text-white">ক্যাশ ইন হ্যান্ড (অফিস)</span>
          </div>
        </div>
      </div>

      {/* Rule 22: Audit-ready Foundation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-slate-800">
            রুল ২২: অডিট-রেডি ফাউন্ডেশন ও নো ডিরেক্ট ডিলিট নীতি
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          ইসলামি আর্থিক শরিয়াহ এবং আন্তর্জাতিক অডিট স্ট্যান্ডার্ড অনুযায়ী সফটওয়্যারে কোনো ফিন্যান্সিয়াল রেকর্ড সরাসরি <strong>Delete</strong> করা যাবে না।
          ভুল সংশোধনের জন্য অবশ্যই <strong>Reversal Entry (সংশোধনী ভাউচার)</strong> তৈরি করতে হবে।
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] text-slate-500 block">তৈরি করেছেন</span>
            <span className="font-mono font-semibold text-slate-800">created_by / at</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] text-slate-500 block">পরিবর্তনকারী</span>
            <span className="font-mono font-semibold text-slate-800">updated_by / at</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] text-slate-500 block">অনুমোদনকারী</span>
            <span className="font-mono font-semibold text-slate-800">approved_by / at</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] text-slate-500 block">স্ট্যাটাস ট্রেইল</span>
            <span className="font-mono font-semibold text-emerald-800">status (AuditMeta)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
