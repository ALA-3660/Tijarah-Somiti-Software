import React, { useState, useMemo } from 'react';
import {
  FolderTree,
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
  ChevronDown,
  Layers,
  ArrowRight,
  Eye,
  FileSpreadsheet,
  X,
  HelpCircle,
  Hash,
  Scale
} from 'lucide-react';
import {
  Head,
  HeadType,
  HeadLevel,
  HeadStatus,
  HeadAuditLog,
  HeadFilterCriteria,
  OrganizationContext
} from '../types';

interface HeadManagementViewProps {
  currentOrg: OrganizationContext;
  onOrgChange?: (orgId: string) => void;
}

// Initial Mock Seed Data for Demonstration & Multi-Tenant Testing
const INITIAL_HEADS: Record<string, Head[]> = {
  'demo-org-khurushkul': [
    // Income Main Heads (Level 1)
    {
      id: 'head-khu-inc-01',
      organizationId: 'demo-org-khurushkul',
      headCode: 'INC-001',
      name: 'সদস্যভিত্তিক আয়',
      description: 'সদস্যদের নিয়মিত চাঁদা ও অন্তর্ভুক্তি বাবদ আয়',
      headType: 'income',
      parentId: null,
      level: 1,
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-01-10T09:00:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'head-khu-inc-02',
      organizationId: 'demo-org-khurushkul',
      headCode: 'INC-002',
      name: 'ব্যবসায়িক আয়',
      description: 'হালাল ব্যবসা ও ট্রেডিং হতে লব্ধ আয়',
      headType: 'income',
      parentId: null,
      level: 1,
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-01-10T09:00:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'head-khu-inc-03',
      organizationId: 'demo-org-khurushkul',
      headCode: 'INC-003',
      name: 'অন্যান্য সাধারণ আয়',
      description: 'বিবিধ ও সাধারণ ফি বাবদ প্রাপ্তি',
      headType: 'income',
      parentId: null,
      level: 1,
      isSystemDefined: false,
      isActive: true,
      status: 'active',
      sortOrder: 3,
      createdAt: '2026-01-11T10:00:00.000Z',
      updatedAt: '2026-01-11T10:00:00.000Z',
      createdBy: 'Admin Officer'
    },
    // Income Sub Heads (Level 2)
    {
      id: 'head-khu-inc-01-01',
      organizationId: 'demo-org-khurushkul',
      headCode: 'INC-001-01',
      name: 'নতুন সদস্য ভর্তি ফি',
      description: 'সদস্যপদ গ্রহণের সময় এককালীন ফি',
      headType: 'income',
      parentId: 'head-khu-inc-01',
      level: 2,
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2026-01-10T09:15:00.000Z',
      updatedAt: '2026-01-10T09:15:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'head-khu-inc-01-02',
      organizationId: 'demo-org-khurushkul',
      headCode: 'INC-001-02',
      name: 'মাসিক উন্নয়ন চাঁদা',
      description: 'সদস্যদের নিয়মিত মাসিক চাঁদা',
      headType: 'income',
      parentId: 'head-khu-inc-01',
      level: 2,
      isSystemDefined: false,
      isActive: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2026-01-10T09:20:00.000Z',
      updatedAt: '2026-01-10T09:20:00.000Z',
      createdBy: 'Admin Officer'
    },
    {
      id: 'head-khu-inc-02-01',
      organizationId: 'demo-org-khurushkul',
      headCode: 'INC-002-01',
      name: 'পণ্য বিক্রয় লভ্যাংশ',
      description: 'সমিতির বাণিজ্যিক বিক্রয়ের লাভ',
      headType: 'income',
      parentId: 'head-khu-inc-02',
      level: 2,
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2026-01-10T09:30:00.000Z',
      updatedAt: '2026-01-10T09:30:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    // Expense Main Heads (Level 1)
    {
      id: 'head-khu-exp-01',
      organizationId: 'demo-org-khurushkul',
      headCode: 'EXP-001',
      name: 'প্রশাসনিক ব্যয়',
      description: 'দাপ্তরিক পরিচালনা ও কার্যালয় রক্ষণাবেক্ষণ ব্যয়',
      headType: 'expense',
      parentId: null,
      level: 1,
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-01-10T09:00:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'head-khu-exp-02',
      organizationId: 'demo-org-khurushkul',
      headCode: 'EXP-002',
      name: 'ব্যবসায়িক ও পরিচালনা ব্যয়',
      description: 'ট্রেডিং, ক্রয়-বিক্রয় ও পণ্য স্থানান্তর ব্যয়',
      headType: 'expense',
      parentId: null,
      level: 1,
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-01-10T09:00:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    // Expense Sub Heads (Level 2)
    {
      id: 'head-khu-exp-01-01',
      organizationId: 'demo-org-khurushkul',
      headCode: 'EXP-001-01',
      name: 'অফিস ভাড়া',
      description: 'প্রধান কার্যালয়ের মাসিক ভাড়া',
      headType: 'expense',
      parentId: 'head-khu-exp-01',
      level: 2,
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2026-01-10T09:40:00.000Z',
      updatedAt: '2026-01-10T09:40:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'head-khu-exp-01-02',
      organizationId: 'demo-org-khurushkul',
      headCode: 'EXP-001-02',
      name: 'কর্মকর্তাদের বেতন ও সম্মানী',
      description: 'স্থায়ী ও চুক্তিভিত্তিক কর্মীদের মাসিক বেতন',
      headType: 'expense',
      parentId: 'head-khu-exp-01',
      level: 2,
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 2,
      createdAt: '2026-01-10T09:45:00.000Z',
      updatedAt: '2026-01-10T09:45:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'head-khu-exp-01-03',
      organizationId: 'demo-org-khurushkul',
      headCode: 'EXP-001-03',
      name: 'বিদ্যুৎ ও ইউটিলিটি বিল',
      description: 'পানি, বিদ্যুৎ ও ইন্টারনেট সেবা খরচ',
      headType: 'expense',
      parentId: 'head-khu-exp-01',
      level: 2,
      isSystemDefined: false,
      isActive: true,
      status: 'active',
      sortOrder: 3,
      createdAt: '2026-01-12T11:00:00.000Z',
      updatedAt: '2026-01-12T11:00:00.000Z',
      createdBy: 'Accountant'
    }
  ],
  'org-alfalah-01': [
    {
      id: 'head-alf-inc-01',
      organizationId: 'org-alfalah-01',
      headCode: 'INC-001',
      name: 'সদস্য চাঁদা ও উন্নয়ন ফি',
      description: 'আল-ফালাহ সমিতির সদস্যদের মাসিক চাঁদা',
      headType: 'income',
      parentId: null,
      level: 1,
      isSystemDefined: true,
      isActive: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2026-01-05T08:00:00.000Z',
      updatedAt: '2026-01-05T08:00:00.000Z',
      createdBy: 'System Seed Initializer'
    },
    {
      id: 'head-alf-inc-01-01',
      organizationId: 'org-alfalah-01',
      headCode: 'INC-001-01',
      name: 'আজীবন সদস্য অন্তর্ভুক্তি ফি',
      description: 'স্থায়ী সদস্যপদের প্রদেয় ফি',
      headType: 'income',
      parentId: 'head-alf-inc-01',
      level: 2,
      isSystemDefined: false,
      isActive: true,
      status: 'active',
      sortOrder: 1,
      createdAt: '2026-01-05T08:30:00.000Z',
      updatedAt: '2026-01-05T08:30:00.000Z',
      createdBy: 'Manager Al-Falah'
    }
  ]
};

const INITIAL_AUDIT_LOGS: Record<string, HeadAuditLog[]> = {
  'demo-org-khurushkul': [
    {
      id: 'audit-h-01',
      organizationId: 'demo-org-khurushkul',
      headId: 'head-khu-inc-01',
      headCode: 'INC-001',
      headName: 'সদস্যভিত্তিক আয়',
      action: 'HEAD_CREATED',
      actorUserId: 'usr-sys-001',
      actorName: 'সিস্টেম অ্যাডমিন',
      timestamp: '2026-01-10T09:00:00.000Z',
      reason: 'প্রাথমিক সিস্টেম মাস্টার হেড সিডিং',
      changesSummary: 'Main Head INC-001 (সদস্যভিত্তিক আয়) তৈরি করা হয়েছে'
    },
    {
      id: 'audit-h-02',
      organizationId: 'demo-org-khurushkul',
      headId: 'head-khu-inc-01-01',
      headCode: 'INC-001-01',
      headName: 'নতুন সদস্য ভর্তি ফি',
      action: 'HEAD_CREATED',
      actorUserId: 'usr-sys-001',
      actorName: 'সিস্টেম অ্যাডমিন',
      timestamp: '2026-01-10T09:15:00.000Z',
      reason: 'সদস্য ভর্তি ফি সাব-হেড তৈরি',
      changesSummary: 'Sub Head INC-001-01 parented under INC-001'
    }
  ]
};

export const HeadManagementView: React.FC<HeadManagementViewProps> = ({
  currentOrg,
  onOrgChange
}) => {
  const orgId = currentOrg.id;

  // Master State for Multi-Tenant Heads & Audit Logs
  const [headsState, setHeadsState] = useState<Record<string, Head[]>>(INITIAL_HEADS);
  const [auditLogsState, setAuditLogsState] = useState<Record<string, HeadAuditLog[]>>(INITIAL_AUDIT_LOGS);

  // Active View Tab inside Head Management
  const [activeSubTab, setActiveSubTab] = useState<'register' | 'tree' | 'audit' | 'guide'>('register');

  // RBAC Simulated Role
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'manager' | 'viewer'>('admin');
  const [forbiddenMessage, setForbiddenMessage] = useState<string | null>(null);

  // Filter & Search Criteria
  const [filters, setFilters] = useState<HeadFilterCriteria>({
    searchQuery: '',
    headType: 'all',
    level: 'all',
    status: 'all',
    origin: 'all',
    parentId: 'all'
  });

  // Sorting
  const [sortField, setSortField] = useState<'headCode' | 'name' | 'headType' | 'level' | 'sortOrder' | 'createdAt' | 'status'>('headCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Modal Dialog States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Selected Entities
  const [selectedHead, setSelectedHead] = useState<Head | null>(null);
  const [targetStatus, setTargetStatus] = useState<HeadStatus>('active');
  const [statusChangeReason, setStatusChangeReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Tree View Expansion State
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'tree-inc': true,
    'tree-exp': true,
    'head-khu-inc-01': true,
    'head-khu-inc-02': true,
    'head-khu-exp-01': true,
    'head-khu-exp-02': true
  });

  // Create Form State
  const [formType, setFormType] = useState<HeadType>('income');
  const [formLevel, setFormLevel] = useState<HeadLevel>(1);
  const [formParentId, setFormParentId] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formSortOrder, setFormSortOrder] = useState<number>(1);

  // Edit Form State
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editSortOrder, setEditSortOrder] = useState<number>(1);

  // Current Org Heads
  const currentOrgHeads = useMemo(() => {
    return headsState[orgId] || [];
  }, [headsState, orgId]);

  // Current Org Audit Logs
  const currentOrgAuditLogs = useMemo(() => {
    return auditLogsState[orgId] || [];
  }, [auditLogsState, orgId]);

  // Helper: Unicode normalization for robust Bengali string comparison
  const normalizeText = (text: string) => {
    return text.normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
  };

  // Helper: Get Main Heads for Parent Select dropdown (Same Org, Same Type, Active)
  const availableParentHeads = useMemo(() => {
    return currentOrgHeads.filter(
      (h) => h.level === 1 && h.headType === formType && h.status === 'active'
    );
  }, [currentOrgHeads, formType]);

  // Toast auto-dismiss
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // RBAC Permission Checker
  const hasPermission = (actionKey: 'view' | 'create' | 'edit' | 'status_change' | 'export' | 'print'): boolean => {
    if (currentUserRole === 'admin') return true;
    if (currentUserRole === 'manager') {
      return true; // Managers can do all head operations
    }
    if (currentUserRole === 'viewer') {
      return actionKey === 'view' || actionKey === 'export' || actionKey === 'print';
    }
    return false;
  };

  const verifyAction = (actionKey: 'create' | 'edit' | 'status_change'): boolean => {
    if (!hasPermission(actionKey)) {
      setForbiddenMessage('HTTP 403 Forbidden: আপনার এই পরিবর্তনটি সম্পাদনের জন্য পর্যাপ্ত অনুমতি নেই। শুধুমাত্র অ্যাডমিন বা ম্যানেজার একাউন্ট এটি পরিবর্তন করতে পারেন।');
      setTimeout(() => setForbiddenMessage(null), 5000);
      return false;
    }
    return true;
  };

  // Auto Code Generator Helper
  const generateSuggestedCode = (type: HeadType, level: HeadLevel, parentId: string | null) => {
    const prefix = type === 'income' ? 'INC' : 'EXP';
    if (level === 1) {
      const existingMainHeads = currentOrgHeads.filter((h) => h.level === 1 && h.headType === type);
      const nextNum = existingMainHeads.length + 1;
      return `${prefix}-${String(nextNum).padStart(3, '0')}`;
    } else {
      const parent = currentOrgHeads.find((h) => h.id === parentId);
      const parentCode = parent ? parent.headCode : `${prefix}-001`;
      const existingChildren = currentOrgHeads.filter((h) => h.parentId === parentId);
      const nextChildNum = existingChildren.length + 1;
      return `${parentCode}-${String(nextChildNum).padStart(2, '0')}`;
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    if (!verifyAction('create')) return;
    setFormType('income');
    setFormLevel(1);
    setFormParentId('');
    setFormCode(generateSuggestedCode('income', 1, null));
    setFormName('');
    setFormDescription('');
    setFormSortOrder(1);
    setErrorMessage(null);
    setIsCreateModalOpen(true);
  };

  // Form Type Change Handler
  const handleFormTypeChange = (newType: HeadType) => {
    setFormType(newType);
    setFormParentId('');
    setFormCode(generateSuggestedCode(newType, formLevel, null));
  };

  // Form Level Change Handler
  const handleFormLevelChange = (newLevel: HeadLevel) => {
    setFormLevel(newLevel);
    if (newLevel === 1) {
      setFormParentId('');
      setFormCode(generateSuggestedCode(formType, 1, null));
    } else {
      const firstParent = availableParentHeads[0];
      const pid = firstParent ? firstParent.id : '';
      setFormParentId(pid);
      setFormCode(generateSuggestedCode(formType, 2, pid));
    }
  };

  // Form Parent Change Handler
  const handleFormParentChange = (pid: string) => {
    setFormParentId(pid);
    setFormCode(generateSuggestedCode(formType, 2, pid));
  };

  // Validate and Submit Create Head
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAction('create')) return;

    const trimmedCode = formCode.trim().toUpperCase();
    const trimmedName = formName.trim();

    // 1. Required Validations
    if (!trimmedCode) {
      setErrorMessage('খাত কোড (Head Code) আবশ্যক।');
      return;
    }
    if (!trimmedName) {
      setErrorMessage('খাতের নাম (Head Name) আবশ্যক।');
      return;
    }

    // 2. Duplicate Code Check in same Org
    const isDuplicateCode = currentOrgHeads.some(
      (h) => h.headCode.toUpperCase() === trimmedCode
    );
    if (isDuplicateCode) {
      setErrorMessage(`কোড '${trimmedCode}' ইতোমধ্যে এই সমিতিতে ব্যবহৃত হয়েছে। অনুগ্রহ করে অনন্য কোড দিন।`);
      return;
    }

    const normName = normalizeText(trimmedName);

    // 3. Sub Head Parent Validation
    if (formLevel === 2) {
      if (!formParentId) {
        setErrorMessage('সাব-হেডের জন্য মূল খাত (Parent Main Head) নির্বাচন করা বাধ্যতামূলক।');
        return;
      }
      const parent = currentOrgHeads.find((h) => h.id === formParentId);
      if (!parent) {
        setErrorMessage('নির্বাচিত মূল খাত খুঁজে পাওয়া যায়নি বা অন্য সংগঠনের।');
        return;
      }
      if (parent.level !== 1) {
        setErrorMessage('সাব-হেডের অভিভাবক শুধুমাত্র লেভেল-১ মূল খাত হতে পারে।');
        return;
      }
      if (parent.headType !== formType) {
        setErrorMessage(`অভিভাবক খাতের টাইপ (${parent.headType === 'income' ? 'আয়' : 'ব্যয়'}) এবং সাব-হেডের টাইপ (${formType === 'income' ? 'আয়' : 'ব্যয়'}) এক হতে হবে।`);
        return;
      }
      if (parent.status !== 'active') {
        setErrorMessage('নিষ্ক্রিয় বা আর্কাইভকৃত মূল খাতের অধীনে নতুন সাব-হেড তৈরি করা নিষিদ্ধ।');
        return;
      }

      // Duplicate Name under same Parent Check with Unicode normalization
      const isDuplicateChildName = currentOrgHeads.some(
        (h) => h.parentId === formParentId && h.headType === formType && normalizeText(h.name) === normName
      );
      if (isDuplicateChildName) {
        setErrorMessage(`এই মূল খাতের অধীনে '${trimmedName}' নামে ইতিমধ্যে একটি সাব-হেড বিদ্যমান।`);
        return;
      }
    } else {
      // Duplicate Main Head Name Check with Unicode normalization
      const isDuplicateMainName = currentOrgHeads.some(
        (h) => h.level === 1 && h.headType === formType && normalizeText(h.name) === normName
      );
      if (isDuplicateMainName) {
        setErrorMessage(`এই টাইপের অধীনে '${trimmedName}' নামে ইতিমধ্যে একটি মূল খাত বিদ্যমান।`);
        return;
      }
    }

    const newId = `head-${orgId.substring(0, 5)}-${Date.now()}`;
    const newHead: Head = {
      id: newId,
      organizationId: orgId,
      headCode: trimmedCode,
      name: trimmedName,
      description: formDescription.trim(),
      headType: formType,
      parentId: formLevel === 2 ? formParentId : null,
      level: formLevel,
      isSystemDefined: false, // User created is always Custom
      isActive: true,
      status: 'active',
      sortOrder: formSortOrder || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUserRole === 'admin' ? 'System Administrator' : 'Branch Manager'
    };

    // Audit Log Entry
    const auditEntry: HeadAuditLog = {
      id: `audit-${Date.now()}`,
      organizationId: orgId,
      headId: newId,
      headCode: trimmedCode,
      headName: trimmedName,
      action: 'HEAD_CREATED',
      actorUserId: `usr-${currentUserRole}`,
      actorName: currentUserRole === 'admin' ? 'অ্যাডমিন ইউজার' : 'ম্যানেজার ইউজার',
      timestamp: new Date().toISOString(),
      reason: 'নতুন খাত সংযোজন',
      afterState: newHead,
      changesSummary: `${formLevel === 1 ? 'মূল খাত' : 'সাব-হেড'} (${trimmedCode}: ${trimmedName}) সফলভাবে তৈরি করা হয়েছে`
    };

    setHeadsState((prev) => ({
      ...prev,
      [orgId]: [...(prev[orgId] || []), newHead]
    }));

    setAuditLogsState((prev) => ({
      ...prev,
      [orgId]: [auditEntry, ...(prev[orgId] || [])]
    }));

    setIsCreateModalOpen(false);
    triggerToast(`খাত '${trimmedName}' (${trimmedCode}) সফলভাবে সংরক্ষণ করা হয়েছে।`);
  };

  // Open Edit Modal
  const handleOpenEditModal = (head: Head) => {
    if (!verifyAction('edit')) return;
    setSelectedHead(head);
    setEditName(head.name);
    setEditDescription(head.description || '');
    setEditSortOrder(head.sortOrder);
    setErrorMessage(null);
    setIsEditModalOpen(true);
  };

  // Submit Edit Head (Code is immutable, only name, description, sortOrder are updated)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAction('edit') || !selectedHead) return;

    const trimmedName = editName.trim();
    if (!trimmedName) {
      setErrorMessage('খাতের নাম আবশ্যক।');
      return;
    }

    const normName = normalizeText(trimmedName);

    // Check duplicate name under same parent/type excluding self
    const isDuplicate = currentOrgHeads.some((h) => {
      if (h.id === selectedHead.id) return false;
      if (selectedHead.level === 1) {
        return h.level === 1 && h.headType === selectedHead.headType && normalizeText(h.name) === normName;
      } else {
        return h.parentId === selectedHead.parentId && h.headType === selectedHead.headType && normalizeText(h.name) === normName;
      }
    });

    if (isDuplicate) {
      setErrorMessage(`'${trimmedName}' নামে সমগোত্রীয় খাত ইতিমধ্যে বিদ্যমান।`);
      return;
    }

    const beforeState = { ...selectedHead };
    const updatedHead: Head = {
      ...selectedHead,
      name: trimmedName,
      description: editDescription.trim(),
      sortOrder: editSortOrder,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUserRole === 'admin' ? 'System Administrator' : 'Branch Manager'
    };

    const auditEntry: HeadAuditLog = {
      id: `audit-${Date.now()}`,
      organizationId: orgId,
      headId: selectedHead.id,
      headCode: selectedHead.headCode,
      headName: trimmedName,
      action: 'HEAD_UPDATED',
      actorUserId: `usr-${currentUserRole}`,
      actorName: currentUserRole === 'admin' ? 'অ্যাডমিন ইউজার' : 'ম্যানেজার ইউজার',
      timestamp: new Date().toISOString(),
      reason: 'খাতের তথ্য ও বিবরণ হালনাগাদ',
      beforeState,
      afterState: updatedHead,
      changesSummary: `নাম/বিবরণ পরিবর্তন: [পূর্বের নাম: ${beforeState.name}] -> [নতুন নাম: ${trimmedName}] (কোড ${selectedHead.headCode} অপরিবর্তিত)`
    };

    setHeadsState((prev) => ({
      ...prev,
      [orgId]: (prev[orgId] || []).map((h) => (h.id === selectedHead.id ? updatedHead : h))
    }));

    setAuditLogsState((prev) => ({
      ...prev,
      [orgId]: [auditEntry, ...(prev[orgId] || [])]
    }));

    setIsEditModalOpen(false);
    triggerToast(`খাত '${trimmedName}' সফলভাবে হালনাগাদ করা হয়েছে (স্ট্যাবল কোড অক্ষুণ্ণ)।`);
  };

  // Open Status Change Modal
  const handleOpenStatusModal = (head: Head, nextStatus: HeadStatus) => {
    if (!verifyAction('status_change')) return;
    setSelectedHead(head);
    setTargetStatus(nextStatus);
    setStatusChangeReason('');
    setErrorMessage(null);
    setIsStatusModalOpen(true);
  };

  // Submit Status Change (Lifecycle: Active <-> Inactive -> Archived)
  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAction('status_change') || !selectedHead) return;

    if (!statusChangeReason.trim()) {
      setErrorMessage('স্ট্যাটাস পরিবর্তনের সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক।');
      return;
    }

    // Dependency Rule Check:
    // If Main Head is being Inactivated or Archived, check if it has active Sub Heads
    if (selectedHead.level === 1 && (targetStatus === 'inactive' || targetStatus === 'archived')) {
      const activeChildren = currentOrgHeads.filter(
        (h) => h.parentId === selectedHead.id && h.status === 'active'
      );
      if (activeChildren.length > 0) {
        setErrorMessage(
          `এই মূল খাতের অধীনে ${activeChildren.length}টি সক্রিয় সাব-হেড রয়েছে (${activeChildren.map((c) => c.headCode).join(', ')})। মূল খাত বন্ধ/আর্কাইভ করার পূর্বে সাব-হেডগুলো নিষ্ক্রিয় করুন।`
        );
        return;
      }
    }

    let actionType: HeadAuditLog['action'] = 'HEAD_ACTIVATED';
    if (targetStatus === 'inactive') actionType = 'HEAD_DEACTIVATED';
    if (targetStatus === 'archived') actionType = 'HEAD_ARCHIVED';

    const beforeState = { ...selectedHead };
    const updatedHead: Head = {
      ...selectedHead,
      status: targetStatus,
      isActive: targetStatus === 'active',
      updatedAt: new Date().toISOString(),
      updatedBy: currentUserRole === 'admin' ? 'System Administrator' : 'Branch Manager'
    };

    const auditEntry: HeadAuditLog = {
      id: `audit-${Date.now()}`,
      organizationId: orgId,
      headId: selectedHead.id,
      headCode: selectedHead.headCode,
      headName: selectedHead.name,
      action: actionType,
      actorUserId: `usr-${currentUserRole}`,
      actorName: currentUserRole === 'admin' ? 'অ্যাডমিন ইউজার' : 'ম্যানেজার ইউজার',
      timestamp: new Date().toISOString(),
      reason: statusChangeReason.trim(),
      beforeState,
      afterState: updatedHead,
      changesSummary: `স্ট্যাটাস পরিবর্তন: ${beforeState.status} -> ${targetStatus} (${statusChangeReason.trim()})`
    };

    setHeadsState((prev) => ({
      ...prev,
      [orgId]: (prev[orgId] || []).map((h) => (h.id === selectedHead.id ? updatedHead : h))
    }));

    setAuditLogsState((prev) => ({
      ...prev,
      [orgId]: [auditEntry, ...(prev[orgId] || [])]
    }));

    setIsStatusModalOpen(false);
    triggerToast(`খাত '${selectedHead.name}' এর স্ট্যাটাস '${targetStatus}' এ পরিবর্তিত হয়েছে।`);
  };

  // Toggle Node Expansion in Tree View
  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  // Filtered & Sorted Heads
  const filteredHeads = useMemo(() => {
    return currentOrgHeads
      .filter((head) => {
        // Search with Bengali Unicode Normalization
        if (filters.searchQuery) {
          const q = normalizeText(filters.searchQuery);
          const matchesCode = normalizeText(head.headCode).includes(q);
          const matchesName = normalizeText(head.name).includes(q);
          const matchesDesc = head.description ? normalizeText(head.description).includes(q) : false;
          if (!matchesCode && !matchesName && !matchesDesc) return false;
        }
        // Head Type
        if (filters.headType !== 'all' && head.headType !== filters.headType) return false;
        // Level
        if (filters.level !== 'all' && head.level !== filters.level) return false;
        // Status
        if (filters.status !== 'all' && head.status !== filters.status) return false;
        // Origin (System vs Custom)
        if (filters.origin === 'system' && !head.isSystemDefined) return false;
        if (filters.origin === 'custom' && head.isSystemDefined) return false;
        // Parent Filter
        if (filters.parentId !== 'all') {
          if (filters.parentId === 'main_only' && head.level !== 1) return false;
          if (filters.parentId !== 'main_only' && head.parentId !== filters.parentId) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA: string | number = a[sortField];
        let valB: string | number = b[sortField];

        if (sortField === 'createdAt') {
          valA = new Date(a.createdAt).getTime();
          valB = new Date(b.createdAt).getTime();
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (valB as string).toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [currentOrgHeads, filters, sortField, sortDirection]);

  // Paginated Slicing
  const totalPages = Math.max(1, Math.ceil(filteredHeads.length / pageSize));
  const paginatedHeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHeads.slice(start, start + pageSize);
  }, [filteredHeads, currentPage, pageSize]);

  // Helper to get Parent Name
  const getParentHead = (parentId: string | null): Head | undefined => {
    if (!parentId) return undefined;
    return currentOrgHeads.find((h) => h.id === parentId);
  };

  // Export UTF-8 CSV with Bengali BOM
  const handleExportCSV = () => {
    if (!hasPermission('export')) {
      verifyAction('create');
      return;
    }

    const headers = [
      'খাত কোড (Head Code)',
      'খাতের নাম (Head Name)',
      'টাইপ (Type)',
      'লেভেল (Level)',
      'মূল খাত (Parent Head)',
      'ধরণ (Origin)',
      'স্ট্যাটাস (Status)',
      'ক্রম (Sort Order)',
      'বিবরণ (Description)'
    ];

    const rows = filteredHeads.map((h) => {
      const parent = getParentHead(h.parentId);
      return [
        `"${h.headCode}"`,
        `"${h.name}"`,
        `"${h.headType === 'income' ? 'আয় (Income)' : 'ব্যয় (Expense)'}"`,
        `"${h.level === 1 ? 'মূল খাত (Main)' : 'সাব-হেড (Sub)'}"`,
        `"${parent ? `${parent.headCode} - ${parent.name}` : 'N/A'}"`,
        `"${h.isSystemDefined ? 'সিস্টেম নির্ধারিত' : 'কাস্টম'}"`,
        `"${h.status === 'active' ? 'সক্রিয়' : h.status === 'inactive' ? 'নিষ্ক্রিয়' : 'আর্কাইভকৃত'}"`,
        h.sortOrder,
        `"${h.description || ''}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `head_register_${currentOrg.code}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('খাত তালিকার CSV ফাইল সফলভাবে এক্সপোর্ট হয়েছে।');
  };

  return (
    <div className="space-y-6 font-body">
      {/* 1. Header & Architecture Notice */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <FolderTree className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              খাত শ্রেণি ও ব্যবস্থাপনা (Income & Expense Head Classification — Phase 4.3)
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-numeric">
              Phase 4.3 Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            টাকা কেন এসেছে বা কেন খরচ হয়েছে — আয় ও ব্যয়ের সুনির্দিষ্ট দ্বি-স্তরীয় শ্রেণি বিন্যাস ও ইন্টিগ্রেশন।
          </p>
        </div>

        {/* Top Controls: Role Switcher & Org Switcher Indicator */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Organization Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500">সমিতি:</span>
            <select
              value={orgId}
              onChange={(e) => onOrgChange && onOrgChange(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="demo-org-khurushkul">খুরুশকুল ওলামা সমিতি (DEMO-KHU-001)</option>
              <option value="org-alfalah-01">আল-ফালাহ বহুমুখী সমবায় সমিতি (ALF-001)</option>
            </select>
          </div>

          {/* RBAC Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500">ভূমিকা:</span>
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer capitalize"
            >
              <option value="admin">অ্যাডমিন (Admin - Full)</option>
              <option value="manager">ম্যানেজার (Manager - Edit)</option>
              <option value="viewer">ভিউয়ার (Viewer - ReadOnly)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Critical Domain Separation Banner */}
      <div className="bg-emerald-950 text-white p-4 rounded-2xl border border-emerald-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-800/80 rounded-xl text-emerald-200 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-700 text-emerald-100 font-numeric">
                DOMAIN SEPARATION MANDATE
              </span>
              <span className="text-sm font-bold text-emerald-100 font-heading">
                HEAD (খাত) ≠ FUND (তহবিল) ≠ ACCOUNT (হিসাব)
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
              <strong>খাত (Head):</strong> কেন টাকা এসেছে বা কেন খরচ হয়েছে (কারণ/শ্রেণি) • <strong>তহবিল (Fund):</strong> কোন উদ্দেশ্যে টাকা সংরক্ষিত • <strong>হিসাব (Account):</strong> টাকা কোথায় গচ্ছিত আছে।
              <span className="block text-emerald-300/80 text-[11px] mt-0.5">
                * Phase 4.2-এ কোনো ফাইনান্সিয়াল ট্রানজ্যাকশন, লেজার বা ব্যাংক অ্যাকাউন্ট ইমপ্লিমেন্টেশন অন্তর্ভুক্ত নয়।
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveSubTab('guide')}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shadow-xs"
        >
          <Info className="w-3.5 h-3.5" />
          <span>আর্কিটেকচার গাইড</span>
        </button>
      </div>

      {/* 3. Toast Notifications & Forbidden Error Banners */}
      {forbiddenMessage && (
        <div className="bg-rose-50 border border-rose-300 p-3.5 rounded-xl text-xs text-rose-800 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{forbiddenMessage}</span>
          </div>
          <button onClick={() => setForbiddenMessage(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Sub Navigation Tabs (Register, Tree View, Audit Log, Guide) */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('register')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'register'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>খাত রেজিস্টার ও তালিকা ({filteredHeads.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('tree')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'tree'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>হায়ারার্কি ট্রি ভিউ (Hierarchy Tree)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'audit'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>অডিট লগ ট্রেইল ({currentOrgAuditLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('guide')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'guide'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>নীতিমালা ও গাইড</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pb-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            title="CSV এক্সপোর্ট"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">CSV এক্সপোর্ট</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            title="প্রিন্ট করুন"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">প্রিন্ট</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন খাত যোগ</span>
          </button>
        </div>
      </div>

      {/* 5. TAB CONTENT: Register View */}
      {activeSubTab === 'register' && (
        <div className="space-y-4">
          {/* Internal View Switcher (সকল খাত / আয় খাত / ব্যয় খাত) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setFilters({ ...filters, headType: 'all' });
                setCurrentPage(1);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                filters.headType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>সকল খাত (All Heads)</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-numeric font-normal">
                {currentOrgHeads.length}
              </span>
            </button>

            <button
              onClick={() => {
                setFilters({ ...filters, headType: 'income' });
                setCurrentPage(1);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                filters.headType === 'income'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>আয় খাত (Income Heads)</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-numeric font-normal ${
                filters.headType === 'income' ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {currentOrgHeads.filter((h) => h.headType === 'income').length}
              </span>
            </button>

            <button
              onClick={() => {
                setFilters({ ...filters, headType: 'expense' });
                setCurrentPage(1);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                filters.headType === 'expense'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-rose-800 hover:bg-rose-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
              <span>ব্যয় খাত (Expense Heads)</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-numeric font-normal ${
                filters.headType === 'expense' ? 'bg-rose-800 text-rose-100' : 'bg-rose-100 text-rose-800'
              }`}>
                {currentOrgHeads.filter((h) => h.headType === 'expense').length}
              </span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
              {/* Search Field */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="খাত কোড বা নাম দিয়ে খুঁজুন..."
                  value={filters.searchQuery}
                  onChange={(e) => {
                    setFilters({ ...filters, searchQuery: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 transition"
                />
              </div>

              {/* Head Type Filter */}
              <div>
                <select
                  value={filters.headType}
                  onChange={(e) => {
                    setFilters({ ...filters, headType: e.target.value as any });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden text-slate-700 font-medium cursor-pointer"
                >
                  <option value="all">সব টাইপ (আয় ও ব্যয়)</option>
                  <option value="income">আয় খাত (Income)</option>
                  <option value="expense">ব্যয় খাত (Expense)</option>
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <select
                  value={filters.level}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      level: e.target.value === 'all' ? 'all' : (Number(e.target.value) as HeadLevel)
                    });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden text-slate-700 font-medium cursor-pointer"
                >
                  <option value="all">সব লেভেল (Main & Sub)</option>
                  <option value="1">মূল খাত (Level 1)</option>
                  <option value="2">সাব-হেড (Level 2)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value as any });
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden text-slate-700 font-medium cursor-pointer"
                >
                  <option value="all">সব স্ট্যাটাস</option>
                  <option value="active">সক্রিয় (Active)</option>
                  <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                  <option value="archived">আর্কাইভকৃত (Archived)</option>
                </select>
              </div>
            </div>

            {/* Filter Pills & Fast Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">উৎস:</span>
                {(['all', 'system', 'custom'] as const).map((origin) => (
                  <button
                    key={origin}
                    onClick={() => {
                      setFilters({ ...filters, origin });
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      filters.origin === origin
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {origin === 'all' ? 'সব' : origin === 'system' ? 'সিস্টেম নির্ধারিত' : 'কাস্টম'}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">সাজান:</span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as any)}
                  className="bg-transparent text-slate-700 font-medium focus:outline-hidden cursor-pointer"
                >
                  <option value="headCode">খাত কোড অনুযায়ী</option>
                  <option value="name">খাতের নাম অনুযায়ী</option>
                  <option value="headType">খাতের ধরন অনুযায়ী</option>
                  <option value="level">খাতের স্তর অনুযায়ী</option>
                  <option value="sortOrder">ক্রম অনুযায়ী</option>
                  <option value="createdAt">তৈরির তারিখ অনুযায়ী</option>
                  <option value="status">স্ট্যাটাস অনুযায়ী</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                  title="ক্রমানুসার পরিবর্তন"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-3 text-center">ক্রম</th>
                  <th className="py-3 px-4">খাত কোড</th>
                  <th className="py-3 px-4">খাতের নাম ও বিবরণ</th>
                  <th className="py-3 px-3">ধরন</th>
                  <th className="py-3 px-3">স্তর</th>
                  <th className="py-3 px-3">মূল খাত</th>
                  <th className="py-3 px-3">উৎস</th>
                  <th className="py-3 px-3">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedHeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <FolderTree className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                      <p className="font-semibold text-slate-600">কোনো খাত খুঁজে পাওয়া যায়নি</p>
                      <p className="text-[11px] text-slate-400 mt-1">অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
                    </td>
                  </tr>
                ) : (
                  paginatedHeads.map((head, idx) => {
                    const parent = getParentHead(head.parentId);
                    return (
                      <tr key={head.id} className="hover:bg-slate-50/80 transition">
                        {/* Serial Number */}
                        <td className="py-3 px-3 text-center font-mono text-slate-500 font-numeric">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>

                        {/* Code */}
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">
                            {head.headCode}
                          </span>
                        </td>

                        {/* Name & Desc */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {head.level === 2 && (
                              <span className="text-slate-400 font-normal">↳</span>
                            )}
                            <span>{head.name}</span>
                          </div>
                          {head.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {head.description}
                            </p>
                          )}
                        </td>

                        {/* Type */}
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              head.headType === 'income'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {head.headType === 'income' ? 'আয় (Income)' : 'ব্যয় (Expense)'}
                          </span>
                        </td>

                        {/* Level & Parent */}
                        <td className="py-3 px-3">
                          {head.level === 1 ? (
                            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              প্রধান খাত (Level 1)
                            </span>
                          ) : (
                            <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-[11px]">
                              উপ-খাত (Level 2)
                            </span>
                          )}
                        </td>

                        {/* Parent Head */}
                        <td className="py-3 px-3">
                          {head.level === 2 && parent ? (
                            <div className="text-[11px]">
                              <span className="font-medium text-slate-800">{parent.name}</span>
                              <span className="block text-[10px] text-slate-500 font-mono">
                                {parent.headCode}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono">—</span>
                          )}
                        </td>

                        {/* Origin */}
                        <td className="py-3 px-3">
                          {head.isSystemDefined ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>সিস্টেম</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                              কাস্টম
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              head.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : head.status === 'inactive'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {head.status === 'active'
                              ? 'সক্রিয়'
                              : head.status === 'inactive'
                              ? 'নিষ্ক্রিয়'
                              : 'আর্কাইভকৃত'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(head)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="সম্পাদনা করুন"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Status Change Action Menu */}
                            {head.status === 'active' ? (
                              <button
                                onClick={() => handleOpenStatusModal(head, 'inactive')}
                                className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                                title="নিষ্ক্রিয় করুন"
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                            ) : head.status === 'inactive' ? (
                              <>
                                <button
                                  onClick={() => handleOpenStatusModal(head, 'active')}
                                  className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                                  title="পুনরায় সক্রিয় করুন"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenStatusModal(head, 'archived')}
                                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                                  title="আর্কাইভ করুন"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (Touch Target >= 48px compliant) */}
          <div className="md:hidden space-y-3">
            {paginatedHeads.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
                <FolderTree className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600 text-xs">কোনো খাত খুঁজে পাওয়া যায়নি</p>
              </div>
            ) : (
              paginatedHeads.map((head) => {
                const parent = getParentHead(head.parentId);
                return (
                  <div key={head.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {head.headCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              head.headType === 'income'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {head.headType === 'income' ? 'আয়' : 'ব্যয়'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1.5">{head.name}</h4>
                        {head.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{head.description}</p>
                        )}
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                          head.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : head.status === 'inactive'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {head.status === 'active' ? 'সক্রিয়' : head.status === 'inactive' ? 'নিষ্ক্রিয়' : 'আর্কাইভ'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
                      <span>লেভেল: {head.level === 1 ? 'মূল খাত' : `সাব-হেড (${parent?.headCode || 'N/A'})`}</span>
                      <span>উৎস: {head.isSystemDefined ? 'সিস্টেম' : 'কাস্টম'}</span>
                    </div>

                    {/* Mobile Touch Action Row (min height 48px) */}
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                      <button
                        onClick={() => handleOpenEditModal(head)}
                        className="min-h-[44px] px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>এডিট</span>
                      </button>
                      {head.status === 'active' ? (
                        <button
                          onClick={() => handleOpenStatusModal(head, 'inactive')}
                          className="min-h-[44px] px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>নিষ্ক্রিয়</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenStatusModal(head, 'active')}
                          className="min-h-[44px] px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>সক্রিয়</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
              <span className="text-slate-500">
                পৃষ্ঠা {currentPage} / {totalPages} (মোট {filteredHeads.length} টি খাত)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                >
                  পূর্ববর্তী
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg font-semibold ${
                      currentPage === i + 1
                        ? 'bg-emerald-700 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                >
                  পরবর্তী
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB CONTENT: Hierarchy Tree View */}
      {activeSubTab === 'tree' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-emerald-700" />
                <span>দ্বি-স্তরীয় খাতের হায়ারার্কি কাঠামো (Main Head → Sub Head)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                আয় ও ব্যয়ের মূল খাতের অধীনে বিন্যস্ত সাব-হেডসমূহের ভিজ্যুয়াল বৃক্ষরেখা।
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => {
                  const allKeys: Record<string, boolean> = { 'tree-inc': true, 'tree-exp': true };
                  currentOrgHeads.forEach((h) => (allKeys[h.id] = true));
                  setExpandedNodes(allKeys);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
              >
                সব প্রসারিত করুন
              </button>
              <button
                onClick={() => setExpandedNodes({})}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
              >
                সব সঙ্কুচিত করুন
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Income Tree Branch */}
            <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50/30">
              <div
                onClick={() => toggleNode('tree-inc')}
                className="flex items-center gap-2 cursor-pointer font-bold text-emerald-900 text-sm select-none"
              >
                {expandedNodes['tree-inc'] ? (
                  <ChevronDown className="w-4 h-4 text-emerald-700" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-emerald-700" />
                )}
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                <span>আয় খাতসমূহ (Income Heads)</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-numeric font-normal">
                  {currentOrgHeads.filter((h) => h.headType === 'income').length} টি খাত
                </span>
              </div>

              {expandedNodes['tree-inc'] && (
                <div className="ml-6 mt-3 space-y-3 border-l-2 border-emerald-300 pl-4">
                  {currentOrgHeads
                    .filter((h) => h.headType === 'income' && h.level === 1)
                    .map((mainHead) => {
                      const children = currentOrgHeads.filter((c) => c.parentId === mainHead.id);
                      const isExpanded = expandedNodes[mainHead.id] ?? true;

                      return (
                        <div key={mainHead.id} className="space-y-2">
                          <div
                            onClick={() => toggleNode(mainHead.id)}
                            className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 shadow-2xs cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2">
                              {children.length > 0 ? (
                                isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-slate-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-500" />
                                )
                              ) : (
                                <span className="w-4" />
                              )}
                              <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                {mainHead.headCode}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{mainHead.name}</span>
                              <span className="text-[10px] text-slate-400">({children.length} টি সাব-হেড)</span>
                            </div>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                mainHead.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {mainHead.status}
                            </span>
                          </div>

                          {/* Sub Heads */}
                          {isExpanded && children.length > 0 && (
                            <div className="ml-8 space-y-1.5 border-l border-slate-300 pl-3">
                              {children.map((child) => (
                                <div
                                  key={child.id}
                                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs hover:bg-emerald-50/50 transition border border-slate-200/60"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-400 font-mono">↳</span>
                                    <span className="font-mono text-[11px] font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                      {child.headCode}
                                    </span>
                                    <span className="font-medium text-slate-800">{child.name}</span>
                                    {child.description && (
                                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                                        — {child.description}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500">
                                      {child.isSystemDefined ? 'সিস্টেম' : 'কাস্টম'}
                                    </span>
                                    <span
                                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                                        child.status === 'active'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {child.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Expense Tree Branch */}
            <div className="border border-rose-200 rounded-2xl p-4 bg-rose-50/30">
              <div
                onClick={() => toggleNode('tree-exp')}
                className="flex items-center gap-2 cursor-pointer font-bold text-rose-900 text-sm select-none"
              >
                {expandedNodes['tree-exp'] ? (
                  <ChevronDown className="w-4 h-4 text-rose-700" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-rose-700" />
                )}
                <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
                <span>ব্যয় খাতসমূহ (Expense Heads)</span>
                <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-numeric font-normal">
                  {currentOrgHeads.filter((h) => h.headType === 'expense').length} টি খাত
                </span>
              </div>

              {expandedNodes['tree-exp'] && (
                <div className="ml-6 mt-3 space-y-3 border-l-2 border-rose-300 pl-4">
                  {currentOrgHeads
                    .filter((h) => h.headType === 'expense' && h.level === 1)
                    .map((mainHead) => {
                      const children = currentOrgHeads.filter((c) => c.parentId === mainHead.id);
                      const isExpanded = expandedNodes[mainHead.id] ?? true;

                      return (
                        <div key={mainHead.id} className="space-y-2">
                          <div
                            onClick={() => toggleNode(mainHead.id)}
                            className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 hover:border-rose-300 shadow-2xs cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2">
                              {children.length > 0 ? (
                                isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-slate-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-500" />
                                )
                              ) : (
                                <span className="w-4" />
                              )}
                              <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                {mainHead.headCode}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{mainHead.name}</span>
                              <span className="text-[10px] text-slate-400">({children.length} টি সাব-হেড)</span>
                            </div>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                mainHead.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {mainHead.status}
                            </span>
                          </div>

                          {/* Sub Heads */}
                          {isExpanded && children.length > 0 && (
                            <div className="ml-8 space-y-1.5 border-l border-slate-300 pl-3">
                              {children.map((child) => (
                                <div
                                  key={child.id}
                                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs hover:bg-rose-50/50 transition border border-slate-200/60"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-400 font-mono">↳</span>
                                    <span className="font-mono text-[11px] font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                      {child.headCode}
                                    </span>
                                    <span className="font-medium text-slate-800">{child.name}</span>
                                    {child.description && (
                                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                                        — {child.description}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500">
                                      {child.isSystemDefined ? 'সিস্টেম' : 'কাস্টম'}
                                    </span>
                                    <span
                                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                                        child.status === 'active'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {child.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: Audit Log Timeline */}
      {activeSubTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-700" />
              <span>খাত অপরিবর্তনীয় অডিট লগ (Immutable Head Audit Trail)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              খাত সৃষ্টি, সংশোধন, সক্রিয়/নিষ্ক্রিয়করণ ও আর্কাইভ সংক্রান্ত প্রতিটি ক্রিয়াকলাপের অপরিবর্তনীয় রেকর্ড।
            </p>
          </div>

          {currentOrgAuditLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              কোনো অডিট রেকর্ড পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-3">
              {currentOrgAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          log.action === 'HEAD_CREATED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'HEAD_UPDATED'
                            ? 'bg-blue-100 text-blue-800'
                            : log.action === 'HEAD_ACTIVATED'
                            ? 'bg-teal-100 text-teal-800'
                            : log.action === 'HEAD_DEACTIVATED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="font-mono font-bold text-slate-800">{log.headCode}</span>
                      <span className="font-bold text-slate-900">{log.headName}</span>
                    </div>
                    {log.changesSummary && (
                      <p className="text-slate-600 text-[11px]">{log.changesSummary}</p>
                    )}
                    {log.reason && (
                      <p className="text-slate-500 text-[10px] italic">কারণ: {log.reason}</p>
                    )}
                  </div>

                  <div className="text-right sm:text-right shrink-0 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 block">{log.actorName}</span>
                    <span>{new Date(log.timestamp).toLocaleString('bn-BD')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. TAB CONTENT: Domain Guide & Rules */}
      {activeSubTab === 'guide' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base font-heading flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              <span>খাত ব্যবস্থাপনা ও ৩-মাত্রিক হিসাব বিজ্ঞান ডোমেন মডেল</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ইসলামিক সমবায় অ্যাকাউন্টিংয়ের মৌলিক আর্কিটেকচারাল পলিসি ও নিয়মাবলী।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-emerald-700" />
                <span>১. খাত (Head) — কেন?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                অর্থের আগমন বা ব্যয়ের সুনির্দিষ্ট কারণ/উদ্দেশ্যহীন অর্থনৈতিক প্রকৃতি। যেমন: নতুন সদস্য ভর্তি ফি, মাসিক চাঁদা, অফিস ভাড়া, বিদ্যুৎ বিল।
              </p>
              <div className="bg-white p-2 rounded border border-emerald-200 text-[11px] text-emerald-800 font-semibold">
                * কোনো ব্যালেন্স বা টাকা ধারণ করে না।
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
              <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-700" />
                <span>২. তহবিল (Fund) — কোন উদ্দেশ্যে?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                কোন সুনির্দিষ্ট বিধিবদ্ধ শ্রেণি বা উন্নয়ন উদ্দেশ্যের অধীনে অর্থ বরাদ্দ রাখা হয়েছে। যেমন: সাধারণ তহবিল, উন্নয়ন তহবিল, রিজার্ভ ফান্ড।
              </p>
              <div className="bg-white p-2 rounded border border-blue-200 text-[11px] text-blue-800 font-semibold">
                * অর্থের উদ্দেশ্যগত অবস্থান নির্দেশ করে।
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>৩. হিসাব (Account) — কোথায়?</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                অর্থ বাস্তবিকভাবে কোথায় গচ্ছিত রয়েছে। যেমন: প্রধান ক্যাশ বাক্স, ইসলামী ব্যাংক সঞ্চয়ী হিসাব নং ১২৩, আল-আরাফাহ চলতি হিসাব।
              </p>
              <div className="bg-white p-2 rounded border border-amber-200 text-[11px] text-amber-800 font-semibold">
                * বাস্তব নগদ/ব্যাংক তারল্য নির্দেশ করে।
              </div>
            </div>
          </div>

          {/* Business Rules Checklist */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800">Phase 4.2 বাস্তবায়িত পলিসি সমূহ:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>Head Type Immutability:</strong> একটি খাত শুধুমাত্র আয় (Income) অথবা ব্যয় (Expense) হতে পারবে; উভয় টাইপ হওয়া নিষিদ্ধ।</li>
              <li><strong>Strict Hierarchy Consistency:</strong> Sub Head অবশ্যই তার Parent Main Head-এর সমগোত্রীয় টাইপ (Income বা Expense) হতে হবে।</li>
              <li><strong>Stable Code Policy:</strong> খাত সৃষ্টির পর কোড সম্পূর্ণ অপরিবর্তনীয় (Immutable); নাম বা বিবরণ সংশোধন হলেও পূর্বে ব্যবহৃত রেফারেন্স সুরক্ষিত থাকে।</li>
              <li><strong>Zero Hard Delete:</strong> কোনো খাত স্থায়ীভাবে মুছে ফেলা যায় না; নিষ্ক্রিয় বা আর্কাইভ করা হয়।</li>
              <li><strong>Parent Dependency Check:</strong> সক্রিয় সাব-হেড বিদ্যমান থাকা অবস্থায় মূল খাত সরাসরি নিষ্ক্রিয়/আর্কাইভ করা অবরুদ্ধ।</li>
              <li><strong>Multi-tenant Isolation:</strong> খুরুশকুল সমিতির কোড ও আল-ফালাহ সমিতির কোড সম্পূর্ণ স্বাধীন এবং ক্রস-অর্গ অ্যাক্সেস নিষিদ্ধ।</li>
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. CREATE HEAD MODAL                                                      */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">নতুন খাত সংযোজন (Create Head)</h3>
                  <p className="text-[11px] text-slate-500">সমিতি: {currentOrg.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-300 p-3 rounded-xl text-xs text-rose-800 my-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              {/* Head Type Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  ১. খাতের ধরন (Head Type) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      formType === 'income'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="formType"
                      value="income"
                      checked={formType === 'income'}
                      onChange={() => handleFormTypeChange('income')}
                      className="text-emerald-700 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      <span>আয় (Income)</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      formType === 'expense'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="formType"
                      value="expense"
                      checked={formType === 'expense'}
                      onChange={() => handleFormTypeChange('expense')}
                      className="text-rose-700 focus:ring-rose-500"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                      <span>ব্যয় (Expense)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Head Level Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  ২. খাতের স্তর (Head Level) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      formLevel === 1
                        ? 'bg-slate-100 border-slate-400 text-slate-900 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="formLevel"
                      value="1"
                      checked={formLevel === 1}
                      onChange={() => handleFormLevelChange(1)}
                      className="text-emerald-700 focus:ring-emerald-500"
                    />
                    <span>প্রধান খাত (Level 1)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      formLevel === 2
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="formLevel"
                      value="2"
                      checked={formLevel === 2}
                      onChange={() => handleFormLevelChange(2)}
                      className="text-indigo-700 focus:ring-indigo-500"
                    />
                    <span>উপ-খাত (Level 2)</span>
                  </label>
                </div>
              </div>

              {/* If Sub Head, select Parent */}
              {formLevel === 2 && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ৩. অভিভাবক প্রধান খাত (Parent Main Head) *
                  </label>
                  <select
                    value={formParentId}
                    onChange={(e) => handleFormParentChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                  >
                    <option value="">-- মূল খাত নির্বাচন করুন --</option>
                    {availableParentHeads.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.headCode} - {p.name}
                      </option>
                    ))}
                  </select>
                  {availableParentHeads.length === 0 && (
                    <p className="text-[11px] text-amber-600 mt-1">
                      * এই টাইপের অধীনে কোনো সক্রিয় প্রধান খাত পাওয়া যায়নি। প্রথমে একটি প্রধান খাত তৈরি করুন।
                    </p>
                  )}
                </div>
              )}

              {/* Head Code */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  খাত কোড (Head Code) *
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    (সৃষ্টির পর অপরিবর্তনীয় ও ইউনিক)
                  </span>
                </label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="যেমন: INC-001 বা EXP-001-01"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono font-bold uppercase"
                />
              </div>

              {/* Head Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">খাতের নাম (Head Name) *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="যেমন: নতুন সদস্য ভর্তি ফি বা অফিস ভাড়া"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">বিবরণ (Description)</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="খাত সংক্রান্ত অতিরিক্ত বিবরণ..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ক্রম নম্বর (Sort Order)</label>
                <input
                  type="number"
                  min="1"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. EDIT HEAD MODAL (Name, Description, Sort Order only; Code & Type locked) */}
      {/* ========================================================================= */}
      {isEditModalOpen && selectedHead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">খাত তথ্য সম্পাদনা (Edit Head)</h3>
                  <p className="text-[11px] text-slate-500">কোড: {selectedHead.headCode}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-300 p-3 rounded-xl text-xs text-rose-800 my-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4 text-xs">
              {/* Immutable Attributes Card */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    লকড বৈশিষ্ট্যসমূহ (Immutable Attributes):
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>অপরিবর্তনীয়</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">খাত কোড:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedHead.headCode}</span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">খাতের ধরন:</span>
                    <span className={`font-bold ${selectedHead.headType === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {selectedHead.headType === 'income' ? 'আয় (Income)' : 'ব্যয় (Expense)'}
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">খাতের স্তর:</span>
                    <span className="font-bold text-slate-800">
                      {selectedHead.level === 1 ? 'প্রধান খাত (Level 1)' : 'উপ-খাত (Level 2)'}
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">মূল অভিভাবক:</span>
                    <span className="font-medium text-slate-700">
                      {selectedHead.level === 2 ? (getParentHead(selectedHead.parentId)?.headCode || 'N/A') : 'প্রযোজ্য নয়'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Head Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">খাতের নাম (Head Name) *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">বিবরণ (Description)</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ক্রম নম্বর (Sort Order)</label>
                <input
                  type="number"
                  min="1"
                  value={editSortOrder}
                  onChange={(e) => setEditSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  আপডেট সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. STATUS CHANGE MODAL                                                   */}
      {/* ========================================================================= */}
      {isStatusModalOpen && selectedHead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                  <Power className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">খাত স্ট্যাটাস পরিবর্তন</h3>
                  <p className="text-[11px] text-slate-500">কোড: {selectedHead.headCode}</p>
                </div>
              </div>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-300 p-3 rounded-xl text-xs text-rose-800 my-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleStatusSubmit} className="space-y-4 mt-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="text-slate-600">খাতের নাম: <strong className="text-slate-900">{selectedHead.name}</strong></div>
                <div className="text-slate-600">বর্তমান স্ট্যাটাস: <span className="font-semibold text-slate-800">{selectedHead.status}</span></div>
                <div className="text-slate-600">প্রস্তাবিত স্ট্যাটাস: <strong className="text-amber-700 uppercase">{targetStatus}</strong></div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  স্ট্যাটাস পরিবর্তনের কারণ (Reason) *
                </label>
                <textarea
                  value={statusChangeReason}
                  onChange={(e) => setStatusChangeReason(e.target.value)}
                  placeholder="অডিটের সুবিধার্থে সুনির্দিষ্ট কারণ লিখুন..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  স্ট্যাটাস নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. OFFICIAL PRINT VIEW MODAL                                             */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <h2 className="text-xl font-bold text-slate-900">{currentOrg.name}</h2>
              <p className="text-xs text-slate-600">ইসলামি মূল্যবোধে পরিচালিত বহুমুখী সমবায় সমিতি</p>
              <h3 className="text-base font-bold text-slate-800 mt-2 bg-slate-100 inline-block px-4 py-1 rounded border border-slate-300">
                অফিসিয়াল খাত রেজিস্টার ও শ্রেণি বিন্যাস তালিকা (Head Management Register)
              </h3>
            </div>

            {/* Meta Row */}
            <div className="flex items-center justify-between text-xs text-slate-600 my-4">
              <span>মুদ্রণের তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
              <span>মোট খাত সংখ্যা: {filteredHeads.length} টি</span>
              <span>প্রতিষ্ঠানের কোড: {currentOrg.code}</span>
            </div>

            {/* Printable Table */}
            <table className="w-full text-xs text-left border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                  <th className="p-2 border-r border-slate-300">ক্র.নং</th>
                  <th className="p-2 border-r border-slate-300">খাত কোড</th>
                  <th className="p-2 border-r border-slate-300">খাতের নাম</th>
                  <th className="p-2 border-r border-slate-300">টাইপ</th>
                  <th className="p-2 border-r border-slate-300">লেভেল ও অভিভাবক</th>
                  <th className="p-2 border-r border-slate-300">উৎস</th>
                  <th className="p-2">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredHeads.map((head, idx) => {
                  const parent = getParentHead(head.parentId);
                  return (
                    <tr key={head.id}>
                      <td className="p-2 border-r border-slate-300 font-mono text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300 font-mono font-bold">{head.headCode}</td>
                      <td className="p-2 border-r border-slate-300 font-medium">{head.name}</td>
                      <td className="p-2 border-r border-slate-300">
                        {head.headType === 'income' ? 'আয় (Income)' : 'ব্যয় (Expense)'}
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        {head.level === 1 ? 'মূল খাত' : `সাব-হেড (${parent?.headCode || 'N/A'})`}
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        {head.isSystemDefined ? 'সিস্টেম' : 'কাস্টম'}
                      </td>
                      <td className="p-2 font-semibold capitalize">{head.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Official Signature Footer */}
            <div className="grid grid-cols-3 gap-4 pt-16 mt-8 text-center text-xs text-slate-700 border-t border-slate-200">
              <div>
                <div className="border-t border-slate-400 w-32 mx-auto pt-1 font-semibold">প্রস্তুতকারী</div>
                <div className="text-[10px] text-slate-500">হিসাব সহকারী</div>
              </div>
              <div>
                <div className="border-t border-slate-400 w-32 mx-auto pt-1 font-semibold">যাচাইকারী</div>
                <div className="text-[10px] text-slate-500">অডিট অফিসার</div>
              </div>
              <div>
                <div className="border-t border-slate-400 w-32 mx-auto pt-1 font-semibold">অনুমোদনকারী</div>
                <div className="text-[10px] text-slate-500">ব্যবস্থাপনা পরিচালক / সভাপতি</div>
              </div>
            </div>

            {/* Close / Trigger System Print */}
            <div className="flex items-center justify-end gap-2 pt-6 mt-4 border-t border-slate-200">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>সরাসরি প্রিন্ট</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
