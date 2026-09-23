import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Printer, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Briefcase, 
  Heart, 
  CreditCard, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Camera, 
  Trash2, 
  Lock, 
  FileText,
  X,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  Tag,
  Link,
  UserPlus,
  ArrowRightLeft,
  Building2
} from 'lucide-react';
import { 
  MemberType, 
  MemberStatusType, 
  MemberStatusAuditType, 
  ProfileCompleteness, 
  OrganizationContext,
  MemberClassificationType,
  MemberClassificationHistoryType,
  MemberRelationType,
  RelationTypeConfig
} from '../types';
import { INITIAL_CLASSIFICATIONS, INITIAL_RELATION_TYPES } from './MemberMasterDataManagementView';
import { MemberDocumentsPhotosView } from './MemberDocumentsPhotosView';

interface MemberProfileManagementViewProps {
  currentOrg: OrganizationContext;
  onSyncOrganization?: (orgId: string, orgName: string) => void;
}

// Initial Mock Seed for Khurushkul and Al-Falah to test Organization Isolation
export const SEED_MEMBERS: Record<string, MemberType[]> = {
  'demo-org-khurushkul': [
    {
      id: 'mem-001',
      organizationId: 'demo-org-khurushkul',
      memberCode: 'MEM-000001',
      fullName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      mobile: '01812000001',
      email: 'ibrahim.khalil@example.com',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      occupation: 'মাদ্রাসা শিক্ষক ও খতিব',
      fatherOrSpouseName: 'হাফেজ আহমদ উল্লাহ',
      motherName: 'মরিয়ম খাতুন',
      nid: '19851234567890123',
      currentAddress: 'খুরুশকুল বাজার, কক্সবাজার সদর, কক্সবাজার',
      permanentAddress: 'খুরুশকুল বাজার, কক্সবাজার সদর, কক্সবাজার',
      isSameAddress: true,
      address: 'খুরুশকুল বাজার, কক্সবাজার সদর, কক্সবাজার',
      status: 'active',
      classificationId: 'cls-001', // প্রতিষ্ঠাতা সদস্য
      joinedAt: '2023-01-01T10:00:00.000Z',
      createdAt: '2023-01-01T10:00:00.000Z',
      updatedAt: '2023-01-01T10:00:00.000Z',
      createdBy: 'usr-admin-01',
      updatedBy: 'usr-admin-01',
      notes: 'প্রতিষ্ঠাতা সদস্য ও নিয়মিত সক্রিয় সদস্য',
    },
    {
      id: 'mem-002',
      organizationId: 'demo-org-khurushkul',
      memberCode: 'MEM-000002',
      fullName: 'কারী ফজলুল করিম',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      mobile: '01812000002',
      email: 'fazlul.karim@example.com',
      dateOfBirth: '1988-07-22',
      gender: 'male',
      occupation: 'ব্যবসায়ী ও খামার পরিচালক',
      fatherOrSpouseName: 'মৌলভী নূরুল ইসলাম',
      motherName: 'ফাতেমা বেগম',
      nid: '19881234567890456',
      currentAddress: 'মনু পাড়া, খুরুশকুল, কক্সবাজার',
      permanentAddress: 'মনু পাড়া, খুরুশকুল, কক্সবাজার',
      isSameAddress: true,
      address: 'মনু পাড়া, খুরুশকুল, কক্সবাজার',
      status: 'active',
      classificationId: 'cls-001', // প্রতিষ্ঠাতা সদস্য
      joinedAt: '2023-02-10T11:30:00.000Z',
      createdAt: '2023-02-10T11:30:00.000Z',
      updatedAt: '2023-02-10T11:30:00.000Z',
      createdBy: 'usr-admin-01',
      updatedBy: 'usr-admin-01',
      notes: 'আর্থিক পরামর্শক কমিটির সদস্য',
    },
    {
      id: 'mem-003',
      organizationId: 'demo-org-khurushkul',
      memberCode: 'MEM-000003',
      fullName: 'হাফেজ মুহাম্মদ শোয়াইব',
      photoUrl: '',
      mobile: '01812000003',
      email: 'shoaib.qari@example.com',
      dateOfBirth: '1992-11-05',
      gender: 'male',
      occupation: 'হিসাব কর্মকর্তা',
      fatherOrSpouseName: 'আলী আহমদ চৌধুরী',
      motherName: 'আয়েশা সিদ্দিকা',
      nid: '19921234567890789',
      currentAddress: 'তেতৈয়া, খুরুশকুল, কক্সবাজার সদর',
      permanentAddress: 'তেতৈয়া, খুরুশকুল, কক্সবাজার সদর',
      isSameAddress: true,
      address: 'তেতৈয়া, খুরুশকুল, কক্সবাজার সদর',
      status: 'active',
      classificationId: 'cls-002', // সাধারণ সদস্য
      joinedAt: '2023-03-15T09:15:00.000Z',
      createdAt: '2023-03-15T09:15:00.000Z',
      updatedAt: '2023-03-15T09:15:00.000Z',
      createdBy: 'usr-admin-01',
      updatedBy: 'usr-admin-01',
      notes: 'হিসাব শাখায় কর্মরত',
    },
    {
      id: 'mem-004',
      organizationId: 'demo-org-khurushkul',
      memberCode: 'MEM-000004',
      fullName: 'মাওলানা সিরাজুল ইসলাম',
      photoUrl: '',
      mobile: '01812000004',
      email: 'sirajul.islam@example.com',
      dateOfBirth: '1978-05-12',
      gender: 'male',
      occupation: 'মাদ্রাসা শিক্ষক ও খতিব',
      fatherOrSpouseName: 'মরহুম আব্দুল গফুর',
      motherName: 'খায়রুন্নেসা',
      nid: '19781234567890111',
      currentAddress: 'পূর্ব খুরুশকুল, কক্সবাজার',
      permanentAddress: 'পূর্ব খুরুশকুল, কক্সবাজার',
      isSameAddress: true,
      address: 'পূর্ব খুরুশকুল, কক্সবাজার',
      status: 'inactive',
      classificationId: 'cls-002', // সাধারণ সদস্য
      joinedAt: '2023-05-01T14:00:00.000Z',
      createdAt: '2023-05-01T14:00:00.000Z',
      updatedAt: '2024-01-10T10:00:00.000Z',
      createdBy: 'usr-admin-01',
      updatedBy: 'usr-admin-01',
      notes: 'অধ্যয়নের জন্য সাময়িক অনুপস্থিত',
    },
    {
      id: 'mem-005',
      organizationId: 'demo-org-khurushkul',
      memberCode: 'MEM-000005',
      fullName: 'মুহাম্মদ তারেক জামিল',
      photoUrl: '',
      mobile: '01812000005',
      email: 'tariq.jamil@example.com',
      dateOfBirth: '1995-09-18',
      gender: 'male',
      occupation: 'ব্যবসায়ী ও খামার পরিচালক',
      fatherOrSpouseName: 'ডা. রফিক আহমদ',
      motherName: 'হাসিনা বেগম',
      nid: '19951234567890222',
      currentAddress: 'ঝিলংজা, কক্সবাজার সদর',
      permanentAddress: 'মনু পাড়া, খুরুশকুল, কক্সবাজার',
      isSameAddress: false,
      address: 'ঝিলংজা, কক্সবাজার সদর',
      status: 'suspended',
      classificationId: 'cls-003', // সহযোগী সদস্য
      joinedAt: '2023-06-20T16:20:00.000Z',
      createdAt: '2023-06-20T16:20:00.000Z',
      updatedAt: '2024-02-01T12:00:00.000Z',
      createdBy: 'usr-admin-01',
      updatedBy: 'usr-admin-01',
      notes: 'নিয়ম লঙ্ঘনের তদন্তের কারণে স্থগিত',
    },
    {
      id: 'mem-006',
      organizationId: 'demo-org-khurushkul',
      memberCode: 'MEM-000006',
      fullName: 'মরহুম আলহাজ্ব আবুল কাশেম',
      photoUrl: '',
      mobile: '01812000006',
      email: undefined,
      dateOfBirth: '1960-01-10',
      gender: 'male',
      occupation: 'অবসরপ্রাপ্ত সরকারি কর্মকর্তা',
      fatherOrSpouseName: 'মরহুম মৌলভী জালাল আহমদ',
      motherName: 'আমেনা খাতুন',
      nid: '19601234567890333',
      currentAddress: 'মধ্যম খুরুশকুল, কক্সবাজার',
      permanentAddress: 'মধ্যম খুরুশকুল, কক্সবাজার',
      isSameAddress: true,
      address: 'মধ্যম খুরুশকুল, কক্সবাজার',
      status: 'archived',
      classificationId: 'cls-004', // সম্মানসূচক সদস্য
      joinedAt: '2023-01-01T10:00:00.000Z',
      createdAt: '2023-01-01T10:00:00.000Z',
      updatedAt: '2024-03-01T15:00:00.000Z',
      createdBy: 'usr-admin-01',
      updatedBy: 'usr-admin-01',
      notes: 'ইন্তেকাল করায় সদস্যপদ সংরক্ষিতভাবে আর্কাইভ করা হয়েছে',
    },
  ],
  'org-alfalah-01': [
    {
      id: 'mem-alf-001',
      organizationId: 'org-alfalah-01',
      memberCode: 'MEM-000001',
      fullName: 'জনাব মুশফিকুর রহমান',
      photoUrl: '',
      mobile: '01711223399',
      email: 'mushfiq@alfalah-samity.org',
      dateOfBirth: '1982-04-10',
      gender: 'male',
      occupation: 'টেক্সটাইল ব্যবসায়ী',
      fatherOrSpouseName: 'আব্দুর রহমান',
      motherName: 'রাবেয়া বসরী',
      nid: '19825555444433332',
      currentAddress: 'সেকশন-৬, মিরপুর, ঢাকা',
      permanentAddress: 'সেকশন-৬, মিরপুর, ঢাকা',
      isSameAddress: true,
      address: 'সেকশন-৬, মিরপুর, ঢাকা',
      status: 'active',
      classificationId: 'cls-alf-001',
      joinedAt: '2019-01-15T10:00:00.000Z',
      createdAt: '2019-01-15T10:00:00.000Z',
      updatedAt: '2019-01-15T10:00:00.000Z',
      createdBy: 'usr-admin-02',
      notes: 'আল-ফালাহ সমিতির সদস্য',
    },
  ],
};

