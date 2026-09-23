import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  AlertTriangle,
  Info,
  Clock,
  UserCheck,
  UserX,
  Lock,
  ArrowRight,
  Landmark,
  Wallet,
  FolderTree,
  Coins,
  RefreshCw,
  FileText
} from 'lucide-react';
import {
  FinancialTransaction,
  TransactionType,
  TransactionStatus,
  TransactionFilterCriteria,
  TransactionSummaryMetrics,
  OrganizationContext,
  Account,
  Fund,
  Head,
  MasterDataChangeHistoryRecord
} from '../types';
import { TSSLogo, TSSReportHeader, TSSReportFooter, BRAND_CONFIG } from '../branding';

interface TransactionCoreViewProps {
  currentOrg: OrganizationContext;
}

type UserRole = 'admin' | 'manager' | 'accountant' | 'viewer';

// Mock Master Data for Validation
const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-khu-01',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-001',
    accountName: 'প্রধান ক্যাশ বাক্স (Main Cash)',
    accountType: 'cash',
    accountSubtype: 'main_cash',
    openingBalanceSupported: true,
    isSystemDefined: true,
    status: 'active',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 'acc-khu-02',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-002',
    accountName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি (সঞ্চয়ী)',
    accountType: 'bank',
    bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    branchName: 'কক্সবাজার প্রধান শাখা',
    accountNumberMasked: '******4589',
    routingNumberMasked: '***123',
    openingBalanceSupported: true,
    isSystemDefined: false,
    status: 'active',
    sortOrder: 2,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin'
  },
  {
    id: 'acc-khu-03',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-003',
    accountName: 'আল-আরাফাহ ইসলামী ব্যাংক (চলতি)',
    accountType: 'bank',
    bankName: 'আল-আরাফাহ ইসলামী ব্যাংক',
    branchName: 'চকরিয়া শাখা',
    accountNumberMasked: '******8812',
    routingNumberMasked: '***456',
    openingBalanceSupported: true,
    isSystemDefined: false,
    status: 'archived', // Archived Account for testing
    sortOrder: 3,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin'
  },
  {
    id: 'acc-alf-01',
    organizationId: 'org-alfalah-01',
    accountCode: 'ACC-001',
    accountName: 'আল-ফালাহ প্রধান ক্যাশ (Main Cash)',
    accountType: 'cash',
    openingBalanceSupported: true,
    isSystemDefined: true,
    status: 'active',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'System',
    updatedBy: 'System'
  }
];

