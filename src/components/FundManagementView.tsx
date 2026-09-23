import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Printer,
  Shield,
  ShieldAlert,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Edit2,
  Power,
  Archive,
  History,
  Info,
  ChevronRight,
  Layers,
  ArrowRight,
  Eye,
  FileSpreadsheet,
  X,
  HelpCircle,
  Hash,
  Scale,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Clock,
  UserCheck,
  FolderTree
} from 'lucide-react';
import {
  Fund,
  FundType,
  FundStatus,
  FundAuditLog,
  FundFilterCriteria,
  OrganizationContext
} from '../types';

interface FundManagementViewProps {
  currentOrg: OrganizationContext;
  onOrgChange?: (orgId: string) => void;
}

// Initial Generic Seed Data (Completely Free from Prohibited Religious Hardcoding)
const INITIAL_FUNDS: Record<string, Fund[]> = {
  'demo-org-khurushkul': [
    {
      id: 'fnd-khu-01',
      organizationId: 'demo-org-khurushkul',
      fundCode: 'FND-001',
      name: 'সাধারণ তহবিল',
      description: 'সমিতির সাধারণ কার্যক্রম ও দৈনন্দিন পরিচালনা সংক্রান্ত তহবিল',
      fundType: 'general',
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-01-10T09:00:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'fnd-khu-02',
      organizationId: 'demo-org-khurushkul',
      fundCode: 'FND-002',
      name: 'প্রশাসনিক ও ব্যবস্থাপনা তহবিল',
      description: 'দাপ্তরিক ও প্রশাসনিক ব্যয় নির্বাহের জন্য নির্দিষ্ট তহবিল',
      fundType: 'administrative',
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-01-10T09:00:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'fnd-khu-03',
      organizationId: 'demo-org-khurushkul',
      fundCode: 'FND-003',
      name: 'সদস্য শেয়ার মূলধন তহবিল',
      description: 'সদস্যদের স্থায়ী শেয়ার ও প্রারম্ভিক ইকুইটি তহবিল',
      fundType: 'share',
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 3,
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-01-10T09:00:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'fnd-khu-04',
      organizationId: 'demo-org-khurushkul',
      fundCode: 'FND-004',
      name: 'মৎস্য প্রকল্প তহবিল',
      description: 'উপকূলীয় সামুদ্রিক মৎস্য ও বাণিজ্য প্রকল্প তহবিল',
      fundType: 'project',
      isSystemDefined: false,
      isActive: true,
      status: 'active',
      sortOrder: 4,
      createdAt: '2026-01-15T11:00:00.000Z',
      updatedAt: '2026-01-15T11:00:00.000Z',
      createdBy: 'Admin Officer'
    },
    {
      id: 'fnd-khu-05',
      organizationId: 'demo-org-khurushkul',
      fundCode: 'FND-005',
      name: 'লবণ শিল্প উন্নয়ন তহবিল',
      description: 'কক্সবাজার উপকূলীয় লবণ মাঠ উন্নয়ন ও বিপণন প্রকল্প',
      fundType: 'custom',
      isSystemDefined: false,
      isActive: true,
      status: 'active',
      sortOrder: 5,
      createdAt: '2026-01-20T14:30:00.000Z',
      updatedAt: '2026-01-20T14:30:00.000Z',
      createdBy: 'Admin Officer'
    }
  ],
  'org-alfalah-01': [
    {
      id: 'fnd-alf-01',
      organizationId: 'org-alfalah-01',
      fundCode: 'FND-001',
      name: 'সাধারণ তহবিল',
      description: 'আল-ফালাহ সমিতির কেন্দ্রীয় সাধারণ তহবিল',
      fundType: 'general',
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2026-01-12T08:00:00.000Z',
      updatedAt: '2026-01-12T08:00:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'fnd-alf-02',
      organizationId: 'org-alfalah-01',
      fundCode: 'FND-002',
      name: 'সদস্য শেয়ার তহবিল',
      description: 'সদস্যদের প্রদেয় শেয়ার মূলধন ও ইকুইটি',
      fundType: 'share',
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2026-01-12T08:30:00.000Z',
      updatedAt: '2026-01-12T08:30:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'fnd-alf-03',
      organizationId: 'org-alfalah-01',
      fundCode: 'FND-003',
      name: 'কৃষি ও খাদ্য বিপণন প্রকল্প তহবিল',
      description: 'অর্গানিক এগ্রো ও পণ্য সরবরাহ বাণিজ্যিক প্রকল্প',
      fundType: 'project',
      isSystemDefined: false,
      isActive: true,
      status: 'active',
      sortOrder: 3,
      createdAt: '2026-01-18T10:00:00.000Z',
      updatedAt: '2026-01-18T10:00:00.000Z',
      createdBy: 'Manager Alfalah'
    }
  ]
};

// Initial Seed Audit Trail
const INITIAL_AUDITS: Record<string, FundAuditLog[]> = {
  'demo-org-khurushkul': [
    {
      id: 'fnd-aud-01',
      organizationId: 'demo-org-khurushkul',
      fundId: 'fnd-khu-01',
      fundCode: 'FND-001',
      fundName: 'সাধারণ তহবিল',
      action: 'FUND_CREATED',
      actorUserId: 'usr-sys-01',
      actorName: 'System Seed Initializer',
      timestamp: '2026-01-10T09:00:00.000Z',
      reason: 'সংগঠনের প্রাথমিক সাধারণ তহবিল হিসেবে স্বয়ংক্রিয় সৃষ্টি',
      changesSummary: 'সিস্টেম-ডিফাইন্ড মূল সাধারণ তহবিল যুক্ত করা হয়েছে।'
    },
    {
      id: 'fnd-aud-02',
      organizationId: 'demo-org-khurushkul',
      fundId: 'fnd-khu-04',
      fundCode: 'FND-004',
      fundName: 'মৎস্য প্রকল্প তহবিল',
      action: 'FUND_CREATED',
      actorUserId: 'usr-adm-01',
      actorName: 'Admin Officer',
      timestamp: '2026-01-15T11:00:00.000Z',
      reason: 'সমিতির নতুন বাণিজ্যিক মৎস্য প্রকল্পের অর্থ ব্যবস্থাপনার জন্য অন্তর্ভুক্তি',
      changesSummary: 'প্রকল্প তহবিল তৈরি করা হয়েছে।'
    }
  ]
};