const SEED_STATUS_AUDITS: Record<string, MemberStatusAuditType[]> = {
  'demo-org-khurushkul': [
    {
      id: 'aud-001',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-004',
      memberCode: 'MEM-000004',
      previousStatus: 'active',
      newStatus: 'inactive',
      reason: 'উচ্চতর শিক্ষার জন্য অন্য জেলায় অবস্থান করায় আবেদনক্রমে সাময়িক নিষ্ক্রিয়',
      changedByUserId: 'usr-admin-01',
      changedByName: 'অ্যাডমিন ইউজার',
      timestamp: '2024-01-10T10:00:00.000Z',
    },
    {
      id: 'aud-002',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-005',
      memberCode: 'MEM-000005',
      previousStatus: 'active',
      newStatus: 'suspended',
      reason: 'সমিতির শৃঙ্খলা সংক্রান্ত তদন্ত চলাকালীন সাময়িক স্থগিত',
      changedByUserId: 'usr-admin-01',
      changedByName: 'অ্যাডমিন ইউজার',
      timestamp: '2024-02-01T12:00:00.000Z',
    },
    {
      id: 'aud-003',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-006',
      memberCode: 'MEM-000006',
      previousStatus: 'active',
      newStatus: 'archived',
      reason: 'সদস্যের ইন্তেকালজনিত কারণে আইনানুগ আর্কাইভ সংরক্ষণ',
      changedByUserId: 'usr-admin-01',
      changedByName: 'অ্যাডমিন ইউজার',
      timestamp: '2024-03-01T15:00:00.000Z',
    },
  ],
};

const SEED_CLASSIFICATION_HISTORIES: Record<string, MemberClassificationHistoryType[]> = {
  'demo-org-khurushkul': [
    {
      id: 'clsh-001',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      previousClassificationId: undefined,
      previousClassificationName: 'প্রাথমিক নিবন্ধন',
      newClassificationId: 'cls-001',
      newClassificationName: 'প্রতিষ্ঠাতা সদস্য',
      changedAt: '2023-01-01T10:00:00.000Z',
      changedBy: 'usr-admin-01',
      changedByName: 'অ্যাডমিন ইউজার',
      reason: 'সমিতি প্রতিষ্ঠার প্রাথমিক রেজুলেশন অনুযায়ী প্রতিষ্ঠাতা সদস্য হিসেবে স্বীকৃতি',
      auditReference: 'AUD-CLS-2023-001',
    },
    {
      id: 'clsh-002',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-003',
      previousClassificationId: 'cls-003',
      previousClassificationName: 'সহযোগী সদস্য',
      newClassificationId: 'cls-002',
      newClassificationName: 'সাধারণ সদস্য',
      changedAt: '2023-09-01T11:00:00.000Z',
      changedBy: 'usr-admin-01',
      changedByName: 'অ্যাডমিন ইউজার',
      reason: '১ বছর পূর্ণাঙ্গ সক্রিয়তার পর সাধারণ সদস্যে পদোন্নতি',
      auditReference: 'AUD-CLS-2023-042',
    },
  ],
};

const SEED_RELATIONS: Record<string, MemberRelationType[]> = {
  'demo-org-khurushkul': [
    {
      id: 'rel-inst-001',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      relatedMemberId: 'mem-002',
      relationTypeId: 'rel-007', // ভাই
      relationTypeName: 'ভাই',
      notes: 'আপন সহোদর ভাই',
      status: 'active',
      createdAt: '2023-02-15T10:00:00.000Z',
      updatedAt: '2023-02-15T10:00:00.000Z',
      createdBy: 'usr-admin-01',
    },
    {
      id: 'rel-inst-002',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-002',
      relatedMemberId: 'mem-001',
      relationTypeId: 'rel-007', // ভাই
      relationTypeName: 'ভাই',
      notes: 'পারস্পরিক সম্পর্ক (সহোদর ভাই)',
      status: 'active',
      createdAt: '2023-02-15T10:00:00.000Z',
      updatedAt: '2023-02-15T10:00:00.000Z',
      createdBy: 'usr-admin-01',
    },
  ],
};

// Helper: Calculate age dynamically from Date of Birth
export function calculateAge(dobString?: string): { ageYears: number | null; displayBangla: string } {
  if (!dobString) {
    return { ageYears: null, displayBangla: 'তথ্য নেই' };
  }
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) {
    return { ageYears: null, displayBangla: 'তথ্য নেই' };
  }
  const now = new Date();
  if (dob > now) {
    return { ageYears: null, displayBangla: 'ভবিষ্যৎ তারিখ গ্রহণযোগ্য নয়' };
  }
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  if (age < 0) return { ageYears: null, displayBangla: 'তথ্য নেই' };

  const enToBn: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  const bnAge = age.toString().split('').map(c => enToBn[c] || c).join('');
  return { ageYears: age, displayBangla: `${bnAge} বছর` };
}

// Helper: Mask NID (e.g. 19851234567890123 -> *************0123)
export function maskNid(nid?: string): string {
  if (!nid || nid.trim() === '') return 'তথ্য নেই';
  const trimmed = nid.trim();
  if (trimmed.length <= 4) return '****';
  const visible = trimmed.slice(-4);
  const maskedCount = trimmed.length - 4;
  return '*'.repeat(maskedCount) + visible;
}

// Helper: Calculate Profile Completeness
export function calculateCompleteness(member: MemberType): ProfileCompleteness {
  const hasBasicIdentity = Boolean(
    member.fullName && member.gender && member.dateOfBirth && member.occupation
  );
  const hasContact = Boolean(member.mobile);
  const hasAddress = Boolean(
    (member.currentAddress || member.address) && (member.permanentAddress || member.isSameAddress)
  );
  const hasFamily = Boolean(member.fatherOrSpouseName && member.motherName);
  const hasIdentification = Boolean(member.nid);

  let score = 0;
  if (member.fullName) score += 5;
  if (member.gender) score += 5;
  if (member.dateOfBirth) score += 5;
  if (member.occupation) score += 5;
  if (member.photoUrl) score += 10;
  if (member.mobile) score += 15;
  if (member.email) score += 5;
  if (member.currentAddress || member.address) score += 10;
  if (member.permanentAddress || member.isSameAddress) score += 10;
  if (member.fatherOrSpouseName) score += 10;
  if (member.motherName) score += 5;
  if (member.nid) score += 15;

  score = Math.min(100, Math.max(0, score));

  return {
    score,
    sections: {
      basicIdentity: {
        title: 'পরিচিতি তথ্য',
        weight: 30,
        isComplete: hasBasicIdentity,
        details: hasBasicIdentity ? 'নাম, লিঙ্গ, জন্মতারিখ ও পেশা তথ্য সম্পূর্ণ' : 'পরিচিতির কিছু ফিল্ড অপূর্ণ',
      },
      contact: {
        title: 'যোগাযোগ তথ্য',
        weight: 20,
        isComplete: hasContact,
        details: hasContact ? 'মোবাইল নম্বর সংযুক্ত রয়েছে' : 'মোবাইল নম্বর অপূর্ণ',
      },
      address: {
        title: 'ঠিকানা তথ্য',
        weight: 20,
        isComplete: hasAddress,
        details: hasAddress ? 'বর্তমান ও স্থায়ী ঠিকানা উভয়টি সংরক্ষিত' : 'ঠিকানা তথ্য অপূর্ণ',
      },
      family: {
        title: 'পারিবারিক তথ্য',
        weight: 15,
        isComplete: hasFamily,
        details: hasFamily ? 'পিতা/স্বামী ও মাতার নাম সংরক্ষিত' : 'পারিবারিক তথ্য অপূর্ণ',
      },
      identification: {
        title: 'পরিচয়পত্র (NID)',
        weight: 15,
        isComplete: hasIdentification,
        details: hasIdentification ? 'জাতীয় পরিচয়পত্র নম্বর নিবন্ধিত' : 'NID নম্বর অপূর্ণ',
      },
    },
  };
}