const MOCK_FUNDS: Fund[] = [
  {
    id: 'fnd-khu-01',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-001',
    name: 'সাধারণ তহবিল (General Fund)',
    fundType: 'general',
    isSystemDefined: true,
    isActive: true,
    status: 'active',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'fnd-khu-02',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-002',
    name: 'শেয়ার মূলধন তহবিল (Share Capital Fund)',
    fundType: 'share',
    isSystemDefined: true,
    isActive: true,
    status: 'active',
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'fnd-khu-03',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-003',
    name: 'প্রকল্প উন্নয়ন তহবিল (Project Fund - Archived)',
    fundType: 'project',
    isSystemDefined: false,
    isActive: false,
    status: 'archived', // Archived for testing
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'fnd-alf-01',
    organizationId: 'org-alfalah-01',
    fundCode: 'FND-001',
    name: 'আল-ফালাহ সাধারণ তহবিল',
    fundType: 'general',
    isSystemDefined: true,
    isActive: true,
    status: 'active',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

const MOCK_HEADS: Head[] = [
  {
    id: 'hd-khu-01',
    organizationId: 'demo-org-khurushkul',
    headCode: 'INC-001',
    name: 'সদস্য মাসিক সঞ্চয় জমা (Member Monthly Savings)',
    headType: 'income',
    parentId: null,
    level: 1,
    isSystemDefined: true,
    isActive: true,
    status: 'active',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'hd-khu-02',
    organizationId: 'demo-org-khurushkul',
    headCode: 'INC-002',
    name: 'সদস্য ভর্তি ও ফরম ফি (Admission Fee)',
    headType: 'income',
    parentId: null,
    level: 1,
    isSystemDefined: true,
    isActive: true,
    status: 'active',
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'hd-khu-03',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-001',
    name: 'অফিস ভাড়া ও ইউটিলিটি বিল (Office Rent)',
    headType: 'expense',
    parentId: null,
    level: 1,
    isSystemDefined: true,
    isActive: true,
    status: 'active',
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'hd-khu-04',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-002',
    name: 'মুদ্রণ ও স্টেশনারি খরচ (Printing & Stationery)',
    headType: 'expense',
    parentId: null,
    level: 1,
    isSystemDefined: true,
    isActive: true,
    status: 'active',
    sortOrder: 4,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'hd-khu-05',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-003',
    name: 'পুরোনো অফিস উন্নয়ন (Archived Expense Head)',
    headType: 'expense',
    parentId: null,
    level: 1,
    isSystemDefined: false,
    isActive: false,
    status: 'archived',
    sortOrder: 5,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'hd-alf-01',
    organizationId: 'org-alfalah-01',
    headCode: 'INC-001',
    name: 'আল-ফালাহ সদস্য সঞ্চয় জমা',
    headType: 'income',
    parentId: null,
    level: 1,
    isSystemDefined: true,
    isActive: true,
    status: 'active',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

// Initial Transactions Seed
const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'trx-khu-001',
    organizationId: 'demo-org-khurushkul',
    transactionCode: 'TRX-2026-000001',
    transactionType: 'INCOME',
    transactionDate: '2026-03-01',
    amount: 15000.00,
    accountId: 'acc-khu-01',
    fundId: 'fnd-khu-01',
    headId: 'hd-khu-01',
    description: '২০ জন সাধারণ সদস্যের মাসিক সঞ্চয় কিস্তি আদায়',
    reference: 'MR-2026-041',
    status: 'APPROVED',
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (Accountant)',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (Accountant)',
    submittedAt: '2026-03-01T10:00:00Z',
    approvedBy: 'usr-manager-01',
    approvedByName: 'ম্যানেজার (Manager)',
    approvedAt: '2026-03-01T11:30:00Z',
    version: 2,
    createdAt: '2026-03-01T09:45:00Z',
    updatedAt: '2026-03-01T11:30:00Z'
  },
  {
    id: 'trx-khu-002',
    organizationId: 'demo-org-khurushkul',
    transactionCode: 'TRX-2026-000002',
    transactionType: 'EXPENSE',
    transactionDate: '2026-03-02',
    amount: 5000.00,
    accountId: 'acc-khu-01',
    fundId: 'fnd-khu-01',
    headId: 'hd-khu-03',
    description: 'সমিতি কার্যালয়ের মার্চ মাসের অগ্রিম অফিস ভাড়া প্রদান',
    reference: 'VR-2026-012',
    status: 'APPROVED',
    createdBy: 'usr-manager-01',
    createdByName: 'ম্যানেজার (Manager)',
    submittedBy: 'usr-manager-01',
    submittedByName: 'ম্যানেজার (Manager)',
    submittedAt: '2026-03-02T14:00:00Z',
    approvedBy: 'usr-admin-01',
    approvedByName: 'অ্যাডমিনিস্ট্রেটর (Admin)',
    approvedAt: '2026-03-02T15:00:00Z',
    version: 2,
    createdAt: '2026-03-02T13:30:00Z',
    updatedAt: '2026-03-02T15:00:00Z'
  },
  {
    id: 'trx-khu-003',
    organizationId: 'demo-org-khurushkul',
    transactionCode: 'TRX-2026-000003',
    transactionType: 'INCOME',
    transactionDate: '2026-03-05',
    amount: 25000.00,
    accountId: 'acc-khu-02',
    fundId: 'fnd-khu-02',
    headId: 'hd-khu-02',
    description: 'নতুন ৫ জন সদস্যের শেয়ার ও ভর্তি ফি বাবদ ব্যাংক জমা',
    reference: 'SLIP-IBBL-882',
    status: 'SUBMITTED',
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (Accountant)',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (Accountant)',
    submittedAt: '2026-03-05T16:00:00Z',
    version: 1,
    createdAt: '2026-03-05T15:45:00Z',
    updatedAt: '2026-03-05T16:00:00Z'
  },
  {
    id: 'trx-khu-004',
    organizationId: 'demo-org-khurushkul',
    transactionCode: 'TRX-2026-000004',
    transactionType: 'EXPENSE',
    transactionDate: '2026-03-06',
    amount: 3200.00,
    accountId: 'acc-khu-01',
    fundId: 'fnd-khu-01',
    headId: 'hd-khu-04',
    description: 'সমিতির রেজিস্টার খাতা ও মেম্বারশিপ পাসবই প্রিন্টিং খরচ',
    reference: 'BILL-PR-901',
    status: 'REJECTED',
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (Accountant)',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (Accountant)',
    submittedAt: '2026-03-06T11:00:00Z',
    rejectedBy: 'usr-manager-01',
    rejectedByName: 'ম্যানেজার (Manager)',
    rejectedAt: '2026-03-06T12:15:00Z',
    rejectionReason: 'প্রিন্টিং বিলের সাথে অনুমোদিত ভাউচার ও মেমো সংযুক্ত নেই। মেমো সংযুক্ত করে পুনঃজমা দিন।',
    version: 2,
    createdAt: '2026-03-06T10:30:00Z',
    updatedAt: '2026-03-06T12:15:00Z'
  },
  {
    id: 'trx-khu-005',
    organizationId: 'demo-org-khurushkul',
    transactionCode: 'TRX-2026-000005',
    transactionType: 'INCOME',
    transactionDate: '2026-03-10',
    amount: 8000.00,
    accountId: 'acc-khu-01',
    fundId: 'fnd-khu-01',
    headId: 'hd-khu-01',
    description: 'খসড়া এন্ট্রি — সদস্যদের সাপ্তাহিক ক্ষুদ্র সঞ্চয় আদায়',
    status: 'DRAFT',
    createdBy: 'usr-admin-01',
    createdByName: 'অ্যাডমিনিস্ট্রেটর (Admin)',
    version: 0,
    createdAt: '2026-03-10T08:00:00Z',
    updatedAt: '2026-03-10T08:00:00Z'
  },
  {
    id: 'trx-alf-001',
    organizationId: 'org-alfalah-01',
    transactionCode: 'TRX-2026-000001',
    transactionType: 'INCOME',
    transactionDate: '2026-03-01',
    amount: 50000.00,
    accountId: 'acc-alf-01',
    fundId: 'fnd-alf-01',
    headId: 'hd-alf-01',
    description: 'আল-ফালাহ সমবায় সমিতির মাসিক ডিপোজিট ফান্ড',
    status: 'APPROVED',
    createdBy: 'usr-alf-admin',
    createdByName: 'আল-ফালাহ অ্যাডমিন',
    submittedBy: 'usr-alf-admin',
    approvedBy: 'usr-alf-manager',
    version: 2,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  }
];

export const TransactionCoreView: React.FC<TransactionCoreViewProps> = ({ currentOrg }) => {
  // Current Simulated User & RBAC
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('admin');
  
  // Transactions State (Multi-Tenant)
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);

  // Filters State
  const [filters, setFilters] = useState<TransactionFilterCriteria>({
    searchQuery: '',
    transactionType: 'all',
    status: 'all',
    accountId: 'all',
    fundId: 'all',
    headId: 'all',
    dateFrom: '',
    dateTo: '',
    createdBy: 'all'
  });

  // UI Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState<boolean>(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState<boolean>(false);

  // Active Transaction Context for Modals
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);

  // Form State for New Transaction
  const [formData, setFormData] = useState({
    transactionType: 'INCOME' as TransactionType,
    transactionDate: new Date().toISOString().split('T')[0],
    amount: '',
    accountId: '',
    fundId: '',
    headId: '',
    description: '',
    reference: ''
  });

  // Rejection Reason state
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');
  
  // Notification Toast State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  // Helper to trigger toast
  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Current User Actor Object
  const currentActor = useMemo(() => {
    switch (currentUserRole) {
      case 'admin':
        return { id: 'usr-admin-01', name: 'অ্যাডমিনিস্ট্রেটর (Admin)', role: 'ADMIN' };
      case 'manager':
        return { id: 'usr-manager-01', name: 'ম্যানেজার (Manager)', role: 'MANAGER' };
      case 'accountant':
        return { id: 'usr-accountant-01', name: 'হিসাবরক্ষক (Accountant)', role: 'ACCOUNTANT' };
      case 'viewer':
      default:
        return { id: 'usr-viewer-01', name: 'পরিদর্শক (Viewer)', role: 'VIEWER' };
    }
  }, [currentUserRole]);

  // RBAC Permission Map
  const permissions = useMemo(() => {
    return {
      canView: true,
      canCreate: currentUserRole !== 'viewer',
      canEditDraft: currentUserRole !== 'viewer',
      canSubmit: currentUserRole !== 'viewer',
      canApprove: currentUserRole === 'admin' || currentUserRole === 'manager',
      canReject: currentUserRole === 'admin' || currentUserRole === 'manager',
      canExport: currentUserRole !== 'viewer',
      canPrint: true
    };
  }, [currentUserRole]);

  // Master Data Scoped to Current Organization
  const orgAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter((a) => a.organizationId === currentOrg.id);
  }, [currentOrg.id]);

  const orgFunds = useMemo(() => {
    return MOCK_FUNDS.filter((f) => f.organizationId === currentOrg.id);
  }, [currentOrg.id]);

  const orgHeads = useMemo(() => {
    return MOCK_HEADS.filter((h) => h.organizationId === currentOrg.id);
  }, [currentOrg.id]);

  // Active (Non-archived) Master Data for Creation Forms
  const activeAccounts = useMemo(() => orgAccounts.filter((a) => a.status === 'active'), [orgAccounts]);
  const activeFunds = useMemo(() => orgFunds.filter((f) => f.status === 'active'), [orgFunds]);
  const activeHeads = useMemo(() => orgHeads.filter((h) => h.status === 'active'), [orgHeads]);

  // Filtered Heads based on selected transaction type
  const availableHeadsForForm = useMemo(() => {
    if (formData.transactionType === 'INCOME') {
      return activeHeads.filter((h) => h.headType === 'income');
    }
    if (formData.transactionType === 'EXPENSE') {
      return activeHeads.filter((h) => h.headType === 'expense');
    }
    return activeHeads;
  }, [activeHeads, formData.transactionType]);

  // Organization-Scoped Transactions List
  const orgTransactions = useMemo(() => {
    return transactions.filter((t) => t.organizationId === currentOrg.id);
  }, [transactions, currentOrg.id]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return orgTransactions.filter((t) => {
      // Search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchCode = t.transactionCode.toLowerCase().includes(query);
        const matchDesc = t.description.toLowerCase().includes(query);
        const matchRef = t.reference ? t.reference.toLowerCase().includes(query) : false;
        if (!matchCode && !matchDesc && !matchRef) return false;
      }

      // Type
      if (filters.transactionType !== 'all' && t.transactionType !== filters.transactionType) {
        return false;
      }

      // Status
      if (filters.status !== 'all' && t.status !== filters.status) {
        return false;
      }

      // Account
      if (filters.accountId !== 'all' && t.accountId !== filters.accountId) {
        return false;
      }

      // Fund
      if (filters.fundId !== 'all' && t.fundId !== filters.fundId) {
        return false;
      }

      // Head
      if (filters.headId !== 'all' && t.headId !== filters.headId) {
        return false;
      }

      // Date Range
      if (filters.dateFrom && t.transactionDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && t.transactionDate > filters.dateTo) {
        return false;
      }

      return true;
    });
  }, [orgTransactions, filters]);

  // Summary Metrics
  const metrics: TransactionSummaryMetrics = useMemo(() => {
    let draft = 0;
    let submitted = 0;
    let approved = 0;
    let rejected = 0;
    let approvedSum = 0;

    orgTransactions.forEach((t) => {
      if (t.status === 'DRAFT') draft++;
      else if (t.status === 'SUBMITTED') submitted++;
      else if (t.status === 'APPROVED') {
        approved++;
        approvedSum += t.amount;
      } else if (t.status === 'REJECTED') rejected++;
    });

    return {
      totalCount: orgTransactions.length,
      draftCount: draft,
      submittedCount: submitted,
      approvedCount: approved,
      rejectedCount: rejected,
      totalApprovedAmount: approvedSum
    };
  }, [orgTransactions]);

  // Helper Maps for Names
  const accountMap = useMemo(() => new Map(orgAccounts.map((a) => [a.id, a])), [orgAccounts]);
  const fundMap = useMemo(() => new Map(orgFunds.map((f) => [f.id, f])), [orgFunds]);
  const headMap = useMemo(() => new Map(orgHeads.map((h) => [h.id, h])), [orgHeads]);

  // ==========================================================================
  // Workflow & Mutation Handlers
  // ==========================================================================

  // Generate Next Unique Transaction Code: TRX-YYYY-NNNNNN
  const generateNextTransactionCode = () => {
    const year = new Date().getFullYear();
    const count = orgTransactions.length + 1;
    const padded = String(count).padStart(6, '0');
    return `TRX-${year}-${padded}`;
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    if (!permissions.canCreate) {
      showNotification('error', 'আপনার লেনদেন তৈরির অনুমতি নেই (HTTP 403)।');
      return;
    }

    setFormData({
      transactionType: 'INCOME',
      transactionDate: new Date().toISOString().split('T')[0],
      amount: '',
      accountId: activeAccounts[0]?.id || '',
      fundId: activeFunds[0]?.id || '',
      headId: activeHeads.find((h) => h.headType === 'income')?.id || '',
      description: '',
      reference: ''
    });
    setIsCreateModalOpen(true);
  };

  // Create Transaction as DRAFT
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showNotification('error', 'লেনদেনের পরিমাণ অবশ্যই শূন্যের চেয়ে বড় ধনাত্মক সংখ্যা হতে হবে।');
      return;
    }

    if (!formData.accountId || !formData.fundId || !formData.headId) {
      showNotification('error', 'হিসাব (Account), তহবিল (Fund) এবং খাত (Head) নির্বাচন করা আবশ্যক।');
      return;
    }

    // Cross-Organization Verification Check
    const targetAccount = orgAccounts.find((a) => a.id === formData.accountId);
    const targetFund = orgFunds.find((f) => f.id === formData.fundId);
    const targetHead = orgHeads.find((h) => h.id === formData.headId);

    if (!targetAccount || targetAccount.organizationId !== currentOrg.id) {
      showNotification('error', 'নিরাপত্তা লঙ্ঘন: নির্বাচিত হিসাব অন্য অর্গানাইজেশনের (Cross-Tenant Blocked)।');
      return;
    }
    if (!targetFund || targetFund.organizationId !== currentOrg.id) {
      showNotification('error', 'নিরাপত্তা লঙ্ঘন: নির্বাচিত তহবিল অন্য অর্গানাইজেশনের (Cross-Tenant Blocked)।');
      return;
    }
    if (!targetHead || targetHead.organizationId !== currentOrg.id) {
      showNotification('error', 'নিরাপত্তা লঙ্ঘন: নির্বাচিত খাত অন্য অর্গানাইজেশনের (Cross-Tenant Blocked)।');
      return;
    }

    // Archived Master Data Check
    if (targetAccount.status === 'archived' || targetFund.status === 'archived' || targetHead.status === 'archived') {
      showNotification('error', 'আর্কাইভকৃত মাস্টার ডাটা (হিসাব/তহবিল/খাত) নতুন লেনদেনে ব্যবহার করা নিষিদ্ধ।');
      return;
    }

    // Head Compatibility Check
    if (formData.transactionType === 'INCOME' && targetHead.headType !== 'income') {
      showNotification('error', 'আয় লেনদেনের জন্য অবশ্যই আয় খাত (Income Head) নির্বাচন করতে হবে।');
      return;
    }
    if (formData.transactionType === 'EXPENSE' && targetHead.headType !== 'expense') {
      showNotification('error', 'ব্যয় লেনদেনের জন্য অবশ্যই ব্যয় খাত (Expense Head) নির্বাচন করতে হবে।');
      return;
    }

    const newCode = generateNextTransactionCode();
    const nowIso = new Date().toISOString();

    const newTrx: FinancialTransaction = {
      id: `trx-${currentOrg.id}-${Date.now()}`,
      organizationId: currentOrg.id,
      transactionCode: newCode,
      transactionType: formData.transactionType,
      transactionDate: formData.transactionDate,
      amount: Math.round(parsedAmount * 100) / 100, // 2-decimal precision
      accountId: formData.accountId,
      fundId: formData.fundId,
      headId: formData.headId,
      description: formData.description.trim(),
      reference: formData.reference.trim() || undefined,
      status: 'DRAFT',
      createdBy: currentActor.id,
      createdByName: currentActor.name,
      version: 0,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    setTransactions((prev) => [newTrx, ...prev]);
    setIsCreateModalOpen(false);
    showNotification('success', `খসড়া লেনদেন সফলভাবে তৈরি করা হয়েছে [${newCode}]।`);
  };

  // Submit Transaction for Approval (DRAFT -> SUBMITTED)
  const handleSubmitTransaction = () => {
    if (!selectedTransaction) return;

    if (!permissions.canSubmit) {
      showNotification('error', 'লেনদেন জমা দেওয়ার অনুমতি নেই (HTTP 403)।');
      return;
    }

    if (selectedTransaction.status !== 'DRAFT') {
      showNotification('error', 'শুধুমাত্র খসড়া (Draft) লেনদেন জমা দেওয়া সম্ভব।');
      return;
    }

    const nowIso = new Date().toISOString();
    const updatedTrx: FinancialTransaction = {
      ...selectedTransaction,
      status: 'SUBMITTED',
      submittedBy: currentActor.id,
      submittedByName: currentActor.name,
      submittedAt: nowIso,
      version: selectedTransaction.version + 1,
      updatedAt: nowIso
    };

    setTransactions((prev) => prev.map((t) => (t.id === selectedTransaction.id ? updatedTrx : t)));
    setSelectedTransaction(updatedTrx);
    setIsSubmitModalOpen(false);
    showNotification('success', `লেনদেন [${selectedTransaction.transactionCode}] অনুমোদনের জন্য সফলভাবে জমা দেওয়া হয়েছে।`);
  };

  // Approve Transaction (SUBMITTED -> APPROVED)
  const handleApproveTransaction = () => {
    if (!selectedTransaction) return;

    if (!permissions.canApprove) {
      showNotification('error', 'লেনদেন অনুমোদনের অনুমতি শুধুমাত্র অ্যাডমিন ও ম্যানেজার রোলে সংরক্ষিত (HTTP 403)।');
      return;
    }

    if (selectedTransaction.status !== 'SUBMITTED') {
      showNotification('error', 'শুধুমাত্র জমা দেওয়া (Submitted) লেনদেন অনুমোদন করা সম্ভব।');
      return;
    }

    // Strict Separation of Duties: Creator cannot approve own transaction
    if (selectedTransaction.createdBy === currentActor.id) {
      showNotification('error', 'দায়িত্ব পৃথকীকরণ (Separation of Duties): প্রস্তুতকারী নিজে নিজের লেনদেন অনুমোদন করতে পারেন না (HTTP 403 Forbidden)।');
      return;
    }

    const nowIso = new Date().toISOString();
    const updatedTrx: FinancialTransaction = {
      ...selectedTransaction,
      status: 'APPROVED',
      approvedBy: currentActor.id,
      approvedByName: currentActor.name,
      approvedAt: nowIso,
      version: selectedTransaction.version + 1,
      updatedAt: nowIso
    };

    setTransactions((prev) => prev.map((t) => (t.id === selectedTransaction.id ? updatedTrx : t)));
    setSelectedTransaction(updatedTrx);
    setIsApproveModalOpen(false);
    showNotification('success', `লেনদেন [${selectedTransaction.transactionCode}] চূড়ান্তভাবে অনুমোদিত হয়েছে।`);
  };

  // Reject Transaction (SUBMITTED -> REJECTED)
  const handleRejectTransaction = () => {
    if (!selectedTransaction) return;

    if (!permissions.canReject) {
      showNotification('error', 'লেনদেন প্রত্যাখ্যানের অনুমতি নেই (HTTP 403)।');
      return;
    }

    if (selectedTransaction.status !== 'SUBMITTED') {
      showNotification('error', 'শুধুমাত্র জমা দেওয়া (Submitted) লেনদেন প্রত্যাখ্যান করা সম্ভব।');
      return;
    }

    if (!rejectionReasonInput.trim()) {
      showNotification('error', 'লেনদেন প্রত্যাখ্যানের জন্য সুনির্দিষ্ট নীতিগত কারণ উল্লেখ করা বাধ্যতামূলক।');
      return;
    }

    const nowIso = new Date().toISOString();
    const updatedTrx: FinancialTransaction = {
      ...selectedTransaction,
      status: 'REJECTED',
      rejectedBy: currentActor.id,
      rejectedByName: currentActor.name,
      rejectedAt: nowIso,
      rejectionReason: rejectionReasonInput.trim(),
      version: selectedTransaction.version + 1,
      updatedAt: nowIso
    };

    setTransactions((prev) => prev.map((t) => (t.id === selectedTransaction.id ? updatedTrx : t)));
    setSelectedTransaction(updatedTrx);
    setIsRejectModalOpen(false);
    setRejectionReasonInput('');
    showNotification('warning', `লেনদেন [${selectedTransaction.transactionCode}] প্রত্যাখ্যাত করা হয়েছে।`);
  };

  // Resubmit / Reopen Rejected Transaction (REJECTED -> DRAFT)
  const handleReopenRejectedToDraft = () => {
    if (!selectedTransaction) return;

    if (!permissions.canEditDraft) {
      showNotification('error', 'প্রত্যাখ্যাত লেনদেন সংশোধনের অনুমতি নেই (HTTP 403)।');
      return;
    }

    if (selectedTransaction.status !== 'REJECTED') {
      showNotification('error', 'শুধুমাত্র প্রত্যাখ্যাত (Rejected) লেনদেন খসড়ায় ফিরিয়ে নেওয়া সম্ভব।');
      return;
    }

    const nowIso = new Date().toISOString();
    const updatedTrx: FinancialTransaction = {
      ...selectedTransaction,
      status: 'DRAFT',
      version: selectedTransaction.version + 1,
      updatedAt: nowIso
    };

    setTransactions((prev) => prev.map((t) => (t.id === selectedTransaction.id ? updatedTrx : t)));
    setSelectedTransaction(updatedTrx);
    setIsResubmitModalOpen(false);
    showNotification('info', `লেনদেন [${selectedTransaction.transactionCode}] সংশোধনের জন্য পুনরায় খসড়ায় স্থানান্তর করা হয়েছে।`);
  };

  // Open Detail Modal
  const handleOpenDetailModal = (trx: FinancialTransaction) => {
    setSelectedTransaction(trx);
    setIsDetailModalOpen(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!permissions.canExport) {
      showNotification('error', 'এক্সপোর্টের অনুমতি নেই।');
      return;
    }

    const headers = [
      'Transaction Code',
      'Date',
      'Type',
      'Amount',
      'Account',
      'Fund',
      'Head',
      'Status',
      'Reference',
      'Description',
      'Created By',
      'Approved By'
    ];

    const rows = filteredTransactions.map((t) => [
      t.transactionCode,
      t.transactionDate,
      t.transactionType,
      t.amount.toFixed(2),
      accountMap.get(t.accountId)?.accountName || t.accountId,
      fundMap.get(t.fundId)?.name || t.fundId,
      headMap.get(t.headId)?.name || t.headId,
      t.status,
      t.reference || '',
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.createdByName || t.createdBy,
      t.approvedByName || t.approvedBy || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TSS_Transactions_${currentOrg.code}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', 'লেনদেন রেজিস্টার CSV আকারে সফলভাবে এক্সপোর্ট হয়েছে।');
  };

  // Status Badge Helper
  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1 w-fit font-numeric">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>খসড়া (Draft)</span>
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 w-fit font-numeric">
            <Send className="w-3 h-3 text-amber-700" />
            <span>জমা দেওয়া হয়েছে (Submitted)</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 w-fit font-numeric">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>অনুমোদিত (Approved)</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1 w-fit font-numeric">
            <XCircle className="w-3 h-3 text-rose-700" />
            <span>প্রত্যাখ্যাত (Rejected)</span>
          </span>
        );
    }
  };

  // Type Badge Helper
  const renderTypeBadge = (type: TransactionType) => {
    switch (type) {
      case 'INCOME':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-numeric">
            + আয় (Income)
          </span>
        );
      case 'EXPENSE':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 font-numeric">
            - ব্যয় (Expense)
          </span>
        );
      case 'TRANSFER':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 font-numeric">
            ⇄ স্থানান্তর (Transfer)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-heading animate-in fade-in slide-in-from-top-4 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : notification.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : notification.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-blue-50 text-blue-900 border-blue-300'
          }`}
        >
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
          {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
          {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
          <div>
            <p className="font-bold">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-heading">
                  আর্থিক লেনদেন কোর ও অনুমোদন (Financial Transaction Core)
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-numeric">
                  Phase 5.2 Backbone
                </span>
              </div>
              <p className="text-xs text-slate-500 font-body">
                Head (কেন) ≠ Fund (উদ্দেশ্য) ≠ Account (কোথায়) — সমন্বিত জেনেরিক লেনদেন ও অনুমোদন ইঞ্জিন
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* RBAC Role Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-500 px-2 uppercase">রোলে টেস্ট:</span>
              {(['admin', 'manager', 'accountant', 'viewer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setCurrentUserRole(r)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize transition ${
                    currentUserRole === r
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r === 'admin' ? 'অ্যাডমিন' : r === 'manager' ? 'ম্যানেজার' : r === 'accountant' ? 'হিসাবরক্ষক' : 'ভিউয়ার'}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-slate-300 font-numeric"
            >
              <Download className="w-4 h-4" />
              <span>CSV এক্সপোর্ট</span>
            </button>

            <button
              onClick={() => setIsPrintPreviewOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-slate-300 font-numeric"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট ভিউ</span>
            </button>

            {permissions.canCreate && (
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs font-heading"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন লেনদেন (খসড়া)</span>
              </button>
            )}
          </div>
        </div>

        {/* Official Balance Rule & Separation of Duties Informational Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 font-heading">অফিশিয়াল ব্যালেন্স নীতি (Official Balance Rule):</strong>
              <p className="text-emerald-900 text-[11px] font-body mt-0.5">
                শুধুমাত্র <span className="font-bold underline">APPROVED</span> লেনদেন অফিশিয়াল লেজার ও ব্যালেন্সে অন্তর্ভুক্ত হবে। খসড়া (Draft), জমা দেওয়া (Submitted) ও প্রত্যাখ্যাত (Rejected) লেনদেনের ব্যালেন্স প্রভাব শূন্য (0.00)।
              </p>
            </div>
          </div>

          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 font-heading">দায়িত্ব পৃথকীকরণ (Separation of Duties):</strong>
              <p className="text-amber-900 text-[11px] font-body mt-0.5">
                যে কর্মকর্তা খসড়া তৈরি করেছেন (<span className="font-mono">createdBy</span>), তিনি নিজে তা অনুমোদন করতে পারবেন না। ভিন্ন অনুমোদিত কর্মকর্তা দ্বারা অনুমোদন বাধ্যতামূলক।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold font-heading">মোট লেনদেন</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-numeric">{metrics.totalCount}</div>
          <p className="text-[10px] text-slate-500 mt-1 font-body">সমিতির মোট এন্ট্রি</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold font-heading">খসড়া (Draft)</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-700 font-numeric">{metrics.draftCount}</div>
          <p className="text-[10px] text-slate-500 mt-1 font-body">জমা দেওয়ার অপেক্ষায়</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-semibold font-heading">জমা দেওয়া (Pending)</span>
            <Send className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 font-numeric">{metrics.submittedCount}</div>
          <p className="text-[10px] text-amber-800 mt-1 font-body">অনুমোদনের অপেক্ষায়</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-semibold font-heading">অনুমোদিত (Approved)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 font-numeric">{metrics.approvedCount}</div>
          <p className="text-[10px] text-emerald-800 mt-1 font-body">চূড়ান্ত ও অপরিবর্তনীয়</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-semibold font-heading">প্রত্যাখ্যাত (Rejected)</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-900 font-numeric">{metrics.rejectedCount}</div>
          <p className="text-[10px] text-rose-800 mt-1 font-body">সংশোধন আবশ্যক</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-300 bg-emerald-900 text-white shadow-xs">
          <div className="flex items-center justify-between text-emerald-200 mb-1">
            <span className="text-xs font-semibold font-heading">অনুমোদিত মোট অংক</span>
            <Coins className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-xl font-bold font-numeric">৳ {metrics.totalApprovedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <p className="text-[10px] text-emerald-200 mt-1 font-body">লেজার উপযোগী মোট</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="কোড, বিবরণ বা রেফারেন্স খুঁজুন..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filters.transactionType}
              onChange={(e) => setFilters({ ...filters, transactionType: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-numeric"
            >
              <option value="all">সকল লেনদেন ধরন (Type)</option>
              <option value="INCOME">আয় (Income)</option>
              <option value="EXPENSE">ব্যয় (Expense)</option>
              <option value="TRANSFER">স্থানান্তর (Transfer)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-numeric"
            >
              <option value="all">সকল স্ট্যাটাস (All Status)</option>
              <option value="DRAFT">খসড়া (Draft)</option>
              <option value="SUBMITTED">জমা দেওয়া (Submitted)</option>
              <option value="APPROVED">অনুমোদিত (Approved)</option>
              <option value="REJECTED">প্রত্যাখ্যাত (Rejected)</option>
            </select>
          </div>

          {/* Account Filter */}
          <div>
            <select
              value={filters.accountId}
              onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-numeric"
            >
              <option value="all">সকল হিসাব (All Accounts)</option>
              {orgAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountName}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  transactionType: 'all',
                  status: 'all',
                  accountId: 'all',
                  fundId: 'all',
                  headId: 'all',
                  dateFrom: '',
                  dateTo: '',
                  createdBy: 'all'
                })
              }
              className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ফিল্টার মুছুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table Register */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              লেনদেন রেজিস্টার তালিকা ({filteredTransactions.length})
            </h3>
            <span className="text-[11px] text-slate-500 font-numeric">
              অর্গানাইজেশন: {currentOrg.shortName}
            </span>
          </div>

          <div className="text-xs text-slate-500 font-numeric">
            প্রদর্শন হচ্ছে: {filteredTransactions.length} টি রেকর্ড
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 font-heading">
              <tr>
                <th className="py-3 px-4">লেনদেন কোড</th>
                <th className="py-3 px-3">তারিখ</th>
                <th className="py-3 px-3">ধরন</th>
                <th className="py-3 px-3 text-right">পরিমাণ (টাকা)</th>
                <th className="py-3 px-3">হিসাব (Where)</th>
                <th className="py-3 px-3">তহবিল (Fund)</th>
                <th className="py-3 px-3">খাত (Head)</th>
                <th className="py-3 px-3">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-body">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600">কোনো লেনদেন রেকর্ড পাওয়া যায়নি</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => {
                  const account = accountMap.get(trx.accountId);
                  const fund = fundMap.get(trx.fundId);
                  const head = headMap.get(trx.headId);

                  return (
                    <tr key={trx.id} className="hover:bg-slate-50/80 transition group">
                      {/* Code */}
                      <td className="py-3 px-4 font-mono font-bold text-emerald-950">
                        <div className="flex items-center gap-1.5">
                          <span>{trx.transactionCode}</span>
                          {trx.reference && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({trx.reference})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap font-numeric text-slate-700">
                        {trx.transactionDate}
                      </td>

                      {/* Type */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {renderTypeBadge(trx.transactionType)}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 text-right whitespace-nowrap font-numeric font-bold text-slate-900">
                        ৳ {trx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Account */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        <div className="flex items-center gap-1">
                          <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]" title={account?.accountName || trx.accountId}>
                            {account?.accountName || trx.accountId}
                          </span>
                        </div>
                      </td>

                      {/* Fund */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        <div className="flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[120px]" title={fund?.name || trx.fundId}>
                            {fund?.name || trx.fundId}
                          </span>
                        </div>
                      </td>

                      {/* Head */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        <div className="flex items-center gap-1">
                          <FolderTree className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]" title={head?.name || trx.headId}>
                            {head?.name || trx.headId}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {renderStatusBadge(trx.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenDetailModal(trx)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="বিস্তারিত ও অডিট হিস্ট্রি"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Draft Submit */}
                          {trx.status === 'DRAFT' && permissions.canSubmit && (
                            <button
                              onClick={() => {
                                setSelectedTransaction(trx);
                                setIsSubmitModalOpen(true);
                              }}
                              className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition"
                              title="অনুমোদনের জন্য জমা দিন"
                            >
                              <Send className="w-3 h-3" />
                              <span>জমা</span>
                            </button>
                          )}

                          {/* Submitted -> Approve / Reject */}
                          {trx.status === 'SUBMITTED' && (
                            <>
                              {permissions.canApprove && (
                                <button
                                  onClick={() => {
                                    setSelectedTransaction(trx);
                                    setIsApproveModalOpen(true);
                                  }}
                                  disabled={trx.createdBy === currentActor.id}
                                  className={`px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition ${
                                    trx.createdBy === currentActor.id
                                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                  }`}
                                  title={
                                    trx.createdBy === currentActor.id
                                      ? 'Separation of Duties: প্রস্তুতকারী নিজে নিজের লেনদেন অনুমোদন করতে পারেন না'
                                      : 'লেনদেন অনুমোদন করুন'
                                  }
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>অনুমোদন</span>
                                </button>
                              )}

                              {permissions.canReject && (
                                <button
                                  onClick={() => {
                                    setSelectedTransaction(trx);
                                    setIsRejectModalOpen(true);
                                  }}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition"
                                  title="লেনদেন প্রত্যাখ্যান করুন"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>বাতিল</span>
                                </button>
                              )}
                            </>
                          )}

                          {/* Rejected -> Reopen */}
                          {trx.status === 'REJECTED' && permissions.canEditDraft && (
                            <button
                              onClick={() => {
                                setSelectedTransaction(trx);
                                setIsResubmitModalOpen(true);
                              }}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition"
                              title="সংশোধনের জন্য খসড়ায় ফিরিয়ে নিন"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>খসড়ায় নিন</span>
                            </button>
                          )}

                          {/* Approved Lock Icon */}
                          {trx.status === 'APPROVED' && (
                            <span className="p-1 text-emerald-800" title="চূড়ান্ত অনুমোদিত — অপরিবর্তনীয় ও স্থায়ী">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
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
      </div>

      {/* ===================================================================== */}
      {/* 1. Create Transaction Modal (DRAFT) */}
      {/* ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    নতুন আর্থিক লেনদেন তৈরি (খসড়া এন্ট্রি)
                  </h3>
                  <p className="text-xs text-slate-500 font-body">
                    অর্গানাইজেশন: {currentOrg.name} ({currentOrg.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDraft} className="space-y-4 pt-4 text-xs font-body">
              {/* Type and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">লেনদেনের ধরন (Transaction Type) *</label>
                  <select
                    value={formData.transactionType}
                    onChange={(e) => setFormData({ ...formData, transactionType: e.target.value as TransactionType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-numeric focus:bg-white focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="INCOME">আয় লেনদেন (INCOME)</option>
                    <option value="EXPENSE">ব্যয় লেনদেন (EXPENSE)</option>
                    <option value="TRANSFER">হিসাব স্থানান্তর (TRANSFER)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">লেনদেনের তারিখ (Transaction Date) *</label>
                  <input
                    type="date"
                    required
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-numeric focus:bg-white focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Amount and Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">টাকার পরিমাণ (Amount - Positive Decimal) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-numeric font-bold text-sm focus:bg-white focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">রেফারেন্স / ভাউচার / মেমো নম্বর</label>
                  <input
                    type="text"
                    placeholder="যেমন: MR-2026-041, SLIP-881"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-numeric focus:bg-white focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Account, Fund, Head Selection (Strict Three Dimensions) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1 font-heading">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>আর্থিক ত্রিমাত্রিক ডাইমেনশন ম্যাপিং (Triple Accounting Dimensions)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Account */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">১. হিসাব (Account - Where) *</label>
                    <select
                      required
                      value={formData.accountId}
                      onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">হিসাব নির্বাচন করুন</option>
                      {activeAccounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.accountName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fund */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">২. তহবিল (Fund - Purpose) *</label>
                    <select
                      required
                      value={formData.fundId}
                      onChange={(e) => setFormData({ ...formData, fundId: e.target.value })}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">তহবিল নির্বাচন করুন</option>
                      {activeFunds.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Head */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">৩. খাত (Head - Why) *</label>
                    <select
                      required
                      value={formData.headId}
                      onChange={(e) => setFormData({ ...formData, headId: e.target.value })}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">খাত নির্বাচন করুন</option>
                      {availableHeadsForForm.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">লেনদেনের সুনির্দিষ্ট বিবরণ *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="লেনদেনের বিস্তারিত উদ্দেশ্য ও বিবরণ লিখুন..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>খসড়া হিসেবে সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. Detail & Audit History Modal */}
      {/* ===================================================================== */}
      {isDetailModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    লেনদেন বিস্তারিত ও অডিট রেজিস্টার
                  </h3>
                  <p className="text-xs font-mono text-emerald-900 font-bold">
                    {selectedTransaction.transactionCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Status and Summary Header */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">বর্তমান স্ট্যাটাস</span>
                <div className="mt-1">{renderStatusBadge(selectedTransaction.status)}</div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-semibold block">লেনদেনের পরিমাণ</span>
                <span className="text-xl font-bold font-numeric text-slate-900">
                  ৳ {selectedTransaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Core Transaction Information Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">লেনদেনের তারিখ</span>
                <span className="font-bold text-slate-800 font-numeric">{selectedTransaction.transactionDate}</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">লেনদেনের ধরন</span>
                <span className="font-bold text-slate-800">{selectedTransaction.transactionType}</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">হিসাব (Account - Where)</span>
                <span className="font-bold text-slate-800">
                  {accountMap.get(selectedTransaction.accountId)?.accountName || selectedTransaction.accountId}
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">তহবিল (Fund - Purpose)</span>
                <span className="font-bold text-slate-800">
                  {fundMap.get(selectedTransaction.fundId)?.name || selectedTransaction.fundId}
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl col-span-2">
                <span className="text-slate-400 block text-[10px]">খাত (Head - Why)</span>
                <span className="font-bold text-slate-800">
                  {headMap.get(selectedTransaction.headId)?.name || selectedTransaction.headId}
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl col-span-2">
                <span className="text-slate-400 block text-[10px]">বিবরণ</span>
                <p className="text-slate-700 mt-0.5 leading-relaxed">{selectedTransaction.description}</p>
              </div>

              {selectedTransaction.reference && (
                <div className="p-3 bg-white border border-slate-200 rounded-xl col-span-2">
                  <span className="text-slate-400 block text-[10px]">ভাউচার / রেফারেন্স</span>
                  <span className="font-bold text-slate-800 font-numeric">{selectedTransaction.reference}</span>
                </div>
              )}
            </div>

            {/* Rejection Reason Box (If Rejected) */}
            {selectedTransaction.status === 'REJECTED' && selectedTransaction.rejectionReason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-rose-900 font-bold font-heading">
                  <XCircle className="w-4 h-4 text-rose-700" />
                  <span>প্রত্যাখ্যানের নীতিগত কারণ:</span>
                </div>
                <p className="text-rose-800 leading-relaxed font-body pl-5">
                  {selectedTransaction.rejectionReason}
                </p>
                <div className="text-[10px] text-rose-600 pl-5 pt-1">
                  প্রত্যাখ্যানকারী: {selectedTransaction.rejectedByName || selectedTransaction.rejectedBy} | তারিখ: {selectedTransaction.rejectedAt}
                </div>
              </div>
            )}

            {/* Governance & Actors Timeline */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 font-heading">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>অডিট ট্রেইল ও অ্যাক্টর লগ (Audit Trail)</span>
              </span>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-slate-600 border-b border-slate-200/60 pb-1.5">
                  <span>তৈরি করেছেন (Created By):</span>
                  <span className="font-bold text-slate-900">{selectedTransaction.createdByName || selectedTransaction.createdBy} ({selectedTransaction.createdAt})</span>
                </div>

                {selectedTransaction.submittedBy && (
                  <div className="flex items-center justify-between text-slate-600 border-b border-slate-200/60 pb-1.5">
                    <span>জমা দিয়েছেন (Submitted By):</span>
                    <span className="font-bold text-amber-900">{selectedTransaction.submittedByName || selectedTransaction.submittedBy} ({selectedTransaction.submittedAt})</span>
                  </div>
                )}

                {selectedTransaction.approvedBy && (
                  <div className="flex items-center justify-between text-slate-600 border-b border-slate-200/60 pb-1.5">
                    <span>অনুমোদন করেছেন (Approved By):</span>
                    <span className="font-bold text-emerald-900">{selectedTransaction.approvedByName || selectedTransaction.approvedBy} ({selectedTransaction.approvedAt})</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-500 text-[10px] pt-1">
                  <span>লক ভার্সন (Optimistic Token): v{selectedTransaction.version}</span>
                  <span>টেন্যান্ট আইসোলেশন: {selectedTransaction.organizationId}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. Submit Transaction Confirmation Modal */}
      {/* ===================================================================== */}
      {isSubmitModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  অনুমোদনের জন্য জমা দিন
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedTransaction.transactionCode}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-body">
              আপনি কি নিশ্চিত যে এই খসড়া লেনদেনটি (পরিমাণ: <strong>৳ {selectedTransaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>) কর্তৃপক্ষের অনুমোদনের জন্য জমা দিতে চান?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition"
              >
                বাতিল
              </button>
              <button
                onClick={handleSubmitTransaction}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>জমা দিন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. Approve Transaction Confirmation Modal */}
      {/* ===================================================================== */}
      {isApproveModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  লেনদেন চূড়ান্ত অনুমোদন
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedTransaction.transactionCode}
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-950 font-heading block">অনুমোদন নিশ্চিতকরণ:</span>
              <p className="text-emerald-900 font-body">
                লেনদেন অনুমোদিত হলে তা চূড়ান্ত ও অপরিবর্তনীয় হয়ে যাবে এবং পরবর্তীতে অফিসিয়াল লেজারে সংযুক্ত হবে।
              </p>
              <p className="font-bold text-slate-800 pt-1">
                মোট পরিমাণ: ৳ {selectedTransaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition"
              >
                বাতিল
              </button>
              <button
                onClick={handleApproveTransaction}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>অনুমোদন সম্পন্ন করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. Reject Transaction Modal */}
      {/* ===================================================================== */}
      {isRejectModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  লেনদেন প্রত্যাখ্যান করুন
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedTransaction.transactionCode}
                </p>
              </div>
            </div>

            <div className="text-xs font-body space-y-2">
              <label className="block font-bold text-slate-700">
                প্রত্যাখ্যানের নীতিগত কারণ উল্লেখ করুন *
              </label>
              <textarea
                required
                rows={3}
                placeholder="কেন লেনদেনটি বাতিল বা প্রত্যাখ্যান করা হচ্ছে তা বিস্তারিত লিখুন..."
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-600 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition"
              >
                বাতিল
              </button>
              <button
                onClick={handleRejectTransaction}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold transition flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>প্রত্যাখ্যান নিশ্চিত করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. Resubmit / Reopen to Draft Modal */}
      {/* ===================================================================== */}
      {isResubmitModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-blue-700">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  প্রত্যাখ্যাত লেনদেন খসড়ায় রূপান্তর
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedTransaction.transactionCode}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-body">
              লেনদেনটি খসড়ায় রূপান্তর করলে প্রস্তুতকারী পুনরায় প্রয়োজনীয় তথ্য সংশোধন বা সংযোজন করে আবার জমা দিতে পারবেন।
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setIsResubmitModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition"
              >
                বাতিল
              </button>
              <button
                onClick={handleReopenRejectedToDraft}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>খসড়ায় নিন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. A4 Print Preview Modal */}
      {/* ===================================================================== */}
      {isPrintPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between no-print pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">A4 প্রিন্ট প্রিভিউ (Print Ready)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setIsPrintPreviewOpen(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>

            {/* Standardized TSS Report Header */}
            <TSSReportHeader
              organization={currentOrg}
              reportTitle="আর্থিক লেনদেন রেজিস্টার ও অডিট প্রতিবেদন"
              reportSubtitle="Phase 5.2 Financial Transaction Core Report"
              reportCode="TSS-TRX-CORE"
              generatedBy="সিস্টেম অ্যাডমিনিস্ট্রেটর"
            />

            {/* Table Content */}
            <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-3">লেনদেন কোড</th>
                    <th className="py-2 px-2">তারিখ</th>
                    <th className="py-2 px-2">ধরন</th>
                    <th className="py-2 px-2 text-right">পরিমাণ (টাকা)</th>
                    <th className="py-2 px-2">হিসাব (Where)</th>
                    <th className="py-2 px-2">তহবিল (Fund)</th>
                    <th className="py-2 px-2">খাত (Head)</th>
                    <th className="py-2 px-2">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTransactions.map((trx) => (
                    <tr key={trx.id}>
                      <td className="py-2 px-3 font-mono font-bold">{trx.transactionCode}</td>
                      <td className="py-2 px-2 font-numeric">{trx.transactionDate}</td>
                      <td className="py-2 px-2">{trx.transactionType}</td>
                      <td className="py-2 px-2 text-right font-numeric font-bold">
                        ৳ {trx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2">{accountMap.get(trx.accountId)?.accountName || trx.accountId}</td>
                      <td className="py-2 px-2">{fundMap.get(trx.fundId)?.name || trx.fundId}</td>
                      <td className="py-2 px-2">{headMap.get(trx.headId)?.name || trx.headId}</td>
                      <td className="py-2 px-2 font-bold">{trx.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Standardized TSS Report Footer */}
            <TSSReportFooter />
          </div>
        </div>
      )}
    </div>
  );
};
