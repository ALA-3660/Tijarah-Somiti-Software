import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  ArrowRight, 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Printer, 
  Eye, 
  EyeOff, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Briefcase, 
  CreditCard, 
  History, 
  Layers, 
  Filter, 
  X, 
  Check, 
  ChevronRight, 
  RotateCcw,
  AlertTriangle,
  UserPlus,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { 
  MembershipApplicationType, 
  MembershipApplicationStatus, 
  VerificationChecklistItemType, 
  ApplicationTimelineEventType,
  OrganizationContext,
  MemberType
} from '../types';

interface MembershipApplicationManagementViewProps {
  currentOrg: OrganizationContext;
  onSyncOrganization?: (orgId: string, orgName: string) => void;
}

// Initial Mock Seed for Applications (Organization Scoped)
const SEED_APPLICATIONS: Record<string, MembershipApplicationType[]> = {
  'demo-org-khurushkul': [
    {
      id: 'app-seed-001',
      organizationId: 'demo-org-khurushkul',
      applicationCode: 'APP-000001',
      applicantFullName: 'মাওলানা আব্দুল হক চৌধুরী',
      mobile: '01812999001',
      email: 'abdul.haq@khurushkul.org',
      dateOfBirth: '1989-04-12',
      gender: 'male',
      occupation: 'মাদ্রাসা শিক্ষক',
      fatherOrSpouseName: 'মরহুম নুরুল ইসলাম চৌধুরী',
      motherName: 'ফাতেমা বেগম',
      currentAddress: 'দক্ষিণ খুরুশকুল, কক্সবাজার সদর',
      permanentAddress: 'দক্ষিণ খুরুশকুল, কক্সবাজার সদর',
      isSameAddress: true,
      nid: '19891234567890123',
      photoReference: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      notes: 'স্থানীয় ওলামা পরিষদের সুপারিশপ্রাপ্ত আবেদন।',
      applicationStatus: 'under_review',
      submittedAt: '2026-09-18T10:00:00.000Z',
      verifiedAt: '2026-09-20T11:30:00.000Z',
      verifiedBy: 'যাচাইকারী কর্মকর্তা মোর্শেদ',
      createdAt: '2026-09-17T09:00:00.000Z',
      updatedAt: '2026-09-20T11:30:00.000Z',
      createdBy: 'usr-officer-01',
      checklist: [
        { id: 'chk-1', title: 'পরিচয় তথ্য যাচাই', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: '2026-09-20T11:00:00.000Z' },
        { id: 'chk-2', title: 'মোবাইল নম্বর সত্যতা যাচাই', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: '2026-09-20T11:05:00.000Z' },
        { id: 'chk-3', title: 'ঠিকানা সরেজমিন পরিদর্শন', isVerified: false, note: 'স্থানীয় মসজিদ কমিটির প্রত্যয়নপত্র চলমান' },
        { id: 'chk-4', title: 'পারিবারিক তথ্য যাচাই', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: '2026-09-20T11:15:00.000Z' },
        { id: 'chk-5', title: 'জাতীয় পরিচয়পত্র (NID) সত্যতা যাচাই', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: '2026-09-20T11:20:00.000Z' },
        { id: 'chk-6', title: 'ছবি ও সাক্ষর সঠিকতা', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: '2026-09-20T11:25:00.000Z' },
      ],
      timeline: [
        { id: 'evt-1', applicationId: 'app-seed-001', event: 'MEMBERSHIP_APPLICATION_CREATED', actorName: 'ফিল্ড অফিসার জাকির', actorId: 'usr-officer-01', timestamp: '2026-09-17T09:00:00.000Z', note: 'প্রাথমিক খসড়া তৈরি হয়েছে' },
        { id: 'evt-2', applicationId: 'app-seed-001', event: 'MEMBERSHIP_APPLICATION_SUBMITTED', actorName: 'মাওলানা আব্দুল হক চৌধুরী', actorId: 'applicant', timestamp: '2026-09-18T10:00:00.000Z', previousStatus: 'draft', newStatus: 'submitted', note: 'আবেদন আনুষ্ঠানিকভাবে জমা দেওয়া হয়েছে' },
        { id: 'evt-3', applicationId: 'app-seed-001', event: 'MEMBERSHIP_APPLICATION_REVIEW_STARTED', actorName: 'যাচাইকারী কর্মকর্তা মোর্শেদ', actorId: 'usr-admin-01', timestamp: '2026-09-20T11:30:00.000Z', previousStatus: 'submitted', newStatus: 'under_review', note: 'কাগজপত্র নিরীক্ষা শুরু হয়েছে' },
      ],
    },
    {
      id: 'app-seed-002',
      organizationId: 'demo-org-khurushkul',
      applicationCode: 'APP-000002',
      applicantFullName: 'ক্বারী মোহাম্মদ হাবিবুর রহমান',
      mobile: '01812999002',
      email: 'habib.qari@gmail.com',
      dateOfBirth: '1994-08-20',
      gender: 'male',
      occupation: 'ইমাম ও খতীব',
      fatherOrSpouseName: 'আহমদ উল্লাহ',
      motherName: 'মরিয়ম খাতুন',
      currentAddress: 'ঘোনারপাড়া, কক্সবাজার',
      permanentAddress: 'দক্ষিণ খুরুশকুল, কক্সবাজার সদর',
      isSameAddress: false,
      nid: '19942233445566778',
      notes: 'আবেদনের স্থায়ী ঠিকানার ডকুমেন্টে ত্রুটি থাকায় সংশোধন চাওয়া হয়েছিল।',
      applicationStatus: 'correction_required',
      submittedAt: '2026-09-15T14:00:00.000Z',
      createdAt: '2026-09-14T11:00:00.000Z',
      updatedAt: '2026-09-19T16:00:00.000Z',
      createdBy: 'usr-officer-01',
      correctionReason: 'স্থায়ী ঠিকানার ইউনিয়ন পরিষদ প্রত্যয়নপত্র বা ইউটিলিটি বিলের কপি সংযুক্ত করতে হবে।',
      checklist: [
        { id: 'chk-1', title: 'পরিচয় তথ্য যাচাই', isVerified: true },
        { id: 'chk-2', title: 'মোবাইল নম্বর সত্যতা যাচাই', isVerified: true },
        { id: 'chk-3', title: 'ঠিকানা সরেজমিন পরিদর্শন', isVerified: false, note: 'স্থায়ী ঠিকানার প্রত্যয়ন অসম্পূর্ণ' },
        { id: 'chk-4', title: 'পারিবারিক তথ্য যাচাই', isVerified: true },
        { id: 'chk-5', title: 'জাতীয় পরিচয়পত্র (NID) সত্যতা যাচাই', isVerified: true },
        { id: 'chk-6', title: 'ছবি ও সাক্ষর সঠিকতা', isVerified: true },
      ],
      timeline: [
        { id: 'evt-4', applicationId: 'app-seed-002', event: 'MEMBERSHIP_APPLICATION_CREATED', actorName: 'ফিল্ড অফিসার জাকির', actorId: 'usr-officer-01', timestamp: '2026-09-14T11:00:00.000Z' },
        { id: 'evt-5', applicationId: 'app-seed-002', event: 'MEMBERSHIP_APPLICATION_SUBMITTED', actorName: 'ক্বারী হাবিবুর রহমান', actorId: 'applicant', timestamp: '2026-09-15T14:00:00.000Z', previousStatus: 'draft', newStatus: 'submitted' },
        { id: 'evt-6', applicationId: 'app-seed-002', event: 'MEMBERSHIP_APPLICATION_CORRECTION_REQUIRED', actorName: 'যাচাইকারী কর্মকর্তা মোর্শেদ', actorId: 'usr-admin-01', timestamp: '2026-09-19T16:00:00.000Z', previousStatus: 'under_review', newStatus: 'correction_required', note: 'স্থায়ী ঠিকানার প্রমাণাদি চাওয়া হয়েছে' },
      ],
    },
    {
      id: 'app-seed-003',
      organizationId: 'demo-org-khurushkul',
      applicationCode: 'APP-000003',
      applicantFullName: 'হাফেজ মোশাররফ হোসেন',
      mobile: '01812999003',
      dateOfBirth: '1996-11-05',
      gender: 'male',
      occupation: 'হাফেজ ও শিক্ষক',
      currentAddress: 'পৌরসভা এলাকা, কক্সবাজার',
      applicationStatus: 'draft',
      createdAt: '2026-09-21T08:00:00.000Z',
      updatedAt: '2026-09-21T08:00:00.000Z',
      createdBy: 'usr-officer-02',
      checklist: [],
      timeline: [
        { id: 'evt-7', applicationId: 'app-seed-003', event: 'MEMBERSHIP_APPLICATION_CREATED', actorName: 'ডাটা এন্ট্রি অপারেটর', actorId: 'usr-officer-02', timestamp: '2026-09-21T08:00:00.000Z', note: 'প্রাথমিক আবেদন খসড়া সংরক্ষিত' },
      ],
    },
    {
      id: 'app-seed-004',
      organizationId: 'demo-org-khurushkul',
      applicationCode: 'APP-000004',
      applicantFullName: 'মুহতারাম নূরুল আমিন সাহেব',
      mobile: '01812999004',
      email: 'nurul.amin@coxsbazar.com',
      dateOfBirth: '1982-01-10',
      gender: 'male',
      occupation: 'ব্যবসায়ী',
      fatherOrSpouseName: 'আলহাজ্ব বদরুদ্দিন',
      motherName: 'আমেনা খাতুন',
      currentAddress: 'খুরুশকুল বাজার, কক্সবাজার',
      permanentAddress: 'খুরুশকুল বাজার, কক্সবাজার',
      isSameAddress: true,
      nid: '19821234567890999',
      applicationStatus: 'approved',
      submittedAt: '2026-09-10T09:00:00.000Z',
      verifiedAt: '2026-09-12T10:00:00.000Z',
      decidedAt: '2026-09-14T15:00:00.000Z',
      verifiedBy: 'যাচাইকারী কর্মকর্তা মোর্শেদ',
      decidedBy: 'সভাপতি মাওলানা ইব্রাহীম',
      decisionReason: 'সকল শর্ত পূরণ করায় সাধারণ সদস্য হিসেবে অনুমোদন দেওয়া হলো।',
      createdAt: '2026-09-09T10:00:00.000Z',
      updatedAt: '2026-09-14T15:00:00.000Z',
      createdBy: 'usr-officer-01',
      approvedMemberId: 'mem-001',
      checklist: [
        { id: 'chk-1', title: 'পরিচয় তথ্য যাচাই', isVerified: true },
        { id: 'chk-2', title: 'মোবাইল নম্বর সত্যতা যাচাই', isVerified: true },
        { id: 'chk-3', title: 'ঠিকানা সরেজমিন পরিদর্শন', isVerified: true },
        { id: 'chk-4', title: 'পারিবারিক তথ্য যাচাই', isVerified: true },
        { id: 'chk-5', title: 'জাতীয় পরিচয়পত্র (NID) সত্যতা যাচাই', isVerified: true },
        { id: 'chk-6', title: 'ছবি ও সাক্ষর সঠিকতা', isVerified: true },
      ],
      timeline: [
        { id: 'evt-8', applicationId: 'app-seed-004', event: 'MEMBERSHIP_APPLICATION_CREATED', actorName: 'ফিল্ড অফিসার', actorId: 'usr-officer-01', timestamp: '2026-09-09T10:00:00.000Z' },
        { id: 'evt-9', applicationId: 'app-seed-004', event: 'MEMBERSHIP_APPLICATION_SUBMITTED', actorName: 'আবেদনকারী', actorId: 'applicant', timestamp: '2026-09-10T09:00:00.000Z' },
        { id: 'evt-10', applicationId: 'app-seed-004', event: 'MEMBERSHIP_APPLICATION_APPROVED', actorName: 'সভাপতি মাওলানা ইব্রাহীম', actorId: 'usr-director-01', timestamp: '2026-09-14T15:00:00.000Z', note: 'আবেদন অনুমোদিত হয়েছে' },
        { id: 'evt-11', applicationId: 'app-seed-004', event: 'MEMBER_CREATED_FROM_APPLICATION', actorName: 'সিস্টেম', actorId: 'system', timestamp: '2026-09-14T15:00:00.000Z', note: 'মেম্বার আইডি MEM-000001 বরাদ্দ করা হয়েছে' },
      ],
    }
  ],
  'org-alfalah-01': [
    {
      id: 'app-alf-001',
      organizationId: 'org-alfalah-01',
      applicationCode: 'APP-000001',
      applicantFullName: 'জনাব শরিফুল ইসলাম',
      mobile: '01711998877',
      email: 'shariful.alfalah@gmail.com',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      occupation: 'চাকুরিজীবী',
      currentAddress: 'মিরপুর-১০, ঢাকা',
      applicationStatus: 'submitted',
      submittedAt: '2026-09-19T09:30:00.000Z',
      createdAt: '2026-09-18T10:00:00.000Z',
      updatedAt: '2026-09-19T09:30:00.000Z',
      createdBy: 'usr-alf-admin',
      checklist: [],
      timeline: [
        { id: 'evt-alf-1', applicationId: 'app-alf-001', event: 'MEMBERSHIP_APPLICATION_SUBMITTED', actorName: 'শরিফুল ইসলাম', timestamp: '2026-09-19T09:30:00.000Z', note: 'আল-ফালাহ সমিতিতে সদস্যপদ আবেদন জমা' },
      ],
    }
  ]
};

