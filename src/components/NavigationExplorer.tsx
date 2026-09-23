import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Settings2, 
  Calculator, 
  PieChart, 
  Store, 
  Building, 
  Users2, 
  FolderGit2, 
  BarChart3, 
  Sliders, 
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Search,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Menu,
  X,
  Compass,
  ArrowRight,
  Info,
  Building2
} from 'lucide-react';

import { OrganizationManagementView } from './OrganizationManagementView';
import { OrganizationContext } from '../types';
import { TSSLogo } from '../branding';

interface SubRoute {
  id: string;
  title: string;
  englishTitle: string;
  route: string;
  description: string;
}

interface ParentModule {
  id: string;
  title: string;
  englishTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  description: string;
  sortOrder: number;
  isStandalone?: boolean;
  children: SubRoute[];
}

export const MAIN_MODULES: ParentModule[] = [
  {
    id: 'dashboard',
    title: 'ড্যাশবোর্ড',
    englishTitle: 'Dashboard',
    icon: LayoutDashboard,
    route: '/dashboard',
    sortOrder: 1,
    isStandalone: true,
    description: 'সার্বিক সারাংশ, দ্রুত পরিসংখ্যান ও কেন্দ্রীয় নিয়ন্ত্রণ কেন্দ্র।',
    children: []
  },
  {
    id: 'organization_security',
    title: 'সংগঠন, ব্যবহারকারী ও নিরাপত্তা',
    englishTitle: 'Organization & Security',
    icon: ShieldCheck,
    route: '/organization-security',
    sortOrder: 2,
    description: 'সমিতির পরিচিতি, ব্যবহারকারী একাউন্ট ও নিরাপত্তা ব্যবস্থা।',
    children: [
      { id: 'org_info', title: 'সংগঠনের তথ্য', englishTitle: 'Organization Info', route: '/organization-security/info', description: 'সমিতির নাম, নিবন্ধন নম্বর ও যোগাযোগের ঠিকানা' },
      { id: 'org_users', title: 'ব্যবহারকারী', englishTitle: 'Users', route: '/organization-security/users', description: 'অপারেটর, অ্যাডমিন ও ফিল্ড অফিসারদের ইউজার তালিকা' },
      { id: 'org_roles', title: 'ভূমিকা ও অনুমতি', englishTitle: 'Roles & Permissions', route: '/organization-security/roles', description: 'রোলভিত্তিক অ্যাক্সেস কন্ট্রোল ও অনুমতি পলিসি' },
      { id: 'org_login_sec', title: 'লগইন ও নিরাপত্তা', englishTitle: 'Login Security', route: '/organization-security/login-security', description: 'পাসওয়ার্ড পলিসি, ২-ফ্যাক্টর ও অথেনটিকেশন নিরাপত্তা' },
      { id: 'org_sessions', title: 'সেশন ও ডিভাইস', englishTitle: 'Sessions & Devices', route: '/organization-security/sessions', description: 'লগইন করা সক্রিয় ডিভাইস ও সেশন ট্র্যাকিং' },
      { id: 'org_logs', title: 'নিরাপত্তা লগ', englishTitle: 'Security Logs', route: '/organization-security/logs', description: 'সিস্টেমে প্রবেশের অডিট ও নিরাপত্তা লগ' },
    ]
  },
  {
    id: 'members',
    title: 'সদস্য ব্যবস্থাপনা',
    englishTitle: 'Member Management',
    icon: Users,
    route: '/members',
    sortOrder: 3,
    description: 'সদস্যদের বিস্তারিত ডাটাবেজ, আবেদন ও প্রোফাইল ব্যবস্থাপনা।',
    children: [
      { id: 'member_list', title: 'সদস্য তালিকা', englishTitle: 'Member List', route: '/members/list', description: 'সকল সক্রিয়, স্থগিত ও আজীবন সদস্যদের তালিকা' },
      { id: 'member_new', title: 'নতুন সদস্য', englishTitle: 'New Member', route: '/members/new', description: 'নতুন সদস্য আবেদন ফরম ও অন্তর্ভুক্তি' },
      { id: 'member_profile', title: 'সদস্য প্রোফাইল', englishTitle: 'Member Profile', route: '/members/profile', description: 'সদস্যের সম্পূর্ণ পরিচিতি, ছবি ও জাতীয় পরিচয়পত্র' },
      { id: 'member_applications', title: 'সদস্য আবেদন', englishTitle: 'Applications', route: '/members/applications', description: 'সদস্যপদ প্রাপ্তি ও সংশোধনের পেন্ডিং আবেদন' },
      { id: 'member_accounts', title: 'সদস্যের হিসাব', englishTitle: 'Member Accounts', route: '/members/accounts', description: 'সদস্যের ব্যক্তিগত সঞ্চয় ও ব্যালেন্স বিবরণী' },
      { id: 'member_shares', title: 'সদস্যের শেয়ার', englishTitle: 'Member Shares', route: '/members/shares', description: 'সদস্যের অনুকূলে থাকা মোট শেয়ার সংখ্যা ও মূল্য' },
      { id: 'member_installments', title: 'সদস্যের কিস্তি', englishTitle: 'Installments', route: '/members/installments', description: 'নিয়মিত সঞ্চয় কিস্তি শিডিউল ও আদায়ের স্থিতি' },
      { id: 'member_activities', title: 'সদস্যের কার্যক্রম', englishTitle: 'Activities', route: '/members/activities', description: 'সদস্যের সভায় উপস্থিতি ও কার্যক্রমে অংশগ্রহণের লগ' },
      { id: 'member_reports', title: 'রিপোর্ট', englishTitle: 'Reports', route: '/members/reports', description: 'সদস্য সংক্রান্ত সার্বিক পরিসংখ্যান ও রিপোর্ট' },
    ]
  },
  {
    id: 'master_data',
    title: 'মাস্টার ডাটা ও খাত ব্যবস্থাপনা',
    englishTitle: 'Master Data Setup',
    icon: Settings2,
    route: '/master-data',
    sortOrder: 4,
    description: 'আয়-ব্যয় খাত, স্ট্যান্ডার্ড তহবিল ও সিস্টেম ক্যাটাগরি কনফিগারেশন।',
    children: [
      { id: 'md_income_heads', title: 'আয় খাত', englishTitle: 'Income Heads', route: '/master-data/income-heads', description: 'আয়ের মৌলিক খাতসমূহ (যেমন: ভর্তি ফি, মাসিক ফি)' },
      { id: 'md_expense_heads', title: 'ব্যয় খাত', englishTitle: 'Expense Heads', route: '/master-data/expense-heads', description: 'ব্যয়ের খাতসমূহ (যেমন: অফিস ভাড়া, আপ্যায়ন, বেতন)' },
      { id: 'md_funds', title: 'তহবিল', englishTitle: 'Funds Master', route: '/master-data/funds', description: 'প্রশাসনিক, সাধারণ, শেয়ার, প্রকল্প ও কাস্টম তহবিল কনফিগারেশন' },
      { id: 'md_accounts', title: 'হিসাব', englishTitle: 'Accounts Master', route: '/master-data/accounts', description: 'ক্যাশ ইন হ্যান্ড, ব্যাংক ও মোবাইল ওয়ালেট হিসাব' },
      { id: 'md_member_types', title: 'সদস্যের ধরন', englishTitle: 'Member Types', route: '/master-data/member-types', description: 'সাধারণ, স্থায়ী, সহযোগী ও নির্বাহী সদস্য ক্যাটাগরি' },
      { id: 'md_business_types', title: 'ব্যবসার ধরন', englishTitle: 'Business Types', route: '/master-data/business-types', description: 'বাণিজ্য ও হালাল বিনিয়োগ ক্যাটাগরি' },
      { id: 'md_products', title: 'পণ্য ও সেবা', englishTitle: 'Products & Services', route: '/master-data/products-services', description: 'পণ্য ও সেবার মাস্টার তালিকা' },
      { id: 'md_general_setup', title: 'সাধারণ সেটআপ', englishTitle: 'General Setup', route: '/master-data/general-setup', description: 'অর্থবছর, ভাউচার কোড প্রেফিক্স ও সাধারণ সেটিংস' },
      { id: 'md_reports', title: 'রিপোর্ট', englishTitle: 'Reports', route: '/master-data/reports', description: 'মাস্টার ডাটা অডিট ও যাচাই রিপোর্ট' },
    ]
  },
  {
    id: 'finance',
    title: 'অর্থ ও হিসাব',
    englishTitle: 'Finance & Accounting',
    icon: Calculator,
    route: '/finance',
    sortOrder: 5,
    description: '৩-মাত্রিক ইসলামিক অ্যাকাউন্টিং (খাত, তহবিল ও হিসাবের স্বচ্ছ বিভাজন)।',
    children: [
      { id: 'fin_income', title: 'আয়', englishTitle: 'Income', route: '/finance/income', description: 'আয় ভাউচার এন্ট্রি ও রসিদ তৈরি' },
      { id: 'fin_expense', title: 'ব্যয়', englishTitle: 'Expense', route: '/finance/expense', description: 'ব্যয় অনুমোদন ও পেমেন্ট ভাউচার' },
      { id: 'fin_transfer', title: 'স্থানান্তর', englishTitle: 'Transfers', route: '/finance/transfer', description: 'ক্যাশ-ব্যাংক ও তহবিল স্থানান্তর' },
      { id: 'fin_funds', title: 'তহবিল', englishTitle: 'Fund Ledgers', route: '/finance/funds', description: 'তহবিলভিত্তিক ব্যালেন্স ও স্থিতি বিশ্লেষণ' },
      { id: 'fin_accounts', title: 'হিসাব', englishTitle: 'Account Ledgers', route: '/finance/accounts', description: 'ক্যাশ ও ব্যাংক হিসাবের লেজার' },
      { id: 'fin_collectors', title: 'সংগ্রহকারী', englishTitle: 'Field Collectors', route: '/finance/collectors', description: 'মাঠপর্যায়ের কালেকশন শিট ও জমা হিসাব' },
      { id: 'fin_cash', title: 'নগদ', englishTitle: 'Cash Book', route: '/finance/cash', description: 'দৈনিক ক্যাশ বই ও ভল্ট ব্যালেন্স' },
      { id: 'fin_bank', title: 'ব্যাংক', englishTitle: 'Bank Reconciliation', route: '/finance/bank', description: 'ব্যাংক স্টেটমেন্ট সমন্বয় ও চেক রেজিস্টার' },
      { id: 'fin_ledger', title: 'খতিয়ান', englishTitle: 'General Ledger', route: '/finance/ledger', description: 'সাধারণ খতিয়ান ও ট্রায়াল ব্যালেন্স' },
      { id: 'fin_budget', title: 'বাজেট', englishTitle: 'Budgeting', route: '/finance/budget', description: 'বার্ষিক বাজেট নির্ধারণ ও বাস্তবায়ন' },
      { id: 'fin_reports', title: 'রিপোর্ট', englishTitle: 'Reports', route: '/finance/reports', description: 'আয়-ব্যয় বিবরণী, উদ্বৃত্তপত্র ও হিসাব নিরীক্ষা' },
    ]
  },
  {
    id: 'shares_projects',
    title: 'শেয়ার ও প্রকল্প',
    englishTitle: 'Shares & Projects',
    icon: PieChart,
    route: '/shares-projects',
    sortOrder: 6,
    description: 'মূলধন শেয়ার, প্রকল্প বিনিয়োগ ও ইউনিট সাবস্ক্রিপশন।',
    children: [
      { id: 'sp_projects', title: 'প্রকল্প', englishTitle: 'Projects', route: '/shares-projects/projects', description: 'চলমান ও প্রস্তাবিত যৌথ প্রকল্পসমূহ' },
      { id: 'sp_participation', title: 'প্রকল্প অংশগ্রহণ', englishTitle: 'Participation', route: '/shares-projects/participation', description: 'প্রকল্পে সদস্যদের ইউনিট সাবস্ক্রিপশন' },
      { id: 'sp_shares', title: 'শেয়ার', englishTitle: 'Shares', route: '/shares-projects/shares', description: 'সমিতির মূলধন শেয়ার খতিয়ান' },
      { id: 'sp_allocation', title: 'শেয়ার বরাদ্দ', englishTitle: 'Share Allocation', route: '/shares-projects/allocation', description: 'নতুন শেয়ার আবেদন ও বরাদ্দ অনুমোদন' },
      { id: 'sp_installments', title: 'শেয়ার কিস্তি', englishTitle: 'Installments', route: '/shares-projects/installments', description: 'শেয়ারের নির্ধারিত কিস্তির শিডিউল' },
      { id: 'sp_payments', title: 'পেমেন্ট', englishTitle: 'Payments', route: '/shares-projects/payments', description: 'শেয়ার মূল্য পরিশোধ ও জমা রসিদ' },
      { id: 'sp_certificates', title: 'শেয়ার সার্টিফিকেট', englishTitle: 'Certificates', route: '/shares-projects/certificates', description: 'ডিজিটাল শেয়ার সনদপত্র প্রস্তুত' },
      { id: 'sp_completion', title: 'প্রকল্প সমাপ্তি', englishTitle: 'Closure', route: '/shares-projects/completion', description: 'প্রকল্প সমাপনী ও লভ্যাংশ বণ্টন' },
      { id: 'sp_reports', title: 'রিপোর্ট', englishTitle: 'Reports', route: '/shares-projects/reports', description: 'শেয়ার হোল্ডিং ও প্রকল্প পারফরম্যান্স' },
    ]
  },
  {
    id: 'halal_business',
    title: 'হালাল ব্যবসা',
    englishTitle: 'Halal Trade & Sales',
    icon: Store,
    route: '/halal-business',
    sortOrder: 7,
    description: 'মুরাবাহা ক্রয়-বিক্রয়, সুদমুক্ত কিস্তি বিক্রয় চুক্তি ও ইনভেন্টরি।',
    children: [
      { id: 'hb_dashboard', title: 'ব্যবসার ড্যাশবোর্ড', englishTitle: 'Trade Dashboard', route: '/halal-business/dashboard', description: 'দৈনিক বিক্রয়, মজুদ ও আদায়ের চিত্র' },
      { id: 'hb_suppliers', title: 'সরবরাহকারী', englishTitle: 'Suppliers', route: '/halal-business/suppliers', description: 'পাইকারি সরবরাহকারী ডিরেক্টরি ও দেনা' },
      { id: 'hb_purchase', title: 'ক্রয়', englishTitle: 'Purchases', route: '/halal-business/purchase', description: 'পণ্য ক্রয় ভাউচার ও চালানের এন্ট্রি' },
      { id: 'hb_products', title: 'পণ্য ও সেবা', englishTitle: 'Products', route: '/halal-business/products', description: 'ট্রেডিং পণ্যের তালিকা ও মূল্য নির্ধারণ' },
      { id: 'hb_inventory', title: 'মজুদ', englishTitle: 'Stock', route: '/halal-business/inventory', description: 'গুদাম মজুদ ও স্টক ব্যালেন্স ট্র্যাকিং' },
      { id: 'hb_sales', title: 'বিক্রয়', englishTitle: 'Sales', route: '/halal-business/sales', description: 'নগদ ও পাইকারি বিক্রয় রসিদ' },
      { id: 'hb_customers', title: 'গ্রাহক', englishTitle: 'Customers', route: '/halal-business/customers', description: 'ক্রেতা প্রোফাইল ও লেনদেন ইতিহাস' },
      { id: 'hb_installment_sales', title: 'কিস্তি বিক্রয়', englishTitle: 'Installment Sales', route: '/halal-business/installment-sales', description: 'নির্ধারিত মুনাফায় কিস্তি বিক্রয় শিডিউল (সুদমুক্ত)' },
      { id: 'hb_contracts', title: 'বিক্রয় চুক্তি', englishTitle: 'Contracts', route: '/halal-business/sale-contracts', description: 'মুরাবাহা বিক্রয় চুক্তি ও জামিনদার তথ্য' },
      { id: 'hb_collections', title: 'আদায়', englishTitle: 'Collections', route: '/halal-business/collections', description: 'বকেয়া ও কিস্তির টাকা আদায় এন্ট্রি' },
      { id: 'hb_dues', title: 'বকেয়া', englishTitle: 'Dues', route: '/halal-business/dues', description: 'গ্রাহকভিত্তিক বকেয়া ও তাগাদা নোটিশ' },
      { id: 'hb_reports', title: 'রিপোর্ট', englishTitle: 'Reports', route: '/halal-business/reports', description: 'লাভ-ক্ষতি ও স্টক ঘূর্ণন রিপোর্ট' },
    ]
  },
  {
    id: 'assets',
    title: 'জমি, সম্পত্তি ও সম্পদ',
    englishTitle: 'Property & Assets',
    icon: Building,
    route: '/assets',
    sortOrder: 8,
    description: 'জমির খতিয়ান, ভবন, গাড়ি ও স্থায়ী সম্পদের রেজিস্টার।',
    children: [
      { id: 'asset_land', title: 'জমি', englishTitle: 'Land', route: '/assets/land', description: 'জমির খতিয়ান, দাগ নম্বর ও দলিল তথ্য' },
      { id: 'asset_buildings', title: 'ভবন', englishTitle: 'Buildings', route: '/assets/buildings', description: 'সমিতির মালিকানাধীন ভবন ও স্থাপনা' },
      { id: 'asset_vehicles', title: 'যানবাহন', englishTitle: 'Vehicles', route: '/assets/vehicles', description: 'মোটরযান ও পরিবহন সম্পদ রেজিস্টার' },
      { id: 'asset_equipment', title: 'যন্ত্রপাতি', englishTitle: 'Equipment', route: '/assets/equipment', description: 'আইটি সামগ্রী ও অফিস যন্ত্রপাতি' },
      { id: 'asset_furniture', title: 'আসবাবপত্র', englishTitle: 'Furniture', route: '/assets/furniture', description: 'টেবিল, চেয়ার ও অন্যান্য আসবাবপত্র' },
      { id: 'asset_other', title: 'অন্যান্য সম্পদ', englishTitle: 'Other Assets', route: '/assets/other', description: 'বিবিধ স্থায়ী সম্পত্তি' },
      { id: 'asset_transfer', title: 'সম্পদ হস্তান্তর', englishTitle: 'Transfers', route: '/assets/transfer', description: 'সম্পদ বিক্রয়, হস্তান্তর বা অবচয়' },
      { id: 'asset_maintenance', title: 'সম্পদ রক্ষণাবেক্ষণ', englishTitle: 'Maintenance', route: '/assets/maintenance', description: 'সার্ভিসিং ও মেরামত খরচের লগ' },
      { id: 'asset_reports', title: 'রিপোর্ট', englishTitle: 'Reports', route: '/assets/reports', description: 'স্থায়ী সম্পদ মূল্যায়ন ও বুক ভ্যালু' },
    ]
  },
  {
    id: 'governance',
    title: 'কমিটি, সভা ও পরিচালনা',
    englishTitle: 'Governance & Meetings',
    icon: Users2,
    route: '/governance',
    sortOrder: 9,
    description: 'ব্যবস্থাপনা কমিটি, সভা, রেজুলেশন ও সাধারণ নোটিশ।',
    children: [
      { id: 'gov_committees', title: 'কমিটি', englishTitle: 'Committees', route: '/governance/committees', description: 'কার্যনির্বাহী ও উপ-কমিটি তালিকা' },
      { id: 'gov_roles', title: 'পদ ও দায়িত্ব', englishTitle: 'Roles', route: '/governance/roles-responsibilities', description: 'সভাপতি, সম্পাদক ও সদস্যদের কার্যপরিধি' },
      { id: 'gov_members', title: 'কমিটি সদস্য', englishTitle: 'Members', route: '/governance/members', description: 'বর্তমান কমিটির মেম্বার প্রোফাইল' },
      { id: 'gov_tenure', title: 'কমিটির মেয়াদ', englishTitle: 'Tenure', route: '/governance/tenure', description: 'কমিটির মেয়াদকাল ও নির্বাচন বিবরণ' },
      { id: 'gov_meetings', title: 'সভা', englishTitle: 'Meetings', route: '/governance/meetings', description: 'মাসিক সভা ও সাধারণ সভার শিডিউল' },
      { id: 'gov_attendance', title: 'উপস্থিতি', englishTitle: 'Attendance', route: '/governance/attendance', description: 'ডিজিটাল উপস্থিতি খাতা' },
      { id: 'gov_agendas', title: 'এজেন্ডা', englishTitle: 'Agendas', route: '/governance/agendas', description: 'সভার আলোচ্যসূচি প্রণয়ন' },
      { id: 'gov_resolutions', title: 'সিদ্ধান্ত / Resolution', englishTitle: 'Resolutions', route: '/governance/resolutions', description: 'গৃহীত সিদ্ধান্ত ও কার্যবিবরণী' },
      { id: 'gov_notices', title: 'নোটিশ', englishTitle: 'Notices', route: '/governance/notices', description: 'সাধারণ সভা ও জরুরি নোটিশ' },
      { id: 'gov_attachments', title: 'সংযুক্তি', englishTitle: 'Attachments', route: '/governance/attachments', description: 'স্বাক্ষরিত রেজুলেশন স্ক্যান কপি' },
      { id: 'gov_reports', title: 'রিপোর্ট', englishTitle: 'Reports', route: '/governance/reports', description: 'পরিচালনা ও সভার রিপোর্ট' },
    ]
  },
  {
    id: 'documents',
    title: 'ডকুমেন্ট ও Google Drive',
    englishTitle: 'Documents & Storage',
    icon: FolderGit2,
    route: '/documents',
    sortOrder: 10,
    description: 'সংগঠনের ফাইল, স্থানীয় আপলোড ও গুগল ড্রাইভ লিংক।',
    children: [
      { id: 'doc_all', title: 'সকল ডকুমেন্ট', englishTitle: 'All Files', route: '/documents/all', description: 'সকল সংরক্ষিত দলিলের তালিকা' },
      { id: 'doc_local_upload', title: 'স্থানীয় আপলোড', englishTitle: 'Local Upload', route: '/documents/local-upload', description: 'সার্ভারে সরাসরি ফাইল আপলোড' },
      { id: 'doc_google_drive', title: 'Google Drive', englishTitle: 'Google Drive', route: '/documents/google-drive', description: 'গুগল ড্রাইভ ক্লাউড ব্যাকআপ লিংক' },
      { id: 'doc_types', title: 'ডকুমেন্টের ধরন', englishTitle: 'Categories', route: '/documents/types', description: 'দলিল, চুক্তি ও সনদের ক্যাটাগরি' },
      { id: 'doc_shared', title: 'শেয়ার্ড ডকুমেন্ট', englishTitle: 'Shared Files', route: '/documents/shared', description: 'কমিটির সাথে শেয়ারকৃত ফাইল' },
      { id: 'doc_search', title: 'ডকুমেন্ট অনুসন্ধান', englishTitle: 'Search', route: '/documents/search', description: 'ট্যাগ ও কি-ওয়ার্ডভিত্তিক সার্চ' },
      { id: 'doc_reports', title: 'রিপোর্ট', englishTitle: 'Reports', route: '/documents/reports', description: 'ফাইল অডিট ও স্টোরেজ হিস্টোরি' },
    ]
  },
  {
    id: 'reports',
    title: 'রিপোর্ট ও বিশ্লেষণ',
    englishTitle: 'Reports & Analytics',
    icon: BarChart3,
    route: '/reports',
    sortOrder: 11,
    description: 'সেন্ট্রাল রিপোর্ট সেন্টার, আর্থিক বিশ্লেষণ ও অডিট রিপোর্ট।',
    children: [
      { id: 'rep_center', title: 'Report Center', englishTitle: 'Report Center', route: '/reports/center', description: 'এক ক্লিকে সকল মডিউলের রিপোর্ট হাব' },
      { id: 'rep_financial', title: 'আর্থিক রিপোর্ট', englishTitle: 'Financial Reports', route: '/reports/financial', description: 'আয়-ব্যয়, ট্রায়াল ব্যালেন্স ও ক্যাশ ফ্লো' },
      { id: 'rep_members', title: 'সদস্য রিপোর্ট', englishTitle: 'Member Reports', route: '/reports/members', description: 'সদস্য অন্তর্ভুক্তি ও সঞ্চয় বিবরণী' },
      { id: 'rep_shares', title: 'শেয়ার রিপোর্ট', englishTitle: 'Share Reports', route: '/reports/shares', description: 'শেয়ারহোল্ডার তালিকা ও শেয়ার সনদ রিপোর্ট' },
      { id: 'rep_projects', title: 'প্রকল্প রিপোর্ট', englishTitle: 'Project Reports', route: '/reports/projects', description: 'প্রকল্প অগ্রগতি ও বিনিয়োগ রিপোর্ট' },
      { id: 'rep_business', title: 'ব্যবসা রিপোর্ট', englishTitle: 'Business Reports', route: '/reports/business', description: 'হালাল ট্রেডিং লাভ ও বকেয়া রিপোর্ট' },
      { id: 'rep_assets', title: 'সম্পদ রিপোর্ট', englishTitle: 'Asset Reports', route: '/reports/assets', description: 'স্থায়ী সম্পদ মূল্যায়ন ও অবচয় চার্ট' },
      { id: 'rep_governance', title: 'কমিটি রিপোর্ট', englishTitle: 'Governance Reports', route: '/reports/governance', description: 'সভা ও উপস্থিতি অ্যানালিটিক্স' },
      { id: 'rep_documents', title: 'ডকুমেন্ট রিপোর্ট', englishTitle: 'Document Reports', route: '/reports/documents', description: 'ক্লাউড স্টোরেজ ও ফাইল মেকানিক্স' },
      { id: 'rep_custom', title: 'Custom Report', englishTitle: 'Custom Reports', route: '/reports/custom', description: 'শর্তভিত্তিক কাস্টম রিপোর্ট বিল্ডার' },
    ]
  },
  {
    id: 'administration',
    title: 'প্রশাসন ও সেটিংস',
    englishTitle: 'Administration',
    icon: Sliders,
    route: '/administration',
    sortOrder: 12,
    description: 'অ্যাপ সেটিংস, ডাটাবেজ ব্যাকআপ, পারমিশন ও সিস্টেম তথ্য।',
    children: [
      { id: 'adm_app_settings', title: 'অ্যাপ সেটিংস', englishTitle: 'App Settings', route: '/administration/app-settings', description: 'থিম, ভাষা, মুদ্রা ও ডিসপ্লে সেটিংস' },
      { id: 'adm_org_settings', title: 'সংগঠন সেটিংস', englishTitle: 'Org Settings', route: '/administration/org-settings', description: 'সমিতির পলিসি ও কার্যপ্রণালী' },
      { id: 'adm_user_settings', title: 'ব্যবহারকারী সেটিংস', englishTitle: 'User Settings', route: '/administration/user-settings', description: 'ইউজার প্রোফাইল ও নিরাপত্তা সেটিংস' },
      { id: 'adm_permissions', title: 'অনুমতি', englishTitle: 'Permissions', route: '/administration/permissions', description: 'অ্যাকশনভিত্তিক অনুমতি ম্যাট্রিক্স' },
      { id: 'adm_notifications', title: 'নোটিফিকেশন', englishTitle: 'Notifications', route: '/administration/notifications', description: 'এসএমএস গেটওয়ে ও অ্যালার্ট কনফিগ' },
      { id: 'adm_backup', title: 'ডাটা ও ব্যাকআপ', englishTitle: 'Data Backup', route: '/administration/backup', description: 'ডাটাবেজ ব্যাকআপ ও এক্সপোর্ট' },
      { id: 'adm_integrations', title: 'ইন্টিগ্রেশন', englishTitle: 'Integrations', route: '/administration/integrations', description: 'ড্রাইভ ও ক্লাউড সংযোগ' },
      { id: 'adm_audit', title: 'অডিট', englishTitle: 'Audit Logs', route: '/administration/audit', description: 'সিস্টেমব্যাপী প্রতিটি ক্রিয়াকলাপের লগ' },
      { id: 'adm_system_info', title: 'সিস্টেম তথ্য', englishTitle: 'System Info', route: '/administration/system-info', description: 'ভার্সন ও আর্কিটেকচার তথ্য' },
    ]
  },
  {
    id: 'help_guide',
    title: 'সহায়িকা',
    englishTitle: 'Help & Guide',
    icon: HelpCircle,
    route: '/help-guide',
    sortOrder: 13,
    description: 'ব্যবহারকারী নির্দেশিকা, শরিয়াহ মূলনীতি ও টেকনিক্যাল সাপোর্ট।',
    children: [
      { id: 'help_getting_started', title: 'শুরু করার নির্দেশিকা', englishTitle: 'Getting Started', route: '/help-guide/getting-started', description: 'সফটওয়্যার ব্যবহারের প্রাথমিক ধাপসমূহ' },
      { id: 'help_user_manual', title: 'ব্যবহার নির্দেশিকা', englishTitle: 'User Manual', route: '/help-guide/user-manual', description: 'প্রতিটি ফিচারের বিস্তারিত ব্যবহার পদ্ধতি' },
      { id: 'help_faq', title: 'FAQ', englishTitle: 'FAQ', route: '/help-guide/faq', description: 'সাধারণ জিজ্ঞাসাসমূহ ও সমাধান' },
      { id: 'help_accounting', title: 'হিসাব ব্যবস্থাপনা নির্দেশিকা', englishTitle: 'Accounting Guide', route: '/help-guide/accounting-guide', description: 'খাত, তহবিল ও হিসাবের সঠিক ব্যবহার নির্দেশিকা' },
      { id: 'help_halal_business', title: 'হালাল ব্যবসা নির্দেশিকা', englishTitle: 'Halal Business Guide', route: '/help-guide/halal-business-guide', description: 'মুরাবাহা ও কিস্তি বিক্রয়ের সুদমুক্ত নিয়মনীতি' },
      { id: 'help_shariah_principles', title: 'শরিয়াহ নীতিমালা', englishTitle: 'Shariah Governance', route: '/help-guide/shariah-principles', description: 'তথ্যবহুল শরিয়াহ নির্দেশিকা (এটি ফতোয়া প্রদানকারী নয়)' },
      { id: 'help_support', title: 'যোগাযোগ / Support', englishTitle: 'Support', route: '/help-guide/support', description: 'টেকনিক্যাল সাপোর্ট ও হেল্পডেস্ক' },
      { id: 'help_about', title: 'About', englishTitle: 'About Us', route: '/help-guide/about', description: 'সফটওয়্যার পরিচিতি ও টিম' },
    ]
  }
];

