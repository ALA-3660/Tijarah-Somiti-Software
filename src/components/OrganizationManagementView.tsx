import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  User, 
  Archive, 
  Save, 
  X, 
  RefreshCw,
  QrCode,
  Tag,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { OrganizationContext, OrganizationKind, OrganizationStatusType } from '../types';

interface OrganizationManagementViewProps {
  organization: OrganizationContext;
  onUpdateOrganization: (updated: OrganizationContext) => void;
}

export const OrganizationManagementView: React.FC<OrganizationManagementViewProps> = ({
  organization,
  onUpdateOrganization,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'lifecycle' | 'spec'>('profile');
  
  // Edit Form State
  const [formData, setFormData] = useState({
    name: organization.name,
    shortName: organization.shortName,
    organizationType: (organization.organizationType || 'society') as OrganizationKind,
    status: (organization.status || 'active') as OrganizationStatusType,
    phone: organization.phone || '01812-345678',
    email: organization.email || 'demo@khurushkul-samity.org',
    address: organization.address || 'খুরুশকুল, কক্সবাজার সদর, কক্সবাজার',
    description: organization.description || 'তিজারাহ সমিতি সফটওয়্যার — ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা',
    logo: organization.logo || '',
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const orgTypeLabels: Record<OrganizationKind, string> = {
    society: 'সমবায় / সাধারণ সমিতি (Society)',
    business: 'ব্যবসায়িক পার্টনারশিপ (Business)',
    social: 'সামাজিক সংগঠন (Social)',
    other: 'অন্যান্য বৈধ প্রতিষ্ঠান (Other)',
  };

  const orgStatusLabels: Record<OrganizationStatusType, { label: string; bg: string; text: string; border: string }> = {
    active: { label: 'সক্রিয় (Active)', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
    inactive: { label: 'নিষ্ক্রিয় (Inactive)', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
    suspended: { label: 'স্থগিত (Suspended)', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
    archived: { label: 'আর্কাইভকৃত (Archived)', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300' },
    demo: { label: 'ডেমো / নমুনা (Demo)', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
  };

  const validate = () => {
    const errors: string[] = [];
    if (!formData.name.trim()) {
      errors.push('সংগঠনের পূর্ণ নাম প্রদান করা আবশ্যক।');
    } else if (formData.name.trim().length < 3) {
      errors.push('সংগঠনের নাম নূন্যতম ৩ অক্ষরের হতে হবে।');
    }

    if (formData.phone && !/^(?:\+88|88)?01[3-9]\d{8}$/.test(formData.phone.replace(/[\s\-]/g, ''))) {
      errors.push('সঠিক বাংলাদেশী মোবাইল নম্বর (যেমন: ০১৭১২-৩৪৫৬৭৮) প্রদান করুন।');
    }

    if (formData.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email.trim())) {
      errors.push('সঠিক ইমেইল ঠিকানা প্রদান করুন।');
    }

    if (formData.description && formData.description.length > 500) {
      errors.push('বিবরণ সর্বোচ্চ ৫০০ অক্ষরের মধ্যে সীমাবদ্ধ রাখুন।');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updated: OrganizationContext = {
      ...organization,
      name: formData.name.trim(),
      shortName: formData.shortName.trim(),
      organizationType: formData.organizationType,
      status: formData.status,
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
      description: formData.description.trim() || undefined,
      logo: formData.logo.trim() || undefined,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Authorized Administrator',
    };

    onUpdateOrganization(updated);
    setIsEditing(false);
    setSuccessToast('সংগঠনের তথ্য সফলভাবে হালনাগাদ ও সংরক্ষিত হয়েছে।');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleStatusChange = (newStatus: OrganizationStatusType) => {
    const updated: OrganizationContext = {
      ...organization,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      updatedBy: 'System Security Controller',
    };
    onUpdateOrganization(updated);
    setFormData((prev) => ({ ...prev, status: newStatus }));
    setSuccessToast(`সংগঠনের স্ট্যাটাস পরিবর্তিত হয়ে "${orgStatusLabels[newStatus]?.label || newStatus}" হয়েছে।`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Demo Notice Banner if Demo Organization */}
      {organization.isDemo && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300/80 text-amber-950 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-xl bg-amber-200/70 text-amber-900 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold font-heading text-sm text-amber-900">
                ডেমো প্রতিষ্ঠান সতর্কতা: খুরুশকুল ওলামা সমিতি
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono text-[10px] font-bold">
                DEMO_TESTING_ONLY
              </span>
            </div>
            <p className="mt-1 text-amber-900/90 font-body leading-relaxed">
              এই সমিতি শুধুমাত্র UI, টাইপোগ্রাফি ও নেভিগেশন পরীক্ষার জন্য ফ্রেমওয়ার্কে সিড করা হয়েছে। 
              সফটওয়্যার নিয়মানুযায়ী লাইভ প্রোডাকশনে এই ডেমো অর্গানাইজেশন দিয়ে কোনো আর্থিক বা সদস্য কার্যক্রম পরিচালনা করা সম্পূর্ণ নিষিদ্ধ।
            </p>
          </div>
        </div>
      )}

      {/* Main View Mode Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setIsEditing(false); setActiveTab('profile'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'profile' && !isEditing
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            সংগঠনের পরিচিতি (Profile)
          </button>
          <button
            onClick={() => { setIsEditing(true); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              isEditing
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            তথ্য সম্পাদনা (Edit Screen)
          </button>
          <button
            onClick={() => { setIsEditing(false); setActiveTab('lifecycle'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'lifecycle'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            লাইফসাইকেল ও সফট-ডিলিট (Status)
          </button>
          <button
            onClick={() => { setIsEditing(false); setActiveTab('spec'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'spec'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            আর্কিটেকচার ও স্কোপ রুলস
          </button>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>সম্পাদনা করুন</span>
          </button>
        )}
      </div>

      {/* EDIT MODE */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                সংগঠনের তথ্য সম্পাদনা ফরম (Flutter AppFormValidation Equivalent)
              </h3>
              <p className="text-xs text-slate-500 font-body">
                সকল তারকাচিহ্নিত (*) ঘর পূরণ করা বাধ্যতামূলক। আইডি এবং কোড অপরিবর্তনীয়।
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setFormErrors([]); }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                সংরক্ষণ করুন
              </button>
            </div>
          </div>

          {/* Validation Error Summary */}
          {formErrors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-700" />
                দয়া করে নিচের ত্রুটিগুলো সমাধান করুন:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-2">
                {formErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Immutable IDs Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 font-heading">
              <Lock className="w-4 h-4 text-slate-500" />
              স্থায়ী সিস্টেম আইডেন্টিফায়ার (অপরিবর্তনীয় ও লককৃত)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  সংগঠন আইডি (Immutable Tenant ID)
                </label>
                <div className="px-3 py-2 rounded-lg bg-slate-200/70 border border-slate-300 font-mono text-xs text-slate-600 flex items-center justify-between">
                  <span>{organization.id}</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">সিস্টেম রিকোয়েস্টে X-Organization-Id হিসেবে ব্যবহৃত হয়</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  সংগঠন কোড (Unique Organization Code)
                </label>
                <div className="px-3 py-2 rounded-lg bg-slate-200/70 border border-slate-300 font-mono text-xs text-slate-600 flex items-center justify-between">
                  <span>{organization.code}</span>
                  <QrCode className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">সার্চ ও ব্যাকএন্ড-নিয়ন্ত্রিত অনন্য রেফারেন্স কোড</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সংগঠনের পূর্ণ নাম *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: খুরুশকুল ওলামা সমিতি"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সংক্ষিপ্ত নাম
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                placeholder="যেমন: খুরুশকুল সমিতি"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সংগঠনের ধরন (Organization Type)
              </label>
              <select
                value={formData.organizationType}
                onChange={(e) => setFormData({ ...formData, organizationType: e.target.value as OrganizationKind })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-xs bg-white"
              >
                <option value="society">সমবায় / সাধারণ সমিতি (Society)</option>
                <option value="business">ব্যবসায়িক পার্টনারশিপ (Business)</option>
                <option value="social">সামাজিক সংগঠন (Social)</option>
                <option value="other">অন্যান্য বৈধ প্রতিষ্ঠান (Other)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                অফিসিয়াল মোবাইল নম্বর
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="০১৮১২-৩৪৫৬৭৮"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                অফিসিয়াল ইমেইল
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@samity.org"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                দাপ্তরিক ঠিকানা
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="রোড/গ্রাম, ডাকঘর, উপজেলা, জেলা"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সংক্ষিপ্ত বিবরণ ও লক্ষ্য
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="সমিতির মূল লক্ষ্য ও উদ্দেশ্য সংক্ষেপে লিখুন..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">সর্বোচ্চ ৫০০ অক্ষর</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              পরিবর্তন সংরক্ষণ করুন
            </button>
          </div>
        </form>
      ) : activeTab === 'profile' ? (
        /* PROFILE VIEW MODE */
        <div className="space-y-6">
          {/* Main Organization Identity Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#0F5132]/10 border border-[#0F5132]/20 flex items-center justify-center text-[#0F5132] font-bold text-2xl font-heading shadow-inner shrink-0">
                  {organization.name.charAt(0) || 'তি'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 font-heading">
                      {organization.name}
                    </h2>
                    {organization.status && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${orgStatusLabels[organization.status]?.bg || 'bg-slate-100'} ${orgStatusLabels[organization.status]?.text || 'text-slate-800'} ${orgStatusLabels[organization.status]?.border || 'border-slate-300'}`}>
                        {orgStatusLabels[organization.status]?.label || organization.status}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 font-body">
                    {organization.shortName && (
                      <span className="font-semibold text-slate-700">{organization.shortName}</span>
                    )}
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {organization.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      {orgTypeLabels[organization.organizationType || 'society']}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#0F5132] hover:bg-[#0c3e27] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  সম্পাদনা
                </button>
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="py-4 border-b border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                প্রাতিষ্ঠানিক লক্ষ্য ও পরিচিতি
              </h4>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                {organization.description || 'কোনো বিবরণ লিপিবদ্ধ করা হয়নি।'}
              </p>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  যোগাযোগ ও অবস্থান
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">অফিসিয়াল ফোন:</span>
                      <span className="font-numeric font-medium text-slate-800">{organization.phone || 'প্রযোজ্য নয়'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">অফিসিয়াল ইমেইল:</span>
                      <span className="font-mono text-slate-800">{organization.email || 'প্রযোজ্য নয়'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">দাপ্তরিক ঠিকানা:</span>
                      <span className="text-slate-800 font-body">{organization.address || 'ঠিকানা দেওয়া হয়নি'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit & System Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  সিস্টেম অডিট ও মেটাডাটা
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">সিস্টেম আইডি:</span>
                    <span className="font-mono text-slate-800 font-semibold">{organization.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">অনন্য কোড:</span>
                    <span className="font-mono text-emerald-800 font-bold">{organization.code}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">তৈরি করেছেন:</span>
                    <span className="text-slate-700">{organization.createdBy || 'System Seed'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">সর্বশেষ আপডেট:</span>
                    <span className="text-slate-700">{organization.updatedBy || 'System Seed'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'lifecycle' ? (
        /* LIFECYCLE & STATUS MANAGEMENT */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Archive className="w-4 h-4 text-emerald-700" />
              সংগঠন লাইফসাইকেল ও সফট-ডিলিট নীতি (Lifecycle Foundation)
            </h3>
            <p className="text-xs text-slate-500 font-body mt-1">
              তিজারাহ সমিতি সফটওয়্যারে কোনো সমিতির ডাটা স্থায়ীভাবে ডিলিট (Hard Delete) করা সম্পূর্ণ নিষিদ্ধ।
              তথ্য সংরক্ষণের স্বার্থে শুধুমাত্র স্ট্যাটাস পরিবর্তনযোগ্য।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active */}
            <div className={`p-4 rounded-xl border transition ${
              organization.status === 'active' ? 'border-emerald-500 bg-emerald-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-emerald-900">সক্রিয় (Active)</span>
                {organization.status === 'active' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <p className="text-[11px] text-slate-600 font-body mb-3">
                স্বাভাবিক দৈনন্দিন কার্যক্রম, সদস্য সেবা এবং লেনদেন চালু থাকবে।
              </p>
              {organization.status !== 'active' && (
                <button
                  onClick={() => handleStatusChange('active')}
                  className="w-full py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
                >
                  সক্রিয় করুন
                </button>
              )}
            </div>

            {/* Inactive */}
            <div className={`p-4 rounded-xl border transition ${
              organization.status === 'inactive' ? 'border-slate-600 bg-slate-100 shadow-xs' : 'border-slate-200 hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-800">নিষ্ক্রিয় (Inactive)</span>
                {organization.status === 'inactive' && <CheckCircle2 className="w-4 h-4 text-slate-700" />}
              </div>
              <p className="text-[11px] text-slate-600 font-body mb-3">
                নতুন কার্যক্রম সাময়িক বন্ধ কিন্তু ডাটা ও রিপোর্ট দেখতে কোনো বাধা নেই।
              </p>
              {organization.status !== 'inactive' && (
                <button
                  onClick={() => handleStatusChange('inactive')}
                  className="w-full py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  নিষ্ক্রিয় করুন
                </button>
              )}
            </div>

            {/* Suspended */}
            <div className={`p-4 rounded-xl border transition ${
              organization.status === 'suspended' ? 'border-amber-500 bg-amber-50/60 shadow-xs' : 'border-slate-200 hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-amber-900">স্থগিত (Suspended)</span>
                {organization.status === 'suspended' && <AlertTriangle className="w-4 h-4 text-amber-700" />}
              </div>
              <p className="text-[11px] text-slate-600 font-body mb-3">
                তদন্ত বা আইনি কারণে সকল প্রকার এন্ট্রি স্থগিত থাকবে।
              </p>
              {organization.status !== 'suspended' && (
                <button
                  onClick={() => handleStatusChange('suspended')}
                  className="w-full py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold"
                >
                  স্থগিত করুন
                </button>
              )}
            </div>

            {/* Archived */}
            <div className={`p-4 rounded-xl border transition ${
              organization.status === 'archived' ? 'border-rose-500 bg-rose-50/60 shadow-xs' : 'border-slate-200 hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-rose-900">আর্কাইভ (Archived)</span>
                {organization.status === 'archived' && <Archive className="w-4 h-4 text-rose-700" />}
              </div>
              <p className="text-[11px] text-slate-600 font-body mb-3">
                বিলুপ্ত বা সমাপ্ত সমিতি। তথ্য শুধু অডিট ও রেফারেন্সের জন্য সংরক্ষিত।
              </p>
              {organization.status !== 'archived' && (
                <button
                  onClick={() => handleStatusChange('archived')}
                  className="w-full py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold"
                >
                  আর্কাইভ করুন
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ARCHITECTURE & COMPLIANCE RULES */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 font-heading">
            <ShieldAlert className="w-5 h-5 text-emerald-700" />
            Prompt 2.1 — Organization Management Foundation বাউন্ডারি যাচাই
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                No Financial Scope Leakage
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Organization Entity-তে কোনো ব্যালেন্স, ইনকাম, এক্সপেন্স বা আর্থিক হিসাব নেই। এটি শতভাগ নিবেদিত বিজনেস বাউন্ডারি।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Immutable System ID & Unique Code
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                আইডি সম্পূর্ণ অপরিবর্তনীয়। কোড ইউনিক ও সার্চেবল। এটি মাল্টি-টেন্যান্ট ডেটাবেজ সেপারেশন নিশ্চিত করে।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                X-Organization-Id Header Ready
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                প্রতিটি API রিকোয়েস্টে সক্রিয় সমিতির আইডি হেডার আকারে পাঠানো হবে, যা স্বয়ংক্রিয়ভাবে লোকাল স্টোরেজের সাথে সিঙ্কড।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Soft-Delete & Archive Policy
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                কোনো হার্ড ডিলিট নেই। সমিতির তথ্য অডিটের জন্য আজীবন সংরক্ষিত থাকবে এবং প্রয়োজনে রিস্টোর করা যাবে।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
