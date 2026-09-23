import React, { useState } from 'react';
import { 
  Smartphone, 
  Layers, 
  FileCode2, 
  Scale, 
  CheckCircle2, 
  Building2, 
  Palette,
  BookOpen, 
  Sparkles,
  Type,
  Compass,
  KeyRound,
  Users,
  FileCheck,
  Database,
  FolderTree,
  Wallet,
  ShieldCheck,
  Landmark,
  FileSpreadsheet,
  Receipt
} from 'lucide-react';
import { AndroidDeviceFrame } from './components/AndroidDeviceFrame';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { CodeViewer } from './components/CodeViewer';
import { FinancialRulesView } from './components/FinancialRulesView';
import { VerificationTests } from './components/VerificationTests';
import { DesignSystemSpecimen } from './components/DesignSystemSpecimen';
import { NavigationExplorer } from './components/NavigationExplorer';
import { OrganizationManagementView } from './components/OrganizationManagementView';
import { AuthenticationManagementView } from './components/AuthenticationManagementView';
import { MemberProfileManagementView } from './components/MemberProfileManagementView';
import { MembershipApplicationManagementView } from './components/MembershipApplicationManagementView';
import { MemberMasterDataManagementView } from './components/MemberMasterDataManagementView';
import { MemberRegisterView } from './components/MemberRegisterView';
import { MasterDataFoundationView } from './components/MasterDataFoundationView';
import { HeadManagementView } from './components/HeadManagementView';
import { FundManagementView } from './components/FundManagementView';
import { MasterDataGovernanceView } from './components/MasterDataGovernanceView';
import { AccountManagementView } from './components/AccountManagementView';
import { TransactionCoreView } from './components/TransactionCoreView';
import { IncomeManagementView } from './components/IncomeManagementView';
import { TSSLogo, TSSBrandSpecimen, BRAND_CONFIG } from './branding';
import { EnvironmentType, OrganizationContext, UiSimulatorState } from './types';

export const DEMO_ORGANIZATION: OrganizationContext = {
  id: 'demo-org-khurushkul',
  name: 'খুরুশকুল ওলামা সমিতি',
  shortName: 'খুরুশকুল সমিতি',
  code: 'DEMO-KHU-001',
  status: 'demo',
  organizationType: 'society',
  phone: '01812-345678',
  email: 'demo@khurushkul-samity.org',
  address: 'খুরুশকুল, কক্সবাজার সদর, কক্সবাজার',
  description: 'Global Design System, Typography, Theme ও Application Shell পরীক্ষার জন্য নির্দিষ্ট ডেমো অর্গানাইজেশন।',
  isDemo: true,
  demoBadgeText: 'DEMO ORGANIZATION',
  established: 'ডেমো/নমুনা',
  regNumber: 'DEMO-UI-TESTING-ONLY',
  demoDescription: 'Global Design System, Typography, Theme ও Application Shell পরীক্ষার জন্য নির্দিষ্ট ডেমো অর্গানাইজেশন।',
  createdAt: '2026-01-01T00:00:00.000Z',
  createdBy: 'System Seed Initializer',
};