interface NavigationExplorerProps {
  activeOrg?: OrganizationContext;
  onOrgChange?: (org: OrganizationContext) => void;
}

export const NavigationExplorer: React.FC<NavigationExplorerProps> = ({
  activeOrg,
  onOrgChange,
}) => {
  const [selectedParentId, setSelectedParentId] = useState<string>('organization_security');
  const [selectedChildId, setSelectedChildId] = useState<string>('org_info');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [mobileSubSheetOpen, setMobileSubSheetOpen] = useState<boolean>(false);

  const selectedModule = MAIN_MODULES.find(m => m.id === selectedParentId) || MAIN_MODULES[0];
  const selectedChild = selectedModule.children.find(c => c.id === selectedChildId) || selectedModule.children[0];

  const handleSelectParent = (module: ParentModule) => {
    setSelectedParentId(module.id);
    if (module.children.length > 0) {
      setSelectedChildId(module.children[0].id);
    }
    setMobileDrawerOpen(false);
  };

  const handleSelectChild = (child: SubRoute) => {
    setSelectedChildId(child.id);
    setMobileSubSheetOpen(false);
  };

  // Breadcrumb calculation
  const breadcrumbs = [
    { title: 'ড্যাশবোর্ড', route: '/dashboard' },
    { title: selectedModule.title, route: selectedModule.route },
    ...(selectedChild ? [{ title: selectedChild.title, route: selectedChild.route }] : [])
  ];

  // Search filtered routes
  const filteredModules = MAIN_MODULES.map(m => ({
    ...m,
    matchingChildren: m.children.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.route.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(m => 
    m.matchingChildren.length > 0 || 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.englishTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Viewport Mode Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-heading">
              ২-স্তর নেভিগেশন ও সাইডবার আর্কিটেকচার ওয়ার্কবেঞ্চ (Prompt 1.3)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-body">
            ১৩টি মূল প্যারেন্ট মডিউল (Main Sidebar) এবং তাদের অধীনস্থ ৯০+ চাইল্ড রুট (Internal Sub-sidebar) এর ইন্টারঅ্যাকটিভ টেস্ট।
          </p>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewportMode === 'desktop' 
                ? 'bg-white text-emerald-800 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop (২ সাইডবার)</span>
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewportMode === 'tablet' 
                ? 'bg-white text-emerald-800 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (আইকন বার)</span>
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewportMode === 'mobile' 
                ? 'bg-white text-emerald-800 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (ড্রয়ার মোড)</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Container */}
      <div className="bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-700">
        <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-700 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Interactive Flutter Shell Emulator</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-slate-800 px-2.5 py-1 rounded text-emerald-400 font-mono text-[11px]">
              Active: {selectedChild ? selectedChild.route : selectedModule.route}
            </span>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="mt-3 bg-[#F8F9FA] rounded-xl overflow-hidden shadow-inner min-h-[620px] flex flex-col">
          
          {/* Top Organization & Status Bar */}
          <div className="bg-[#0F5132] text-white px-4 py-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              {viewportMode === 'mobile' && (
                <button 
                  onClick={() => setMobileDrawerOpen(true)}
                  className="p-1 rounded-md bg-emerald-800/80 hover:bg-emerald-700 text-white"
                  title="মেনু ড্রয়ার খুলুন"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}
              {viewportMode === 'mobile' ? (
                <TSSLogo variant="icon" theme="emerald" size="sm" />
              ) : (
                <TSSLogo variant="compact" theme="emerald" size="sm" showBangla={true} />
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-50">
                <Building2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>খুরুশকুল ওলামা সমিতি</span>
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-900 rounded font-mono text-[9px] font-bold">
                  DEMO
                </span>
              </div>
            </div>
          </div>

          {/* Dual-Sidebar & Canvas Layout */}
          <div className="flex flex-1 overflow-hidden relative">
            
            {/* LEVEL 1: Main Sidebar (Desktop / Tablet) */}
            {viewportMode !== 'mobile' && (
              <div 
                className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-200 ${
                  viewportMode === 'tablet' || isSidebarCollapsed ? 'w-18' : 'w-64'
                }`}
              >
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  {!(viewportMode === 'tablet' || isSidebarCollapsed) && (
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      মেইন মেনু (স্তর ১)
                    </span>
                  )}
                  {viewportMode === 'desktop' && (
                    <button
                      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 ml-auto"
                      title={isSidebarCollapsed ? 'প্রসারিত করুন' : 'সংকুচিত করুন'}
                    >
                      {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Parent Module List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {MAIN_MODULES.map((module) => {
                    const Icon = module.icon;
                    const isSelected = module.id === selectedParentId;

                    return (
                      <button
                        key={module.id}
                        onClick={() => handleSelectParent(module)}
                        title={module.title}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs transition font-heading min-h-[48px] ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-800' : 'text-slate-500'}`} />
                        
                        {!(viewportMode === 'tablet' || isSidebarCollapsed) && (
                          <>
                            <span className="flex-1 truncate">{module.title}</span>
                            {module.isStandalone ? (
                              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-numeric">
                                একক
                              </span>
                            ) : (
                              <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-slate-100 text-[11px] text-slate-400 text-center font-mono">
                  {!(viewportMode === 'tablet' || isSidebarCollapsed) && '১৩টি প্যারেন্ট মডিউল'}
                </div>
              </div>
            )}

            {/* LEVEL 2: Internal Sub-sidebar (Desktop / Tablet) */}
            {viewportMode !== 'mobile' && selectedModule.children.length > 0 && (
              <div className="w-60 bg-slate-50 border-r border-slate-200/80 flex flex-col">
                <div className="p-3.5 border-b border-slate-200/80">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs font-heading">
                    <selectedModule.icon className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span className="truncate">{selectedModule.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 font-body">
                    উপ-মেনু তালিকা (স্তর ২)
                  </p>
                </div>

                {/* Sub Routes List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {selectedModule.children.map((child) => {
                    const isSelected = child.id === selectedChildId;

                    return (
                      <button
                        key={child.id}
                        onClick={() => handleSelectChild(child)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition font-body min-h-[44px] ${
                          isSelected
                            ? 'bg-white text-emerald-900 font-bold border border-emerald-300 shadow-xs'
                            : 'text-slate-700 hover:bg-slate-200/60 font-normal'
                        }`}
                      >
                        <span className="truncate">{child.title}</span>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-2.5 border-t border-slate-200/80 text-[10px] text-slate-500 text-center font-numeric">
                  মোট {selectedModule.children.length}টি সাব-রুট
                </div>
              </div>
            )}

            {/* Mobile Drawer Overlay */}
            {viewportMode === 'mobile' && mobileDrawerOpen && (
              <div className="absolute inset-0 bg-black/50 z-40 flex">
                <div className="w-4/5 max-w-[300px] bg-white h-full flex flex-col shadow-2xl">
                  <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm font-heading">মেইন মেনু (১৩টি মডিউল)</h4>
                      <p className="text-[11px] text-emerald-200">তিজারাহ সমিতি সফটওয়্যার</p>
                    </div>
                    <button 
                      onClick={() => setMobileDrawerOpen(false)}
                      className="p-1 rounded text-white/80 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {MAIN_MODULES.map((module) => {
                      const Icon = module.icon;
                      const isSelected = module.id === selectedParentId;

                      return (
                        <button
                          key={module.id}
                          onClick={() => handleSelectParent(module)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-heading ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-800' : 'text-slate-500'}`} />
                            <span>{module.title}</span>
                          </div>
                          {module.children.length > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex-1" onClick={() => setMobileDrawerOpen(false)}></div>
              </div>
            )}

            {/* MAIN CONTENT CANVAS */}
            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
              
              {/* Breadcrumb & Navigation Bar */}
              <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-body">
                  {breadcrumbs.map((b, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                      <span className={idx === breadcrumbs.length - 1 ? 'font-bold text-emerald-900 font-heading' : 'hover:underline cursor-pointer'}>
                        {b.title}
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                {/* Mobile Sub-menu Trigger */}
                {viewportMode === 'mobile' && selectedModule.children.length > 0 && (
                  <button
                    onClick={() => setMobileSubSheetOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-semibold text-xs border border-emerald-200"
                  >
                    <span>উপ-মেনু ({selectedModule.children.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Active Route Workspace Placeholder */}
              <div className="p-6 space-y-6 flex-1">
                {/* Dedicated Prompt 2.1 Organization Management View when on org_info */}
                {selectedChild?.id === 'org_info' && activeOrg && onOrgChange ? (
                  <OrganizationManagementView
                    organization={activeOrg}
                    onUpdateOrganization={onOrgChange}
                  />
                ) : null}

                {/* Route Header Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
                  <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <selectedModule.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-lg font-bold text-slate-800 font-heading">
                        {selectedChild ? selectedChild.title : selectedModule.title}
                      </h2>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {selectedChild ? selectedChild.route : selectedModule.route}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                        Active Route
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 font-body">
                      {selectedChild ? selectedChild.description : selectedModule.description}
                    </p>
                  </div>
                </div>

                {/* Architectural Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Navigation State Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      নেভিগেশন স্টেট ও কন্টেক্সট
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Parent Module (স্তর ১):</span>
                        <span className="font-semibold text-slate-800">{selectedModule.title}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">English Identifier:</span>
                        <span className="font-mono text-slate-800">{selectedModule.englishTitle}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Current Sub-route (স্তর ২):</span>
                        <span className="font-semibold text-emerald-800">{selectedChild ? selectedChild.title : 'একক ড্যাশবোর্ড'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Permission Key:</span>
                        <span className="font-mono text-slate-600">ROLE_ALLOW_{selectedModule.id.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shariah & Financial Scope Rule Verification Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      Scope & Compliance Rules
                    </h4>
                    <div className="space-y-1.5 text-xs font-body">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>৩টি আর্থিক মাত্রা (Head ≠ Fund ≠ Account) সংরক্ষিত</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>Generic Funds (Admin, General, Share, Project, Custom)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>০টি হার্ডকোডেড বিজনেস ক্যালকুলেশন (Pure Navigation)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>শরিয়াহ নীতিমালা শুধুমাত্র তথ্যবহুল গাইডলাইন</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-routes Explorer for Current Parent */}
                {selectedModule.children.length > 0 && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading">
                        {selectedModule.title} — সকল সাব-মডিউল তালিকা
                      </h4>
                      <span className="text-[11px] text-slate-500 font-numeric">
                        মোট {selectedModule.children.length}টি রুট
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {selectedModule.children.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => handleSelectChild(c)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                            c.id === selectedChildId
                              ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300'
                              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 font-heading truncate">
                              {c.title}
                            </span>
                            {c.id === selectedChildId && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            )}
                          </div>
                          <div className="font-mono text-[10px] text-slate-500 mt-1 truncate">
                            {c.route}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 font-body">
                            {c.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
