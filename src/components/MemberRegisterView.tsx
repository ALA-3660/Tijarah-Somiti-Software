import React, { useState, useMemo, useEffect } from 'react';
import {
  OrganizationContext,
  MemberType,
  MemberClassificationType,
  MemberStatusType,
  MemberActivityEvent,
  DuplicateCandidate,
  MemberFilterCriteria,
  MemberSortOptions,
  MemberSortField,
  ProfileCompleteness,
  DocumentVerificationStatus,
} from '../types';
import { calculateCompleteness, maskNid } from './MemberProfileManagementView';
import { INITIAL_CLASSIFICATIONS } from './MemberMasterDataManagementView';
import { SEED_MEMBERS } from './MemberProfileManagementView';
import { INITIAL_MEMBER_DOCUMENTS } from './MemberDocumentsPhotosView';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  History,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  FileSpreadsheet,
  Layers,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  X,
  CheckSquare,
  Square,
  FileText,
  Camera,
  HeartHandshake,
  Check,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface MemberRegisterViewProps {
  currentOrg: OrganizationContext;
  onSelectMemberForProfile?: (memberId: string) => void;
  onSyncOrganization?: (orgId: string, orgName: string) => void;
}

// Initial Simulated Seed Activities for Demo
const SEED_ACTIVITIES: Record<string, MemberActivityEvent[]> = {
  'mem-001': [
    {
      id: 'act-101',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      eventType: 'MEMBER_CREATED',
      title: 'সদস্য রেকর্ড ও প্রোফাইল তৈরি',
      actorId: 'usr-admin-01',
      actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
      timestamp: '2023-01-15T10:00:00.000Z',
      notes: 'প্রতিষ্ঠাতা সদস্য হিসেবে প্রাথমিক ডেটা এন্ট্রি সম্পন্ন',
    },
    {
      id: 'act-102',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      eventType: 'CLASSIFICATION_CHANGED',
      title: 'শ্রেণিবিন্যাস নির্ধারণ',
      actorId: 'usr-admin-01',
      actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
      timestamp: '2023-01-15T10:15:00.000Z',
      newValue: 'প্রতিষ্ঠাতা সদস্য (cls-001)',
      notes: 'বোর্ড অনুমোদনের ভিত্তিতে শ্রেণিবিন্যাস বরাদ্দ',
    },
    {
      id: 'act-103',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      eventType: 'DOCUMENT_VERIFIED',
      title: 'জাতীয় পরিচয়পত্র যাচাই সম্পন্ন',
      actorId: 'usr-admin-01',
      actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
      timestamp: '2023-01-16T14:30:00.000Z',
      referenceId: 'doc-001',
      referenceType: 'National ID',
      notes: 'মূল স্মার্ট কার্ড যাচাই করে অনুমোদন প্রদান করা হয়েছে',
    },
    {
      id: 'act-104',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      eventType: 'PRIMARY_PHOTO_CHANGED',
      title: 'প্রাইমারি প্রোফাইল ছবি আপডেট',
      actorId: 'usr-admin-01',
      actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
      timestamp: '2023-01-16T15:00:00.000Z',
      newValue: 'অফিসিয়াল স্টুডিও পোর্ট্রেট',
    },
    {
      id: 'act-105',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-001',
      eventType: 'RELATION_ADDED',
      title: 'সদস্য সম্পর্ক সংযোজন',
      actorId: 'usr-admin-01',
      actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
      timestamp: '2023-01-20T11:00:00.000Z',
      referenceId: 'mem-002',
      newValue: 'সহকর্মী / অংশীদার (আহমদ উল্লাহ চৌধুরী)',
    },
  ],
  'mem-002': [
    {
      id: 'act-201',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-002',
      eventType: 'MEMBER_CREATED',
      title: 'সদস্য রেকর্ড তৈরি',
      actorId: 'usr-admin-01',
      actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
      timestamp: '2023-02-10T11:30:00.000Z',
    },
    {
      id: 'act-202',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-002',
      eventType: 'DOCUMENT_VERIFIED',
      title: 'এনআইডি ও ট্রেড লাইসেন্স যাচাই',
      actorId: 'usr-admin-01',
      actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
      timestamp: '2023-02-12T16:00:00.000Z',
    },
  ],
  'mem-003': [
    {
      id: 'act-301',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-003',
      eventType: 'MEMBER_CREATED',
      title: 'সদস্য রেকর্ড তৈরি',
      actorId: 'usr-admin-01',
      actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
      timestamp: '2023-03-15T09:15:00.000Z',
    },
    {
      id: 'act-302',
      organizationId: 'demo-org-khurushkul',
      memberId: 'mem-003',
      eventType: 'DOCUMENT_VERIFIED',
      title: 'জন্ম নিবন্ধন ও শিক্ষাগত সনদ যাচাই',
      actorId: 'usr-admin-01',
      actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
      timestamp: '2023-03-16T12:00:00.000Z',
    },
  ],
};