// Text normalization utility for Unicode NFC and duplicate prevention
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFC')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

// Bengali Fund Type Labels
export const FUND_TYPE_LABELS: Record<FundType, { label: string; desc: string; badgeClass: string; icon: string }> = {
  general: {
    label: 'সাধারণ তহবিল (General)',
    desc: 'দৈনন্দিন দাপ্তরিক পরিচালনা ও সাধারণ বহুমুখী উদ্দেশ্য',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: '🌐'
  },
  administrative: {
    label: 'প্রশাসনিক তহবিল (Administrative)',
    desc: 'অফিস ব্যবস্থাপনা, বেতন ও প্রাতিষ্ঠানিক প্রশাসনিক ব্যয়',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: '🏢'
  },
  share: {
    label: 'শেয়ার মূলধন তহবিল (Share Capital)',
    desc: 'সদস্যদের প্রদেয় শেয়ার ও প্রাতিষ্ঠানিক স্থায়ী মূলধন',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    icon: '📈'
  },
  project: {
    label: 'প্রকল্প তহবিল (Project)',
    desc: 'নির্দিষ্ট বাণিজ্যিক, উৎপাদনমুখী বা উন্নয়নমূলক প্রকল্প',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: '🚀'
  },
  custom: {
    label: 'কাস্টম তহবিল (Custom)',
    desc: 'সমিতির অভ্যন্তরীণ বিশেষ চাহিদায় নির্মিত কাস্টম তহবিল',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: '✨'
  }
};

