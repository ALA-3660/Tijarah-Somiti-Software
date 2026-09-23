import React, { useState, useMemo } from 'react';
import {
  CreditCard,
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
  EyeOff,
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
  FolderTree,
  Wallet,
  Landmark,
  Coins,
  Link as LinkIcon
} from 'lucide-react';
import {
  Account,
  AccountType,
  AccountStatus,
  AccountFilterCriteria,
  MasterDataChangeHistoryRecord,
  GovernanceActionType,
  OrganizationContext,
  Fund
} from '../types';

interface AccountManagementViewProps {
  currentOrg: OrganizationContext;
  onOrgChange?: (orgId: string) => void;
}

// Available Funds for Association Reference
const MOCK_ORG_FUNDS: Record<string, Array<{ id: string; code: string; name: string; type: string }>> = {
  'demo-org-khurushkul': [
    { id: 'fnd-khu-01', code: 'FND-001', name: 'সাধারণ তহবিল', type: 'general' },
    { id: 'fnd-khu-02', code: 'FND-002', name: 'প্রশাসনিক ও ব্যবস্থাপনা তহবিল', type: 'administrative' },
    { id: 'fnd-khu-03', code: 'FND-003', name: 'সদস্য শেয়ার মূলধন তহবিল', type: 'share' },
    { id: 'fnd-khu-04', code: 'FND-004', name: 'কমিউনিটি উন্নয়ন প্রকল্প তহবিল', type: 'project' }
  ],
  'org-alfalah-01': [
    { id: 'fnd-alf-01', code: 'FND-001', name: 'সাধারণ পরিচালন তহবিল', type: 'general' },
    { id: 'fnd-alf-02', code: 'FND-002', name: 'সদস্য কল্যাণ তহবিল', type: 'project' }
  ]
};

// Initial Generic Seed Data (Zero Financial Balances, Free of Real Personal Information)
const INITIAL_ACCOUNTS: Record<string, Account[]> = {
  'demo-org-khurushkul': [
    {
      id: 'acc-khu-01',
      organizationId: 'demo-org-khurushkul',
      accountCode: 'ACC-001',
      accountName: 'প্রধান ক্যাশ (মূল ক্যাশবাক্স)',
      accountType: 'cash',
      accountSubtype: 'main_cash',
      description: 'সমিতির প্রধান কার্যালয়ের মূল ক্যাশবাক্স ও নগদ লেনদেন সংরক্ষণের হিসাব',
      openingBalanceSupported: true,
      isSystemDefined: true,
      status: 'active',
      sortOrder: 1,
      associatedFundIds: ['fnd-khu-01', 'fnd-khu-02', 'fnd-khu-03'],
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-01-10T09:00:00.000Z',
      createdBy: 'System Seed Initializer',
      updatedBy: 'System Seed Initializer'
    },
    {
      id: 'acc-khu-02',
      organizationId: 'demo-org-khurushkul',
      accountCode: 'ACC-002',
      accountName: 'ইসলামী ব্যাংক বাংলাদেশ সঞ্চয়ী হিসাব',
      accountType: 'bank',
      accountSubtype: 'savings',
      description: 'সমিতির প্রধান প্রাতিষ্ঠানিক ব্যাংক সঞ্চয়ী হিসাব',
      accountHolderName: 'খুরুশকুল ওলামা সমিতি',
      bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
      branchName: 'কক্সবাজার প্রধান শাখা',
      accountNumberMasked: '******4589',
      routingNumberMasked: '***123',
      openingBalanceSupported: true,
      isSystemDefined: false,
      status: 'active',
      sortOrder: 2,
      associatedFundIds: ['fnd-khu-01', 'fnd-khu-03', 'fnd-khu-04'],
      createdAt: '2026-01-12T10:30:00.000Z',
      updatedAt: '2026-01-12T10:30:00.000Z',
      createdBy: 'হিসাব সহকারী',
      updatedBy: 'হিসাব সহকারী'
    },
    {
      id: 'acc-khu-03',
      organizationId: 'demo-org-khurushkul',
      accountCode: 'ACC-003',
      accountName: 'ফার্স্ট সিকিউরিটি ইসলামী ব্যাংক চলতি হিসাব',
      accountType: 'bank',
      accountSubtype: 'current',
      description: 'সমিতির প্রকল্প ও বড় অঙ্কের প্রাতিষ্ঠানিক লেনদেন হিসাব',
      accountHolderName: 'খুরুশকুল ওলামা সমিতি',
      bankName: 'ফার্স্ট সিকিউরিটি ইসলামী ব্যাংক পিএলসি',
      branchName: 'খুরুশকুল উপশাখা',
      accountNumberMasked: '******7812',
      routingNumberMasked: '***456',
      openingBalanceSupported: true,
      isSystemDefined: false,
      status: 'active',
      sortOrder: 3,
      associatedFundIds: ['fnd-khu-01', 'fnd-khu-04'],
      createdAt: '2026-01-15T14:15:00.000Z',
      updatedAt: '2026-01-15T14:15:00.000Z',
      createdBy: 'হিসাব সহকারী',
      updatedBy: 'হিসাব সহকারী'
    },
    {
      id: 'acc-khu-04',
      organizationId: 'demo-org-khurushkul',
      accountCode: 'ACC-004',
      accountName: 'অফিস খুচরা ক্যাশ (পেটি ক্যাশ)',
      accountType: 'cash',
      accountSubtype: 'petty_cash',
      description: 'দৈনন্দিন চা-আপ্যায়ন ও স্টেশনারি খুচরা ব্যয়ের জন্য সংরক্ষিত ক্যাশ',
      openingBalanceSupported: true,
      isSystemDefined: false,
      status: 'inactive',
      sortOrder: 4,
      associatedFundIds: ['fnd-khu-02'],
      createdAt: '2026-01-20T11:00:00.000Z',
      updatedAt: '2026-02-01T09:30:00.000Z',
      createdBy: 'অফিস সহকারী',
      updatedBy: 'ম্যানেজার'
    }
  ],
  'org-alfalah-01': [
    {
      id: 'acc-alf-01',
      organizationId: 'org-alfalah-01',
      accountCode: 'ACC-001',
      accountName: 'আল-ফালাহ প্রধান ক্যাশ',
      accountType: 'cash',
      accountSubtype: 'main_cash',
      description: 'আল-ফালাহ সমিতির প্রধান নগদ হিসাব',
      openingBalanceSupported: true,
      isSystemDefined: true,
      status: 'active',
      sortOrder: 1,
      associatedFundIds: ['fnd-alf-01'],
      createdAt: '2026-01-05T09:00:00.000Z',
      updatedAt: '2026-01-05T09:00:00.000Z',
      createdBy: 'System Seed Initializer',
      updatedBy: 'System Seed Initializer'
    },
    {
      id: 'acc-alf-02',
      organizationId: 'org-alfalah-01',
      accountCode: 'ACC-002',
      accountName: 'আল-আরাফাহ ইসলামী ব্যাংক সঞ্চয়ী হিসাব',
      accountType: 'bank',
      accountSubtype: 'savings',
      description: 'মিরপুর শাখার প্রাতিষ্ঠানিক হিসাব',
      accountHolderName: 'আল-ফালাহ বহুমুখী সমবায় সমিতি',
      bankName: 'আল-আরাফাহ ইসলামী ব্যাংক পিএলসি',
      branchName: 'মিরপুর-১০ শাখা',
      accountNumberMasked: '******9921',
      routingNumberMasked: '***789',
      openingBalanceSupported: true,
      isSystemDefined: false,
      status: 'active',
      sortOrder: 2,
      associatedFundIds: ['fnd-alf-01', 'fnd-alf-02'],
      createdAt: '2026-01-08T10:00:00.000Z',
      updatedAt: '2026-01-08T10:00:00.000Z',
      createdBy: 'System Administrator',
      updatedBy: 'System Administrator'
    }
  ]
};