export const MemberRegisterView: React.FC<MemberRegisterViewProps> = ({
  currentOrg,
  onSelectMemberForProfile,
}) => {
  const orgId = currentOrg.id;

  // Security Simulation Role
  const [simulatedRole, setSimulatedRole] = useState<'admin' | 'manager' | 'viewer' | 'unauthorized'>('admin');
  
  // Local Database State scoped by Organization
  const [membersDb, setMembersDb] = useState<Record<string, MemberType[]>>(SEED_MEMBERS);
  const [classificationsDb] = useState<Record<string, MemberClassificationType[]>>(INITIAL_CLASSIFICATIONS);
  const [activitiesDb, setActivitiesDb] = useState<Record<string, MemberActivityEvent[]>>(SEED_ACTIVITIES);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MemberFilterCriteria>({
    status: 'all',
    classificationId: 'all',
    gender: 'all',
    occupation: 'all',
    joinDateFrom: '',
    joinDateTo: '',
    completenessFilter: 'all',
    documentVerificationStatus: 'all',
    photoStatus: 'all',
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sorting & Pagination State
  const [sortOptions, setSortOptions] = useState<MemberSortOptions>({
    field: 'memberCode',
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Selection State
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionType: 'status_change' | 'classification_change' | null;
  }>({ isOpen: false, actionType: null });
  const [bulkTargetStatus, setBulkTargetStatus] = useState<MemberStatusType>('active');
  const [bulkTargetClassificationId, setBulkTargetClassificationId] = useState<string>('');
  const [bulkReason, setBulkReason] = useState('');

  // 360° Summary Modal
  const [selected360Member, setSelected360Member] = useState<MemberType | null>(null);

  // Activity Timeline Modal
  const [selectedTimelineMember, setSelectedTimelineMember] = useState<MemberType | null>(null);

  // Data Quality & Duplicate Detection Modal
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [reviewedDuplicates, setReviewedDuplicates] = useState<Record<string, 'distinct' | 'flagged'>>({});

  // Print Register Modal
  const [isPrintRegisterModalOpen, setIsPrintRegisterModalOpen] = useState(false);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset pagination and selection on Org change
  useEffect(() => {
    setSelectedMemberIds([]);
    setCurrentPage(1);
    setSelected360Member(null);
    setSelectedTimelineMember(null);
    setIsDuplicateModalOpen(false);
    setIsPrintRegisterModalOpen(false);
  }, [orgId]);

  // Current Org Data
  const currentOrgMembers = useMemo(() => {
    return membersDb[orgId] || [];
  }, [membersDb, orgId]);

  const currentOrgClassifications = useMemo(() => {
    return (classificationsDb[orgId] || []).filter(c => c.isActive);
  }, [classificationsDb, orgId]);

  // Unique Occupations for Filter Dropdown
  const uniqueOccupations = useMemo(() => {
    const set = new Set<string>();
    currentOrgMembers.forEach(m => {
      if (m.occupation && m.occupation.trim()) set.add(m.occupation.trim());
    });
    return Array.from(set);
  }, [currentOrgMembers]);

  // Get Classification Name Helper
  const getClassificationName = (classificationId?: string) => {
    if (!classificationId) return 'সাধারণ সদস্য';
    const found = currentOrgClassifications.find(c => c.id === classificationId);
    return found ? found.name : 'সাধারণ সদস্য';
  };

  // Helper: Get member document verification summary
  const getMemberDocSummary = (memberId: string) => {
    const orgDocs = INITIAL_MEMBER_DOCUMENTS[orgId] || [];
    const docs = orgDocs.filter((d: any) => d.memberId === memberId);
    const verified = docs.filter((d: any) => d.verificationStatus === 'verified').length;
    const pending = docs.filter((d: any) => d.verificationStatus === 'pending_verification').length;
    const rejected = docs.filter((d: any) => d.verificationStatus === 'rejected').length;
    const archived = docs.filter((d: any) => d.verificationStatus === 'archived').length;
    return { total: docs.length, verified, pending, rejected, archived };
  };

  // Duplicate Candidates Computation
  const duplicateCandidates: DuplicateCandidate[] = useMemo(() => {
    const list: DuplicateCandidate[] = [];
    const members = currentOrgMembers;

    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const m1 = members[i];
        const m2 = members[j];
        const reasons: DuplicateCandidate['matchReasons'] = [];
        let score = 0;

        // 1. Same Mobile
        if (m1.mobile && m2.mobile && m1.mobile.trim() === m2.mobile.trim()) {
          reasons.push('SAME_MOBILE');
          score += 45;
        }

        // 2. Same NID
        if (m1.nid && m2.nid && m1.nid.trim() === m2.nid.trim()) {
          reasons.push('SAME_NID');
          score += 50;
        }

        // 3. Same Name and DOB
        if (
          m1.fullName && m2.fullName &&
          m1.fullName.trim().toLowerCase() === m2.fullName.trim().toLowerCase() &&
          m1.dateOfBirth && m2.dateOfBirth &&
          m1.dateOfBirth === m2.dateOfBirth
        ) {
          reasons.push('SAME_NAME_AND_DOB');
          score += 35;
        }

        // 4. Similar identity (Same Father + Similar Name)
        if (
          m1.fatherOrSpouseName && m2.fatherOrSpouseName &&
          m1.fatherOrSpouseName.trim() === m2.fatherOrSpouseName.trim() &&
          m1.fullName && m2.fullName &&
          (m1.fullName.includes(m2.fullName) || m2.fullName.includes(m1.fullName))
        ) {
          reasons.push('SIMILAR_IDENTITY_COMBINATION');
          score += 20;
        }

        if (reasons.length > 0) {
          const candidateId = `dup-${m1.id}-${m2.id}`;
          const reviewStatus = reviewedDuplicates[candidateId]
            ? (reviewedDuplicates[candidateId] === 'distinct' ? 'reviewed_distinct' : 'flagged_for_manual_action')
            : 'pending_review';

          list.push({
            id: candidateId,
            organizationId: orgId,
            primaryMemberId: m1.id,
            duplicateMemberId: m2.id,
            primaryMemberName: m1.fullName,
            duplicateMemberName: m2.fullName,
            primaryMemberCode: m1.memberCode,
            duplicateMemberCode: m2.memberCode,
            primaryMobile: m1.mobile,
            duplicateMobile: m2.mobile,
            matchReasons: reasons,
            matchScorePercentage: Math.min(100, score),
            detectedAt: new Date().toISOString(),
            status: reviewStatus,
          });
        }
      }
    }
    return list;
  }, [currentOrgMembers, orgId, reviewedDuplicates]);

  // Is member flagged as duplicate
  const isMemberDuplicateFlagged = (memberId: string) => {
    return duplicateCandidates.some(
      d => (d.primaryMemberId === memberId || d.duplicateMemberId === memberId) && d.status === 'pending_review'
    );
  };

  // Filtered & Searched Members
  const filteredMembers = useMemo(() => {
    return currentOrgMembers.filter((member) => {
      // Centralized Search (Code, Name, Mobile, Email, Occupation, Address, Classification)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const codeMatch = member.memberCode.toLowerCase().includes(q);
        const nameMatch = member.fullName.toLowerCase().includes(q);
        const mobileMatch = member.mobile.includes(q);
        const emailMatch = member.email ? member.email.toLowerCase().includes(q) : false;
        const occMatch = member.occupation ? member.occupation.toLowerCase().includes(q) : false;
        const addrMatch = (member.currentAddress || member.address || '').toLowerCase().includes(q);
        const clsMatch = getClassificationName(member.classificationId).toLowerCase().includes(q);

        if (!codeMatch && !nameMatch && !mobileMatch && !emailMatch && !occMatch && !addrMatch && !clsMatch) {
          return false;
        }
      }

      // Filter: Status
      if (filters.status && filters.status !== 'all') {
        if (member.status !== filters.status) return false;
      }

      // Filter: Classification
      if (filters.classificationId && filters.classificationId !== 'all') {
        if (member.classificationId !== filters.classificationId) return false;
      }

      // Filter: Gender
      if (filters.gender && filters.gender !== 'all') {
        if (member.gender !== filters.gender) return false;
      }

      // Filter: Occupation
      if (filters.occupation && filters.occupation !== 'all') {
        if (member.occupation !== filters.occupation) return false;
      }

      // Filter: Join Date Range
      if (filters.joinDateFrom) {
        const fromTime = new Date(filters.joinDateFrom).getTime();
        const memberJoinTime = new Date(member.joinedAt).getTime();
        if (memberJoinTime < fromTime) return false;
      }
      if (filters.joinDateTo) {
        const toTime = new Date(filters.joinDateTo).getTime() + (24 * 60 * 60 * 1000 - 1);
        const memberJoinTime = new Date(member.joinedAt).getTime();
        if (memberJoinTime > toTime) return false;
      }

      // Filter: Profile Completeness
      if (filters.completenessFilter && filters.completenessFilter !== 'all') {
        const comp = calculateCompleteness(member);
        if (filters.completenessFilter === 'complete' && comp.score < 100) return false;
        if (filters.completenessFilter === 'incomplete' && comp.score >= 100) return false;
      }

      // Filter: Photo Status
      if (filters.photoStatus && filters.photoStatus !== 'all') {
        const hasPhoto = Boolean(member.photoUrl && member.photoUrl.trim());
        if (filters.photoStatus === 'has_primary' && !hasPhoto) return false;
        if (filters.photoStatus === 'no_primary' && hasPhoto) return false;
      }

      // Filter: Document Status
      if (filters.documentVerificationStatus && filters.documentVerificationStatus !== 'all') {
        const docSummary = getMemberDocSummary(member.id);
        if (filters.documentVerificationStatus === 'verified' && docSummary.verified === 0) return false;
        if (filters.documentVerificationStatus === 'pending_verification' && docSummary.pending === 0) return false;
        if (filters.documentVerificationStatus === 'rejected' && docSummary.rejected === 0) return false;
        if (filters.documentVerificationStatus === 'archived' && docSummary.archived === 0) return false;
      }

      return true;
    });
  }, [currentOrgMembers, searchQuery, filters, currentOrgClassifications, orgId]);

  // Sorted Members
  const sortedMembers = useMemo(() => {
    const list = [...filteredMembers];
    list.sort((a, b) => {
      let valA: any = a.memberCode;
      let valB: any = b.memberCode;

      if (sortOptions.field === 'memberCode') {
        valA = a.memberCode;
        valB = b.memberCode;
      } else if (sortOptions.field === 'fullName') {
        valA = a.fullName;
        valB = b.fullName;
      } else if (sortOptions.field === 'joinedAt') {
        valA = new Date(a.joinedAt).getTime();
        valB = new Date(b.joinedAt).getTime();
      } else if (sortOptions.field === 'updatedAt') {
        valA = new Date(a.updatedAt).getTime();
        valB = new Date(b.updatedAt).getTime();
      } else if (sortOptions.field === 'classification') {
        valA = getClassificationName(a.classificationId);
        valB = getClassificationName(b.classificationId);
      } else if (sortOptions.field === 'status') {
        valA = a.status;
        valB = b.status;
      }

      if (valA < valB) return sortOptions.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortOptions.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredMembers, sortOptions, currentOrgClassifications]);

  // Paginated Members
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedMembers.slice(startIndex, startIndex + pageSize);
  }, [sortedMembers, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedMembers.length / pageSize) || 1;

  // Sorting Toggle Handler
  const handleSortToggle = (field: MemberSortField) => {
    if (sortOptions.field === field) {
      setSortOptions({
        field,
        direction: sortOptions.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortOptions({
        field,
        direction: 'asc',
      });
    }
  };

  // Selection Handlers
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedMembers.map(m => m.id);
    const allSelected = pageIds.every(id => selectedMemberIds.includes(id));
    if (allSelected) {
      setSelectedMemberIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedMemberIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleMemberSelect = (memberId: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  // Safe Bulk Status Change Execution
  const handleExecuteBulkStatusChange = () => {
    if (simulatedRole === 'viewer' || simulatedRole === 'unauthorized') {
      showToast('ত্রুটি: আপনার বাল্ক স্ট্যাটাস পরিবর্তনের অনুমতি নেই (403 Forbidden)');
      return;
    }
    if (!bulkReason.trim()) {
      showToast('দয়া করে স্ট্যাটাস পরিবর্তনের কারণ উল্লেখ করুন');
      return;
    }

    const count = selectedMemberIds.length;
    setMembersDb(prev => ({
      ...prev,
      [orgId]: (prev[orgId] || []).map(m => {
        if (selectedMemberIds.includes(m.id)) {
          return {
            ...m,
            status: bulkTargetStatus,
            updatedAt: new Date().toISOString(),
            updatedBy: 'usr-admin-01',
          };
        }
        return m;
      }),
    }));

    // Record Immutable Activity Log for each member
    selectedMemberIds.forEach(mId => {
      const newAct: MemberActivityEvent = {
        id: `act-bulk-${Date.now()}-${mId}`,
        organizationId: orgId,
        memberId: mId,
        eventType: 'STATUS_CHANGED',
        title: `বাল্ক স্ট্যাটাস পরিবর্তন: ${bulkTargetStatus}`,
        actorId: 'usr-admin-01',
        actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
        timestamp: new Date().toISOString(),
        newValue: bulkTargetStatus,
        reason: bulkReason,
        notes: `বাল্ক অপারেশনে ${count} জন সদস্যের সাথে একযোগে সম্পাদিত`,
      };
      setActivitiesDb(prev => ({
        ...prev,
        [mId]: [newAct, ...(prev[mId] || [])],
      }));
    });

    showToast(`সফলভাবে ${count} জন সদস্যের স্ট্যাটাস "${bulkTargetStatus}"-এ পরিবর্তন করা হয়েছে`);
    setSelectedMemberIds([]);
    setBulkActionModal({ isOpen: false, actionType: null });
    setBulkReason('');
  };

  // Safe Bulk Classification Change Execution
  const handleExecuteBulkClassificationChange = () => {
    if (simulatedRole === 'viewer' || simulatedRole === 'unauthorized') {
      showToast('ত্রুটি: আপনার বাল্ক শ্রেণি পরিবর্তনের অনুমতি নেই (403 Forbidden)');
      return;
    }
    if (!bulkTargetClassificationId) {
      showToast('দয়া করে একটি লক্ষ্য শ্রেণিবিন্যাস নির্বাচন করুন');
      return;
    }

    const count = selectedMemberIds.length;
    const targetClsName = getClassificationName(bulkTargetClassificationId);

    setMembersDb(prev => ({
      ...prev,
      [orgId]: (prev[orgId] || []).map(m => {
        if (selectedMemberIds.includes(m.id)) {
          return {
            ...m,
            classificationId: bulkTargetClassificationId,
            updatedAt: new Date().toISOString(),
            updatedBy: 'usr-admin-01',
          };
        }
        return m;
      }),
    }));

    // Activity Log
    selectedMemberIds.forEach(mId => {
      const newAct: MemberActivityEvent = {
        id: `act-bulk-cls-${Date.now()}-${mId}`,
        organizationId: orgId,
        memberId: mId,
        eventType: 'CLASSIFICATION_CHANGED',
        title: `বাল্ক শ্রেণিবিন্যাস পরিবর্তন: ${targetClsName}`,
        actorId: 'usr-admin-01',
        actorName: 'মাওলানা আব্দুল হক (অ্যাডমিন)',
        timestamp: new Date().toISOString(),
        newValue: targetClsName,
        reason: bulkReason || 'বাল্ক শ্রেণি হালনাগাদকরণ',
      };
      setActivitiesDb(prev => ({
        ...prev,
        [mId]: [newAct, ...(prev[mId] || [])],
      }));
    });

    showToast(`সফলভাবে ${count} জন সদস্যের শ্রেণিবিন্যাস "${targetClsName}"-এ আপডেট করা হয়েছে`);
    setSelectedMemberIds([]);
    setBulkActionModal({ isOpen: false, actionType: null });
    setBulkReason('');
  };

  // Export to CSV Generator (Privacy Secured: Sensitive NID Excluded)
  const handleExportCSV = () => {
    if (simulatedRole === 'unauthorized') {
      showToast('ত্রুটি: ডেটা এক্সপোর্ট করার অনুমতি নেই');
      return;
    }

    const membersToExport = selectedMemberIds.length > 0
      ? currentOrgMembers.filter(m => selectedMemberIds.includes(m.id))
      : sortedMembers;

    const headers = ['ক্রমিক', 'সদস্য কোড', 'পূর্ণ নাম', 'মোবাইল', 'ইমেইল', 'পেশা', 'শ্রেণি', 'স্ট্যাটাস', 'যোগদানের তারিখ', 'প্রোফাইল পূর্ণতা (%)'];
    
    const rows = membersToExport.map((m, idx) => {
      const comp = calculateCompleteness(m);
      return [
        `"${idx + 1}"`,
        `"${m.memberCode}"`,
        `"${m.fullName.replace(/"/g, '""')}"`,
        `"${m.mobile}"`,
        `"${m.email || ''}"`,
        `"${m.occupation || ''}"`,
        `"${getClassificationName(m.classificationId)}"`,
        `"${m.status}"`,
        `"${new Date(m.joinedAt).toLocaleDateString('bn-BD')}"`,
        `"${comp.score}%"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Member_Register_${orgId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`সফলভাবে ${membersToExport.length} জন সদস্যের রেজিস্টার CSV এক্সপোর্ট সম্পন্ন হয়েছে`);
  };

  // Status Badge Helper
  const renderStatusBadge = (status: MemberStatusType) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> সক্রিয়
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3" /> নিষ্ক্রিয়
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3" /> স্থগিত
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" /> আর্কাইভ
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                Prompt 3.6 — Final Integration
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {currentOrg.name} ({orgId})
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-700" />
              সদস্য রেজিস্টার, অনুসন্ধান ও অ্যাক্টিভিটি হিস্ট্রি
            </h1>
            <p className="text-sm text-slate-600">
              কেন্দ্রীয় অনুসন্ধান, বহুমাত্রিক ফিল্টারিং, প্রোফাইল ৩৬০° সামারি, ডুপ্লিকেট চেকার ও নিরাপদ বাল্ক অপারেশন
            </p>
          </div>

          {/* Role Switcher & Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <span className="text-slate-500 font-medium">রোল:</span>
              <button
                onClick={() => setSimulatedRole('admin')}
                className={`px-2 py-1 rounded-lg transition font-medium ${
                  simulatedRole === 'admin' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                অ্যাডমিন
              </button>
              <button
                onClick={() => setSimulatedRole('manager')}
                className={`px-2 py-1 rounded-lg transition font-medium ${
                  simulatedRole === 'manager' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                ম্যানেজার
              </button>
              <button
                onClick={() => setSimulatedRole('viewer')}
                className={`px-2 py-1 rounded-lg transition font-medium ${
                  simulatedRole === 'viewer' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                ভিউয়ার
              </button>
            </div>

            <button
              onClick={() => setIsDuplicateModalOpen(true)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                duplicateCandidates.some(d => d.status === 'pending_review')
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              ডুপ্লিকেট চেকার
              {duplicateCandidates.some(d => d.status === 'pending_review') && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              CSV এক্সপোর্ট
            </button>

            <button
              onClick={() => setIsPrintRegisterModalOpen(true)}
              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              A4 প্রিন্ট ভিউ
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">মোট সদস্য</p>
            <p className="text-xl font-bold text-slate-900 font-numeric">{currentOrgMembers.length}</p>
          </div>
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
            <p className="text-xs text-emerald-700 font-medium">সক্রিয় সদস্য</p>
            <p className="text-xl font-bold text-emerald-800 font-numeric">
              {currentOrgMembers.filter(m => m.status === 'active').length}
            </p>
          </div>
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">স্থগিত / নিষ্ক্রিয়</p>
            <p className="text-xl font-bold text-amber-800 font-numeric">
              {currentOrgMembers.filter(m => m.status === 'suspended' || m.status === 'inactive').length}
            </p>
          </div>
          <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
            <p className="text-xs text-rose-700 font-medium">আর্কাইভ সদস্য</p>
            <p className="text-xl font-bold text-rose-800 font-numeric">
              {currentOrgMembers.filter(m => m.status === 'archived').length}
            </p>
          </div>
          <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-100">
            <p className="text-xs text-sky-700 font-medium">অসম্পূর্ণ প্রোফাইল</p>
            <p className="text-xl font-bold text-sky-800 font-numeric">
              {currentOrgMembers.filter(m => calculateCompleteness(m).score < 100).length}
            </p>
          </div>
          <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
            <p className="text-xs text-purple-700 font-medium">সম্ভাব্য ডুপ্লিকেট</p>
            <p className="text-xl font-bold text-purple-800 font-numeric">
              {duplicateCandidates.filter(d => d.status === 'pending_review').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search, Filter Bar & Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Centralized Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="সদস্য কোড, নাম, মোবাইল, ইমেইল, পেশা বা ঠিকানা দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter & Sorters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition ${
                isFilterDrawerOpen ||
                filters.status !== 'all' ||
                filters.classificationId !== 'all' ||
                filters.gender !== 'all' ||
                filters.occupation !== 'all' ||
                filters.completenessFilter !== 'all' ||
                filters.photoStatus !== 'all' ||
                filters.documentVerificationStatus !== 'all'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>ফিল্টার</span>
              {(filters.status !== 'all' ||
                filters.classificationId !== 'all' ||
                filters.gender !== 'all' ||
                filters.occupation !== 'all' ||
                filters.completenessFilter !== 'all' ||
                filters.photoStatus !== 'all' ||
                filters.documentVerificationStatus !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
              )}
            </button>

            {/* Quick Sort Field */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs">
              <span className="text-slate-500 font-medium">সর্ট:</span>
              <select
                value={sortOptions.field}
                onChange={(e) => handleSortToggle(e.target.value as MemberSortField)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="memberCode">সদস্য কোড</option>
                <option value="fullName">নাম</option>
                <option value="joinedAt">যোগদানের তারিখ</option>
                <option value="classification">শ্রেণি</option>
                <option value="status">স্ট্যাটাস</option>
              </select>
              <button
                onClick={() =>
                  setSortOptions(prev => ({
                    ...prev,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                  }))
                }
                className="p-1 text-slate-500 hover:text-slate-800"
                title={sortOptions.direction === 'asc' ? 'ছোট থেকে বড়' : 'বড় থেকে ছোট'}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filter Section */}
        {isFilterDrawerOpen && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-fade-in bg-slate-50/50 p-3 rounded-xl">
            <div>
              <label className="block text-slate-600 font-medium mb-1">সদস্য স্ট্যাটাস</label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value as any });
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="active">সক্রিয় (Active)</option>
                <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                <option value="suspended">স্থগিত (Suspended)</option>
                <option value="archived">আর্কাইভ (Archived)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">সদস্য শ্রেণিবিন্যাস</label>
              <select
                value={filters.classificationId}
                onChange={(e) => {
                  setFilters({ ...filters, classificationId: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">সকল শ্রেণি</option>
                {currentOrgClassifications.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">লিঙ্গ (Gender)</label>
              <select
                value={filters.gender}
                onChange={(e) => {
                  setFilters({ ...filters, gender: e.target.value as any });
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">সকল লিঙ্গ</option>
                <option value="male">পুরুষ</option>
                <option value="female">মহিলা</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">পেশা</label>
              <select
                value={filters.occupation}
                onChange={(e) => {
                  setFilters({ ...filters, occupation: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">সকল পেশা</option>
                {uniqueOccupations.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">প্রোফাইল পূর্ণতা</label>
              <select
                value={filters.completenessFilter}
                onChange={(e) => {
                  setFilters({ ...filters, completenessFilter: e.target.value as any });
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">সকল প্রোফাইল</option>
                <option value="complete">১০০% সম্পূর্ণ</option>
                <option value="incomplete">অসম্পূর্ণ (&lt;১০০%)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">ডকুমেন্ট ভেরিফিকেশন</label>
              <select
                value={filters.documentVerificationStatus}
                onChange={(e) => {
                  setFilters({ ...filters, documentVerificationStatus: e.target.value as any });
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">সকল ডকুমেন্ট স্ট্যাটাস</option>
                <option value="verified">যাচাইকৃত নথি আছে</option>
                <option value="pending_verification">যাচাই অপেক্ষমাণ আছে</option>
                <option value="rejected">প্রত্যাখ্যাত নথি আছে</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">প্রোফাইল ছবি</label>
              <select
                value={filters.photoStatus}
                onChange={(e) => {
                  setFilters({ ...filters, photoStatus: e.target.value as any });
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">সকল ফটো স্ট্যাটাস</option>
                <option value="has_primary">প্রাইমারি ছবি আছে</option>
                <option value="no_primary">ছবি নেই</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({
                    status: 'all',
                    classificationId: 'all',
                    gender: 'all',
                    occupation: 'all',
                    joinDateFrom: '',
                    joinDateTo: '',
                    completenessFilter: 'all',
                    documentVerificationStatus: 'all',
                    photoStatus: 'all',
                  });
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw className="w-3 h-3" />
                ফিল্টার রিসেট
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Safe Bulk Operations Action Bar (When rows selected) */}
      {selectedMemberIds.length > 0 && (
        <div className="bg-emerald-900 text-white rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center font-bold text-sm font-numeric">
              {selectedMemberIds.length}
            </span>
            <div>
              <p className="text-sm font-bold">নির্বাচিত সদস্য তালিকা</p>
              <p className="text-xs text-emerald-200">
                একযোগে নির্বাচিত সদস্যদের উপর নিরাপদ বাল্ক অ্যাকশন সম্পাদন করুন
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setBulkActionModal({ isOpen: true, actionType: 'status_change' });
                setBulkTargetStatus('active');
                setBulkReason('');
              }}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              বাল্ক স্ট্যাটাস পরিবর্তন
            </button>

            <button
              onClick={() => {
                setBulkActionModal({ isOpen: true, actionType: 'classification_change' });
                setBulkTargetClassificationId(currentOrgClassifications[0]?.id || '');
                setBulkReason('');
              }}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              বাল্ক শ্রেণি পরিবর্তন
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              নির্বাচিত CSV
            </button>

            <button
              onClick={() => setSelectedMemberIds([])}
              className="px-3 py-1.5 bg-emerald-950 hover:bg-black text-emerald-300 rounded-xl text-xs font-medium transition"
            >
              বাতিল করুন
            </button>
          </div>
        </div>
      )}

      {/* Member Register Table & List View */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {paginatedMembers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">কোনো সদস্য পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              আপনার বর্তমান অনুসন্ধান বা ফিল্টার শর্ত অনুযায়ী কোনো সদস্য খুঁজে পাওয়া যায়নি। ফিল্টার রিসেট করে পুনরায় চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  status: 'all',
                  classificationId: 'all',
                  gender: 'all',
                  occupation: 'all',
                  joinDateFrom: '',
                  joinDateTo: '',
                  completenessFilter: 'all',
                  documentVerificationStatus: 'all',
                  photoStatus: 'all',
                });
              }}
              className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              সকল ফিল্টার রিসেট
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-600 font-semibold">
                <tr>
                  <th className="p-4 w-10">
                    <button
                      onClick={handleSelectAllOnPage}
                      className="text-slate-500 hover:text-emerald-700"
                    >
                      {paginatedMembers.every(m => selectedMemberIds.includes(m.id)) ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4 cursor-pointer hover:text-slate-900" onClick={() => handleSortToggle('memberCode')}>
                    <div className="flex items-center gap-1">
                      <span>সদস্য পরিচিতি</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-4">মোবাইল ও পেশা</th>
                  <th className="p-4 cursor-pointer hover:text-slate-900" onClick={() => handleSortToggle('classification')}>
                    <div className="flex items-center gap-1">
                      <span>শ্রেণি</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer hover:text-slate-900" onClick={() => handleSortToggle('status')}>
                    <div className="flex items-center gap-1">
                      <span>স্ট্যাটাস</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer hover:text-slate-900" onClick={() => handleSortToggle('joinedAt')}>
                    <div className="flex items-center gap-1">
                      <span>যোগদান</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-4 text-center">পূর্ণতা</th>
                  <th className="p-4 text-center">নথিপত্র</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedMembers.map((member) => {
                  const isSelected = selectedMemberIds.includes(member.id);
                  const comp = calculateCompleteness(member);
                  const docSummary = getMemberDocSummary(member.id);
                  const isDuplicate = isMemberDuplicateFlagged(member.id);

                  return (
                    <tr
                      key={member.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleMemberSelect(member.id)}
                          className="text-slate-500 hover:text-emerald-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Member Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {member.photoUrl ? (
                              <img
                                src={member.photoUrl}
                                alt={member.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Users className="w-5 h-5 text-slate-400" />
                            )}
                            {isDuplicate && (
                              <span
                                title="সম্ভাব্য ডুপ্লিকেট ফ্ল্যাগড"
                                className="absolute top-0 right-0 w-3 h-3 bg-amber-500 border-2 border-white rounded-full"
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-sm">{member.fullName}</span>
                              {isDuplicate && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                  ডুপ্লিকেট সন্দেহ
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-slate-500 text-xs font-semibold">
                              {member.memberCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Mobile & Occupation */}
                      <td className="p-4">
                        <p className="font-medium text-slate-800 font-numeric">{member.mobile}</p>
                        <p className="text-slate-500">{member.occupation || 'তথ্য নেই'}</p>
                      </td>

                      {/* Classification */}
                      <td className="p-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800">
                          {getClassificationName(member.classificationId)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {renderStatusBadge(member.status)}
                      </td>

                      {/* Join Date */}
                      <td className="p-4 text-slate-600 font-numeric">
                        {new Date(member.joinedAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Completeness */}
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`font-bold font-numeric ${comp.score === 100 ? 'text-emerald-700' : 'text-slate-700'}`}>
                            {comp.score}%
                          </span>
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-0.5">
                            <div
                              className={`h-full ${comp.score === 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                              style={{ width: `${comp.score}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Document Summary */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1 text-[11px] font-medium">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-numeric" title="যাচাইকৃত">
                            ✓ {docSummary.verified}
                          </span>
                          {docSummary.pending > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-numeric" title="অপেক্ষমাণ">
                              ⏳ {docSummary.pending}
                            </span>
                          )}
                          {docSummary.rejected > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 font-numeric" title="প্রত্যাখ্যাত">
                              ✗ {docSummary.rejected}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelected360Member(member)}
                            className="p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 rounded-lg transition"
                            title="৩৬০° প্রোফাইল সারসংক্ষেপ"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedTimelineMember(member)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition"
                            title="অ্যাক্টিভিটি হিস্ট্রি টাইমলাইন"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          {onSelectMemberForProfile && (
                            <button
                              onClick={() => onSelectMemberForProfile(member.id)}
                              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-medium transition"
                            >
                              বিস্তারিত
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>প্রতি পৃষ্ঠায়:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value={5}>৫</option>
              <option value={10}>১০</option>
              <option value={20}>২০</option>
              <option value={50}>৫০</option>
            </select>
            <span className="text-slate-400">|</span>
            <span className="font-numeric">
              মোট {sortedMembers.length} জন সদস্যের মধ্যে {paginatedMembers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} থেকে {Math.min(currentPage * pageSize, sortedMembers.length)} দেখানো হচ্ছে
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-slate-800 font-numeric">
              পৃষ্ঠা {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Member 360° Summary View (Prompt 3.6 Requirement)                 */}
      {/* ========================================================================= */}
      {selected360Member && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700/50 border border-emerald-500/30 overflow-hidden flex items-center justify-center">
                  {selected360Member.photoUrl ? (
                    <img src={selected360Member.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">{selected360Member.fullName}</h2>
                    {renderStatusBadge(selected360Member.status)}
                  </div>
                  <p className="text-xs text-slate-300 font-mono">
                    {selected360Member.memberCode} • {getClassificationName(selected360Member.classificationId)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelected360Member(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Financial Boundary Strict Notice */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Phase 3 Member Domain Isolation:</strong> এটি একটি বিশুদ্ধ প্রোফাইল পরিচিতি সারাংশ। এতে কোনো আর্থিক ট্রানজ্যাকশন বা তহবিল তথ্য সংযুক্ত নয় (Rule 21 & 22)।
                  </span>
                </div>
                <span className="font-bold text-[10px] bg-emerald-200/60 px-2 py-1 rounded">
                  Side Effect: NONE
                </span>
              </div>

              {/* 360 Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ১. পরিচিতি */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <Users className="w-4 h-4 text-emerald-700" />
                    ১. পরিচিতি
                  </h4>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span className="text-slate-500">লিঙ্গ:</span>
                      <span className="font-semibold text-slate-800">
                        {selected360Member.gender === 'male' ? 'পুরুষ' : selected360Member.gender === 'female' ? 'মহিলা' : 'অন্যান্য'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span className="text-slate-500">জন্ম তারিখ:</span>
                      <span className="font-semibold text-slate-800 font-numeric">
                        {selected360Member.dateOfBirth ? new Date(selected360Member.dateOfBirth).toLocaleDateString('bn-BD') : 'তথ্য নেই'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span className="text-slate-500">পেশা:</span>
                      <span className="font-semibold text-slate-800">{selected360Member.occupation || 'তথ্য নেই'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">জাতীয় পরিচয়পত্র (মাস্কড):</span>
                      <span className="font-mono font-semibold text-slate-800">{maskNid(selected360Member.nid)}</span>
                    </div>
                  </div>
                </div>

                {/* ২. যোগাযোগ ও ঠিকানা */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ২. যোগাযোগ ও ঠিকানা
                  </h4>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span className="text-slate-500">মোবাইল:</span>
                      <span className="font-semibold text-slate-800 font-numeric">{selected360Member.mobile}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span className="text-slate-500">ইমেইল:</span>
                      <span className="font-semibold text-slate-800">{selected360Member.email || 'তথ্য নেই'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span className="text-slate-500">বর্তমান ঠিকানা:</span>
                      <span className="font-semibold text-slate-800 text-right">{selected360Member.currentAddress || selected360Member.address || 'তথ্য নেই'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">স্থায়ী ঠিকানা:</span>
                      <span className="font-semibold text-slate-800 text-right">{selected360Member.permanentAddress || 'বর্তমান ঠিকানার অনুরূপ'}</span>
                    </div>
                  </div>
                </div>

                {/* ৩. পরিবার ও সদস্যপদ */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <HeartHandshake className="w-4 h-4 text-emerald-700" />
                    ৩. পরিবার ও সদস্যপদ
                  </h4>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span className="text-slate-500">পিতা/স্বামীর নাম:</span>
                      <span className="font-semibold text-slate-800">{selected360Member.fatherOrSpouseName || 'তথ্য নেই'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span className="text-slate-500">মাতার নাম:</span>
                      <span className="font-semibold text-slate-800">{selected360Member.motherName || 'তথ্য নেই'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span className="text-slate-500">যোগদানের তারিখ:</span>
                      <span className="font-semibold text-slate-800 font-numeric">
                        {new Date(selected360Member.joinedAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">শ্রেণিবিন্যাস:</span>
                      <span className="font-semibold text-emerald-800">{getClassificationName(selected360Member.classificationId)}</span>
                    </div>
                  </div>
                </div>

                {/* ৪. ডকুমেন্টস ও ফটো স্ট্যাটাস */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    ৪. ডকুমেন্টস ও ফটো স্ট্যাটাস
                  </h4>
                  {(() => {
                    const docSum = getMemberDocSummary(selected360Member.id);
                    const comp = calculateCompleteness(selected360Member);
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                          <span className="text-slate-500">মোট সংযুক্তি নথি:</span>
                          <span className="font-bold text-slate-800 font-numeric">{docSum.total} টি</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                          <span className="text-slate-500">যাচাইকৃত নথি:</span>
                          <span className="font-bold text-emerald-700 font-numeric">{docSum.verified} টি</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                          <span className="text-slate-500">প্রাইমারি ছবি:</span>
                          <span className="font-semibold text-slate-800">
                            {selected360Member.photoUrl ? 'সংরক্ষিত আছে' : 'ছবি নেই'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">প্রোফাইল পূর্ণতা:</span>
                          <span className="font-bold text-emerald-800 font-numeric">{comp.score}% সম্পূর্ণ</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Completeness Breakdown */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">প্রোফাইল পূর্ণতার উপাদানসমূহ</span>
                  <span className="font-bold font-numeric text-emerald-800">
                    {calculateCompleteness(selected360Member).score} / ১০০
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <p className="text-[10px] text-slate-500">পরিচিতি</p>
                    <p className="font-bold text-emerald-700">✓ ২৫/২৫</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <p className="text-[10px] text-slate-500">যোগাযোগ</p>
                    <p className="font-bold text-emerald-700">✓ ২০/২০</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <p className="text-[10px] text-slate-500">ঠিকানা</p>
                    <p className="font-bold text-emerald-700">✓ ২০/২০</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <p className="text-[10px] text-slate-500">পরিবার</p>
                    <p className="font-bold text-emerald-700">✓ ১৫/১৫</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <p className="text-[10px] text-slate-500">এনআইডি ও ফটো</p>
                    <p className="font-bold text-emerald-700">✓ ২০/২০</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelected360Member(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Member Activity Timeline Modal (Prompt 3.6 Requirement)           */}
      {/* ========================================================================= */}
      {selectedTimelineMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-up">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center">
                  <History className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">অ্যাক্টিভিটি টাইমলাইন ও হিস্ট্রি</h2>
                  <p className="text-xs text-slate-300 font-mono">
                    {selectedTimelineMember.fullName} ({selectedTimelineMember.memberCode})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTimelineMember(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {(() => {
                const activities = activitiesDb[selectedTimelineMember.id] || [
                  {
                    id: 'act-default',
                    organizationId: orgId,
                    memberId: selectedTimelineMember.id,
                    eventType: 'MEMBER_CREATED' as const,
                    title: 'সদস্য প্রোফাইল রেকর্ড তৈরি',
                    actorId: 'usr-admin-01',
                    actorName: 'সিস্টেম অ্যাডমিন',
                    timestamp: selectedTimelineMember.createdAt || selectedTimelineMember.joinedAt,
                    notes: 'প্রাথমিক ডাটাবেজ ইনজেকশন',
                  }
                ];

                return (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {activities.map((act) => (
                      <div key={act.id} className="relative group">
                        <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-700 border-2 border-white shadow-sm" />
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">{act.title}</span>
                            <span className="text-[10px] text-slate-400 font-numeric">
                              {new Date(act.timestamp).toLocaleString('bn-BD', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <ShieldCheck className="w-3 h-3 text-emerald-700" />
                            <span>সম্পাদনকারী: {act.actorName}</span>
                          </div>
                          {act.newValue && (
                            <p className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                              মান / বিবরণ: <strong>{act.newValue}</strong>
                            </p>
                          )}
                          {act.reason && (
                            <p className="text-xs text-amber-900 bg-amber-50/60 p-2 rounded-lg border border-amber-200">
                              কারণ: {act.reason}
                            </p>
                          )}
                          {act.notes && (
                            <p className="text-xs text-slate-500 italic">নোট: {act.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTimelineMember(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Data Quality & Duplicate Candidates Review (Prompt 3.6)          */}
      {/* ========================================================================= */}
      {isDuplicateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-up">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">ডাটা মান যাচাই ও ডুপ্লিকেট সনাক্তকরণ</h2>
                  <p className="text-xs text-slate-300">
                    মোবাইল নম্বর, এনআইডি ও নামের সামঞ্জস্যতার ভিত্তিতে স্বয়ংক্রিয় সন্দেহজনক রেকর্ড পর্যালোচনা
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDuplicateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  কঠোর ডাটা ইন্টিগ্রিটি পলিসি (No Automatic Merge):
                </p>
                <p className="text-amber-800 leading-relaxed">
                  সিস্টেমে কোনো রেকর্ড স্বয়ংক্রিয়ভাবে মার্জ বা ডিলিট করা হয় না। ডুপ্লিকেট চিহ্নিত হলে পর্যালোচনাকারী কেবল স্ট্যাটাস মার্ক করতে পারেন।
                </p>
              </div>

              {duplicateCandidates.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-800 text-sm">কোনো ডুপ্লিকেট রেকর্ড পাওয়া যায়নি</p>
                  <p className="text-xs text-slate-500">
                    সকল সদস্যের মোবাইল নম্বর, জাতীয় পরিচয়পত্র ও পরিচিতি তথ্যের মান সম্পূর্ণ সুরক্ষিত।
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {duplicateCandidates.map((dup) => (
                    <div
                      key={dup.id}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 font-numeric">
                          মিল শতকরা: {dup.matchScorePercentage}%
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          dup.status === 'reviewed_distinct'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {dup.status === 'reviewed_distinct' ? 'ভিন্ন ব্যক্তি নিশ্চিত' : 'পর্যালোচনা অপেক্ষমাণ'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800">{dup.primaryMemberName}</p>
                          <p className="text-slate-500 font-mono">কোড: {dup.primaryMemberCode}</p>
                          <p className="text-slate-600 font-numeric">মোবাইল: {dup.primaryMobile}</p>
                        </div>
                        <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:pl-3 border-slate-100">
                          <p className="font-bold text-slate-800">{dup.duplicateMemberName}</p>
                          <p className="text-slate-500 font-mono">কোড: {dup.duplicateMemberCode}</p>
                          <p className="text-slate-600 font-numeric">মোবাইল: {dup.duplicateMobile}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="text-slate-500">
                          মিলের কারণ: <strong>{dup.matchReasons.join(', ')}</strong>
                        </div>
                        {dup.status === 'pending_review' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setReviewedDuplicates(prev => ({ ...prev, [dup.id]: 'distinct' }));
                                showToast('রেকর্ডটি ভিন্ন ব্যক্তি হিসেবে নিশ্চিত করা হয়েছে');
                              }}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium"
                            >
                              ভিন্ন ব্যক্তি হিসেবে চিহ্নিত করুন
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsDuplicateModalOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: Safe Bulk Action Confirmation Modal                              */}
      {/* ========================================================================= */}
      {bulkActionModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {bulkActionModal.actionType === 'status_change'
                    ? 'বাল্ক স্ট্যাটাস পরিবর্তন নিশ্চিতকরণ'
                    : 'বাল্ক শ্রেণিবিন্যাস পরিবর্তন নিশ্চিতকরণ'}
                </h3>
                <p className="text-xs text-slate-500 font-numeric">
                  নির্বাচিত সদস্য সংখ্যা: {selectedMemberIds.length} জন
                </p>
              </div>
            </div>

            {bulkActionModal.actionType === 'status_change' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">নতুন স্ট্যাটাস নির্বাচন করুন</label>
                  <select
                    value={bulkTargetStatus}
                    onChange={(e) => setBulkTargetStatus(e.target.value as MemberStatusType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="active">সক্রিয় (Active)</option>
                    <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                    <option value="suspended">স্থগিত (Suspended)</option>
                    <option value="archived">আর্কাইভ (Archived)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">পরিবর্তনের যৌক্তিক কারণ (বাধ্যতামূলক)</label>
                  <textarea
                    rows={2}
                    placeholder="কী কারণে স্ট্যাটাস পরিবর্তন করা হচ্ছে লিখুন..."
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">নতুন শ্রেণি নির্বাচন করুন</label>
                  <select
                    value={bulkTargetClassificationId}
                    onChange={(e) => setBulkTargetClassificationId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {currentOrgClassifications.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">পরিবর্তনের যৌক্তিক কারণ</label>
                  <textarea
                    rows={2}
                    placeholder="শ্রেণি পরিবর্তনের নোট বা কারণ..."
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setBulkActionModal({ isOpen: false, actionType: null })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                onClick={
                  bulkActionModal.actionType === 'status_change'
                    ? handleExecuteBulkStatusChange
                    : handleExecuteBulkClassificationChange
                }
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: A4 Member Register Print Layout View (Prompt 3.6 Requirement)    */}
      {/* ========================================================================= */}
      {isPrintRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-up">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10 print:hidden">
              <div className="flex items-center gap-3">
                <Printer className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-base font-bold">সদস্য রেজিস্টার প্রিন্ট ভিউ (A4 Layout)</h2>
                  <p className="text-xs text-slate-300">অফিসিয়াল নথিপত্র সংরক্ষণের জন্য প্রিন্ট-রেডি ভিউ</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> প্রিন্ট কমান্ড
                </button>
                <button
                  onClick={() => setIsPrintRegisterModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* A4 Printable Document Area */}
            <div className="p-8 space-y-6 text-slate-900 font-sans">
              <div className="text-center space-y-1 pb-4 border-b-2 border-slate-800">
                <h1 className="text-2xl font-bold text-slate-900">{currentOrg.name}</h1>
                <p className="text-xs text-slate-600">{currentOrg.address || 'খুরুশকুল, কক্সবাজার সদর'}</p>
                <h2 className="text-base font-bold text-emerald-900 mt-2">সদস্য রেজিস্টার বই ও পরিচিতি বিবরণী</h2>
                <p className="text-[11px] text-slate-500 font-numeric">
                  তারিখ: {new Date().toLocaleDateString('bn-BD', { dateStyle: 'full' })} | মোট সদস্য: {sortedMembers.length} জন
                </p>
              </div>

              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                    <th className="p-2 border border-slate-300 text-center w-10">ক্রমিক</th>
                    <th className="p-2 border border-slate-300">সদস্য কোড</th>
                    <th className="p-2 border border-slate-300">সদস্যের নাম</th>
                    <th className="p-2 border border-slate-300">মোবাইল নম্বর</th>
                    <th className="p-2 border border-slate-300">পেশা</th>
                    <th className="p-2 border border-slate-300">শ্রেণিবিন্যাস</th>
                    <th className="p-2 border border-slate-300">স্ট্যাটাস</th>
                    <th className="p-2 border border-slate-300">যোগদান</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMembers.map((m, idx) => (
                    <tr key={m.id} className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 text-center font-numeric">{idx + 1}</td>
                      <td className="p-2 border border-slate-300 font-mono font-semibold">{m.memberCode}</td>
                      <td className="p-2 border border-slate-300 font-bold">{m.fullName}</td>
                      <td className="p-2 border border-slate-300 font-numeric">{m.mobile}</td>
                      <td className="p-2 border border-slate-300">{m.occupation || '-'}</td>
                      <td className="p-2 border border-slate-300">{getClassificationName(m.classificationId)}</td>
                      <td className="p-2 border border-slate-300">{m.status}</td>
                      <td className="p-2 border border-slate-300 font-numeric">
                        {new Date(m.joinedAt).toLocaleDateString('bn-BD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-12 grid grid-cols-3 gap-6 text-center text-xs">
                <div className="border-t border-slate-400 pt-2 font-semibold">প্রস্তুতকারী কর্মকর্তা</div>
                <div className="border-t border-slate-400 pt-2 font-semibold">যাচাইকারী কর্মকর্তা</div>
                <div className="border-t border-slate-400 pt-2 font-semibold">সভাপতি / সাধারণ সম্পাদক</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