export const FUND_STATUS_LABELS: Record<FundStatus, { label: string; badgeClass: string }> = {
  active: {
    label: 'সক্রিয় (Active)',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  inactive: {
    label: 'নিষ্ক্রিয় (Inactive)',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  archived: {
    label: 'আর্কাইভকৃত (Archived)',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300'
  }
};

export function FundManagementView({ currentOrg, onOrgChange }: FundManagementViewProps) {
  // State
  const [fundsState, setFundsState] = useState<Record<string, Fund[]>>(INITIAL_FUNDS);
  const [auditsState, setAuditsState] = useState<Record<string, FundAuditLog[]>>(INITIAL_AUDITS);
  
  // UI Sub-Tab: 'register' | 'audit' | 'guide'
  const [activeSubTab, setActiveSubTab] = useState<'register' | 'audit' | 'guide'>('register');

  // Filters & Search
  const [filters, setFilters] = useState<FundFilterCriteria>({
    searchQuery: '',
    fundType: 'all',
    status: 'all',
    origin: 'all'
  });

  // Sorting
  const [sortField, setSortField] = useState<'fundCode' | 'name' | 'sortOrder' | 'createdAt' | 'status'>('sortOrder');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);

  // Form States for Create/Edit
  const [formName, setFormName] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formType, setFormType] = useState<FundType>('general');
  const [formSortOrder, setFormSortOrder] = useState<number>(1);
  const [formReason, setFormReason] = useState<string>('');
  const [targetStatus, setTargetStatus] = useState<FundStatus>('active');
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Simulated Current User & RBAC Simulation
  const [simulatedRole, setSimulatedRole] = useState<'admin' | 'manager' | 'accountant' | 'viewer'>('admin');
  
  // Permission Matrix
  const permissions = useMemo(() => {
    switch (simulatedRole) {
      case 'admin':
        return { view: true, create: true, edit: true, status_change: true, export: true, print: true };
      case 'manager':
        return { view: true, create: true, edit: true, status_change: false, export: true, print: true };
      case 'accountant':
        return { view: true, create: false, edit: false, status_change: false, export: true, print: true };
      case 'viewer':
      default:
        return { view: true, create: false, edit: false, status_change: false, export: false, print: false };
    }
  }, [simulatedRole]);

  // Current Org Funds (Strict Scoping)
  const currentOrgFunds = useMemo(() => {
    return fundsState[currentOrg.id] || [];
  }, [fundsState, currentOrg.id]);

  // Current Org Audits
  const currentOrgAudits = useMemo(() => {
    return auditsState[currentOrg.id] || [];
  }, [auditsState, currentOrg.id]);

  // Next Available Fund Code Generator
  const nextFundCode = useMemo(() => {
    const existing = currentOrgFunds;
    let maxNum = 0;
    existing.forEach((f) => {
      const match = f.fundCode.match(/^FND-(\d+)$/i);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n > maxNum) maxNum = n;
      }
    });
    const nextVal = maxNum + 1;
    return `FND-${nextVal.toString().padStart(3, '0')}`;
  }, [currentOrgFunds]);

  // Next Suggested Sort Order
  const nextSortOrder = useMemo(() => {
    const existing = currentOrgFunds;
    if (existing.length === 0) return 1;
    return Math.max(...existing.map((f) => f.sortOrder || 0)) + 1;
  }, [currentOrgFunds]);

  // Filtered & Sorted Funds
  const filteredFunds = useMemo(() => {
    return currentOrgFunds.filter((f) => {
      // Search
      if (filters.searchQuery) {
        const q = normalizeText(filters.searchQuery);
        const nameMatch = normalizeText(f.name).includes(q);
        const codeMatch = normalizeText(f.fundCode).includes(q);
        const descMatch = f.description ? normalizeText(f.description).includes(q) : false;
        if (!nameMatch && !codeMatch && !descMatch) return false;
      }

      // Fund Type
      if (filters.fundType && filters.fundType !== 'all') {
        if (f.fundType !== filters.fundType) return false;
      }

      // Status
      if (filters.status && filters.status !== 'all') {
        if (f.status !== filters.status) return false;
      }

      // Origin
      if (filters.origin && filters.origin !== 'all') {
        if (filters.origin === 'system' && !f.isSystemDefined) return false;
        if (filters.origin === 'custom' && f.isSystemDefined) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'sortOrder') {
        comparison = (a.sortOrder || 0) - (b.sortOrder || 0);
      } else if (sortField === 'fundCode') {
        comparison = a.fundCode.localeCompare(b.fundCode);
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name, 'bn');
      } else if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [currentOrgFunds, filters, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredFunds.length / pageSize));
  const paginatedFunds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFunds.slice(start, start + pageSize);
  }, [filteredFunds, currentPage, pageSize]);

  // Handle Sort Change
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    if (!permissions.create) {
      alert('অনুমতি অস্বীকৃত (403 Forbidden): আপনার এই সংস্থায় নতুন তহবিল তৈরির অনুমতি নেই।');
      return;
    }
    setFormName('');
    setFormDescription('');
    setFormType('general');
    setFormSortOrder(nextSortOrder);
    setFormReason('');
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  // Submit Create Fund
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!permissions.create) {
      setFormError('অনুমতি অস্বীকৃত: আপনার নতুন তহবিল সৃষ্টির অনুমতি নেই।');
      return;
    }

    const trimmedName = formName.trim();
    if (!trimmedName) {
      setFormError('তহবিলের নাম প্রদান করা বাধ্যতামূলক।');
      return;
    }

    // Duplicate Check using NFC Normalization within same Org
    const normalizedInputName = normalizeText(trimmedName);
    const isDuplicate = currentOrgFunds.some((f) => {
      return normalizeText(f.name) === normalizedInputName && f.fundType === formType;
    });

    if (isDuplicate) {
      setFormError(`"${trimmedName}" নামের একই ধরনের (${FUND_TYPE_LABELS[formType].label}) একটি তহবিল ইতোমধ্যে বর্তমান সংস্থায় নিবন্ধিত আছে।`);
      return;
    }

    const newFund: Fund = {
      id: `fnd-${currentOrg.id}-${Date.now()}`,
      organizationId: currentOrg.id,
      fundCode: nextFundCode,
      name: trimmedName,
      description: formDescription.trim() || undefined,
      fundType: formType,
      isSystemDefined: false,
      isActive: true,
      status: 'active',
      sortOrder: Number(formSortOrder) || nextSortOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User'
    };

    const newAudit: FundAuditLog = {
      id: `fnd-aud-${Date.now()}`,
      organizationId: currentOrg.id,
      fundId: newFund.id,
      fundCode: newFund.fundCode,
      fundName: newFund.name,
      action: 'FUND_CREATED',
      actorUserId: 'usr-sim-01',
      actorName: 'Administrative User',
      timestamp: new Date().toISOString(),
      reason: formReason.trim() || 'নতুন কাস্টম তহবিল নিবন্ধন',
      afterState: newFund,
      changesSummary: `নতুন তহবিল "${newFund.name}" (${newFund.fundCode}) সফলভাবে তৈরি হয়েছে।`
    };

    setFundsState((prev) => ({
      ...prev,
      [currentOrg.id]: [...(prev[currentOrg.id] || []), newFund]
    }));

    setAuditsState((prev) => ({
      ...prev,
      [currentOrg.id]: [newAudit, ...(prev[currentOrg.id] || [])]
    }));

    setIsCreateModalOpen(false);
    setActionSuccess(`তহবিল "${newFund.name}" (${newFund.fundCode}) সফলভাবে তৈরি হয়েছে।`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Open Edit Modal
  const handleOpenEditModal = (fund: Fund) => {
    if (!permissions.edit) {
      alert('অনুমতি অস্বীকৃত (403 Forbidden): আপনার তহবিল সম্পাদনার অনুমতি নেই।');
      return;
    }
    setSelectedFund(fund);
    setFormName(fund.name);
    setFormDescription(fund.description || '');
    setFormType(fund.fundType);
    setFormSortOrder(fund.sortOrder);
    setFormReason('');
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Submit Edit Fund
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFund) return;
    setFormError(null);

    if (!permissions.edit) {
      setFormError('অনুমতি অস্বীকৃত: আপনার তহবিল সম্পাদনার অনুমতি নেই।');
      return;
    }

    const trimmedName = formName.trim();
    if (!trimmedName) {
      setFormError('তহবিলের নাম প্রদান করা বাধ্যতামূলক।');
      return;
    }

    // Duplicate Check within same Org (excluding itself)
    const normalizedInputName = normalizeText(trimmedName);
    const isDuplicate = currentOrgFunds.some((f) => {
      return f.id !== selectedFund.id && normalizeText(f.name) === normalizedInputName && f.fundType === formType;
    });

    if (isDuplicate) {
      setFormError(`"${trimmedName}" নামের একই ধরনের আরেকটি তহবিল ইতোমধ্যে বিদ্যমান।`);
      return;
    }

    // Prepare Updated Fund (Code, ID, OrgId, isSystemDefined remain IMMUTABLE)
    const updatedFund: Fund = {
      ...selectedFund,
      name: trimmedName,
      description: formDescription.trim() || undefined,
      fundType: formType,
      sortOrder: Number(formSortOrder) || selectedFund.sortOrder,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Administrative User'
    };

    const changes: string[] = [];
    if (selectedFund.name !== updatedFund.name) {
      changes.push(`নাম: "${selectedFund.name}" → "${updatedFund.name}"`);
    }
    if (selectedFund.fundType !== updatedFund.fundType) {
      changes.push(`ধরন: "${FUND_TYPE_LABELS[selectedFund.fundType].label}" → "${FUND_TYPE_LABELS[updatedFund.fundType].label}"`);
    }
    if (selectedFund.description !== updatedFund.description) {
      changes.push(`বিবরণ পরিবর্তিত`);
    }
    if (selectedFund.sortOrder !== updatedFund.sortOrder) {
      changes.push(`ক্রম: ${selectedFund.sortOrder} → ${updatedFund.sortOrder}`);
    }

    const newAudit: FundAuditLog = {
      id: `fnd-aud-${Date.now()}`,
      organizationId: currentOrg.id,
      fundId: updatedFund.id,
      fundCode: updatedFund.fundCode,
      fundName: updatedFund.name,
      action: 'FUND_UPDATED',
      actorUserId: 'usr-sim-01',
      actorName: 'Administrative User',
      timestamp: new Date().toISOString(),
      reason: formReason.trim() || 'তহবিলের তথ্য হালনাগাদ',
      beforeState: selectedFund,
      afterState: updatedFund,
      changesSummary: changes.length > 0 ? changes.join('; ') : 'কোনো মৌলিক পরিবর্তন হয়নি।'
    };

    setFundsState((prev) => ({
      ...prev,
      [currentOrg.id]: (prev[currentOrg.id] || []).map((f) => (f.id === updatedFund.id ? updatedFund : f))
    }));

    setAuditsState((prev) => ({
      ...prev,
      [currentOrg.id]: [newAudit, ...(prev[currentOrg.id] || [])]
    }));

    setIsEditModalOpen(false);
    setActionSuccess(`তহবিল "${updatedFund.name}" সফলভাবে হালনাগাদ হয়েছে।`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Open Status Modal
  const handleOpenStatusModal = (fund: Fund) => {
    if (!permissions.status_change) {
      alert('অনুমতি অস্বীকৃত (403 Forbidden): আপনার তহবিলের স্ট্যাটাস পরিবর্তনের অনুমতি নেই।');
      return;
    }
    setSelectedFund(fund);
    setTargetStatus(fund.status === 'active' ? 'inactive' : 'active');
    setFormReason('');
    setFormError(null);
    setIsStatusModalOpen(true);
  };

  // Submit Status Change
  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFund) return;
    setFormError(null);

    if (!permissions.status_change) {
      setFormError('অনুমতি অস্বীকৃত: আপনার স্ট্যাটাস পরিবর্তনের অনুমতি নেই।');
      return;
    }

    if (selectedFund.status === 'archived' && targetStatus === 'active') {
      setFormError('আর্কাইভকৃত তহবিল পুনরায় সক্রিয় করা যাবে না (Terminal State Policy)।');
      return;
    }

    const actionType: FundAuditLog['action'] =
      targetStatus === 'active'
        ? 'FUND_ACTIVATED'
        : targetStatus === 'inactive'
        ? 'FUND_DEACTIVATED'
        : 'FUND_ARCHIVED';

    const updatedFund: Fund = {
      ...selectedFund,
      status: targetStatus,
      isActive: targetStatus === 'active',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Administrative User'
    };

    const newAudit: FundAuditLog = {
      id: `fnd-aud-${Date.now()}`,
      organizationId: currentOrg.id,
      fundId: updatedFund.id,
      fundCode: updatedFund.fundCode,
      fundName: updatedFund.name,
      action: actionType,
      actorUserId: 'usr-sim-01',
      actorName: 'Administrative User',
      timestamp: new Date().toISOString(),
      reason: formReason.trim() || `তহবিলের স্ট্যাটাস "${FUND_STATUS_LABELS[selectedFund.status].label}" হতে "${FUND_STATUS_LABELS[targetStatus].label}" এ পরিবর্তন`,
      beforeState: selectedFund,
      afterState: updatedFund,
      changesSummary: `স্ট্যাটাস পরিবর্তন: ${selectedFund.status} → ${targetStatus}`
    };

    setFundsState((prev) => ({
      ...prev,
      [currentOrg.id]: (prev[currentOrg.id] || []).map((f) => (f.id === updatedFund.id ? updatedFund : f))
    }));

    setAuditsState((prev) => ({
      ...prev,
      [currentOrg.id]: [newAudit, ...(prev[currentOrg.id] || [])]
    }));

    setIsStatusModalOpen(false);
    setActionSuccess(`তহবিল "${updatedFund.name}"-এর স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে।`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Open Detail Modal
  const handleOpenDetailModal = (fund: Fund) => {
    setSelectedFund(fund);
    setIsDetailModalOpen(true);
  };

  // Export to UTF-8 CSV
  const handleExportCSV = () => {
    if (!permissions.export) {
      alert('অনুমতি অস্বীকৃত (403 Forbidden): আপনার ডেটা এক্সপোর্টের অনুমতি নেই।');
      return;
    }

    const headers = ['ক্রম', 'তহবিল কোড', 'তহবিলের নাম', 'ধরন', 'উৎপত্তি', 'অবস্থা', 'তৈরির তারিখ', 'হালনাগাদের তারিখ', 'বিবরণ'];
    const rows = filteredFunds.map((f, idx) => [
      idx + 1,
      `"${f.fundCode}"`,
      `"${f.name.replace(/"/g, '""')}"`,
      `"${FUND_TYPE_LABELS[f.fundType].label}"`,
      f.isSystemDefined ? '"System"' : '"Custom"',
      `"${FUND_STATUS_LABELS[f.status].label}"`,
      `"${new Date(f.createdAt).toLocaleDateString('bn-BD')}"`,
      `"${new Date(f.updatedAt).toLocaleDateString('bn-BD')}"`,
      `"${(f.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fund_register_${currentOrg.code}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Official A4 Register
  const handlePrint = () => {
    if (!permissions.print) {
      alert('অনুমতি অস্বীকৃত (403 Forbidden): আপনার প্রিন্ট করার অনুমতি নেই।');
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Organization Scoping Banner & Multi-Tenant Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                তহবিল ব্যবস্থাপনা (Fund Management)
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Phase 4.4 Dimension Foundation
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-numeric">
                Tenant: {currentOrg.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              সংগঠনের উদ্দেশ্য ও শ্রেণিভিত্তিক সমতল অর্থ কাঠামো • <span className="font-semibold text-emerald-800">Head ≠ Fund ≠ Account</span>
            </p>
          </div>
        </div>

        {/* Multi-Tenant Quick Switcher & RBAC Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <Shield className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <span className="text-[11px] font-medium text-slate-500">অনুকরণীয় রোল:</span>
            {(['admin', 'manager', 'accountant', 'viewer'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setSimulatedRole(role)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  simulatedRole === role
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role === 'admin' ? 'অ্যাডমিন' : role === 'manager' ? 'ম্যানেজার' : role === 'accountant' ? 'হিসাবরক্ষক' : 'দর্শক'}
              </button>
            ))}
          </div>

          {onOrgChange && (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <button
                onClick={() => onOrgChange('demo-org-khurushkul')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                  currentOrg.id === 'demo-org-khurushkul'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                খুরুশকুল সমিতি
              </button>
              <button
                onClick={() => onOrgChange('org-alfalah-01')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                  currentOrg.id === 'org-alfalah-01'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                আল-ফালাহ সমিতি
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-0.5 overflow-x-auto text-xs font-numeric">
        <button
          onClick={() => setActiveSubTab('register')}
          className={`py-2.5 px-4 font-bold rounded-t-xl border-b-2 flex items-center gap-2 transition ${
            activeSubTab === 'register'
              ? 'border-emerald-700 text-emerald-800 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-700" />
          <span>তহবিল রেজিস্টার ({currentOrgFunds.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`py-2.5 px-4 font-bold rounded-t-xl border-b-2 flex items-center gap-2 transition ${
            activeSubTab === 'audit'
              ? 'border-emerald-700 text-emerald-800 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <History className="w-4 h-4 text-emerald-700" />
          <span>অপরিবর্তনীয় অডিট ট্রেইল ({currentOrgAudits.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('guide')}
          className={`py-2.5 px-4 font-bold rounded-t-xl border-b-2 flex items-center gap-2 transition ${
            activeSubTab === 'guide'
              ? 'border-emerald-700 text-emerald-800 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>তহবিলের ধারণা ও হিসাবনীতি গাইড</span>
        </button>
      </div>

      {/* SUB-VIEW 1: FUND REGISTER */}
      {activeSubTab === 'register' && (
        <div className="space-y-4">
          {/* Action Header & Search / Filters Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filters.searchQuery || ''}
                  onChange={(e) => {
                    setFilters({ ...filters, searchQuery: e.target.value });
                    setCurrentPage(1);
                  }}
                  placeholder="তহবিলের নাম, কোড বা বিবরণ দিয়ে খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters({ ...filters, searchQuery: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Action Buttons: Create, Export, Print */}
              <div className="flex items-center gap-2 justify-end flex-wrap">
                {permissions.create ? (
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন তহবিল যোগ করুন</span>
                  </button>
                ) : (
                  <button
                    disabled
                    title="অনুমতি নেই (403 Forbidden)"
                    className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>নতুন তহবিল যোগ করুন</span>
                  </button>
                )}

                {permissions.export && (
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>CSV এক্সপোর্ট</span>
                  </button>
                )}

                {permissions.print && (
                  <button
                    onClick={handlePrint}
                    className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>A4 প্রিন্ট</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Filter Badges */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3 h-3" /> ফিল্টার:
              </span>

              {/* Fund Type Filter */}
              <select
                value={filters.fundType || 'all'}
                onChange={(e) => {
                  setFilters({ ...filters, fundType: e.target.value as any });
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="all">সকল তহবিলের ধরন</option>
                <option value="general">সাধারণ তহবিল</option>
                <option value="administrative">প্রশাসনিক তহবিল</option>
                <option value="share">শেয়ার মূলধন তহবিল</option>
                <option value="project">প্রকল্প তহবিল</option>
                <option value="custom">কাস্টম তহবিল</option>
              </select>

              {/* Status Filter */}
              <select
                value={filters.status || 'all'}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value as any });
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="all">সকল অবস্থা (Status)</option>
                <option value="active">সক্রিয় (Active)</option>
                <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                <option value="archived">আর্কাইভকৃত (Archived)</option>
              </select>

              {/* Origin Filter */}
              <select
                value={filters.origin || 'all'}
                onChange={(e) => {
                  setFilters({ ...filters, origin: e.target.value as any });
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="all">সকল উৎস</option>
                <option value="system">সিস্টেম নির্ধারিত (System)</option>
                <option value="custom">কাস্টম নির্মিত (Custom)</option>
              </select>

              {(filters.searchQuery || filters.fundType !== 'all' || filters.status !== 'all' || filters.origin !== 'all') && (
                <button
                  onClick={() => {
                    setFilters({ searchQuery: '', fundType: 'all', status: 'all', origin: 'all' });
                    setCurrentPage(1);
                  }}
                  className="text-[11px] text-red-600 font-bold hover:underline ml-2"
                >
                  ফিল্টার রিসেট
                </button>
              )}
            </div>
          </div>

          {/* Desktop Table & Mobile Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider font-heading text-[11px]">
                  <tr>
                    <th scope="col" className="py-3 px-3.5 w-12 text-center">ক্রম</th>
                    <th
                      scope="col"
                      className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('fundCode')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>তহবিল কোড</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>তহবিলের নাম</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th scope="col" className="py-3 px-3.5">তহবিলের ধরন</th>
                    <th scope="col" className="py-3 px-3.5 text-center">উৎস</th>
                    <th
                      scope="col"
                      className="py-3 px-3.5 text-center cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('sortOrder')}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>সর্ট ক্রম</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-3.5 text-center cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>অবস্থা (Status)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th scope="col" className="py-3 px-3.5 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-body">
                  {paginatedFunds.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <Wallet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-600">কোনো তহবিল পাওয়া যায়নি</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">আপনার ফিল্টার পরিবর্তন করুন অথবা নতুন তহবিল তৈরি করুন।</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedFunds.map((fund, idx) => {
                      const serial = (currentPage - 1) * pageSize + idx + 1;
                      const typeMeta = FUND_TYPE_LABELS[fund.fundType];
                      const statusMeta = FUND_STATUS_LABELS[fund.status];

                      return (
                        <tr
                          key={fund.id}
                          className="hover:bg-slate-50/80 transition group"
                        >
                          <td className="py-3 px-3.5 text-center font-numeric font-semibold text-slate-400">
                            {serial}
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                              {fund.fundCode}
                            </span>
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{fund.name}</span>
                            </div>
                            {fund.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {fund.description}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${typeMeta.badgeClass}`}>
                              <span>{typeMeta.icon}</span>
                              <span>{typeMeta.label.split(' ')[0]}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            {fund.isSystemDefined ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                <Lock className="w-2.5 h-2.5 text-slate-500" /> System
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Custom
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3.5 text-center font-numeric font-medium text-slate-600">
                            {fund.sortOrder}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.badgeClass}`}>
                              {statusMeta.label.split(' ')[0]}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenDetailModal(fund)}
                                title="বিস্তারিত তথ্য"
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {permissions.edit && (
                                <button
                                  onClick={() => handleOpenEditModal(fund)}
                                  title="সম্পাদনা করুন"
                                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}

                              {permissions.status_change && (
                                <button
                                  onClick={() => handleOpenStatusModal(fund)}
                                  title="স্ট্যাটাস পরিবর্তন"
                                  className={`p-1.5 rounded-lg transition ${
                                    fund.status === 'active'
                                      ? 'hover:bg-amber-50 text-amber-700'
                                      : 'hover:bg-emerald-50 text-emerald-700'
                                  }`}
                                >
                                  <Power className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginatedFunds.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Wallet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600 text-xs">কোনো তহবিল পাওয়া যায়নি</p>
                </div>
              ) : (
                paginatedFunds.map((fund) => {
                  const typeMeta = FUND_TYPE_LABELS[fund.fundType];
                  const statusMeta = FUND_STATUS_LABELS[fund.status];

                  return (
                    <div key={fund.id} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-[10px] text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {fund.fundCode}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${typeMeta.badgeClass}`}>
                              {typeMeta.label.split(' ')[0]}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{fund.name}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.badgeClass}`}>
                          {statusMeta.label.split(' ')[0]}
                        </span>
                      </div>

                      {fund.description && (
                        <p className="text-xs text-slate-500">{fund.description}</p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                        <span className="text-[11px]">ক্রম: #{fund.sortOrder}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenDetailModal(fund)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs"
                          >
                            বিস্তারিত
                          </button>
                          {permissions.edit && (
                            <button
                              onClick={() => handleOpenEditModal(fund)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold"
                            >
                              এডিট
                            </button>
                          )}
                          {permissions.status_change && (
                            <button
                              onClick={() => handleOpenStatusModal(fund)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs"
                            >
                              অবস্থা
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span>প্রতি পৃষ্ঠায়:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:border-emerald-600"
                >
                  <option value={5}>৫</option>
                  <option value={10}>১০</option>
                  <option value={20}>২০</option>
                  <option value={50}>৫০</option>
                </select>
                <span className="font-numeric">
                  মোট {filteredFunds.length}টি তহবিলের মধ্যে {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredFunds.length)} প্রদর্শিত
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  পূর্ববর্তী
                </button>
                <span className="px-3 py-1 font-bold font-numeric text-slate-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  পরবর্তী
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: IMMUTABLE AUDIT TIMELINE */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                তহবিল অডিট লগ ও ঐতিহাসিক অপরিবর্তনীয় ট্রেইল
              </h3>
              <p className="text-xs text-slate-500">
                সকল তহবিল সৃষ্টি, সম্পাদন ও স্ট্যাটাস পরিবর্তনের সিকিউর অ্যাপেন্ড-অনলি হিস্ট্রি
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              মোট অডিট ইভেন্ট: {currentOrgAudits.length}
            </span>
          </div>

          <div className="space-y-3">
            {currentOrgAudits.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold">কোনো অডিট রেকর্ড সংরক্ষিত নেই</p>
              </div>
            ) : (
              currentOrgAudits.map((audit) => {
                const actionColors: Record<string, string> = {
                  FUND_CREATED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  FUND_UPDATED: 'bg-blue-50 text-blue-800 border-blue-200',
                  FUND_ACTIVATED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  FUND_DEACTIVATED: 'bg-amber-50 text-amber-800 border-amber-200',
                  FUND_ARCHIVED: 'bg-slate-100 text-slate-800 border-slate-300'
                };

                return (
                  <div
                    key={audit.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${actionColors[audit.action] || 'bg-slate-100 text-slate-700'}`}>
                          {audit.action}
                        </span>
                        <span className="font-bold text-slate-900">{audit.fundName}</span>
                        <span className="font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                          {audit.fundCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-numeric">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(audit.timestamp).toLocaleString('bn-BD')}</span>
                      </div>
                    </div>

                    <div className="text-slate-700">
                      <p><span className="font-semibold text-slate-900">পরিবর্তনের সারাংশ:</span> {audit.changesSummary}</p>
                      {audit.reason && (
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          <span className="font-semibold">কারণ:</span> {audit.reason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <UserCheck className="w-3 h-3 text-emerald-700" />
                      <span>ব্যবহারকারী: <span className="font-semibold text-slate-700">{audit.actorName}</span> ({audit.actorUserId})</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: DOMAIN ARCHITECTURE GUIDE */}
      {activeSubTab === 'guide' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 text-xs text-slate-700">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              <span>তিজারাহ সমিতি সফটওয়্যার: তিন মাত্রার হিসাব কাঠামো (Three-Dimension Architecture)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              হালাল ব্যবসা ও সমবায় পরিচালনায় হিসাব বিজ্ঞানের মৌলিক নীতিসমূহ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-900 text-sm font-heading">
                <FolderTree className="w-4 h-4 text-blue-700" />
                <span>১. খাত (Head)</span>
              </div>
              <p className="font-bold text-blue-800">কেন টাকা আসছে বা যাচ্ছে?</p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                অর্থনৈতিক লেনদেনের কারণ বা শ্রেণিবিভাগ। যেমন: সদস্য ভর্তি ফি, স্টেশনারি খরচ, অফিস ভাড়া। এটি ২-স্তরীয় (Main Head → Sub Head)।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm font-heading">
                <Wallet className="w-4 h-4 text-emerald-700" />
                <span>২. তহবিল (Fund)</span>
              </div>
              <p className="font-bold text-emerald-800">কোন উদ্দেশ্য বা শ্রেণির অর্থ?</p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                অর্থের উদ্দেশ্য বা বিধিবদ্ধ শ্রেণি। যেমন: সাধারণ তহবিল, প্রকল্প তহবিল, শেয়ার মূলধন তহবিল। এটি সমতল বা ফ্ল্যাট কাঠামো।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-900 text-sm font-heading">
                <Building2 className="w-4 h-4 text-purple-700" />
                <span>৩. হিসাব (Account)</span>
              </div>
              <p className="font-bold text-purple-800">টাকা বর্তমানে কোথায় গচ্ছিত আছে?</p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                অর্থের বাস্তবিক অবস্থান। যেমন: ক্যাশ ইন হ্যান্ড, সোনালী ব্যাংক চলতি হিসাব, বিকাশ মার্চেন্ট অ্যাকাউন্ট। (Phase 4.5/5)
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2 text-[11px]">
            <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>সীমারেখা ও বিধি-নিষেধ (Scope Boundaries)</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-amber-900">
              <li><span className="font-semibold">Fund ≠ Head:</span> ফান্ড কখনো খাত হিসেবে ব্যবহৃত হবে না। একটি খাতের খরচ বিভিন্ন ফান্ড থেকে নির্বাহ হতে পারে।</li>
              <li><span className="font-semibold">Fund ≠ Account:</span> ফান্ড কোনো ব্যাংক বা ক্যাশ অ্যাকাউন্ট নয়। এটি আর্থিক ব্যালেন্স ধারণ করে না।</li>
              <li><span className="font-semibold">জিরো হার্ড ডিলিট:</span> একবার ফান্ড তৈরি হলে তা ডাটাবেজ থেকে মুছে ফেলা নিষিদ্ধ। প্রয়োজনে Inactive বা Archived করতে হবে।</li>
              <li><span className="font-semibold">কোনো হার্ডকোডেড ধর্মীয় সিড নেই:</span> যাকাত, সদকা, ওয়াকফ ইত্যাদির কোনো বাধ্যতামূলক ডিফল্ট ফান্ড সিস্টেমে কোড করা নেই। সমিতি প্রয়োজন অনুযায়ী কাস্টম ফান্ড তৈরি করতে পারবে।</li>
            </ul>
          </div>
        </div>
      )}

      {/* CREATE FUND MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">নতুন তহবিল নিবন্ধন</h3>
                  <p className="text-[11px] text-slate-500">সংগঠনের অধীনে নতুন অর্থ উদ্দেশ্য বা তহবিল অন্তর্ভুক্ত করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Fund Code Preview (Auto-generated & Read-only) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">স্বয়ংক্রিয় তহবিল কোড</span>
                  <span className="font-mono font-bold text-sm text-slate-900">{nextFundCode}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  অপরিবর্তনীয় (Immutable)
                </span>
              </div>

              {/* Fund Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  তহবিলের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="যেমন: সাধারণ তহবিল, মৎস্য প্রকল্প তহবিল"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  required
                />
              </div>

              {/* Fund Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">তহবিলের ধরন (Fund Type)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(FUND_TYPE_LABELS) as FundType[]).map((type) => (
                    <label
                      key={type}
                      className={`p-2.5 rounded-xl border flex items-start gap-2 cursor-pointer transition ${
                        formType === type
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fundType"
                        value={type}
                        checked={formType === type}
                        onChange={() => setFormType(type)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px]">
                          {FUND_TYPE_LABELS[type].label.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-slate-500 leading-tight block">
                          {FUND_TYPE_LABELS[type].desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">তহবিলের বিবরণ</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="তহবিলের উদ্দেশ্য ও ব্যবহারের পরিধি সংক্ষেপে লিখুন..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                />
              </div>

              {/* Sort Order & Audit Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">সর্ট ক্রম (Sort Order)</label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white font-numeric"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">অন্তর্ভুক্তির কারণ (Audit Reason)</label>
                  <input
                    type="text"
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    placeholder="যেমন: বার্ষিক সাধারণ সভার সিদ্ধান্ত"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition shadow-xs"
                >
                  তহবিল সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FUND MODAL */}
      {isEditModalOpen && selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">তহবিল সম্পাদনা</h3>
                  <p className="text-[11px] text-slate-500">তহবিলের নাম ও বিবরণ হালনাগাদ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Immutable Attributes Notice */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">তহবিল কোড</span>
                  <span className="font-mono font-bold text-slate-900">{selectedFund.fundCode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">উৎস</span>
                  <span className="font-bold text-slate-900">{selectedFund.isSystemDefined ? 'System Defined' : 'Custom Fund'}</span>
                </div>
              </div>

              {/* Fund Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  তহবিলের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white font-medium"
                  required
                />
              </div>

              {/* Fund Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">তহবিলের ধরন (Fund Type)</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as FundType)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white font-medium"
                >
                  {(Object.keys(FUND_TYPE_LABELS) as FundType[]).map((type) => (
                    <option key={type} value={type}>
                      {FUND_TYPE_LABELS[type].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">তহবিলের বিবরণ</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                />
              </div>

              {/* Sort Order & Audit Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">সর্ট ক্রম (Sort Order)</label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white font-numeric"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">সম্পাদনার কারণ (Audit Reason)</label>
                  <input
                    type="text"
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    placeholder="হালনাগাদের কারণ লিখুন..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition shadow-xs"
                >
                  পরিবর্তন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS MANAGEMENT MODAL */}
      {isStatusModalOpen && selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                  <Power className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">তহবিল অবস্থা পরিবর্তন</h3>
                  <p className="text-[11px] text-slate-500">নিয়ন্ত্রিত লাইফসাইকেল ট্রানজিশন</p>
                </div>
              </div>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900">{selectedFund.fundCode}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${FUND_STATUS_LABELS[selectedFund.status].badgeClass}`}>
                    বর্তমান: {FUND_STATUS_LABELS[selectedFund.status].label}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedFund.name}</h4>
              </div>

              {/* Target Status Select */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">কাঙ্ক্ষিত নতুন অবস্থা (Target Status)</label>
                <div className="space-y-2">
                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    targetStatus === 'active' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="targetStatus"
                        value="active"
                        checked={targetStatus === 'active'}
                        onChange={() => setTargetStatus('active')}
                        disabled={selectedFund.status === 'archived'}
                        className="text-emerald-600"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">সক্রিয় (Active)</span>
                        <span className="text-[11px] text-slate-500">ভবিষ্যতে আর্থিক লেনদেনের উদ্দেশ্য হিসেবে ব্যবহারযোগ্য</span>
                      </div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    targetStatus === 'inactive' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="targetStatus"
                        value="inactive"
                        checked={targetStatus === 'inactive'}
                        onChange={() => setTargetStatus('inactive')}
                        className="text-amber-600"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">নিষ্ক্রিয় (Inactive)</span>
                        <span className="text-[11px] text-slate-500">সাময়িক বন্ধ থাকবে, তবে পূর্বের ইতিহাস সংরক্ষিত থাকবে</span>
                      </div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    targetStatus === 'archived' ? 'border-slate-600 bg-slate-100' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="targetStatus"
                        value="archived"
                        checked={targetStatus === 'archived'}
                        onChange={() => setTargetStatus('archived')}
                        className="text-slate-600"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">আর্কাইভকৃত (Archived)</span>
                        <span className="text-[11px] text-slate-500">স্থায়ীভাবে সমাপ্ত, পুনরায় সক্রিয় করা যাবে না</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Status Change Reason */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  পরিবর্তনের কারণ (Mandatory Audit Reason) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="স্ট্যাটাস পরিবর্তনের যৌক্তিক কারণ উল্লেখ করুন..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition shadow-xs"
                >
                  স্ট্যাটাস নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL 360 MODAL */}
      {isDetailModalOpen && selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">তহবিলের বিস্তারিত বিবরণ</h3>
                  <p className="text-[11px] text-slate-500">{selectedFund.fundCode} • {selectedFund.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px]">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">তহবিল কোড</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{selectedFund.fundCode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">তহবিলের ধরন</span>
                  <span className="font-bold text-emerald-800">{FUND_TYPE_LABELS[selectedFund.fundType].label}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">উৎস ও সত্ত্বা</span>
                  <span className="font-bold text-slate-800">{selectedFund.isSystemDefined ? 'সিস্টেম নির্ধারিত (System)' : 'কাস্টম নির্মিত (Custom)'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">বর্তমান অবস্থা</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${FUND_STATUS_LABELS[selectedFund.status].badgeClass}`}>
                    {FUND_STATUS_LABELS[selectedFund.status].label}
                  </span>
                </div>
              </div>

              {selectedFund.description && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 block">বিবরণ:</span>
                  <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {selectedFund.description}
                  </p>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-600 font-numeric">
                <p><span className="font-semibold text-slate-800">তৈরি হয়েছে:</span> {new Date(selectedFund.createdAt).toLocaleString('bn-BD')} ({selectedFund.createdBy || 'System'})</p>
                <p><span className="font-semibold text-slate-800">সর্বশেষ হালনাগাদ:</span> {new Date(selectedFund.updatedAt).toLocaleString('bn-BD')} ({selectedFund.updatedBy || 'System'})</p>
                <p><span className="font-semibold text-slate-800">সর্ট ক্রম:</span> #{selectedFund.sortOrder}</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[11px] text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-emerald-700" />
                  আর্কিটেকচারাল নোট:
                </span>
                <p className="text-emerald-800">
                  এই তহবিলটি একটি সমতল মাত্রা (Flat Dimension)। এতে কোনো সাব-তহবিল নেই এবং এটি কোনো সরাসরি ব্যালেন্স বা লেনদেন ধারণ করে না।
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