// Initial Governance History for Accounts
const INITIAL_ACCOUNT_HISTORY: MasterDataChangeHistoryRecord[] = [
  {
    id: 'gov-acc-001',
    organizationId: 'demo-org-khurushkul',
    entityType: 'account',
    entityId: 'acc-khu-01',
    entityCode: 'ACC-001',
    entityName: 'প্রধান ক্যাশ (মূল ক্যাশবাক্স)',
    action: 'CREATE',
    actorUserId: 'usr-sys-001',
    actorName: 'System Seed Initializer',
    actorRole: 'System Administrator',
    timestamp: '2026-01-10T09:00:00.000Z',
    reason: 'প্রাতিষ্ঠানিক নগদ অর্থ সংরক্ষণের জন্য সিস্টেম-ডিফাইন্ড মূল ক্যাশ হিসাব তৈরি।',
    effectiveFrom: '2026-01-10',
    afterState: {
      accountCode: 'ACC-001',
      accountName: 'প্রধান ক্যাশ (মূল ক্যাশবাক্স)',
      accountType: 'cash',
      status: 'active'
    },
    changedFields: ['accountCode', 'accountName', 'accountType', 'status']
  },
  {
    id: 'gov-acc-002',
    organizationId: 'demo-org-khurushkul',
    entityType: 'account',
    entityId: 'acc-khu-02',
    entityCode: 'ACC-002',
    entityName: 'ইসলামী ব্যাংক বাংলাদেশ সঞ্চয়ী হিসাব',
    action: 'CREATE',
    actorUserId: 'usr-acc-002',
    actorName: 'হিসাব সহকারী',
    actorRole: 'Accountant',
    timestamp: '2026-01-12T10:30:00.000Z',
    reason: 'কক্সবাজার প্রধান শাখায় সমিতির নামে খোলা ব্যাংকিং হিসাব সংহতকরণ।',
    effectiveFrom: '2026-01-12',
    afterState: {
      accountCode: 'ACC-002',
      accountName: 'ইসলামী ব্যাংক বাংলাদেশ সঞ্চয়ী হিসাব',
      accountType: 'bank',
      bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
      status: 'active'
    },
    changedFields: ['accountCode', 'accountName', 'accountType', 'bankName', 'status']
  },
  {
    id: 'gov-acc-003',
    organizationId: 'demo-org-khurushkul',
    entityType: 'account',
    entityId: 'acc-khu-04',
    entityCode: 'ACC-004',
    entityName: 'অফিস খুচরা ক্যাশ (পেটি ক্যাশ)',
    action: 'DEACTIVATE',
    actorUserId: 'usr-mgt-001',
    actorName: 'ম্যানেজার',
    actorRole: 'Manager',
    timestamp: '2026-02-01T09:30:00.000Z',
    reason: 'খুচরা ক্যাশ সাময়িকভাবে প্রধান ক্যাশের সাথে একীভূত করায় নিষ্ক্রিয় করা হলো।',
    effectiveFrom: '2026-02-01',
    beforeState: { status: 'active' },
    afterState: { status: 'inactive' },
    changedFields: ['status']
  }
];