const INITIAL_ORGS: OrganizationContext[] = [
  DEMO_ORGANIZATION,
  {
    id: 'org-alfalah-01',
    name: 'আল-ফালাহ বহুমুখী সমবায় সমিতি লিমিটেড',
    shortName: 'আল-ফালাহ সমিতি',
    code: 'ALF-001',
    status: 'active',
    organizationType: 'society',
    phone: '01711-223344',
    email: 'info@alfalah-samity.org',
    address: 'মিরপুর-১০, ঢাকা',
    description: 'হালাল বিনিয়োগ ও সদস্যদের কল্যাণে পরিচালিত বহুমুখী সমবায় সমিতি।',
    established: '২০১৮',
    regNumber: 'রেজি-৪৫২/ঢাকা-২০১৮',
    createdAt: '2018-05-12T00:00:00.000Z',
    createdBy: 'System Administrator',
  },
  {
    id: 'org-barakah-02',
    name: 'বারাকাহ ইসলামিক ট্রেডার্স সমবায় সমিতি',
    shortName: 'বারাকাহ সমবায়',
    code: 'BRK-002',
    status: 'active',
    organizationType: 'business',
    phone: '01911-556677',
    email: 'contact@barakah-traders.com',
    address: 'আগ্রাবাদ, চট্টগ্রাম',
    description: 'ইসলামিক ট্রেডিং ও অংশীদারি ব্যবসার আধুনিক সমবায়।',
    established: '২০২১',
    regNumber: 'রেজি-৮৮১/চট্ট-২০২১',
    createdAt: '2021-03-20T00:00:00.000Z',
    createdBy: 'System Administrator',
  },
  {
    id: 'org-amana-03',
    name: 'আমানাহ হালাল ইনভেস্টমেন্ট সমিতি',
    shortName: 'আমানাহ সমিতি',
    code: 'AMN-003',
    status: 'active',
    organizationType: 'society',
    phone: '01611-889900',
    email: 'office@amana-halal.org',
    address: 'জিন্দাবাজার, সিলেট',
    description: 'সুদমুক্ত সঞ্চয় ও হালাল ইনভেস্টমেন্টের বিশ্বস্ত মাধ্যম।',
    established: '২০২৩',
    regNumber: 'রেজি-১২৯/সিলেট-২০২৩',
    createdAt: '2023-08-15T00:00:00.000Z',
    createdBy: 'System Administrator',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'income_management' | 'financial_transaction_core' | 'account_management' | 'master_data_governance' | 'fund_management' | 'head_management' | 'master_data_foundation' | 'member_register' | 'member_master_data' | 'member_profile' | 'member_application' | 'authentication' | 'organization' | 'navigation' | 'simulator' | 'tss_branding' | 'design_system' | 'architecture' | 'code' | 'rules' | 'tests'>('income_management');
  const [environment, setEnvironment] = useState<EnvironmentType>('development');
  const [orgsList, setOrgsList] = useState<OrganizationContext[]>(INITIAL_ORGS);
  const [activeOrg, setActiveOrg] = useState<OrganizationContext>(DEMO_ORGANIZATION);
  const [uiState, setUiState] = useState<UiSimulatorState>('success');

  const handleUpdateActiveOrg = (updated: OrganizationContext) => {
    setActiveOrg(updated);
    setOrgsList((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-body">
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TSSLogo variant="compact" theme="light" size="md" showBangla={true} />
            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-numeric">
                Official Brand: TSS
              </span>
              <p className="text-xs text-slate-500 font-normal font-body">
                {BRAND_CONFIG.tagline}
              </p>
            </div>
          </div>

          {/* Quick Environment & Active Org Selector */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-800">অর্গানাইজেশন:</span>
              <span className="font-bold text-emerald-950 font-heading">{activeOrg.shortName}</span>
              {activeOrg.isDemo && (
                <span className="px-1 py-0.2 bg-amber-200 text-amber-900 rounded font-mono text-[9px] font-bold">
                  DEMO
                </span>
              )}
            </div>

            {/* Quick Environment Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-numeric">
              <span className="text-[11px] font-semibold text-slate-500 px-1.5 hidden sm:inline">পরিবেশ:</span>
              {(['development', 'staging', 'production'] as EnvironmentType[]).map((env) => (
                <button
                  key={env}
                  onClick={() => setEnvironment(env)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                    environment === env
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {env === 'development' ? 'Dev' : env === 'staging' ? 'Staging' : 'Prod'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 sm:gap-2 overflow-x-auto text-xs border-t border-slate-100 font-numeric">
          <button
            onClick={() => setActiveTab('income_management')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'income_management'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span>আয় ও প্রাপ্তি (Prompt 5.3)</span>
          </button>

          <button
            onClick={() => setActiveTab('financial_transaction_core')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'financial_transaction_core'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>লেনদেন কোর ও অনুমোদন (Prompt 5.2)</span>
          </button>

          <button
            onClick={() => setActiveTab('account_management')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'account_management'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4 text-emerald-700" />
            <span>হিসাব ও আর্থিক অবস্থান (Prompt 5.1)</span>
          </button>

          <button
            onClick={() => setActiveTab('master_data_governance')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'master_data_governance'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>মাস্টার ডাটা গভর্ন্যান্স ও অডিট (Phase 4.5)</span>
          </button>

          <button
            onClick={() => setActiveTab('fund_management')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'fund_management'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-700" />
            <span>তহবিল ব্যবস্থাপনা (Prompt 4.4)</span>
          </button>

          <button
            onClick={() => setActiveTab('head_management')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'head_management'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-4 h-4 text-emerald-700" />
            <span>খাত শ্রেণি ও ব্যবস্থাপনা (Prompt 4.3)</span>
          </button>

          <button
            onClick={() => setActiveTab('master_data_foundation')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'master_data_foundation'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-700" />
            <span>মাস্টার ডাটা আর্কিটেকচার (Prompt 4.1)</span>
          </button>

          <button
            onClick={() => setActiveTab('member_register')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'member_register'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>সদস্য রেজিস্টার ও অনুসন্ধান (Prompt 3.6)</span>
          </button>

          <button
            onClick={() => setActiveTab('member_master_data')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'member_master_data'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>মাস্টার ডাটা ও শ্রেণি (Prompt 3.4)</span>
          </button>

          <button
            onClick={() => setActiveTab('member_profile')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'member_profile'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>সদস্য প্রোফাইল ও শ্রেণি-সম্পর্ক (Prompt 3.4)</span>
          </button>

          <button
            onClick={() => setActiveTab('member_application')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'member_application'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>সদস্যপদ আবেদন ও অনুমোদন (Prompt 3.3)</span>
          </button>

          <button
            onClick={() => setActiveTab('authentication')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'authentication'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>অথেনটিকেশন ও সেশন (Prompt 2.2)</span>
          </button>

          <button
            onClick={() => setActiveTab('organization')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'organization'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>সংগঠন ব্যবস্থাপনা (Prompt 2.1)</span>
          </button>

          <button
            onClick={() => setActiveTab('navigation')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'navigation'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>নেভিগেশন ও সাইডবার</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'simulator'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>মোবাইল শেল প্রিভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('tss_branding')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'tss_branding'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>টিএসএস ব্র্যান্ডিং ও লোগো (TSS Brand)</span>
          </button>

          <button
            onClick={() => setActiveTab('design_system')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'design_system'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>ডিজাইন সিস্টেম (Prompt 1.2)</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'architecture'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>আর্কিটেকচার লেয়ারিং</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'code'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>ডার্ট ফাইল এক্সপ্লোরার</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'rules'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>আর্থিক নীতি (Rule 21 & 22)</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`py-3 px-3.5 border-b-2 font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'tests'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ভেরিফিকেশন টেস্ট</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'income_management' && (
          <IncomeManagementView currentOrg={activeOrg} />
        )}
        {activeTab === 'financial_transaction_core' && (
          <TransactionCoreView currentOrg={activeOrg} />
        )}
        {activeTab === 'account_management' && (
          <AccountManagementView
            currentOrg={activeOrg}
            onOrgChange={(orgId) => {
              const found = orgsList.find((o) => o.id === orgId);
              if (found) {
                setActiveOrg(found);
              }
            }}
          />
        )}
        {activeTab === 'master_data_governance' && (
          <MasterDataGovernanceView
            organization={activeOrg}
            onRefreshOrgData={() => {
              // Refresh callback
            }}
          />
        )}
        {activeTab === 'fund_management' && (
          <FundManagementView
            currentOrg={activeOrg}
            onOrgChange={(orgId) => {
              const found = orgsList.find((o) => o.id === orgId);
              if (found) {
                setActiveOrg(found);
              }
            }}
          />
        )}
        {activeTab === 'head_management' && (
          <HeadManagementView
            currentOrg={activeOrg}
            onOrgChange={(orgId) => {
              const found = orgsList.find((o) => o.id === orgId);
              if (found) {
                setActiveOrg(found);
              }
            }}
          />
        )}
        {activeTab === 'master_data_foundation' && (
          <MasterDataFoundationView
            currentOrg={activeOrg}
            onOrgChange={(orgId) => {
              const found = orgsList.find((o) => o.id === orgId);
              if (found) {
                setActiveOrg(found);
              }
            }}
          />
        )}
        {activeTab === 'member_register' && (
          <MemberRegisterView
            currentOrg={activeOrg}
            onSelectMemberForProfile={() => {
              setActiveTab('member_profile');
            }}
            onSyncOrganization={(orgId, orgName) => {
              const found = orgsList.find((o) => o.id === orgId);
              if (found) {
                setActiveOrg(found);
              } else {
                setActiveOrg({
                  ...activeOrg,
                  id: orgId,
                  name: orgName,
                });
              }
            }}
          />
        )}
        {activeTab === 'member_master_data' && (
          <MemberMasterDataManagementView
            currentOrg={activeOrg}
            onSyncOrganization={(orgId, orgName) => {
              const found = orgsList.find((o) => o.id === orgId);
              if (found) {
                setActiveOrg(found);
              } else {
                setActiveOrg({
                  ...activeOrg,
                  id: orgId,
                  name: orgName,
                });
              }
            }}
          />
        )}
        {activeTab === 'member_application' && (
          <MembershipApplicationManagementView
            currentOrg={activeOrg}
            onSyncOrganization={(orgId, orgName) => {
              const found = orgsList.find((o) => o.id === orgId);
              if (found) {
                setActiveOrg(found);
              } else {
                setActiveOrg({
                  ...activeOrg,
                  id: orgId,
                  name: orgName,
                });
              }
            }}
          />
        )}
        {activeTab === 'member_profile' && (
          <MemberProfileManagementView
            currentOrg={activeOrg}
            onSyncOrganization={(orgId, orgName) => {
              const found = orgsList.find((o) => o.id === orgId);
              if (found) {
                setActiveOrg(found);
              } else {
                setActiveOrg({
                  ...activeOrg,
                  id: orgId,
                  name: orgName,
                });
              }
            }}
          />
        )}
        {activeTab === 'authentication' && (
          <AuthenticationManagementView
            currentOrg={activeOrg}
            onSyncOrganization={(orgId, orgName) => {
              const found = orgsList.find((o) => o.id === orgId);
              if (found) {
                setActiveOrg(found);
              } else {
                setActiveOrg({
                  ...activeOrg,
                  id: orgId,
                  name: orgName,
                });
              }
            }}
          />
        )}

        {activeTab === 'organization' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#0F5132]" />
                  সংগঠন ব্যবস্থাপনা ফাউন্ডেশন (Phase 2 — Organization Management)
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-body">
                  একটি সমিতি/প্রতিষ্ঠান/ব্যবসার আইনি ও দাপ্তরিক পরিচিতি, ইউনিক আইডেন্টিফায়ার এবং সিকিউর মাল্টি-টেন্যান্ট বাউন্ডারি।
                </p>
              </div>

              {/* Organization Quick Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">সক্রিয় সমিতি:</span>
                <select
                  value={activeOrg.id}
                  onChange={(e) => {
                    const found = orgsList.find((o) => o.id === e.target.value);
                    if (found) setActiveOrg(found);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                >
                  {orgsList.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.shortName || org.name} ({org.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <OrganizationManagementView
              organization={activeOrg}
              onUpdateOrganization={handleUpdateActiveOrg}
            />
          </div>
        )}

        {activeTab === 'navigation' && (
          <NavigationExplorer
            activeOrg={activeOrg}
            onOrgChange={handleUpdateActiveOrg}
          />
        )}

        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Android Device Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <AndroidDeviceFrame
                environment={environment}
                onEnvironmentChange={setEnvironment}
                activeOrg={activeOrg}
                allOrgs={orgsList}
                onOrgChange={handleUpdateActiveOrg}
                uiState={uiState}
                onUiStateChange={setUiState}
              />
            </div>

            {/* Right Column: Foundation Status & Guide */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 font-heading">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    ২-স্তর নেভিগেশন ও সাইডবার ফ্রেমওয়ার্ক (Prompt 1.3)
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-numeric">
                    STATUS: READY & VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 font-body">
                  প্রম্পট ১.৩ অনুযায়ী <strong>তিজারাহ সমিতি সফটওয়্যার</strong>-এর ১৩টি প্যারেন্ট মডিউল (Main Sidebar) 
                  এবং প্রতিটি মডিউলের অভ্যন্তরীণ উপ-মেনু তালিকা (Internal Left Sub-sidebar) সেন্ট্রালাইজড 
                  <code className="px-1.5 py-0.5 bg-slate-100 rounded text-emerald-800 font-mono text-[11px] mx-1">NavigationRegistry</code>-র মাধ্যমে সুবিন্যস্ত হয়েছে।
                </p>

                {/* Key Architecture Facts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase font-numeric">স্তর ১: Main Sidebar</span>
                    <span className="font-bold text-slate-800 font-heading">১৩টি প্রধান মডিউল (Parent Only)</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase font-numeric">স্তর ২: Sub-sidebar</span>
                    <span className="font-bold text-amber-800 font-numeric">৯০+ সুনির্দিষ্ট চাইল্ড রুট</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase font-numeric">আর্থিক ডাইমেনশন</span>
                    <span className="font-bold text-slate-800 font-body">Head ≠ Fund ≠ Account সংরক্ষিত</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase font-numeric">শরিয়াহ গাইডলাইন</span>
                    <span className="font-bold text-emerald-700 font-body">তথ্যবহুল নির্দেশিকা (ফতোয়া নয়)</span>
                  </div>
                </div>
              </div>

              {/* Quick Jump to Navigation Explorer */}
              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 font-heading mb-1">
                    নেভিগেশন ও সাইডবার আর্কিটেকচার ওয়ার্কবেঞ্চ
                  </h4>
                  <p className="text-xs text-emerald-800/90 font-body">
                    ডেস্কটপ (২ সাইডবার), ট্যাবলেট (আইকন বার) ও মোবাইল (ড্রয়ার) রেসপনসিভ ভিউ পরীক্ষা করুন।
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('navigation')}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition shrink-0 font-numeric shadow-xs"
                >
                  ওয়ার্কবেঞ্চ খুলুন
                </button>
              </div>

              {/* Multi-Tenant Organization Context Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-heading">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    সমিতি কনটেক্সট ও টেস্টিং নির্বাচন
                  </h4>
                  {activeOrg.isDemo && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                      DEMO ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3 font-body">
                  প্রতিটি রিকোয়েস্ট কনটেক্সটে সক্রিয় সমিতির পরিচয় পাঠানো হয়। ডেমো বা যেকোনো টেন্যান্ট নির্বাচন করুন:
                </p>

                <div className="flex flex-wrap gap-2">
                  {INITIAL_ORGS.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => setActiveOrg(org)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border font-heading flex items-center gap-1.5 ${
                        activeOrg.id === org.id
                          ? org.isDemo 
                            ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                            : 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <span>{org.shortName}</span>
                      {org.isDemo && (
                        <span className={`text-[9px] px-1 rounded uppercase font-mono ${
                          activeOrg.id === org.id ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-800'
                        }`}>
                          DEMO
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict Demo Organization Policy & Isolation Card */}
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 shadow-xs text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 font-heading flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    ডেমো অর্গানাইজেশন পলিসি (খুরুশকুল ওলামা সমিতি)
                  </h4>
                  <span className="font-mono text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                    UI TESTING ONLY
                  </span>
                </div>
                
                <p className="text-amber-900 leading-relaxed font-body">
                  <strong>৭টি অনুমোদিত ক্ষেত্র:</strong> (১) UI Preview, (২) Typography Testing, (৩) Organization Header Testing, (৪) Application Shell Testing, (৫) Demo Dashboard Placeholder, (৬) Light/Dark Theme Testing, (৭) Responsive Layout Testing।
                </p>

                <div className="pt-2 border-t border-amber-200/80 text-[11px] text-amber-900/90 font-body">
                  <span className="font-bold text-rose-800">কঠোর সুরক্ষা নিশ্চিতকরণ:</span> কোনো বাস্তব বা কাল্পনিক সদস্যের নাম, ফোন নম্বর, ফান্ড ব্যালেন্স, ব্যাংক অ্যাকাউন্ট, কিস্তি বা বিক্রয় ডেটা হার্ড-কোড করা হয়নি। প্রোডাকশন বিল্ডে ডেমো কনফিগ স্বয়ংক্রিয়ভাবে ব্লকড থাকবে।
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tss_branding' && <TSSBrandSpecimen currentOrg={activeOrg} />}
        {activeTab === 'design_system' && <DesignSystemSpecimen />}
        {activeTab === 'architecture' && <ArchitectureDiagram />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'rules' && <FinancialRulesView />}
        {activeTab === 'tests' && <VerificationTests />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 font-body">
        <p>Powered by <strong>{BRAND_CONFIG.shortName}</strong> ({BRAND_CONFIG.fullName}) — {BRAND_CONFIG.banglaName} | {BRAND_CONFIG.tagline}</p>
      </footer>
    </div>
  );
}