export const MemberProfileManagementView: React.FC<MemberProfileManagementViewProps> = ({
  currentOrg,
}) => {
  // Navigation & Simulated Security Roles
  const [simulatedRole, setSimulatedRole] = useState<'admin' | 'manager' | 'viewer' | 'unauthorized'>('admin');
  const [activeProfileTab, setActiveProfileTab] = useState<'identity' | 'contact_address' | 'family' | 'identification' | 'classification_relations' | 'documents_photos' | 'audit'>('identity');
  
  // Scoped Data State
  const [membersDb, setMembersDb] = useState<Record<string, MemberType[]>>(SEED_MEMBERS);
  const [auditsDb, setAuditsDb] = useState<Record<string, MemberStatusAuditType[]>>(SEED_STATUS_AUDITS);
  const [classificationsDb, setClassificationsDb] = useState<Record<string, MemberClassificationType[]>>(INITIAL_CLASSIFICATIONS);
  const [classificationHistoriesDb, setClassificationHistoriesDb] = useState<Record<string, MemberClassificationHistoryType[]>>(SEED_CLASSIFICATION_HISTORIES);
  const [relationTypesDb, setRelationTypesDb] = useState<Record<string, RelationTypeConfig[]>>(INITIAL_RELATION_TYPES);
  const [relationsDb, setRelationsDb] = useState<Record<string, MemberRelationType[]>>(SEED_RELATIONS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatusType | 'all'>('all');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'other'>('all');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('mem-001');

  // Modal Dialog States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Prompt 3.4 Modals
  const [isClassificationModalOpen, setIsClassificationModalOpen] = useState(false);
  const [newClassificationId, setNewClassificationId] = useState<string>('');
  const [classificationChangeReason, setClassificationChangeReason] = useState<string>('');
  const [classificationError, setClassificationError] = useState<string | null>(null);

  const [isRelationModalOpen, setIsRelationModalOpen] = useState(false);
  const [relationForm, setRelationForm] = useState({
    relatedMemberId: '',
    relationTypeId: '',
    notes: '',
  });
  const [relationError, setRelationError] = useState<string | null>(null);

  // Security UI State: Reveal full NID toggle (Permission Guarded)
  const [revealedNidMemberId, setRevealedNidMemberId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Forms State
  const [editFormData, setEditFormData] = useState<Partial<MemberType>>({});
  const [newStatusValue, setNewStatusValue] = useState<MemberStatusType>('active');
  const [statusReason, setStatusReason] = useState<string>('');
  const [photoInputUrl, setPhotoInputUrl] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const orgId = currentOrg.id;

  // Permissions based on simulated role
  const permissions = useMemo(() => {
    switch (simulatedRole) {
      case 'admin':
        return {
          canView: true,
          canCreate: true,
          canEdit: true,
          canChangeStatus: true,
          canChangeClassification: true,
          canManageRelations: true,
          canPrint: true,
          canExport: true,
          canViewFullNid: true,
        };
      case 'manager':
        return {
          canView: true,
          canCreate: true,
          canEdit: true,
          canChangeStatus: false,
          canChangeClassification: true,
          canManageRelations: true,
          canPrint: true,
          canExport: true,
          canViewFullNid: true,
        };
      case 'viewer':
        return {
          canView: true,
          canCreate: false,
          canEdit: false,
          canChangeStatus: false,
          canChangeClassification: false,
          canManageRelations: false,
          canPrint: true,
          canExport: false,
          canViewFullNid: false,
        };
      case 'unauthorized':
      default:
        return {
          canView: false,
          canCreate: false,
          canEdit: false,
          canChangeStatus: false,
          canChangeClassification: false,
          canManageRelations: false,
          canPrint: false,
          canExport: false,
          canViewFullNid: false,
        };
    }
  }, [simulatedRole]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Scoped Members for current Organization
  const currentOrgMembers = useMemo(() => {
    return membersDb[orgId] || [];
  }, [membersDb, orgId]);

  // Scoped Classifications
  const currentOrgClassifications = useMemo(() => {
    return (classificationsDb[orgId] || []).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [classificationsDb, orgId]);

  // Scoped Relation Types
  const currentOrgRelationTypes = useMemo(() => {
    return (relationTypesDb[orgId] || []).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [relationTypesDb, orgId]);

  // Selected Member Object
  const selectedMember = useMemo(() => {
    return currentOrgMembers.find(m => m.id === selectedMemberId) || currentOrgMembers[0] || null;
  }, [currentOrgMembers, selectedMemberId]);

  // Current classification of selected member
  const currentMemberClassification = useMemo(() => {
    if (!selectedMember || !selectedMember.classificationId) return null;
    return currentOrgClassifications.find(c => c.id === selectedMember.classificationId) || null;
  }, [selectedMember, currentOrgClassifications]);

  // Filtered Members
  const filteredMembers = useMemo(() => {
    return currentOrgMembers.filter(m => {
      const matchesSearch = 
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.memberCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.mobile.includes(searchQuery) ||
        (m.occupation && m.occupation.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchesClassification = classificationFilter === 'all' || m.classificationId === classificationFilter;
      const matchesGender = genderFilter === 'all' || m.gender === genderFilter;

      return matchesSearch && matchesStatus && matchesClassification && matchesGender;
    });
  }, [currentOrgMembers, searchQuery, statusFilter, classificationFilter, genderFilter]);

  // Relations for selected Member
  const selectedMemberRelations = useMemo(() => {
    if (!selectedMember) return [];
    const allRelations = relationsDb[orgId] || [];
    return allRelations.filter(r => r.memberId === selectedMember.id);
  }, [relationsDb, orgId, selectedMember]);

  // Classification History for selected Member
  const selectedMemberClassificationHistories = useMemo(() => {
    if (!selectedMember) return [];
    const allHistories = classificationHistoriesDb[orgId] || [];
    return allHistories.filter(h => h.memberId === selectedMember.id);
  }, [classificationHistoriesDb, orgId, selectedMember]);

  // Audits for selected Member
  const selectedMemberAudits = useMemo(() => {
    if (!selectedMember) return [];
    const allAudits = auditsDb[orgId] || [];
    return allAudits.filter(a => a.memberId === selectedMember.id);
  }, [auditsDb, orgId, selectedMember]);

  // Completeness for selected member
  const completeness = useMemo(() => {
    if (!selectedMember) return null;
    return calculateCompleteness(selectedMember);
  }, [selectedMember]);

  // Copy helper with feedback
  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Status Badge Component
  const renderStatusBadge = (status: MemberStatusType) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            সক্রিয়
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            নিষ্ক্রিয়
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            স্থগিত
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            আর্কাইভকৃত
          </span>
        );
    }
  };

  // Classification Badge Component
  const renderClassificationBadge = (classificationId?: string) => {
    if (!classificationId) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <Tag className="w-3 h-3 text-slate-400" />
          সাধারণ শ্রেণি
        </span>
      );
    }
    const cls = currentOrgClassifications.find(c => c.id === classificationId);
    if (!cls) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <Tag className="w-3 h-3 text-slate-400" />
          অজ্ঞাত শ্রেণি
        </span>
      );
    }

    let bgStyle = 'bg-blue-50 text-blue-800 border-blue-200';
    if (cls.code === 'FOUNDER') bgStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (cls.code === 'HONORARY') bgStyle = 'bg-purple-50 text-purple-800 border-purple-200';
    if (cls.code === 'ASSOCIATE') bgStyle = 'bg-amber-50 text-amber-800 border-amber-200';

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${bgStyle}`}>
        <Tag className="w-3 h-3" />
        {cls.name}
      </span>
    );
  };

  // Handle Edit Profile Save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setFormError(null);

    if (!editFormData.fullName?.trim()) {
      setFormError('সদস্যের পূর্ণ নাম আবশ্যক');
      return;
    }

    const mobile = editFormData.mobile?.trim() || '';
    if (!/^(?:\+8801|01)[3-9]\d{8}$/.test(mobile)) {
      setFormError('সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 01711223344)');
      return;
    }

    // Check duplicate mobile in same org (excluding this member)
    const duplicate = currentOrgMembers.some(
      m => m.id !== selectedMember.id && m.mobile === mobile
    );
    if (duplicate) {
      setFormError('এই মোবাইল নম্বর দিয়ে এই প্রতিষ্ঠানে ইতোমধ্যে অন্য একজন সদস্য নিবন্ধিত');
      return;
    }

    // Check future date of birth
    if (editFormData.dateOfBirth) {
      const dob = new Date(editFormData.dateOfBirth);
      if (dob > new Date()) {
        setFormError('জন্মতারিখ বর্তমান তারিখের চেয়ে বেশি (ভবিষ্যতের) হতে পারে না');
        return;
      }
    }

    const effCurrent = editFormData.currentAddress?.trim() || '';
    const effPermanent = editFormData.isSameAddress ? effCurrent : (editFormData.permanentAddress?.trim() || '');

    const updated: MemberType = {
      ...selectedMember,
      fullName: editFormData.fullName.trim(),
      mobile: mobile,
      email: editFormData.email?.trim() || undefined,
      dateOfBirth: editFormData.dateOfBirth || undefined,
      gender: editFormData.gender || selectedMember.gender,
      occupation: editFormData.occupation?.trim() || undefined,
      fatherOrSpouseName: editFormData.fatherOrSpouseName?.trim() || undefined,
      motherName: editFormData.motherName?.trim() || undefined,
      nid: editFormData.nid?.trim() || undefined,
      currentAddress: effCurrent || undefined,
      permanentAddress: effPermanent || undefined,
      isSameAddress: editFormData.isSameAddress ?? false,
      address: effCurrent || undefined,
      photoUrl: editFormData.photoUrl?.trim() || selectedMember.photoUrl,
      notes: editFormData.notes?.trim() || undefined,
      updatedAt: new Date().toISOString(),
      updatedBy: 'usr-current',
      // Immutable fields strictly protected
      id: selectedMember.id,
      organizationId: selectedMember.organizationId,
      memberCode: selectedMember.memberCode,
      createdAt: selectedMember.createdAt,
      createdBy: selectedMember.createdBy,
    };

    setMembersDb(prev => ({
      ...prev,
      [orgId]: prev[orgId].map(m => (m.id === selectedMember.id ? updated : m)),
    }));

    setIsEditOpen(false);
    showToast('সদস্যের তথ্য সফলভাবে হালনাগাদ করা হয়েছে');
  };

  // Handle Member Status Change
  const handleStatusChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setFormError(null);

    if (!statusReason.trim()) {
      setFormError('স্ট্যাটাস পরিবর্তনের জন্য কারণ উল্লেখ করা বাধ্যতামূলক');
      return;
    }

    if (newStatusValue === selectedMember.status) {
      setFormError('বর্তমান স্ট্যাটাস ও নতুন স্ট্যাটাস একই হতে পারে না');
      return;
    }

    const auditEntry: MemberStatusAuditType = {
      id: `aud-${Date.now()}`,
      organizationId: orgId,
      memberId: selectedMember.id,
      memberCode: selectedMember.memberCode,
      previousStatus: selectedMember.status,
      newStatus: newStatusValue,
      reason: statusReason.trim(),
      changedByUserId: 'usr-admin-01',
      changedByName: 'অ্যাডমিন ইউজার',
      timestamp: new Date().toISOString(),
    };

    const updatedMember: MemberType = {
      ...selectedMember,
      status: newStatusValue,
      updatedAt: new Date().toISOString(),
      updatedBy: 'usr-admin-01',
    };

    setMembersDb(prev => ({
      ...prev,
      [orgId]: prev[orgId].map(m => (m.id === selectedMember.id ? updatedMember : m)),
    }));

    setAuditsDb(prev => ({
      ...prev,
      [orgId]: [auditEntry, ...(prev[orgId] || [])],
    }));

    setIsStatusModalOpen(false);
    setStatusReason('');
    showToast('সদস্য স্ট্যাটাস সফলভাবে পরিবর্তিত ও অডিট ট্রেইলে সংরক্ষিত হয়েছে');
  };

  // Handle Classification Change (Prompt 3.4)
  const handleSaveClassificationChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setClassificationError(null);

    if (!newClassificationId) {
      setClassificationError('অনুগ্রহ করে একটি সদস্য শ্রেণি নির্বাচন করুন');
      return;
    }

    if (newClassificationId === selectedMember.classificationId) {
      setClassificationError('নির্বাচিত শ্রেণি এবং বর্তমান শ্রেণি একই');
      return;
    }

    if (!classificationChangeReason.trim()) {
      setClassificationError('শ্রেণি পরিবর্তনের সুনির্দিষ্ট কারণ উল্লেখ করা আবশ্যক');
      return;
    }

    const targetCls = currentOrgClassifications.find(c => c.id === newClassificationId);
    if (!targetCls || !targetCls.isActive) {
      setClassificationError('নির্বাচিত শ্রেণিটি নিষ্ক্রিয় বা বিদ্যমান নয়');
      return;
    }

    const prevCls = currentOrgClassifications.find(c => c.id === selectedMember.classificationId);

    const historyEntry: MemberClassificationHistoryType = {
      id: `clsh-${Date.now()}`,
      organizationId: orgId,
      memberId: selectedMember.id,
      previousClassificationId: selectedMember.classificationId,
      previousClassificationName: prevCls?.name || 'পূর্ববর্তী কোনো শ্রেণি নেই',
      newClassificationId: targetCls.id,
      newClassificationName: targetCls.name,
      changedAt: new Date().toISOString(),
      changedBy: 'usr-admin-01',
      changedByName: 'অ্যাডমিন ইউজার',
      reason: classificationChangeReason.trim(),
      auditReference: `AUD-CLS-${Date.now().toString().slice(-4)}`,
    };

    const updatedMember: MemberType = {
      ...selectedMember,
      classificationId: targetCls.id,
      updatedAt: new Date().toISOString(),
      updatedBy: 'usr-admin-01',
    };

    setMembersDb(prev => ({
      ...prev,
      [orgId]: prev[orgId].map(m => (m.id === selectedMember.id ? updatedMember : m)),
    }));

    setClassificationHistoriesDb(prev => ({
      ...prev,
      [orgId]: [historyEntry, ...(prev[orgId] || [])],
    }));

    setIsClassificationModalOpen(false);
    setClassificationChangeReason('');
    showToast('সদস্য শ্রেণি সফলভাবে পরিবর্তিত ও ইতিহাস সংরক্ষিত হয়েছে');
  };

  // Handle Add Member-to-Member Relationship (Prompt 3.4)
  const handleAddRelationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setRelationError(null);

    const { relatedMemberId, relationTypeId, notes } = relationForm;

    if (!relatedMemberId) {
      setRelationError('অনুগ্রহ করে সম্পর্কিত সদস্য নির্বাচন করুন');
      return;
    }

    // Constraint: memberId !== relatedMemberId (Self-relation blocked)
    if (relatedMemberId === selectedMember.id) {
      setRelationError('একজন সদস্য নিজেকে নিজের সম্পর্কের সদস্য হিসেবে যোগ করতে পারেন না');
      return;
    }

    if (!relationTypeId) {
      setRelationError('অনুগ্রহ করে সম্পর্কের ধরন নির্বাচন করুন');
      return;
    }

    const relTypeConfig = currentOrgRelationTypes.find(r => r.id === relationTypeId);
    if (!relTypeConfig || !relTypeConfig.isActive) {
      setRelationError('নির্বাচিত সম্পর্কের ধরনটি নিষ্ক্রিয় বা বিদ্যমান নয়');
      return;
    }

    const targetMember = currentOrgMembers.find(m => m.id === relatedMemberId);
    if (!targetMember) {
      setRelationError('সম্পর্কিত সদস্য এই সংস্থায় বিদ্যমান নয়');
      return;
    }

    // Constraint: Duplicate relationship in same organization check
    const existingRelations = relationsDb[orgId] || [];
    const isDuplicate = existingRelations.some(
      r => r.memberId === selectedMember.id && r.relatedMemberId === relatedMemberId && r.relationTypeId === relationTypeId && r.status === 'active'
    );
    if (isDuplicate) {
      setRelationError(`এই সদস্যের সাথে ইতোমধ্যেই '${relTypeConfig.name}' সম্পর্ক সক্রিয়ভাবে বিদ্যমান`);
      return;
    }

    const newRelation: MemberRelationType = {
      id: `rel-inst-${Date.now()}`,
      organizationId: orgId,
      memberId: selectedMember.id,
      relatedMemberId: targetMember.id,
      relationTypeId: relTypeConfig.id,
      relationTypeName: relTypeConfig.name,
      notes: notes.trim() || undefined,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'usr-admin-01',
    };

    setRelationsDb(prev => ({
      ...prev,
      [orgId]: [newRelation, ...(prev[orgId] || [])],
    }));

    setIsRelationModalOpen(false);
    setRelationForm({ relatedMemberId: '', relationTypeId: '', notes: '' });
    showToast('পারিবারিক সম্পর্ক সফলভাবে সংরক্ষিত হয়েছে');
  };

  // Toggle Relationship status (Active / Inactive)
  const handleToggleRelationStatus = (relationId: string) => {
    setRelationsDb(prev => {
      const list = prev[orgId] || [];
      const updated = list.map(r => {
        if (r.id === relationId) {
          return {
            ...r,
            status: (r.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive',
            updatedAt: new Date().toISOString(),
            updatedBy: 'usr-admin-01',
          };
        }
        return r;
      });
      return { ...prev, [orgId]: updated };
    });
    showToast('সম্পর্কের স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে');
  };

  // If unauthorized role simulated
  if (!permissions.canView) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 font-heading">অনুমতি নেই (Access Denied)</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          সদস্য ব্যবস্থাপনা ও প্রোফাইল পরিদর্শনের জন্য প্রয়োজনীয় অনুমতি আপনার অ্যাকাউন্টে বরাদ্দ নেই।
        </p>
        <button
          onClick={() => setSimulatedRole('admin')}
          className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition"
        >
          অ্যাডমিন রোল সিমুলেট করুন
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-emerald-500/40 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Role Simulator Banner for QA & Testing */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-numeric shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-white block">RBAC পারমিশন সিমুলেটর (Security Context)</span>
            <span className="text-[11px] text-slate-400">
              বর্তমান সংস্থা: <strong className="text-emerald-400 font-mono">{currentOrg.name}</strong> ({currentOrg.id})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold">ভূমিকা পরিবর্তন:</span>
          {(['admin', 'manager', 'viewer', 'unauthorized'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSimulatedRole(r)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition ${
                simulatedRole === r
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r === 'admin' ? 'অ্যাডমিন' : r === 'manager' ? 'ম্যানেজার' : r === 'viewer' ? 'দর্শক' : 'অননুমোদিত'}
            </button>
          ))}
        </div>
      </div>

      {/* Master Detail Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Member Master List & Filters (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[820px]">
          {/* Header & Stats */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900 font-heading">সদস্য তালিকা</h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-numeric">
                  {filteredMembers.length}
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম, মেম্বার কোড বা মোবাইল..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-numeric"
              />
            </div>

            {/* Quick Filter: Status & Classification */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-numeric">
              <div>
                <label className="text-slate-500 font-semibold block mb-0.5">স্ট্যাটাস:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="all">সকল স্ট্যাটাস</option>
                  <option value="active">সক্রিয়</option>
                  <option value="inactive">নিষ্ক্রিয়</option>
                  <option value="suspended">স্থগিত</option>
                  <option value="archived">আর্কাইভকৃত</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-0.5">সদস্য শ্রেণি:</label>
                <select
                  value={classificationFilter}
                  onChange={(e) => setClassificationFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="all">সকল শ্রেণি</option>
                  {currentOrgClassifications.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Member List Scrollable */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredMembers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">কোনো সদস্যের তথ্য পাওয়া যায়নি</p>
              </div>
            ) : (
              filteredMembers.map((m) => {
                const isSelected = selectedMember?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMemberId(m.id)}
                    className={`w-full text-left p-3.5 flex items-center gap-3 transition ${
                      isSelected
                        ? 'bg-emerald-50/80 border-l-4 border-emerald-700'
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    {/* Avatar */}
                    {m.photoUrl ? (
                      <img
                        src={m.photoUrl}
                        alt={m.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 font-heading">
                        {m.fullName.charAt(0) || 'স'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 font-heading truncate">
                          {m.fullName}
                        </span>
                        {renderStatusBadge(m.status)}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-numeric mt-1">
                        <span className="font-mono text-emerald-800 font-semibold">{m.memberCode}</span>
                        <span>{m.mobile}</span>
                      </div>
                      {/* Classification indicator */}
                      <div className="mt-1">
                        {renderClassificationBadge(m.classificationId)}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Member Profile Detail Tabs (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden min-h-[820px]">
          {selectedMember ? (
            <div>
              {/* Profile Top Banner */}
              <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 p-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Photo with Edit Trigger */}
                    <div className="relative group shrink-0">
                      {selectedMember.photoUrl ? (
                        <img
                          src={selectedMember.photoUrl}
                          alt={selectedMember.fullName}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-white/10 text-white font-bold text-2xl flex items-center justify-center border-2 border-white/20 backdrop-blur-xs font-heading">
                          {selectedMember.fullName.charAt(0) || 'স'}
                        </div>
                      )}
                      {permissions.canEdit && (
                        <button
                          onClick={() => {
                            setPhotoInputUrl(selectedMember.photoUrl || '');
                            setIsPhotoModalOpen(true);
                          }}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition rounded-2xl flex items-center justify-center gap-1 text-[11px] font-semibold"
                          title="ছবি পরিবর্তন"
                        >
                          <Camera className="w-4 h-4" />
                          ছবি
                        </button>
                      )}
                    </div>

                    {/* Titles */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold font-heading text-white">
                          {selectedMember.fullName}
                        </h3>
                        {renderStatusBadge(selectedMember.status)}
                        {renderClassificationBadge(selectedMember.classificationId)}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-emerald-100 font-numeric">
                        <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white font-bold border border-white/10">
                          {selectedMember.memberCode}
                        </span>
                        <span>
                          যোগদান: {new Date(selectedMember.joinedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto font-numeric flex-wrap">
                    {permissions.canChangeClassification && (
                      <button
                        onClick={() => {
                          setNewClassificationId(selectedMember.classificationId || '');
                          setClassificationChangeReason('');
                          setClassificationError(null);
                          setIsClassificationModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition backdrop-blur-xs shadow-xs"
                      >
                        <Tag className="w-3.5 h-3.5 text-emerald-300" />
                        শ্রেণি পরিবর্তন
                      </button>
                    )}

                    {permissions.canEdit && (
                      <button
                        onClick={() => {
                          setEditFormData({ ...selectedMember });
                          setIsEditOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition backdrop-blur-xs shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        সংশোধন
                      </button>
                    )}

                    {permissions.canChangeStatus && (
                      <button
                        onClick={() => {
                          setNewStatusValue(selectedMember.status);
                          setStatusReason('');
                          setIsStatusModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold transition shadow-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        স্ট্যাটাস
                      </button>
                    )}

                    {permissions.canPrint && (
                      <button
                        onClick={() => setIsPrintModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-semibold transition shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        প্রিন্ট
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Completeness Bar */}
              {completeness && (
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-numeric">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span className="font-semibold text-slate-700">প্রোফাইল তথ্য সমাপ্তি:</span>
                    <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          completeness.score >= 80 ? 'bg-emerald-600' : completeness.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${completeness.score}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900">{completeness.score}%</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    {Object.entries(completeness.sections).map(([key, sec]) => (
                      <span
                        key={key}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          sec.isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                        title={sec.details}
                      >
                        {sec.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 6 Structural Navigation Tabs (Prompt 3.4 Integration) */}
              <div className="flex border-b border-slate-200 px-6 overflow-x-auto text-xs font-semibold font-numeric">
                <button
                  onClick={() => setActiveProfileTab('identity')}
                  className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeProfileTab === 'identity'
                      ? 'border-emerald-700 text-emerald-800 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  ১. পরিচিতি
                </button>

                <button
                  onClick={() => setActiveProfileTab('contact_address')}
                  className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeProfileTab === 'contact_address'
                      ? 'border-emerald-700 text-emerald-800 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  ২. যোগাযোগ ও ঠিকানা
                </button>

                <button
                  onClick={() => setActiveProfileTab('family')}
                  className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeProfileTab === 'family'
                      ? 'border-emerald-700 text-emerald-800 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  ৩. পারিবারিক তথ্য
                </button>

                <button
                  onClick={() => setActiveProfileTab('identification')}
                  className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeProfileTab === 'identification'
                      ? 'border-emerald-700 text-emerald-800 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  ৪. পরিচয় তথ্য (NID)
                </button>

                <button
                  onClick={() => setActiveProfileTab('classification_relations')}
                  className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeProfileTab === 'classification_relations'
                      ? 'border-emerald-700 text-emerald-800 font-bold bg-emerald-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-700" />
                  ৫. শ্রেণি ও সম্পর্ক
                </button>

                <button
                  onClick={() => setActiveProfileTab('documents_photos')}
                  className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeProfileTab === 'documents_photos'
                      ? 'border-emerald-700 text-emerald-800 font-bold bg-emerald-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-700" />
                  ৬. ডকুমেন্ট ও ছবি (Prompt 3.5)
                </button>

                <button
                  onClick={() => setActiveProfileTab('audit')}
                  className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                    activeProfileTab === 'audit'
                      ? 'border-emerald-700 text-emerald-800 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <History className="w-4 h-4" />
                  ৭. অডিট ট্রেইল
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="p-6">
                {/* Tab 1: পরিচিতি (Basic Identity) */}
                {activeProfileTab === 'identity' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-slate-400 block font-numeric">পূর্ণ নাম (বাংলায়)</span>
                        <span className="text-sm font-bold text-slate-900 font-heading mt-0.5 block">
                          {selectedMember.fullName}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-slate-400 block font-numeric">মেম্বার কোড (স্থায়ী ও অনন্য)</span>
                        <span className="text-sm font-mono font-bold text-emerald-800 mt-0.5 block">
                          {selectedMember.memberCode}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-slate-400 block font-numeric">বর্তমান সদস্য শ্রেণি (Classification)</span>
                        <div className="mt-1">
                          {renderClassificationBadge(selectedMember.classificationId)}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-slate-400 block font-numeric">লিঙ্গ</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                          {selectedMember.gender === 'male' ? 'পুরুষ' : selectedMember.gender === 'female' ? 'মহিলা' : 'অন্যান্য'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-slate-400 block font-numeric">পেশা / কর্মক্ষেত্র</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                          {selectedMember.occupation || 'তথ্য নেই'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-slate-400 block font-numeric">জন্মতারিখ (Date of Birth)</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block font-numeric">
                          {selectedMember.dateOfBirth ? (
                            new Date(selectedMember.dateOfBirth).toLocaleDateString('bn-BD', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })
                          ) : 'তথ্য নেই'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-emerald-800 block font-numeric">বয়স (স্বয়ংক্রিয় ডাইনামিক গণনা)</span>
                          <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-1.5 py-0.5 rounded font-numeric font-bold">
                            Dynamic
                          </span>
                        </div>
                        <span className="text-sm font-bold text-emerald-950 mt-0.5 block font-numeric">
                          {calculateAge(selectedMember.dateOfBirth).displayBangla}
                        </span>
                      </div>
                    </div>

                    {selectedMember.notes && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[11px] font-semibold text-slate-400 block font-numeric">অতিরিক্ত মন্তব্য / নোট</span>
                        <p className="text-xs text-slate-700 mt-1">{selectedMember.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: যোগাযোগ ও ঠিকানা (Contact & Address) */}
                {activeProfileTab === 'contact_address' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        যোগাযোগের বিবরণ
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[11px] font-semibold text-slate-400 block font-numeric">মোবাইল নম্বর (প্রধান)</span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-bold font-mono text-slate-900">{selectedMember.mobile}</span>
                            <button
                              onClick={() => handleCopy(selectedMember.mobile, 'mobile')}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
                              title="কপি করুন"
                            >
                              {copiedField === 'mobile' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[11px] font-semibold text-slate-400 block font-numeric">ইমেইল ঠিকানা</span>
                          <span className="text-sm font-semibold text-slate-800 mt-1 block">
                            {selectedMember.email || 'তথ্য নেই'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        ঠিকানা সংক্রান্ত তথ্য
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-400 block font-numeric">বর্তমান ঠিকানা</span>
                            <span className="text-[10px] text-slate-500 font-semibold bg-slate-200/60 px-1.5 py-0.5 rounded">
                              Current Address
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-800 mt-1 leading-relaxed">
                            {selectedMember.currentAddress || selectedMember.address || 'তথ্য নেই'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-400 block font-numeric">স্থায়ী ঠিকানা</span>
                            <span className="text-[10px] text-slate-500 font-semibold bg-slate-200/60 px-1.5 py-0.5 rounded">
                              Permanent Address
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-800 mt-1 leading-relaxed">
                            {selectedMember.isSameAddress ? (
                              <span className="text-emerald-800 font-semibold">
                                বর্তমান ঠিকানার অনুরূপ: {selectedMember.currentAddress || selectedMember.address}
                              </span>
                            ) : (
                              selectedMember.permanentAddress || 'তথ্য নেই'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: পারিবারিক তথ্য (Family Information) */}
                {activeProfileTab === 'family' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-slate-400 block font-numeric">পিতা / স্বামীর নাম</span>
                        <span className="text-sm font-bold text-slate-900 font-heading mt-0.5 block">
                          {selectedMember.fatherOrSpouseName || 'তথ্য নেই'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[11px] font-semibold text-slate-400 block font-numeric">মাতার নাম</span>
                        <span className="text-sm font-bold text-slate-900 font-heading mt-0.5 block">
                          {selectedMember.motherName || 'তথ্য নেই'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs text-blue-900">
                      <Heart className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block font-heading">সদস্য-সম্পর্ক ও পরিবারের সংযোগ</span>
                        <p className="text-[11px] text-blue-800 mt-0.5">
                          সমিতির অন্যান্য সদস্যদের সাথে সম্পর্ক (যেমন: পিতা-পুত্র, সহোদর ভাই) পরিচালনা করতে <strong>‘৫. শ্রেণি ও সম্পর্ক’</strong> ট্যাব ব্যবহার করুন।
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: পরিচয় তথ্য (NID Privacy) */}
                {activeProfileTab === 'identification' && (
                  <div className="space-y-6">
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 font-numeric">জাতীয় পরিচয়পত্র (NID)</span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            তথ্য নিরাপত্তা রক্ষার্থে NID নম্বর ডিফল্টভাবে সুরক্ষিত ও মাস্কড রাখা হয়।
                          </p>
                        </div>

                        {/* Permission Guarded Eye Toggle */}
                        {permissions.canViewFullNid ? (
                          <button
                            onClick={() => {
                              setRevealedNidMemberId(
                                revealedNidMemberId === selectedMember.id ? null : selectedMember.id
                              );
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition"
                          >
                            {revealedNidMemberId === selectedMember.id ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                                গোপন করুন
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                সম্পূর্ণ NID দেখুন
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">রিভিলের অনুমতি নেই</span>
                        )}
                      </div>

                      {/* Masked / Unmasked Box */}
                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                        <span className="font-mono text-base font-bold text-slate-900 tracking-wider">
                          {revealedNidMemberId === selectedMember.id
                            ? selectedMember.nid || 'তথ্য নেই'
                            : maskNid(selectedMember.nid)}
                        </span>
                        {selectedMember.nid && (
                          <button
                            onClick={() => handleCopy(selectedMember.nid || '', 'nid')}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition"
                            title="NID কপি করুন"
                          >
                            {copiedField === 'nid' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 5: শ্রেণি ও সম্পর্ক (Classification & Member Relations - Prompt 3.4) */}
                {activeProfileTab === 'classification_relations' && (
                  <div className="space-y-6">
                    {/* Section A: Current Classification Info & Change Action */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-slate-500 font-numeric">বর্তমান সদস্য শ্রেণি (Member Classification)</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <h4 className="text-base font-bold text-slate-900 font-heading">
                                {currentMemberClassification ? currentMemberClassification.name : 'কোনো নির্দিষ্ট শ্রেণি বরাদ্দ নেই'}
                              </h4>
                              {currentMemberClassification && (
                                <span className="font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                                  {currentMemberClassification.code}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {permissions.canChangeClassification && (
                          <button
                            onClick={() => {
                              setNewClassificationId(selectedMember.classificationId || '');
                              setClassificationChangeReason('');
                              setClassificationError(null);
                              setIsClassificationModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            শ্রেণি পরিবর্তন করুন
                          </button>
                        )}
                      </div>

                      {currentMemberClassification?.description && (
                        <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/70">
                          {currentMemberClassification.description}
                        </p>
                      )}
                    </div>

                    {/* Section B: Classification History Timeline */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-wider flex items-center gap-1.5">
                        <History className="w-4 h-4 text-emerald-700" />
                        সদস্য শ্রেণি পরিবর্তনের ইতিহাস (Classification History)
                      </h4>

                      {selectedMemberClassificationHistories.length === 0 ? (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                          কোনো পূর্ববর্তী শ্রেণি পরিবর্তনের ইতিহাস পাওয়া যায়নি
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs font-numeric">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                              <tr>
                                <th className="px-3.5 py-2.5">তারিখ</th>
                                <th className="px-3.5 py-2.5">পূর্ববর্তী শ্রেণি</th>
                                <th className="px-3.5 py-2.5">নতুন শ্রেণি</th>
                                <th className="px-3.5 py-2.5">পরিবর্তনকারী</th>
                                <th className="px-3.5 py-2.5">কারণ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {selectedMemberClassificationHistories.map((h) => (
                                <tr key={h.id} className="hover:bg-slate-50/60">
                                  <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-500">
                                    {new Date(h.changedAt).toLocaleDateString('bn-BD', {
                                      year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                  </td>
                                  <td className="px-3.5 py-2.5 text-slate-500">
                                    {h.previousClassificationName || '—'}
                                  </td>
                                  <td className="px-3.5 py-2.5 font-bold text-emerald-800">
                                    {h.newClassificationName}
                                  </td>
                                  <td className="px-3.5 py-2.5 text-slate-600">
                                    {h.changedByName || h.changedBy}
                                  </td>
                                  <td className="px-3.5 py-2.5 text-slate-600 max-w-xs truncate">
                                    {h.reason || '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Section C: Member-to-Member Relationships */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-wider flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-emerald-700" />
                          পরিবার ও সদস্য-সম্পর্ক (Member-to-Member Relations)
                        </h4>

                        {permissions.canManageRelations && (
                          <button
                            onClick={() => {
                              setRelationForm({ relatedMemberId: '', relationTypeId: '', notes: '' });
                              setRelationError(null);
                              setIsRelationModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            + সম্পর্ক যোগ করুন
                          </button>
                        )}
                      </div>

                      {selectedMemberRelations.length === 0 ? (
                        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500 space-y-2">
                          <Heart className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="text-xs">সমিতির অন্য কোনো সদস্যের সাথে এখনও সম্পর্ক যুক্ত করা হয়নি</p>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs font-numeric">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                              <tr>
                                <th className="px-3.5 py-2.5">সম্পর্কের ধরন</th>
                                <th className="px-3.5 py-2.5">সম্পর্কিত সদস্য</th>
                                <th className="px-3.5 py-2.5">মেম্বার কোড</th>
                                <th className="px-3.5 py-2.5">মোবাইল</th>
                                <th className="px-3.5 py-2.5 text-center">স্ট্যাটাস</th>
                                <th className="px-3.5 py-2.5 text-right">কার্যক্রম</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {selectedMemberRelations.map((rel) => {
                                const related = currentOrgMembers.find(m => m.id === rel.relatedMemberId);
                                const relConfig = currentOrgRelationTypes.find(r => r.id === rel.relationTypeId);
                                return (
                                  <tr key={rel.id} className="hover:bg-slate-50/60">
                                    <td className="px-3.5 py-2.5 font-bold font-heading text-slate-900">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px]">
                                        {rel.relationTypeName || relConfig?.name || 'সম্পর্ক'}
                                      </span>
                                    </td>
                                    <td className="px-3.5 py-2.5 font-bold font-heading text-slate-900">
                                      {related ? related.fullName : 'অজানা সদস্য'}
                                    </td>
                                    <td className="px-3.5 py-2.5 font-mono text-emerald-800 font-bold">
                                      {related ? related.memberCode : '—'}
                                    </td>
                                    <td className="px-3.5 py-2.5 font-mono text-slate-600">
                                      {related ? `${related.mobile.slice(0, 3)}****${related.mobile.slice(-4)}` : '—'}
                                    </td>
                                    <td className="px-3.5 py-2.5 text-center">
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        rel.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${rel.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                                        {rel.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                      </span>
                                    </td>
                                    <td className="px-3.5 py-2.5 text-right">
                                      {permissions.canManageRelations && (
                                        <button
                                          onClick={() => handleToggleRelationStatus(rel.id)}
                                          className="text-[11px] font-semibold text-slate-600 hover:text-emerald-700 underline"
                                        >
                                          {rel.status === 'active' ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 6: অডিট ট্রেইল (Activity & Audit) */}
                {activeProfileTab === 'audit' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-emerald-700" />
                      সদস্য স্ট্যাটাস ও কার্যক্রম অডিট ট্রেইল
                    </h4>

                    {selectedMemberAudits.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                        <History className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                        <p className="text-xs">কোনো স্ট্যাটাস পরিবর্তনের রেকর্ড নেই</p>
                      </div>
                    ) : (
                      <div className="space-y-3 font-numeric">
                        {selectedMemberAudits.map((a) => (
                          <div key={a.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                              <UserCheck className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 font-heading">
                                  স্ট্যাটাস পরিবর্তন: <span className="capitalize">{a.previousStatus}</span> ➔ <span className="capitalize font-bold text-emerald-800">{a.newStatus}</span>
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(a.timestamp).toLocaleString('bn-BD')}
                                </span>
                              </div>
                              <p className="text-slate-600 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
                                <strong>কারণ:</strong> {a.reason}
                              </p>
                              <span className="text-[10px] text-slate-400 block">
                                সম্পাদনকারী: {a.changedByName} ({a.changedByUserId})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 6: ডকুমেন্ট ও ছবি (Prompt 3.5) */}
                {activeProfileTab === 'documents_photos' && selectedMember && (
                  <MemberDocumentsPhotosView
                    currentOrg={currentOrg}
                    selectedMember={selectedMember}
                    onUpdateMemberAvatar={(newUrl) => {
                      setMembersDb(prev => ({
                        ...prev,
                        [orgId]: (prev[orgId] || []).map(m =>
                          m.id === selectedMember.id ? { ...m, photoUrl: newUrl } : m
                        ),
                      }));
                      showToast('সদস্য প্রোফাইল ছবি আপডেট করা হয়েছে');
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              সদস্য নির্বাচন করুন
            </div>
          )}
        </div>
      </div>

      {/* Change Classification Modal (Prompt 3.4) */}
      {isClassificationModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-heading flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-700" />
                সদস্য শ্রেণি পরিবর্তন
              </h3>
              <button
                onClick={() => setIsClassificationModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClassificationChange} className="p-6 space-y-4 text-xs font-numeric">
              {classificationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{classificationError}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block mb-1">সদস্যের নাম:</span>
                <span className="font-bold text-slate-900 font-heading text-sm block">
                  {selectedMember.fullName} ({selectedMember.memberCode})
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  নতুন সদস্য শ্রেণি নির্বাচন করুন <span className="text-rose-600">*</span>
                </label>
                <select
                  value={newClassificationId}
                  onChange={(e) => setNewClassificationId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-700/20"
                >
                  <option value="">-- শ্রেণি বাছাই করুন --</option>
                  {currentOrgClassifications.filter(c => c.isActive).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  শ্রেণি পরিবর্তনের কারণ <span className="text-rose-600">*</span>
                </label>
                <textarea
                  value={classificationChangeReason}
                  onChange={(e) => setClassificationChangeReason(e.target.value)}
                  rows={3}
                  placeholder="যেমন: ১ বছর নিয়মিত সক্রিয়তার পর সাধারণ সদস্যে রূপান্তর"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClassificationModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs transition"
                >
                  শ্রেণি নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Relationship Modal (Prompt 3.4) */}
      {isRelationModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-heading flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-700" />
                নতুন পারিবারিক সম্পর্ক স্থাপন
              </h3>
              <button
                onClick={() => setIsRelationModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelationSubmit} className="p-6 space-y-4 text-xs font-numeric">
              {relationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{relationError}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block mb-1">মূল সদস্য:</span>
                <span className="font-bold text-slate-900 font-heading text-sm block">
                  {selectedMember.fullName} ({selectedMember.memberCode})
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  সম্পর্কিত সদস্য নির্বাচন করুন <span className="text-rose-600">*</span>
                </label>
                <select
                  value={relationForm.relatedMemberId}
                  onChange={(e) => setRelationForm({ ...relationForm, relatedMemberId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-700/20"
                >
                  <option value="">-- সদস্য বাছাই করুন --</option>
                  {currentOrgMembers
                    .filter(m => m.id !== selectedMember.id)
                    .map(m => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.memberCode} • {m.mobile})
                      </option>
                    ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-0.5 block">শুধুমাত্র একই সংগঠনের সদস্য নির্বাচনযোগ্য</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  সম্পর্কের ধরন <span className="text-rose-600">*</span>
                </label>
                <select
                  value={relationForm.relationTypeId}
                  onChange={(e) => setRelationForm({ ...relationForm, relationTypeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-700/20"
                >
                  <option value="">-- সম্পর্কের ধরন বাছাই করুন --</option>
                  {currentOrgRelationTypes.filter(r => r.isActive).map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.reciprocalName ? `(বিপরীত: ${r.reciprocalName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  মন্তব্য / নোট (ঐচ্ছিক)
                </label>
                <textarea
                  value={relationForm.notes}
                  onChange={(e) => setRelationForm({ ...relationForm, notes: e.target.value })}
                  rows={2}
                  placeholder="সম্পর্ক সংক্রান্ত অতিরিক্ত বিবরণ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRelationModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs transition"
                >
                  সম্পর্ক সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-heading">সদস্যের তথ্য সংশোধন</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs font-numeric max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">পূর্ণ নাম <span className="text-rose-600">*</span></label>
                <input
                  type="text"
                  value={editFormData.fullName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 font-heading"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">মোবাইল <span className="text-rose-600">*</span></label>
                  <input
                    type="text"
                    value={editFormData.mobile || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ইমেইল</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">জন্মতারিখ</label>
                  <input
                    type="date"
                    value={editFormData.dateOfBirth || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">লিঙ্গ</label>
                  <select
                    value={editFormData.gender || 'male'}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="male">পুরুষ</option>
                    <option value="female">মহিলা</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">পেশা</label>
                <input
                  type="text"
                  value={editFormData.occupation || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">পিতা / স্বামীর নাম</label>
                  <input
                    type="text"
                    value={editFormData.fatherOrSpouseName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, fatherOrSpouseName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">মাতার নাম</label>
                  <input
                    type="text"
                    value={editFormData.motherName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, motherName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">জাতীয় পরিচয়পত্র (NID)</label>
                <input
                  type="text"
                  value={editFormData.nid || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, nid: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">বর্তমান ঠিকানা</label>
                <textarea
                  value={editFormData.currentAddress || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, currentAddress: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sameAddr"
                  checked={editFormData.isSameAddress ?? false}
                  onChange={(e) => setEditFormData({ ...editFormData, isSameAddress: e.target.checked })}
                  className="rounded text-emerald-700 focus:ring-emerald-700"
                />
                <label htmlFor="sameAddr" className="text-slate-700 font-semibold">স্থায়ী ঠিকানা বর্তমান ঠিকানার অনুরূপ</label>
              </div>

              {!editFormData.isSameAddress && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">স্থায়ী ঠিকানা</label>
                  <textarea
                    value={editFormData.permanentAddress || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, permanentAddress: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs transition"
                >
                  হালনাগাদ সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {isStatusModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-heading">সদস্য স্ট্যাটাস পরিবর্তন</h3>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStatusChangeSubmit} className="p-6 space-y-4 text-xs font-numeric">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block mb-1">সদস্যের নাম:</span>
                <span className="font-bold text-slate-900 font-heading text-sm block">{selectedMember.fullName} ({selectedMember.memberCode})</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">নতুন স্ট্যাটাস নির্বাচন করুন</label>
                <select
                  value={newStatusValue}
                  onChange={(e) => setNewStatusValue(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="active">সক্রিয় (Active)</option>
                  <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                  <option value="suspended">স্থগিত (Suspended)</option>
                  <option value="archived">আর্কাইভকৃত (Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  পরিবর্তনের কারণ <span className="text-rose-600">*</span>
                </label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  rows={3}
                  placeholder="স্ট্যাটাস পরিবর্তনের যৌক্তিক কারণ লিপিবদ্ধ করুন..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs transition"
                >
                  স্ট্যাটাস পরিবর্তন নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official A4 Print Preview Modal */}
      {isPrintModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold font-heading">অফিসিয়াল সদস্য পরিচিতিপত্র (A4 Print Preview)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  প্রিন্ট কমান্ড
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* A4 Document Canvas */}
            <div className="p-8 overflow-y-auto bg-slate-100 flex-1 flex justify-center">
              <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-sm border border-slate-200 text-slate-800 font-body space-y-6">
                {/* Header */}
                <div className="border-b-2 border-emerald-900 pb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-emerald-950 font-heading">
                      {currentOrg.name}
                    </h1>
                    <p className="text-xs text-slate-500 font-numeric">{currentOrg.address} • {currentOrg.phone}</p>
                    <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-numeric">
                      সদস্য পরিচিতিপত্র (Member Profile)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-700 block">
                      {selectedMember.memberCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-numeric">
                      তারিখ: {new Date().toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                </div>

                {/* Profile Core */}
                <div className="flex items-start gap-6 border-b border-slate-200 pb-6">
                  {selectedMember.photoUrl ? (
                    <img
                      src={selectedMember.photoUrl}
                      alt={selectedMember.fullName}
                      className="w-24 h-24 rounded-xl object-cover border border-slate-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-slate-100 text-slate-600 font-bold text-3xl flex items-center justify-center border border-slate-300 font-heading">
                      {selectedMember.fullName.charAt(0) || 'স'}
                    </div>
                  )}

                  <div className="flex-1 grid grid-cols-2 gap-3 text-xs font-numeric">
                    <div>
                      <span className="text-slate-400 block text-[11px]">সদস্যের নাম</span>
                      <span className="font-bold text-slate-900 text-sm font-heading">{selectedMember.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">সদস্য শ্রেণি</span>
                      <span className="font-bold text-emerald-900">
                        {currentMemberClassification ? currentMemberClassification.name : 'সাধারণ'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">স্ট্যাটাস</span>
                      <span className="font-bold text-emerald-800 capitalize">{selectedMember.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">মোবাইল নম্বর</span>
                      <span className="font-semibold text-slate-900 font-mono">{selectedMember.mobile}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">বয়স ও লিঙ্গ</span>
                      <span className="font-semibold text-slate-900">
                        {calculateAge(selectedMember.dateOfBirth).displayBangla} ({selectedMember.gender === 'male' ? 'পুরুষ' : 'মহিলা'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Information Table */}
                <div className="space-y-4 text-xs font-numeric">
                  <h4 className="font-bold text-slate-900 font-heading border-b border-slate-200 pb-1">
                    পারিবারিক ও পরিচয় তথ্য
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block text-[11px]">পিতা / স্বামীর নাম</span>
                      <span className="font-semibold text-slate-800">{selectedMember.fatherOrSpouseName || 'তথ্য নেই'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">মাতার নাম</span>
                      <span className="font-semibold text-slate-800">{selectedMember.motherName || 'তথ্য নেই'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">পেশা</span>
                      <span className="font-semibold text-slate-800">{selectedMember.occupation || 'তথ্য নেই'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">জাতীয় পরিচয়পত্র (NID)</span>
                      <span className="font-mono font-semibold text-slate-800">{maskNid(selectedMember.nid)}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 font-heading border-b border-slate-200 pb-1 pt-2">
                    ঠিকানা সংক্রান্ত বিবরণ
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block text-[11px]">বর্তমান ঠিকানা</span>
                      <p className="text-slate-800 font-medium leading-relaxed">{selectedMember.currentAddress || selectedMember.address || 'তথ্য নেই'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">স্থায়ী ঠিকানা</span>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {selectedMember.isSameAddress ? selectedMember.currentAddress : (selectedMember.permanentAddress || 'তথ্য নেই')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="pt-12 flex justify-between text-xs text-slate-500 font-numeric">
                  <div className="text-center">
                    <div className="w-36 border-t border-slate-400 pt-1 font-semibold">সদস্যের স্বাক্ষর</div>
                  </div>
                  <div className="text-center">
                    <div className="w-36 border-t border-slate-400 pt-1 font-semibold">অনুমোদনকারী কর্মকর্তা</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