export const AccountManagementView: React.FC<AccountManagementViewProps> = ({
  currentOrg,
  onOrgChange
}) => {
  // Simulated Roles: Admin, Manager, Accountant, Viewer
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'manager' | 'accountant' | 'viewer'>('admin');
  
  // Organization Scoped State
  const [accounts, setAccounts] = useState<Record<string, Account[]>>(INITIAL_ACCOUNTS);
  const [historyRecords, setHistoryRecords] = useState<MasterDataChangeHistoryRecord[]>(INITIAL_ACCOUNT_HISTORY);
  
  // Filters, Search, Sort & Pagination
  const [filterCriteria, setFilterCriteria] = useState<AccountFilterCriteria>({
    searchQuery: '',
    accountType: 'all',
    status: 'all',
    origin: 'all',
    bankName: 'all'
  });
  const [sortField, setSortField] = useState<keyof Account>('accountCode');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // UI Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  
  // Selected Item / Action States
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [bulkActionType, setBulkActionType] = useState<'ACTIVATE' | 'DEACTIVATE' | 'ARCHIVE'>('ACTIVATE');
  
  // Privacy Toggle: Sensitive Account Number Reveal
  const [revealSensitiveInfo, setRevealSensitiveInfo] = useState<boolean>(false);
  
  // Form State
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'cash' as AccountType,
    accountSubtype: 'main_cash',
    description: '',
    accountHolderName: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    routingNumber: '',
    associatedFundIds: [] as string[],
    reason: '',
    effectiveFrom: new Date().toISOString().split('T')[0]
  });
  
  // Status Modal Form State
  const [statusFormData, setStatusFormData] = useState({
    newStatus: 'active' as AccountStatus,
    reason: '',
    effectiveFrom: new Date().toISOString().split('T')[0]
  });

  // Bulk Modal Form State
  const [bulkFormData, setBulkFormData] = useState({
    reason: '',
    effectiveFrom: new Date().toISOString().split('T')[0]
  });

  // Feedback Notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // RBAC Permission Evaluator
  const permissions = useMemo(() => {
    return {
      canView: true,
      canCreate: currentUserRole === 'admin' || currentUserRole === 'manager',
      canEdit: currentUserRole === 'admin' || currentUserRole === 'manager',
      canChangeStatus: currentUserRole === 'admin' || currentUserRole === 'manager',
      canArchive: currentUserRole === 'admin',
      canBulkChange: currentUserRole === 'admin' || currentUserRole === 'manager',
      canExport: currentUserRole !== 'viewer',
      canPrint: currentUserRole !== 'viewer',
      canViewFullSensitive: currentUserRole === 'admin'
    };
  }, [currentUserRole]);

  // Current Org Accounts
  const currentOrgAccounts = useMemo(() => {
    return accounts[currentOrg.id] || [];
  }, [accounts, currentOrg.id]);

  // Current Org Available Funds
  const currentOrgFunds = useMemo(() => {
    return MOCK_ORG_FUNDS[currentOrg.id] || [];
  }, [currentOrg.id]);

  // Text Normalization for Unicode Bengali Safe Matching
  const normalizeText = (text: string = '') => {
    return text
      .normalize('NFC')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  };

  // Filtered & Sorted Accounts
  const filteredAccounts = useMemo(() => {
    let result = [...currentOrgAccounts];

    // Search
    if (filterCriteria.searchQuery && filterCriteria.searchQuery.trim() !== '') {
      const q = normalizeText(filterCriteria.searchQuery);
      result = result.filter(
        (acc) =>
          normalizeText(acc.accountName).includes(q) ||
          normalizeText(acc.accountCode).includes(q) ||
          (acc.bankName && normalizeText(acc.bankName).includes(q)) ||
          (acc.branchName && normalizeText(acc.branchName).includes(q)) ||
          (acc.accountHolderName && normalizeText(acc.accountHolderName).includes(q))
      );
    }

    // Filter Type
    if (filterCriteria.accountType && filterCriteria.accountType !== 'all') {
      result = result.filter((acc) => acc.accountType === filterCriteria.accountType);
    }

    // Filter Status
    if (filterCriteria.status && filterCriteria.status !== 'all') {
      result = result.filter((acc) => acc.status === filterCriteria.status);
    }

    // Filter Origin
    if (filterCriteria.origin && filterCriteria.origin !== 'all') {
      if (filterCriteria.origin === 'system') {
        result = result.filter((acc) => acc.isSystemDefined);
      } else {
        result = result.filter((acc) => !acc.isSystemDefined);
      }
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [currentOrgAccounts, filterCriteria, sortField, sortAsc]);

  // Pagination Slice
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAccounts.length / pageSize) || 1;

  // Next Auto Account Code Generator
  const generateNextAccountCode = () => {
    const count = currentOrgAccounts.length + 1;
    return `ACC-${String(count).padStart(3, '0')}`;
  };

  // Helper to Mask Bank Account Number
  const maskNumber = (num: string = '') => {
    if (!num) return '';
    const clean = num.replace(/\s+/g, '');
    if (clean.length <= 4) return `******${clean}`;
    return `******${clean.slice(-4)}`;
  };

  // Helper to Mask Routing Number
  const maskRouting = (num: string = '') => {
    if (!num) return '';
    const clean = num.replace(/\s+/g, '');
    if (clean.length <= 3) return `***${clean}`;
    return `***${clean.slice(-3)}`;
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    if (!permissions.canCreate) {
      showNotification('error', 'হিসাব তৈরি করার অনুমতি আপনার রোলে নেই (HTTP 403)।');
      return;
    }
    setFormData({
      accountName: '',
      accountType: 'cash',
      accountSubtype: 'main_cash',
      description: '',
      accountHolderName: currentOrg.name,
      bankName: '',
      branchName: '',
      accountNumber: '',
      routingNumber: '',
      associatedFundIds: currentOrgFunds.map((f) => f.id),
      reason: 'নতুন আর্থিক হিসাব সংরক্ষণ ও সংহতকরণ।',
      effectiveFrom: new Date().toISOString().split('T')[0]
    });
    setIsCreateModalOpen(true);
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canCreate) {
      showNotification('error', 'অনুমতি নেই।');
      return;
    }

    if (!formData.accountName.trim()) {
      showNotification('error', 'হিসাবের নাম প্রদান করা আবশ্যক।');
      return;
    }

    if (!formData.reason.trim()) {
      showNotification('error', 'হিসাব তৈরির নীতিগত কারণ প্রদান করা বাধ্যতামূলক।');
      return;
    }

    if (formData.accountType === 'bank') {
      if (!formData.bankName.trim() || !formData.accountNumber.trim()) {
        showNotification('error', 'ব্যাংকের নাম ও একাউন্ট নম্বর প্রদান করা আবশ্যক।');
        return;
      }
    }

    // Duplicate Name Prevention within Org
    const isDuplicate = currentOrgAccounts.some(
      (a) => normalizeText(a.accountName) === normalizeText(formData.accountName)
    );
    if (isDuplicate) {
      showNotification('error', 'একই নামের হিসাব এই সংগঠনে ইতোমধ্যে বিদ্যমান রয়েছে।');
      return;
    }

    const nextCode = generateNextAccountCode();
    const newAccountId = `acc-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newAccount: Account = {
      id: newAccountId,
      organizationId: currentOrg.id,
      accountCode: nextCode,
      accountName: formData.accountName.trim(),
      accountType: formData.accountType,
      accountSubtype: formData.accountSubtype,
      description: formData.description.trim(),
      accountHolderName: formData.accountType === 'bank' ? formData.accountHolderName.trim() : undefined,
      bankName: formData.accountType === 'bank' ? formData.bankName.trim() : undefined,
      branchName: formData.accountType === 'bank' ? formData.branchName.trim() : undefined,
      accountNumberMasked: formData.accountType === 'bank' ? maskNumber(formData.accountNumber) : undefined,
      routingNumberMasked: formData.accountType === 'bank' && formData.routingNumber ? maskRouting(formData.routingNumber) : undefined,
      associatedFundIds: formData.associatedFundIds,
      openingBalanceSupported: true,
      isSystemDefined: false,
      status: 'active',
      sortOrder: currentOrgAccounts.length + 1,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার',
      updatedBy: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার'
    };

    // Append-Only Governance History
    const newHistoryRecord: MasterDataChangeHistoryRecord = {
      id: `gov-acc-${Date.now()}`,
      organizationId: currentOrg.id,
      entityType: 'account',
      entityId: newAccountId,
      entityCode: nextCode,
      entityName: newAccount.accountName,
      action: 'CREATE',
      actorUserId: `usr-${currentUserRole}-01`,
      actorName: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার',
      actorRole: currentUserRole.toUpperCase(),
      timestamp: timestamp,
      reason: formData.reason.trim(),
      effectiveFrom: formData.effectiveFrom,
      afterState: { ...newAccount },
      changedFields: ['accountCode', 'accountName', 'accountType', 'status']
    };

    setAccounts((prev) => ({
      ...prev,
      [currentOrg.id]: [...(prev[currentOrg.id] || []), newAccount]
    }));

    setHistoryRecords((prev) => [newHistoryRecord, ...prev]);
    setIsCreateModalOpen(false);
    showNotification('success', `নতুন হিসাব '${newAccount.accountName}' সফলভাবে তৈরি হয়েছে (${nextCode})।`);
  };

  // Open Edit Modal
  const handleOpenEditModal = (acc: Account) => {
    if (!permissions.canEdit) {
      showNotification('error', 'হিসাব সম্পাদনার অনুমতি নেই (HTTP 403)।');
      return;
    }
    if (acc.status === 'archived') {
      showNotification('warning', 'আর্কাইভকৃত হিসাবের তথ্য পরিবর্তন করা নিষিদ্ধ।');
      return;
    }

    setSelectedAccount(acc);
    setFormData({
      accountName: acc.accountName,
      accountType: acc.accountType,
      accountSubtype: acc.accountSubtype || 'main_cash',
      description: acc.description || '',
      accountHolderName: acc.accountHolderName || '',
      bankName: acc.bankName || '',
      branchName: acc.branchName || '',
      accountNumber: '', // Keep clean for security
      routingNumber: '',
      associatedFundIds: acc.associatedFundIds || [],
      reason: '',
      effectiveFrom: new Date().toISOString().split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !permissions.canEdit) return;

    if (!formData.accountName.trim()) {
      showNotification('error', 'হিসাবের নাম প্রদান আবশ্যক।');
      return;
    }

    if (!formData.reason.trim()) {
      showNotification('error', 'সম্পাদনার নীতিগত কারণ প্রদান করা বাধ্যতামূলক।');
      return;
    }

    // Duplicate Name check excluding self
    const isDuplicate = currentOrgAccounts.some(
      (a) => a.id !== selectedAccount.id && normalizeText(a.accountName) === normalizeText(formData.accountName)
    );
    if (isDuplicate) {
      showNotification('error', 'একই নামের অপর একটি হিসাব ইতোমধ্যে বিদ্যমান রয়েছে।');
      return;
    }

    const timestamp = new Date().toISOString();
    const beforeSnapshot = { ...selectedAccount };

    const updatedAccount: Account = {
      ...selectedAccount,
      accountName: formData.accountName.trim(),
      description: formData.description.trim(),
      accountHolderName: selectedAccount.accountType === 'bank' ? formData.accountHolderName.trim() : undefined,
      bankName: selectedAccount.accountType === 'bank' ? formData.bankName.trim() : undefined,
      branchName: selectedAccount.accountType === 'bank' ? formData.branchName.trim() : undefined,
      accountNumberMasked:
        formData.accountNumber.trim() !== '' ? maskNumber(formData.accountNumber) : selectedAccount.accountNumberMasked,
      routingNumberMasked:
        formData.routingNumber.trim() !== '' ? maskRouting(formData.routingNumber) : selectedAccount.routingNumberMasked,
      associatedFundIds: formData.associatedFundIds,
      updatedAt: timestamp,
      updatedBy: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার'
    };

    // Calculate changed fields
    const changedFields: string[] = [];
    if (beforeSnapshot.accountName !== updatedAccount.accountName) changedFields.push('accountName');
    if (beforeSnapshot.description !== updatedAccount.description) changedFields.push('description');
    if (beforeSnapshot.bankName !== updatedAccount.bankName) changedFields.push('bankName');
    if (beforeSnapshot.branchName !== updatedAccount.branchName) changedFields.push('branchName');
    if (formData.accountNumber.trim() !== '') changedFields.push('accountNumberMasked');
    if (JSON.stringify(beforeSnapshot.associatedFundIds) !== JSON.stringify(updatedAccount.associatedFundIds)) {
      changedFields.push('associatedFundIds');
    }

    const newHistoryRecord: MasterDataChangeHistoryRecord = {
      id: `gov-acc-${Date.now()}`,
      organizationId: currentOrg.id,
      entityType: 'account',
      entityId: selectedAccount.id,
      entityCode: selectedAccount.accountCode,
      entityName: updatedAccount.accountName,
      action: 'UPDATE',
      actorUserId: `usr-${currentUserRole}-01`,
      actorName: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার',
      actorRole: currentUserRole.toUpperCase(),
      timestamp: timestamp,
      reason: formData.reason.trim(),
      effectiveFrom: formData.effectiveFrom,
      beforeState: beforeSnapshot,
      afterState: updatedAccount,
      changedFields: changedFields.length > 0 ? changedFields : ['updatedAt']
    };

    setAccounts((prev) => ({
      ...prev,
      [currentOrg.id]: prev[currentOrg.id].map((a) => (a.id === selectedAccount.id ? updatedAccount : a))
    }));

    setHistoryRecords((prev) => [newHistoryRecord, ...prev]);
    setIsEditModalOpen(false);
    showNotification('success', `হিসাব '${updatedAccount.accountName}' সফলভাবে হালনাগাদ করা হয়েছে।`);
  };

  // Open Status Change Modal
  const handleOpenStatusModal = (acc: Account) => {
    if (!permissions.canChangeStatus) {
      showNotification('error', 'স্ট্যাটাস পরিবর্তনের অনুমতি নেই (HTTP 403)।');
      return;
    }
    if (acc.status === 'archived') {
      showNotification('warning', 'আর্কাইভকৃত হিসাব টার্মিনাল স্টেটে রয়েছে, পরিবর্তন সম্ভব নয়।');
      return;
    }

    setSelectedAccount(acc);
    setStatusFormData({
      newStatus: acc.status === 'active' ? 'inactive' : 'active',
      reason: '',
      effectiveFrom: new Date().toISOString().split('T')[0]
    });
    setIsStatusModalOpen(true);
  };

  // Submit Status Change
  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !permissions.canChangeStatus) return;

    if (!statusFormData.reason.trim()) {
      showNotification('error', 'স্ট্যাটাস পরিবর্তনের কারণ প্রদান করা বাধ্যতামূলক।');
      return;
    }

    if (statusFormData.newStatus === 'archived' && !permissions.canArchive) {
      showNotification('error', 'হিসাব আর্কাইভ করার অনুমতি শুধুমাত্র অ্যাডমিন রোলে রয়েছে।');
      return;
    }

    const timestamp = new Date().toISOString();
    const beforeSnapshot = { ...selectedAccount };

    const updatedAccount: Account = {
      ...selectedAccount,
      status: statusFormData.newStatus,
      updatedAt: timestamp,
      updatedBy: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার'
    };

    let actionName: GovernanceActionType = 'ACTIVATE';
    if (statusFormData.newStatus === 'inactive') actionName = 'DEACTIVATE';
    if (statusFormData.newStatus === 'archived') actionName = 'ARCHIVE';

    const newHistoryRecord: MasterDataChangeHistoryRecord = {
      id: `gov-acc-${Date.now()}`,
      organizationId: currentOrg.id,
      entityType: 'account',
      entityId: selectedAccount.id,
      entityCode: selectedAccount.accountCode,
      entityName: selectedAccount.accountName,
      action: actionName,
      actorUserId: `usr-${currentUserRole}-01`,
      actorName: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার',
      actorRole: currentUserRole.toUpperCase(),
      timestamp: timestamp,
      reason: statusFormData.reason.trim(),
      effectiveFrom: statusFormData.effectiveFrom,
      beforeState: { status: beforeSnapshot.status },
      afterState: { status: updatedAccount.status },
      changedFields: ['status']
    };

    setAccounts((prev) => ({
      ...prev,
      [currentOrg.id]: prev[currentOrg.id].map((a) => (a.id === selectedAccount.id ? updatedAccount : a))
    }));

    setHistoryRecords((prev) => [newHistoryRecord, ...prev]);
    setIsStatusModalOpen(false);
    showNotification(
      'success',
      `হিসাব '${selectedAccount.accountName}'-এর স্ট্যাটাস '${statusFormData.newStatus}' করা হয়েছে।`
    );
  };

  // Open Detail 360 Modal
  const handleOpenDetailModal = (acc: Account) => {
    setSelectedAccount(acc);
    setRevealSensitiveInfo(false);
    setIsDetailModalOpen(true);
  };

  // Toggle Sensitive Banking Info Reveal with Audit Logging
  const handleToggleRevealSensitive = () => {
    if (!permissions.canViewFullSensitive || !selectedAccount) {
      showNotification('error', 'সংবেদনশীল তথ্য দেখার অনুমতি শুধুমাত্র অ্যাডমিন রোলে সংরক্ষিত (HTTP 403)।');
      return;
    }

    const willReveal = !revealSensitiveInfo;
    setRevealSensitiveInfo(willReveal);

    if (willReveal) {
      const timestamp = new Date().toISOString();
      const auditLog: MasterDataChangeHistoryRecord = {
        id: `gov-acc-reveal-${Date.now()}`,
        organizationId: currentOrg.id,
        entityType: 'account',
        entityId: selectedAccount.id,
        entityCode: selectedAccount.accountCode,
        entityName: selectedAccount.accountName,
        action: 'SENSITIVE_DATA_REVEALED',
        actorUserId: `usr-${currentUserRole}-01`,
        actorName: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার',
        actorRole: currentUserRole.toUpperCase(),
        timestamp: timestamp,
        reason: 'অনুমোদিত অ্যাডমিন কর্তৃক সংবেদনশীল ব্যাংকিং হিসাব নম্বর উন্মোচন (Security Audited)।',
        effectiveFrom: timestamp.split('T')[0],
        changedFields: ['accountNumberMasked']
      };

      setHistoryRecords((prev) => [auditLog, ...prev]);
      showNotification('warning', 'সংবেদনশীল ব্যাংক হিসাব নম্বর উন্মোচন করা হয়েছে এবং অডিট লগ সংরক্ষণ করা হয়েছে।');
    }
  };

  // Open Bulk Modal
  const handleOpenBulkModal = (action: 'ACTIVATE' | 'DEACTIVATE' | 'ARCHIVE') => {
    if (!permissions.canBulkChange) {
      showNotification('error', 'বাল্ক অপারেশনের অনুমতি নেই।');
      return;
    }
    if (selectedAccountIds.length === 0) {
      showNotification('warning', 'দয়া করে কমপক্ষে একটি হিসাব নির্বাচন করুন।');
      return;
    }
    setBulkActionType(action);
    setBulkFormData({
      reason: '',
      effectiveFrom: new Date().toISOString().split('T')[0]
    });
    setIsBulkModalOpen(true);
  };

  // Submit Bulk Action
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canBulkChange) return;

    if (!bulkFormData.reason.trim()) {
      showNotification('error', 'বাল্ক পরিবর্তনের জন্য কারণ প্রদান করা বাধ্যতামূলক।');
      return;
    }

    const timestamp = new Date().toISOString();
    let newStatus: AccountStatus = 'active';
    if (bulkActionType === 'DEACTIVATE') newStatus = 'inactive';
    if (bulkActionType === 'ARCHIVE') newStatus = 'archived';

    const affectedAccounts = currentOrgAccounts.filter((a) => selectedAccountIds.includes(a.id));
    const newHistoryEntries: MasterDataChangeHistoryRecord[] = [];

    const updatedOrgAccounts = currentOrgAccounts.map((acc) => {
      if (selectedAccountIds.includes(acc.id)) {
        if (acc.status === 'archived') return acc; // Skip terminal items

        newHistoryEntries.push({
          id: `gov-acc-bulk-${Date.now()}-${acc.id}`,
          organizationId: currentOrg.id,
          entityType: 'account',
          entityId: acc.id,
          entityCode: acc.accountCode,
          entityName: acc.accountName,
          action: `BULK_${bulkActionType}`,
          actorUserId: `usr-${currentUserRole}-01`,
          actorName: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার',
          actorRole: currentUserRole.toUpperCase(),
          timestamp: timestamp,
          reason: bulkFormData.reason.trim(),
          effectiveFrom: bulkFormData.effectiveFrom,
          beforeState: { status: acc.status },
          afterState: { status: newStatus },
          changedFields: ['status']
        });

        return {
          ...acc,
          status: newStatus,
          updatedAt: timestamp,
          updatedBy: currentUserRole === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'ম্যানেজার'
        };
      }
      return acc;
    });

    setAccounts((prev) => ({
      ...prev,
      [currentOrg.id]: updatedOrgAccounts
    }));

    setHistoryRecords((prev) => [...newHistoryEntries, ...prev]);
    setSelectedAccountIds([]);
    setIsBulkModalOpen(false);
    showNotification('success', `${affectedAccounts.length}টি হিসাবের স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে।`);
  };

  // Export CSV (UTF-8 with BOM & Masked Numbers)
  const handleExportCSV = () => {
    if (!permissions.canExport) {
      showNotification('error', 'এক্সপোর্ট করার অনুমতি নেই (HTTP 403)।');
      return;
    }

    const headers = [
      'সংগঠন',
      'হিসাব কোড',
      'হিসাবের নাম',
      'হিসাবের ধরন',
      'ব্যাংকের নাম',
      'শাখা',
      'হিসাব নম্বর (মাস্কড)',
      'স্ট্যাটাস',
      'তৈরির তারিখ'
    ];

    const rows = filteredAccounts.map((acc) => [
      currentOrg.name,
      acc.accountCode,
      `"${acc.accountName.replace(/"/g, '""')}"`,
      acc.accountType === 'cash' ? 'ক্যাশ' : 'ব্যাংক',
      acc.bankName ? `"${acc.bankName.replace(/"/g, '""')}"` : 'প্রযোজ্য নয়',
      acc.branchName ? `"${acc.branchName.replace(/"/g, '""')}"` : 'প্রযোজ্য নয়',
      acc.accountNumberMasked || 'প্রযোজ্য নয়',
      acc.status === 'active' ? 'সক্রিয়' : acc.status === 'inactive' ? 'নিষ্ক্রিয়' : 'আর্কাইভকৃত',
      acc.createdAt.split('T')[0]
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Account_Register_${currentOrg.code}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('success', 'হিসাব রেজিস্টার CSV আকারে এক্সপোর্ট করা হয়েছে।');
  };

  // Selected Account History
  const selectedAccountHistory = useMemo(() => {
    if (!selectedAccount) return [];
    return historyRecords.filter(
      (h) => h.organizationId === currentOrg.id && h.entityType === 'account' && h.entityId === selectedAccount.id
    );
  }, [selectedAccount, historyRecords, currentOrg.id]);

  return (
    <div className="space-y-6">
      {/* Scope Boundary Notification Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl mt-0.5">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-emerald-950 font-heading">
                  হিসাব ও আর্থিক অবস্থান ব্যবস্থাপনা (Account Management Foundation)
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 border border-emerald-300 font-numeric">
                  Phase 5.1 — Master Data Scope
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1 font-body leading-relaxed max-w-4xl">
                <span className="font-semibold">আর্থিক মাত্রা স্পষ্টতা:</span> <strong>Head (কেন)</strong> = টাকা কেন আসছে/যাচ্ছে | <strong>Fund (উদ্দেশ্য/শ্রেণি)</strong> = কোন উদ্দেশ্য/শ্রেণির অর্থ | <strong>Account (কোথায়)</strong> = টাকা বর্তমানে কোন আর্থিক অবস্থানে সংরক্ষিত আছে।
                <br />
                <span className="text-amber-800 font-medium">⚠️ ব্যালেন্স ও আর্থিক ট্রানজ্যাকশন ইঞ্জিন (Ledger/Voucher/Balance Engine) Phase 5.7+ এর জন্য সংরক্ষিত।</span>
              </p>
            </div>
          </div>

          {/* Role Switcher & Context */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end bg-white/80 p-1.5 rounded-xl border border-emerald-200 text-xs">
            <span className="text-slate-500 font-medium pl-1 text-[11px]">ভূমিকা:</span>
            {(['admin', 'manager', 'accountant', 'viewer'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setCurrentUserRole(r)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition capitalize ${
                  currentUserRole === r
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50'
                }`}
              >
                {r === 'admin' ? 'অ্যাডমিন' : r === 'manager' ? 'ম্যানেজার' : r === 'accountant' ? 'হিসাবরক্ষক' : 'ভিউয়ার'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-100 text-rose-900 border border-rose-200'
              : 'bg-amber-100 text-amber-900 border border-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
            {notification.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-700" />}
            {notification.type === 'warning' && <Info className="w-4 h-4 text-amber-700" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Metrics Cards (Zero Balance Engine) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">মোট হিসাব</span>
            <Landmark className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-numeric">{currentOrgAccounts.length} টি</p>
          <span className="text-[11px] text-slate-400">নিবন্ধিত আর্থিক অবস্থান</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">ক্যাশ হিসাব</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-numeric">
            {currentOrgAccounts.filter((a) => a.accountType === 'cash').length} টি
          </p>
          <span className="text-[11px] text-slate-400">নগদ ক্যাশবাক্স হিসাব</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">ব্যাংক হিসাব</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-numeric">
            {currentOrgAccounts.filter((a) => a.accountType === 'bank').length} টি
          </p>
          <span className="text-[11px] text-slate-400">প্রাতিষ্ঠানিক ব্যাংক অ্যাকাউন্ট</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">সক্রিয় হিসাব</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-emerald-700 font-numeric">
            {currentOrgAccounts.filter((a) => a.status === 'active').length} টি
          </p>
          <span className="text-[11px] text-slate-400">লেনদেন উপযোগী অবস্থান</span>
        </div>
      </div>

      {/* Main Register & Operations Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {/* Action Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">হিসাব রেজিস্টার (Account Register)</h3>
              <p className="text-xs text-slate-500">সংগঠন: {currentOrg.name} ({currentOrg.code})</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedAccountIds.length > 0 && permissions.canBulkChange && (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="px-2 text-[11px] font-semibold text-slate-600">{selectedAccountIds.length}টি নির্বাচিত:</span>
                <button
                  onClick={() => handleOpenBulkModal('ACTIVATE')}
                  className="px-2 py-1 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  এক্টিভেট
                </button>
                <button
                  onClick={() => handleOpenBulkModal('DEACTIVATE')}
                  className="px-2 py-1 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  ডি-এক্টিভেট
                </button>
                {permissions.canArchive && (
                  <button
                    onClick={() => handleOpenBulkModal('ARCHIVE')}
                    className="px-2 py-1 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
                  >
                    আর্কাইভ
                  </button>
                )}
              </div>
            )}

            {permissions.canExport && (
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition"
                title="UTF-8 CSV এক্সপোর্ট"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CSV এক্সপোর্ট</span>
              </button>
            )}

            {permissions.canPrint && (
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition"
                title="A4 প্রিন্ট ভিউ"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">প্রিন্ট</span>
              </button>
            )}

            {permissions.canCreate && (
              <button
                onClick={handleOpenCreateModal}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন হিসাব যোগ</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="হিসাবের নাম, কোড, ব্যাংকের নাম বা শাখা দিয়ে খুঁজুন..."
              value={filterCriteria.searchQuery}
              onChange={(e) => setFilterCriteria({ ...filterCriteria, searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Account Type Filter */}
          <div>
            <select
              value={filterCriteria.accountType}
              onChange={(e) => setFilterCriteria({ ...filterCriteria, accountType: e.target.value as any })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none transition font-body"
            >
              <option value="all">সকল হিসাব ধরন</option>
              <option value="cash">ক্যাশ (নগদ)</option>
              <option value="bank">ব্যাংক হিসাব</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterCriteria.status}
              onChange={(e) => setFilterCriteria({ ...filterCriteria, status: e.target.value as any })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none transition font-body"
            >
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="active">সক্রিয় (Active)</option>
              <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
              <option value="archived">আর্কাইভকৃত (Archived)</option>
            </select>
          </div>

          {/* Origin Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={filterCriteria.origin}
              onChange={(e) => setFilterCriteria({ ...filterCriteria, origin: e.target.value as any })}
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none transition font-body"
            >
              <option value="all">সকল উৎস (Origin)</option>
              <option value="system">সিস্টেম-ডিফাইন্ড</option>
              <option value="custom">কাস্টম হিসাব</option>
            </select>
            <button
              onClick={() =>
                setFilterCriteria({
                  searchQuery: '',
                  accountType: 'all',
                  status: 'all',
                  origin: 'all',
                  bankName: 'all'
                })
              }
              className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition"
              title="ফিল্টার রিসেট"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Account Table View (Desktop) & Card View (Mobile) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold font-heading">
                <th className="p-3.5 pl-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedAccounts.length > 0 &&
                      paginatedAccounts.every((a) => selectedAccountIds.includes(a.id))
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newIds = Array.from(new Set([...selectedAccountIds, ...paginatedAccounts.map((a) => a.id)]));
                        setSelectedAccountIds(newIds);
                      } else {
                        setSelectedAccountIds(
                          selectedAccountIds.filter((id) => !paginatedAccounts.some((a) => a.id === id))
                        );
                      }
                    }}
                    className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                  />
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'accountCode') setSortAsc(!sortAsc);
                    else {
                      setSortField('accountCode');
                      setSortAsc(true);
                    }
                  }}
                  className="p-3.5 cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>হিসাব কোড</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'accountName') setSortAsc(!sortAsc);
                    else {
                      setSortField('accountName');
                      setSortAsc(true);
                    }
                  }}
                  className="p-3.5 cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>হিসাবের নাম ও বিবরণ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 whitespace-nowrap">ধরন ও আর্থিক অবস্থান</th>
                <th className="p-3.5 whitespace-nowrap">ব্যাংক / শাখা / হিসাব নং</th>
                <th className="p-3.5 whitespace-nowrap">সংযুক্ত তহবিল (Funds)</th>
                <th className="p-3.5 whitespace-nowrap text-center">স্ট্যাটাস</th>
                <th className="p-3.5 pr-4 text-right whitespace-nowrap">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Landmark className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-semibold text-slate-600 text-xs">কোনো হিসাব পাওয়া যায়নি</p>
                      <p className="text-[11px] text-slate-400">ফিল্টার পরিবর্তন করুন বা নতুন হিসাব যোগ করুন।</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 transition group">
                    <td className="p-3.5 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedAccountIds.includes(acc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAccountIds([...selectedAccountIds, acc.id]);
                          } else {
                            setSelectedAccountIds(selectedAccountIds.filter((id) => id !== acc.id));
                          }
                        }}
                        className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                      />
                    </td>
                    <td className="p-3.5 font-numeric font-bold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {acc.accountCode}
                        </span>
                        {acc.isSystemDefined && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
                            title="সিস্টেম-ডিফাইন্ড মূল হিসাব"
                          >
                            System
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {acc.accountName}
                      </div>
                      {acc.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-body">{acc.description}</p>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          acc.accountType === 'cash'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {acc.accountType === 'cash' ? <Coins className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                        <span>{acc.accountType === 'cash' ? 'ক্যাশ' : 'ব্যাংক হিসাব'}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      {acc.accountType === 'bank' ? (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800">{acc.bankName}</p>
                          <p className="text-[11px] text-slate-500">{acc.branchName}</p>
                          <p className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                            হিসাব নং: {acc.accountNumberMasked}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">সংগঠনের নগদ ক্যাশবাক্স</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 flex-wrap max-w-xs">
                        {acc.associatedFundIds && acc.associatedFundIds.length > 0 ? (
                          acc.associatedFundIds.map((fId) => {
                            const fundObj = currentOrgFunds.find((f) => f.id === fId);
                            return (
                              <span
                                key={fId}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {fundObj ? fundObj.name : fId}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-slate-400 text-[11px]">কোনো তহবিল সংযুক্ত নেই</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          acc.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : acc.status === 'inactive'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {acc.status === 'active'
                          ? 'সক্রিয়'
                          : acc.status === 'inactive'
                          ? 'নিষ্ক্রিয়'
                          : 'আর্কাইভকৃত'}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenDetailModal(acc)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          title="বিস্তারিত বিবরণ ও অডিট হিস্ট্রি"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {permissions.canEdit && acc.status !== 'archived' && (
                          <button
                            onClick={() => handleOpenEditModal(acc)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {permissions.canChangeStatus && acc.status !== 'archived' && (
                          <button
                            onClick={() => handleOpenStatusModal(acc)}
                            className={`p-1.5 rounded-lg transition ${
                              acc.status === 'active'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={acc.status === 'active' ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3.5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-numeric">
            <span>প্রতি পৃষ্ঠায়:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            >
              <option value={5}>৫</option>
              <option value={10}>১০</option>
              <option value={20}>২০</option>
              <option value={50}>৫০</option>
            </select>
            <span>
              দেখাচ্ছে {filteredAccounts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} থেকে{' '}
              {Math.min(currentPage * pageSize, filteredAccounts.length)} (মোট {filteredAccounts.length} টি)
            </span>
          </div>

          <div className="flex items-center gap-1 font-numeric">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              পূর্ববর্তী
            </button>
            <span className="px-3 py-1 font-semibold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              পরবর্তী
            </button>
          </div>
        </div>
      </div>

      {/* CREATE ACCOUNT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">নতুন আর্থিক হিসাব নিবন্ধন</h3>
                  <p className="text-xs text-slate-500">সংগঠন: {currentOrg.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              {/* Account Type Selection Tabs */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">হিসাবের ধরন নির্বাচন করুন *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'cash', accountSubtype: 'main_cash' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      formData.accountType === 'cash'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Coins className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-heading text-xs">ক্যাশ (নগদ হিসাব)</p>
                      <p className="text-[10px] font-normal text-slate-500">ক্যাশবাক্স ও নগদ লেনদেন</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'bank', accountSubtype: 'savings' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      formData.accountType === 'bank'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-heading text-xs">ব্যাংক হিসাব</p>
                      <p className="text-[10px] font-normal text-slate-500">প্রাতিষ্ঠানিক ব্যাংক অ্যাকাউন্ট</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">হিসাবের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: প্রধান ক্যাশ অথবা ইসলামী ব্যাংক সঞ্চয়ী হিসাব"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 transition"
                />
              </div>

              {/* Bank Specific Fields */}
              {formData.accountType === 'bank' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>ব্যাংক ও অ্যাকাউন্টের বিবরণ</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">ব্যাংকের নাম *</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: ইসলামী ব্যাংক বাংলাদেশ পিএলসি"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">শাখার নাম</label>
                      <input
                        type="text"
                        placeholder="যেমন: কক্সবাজার প্রধান শাখা"
                        value={formData.branchName}
                        onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">অ্যাকাউন্ট নম্বর *</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: 205012345678"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                      <span className="text-[10px] text-slate-400">তালিকায় এটি স্বয়ংক্রিয়ভাবে মাস্কড থাকবে।</span>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">অ্যাকাউন্ট হোল্ডার নাম</label>
                      <input
                        type="text"
                        placeholder="সংগঠনের প্রাতিষ্ঠানিক নাম"
                        value={formData.accountHolderName}
                        onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fund Association Selector (Many-to-Many Foundation, Zero Financial Balances) */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">সংযুক্ত তহবিল (Funds) নির্বাচন করুন</label>
                <p className="text-[11px] text-slate-500 mb-2">
                  এই হিসাবে কোন কোন তহবিলের অর্থ সংরক্ষণ বা লেনদেন করা যাবে তা নির্দেশ করুন।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {currentOrgFunds.map((fund) => (
                    <label
                      key={fund.id}
                      className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.associatedFundIds.includes(fund.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              associatedFundIds: [...formData.associatedFundIds, fund.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              associatedFundIds: formData.associatedFundIds.filter((id) => id !== fund.id)
                            });
                          }
                        }}
                        className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                      />
                      <div className="text-[11px]">
                        <p className="font-semibold text-slate-800">{fund.name}</p>
                        <p className="text-[10px] text-slate-400 font-numeric">{fund.code}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">বিবরণ / ব্যবহারের উদ্দেশ্য</label>
                <textarea
                  rows={2}
                  placeholder="হিসাবের উদ্দেশ্য বা অভ্যন্তরীণ ব্যবহারের বিবরণ..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Mandatory Reason for Governance */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  হিসাব তৈরির নীতিগত কারণ (Mandatory Audit Reason) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সমিতির প্রাতিষ্ঠানিক কার্যক্রম পরিচালনায় নতুন হিসাব চালুকরণ"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ACCOUNT MODAL */}
      {isEditModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">হিসাব সম্পাদনা</h3>
                  <p className="text-xs text-slate-500 font-numeric">কোড: {selectedAccount.accountCode} (Immutable)</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              {/* Immutable Identifiers Display */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">হিসাব কোড (অপরিবর্তনীয়):</span>
                  <span className="font-bold text-slate-800 font-numeric flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    {selectedAccount.accountCode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">হিসাবের ধরন:</span>
                  <span className="font-bold text-slate-800">
                    {selectedAccount.accountType === 'cash' ? 'ক্যাশ (নগদ)' : 'ব্যাংক হিসাব'}
                  </span>
                </div>
              </div>

              {/* Mutable Account Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">হিসাবের নাম *</label>
                <input
                  type="text"
                  required
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Bank Details If Applicable */}
              {selectedAccount.accountType === 'bank' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">ব্যাংকের নাম</label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">শাখার নাম</label>
                      <input
                        type="text"
                        value={formData.branchName}
                        onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      হিসাব নম্বর পরিবর্তন (প্রয়োজন হলে নতুন নম্বর লিখুন)
                    </label>
                    <input
                      type="text"
                      placeholder={`বর্তমান: ${selectedAccount.accountNumberMasked || 'নাই'}`}
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Fund Association Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">সংযুক্ত তহবিল (Funds)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {currentOrgFunds.map((fund) => (
                    <label
                      key={fund.id}
                      className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.associatedFundIds.includes(fund.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              associatedFundIds: [...formData.associatedFundIds, fund.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              associatedFundIds: formData.associatedFundIds.filter((id) => id !== fund.id)
                            });
                          }
                        }}
                        className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                      />
                      <span className="text-[11px] text-slate-800 font-medium">{fund.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">বিবরণ</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Mandatory Reason */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  সম্পাদনার কারণ (Mandatory Audit Reason) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: হিসাবের নাম ও বিবরণ সংশোধন"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  হালনাগাদ সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS CHANGE MODAL */}
      {isStatusModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                  <Power className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">হিসাবের স্ট্যাটাস পরিবর্তন</h3>
                  <p className="text-xs text-slate-500 font-numeric">{selectedAccount.accountCode}</p>
                </div>
              </div>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                <p className="font-semibold text-slate-800">{selectedAccount.accountName}</p>
                <p className="text-slate-500">
                  বর্তমান স্ট্যাটাস:{' '}
                  <span className="font-bold capitalize">{selectedAccount.status}</span>
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">নতুন স্ট্যাটাস নির্ধারণ করুন *</label>
                <select
                  value={statusFormData.newStatus}
                  onChange={(e) => setStatusFormData({ ...statusFormData, newStatus: e.target.value as AccountStatus })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 font-body"
                >
                  <option value="active">সক্রিয় (Active)</option>
                  <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                  {permissions.canArchive && <option value="archived">আর্কাইভ (Archived - Terminal)</option>}
                </select>
                {statusFormData.newStatus === 'archived' && (
                  <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>সতর্কতা: একবার আর্কাইভ করা হলে এটি পুনরায় সক্রিয় করা যাবে না।</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  পরিবর্তনের কারণ (Mandatory Audit Reason) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="স্ট্যাটাস পরিবর্তনের নীতিগত কারণ লিখুন..."
                  value={statusFormData.reason}
                  onChange={(e) => setStatusFormData({ ...statusFormData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  স্ট্যাটাস সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL 360 & AUDIT MODAL */}
      {isDetailModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    {selectedAccount.accountName}
                  </h3>
                  <p className="text-xs text-slate-500 font-numeric">
                    কোড: {selectedAccount.accountCode} | টাইপ:{' '}
                    {selectedAccount.accountType === 'cash' ? 'ক্যাশ' : 'ব্যাংক'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Account Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 block">হিসাবের ধরন</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {selectedAccount.accountType === 'cash' ? 'ক্যাশ (নগদ)' : 'ব্যাংক হিসাব'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">স্ট্যাটাস</span>
                  <span
                    className={`font-bold capitalize ${
                      selectedAccount.status === 'active'
                        ? 'text-emerald-700'
                        : selectedAccount.status === 'inactive'
                        ? 'text-amber-700'
                        : 'text-slate-600'
                    }`}
                  >
                    {selectedAccount.status === 'active'
                      ? 'সক্রিয়'
                      : selectedAccount.status === 'inactive'
                      ? 'নিষ্ক্রিয়'
                      : 'আর্কাইভকৃত'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">উৎস (Origin)</span>
                  <span className="font-bold text-slate-800">
                    {selectedAccount.isSystemDefined ? 'সিস্টেম-ডিফাইন্ড' : 'কাস্টম হিসাব'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">তৈরির তারিখ</span>
                  <span className="font-numeric text-slate-700 font-medium">
                    {selectedAccount.createdAt.split('T')[0]}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">তৈরি করেছেন</span>
                  <span className="text-slate-700 font-medium">{selectedAccount.createdBy}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">সর্বশেষ পরিবর্তন</span>
                  <span className="font-numeric text-slate-700 font-medium">
                    {selectedAccount.updatedAt.split('T')[0]}
                  </span>
                </div>
              </div>

              {/* Bank Details & Sensitive Data Reveal Section */}
              {selectedAccount.accountType === 'bank' && (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-700" />
                      <span>ব্যাংকিং বিবরণ ও নিরাপত্তা</span>
                    </p>
                    {permissions.canViewFullSensitive && (
                      <button
                        onClick={handleToggleRevealSensitive}
                        className="px-2 py-1 bg-white border border-blue-300 text-blue-800 rounded-lg text-[10px] font-semibold flex items-center gap-1 hover:bg-blue-50 transition"
                      >
                        {revealSensitiveInfo ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{revealSensitiveInfo ? 'নম্বর মাস্ক করুন' : 'সম্পূর্ণ নম্বর দেখুন (অডিট সুরক্ষিত)'}</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500 block">ব্যাংকের নাম:</span>
                      <span className="font-semibold text-slate-800">{selectedAccount.bankName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">শাখার নাম:</span>
                      <span className="font-semibold text-slate-800">{selectedAccount.branchName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">হিসাব নম্বর:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-blue-200 inline-block">
                        {revealSensitiveInfo ? '205012345678 (Demo Full)' : selectedAccount.accountNumberMasked}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">অ্যাকাউন্ট হোল্ডার:</span>
                      <span className="font-semibold text-slate-800">{selectedAccount.accountHolderName}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Associated Funds */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-700" />
                  <span>সংযুক্ত তহবিল তালিকা (Associated Funds)</span>
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedAccount.associatedFundIds && selectedAccount.associatedFundIds.length > 0 ? (
                    selectedAccount.associatedFundIds.map((fId) => {
                      const fundObj = currentOrgFunds.find((f) => f.id === fId);
                      return (
                        <div
                          key={fId}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-[11px]"
                        >
                          <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                          <div>
                            <p className="font-semibold text-slate-800">{fundObj ? fundObj.name : fId}</p>
                            <p className="text-[10px] text-slate-400 font-numeric">{fundObj ? fundObj.code : ''}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-400 text-xs">কোনো তহবিল সংযুক্ত করা হয়নি।</p>
                  )}
                </div>
              </div>

              {/* Audit & Governance History Timeline */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-600" />
                  <span>পরিবর্তন ও গভর্নেন্স অডিট ইতিহাস</span>
                </h4>

                {selectedAccountHistory.length === 0 ? (
                  <p className="text-slate-400 text-xs p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    এই হিসাবের কোনো পূর্ববর্তী ইতিহাস রেকর্ড নেই।
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedAccountHistory.map((h) => (
                      <div
                        key={h.id}
                        className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1 text-[11px]"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              h.action === 'CREATE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : h.action === 'UPDATE'
                                ? 'bg-blue-100 text-blue-800'
                                : h.action === 'DEACTIVATE'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {h.action}
                          </span>
                          <span className="font-numeric text-slate-400 text-[10px]">
                            {new Date(h.timestamp).toLocaleString('bn-BD')}
                          </span>
                        </div>
                        <p className="text-slate-800">
                          <span className="font-semibold">কারণ:</span> {h.reason}
                        </p>
                        <p className="text-slate-500 text-[10px]">
                          ব্যবহারকারী: {h.actorName} ({h.actorRole}) | কার্যকারী তারিখ: {h.effectiveFrom}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold transition"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK GOVERNANCE MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    বাল্ক হিসাব পরিচালনা ({bulkActionType})
                  </h3>
                  <p className="text-xs text-slate-500">{selectedAccountIds.length}টি হিসাব নির্বাচিত</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
                <p className="font-semibold text-slate-800">অ্যাকশন: {bulkActionType}</p>
                <p className="text-slate-500">
                  নির্বাচিত সকল হিসাবে এই স্ট্যাটাস প্রয়োগ করা হবে এবং প্রতিটি হিসাবের জন্য পৃথক অডিট লগ তৈরি হবে।
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  বাল্ক পরিবর্তনের নীতিগত কারণ (Mandatory Audit Reason) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বার্ষিক পর্যালোচনা অনুযায়ী নিষ্ক্রিয়করণ"
                  value={bulkFormData.reason}
                  onChange={(e) => setBulkFormData({ ...bulkFormData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* A4 PRINT VIEW MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-100 print:hidden">
              <span className="font-bold text-xs text-slate-700">A4 প্রিন্ট প্রিভিউ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>মুদ্রণ করুন</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Letterhead Printable Content */}
            <div className="p-8 space-y-6 text-xs bg-white" id="printable-account-register">
              {/* Organization Letterhead Pad */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h1 className="text-xl font-bold text-slate-900 font-heading">{currentOrg.name}</h1>
                <p className="text-xs text-slate-600 mt-1">{currentOrg.address} | ফোন: {currentOrg.phone}</p>
                <p className="text-[11px] font-numeric text-slate-500 mt-0.5">রেজিস্ট্রেশন নং: {currentOrg.regNumber}</p>
                <div className="mt-3 inline-block px-4 py-1 bg-slate-100 rounded-full border border-slate-300 font-bold text-slate-800 text-xs">
                  প্রাতিষ্ঠানিক হিসাব রেজিস্টার প্রতিবেদন (Account Register Report)
                </div>
              </div>

              {/* Report Meta Info */}
              <div className="flex items-center justify-between text-[11px] text-slate-600 border-b border-slate-200 pb-2">
                <span>প্রতিবেদন তৈরির তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
                <span>মোট হিসাব সংখ্যা: {filteredAccounts.length} টি</span>
                <span>প্রস্তুতকারী: {currentUserRole.toUpperCase()}</span>
              </div>

              {/* Data Table */}
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-800 text-slate-900 font-bold">
                    <th className="py-2">কোড</th>
                    <th className="py-2">হিসাবের নাম</th>
                    <th className="py-2">ধরন</th>
                    <th className="py-2">ব্যাংক ও শাখা</th>
                    <th className="py-2">হিসাব নং (মাস্কড)</th>
                    <th className="py-2 text-center">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAccounts.map((a) => (
                    <tr key={a.id}>
                      <td className="py-2 font-numeric font-bold">{a.accountCode}</td>
                      <td className="py-2">{a.accountName}</td>
                      <td className="py-2">{a.accountType === 'cash' ? 'ক্যাশ' : 'ব্যাংক'}</td>
                      <td className="py-2">{a.bankName ? `${a.bankName} (${a.branchName || ''})` : 'প্রযোজ্য নয়'}</td>
                      <td className="py-2 font-mono">{a.accountNumberMasked || 'প্রযোজ্য নয়'}</td>
                      <td className="py-2 text-center">
                        {a.status === 'active' ? 'সক্রিয়' : a.status === 'inactive' ? 'নিষ্ক্রিয়' : 'আর্কাইভকৃত'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Dual Signature Block */}
              <div className="pt-16 grid grid-cols-2 gap-12 text-center text-xs">
                <div className="border-t border-slate-400 pt-1.5">
                  <p className="font-bold text-slate-800">হিসাব সহকারী / ক্যাশিয়ার</p>
                  <p className="text-[10px] text-slate-500">স্বাক্ষর ও তারিখ</p>
                </div>
                <div className="border-t border-slate-400 pt-1.5">
                  <p className="font-bold text-slate-800">সভাপতি / সাধারণ সম্পাদক</p>
                  <p className="text-[10px] text-slate-500">অনুমোদনকারীর স্বাক্ষর ও সিল</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AccountManagementView;