// Existing Member Seeds for Duplicate Detection
const EXISTING_MEMBERS: Record<string, { mobile: string; nid?: string; fullName: string; dateOfBirth?: string; memberCode: string }[]> = {
  'demo-org-khurushkul': [
    { mobile: '01812000001', nid: '19851234567890123', fullName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল', dateOfBirth: '1985-03-15', memberCode: 'MEM-000001' },
    { mobile: '01812000002', nid: '19881234567890456', fullName: 'কারী ফজলুল করিম', dateOfBirth: '1988-07-22', memberCode: 'MEM-000002' },
  ],
  'org-alfalah-01': [
    { mobile: '01711223344', nid: '19801234567890111', fullName: 'জনাব মাহমুদুর রহমান', memberCode: 'MEM-000001' },
  ]
};

export function MembershipApplicationManagementView({ currentOrg, onSyncOrganization }: MembershipApplicationManagementViewProps) {
  // Store applications per organization
  const [applicationsMap, setApplicationsMap] = useState<Record<string, MembershipApplicationType[]>>(SEED_APPLICATIONS);

  // Active Role Simulation (RBAC)
  const [activeRole, setActiveRole] = useState<'admin' | 'reviewer' | 'approver' | 'operator' | 'viewer'>('admin');
  const [currentUserId, setCurrentUserId] = useState<string>('usr-director-01'); // Approver/Director

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppId, setSelectedAppId] = useState<string | null>('app-seed-001');

  // Detail UI States
  const [revealedNids, setRevealedNids] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'info' | 'checklist' | 'timeline'>('info');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Form State for New / Edit Application
  const [formData, setFormData] = useState({
    applicantFullName: '',
    mobile: '',
    email: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    occupation: '',
    fatherOrSpouseName: '',
    motherName: '',
    currentAddress: '',
    permanentAddress: '',
    isSameAddress: true,
    nid: '',
    photoReference: '',
    notes: '',
  });

  // Action Input States
  const [actionReason, setActionReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Current Organization's Applications
  const currentOrgApplications = useMemo(() => {
    return applicationsMap[currentOrg.id] || [];
  }, [applicationsMap, currentOrg.id]);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return currentOrgApplications.filter(app => {
      if (statusFilter !== 'all' && app.applicationStatus !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = app.applicantFullName.toLowerCase().includes(q);
        const matchCode = app.applicationCode.toLowerCase().includes(q);
        const matchMobile = app.mobile.includes(q);
        return matchName || matchCode || matchMobile;
      }
      return true;
    });
  }, [currentOrgApplications, statusFilter, searchQuery]);

  // Selected Application
  const selectedApp = useMemo(() => {
    return currentOrgApplications.find(a => a.id === selectedAppId) || filteredApplications[0] || null;
  }, [currentOrgApplications, selectedAppId, filteredApplications]);

  // Dynamic Age calculation
  const calculateAge = (dobString?: string) => {
    if (!dobString) return 'তথ্য নেই';
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return 'তথ্য নেই';
    const now = new Date();
    if (dob > now) return 'ভবিষ্যৎ তারিখ গ্রহণযোগ্য নয়';
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 0) return 'তথ্য নেই';
    const enToBn: Record<string, string> = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    const bnAge = age.toString().split('').map(c => enToBn[c] || c).join('');
    return `${bnAge} বছর`;
  };

  // Mask NID
  const maskNid = (nid?: string) => {
    if (!nid || nid.trim() === '') return 'তথ্য নেই';
    const trimmed = nid.trim();
    if (trimmed.length <= 4) return '****';
    const visiblePart = trimmed.slice(-4);
    const maskedLength = trimmed.length - 4;
    return '*'.repeat(maskedLength) + visiblePart;
  };

  // Status Badge Helper
  const getStatusBadge = (status: MembershipApplicationStatus) => {
    switch (status) {
      case 'draft':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">খসড়া (Draft)</span>;
      case 'submitted':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">জমা দেওয়া হয়েছে</span>;
      case 'under_review':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">যাচাইাধীন (Review)</span>;
      case 'correction_required':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">সংশোধন প্রয়োজন</span>;
      case 'resubmitted':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">পুনরায় জমা</span>;
      case 'approved':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">অনুমোদিত (Approved)</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">প্রত্যাখ্যাত (Rejected)</span>;
      case 'withdrawn':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">প্রত্যাহৃত (Withdrawn)</span>;
    }
  };

  // RBAC Permission Check
  const hasPermission = (permission: string) => {
    if (activeRole === 'admin') return true;
    if (activeRole === 'reviewer') {
      return ['membership.application.view', 'membership.application.review', 'membership.application.correction', 'membership.application.print'].includes(permission);
    }
    if (activeRole === 'approver') {
      return ['membership.application.view', 'membership.application.approve', 'membership.application.reject', 'membership.application.print'].includes(permission);
    }
    if (activeRole === 'operator') {
      return ['membership.application.view', 'membership.application.create', 'membership.application.edit', 'membership.application.submit', 'membership.application.withdraw'].includes(permission);
    }
    if (activeRole === 'viewer') {
      return ['membership.application.view'].includes(permission);
    }
    return false;
  };

  // Real-time Duplicate Checking
  const duplicateCheck = useMemo(() => {
    if (!formData.mobile && !formData.nid && !formData.applicantFullName) {
      return { memberMatch: null, activeAppMatch: null };
    }
    // 1. Existing Member Match
    const orgMembers = EXISTING_MEMBERS[currentOrg.id] || [];
    let memberMatch = null;
    for (const m of orgMembers) {
      if (formData.mobile && m.mobile === formData.mobile.trim()) {
        memberMatch = { reason: 'মোবাইল নম্বর', code: m.memberCode, name: m.fullName };
        break;
      }
      if (formData.nid && m.nid && m.nid === formData.nid.trim()) {
        memberMatch = { reason: 'জাতীয় পরিচয়পত্র (NID)', code: m.memberCode, name: m.fullName };
        break;
      }
    }

    // 2. Active Application Match in Same Organization
    let activeAppMatch = null;
    for (const app of currentOrgApplications) {
      const isActive = ['draft', 'submitted', 'under_review', 'correction_required', 'resubmitted'].includes(app.applicationStatus);
      if (isActive) {
        if (formData.mobile && app.mobile === formData.mobile.trim()) {
          activeAppMatch = { reason: 'মোবাইল নম্বর', code: app.applicationCode, name: app.applicantFullName, status: app.applicationStatus };
          break;
        }
        if (formData.nid && app.nid && app.nid === formData.nid.trim()) {
          activeAppMatch = { reason: 'জাতীয় পরিচয়পত্র (NID)', code: app.applicationCode, name: app.applicantFullName, status: app.applicationStatus };
          break;
        }
      }
    }

    return { memberMatch, activeAppMatch };
  }, [formData.mobile, formData.nid, formData.applicantFullName, currentOrg.id, currentOrgApplications]);

  // Open Create Dialog
  const handleOpenCreateModal = () => {
    setFormData({
      applicantFullName: '',
      mobile: '',
      email: '',
      dateOfBirth: '',
      gender: 'male',
      occupation: '',
      fatherOrSpouseName: '',
      motherName: '',
      currentAddress: '',
      permanentAddress: '',
      isSameAddress: true,
      nid: '',
      photoReference: '',
      notes: '',
    });
    setFormError(null);
    setIsNewModalOpen(true);
  };

  // Submit / Save New Application
  const handleSaveNewApplication = (asDraft: boolean) => {
    // Validation
    if (!formData.applicantFullName.trim()) {
      setFormError('আবেদনকারীর পূর্ণ নাম লিখুন');
      return;
    }
    if (!formData.mobile.trim()) {
      setFormError('মোবাইল নম্বর লিখুন');
      return;
    }
    const mobileRegex = /^01[3-9]\d{8}$/;
    if (!mobileRegex.test(formData.mobile.trim())) {
      setFormError('সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01812345678)');
      return;
    }
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      if (dob > new Date()) {
        setFormError('ভবিষ্যতের জন্মতারিখ গ্রহণযোগ্য নয়');
        return;
      }
    }

    const nextCount = currentOrgApplications.length + 1;
    const newCode = `APP-${nextCount.toString().padStart(6, '0')}`;
    const newId = `app-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const initialChecklist: VerificationChecklistItemType[] = [
      { id: 'chk-1', title: 'পরিচয় তথ্য যাচাই', isVerified: false },
      { id: 'chk-2', title: 'মোবাইল নম্বর সত্যতা যাচাই', isVerified: false },
      { id: 'chk-3', title: 'ঠিকানা সরেজমিন পরিদর্শন', isVerified: false },
      { id: 'chk-4', title: 'পারিবারিক তথ্য যাচাই', isVerified: false },
      { id: 'chk-5', title: 'জাতীয় পরিচয়পত্র (NID) সত্যতা যাচাই', isVerified: false },
      { id: 'chk-6', title: 'ছবি ও সাক্ষর সঠিকতা', isVerified: false },
    ];

    const initialTimeline: ApplicationTimelineEventType[] = [
      {
        id: `evt-${Date.now()}`,
        applicationId: newId,
        event: 'MEMBERSHIP_APPLICATION_CREATED',
        actorName: 'ডাটা এন্ট্রি কর্মকর্তা',
        actorId: currentUserId,
        timestamp: nowIso,
        note: asDraft ? 'প্রাথমিক খসড়া তৈরি হয়েছে' : 'আবেদনপত্র তৈরি ও সরাসরি জমা দেওয়া হয়েছে',
      }
    ];

    if (!asDraft) {
      initialTimeline.push({
        id: `evt-sub-${Date.now()}`,
        applicationId: newId,
        event: 'MEMBERSHIP_APPLICATION_SUBMITTED',
        actorName: formData.applicantFullName,
        actorId: 'applicant',
        timestamp: nowIso,
        previousStatus: 'draft',
        newStatus: 'submitted',
        note: 'আবেদন আনুষ্ঠানিকভাবে জমা দেওয়া হয়েছে',
      });
    }

    const newApp: MembershipApplicationType = {
      id: newId,
      organizationId: currentOrg.id,
      applicationCode: newCode,
      applicantFullName: formData.applicantFullName.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim() || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender,
      occupation: formData.occupation.trim() || undefined,
      fatherOrSpouseName: formData.fatherOrSpouseName.trim() || undefined,
      motherName: formData.motherName.trim() || undefined,
      currentAddress: formData.currentAddress.trim() || undefined,
      permanentAddress: formData.isSameAddress ? (formData.currentAddress.trim() || undefined) : (formData.permanentAddress.trim() || undefined),
      isSameAddress: formData.isSameAddress,
      nid: formData.nid.trim() || undefined,
      photoReference: formData.photoReference.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      applicationStatus: asDraft ? 'draft' : 'submitted',
      submittedAt: asDraft ? undefined : nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: currentUserId,
      checklist: initialChecklist,
      timeline: initialTimeline,
    };

    setApplicationsMap(prev => ({
      ...prev,
      [currentOrg.id]: [newApp, ...(prev[currentOrg.id] || [])]
    }));

    setSelectedAppId(newId);
    setIsNewModalOpen(false);
    setNotification({
      type: 'success',
      message: asDraft ? `আবেদন খসড়া (${newCode}) সফলভাবে সংরক্ষিত হয়েছে` : `আবেদন (${newCode}) সফলভাবে জমা হয়েছে`
    });
  };

  // State Transition Actions
  const handleTransition = (
    targetStatus: MembershipApplicationStatus, 
    reason?: string,
    eventCode?: string
  ) => {
    if (!selectedApp) return;

    // Concurrency / Duplicate Approval Guard
    if (targetStatus === 'approved' && selectedApp.applicationStatus === 'approved') {
      setNotification({ type: 'error', message: 'এই আবেদনটি ইতোমধ্যে অনুমোদিত হয়েছে' });
      return;
    }

    // Separation of Duties Guard: Creator cannot approve
    if (targetStatus === 'approved' && selectedApp.createdBy === currentUserId) {
      setNotification({
        type: 'error',
        message: 'নিরাপত্তা নীতি লঙ্ঘন: আবেদন প্রস্তুতকারী কর্মকর্তা নিজের তৈরিকৃত আবেদন নিজে অনুমোদন করতে পারেন না (Creator ≠ Approver)'
      });
      return;
    }

    const nowIso = new Date().toISOString();
    const timelineEntry: ApplicationTimelineEventType = {
      id: `evt-${Date.now()}`,
      applicationId: selectedApp.id,
      event: eventCode || `MEMBERSHIP_APPLICATION_${targetStatus.toUpperCase()}`,
      actorName: activeRole === 'approver' ? 'পরিচালক / সভাপতি' : activeRole === 'reviewer' ? 'নিরীক্ষা কর্মকর্তা' : 'অফিসার',
      actorId: currentUserId,
      timestamp: nowIso,
      previousStatus: selectedApp.applicationStatus,
      newStatus: targetStatus,
      note: reason || undefined,
    };

    let memberCreatedEntry: ApplicationTimelineEventType | null = null;
    let newMemberId: string | undefined = selectedApp.approvedMemberId;

    if (targetStatus === 'approved') {
      newMemberId = `mem-created-${Date.now()}`;
      memberCreatedEntry = {
        id: `evt-mem-${Date.now()}`,
        applicationId: selectedApp.id,
        event: 'MEMBER_CREATED_FROM_APPLICATION',
        actorName: 'সিস্টেম অটোমেশন',
        actorId: 'system',
        timestamp: nowIso,
        note: `নতুন অফিশিয়াল সদস্য রেকর্ড তৈরি হয়েছে (সদস্য কোড বরাদ্দ সম্পন্ন)`,
      };
    }

    const updatedApp: MembershipApplicationType = {
      ...selectedApp,
      applicationStatus: targetStatus,
      updatedAt: nowIso,
      updatedBy: currentUserId,
      decidedAt: ['approved', 'rejected', 'withdrawn'].includes(targetStatus) ? nowIso : selectedApp.decidedAt,
      decidedBy: ['approved', 'rejected', 'withdrawn'].includes(targetStatus) ? currentUserId : selectedApp.decidedBy,
      decisionReason: reason || selectedApp.decisionReason,
      correctionReason: targetStatus === 'correction_required' ? reason : selectedApp.correctionReason,
      submittedAt: targetStatus === 'submitted' || targetStatus === 'resubmitted' ? nowIso : selectedApp.submittedAt,
      verifiedAt: targetStatus === 'under_review' ? nowIso : selectedApp.verifiedAt,
      verifiedBy: targetStatus === 'under_review' ? currentUserId : selectedApp.verifiedBy,
      approvedMemberId: newMemberId,
      timeline: [
        ...(selectedApp.timeline || []),
        timelineEntry,
        ...(memberCreatedEntry ? [memberCreatedEntry] : [])
      ]
    };

    setApplicationsMap(prev => ({
      ...prev,
      [currentOrg.id]: prev[currentOrg.id].map(a => a.id === selectedApp.id ? updatedApp : a)
    }));

    setNotification({
      type: 'success',
      message: `আবেদনের স্ট্যাটাস পরিবর্তিত হয়েছে: ${targetStatus}`
    });

    setIsCorrectionModalOpen(false);
    setIsApproveModalOpen(false);
    setIsRejectModalOpen(false);
    setIsWithdrawModalOpen(false);
    setActionReason('');
  };

  // Toggle Checklist Item
  const handleToggleChecklistItem = (itemId: string) => {
    if (!selectedApp || !hasPermission('membership.application.review')) return;
    const updatedChecklist = selectedApp.checklist.map(item => {
      if (item.id === itemId) {
        const nextState = !item.isVerified;
        return {
          ...item,
          isVerified: nextState,
          verifiedBy: nextState ? 'যাচাইকারী কর্মকর্তা' : undefined,
          verifiedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return item;
    });

    const updatedApp = {
      ...selectedApp,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString(),
    };

    setApplicationsMap(prev => ({
      ...prev,
      [currentOrg.id]: prev[currentOrg.id].map(a => a.id === selectedApp.id ? updatedApp : a)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Scope Protection & Principle Reminder Banner */}
      <div className="bg-emerald-900 text-emerald-100 p-4 rounded-2xl shadow-sm border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center text-emerald-300 font-bold border border-emerald-700">
            <FileCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-heading">
                সদস্যপদ আবেদন ও যাচাই ব্যবস্থাপনা (Membership Applications)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-100 uppercase tracking-wider font-numeric">
                Prompt 3.3
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 mt-0.5 font-body">
              <strong>Application ≠ Member:</strong> আবেদন অমীমাংসিত থাকা অবস্থায় কোনো সদস্য ব্যালেন্স, শেয়ার বা আর্থিক লেনদেন তৈরি হয় না।
            </p>
          </div>
        </div>

        {/* Simulated Role Selector (RBAC Testing) */}
        <div className="flex items-center gap-2 bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-800 text-xs">
          <span className="text-emerald-300 font-medium px-2">সিমুলেটেড রোল:</span>
          <select 
            value={activeRole}
            onChange={(e) => {
              const r = e.target.value as any;
              setActiveRole(r);
              if (r === 'operator') setCurrentUserId('usr-officer-01');
              else if (r === 'approver') setCurrentUserId('usr-director-01');
              else if (r === 'reviewer') setCurrentUserId('usr-reviewer-01');
              else setCurrentUserId('usr-admin-01');
            }}
            className="bg-emerald-900 border border-emerald-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
          >
            <option value="admin">সুপার এডমিন (সব অনুমতি)</option>
            <option value="operator">ডাটা এন্ট্রি কর্মকর্তা (খসড়া ও জমা)</option>
            <option value="reviewer">নিরীক্ষক / রিভিউয়ার (যাচাই ও সংশোধন)</option>
            <option value="approver">অনুমোদনকারী / পরিচালক (সিদ্ধান্ত)</option>
            <option value="viewer">সাধারণ দর্শক (শুধু দেখা)</option>
          </select>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs transition ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:bg-black/5 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Application List (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
            {/* Header & New Application Button */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0F5132]" />
                  আবেদন তালিকা
                </h3>
                <span className="text-[11px] text-slate-500 font-numeric">
                  মোট {filteredApplications.length}টি আবেদন ({currentOrg.shortName || currentOrg.name})
                </span>
              </div>

              {hasPermission('membership.application.create') && (
                <button
                  onClick={handleOpenCreateModal}
                  className="px-3 py-1.5 rounded-xl bg-[#0F5132] hover:bg-[#0c4128] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন আবেদন</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="নাম, আবেদন কোড (APP-000001) বা মোবাইল..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[11px] font-numeric">
              {[
                { key: 'all', label: 'সব' },
                { key: 'draft', label: 'খসড়া' },
                { key: 'submitted', label: 'জমা' },
                { key: 'under_review', label: 'যাচাইাধীন' },
                { key: 'correction_required', label: 'সংশোধন' },
                { key: 'approved', label: 'অনুমোদিত' },
                { key: 'rejected', label: 'প্রত্যাখ্যাত' },
                { key: 'withdrawn', label: 'প্রত্যাহৃত' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    statusFilter === tab.key
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Applications Scrollable List */}
            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto pr-1">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">কোনো আবেদন পাওয়া যায়নি</p>
                  <p className="text-[11px] text-slate-500 mt-1">অনুসন্ধান ফিল্টার পরিবর্তন করুন অথবা নতুন আবেদন তৈরি করুন।</p>
                </div>
              ) : (
                filteredApplications.map(app => {
                  const isSelected = selectedApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-emerald-50/70 border border-emerald-200 shadow-xs' 
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {app.applicationCode}
                          </span>
                          {getStatusBadge(app.applicationStatus)}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate font-heading">
                          {app.applicantFullName}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-numeric">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {app.mobile}
                          </span>
                          {app.submittedAt && (
                            <span className="flex items-center gap-1 text-[10px]">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {new Date(app.submittedAt).toLocaleDateString('bn-BD')}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-emerald-700 translate-x-0.5' : 'text-slate-300'}`} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Application Detail & Verification Actions (7 cols) */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-6">
              {/* Detail Header */}
              <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {selectedApp.applicationCode}
                    </span>
                    {getStatusBadge(selectedApp.applicationStatus)}
                    <span className="text-[11px] text-slate-500 font-numeric">
                      তৈরি: {new Date(selectedApp.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    {selectedApp.applicantFullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-body">
                    পেশা: {selectedApp.occupation || 'অনির্ধারিত'} • বয়স: {calculateAge(selectedApp.dateOfBirth)}
                  </p>
                </div>

                {/* Print Action */}
                {hasPermission('membership.application.print') && (
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>A4 প্রিন্ট প্রিভিউ</span>
                  </button>
                )}
              </div>

              {/* Status Action Buttons Bar */}
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 mr-1">কার্যক্রম:</span>

                {/* Draft State Actions */}
                {selectedApp.applicationStatus === 'draft' && hasPermission('membership.application.submit') && (
                  <button
                    onClick={() => handleTransition('submitted', 'আবেদন জমা দেওয়া হয়েছে', 'MEMBERSHIP_APPLICATION_SUBMITTED')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>আবেদন জমা দিন</span>
                  </button>
                )}

                {/* Submitted State Actions */}
                {selectedApp.applicationStatus === 'submitted' && hasPermission('membership.application.review') && (
                  <button
                    onClick={() => handleTransition('under_review', 'যাচাই কার্যক্রম শুরু হয়েছে', 'MEMBERSHIP_APPLICATION_REVIEW_STARTED')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 transition"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>যাচাই শুরু করুন (Review)</span>
                  </button>
                )}

                {/* Under Review Actions */}
                {selectedApp.applicationStatus === 'under_review' && (
                  <>
                    {hasPermission('membership.application.correction') && (
                      <button
                        onClick={() => setIsCorrectionModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>সংশোধন চান</span>
                      </button>
                    )}

                    {hasPermission('membership.application.approve') && (
                      <button
                        onClick={() => setIsApproveModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>অনুমোদন ও সদস্য তৈরি</span>
                      </button>
                    )}

                    {hasPermission('membership.application.reject') && (
                      <button
                        onClick={() => setIsRejectModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>প্রত্যাখ্যান করুন</span>
                      </button>
                    )}
                  </>
                )}

                {/* Correction Required State Actions */}
                {selectedApp.applicationStatus === 'correction_required' && hasPermission('membership.application.submit') && (
                  <button
                    onClick={() => handleTransition('resubmitted', 'সংশোধিত তথ্যসহ পুনরায় জমা দেওয়া হয়েছে', 'MEMBERSHIP_APPLICATION_RESUBMITTED')}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>পুনরায় জমা দিন (Resubmit)</span>
                  </button>
                )}

                {/* Resubmitted State Actions */}
                {selectedApp.applicationStatus === 'resubmitted' && hasPermission('membership.application.review') && (
                  <button
                    onClick={() => handleTransition('under_review', 'সংশোধিত আবেদন পুনরায় যাচাই শুরু হয়েছে', 'MEMBERSHIP_APPLICATION_REVIEW_STARTED')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 transition"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>পুনরায় যাচাই শুরু করুন</span>
                  </button>
                )}

                {/* Withdraw Action (Draft / Submitted only) */}
                {['draft', 'submitted', 'correction_required'].includes(selectedApp.applicationStatus) && hasPermission('membership.application.withdraw') && (
                  <button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold flex items-center gap-1.5 transition ml-auto"
                  >
                    <X className="w-3.5 h-3.5 text-slate-500" />
                    <span>আবেদন প্রত্যাহার</span>
                  </button>
                )}

                {/* Approved Member Link Banner */}
                {selectedApp.applicationStatus === 'approved' && (
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>সদস্যপদ অনুমোদিত • সদস্য আইডি: {selectedApp.approvedMemberId || 'MEM-000001'}</span>
                  </div>
                )}
              </div>

              {/* Detail Navigation Tabs */}
              <div className="px-5 border-b border-slate-100 flex gap-4 text-xs font-semibold font-numeric">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-3 border-b-2 flex items-center gap-2 transition ${
                    activeTab === 'info' ? 'border-[#0F5132] text-[#0F5132]' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>আবেদনের পূর্ণ তথ্য (Profile Data)</span>
                </button>

                <button
                  onClick={() => setActiveTab('checklist')}
                  className={`py-3 border-b-2 flex items-center gap-2 transition ${
                    activeTab === 'checklist' ? 'border-[#0F5132] text-[#0F5132]' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>যাচাই চেকলিস্ট ({selectedApp.checklist.filter(c => c.isVerified).length}/{selectedApp.checklist.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`py-3 border-b-2 flex items-center gap-2 transition ${
                    activeTab === 'timeline' ? 'border-[#0F5132] text-[#0F5132]' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>লাইফসাইকেল টাইমলাইন ({selectedApp.timeline.length})</span>
                </button>
              </div>

              {/* Tab 1: Full Profile Info */}
              {activeTab === 'info' && (
                <div className="p-5 space-y-6">
                  {/* Correction Notice Banner if present */}
                  {selectedApp.correctionReason && (
                    <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">সংশোধনের বিবরণ: </span>
                        <span>{selectedApp.correctionReason}</span>
                      </div>
                    </div>
                  )}

                  {/* Section 1: Basic Identity */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      ১. আবেদনকারীর পরিচিতি (Identity)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/70 font-numeric">
                      <div>
                        <span className="text-slate-500">পূর্ণ নাম:</span>
                        <p className="font-bold text-slate-900 font-heading">{selectedApp.applicantFullName}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">লিঙ্গ:</span>
                        <p className="font-semibold text-slate-800 capitalize">
                          {selectedApp.gender === 'male' ? 'পুরুষ' : selectedApp.gender === 'female' ? 'মহিলা' : 'অন্যান্য'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">জন্মতারিখ:</span>
                        <p className="font-semibold text-slate-800">
                          {selectedApp.dateOfBirth ? new Date(selectedApp.dateOfBirth).toLocaleDateString('bn-BD') : 'তথ্য নেই'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">বয়স (স্বয়ংক্রিয় গণনা):</span>
                        <p className="font-bold text-emerald-800">{calculateAge(selectedApp.dateOfBirth)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">পেশা:</span>
                        <p className="font-semibold text-slate-800">{selectedApp.occupation || 'তথ্য নেই'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-700" />
                      ২. যোগাযোগ তথ্য (Contact)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/70 font-numeric">
                      <div>
                        <span className="text-slate-500">মোবাইল নম্বর:</span>
                        <p className="font-bold text-slate-900 font-mono text-sm text-[#0F5132]">{selectedApp.mobile}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">ইমেইল ঠিকানা:</span>
                        <p className="font-semibold text-slate-800">{selectedApp.email || 'তথ্য নেই'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Family Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center gap-2">
                      <Home className="w-4 h-4 text-emerald-700" />
                      ৩. পারিবারিক তথ্য (Family Information)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                      <div>
                        <span className="text-slate-500">পিতা বা স্বামীর নাম:</span>
                        <p className="font-semibold text-slate-800">{selectedApp.fatherOrSpouseName || 'তথ্য নেই'}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">মাতার নাম:</span>
                        <p className="font-semibold text-slate-800">{selectedApp.motherName || 'তথ্য নেই'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Address Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      ৪. ঠিকানা (Address)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                      <div>
                        <span className="text-slate-500">বর্তমান ঠিকানা:</span>
                        <p className="font-semibold text-slate-800">{selectedApp.currentAddress || 'তথ্য নেই'}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">স্থায়ী ঠিকানা:</span>
                          {selectedApp.isSameAddress && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-numeric">
                              বর্তমান ঠিকানাই স্থায়ী
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-800">
                          {selectedApp.isSameAddress ? (selectedApp.currentAddress || 'তথ্য নেই') : (selectedApp.permanentAddress || 'তথ্য নেই')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Identification & NID Privacy */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      ৫. জাতীয় পরিচয়পত্র ও গোপনীয়তা সুরক্ষা (Identification & NID Privacy)
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-slate-500">জাতীয় পরিচয়পত্র নম্বর (NID):</span>
                          <p className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                            {revealedNids[selectedApp.id] 
                              ? (selectedApp.nid || 'তথ্য নেই') 
                              : maskNid(selectedApp.nid)}
                          </p>
                        </div>
                        
                        {/* Authorized Reveal Toggle */}
                        {hasPermission('membership.application.review') && selectedApp.nid && (
                          <button
                            onClick={() => setRevealedNids(prev => ({ ...prev, [selectedApp.id]: !prev[selectedApp.id] }))}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
                          >
                            {revealedNids[selectedApp.id] ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                                <span>মাস্ক করুন</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                <span>সম্পূর্ণ NID দেখুন</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-body">
                        * NID ডিফল্টভাবে সুরক্ষিত ও মাস্কড থাকে। এটি অডিট লগ বা ব্রাউজার স্টোরেজে উন্মুক্ত করা হয় না।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Verification Checklist */}
              {activeTab === 'checklist' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-heading">
                        আবেদন তথ্য সত্যতা নিরূপণ চেকলিস্ট
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        সদস্যপদ চূড়ান্ত অনুমোদনের পূর্বে দায়িত্বশীল কর্মকর্তা প্রতিটি ফিল্ড যাচাই করবেন।
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedApp.checklist.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">চেকলিস্ট আইটেম প্রস্তুত নেই</p>
                    ) : (
                      selectedApp.checklist.map(item => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border transition flex items-start justify-between gap-3 ${
                            item.isVerified ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={item.isVerified}
                              onChange={() => handleToggleChecklistItem(item.id)}
                              disabled={!hasPermission('membership.application.review')}
                              className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                            />
                            <div>
                              <p className={`text-xs font-bold ${item.isVerified ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>
                                {item.title}
                              </p>
                              {item.note && (
                                <p className="text-[11px] text-amber-700 mt-0.5">নোট: {item.note}</p>
                              )}
                              {item.verifiedBy && (
                                <p className="text-[10px] text-slate-400 font-numeric mt-0.5">
                                  যাচাইকারী: {item.verifiedBy} ({item.verifiedAt ? new Date(item.verifiedAt).toLocaleDateString('bn-BD') : ''})
                                </p>
                              )}
                            </div>
                          </div>
                          {item.isVerified && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              যাচাইকৃত
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Timeline & Audit */}
              {activeTab === 'timeline' && (
                <div className="p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 font-heading">
                    আবেদনের লাইফসাইকেল ও নিরীক্ষা ট্রেইল (Immutable Timeline)
                  </h4>
                  <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {selectedApp.timeline.map((evt, idx) => (
                      <div key={evt.id || idx} className="relative">
                        <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-700 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-numeric">
                            <span className="font-bold text-slate-900 font-heading">{evt.event}</span>
                            <span className="text-slate-400">{new Date(evt.timestamp).toLocaleString('bn-BD')}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-body">কর্তা: <strong className="text-slate-800">{evt.actorName}</strong></p>
                          {evt.note && (
                            <p className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-100 italic">
                              "{evt.note}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold text-slate-600">কোনো আবেদন নির্বাচন করা হয়নি</p>
              <p className="text-xs text-slate-400 mt-1">বাম পাশের তালিকা থেকে একটি আবেদন নির্বাচন করুন।</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Create / Edit Application Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">
                    নতুন সদস্যপদ আবেদন (New Membership Application)
                  </h3>
                  <p className="text-[11px] text-slate-500">প্রতিষ্ঠান: {currentOrg.shortName || currentOrg.name}</p>
                </div>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Form Validation Error */}
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Real-time Duplicate Member Warning */}
              {duplicateCheck.memberMatch && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>সতর্কতা: বিদ্যমান সদস্যের সাথে ম্যাচ পাওয়া গেছে!</span>
                  </div>
                  <p className="text-[11px] text-amber-800 pl-6">
                    প্রদত্ত <strong>{duplicateCheck.memberMatch.reason}</strong> দ্বারা ইতোমধ্যে একজন সদস্য 
                    (<strong>{duplicateCheck.memberMatch.name}</strong>, কোড: <strong>{duplicateCheck.memberMatch.code}</strong>) নিবন্ধিত আছেন।
                  </p>
                </div>
              )}

              {/* Real-time Duplicate Active Application Warning */}
              {duplicateCheck.activeAppMatch && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>সতর্কতা: একই সংস্থায় সক্রিয় আবেদন চলমান রয়েছে!</span>
                  </div>
                  <p className="text-[11px] text-rose-800 pl-6">
                    আবেদন কোড <strong>{duplicateCheck.activeAppMatch.code}</strong> (নাম: {duplicateCheck.activeAppMatch.name}) বর্তমানে 
                    <span className="font-bold"> {duplicateCheck.activeAppMatch.status}</span> অবস্থায় প্রক্রিয়াধীন রয়েছে।
                  </p>
                </div>
              )}

              {/* Identity Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 font-heading text-xs pb-1 border-b border-slate-100">
                  ১. আবেদনকারীর ব্যক্তিগত পরিচিতি
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">পূর্ণ নাম (বাংলায়) *</label>
                    <input
                      type="text"
                      placeholder="যেমন: মাওলানা আব্দুর রহমান"
                      value={formData.applicantFullName}
                      onChange={(e) => setFormData({ ...formData, applicantFullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">লিঙ্গ</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    >
                      <option value="male">পুরুষ</option>
                      <option value="female">মহিলা</option>
                      <option value="other">অন্যান্য</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">জন্মতারিখ (ভবিষ্যত তারিখ ব্লকড)</label>
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">পেশা</label>
                    <input
                      type="text"
                      placeholder="যেমন: শিক্ষক, ব্যবসায়ী, ইমাম"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 font-heading text-xs pb-1 border-b border-slate-100">
                  ২. যোগাযোগ ও জাতীয় পরিচয়পত্র
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">মোবাইল নম্বর (১১ ডিজিট) *</label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">ইমেইল (ঐচ্ছিক)</label>
                    <input
                      type="email"
                      placeholder="applicant@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-numeric"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">জাতীয় পরিচয়পত্র (NID - ডিফল্ট মাস্কড সংরক্ষিত)</label>
                    <input
                      type="text"
                      placeholder="১০ বা ১৭ ডিজিটের NID নম্বর"
                      value={formData.nid}
                      onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-numeric"
                    />
                  </div>
                </div>
              </div>

              {/* Family Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 font-heading text-xs pb-1 border-b border-slate-100">
                  ৩. পারিবারিক তথ্য
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">পিতা বা স্বামীর নাম</label>
                    <input
                      type="text"
                      placeholder="পিতা বা স্বামীর নাম"
                      value={formData.fatherOrSpouseName}
                      onChange={(e) => setFormData({ ...formData, fatherOrSpouseName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">মাতার নাম</label>
                    <input
                      type="text"
                      placeholder="মাতার নাম"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 font-heading text-xs pb-1 border-b border-slate-100">
                  ৪. ঠিকানার বিবরণ
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">বর্তমান ঠিকানা</label>
                    <textarea
                      rows={2}
                      placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা..."
                      value={formData.currentAddress}
                      onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sameAddressCheck"
                      checked={formData.isSameAddress}
                      onChange={(e) => setFormData({ ...formData, isSameAddress: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="sameAddressCheck" className="text-slate-700 font-semibold cursor-pointer">
                      বর্তমান ঠিকানাই স্থায়ী ঠিকানা
                    </label>
                  </div>

                  {!formData.isSameAddress && (
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">স্থায়ী ঠিকানা</label>
                      <textarea
                        rows={2}
                        placeholder="স্থায়ী গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা..."
                        value={formData.permanentAddress}
                        onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium transition"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => handleSaveNewApplication(true)}
                className="px-4 py-2 rounded-xl border border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-semibold transition"
              >
                খসড়া হিসেবে সংরক্ষণ (Draft)
              </button>
              <button
                type="button"
                onClick={() => handleSaveNewApplication(false)}
                className="px-4 py-2 rounded-xl bg-[#0F5132] hover:bg-[#0c4128] text-white font-semibold flex items-center gap-1.5 shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>সরাসরি জমা দিন (Submit)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Correction Required Dialog */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <RotateCcw className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                আবেদনে সংশোধন অনুরোধ (Correction Required)
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              আবেদনকারীর আবেদনপত্রে কোন তথ্য বা প্রমাণাদির ঘাটতি রয়েছে তা স্পষ্ট উল্লেখ করুন:
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">সংশোধনের সুনির্দিষ্ট কারণ *</label>
              <textarea
                rows={3}
                placeholder="যেমন: স্থায়ী ঠিকানার প্রত্যয়নপত্র অসম্পূর্ণ বা NID নম্বর স্পষ্ট নয়..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600/30 font-body"
              />
            </div>
            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setIsCorrectionModalOpen(false)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                বাতিল
              </button>
              <button
                disabled={!actionReason.trim()}
                onClick={() => handleTransition('correction_required', actionReason.trim(), 'MEMBERSHIP_APPLICATION_CORRECTION_REQUIRED')}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold"
              >
                সংশোধন অনুরোধ পাঠান
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Approval Dialog */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                সদস্যপদ অনুমোদন ও সদস্য রেকর্ড তৈরি (Approve & Create Member)
              </h3>
            </div>

            {/* Separation of Duties Warning */}
            {selectedApp?.createdBy === currentUserId && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">অনুমোদন ব্লকড: </span>
                  আপনি নিজে এই আবেদনের তৈরিকারী কর্মকর্তা হওয়ায় নীতি অনুযায়ী এটি অনুমোদন করতে পারবেন না (Creator ≠ Approver)।
                </div>
              </div>
            )}

            <p className="text-xs text-slate-600">
              অনুমোদন চূড়ান্ত হলে আবেদনকারী প্রতিষ্ঠানের অফিশিয়াল <strong>সদস্য (Official Member)</strong> হিসেবে নিবন্ধিত হবেন এবং স্থায়ী সদস্য কোড বরাদ্দ করা হবে।
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">অনুমোদনের মন্তব্য / রেজুলেশন রেফারেন্স</label>
              <input
                type="text"
                placeholder="যেমন: কার্যনির্বাহী কমিটির রেজুলেশন নং-৪ অনুযায়ী অনুমোদিত"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                বাতিল
              </button>
              <button
                disabled={selectedApp?.createdBy === currentUserId}
                onClick={() => handleTransition('approved', actionReason.trim() || 'কার্যনির্বাহী পরিষদ কর্তৃক সদস্যপদ অনুমোদিত', 'MEMBERSHIP_APPLICATION_APPROVED')}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>চূড়ান্ত অনুমোদন প্রদান করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Reject Dialog */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <XCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                আবেদন প্রত্যাখ্যান (Reject Application)
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              আবেদন প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক। প্রত্যাখ্যাত আবেদন ভবিষ্যতে পর্যালোচনার জন্য স্থায়ীভাবে সংরক্ষিত থাকবে।
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">প্রত্যাখ্যানের সুনির্দিষ্ট কারণ *</label>
              <textarea
                rows={3}
                placeholder="যেমন: সমিতির মৌলিক উপবিধি ও কার্যপরিধির শর্তাবলি অপূর্ণ থাকায়..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-600/30"
              />
            </div>
            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                বাতিল
              </button>
              <button
                disabled={!actionReason.trim()}
                onClick={() => handleTransition('rejected', actionReason.trim(), 'MEMBERSHIP_APPLICATION_REJECTED')}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-semibold"
              >
                প্রত্যাখ্যান করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Withdraw Dialog */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <X className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                আবেদন প্রত্যাহার (Withdraw Application)
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              আবেদনকারী কর্তৃক আবেদন প্রত্যাহার করা হচ্ছে। প্রত্যাহারকৃত আবেদন লাইফসাইকেলে সংরক্ষিত থাকবে।
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">প্রত্যাহারের কারণ (ঐচ্ছিক)</label>
              <input
                type="text"
                placeholder="যেমন: আবেদনকারীর ব্যক্তিগত সিদ্ধান্ত"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-600/30"
              />
            </div>
            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleTransition('withdrawn', actionReason.trim() || 'আবেদনকারী কর্তৃক আবেদন প্রত্যাহার', 'MEMBERSHIP_APPLICATION_WITHDRAWN')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold"
              >
                প্রত্যাহার সম্পন্ন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: A4 Print Preview Modal */}
      {isPrintModalOpen && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden my-6">
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-emerald-800" />
                সদস্যপদ আবেদনপত্র — A4 মুদ্রণ প্রিভিউ
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-900 flex items-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  মুদ্রণ করুন
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable A4 Form Sheet */}
            <div className="p-8 font-body space-y-6 text-slate-900 max-h-[80vh] overflow-y-auto bg-white border m-4 rounded-xl shadow-inner">
              {/* Official Organization Header */}
              <div className="text-center border-b pb-4 space-y-1">
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  {currentOrg.name}
                </h2>
                <p className="text-xs text-slate-600">
                  {currentOrg.address} • ফোন: {currentOrg.phone}
                </p>
                <div className="inline-block px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold font-numeric border mt-1">
                  সদস্যপদ আবেদনপত্র (Membership Application Form)
                </div>
              </div>

              {/* Code & Date Header Bar */}
              <div className="flex items-center justify-between text-xs border p-3 rounded-lg bg-slate-50 font-numeric">
                <div>
                  <span className="text-slate-500">আবেদন কোড: </span>
                  <strong className="font-mono text-slate-900">{selectedApp.applicationCode}</strong>
                </div>
                <div>
                  <span className="text-slate-500">স্ট্যাটাস: </span>
                  <strong className="text-slate-900">{selectedApp.applicationStatus}</strong>
                </div>
                <div>
                  <span className="text-slate-500">তারিখ: </span>
                  <strong>{new Date(selectedApp.createdAt).toLocaleDateString('bn-BD')}</strong>
                </div>
              </div>

              {/* Personal Information Table */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide border-b pb-1 font-heading">
                  ১. আবেদনকারীর ব্যক্তিগত তথ্যাদি
                </h4>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/50 border rounded-lg font-numeric">
                  <p><span className="text-slate-500">পূর্ণ নাম:</span> <strong>{selectedApp.applicantFullName}</strong></p>
                  <p><span className="text-slate-500">লিঙ্গ:</span> <strong>{selectedApp.gender === 'male' ? 'পুরুষ' : 'মহিলা'}</strong></p>
                  <p><span className="text-slate-500">পেশা:</span> <strong>{selectedApp.occupation || '—'}</strong></p>
                  <p><span className="text-slate-500">বয়স:</span> <strong>{calculateAge(selectedApp.dateOfBirth)}</strong></p>
                  <p><span className="text-slate-500">পিতা/স্বামীর নাম:</span> <strong>{selectedApp.fatherOrSpouseName || '—'}</strong></p>
                  <p><span className="text-slate-500">মাতার নাম:</span> <strong>{selectedApp.motherName || '—'}</strong></p>
                  <p><span className="text-slate-500">মোবাইল নম্বর:</span> <strong className="font-mono">{selectedApp.mobile}</strong></p>
                  <p><span className="text-slate-500">NID (মাস্কড):</span> <strong className="font-mono">{maskNid(selectedApp.nid)}</strong></p>
                  <p className="col-span-2"><span className="text-slate-500">বর্তমান ঠিকানা:</span> <strong>{selectedApp.currentAddress || '—'}</strong></p>
                  <p className="col-span-2"><span className="text-slate-500">স্থায়ী ঠিকানা:</span> <strong>{selectedApp.isSameAddress ? selectedApp.currentAddress : selectedApp.permanentAddress || '—'}</strong></p>
                </div>
              </div>

              {/* Verification Checklist Print Block */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide border-b pb-1 font-heading">
                  ২. কর্মকর্তা যাচাইকরণ নিরীক্ষা বিবরণী
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {selectedApp.checklist.map(chk => (
                    <div key={chk.id} className="flex items-center gap-2 p-1.5 border rounded">
                      <input type="checkbox" checked={chk.isVerified} readOnly className="rounded" />
                      <span className={chk.isVerified ? 'font-semibold text-slate-800' : 'text-slate-500'}>{chk.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures Area */}
              <div className="pt-16 grid grid-cols-3 gap-4 text-center text-xs">
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-semibold text-slate-800">আবেদনকারীর স্বাক্ষর</p>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-semibold text-slate-800">যাচাইকারী কর্মকর্তার স্বাক্ষর</p>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-semibold text-slate-800">অনুমোদনকারী সভাপতির স্বাক্ষর</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
