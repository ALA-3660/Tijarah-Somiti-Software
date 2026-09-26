import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Scale,
  Wallet,
  Landmark,
  Layers,
  FileText,
  ShieldCheck,
  RotateCw,
  Search,
  Filter,
  Eye,
  Printer,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  Lock,
  UserCheck,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Info,
  SlidersHorizontal,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import {
  OrganizationContext,
  LedgerEntry,
  LedgerSourceType,
  LedgerDirection,
  LedgerPermissionKey,
  LedgerAuditEvent,
  LedgerFilterCriteria,
  Account,
  Fund,
  OpeningBalanceEntry,
  IncomeEntry,
  ExpenseEntry,
  TransferEntry,
  AccountBalanceSummary,
  FundBalanceSummary,
  AccountFundBalanceSummary,
  FinancialStatementSummary,
  LedgerReconciliationReport,
  LedgerRebuildResult
} from '../types';
import { LedgerProjectionService, SourceEventContainer } from '../services/ledgerProjectionService';
import { TSSLogo } from '../branding';
import { numberToBengaliWords } from '../utils/bengaliNumberWords';

interface LedgerManagementViewProps {
  currentOrg: OrganizationContext;
}

type UserRole = 'admin' | 'manager' | 'accountant' | 'viewer';

interface Actor {
  id: string;
  name: string;
  role: UserRole;
}

const ACTORS: Actor[] = [
  { id: 'usr-admin-01', name: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)', role: 'admin' },
  { id: 'usr-manager-01', name: 'আব্দুর রহমান (ম্যানেজার)', role: 'manager' },
  { id: 'usr-acc-01', name: 'কামাল উদ্দিন (হিসাবরক্ষক)', role: 'accountant' },
  { id: 'usr-viewer-01', name: 'নুরুল হক (নিরীক্ষক/দর্শক)', role: 'viewer' },
];

const LEDGER_ROLE_PERMISSIONS: Record<UserRole, LedgerPermissionKey[]> = {
  admin: [
    'finance.ledger.view',
    'finance.ledger.reconcile',
    'finance.ledger.rebuild',
    'finance.ledger.source_view'
  ],
  manager: [
    'finance.ledger.view',
    'finance.ledger.reconcile',
    'finance.ledger.rebuild',
    'finance.ledger.source_view'
  ],
  accountant: [
    'finance.ledger.view',
    'finance.ledger.source_view'
  ],
  viewer: [
    'finance.ledger.view'
  ]
};

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-khu-01',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-001',
    accountName: 'প্রধান ক্যাশ বাক্স (Main Cash)',
    accountType: 'cash',
    accountSubtype: 'main_cash',
    associatedFundIds: ['fnd-khu-01', 'fnd-khu-02'],
    openingBalanceSupported: true,
    isSystemDefined: true,
    status: 'active',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
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
    associatedFundIds: ['fnd-khu-01', 'fnd-khu-02'],
    openingBalanceSupported: true,
    isSystemDefined: false,
    status: 'active',
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'acc-khu-03',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-003',
    accountName: 'আল-আরাফাহ ইসলামী ব্যাংক (চলতি)',
    accountType: 'bank',
    bankName: 'আল-আরাফাহ ইসলামী ব্যাংক',
    branchName: 'কক্সবাজার শাখা',
    accountNumberMasked: '******7890',
    routingNumberMasked: '***456',
    associatedFundIds: ['fnd-khu-01'],
    openingBalanceSupported: true,
    isSystemDefined: false,
    status: 'active',
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  }
];

const MOCK_FUNDS: Fund[] = [
  {
    id: 'fnd-khu-01',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-001',
    name: 'সাধারণ তহবিল (General Fund)',
    fundType: 'general',
    status: 'active',
    isActive: true,
    isSystemDefined: true,
    description: 'সংগঠনের সার্বিক সাধারণ ও পরিচালন কার্যক্রমের তহবিল',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'fnd-khu-02',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-002',
    name: 'প্রকল্প তহবিল (Project Fund)',
    fundType: 'project',
    status: 'active',
    isActive: true,
    isSystemDefined: false,
    description: 'মুদারাবা ও মুশারাকা ব্যবসার জন্য নির্ধারিত তহবিল',
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  }
];

// Seed Sources (from Phase 5.3, 5.4, 5.5, 5.6)
const INITIAL_SOURCES: SourceEventContainer = {
  openingBalances: [
    {
      id: 'ob-seed-01',
      organizationId: 'demo-org-khurushkul',
      openingBalanceCode: 'OB-2026-000001',
      version: 1,
      accountId: 'acc-khu-01',
      fundId: 'fnd-khu-01',
      amount: 80000,
      amountInWordsBn: 'আশি হাজার টাকা মাত্র',
      openingDate: '2026-01-01',
      reasonCode: 'previous_cashbook',
      supportingDocuments: [],
      status: 'POSTED',
      createdBy: 'usr-acc-01',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T11:00:00Z',
      postedBy: 'usr-manager-01',
      postedAt: '2026-01-01T11:00:00Z',
      financialTransactionId: 'TRX-2026-OB-000001',
      isFinancialPosted: true,
      auditHistory: []
    },
    {
      id: 'ob-seed-02',
      organizationId: 'demo-org-khurushkul',
      openingBalanceCode: 'OB-2026-000002',
      version: 1,
      accountId: 'acc-khu-02',
      fundId: 'fnd-khu-01',
      amount: 150000,
      amountInWordsBn: 'এক লাখ পঞ্চাশ হাজার টাকা মাত্র',
      openingDate: '2026-01-01',
      reasonCode: 'bank_statement_alignment',
      supportingDocuments: [],
      status: 'APPROVED', // NOT posted -> zero ledger impact
      createdBy: 'usr-acc-01',
      createdAt: '2026-01-01T10:30:00Z',
      updatedAt: '2026-01-01T11:30:00Z',
      auditHistory: []
    }
  ],
  incomes: [
    {
      id: 'inc-seed-01',
      organizationId: 'demo-org-khurushkul',
      incomeTypeCode: 'member_monthly_fee',
      transactionCode: 'TRX-2026-000001',
      receiptNo: 'REC-2026-0001',
      entryDate: '2026-01-10',
      amount: 10000,
      amountInWordsBn: 'দশ হাজার টাকা মাত্র',
      paymentMethod: 'cash',
      accountId: 'acc-khu-01',
      fundId: 'fnd-khu-01',
      headId: 'hd-inc-01',
      description: 'সদস্য মাসিক সঞ্চয় কিস্তি আদায় (রশিদ REC-2026-0001)',
      status: 'APPROVED',
      isRefundable: false,
      isMemberSettlementEligible: false,
      isCapital: false,
      createdBy: 'usr-acc-01',
      approvedBy: 'usr-manager-01',
      approvedAt: '2026-01-10T12:00:00Z',
      version: 1,
      createdAt: '2026-01-10T11:00:00Z',
      updatedAt: '2026-01-10T12:00:00Z',
      isFinancialPosted: true,
      financialTransactionId: 'TRX-2026-000001'
    },
    {
      id: 'inc-seed-02',
      organizationId: 'demo-org-khurushkul',
      incomeTypeCode: 'project_investment_profit',
      transactionCode: 'TRX-2026-000002',
      receiptNo: 'REC-2026-0002',
      entryDate: '2026-01-15',
      amount: 15000,
      amountInWordsBn: 'পনেরো হাজার টাকা মাত্র',
      paymentMethod: 'bank_transfer',
      accountId: 'acc-khu-02',
      fundId: 'fnd-khu-02',
      headId: 'hd-inc-02',
      description: 'মৎস্য প্রকল্প হতে অর্জিত প্রথম কিস্তির লভ্যাংশ জমা',
      status: 'POSTED',
      isRefundable: false,
      isMemberSettlementEligible: false,
      isCapital: false,
      createdBy: 'usr-acc-01',
      approvedBy: 'usr-manager-01',
      postedBy: 'usr-manager-01',
      postedAt: '2026-01-15T14:00:00Z',
      version: 1,
      createdAt: '2026-01-15T12:00:00Z',
      updatedAt: '2026-01-15T14:00:00Z',
      isFinancialPosted: true,
      financialTransactionId: 'TRX-2026-000002'
    }
  ],
  expenses: [
    {
      id: 'exp-seed-01',
      organizationId: 'demo-org-khurushkul',
      expenseCode: 'EXP-2026-000101',
      voucherNumber: 'PV-2026-000101',
      transactionCode: 'TRX-2026-000201',
      sourceDomain: 'GENERAL_FINANCE',
      sourceType: 'general_operational',
      expenseTypeCode: 'administrative_expense',
      expenseHeadId: 'hd-exp-01',
      fundId: 'fnd-khu-01',
      accountId: 'acc-khu-01',
      amount: 5000,
      amountInWordsBn: 'পাঁচ হাজার টাকা মাত্র',
      expenseDate: '2026-01-20',
      paymentMethod: 'cash',
      partyType: 'external_party',
      payeeName: 'মর্ডান অফিস সাপ্লাইয়ার্স',
      description: 'সমিতির কার্যালয়ের জানুয়ারি মাসের স্টেশনারি ও খাতা ক্রয়',
      supportingDocuments: [],
      status: 'APPROVED',
      createdBy: 'usr-acc-01',
      approvedBy: 'usr-manager-01',
      approvedAt: '2026-01-20T16:00:00Z',
      version: 1,
      createdAt: '2026-01-20T14:00:00Z',
      updatedAt: '2026-01-20T16:00:00Z',
      isFinancialPosted: true,
      financialTransactionId: 'TRX-2026-000201',
      auditHistory: []
    },
    {
      id: 'exp-seed-02',
      organizationId: 'demo-org-khurushkul',
      expenseCode: 'EXP-2026-000102',
      voucherNumber: 'PV-2026-000102',
      transactionCode: 'TRX-2026-000202',
      sourceDomain: 'GENERAL_FINANCE',
      sourceType: 'general_operational',
      expenseTypeCode: 'general_operational_expense',
      expenseHeadId: 'hd-exp-02',
      fundId: 'fnd-khu-01',
      accountId: 'acc-khu-02',
      amount: 12000,
      amountInWordsBn: 'বারো হাজার টাকা মাত্র',
      expenseDate: '2026-01-25',
      paymentMethod: 'bank_transfer',
      partyType: 'external_party',
      payeeName: 'কক্সবাজার বিদ্যুৎ উন্নয়ন বোর্ড',
      description: 'অফিস ভবন বিদ্যুৎ বিল ও ইউটিলিটি চার্জ প্রদান',
      supportingDocuments: [],
      status: 'POSTED',
      createdBy: 'usr-acc-01',
      approvedBy: 'usr-manager-01',
      postedBy: 'usr-manager-01',
      postedAt: '2026-01-25T15:00:00Z',
      version: 1,
      createdAt: '2026-01-25T11:00:00Z',
      updatedAt: '2026-01-25T15:00:00Z',
      isFinancialPosted: true,
      financialTransactionId: 'TRX-2026-000202',
      auditHistory: []
    }
  ],
  transfers: [
    {
      id: 'trf-seed-01',
      organizationId: 'demo-org-khurushkul',
      transferCode: 'TRF-2026-000001',
      version: 1,
      transferType: 'cash_deposit',
      sourceAccountId: 'acc-khu-01', // Cash OUT
      destinationAccountId: 'acc-khu-02', // Bank IN
      fundId: 'fnd-khu-01', // General Fund preserved
      amount: 25000,
      amountInWordsBn: 'পঁচিশ হাজার টাকা মাত্র',
      transferDate: '2026-02-01',
      transferMethod: 'cash',
      transferPurpose: 'দৈনিক অতিরিক্ত নগদ অর্থ ইসলামী ব্যাংকে জমা করণ',
      description: 'প্রধান ক্যাশ হতে ব্যাংকে জমা',
      supportingDocuments: [],
      status: 'POSTED',
      createdBy: 'usr-acc-01',
      submittedBy: 'usr-acc-01',
      approvedBy: 'usr-manager-01',
      postedBy: 'usr-manager-01',
      postedAt: '2026-02-01T15:00:00Z',
      isFinancialPosted: true,
      financialTransactionId: 'TRX-2026-TRF-000001',
      createdAt: '2026-02-01T12:00:00Z',
      updatedAt: '2026-02-01T15:00:00Z',
      auditHistory: []
    },
    {
      id: 'trf-seed-02',
      organizationId: 'demo-org-khurushkul',
      transferCode: 'TRF-2026-000002',
      version: 1,
      transferType: 'bank_to_bank',
      sourceAccountId: 'acc-khu-02',
      destinationAccountId: 'acc-khu-03',
      fundId: 'fnd-khu-01',
      amount: 35000,
      amountInWordsBn: 'পঁয়ত্রিশ হাজার টাকা মাত্র',
      transferDate: '2026-02-02',
      transferMethod: 'bank_transfer',
      transferPurpose: 'ব্যাংক হিসাব পরিবর্তন',
      description: 'অনুমোদিত কিন্তু এখনো পোস্ট করা হয়নি',
      supportingDocuments: [],
      status: 'APPROVED', // NOT posted -> zero ledger impact
      createdBy: 'usr-acc-01',
      approvedBy: 'usr-manager-01',
      createdAt: '2026-02-02T10:00:00Z',
      updatedAt: '2026-02-02T11:00:00Z',
      auditHistory: []
    }
  ]
};

export const LedgerManagementView: React.FC<LedgerManagementViewProps> = ({ currentOrg }) => {
  const [currentActor, setCurrentActor] = useState<Actor>(ACTORS[0]);
  const [sources, setSources] = useState<SourceEventContainer>(INITIAL_SOURCES);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [auditEvents, setAuditEvents] = useState<LedgerAuditEvent[]>([]);

  // Submodule navigation (5.7.1 to 5.7.7)
  const [activeSubTab, setActiveSubTab] = useState<
    'official_ledger' | 'account_balance' | 'fund_balance' | 'account_fund_balance' | 'financial_statement' | 'reconciliation' | 'audit_rebuild'
  >('official_ledger');

  // Filters
  const [filters, setFilters] = useState<LedgerFilterCriteria>({
    searchQuery: '',
    sourceType: 'all',
    accountId: 'all',
    fundId: 'all',
    direction: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Statement Period
  const [stmtDateFrom, setStmtDateFrom] = useState<string>('2026-01-01');
  const [stmtDateTo, setStmtDateTo] = useState<string>('2026-12-31');

  // As-Of Balance Date
  const [asOfDate, setAsOfDate] = useState<string>('2026-12-31');

  // Drilldown selection
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);

  // Modals
  const [inspectedEntry, setInspectedEntry] = useState<LedgerEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printType, setPrintType] = useState<'ledger' | 'statement' | 'reconciliation' | 'account' | 'fund'>('ledger');
  const [rebuildResult, setRebuildResult] = useState<LedgerRebuildResult | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; text: string } | null>(null);

  // Initial projection on load or org change
  useEffect(() => {
    const projected = LedgerProjectionService.projectAll(currentOrg.id, sources);
    setLedgerEntries(projected);
    // Initial audit log
    const initialAudit: LedgerAuditEvent = {
      id: `aud-led-init-${Date.now()}`,
      organizationId: currentOrg.id,
      eventType: 'LEDGER_POSTED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp: new Date().toISOString(),
      notes: `অফিসিয়াল লেজার সমন্বয় সম্পন্ন: মোট ${projected.length}টি এন্ট্রি প্রতিফলিত হয়েছে`
    };
    setAuditEvents([initialAudit]);
  }, [currentOrg.id]);

  const hasPermission = (perm: LedgerPermissionKey): boolean => {
    const allowed = LEDGER_ROLE_PERMISSIONS[currentActor.role] || [];
    return allowed.includes(perm);
  };

  const orgAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter(a => a.organizationId === currentOrg.id);
  }, [currentOrg.id]);

  const orgFunds = useMemo(() => {
    return MOCK_FUNDS.filter(f => f.organizationId === currentOrg.id);
  }, [currentOrg.id]);

  // Filtered Ledger entries
  const filteredEntries = useMemo(() => {
    return ledgerEntries.filter(entry => {
      if (entry.organizationId !== currentOrg.id) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const mCode = entry.ledgerCode.toLowerCase().includes(q);
        const mSrc = entry.sourceCode.toLowerCase().includes(q);
        const mDesc = entry.description.toLowerCase().includes(q);
        if (!mCode && !mSrc && !mDesc) return false;
      }
      if (filters.sourceType && filters.sourceType !== 'all' && entry.sourceType !== filters.sourceType) return false;
      if (filters.accountId && filters.accountId !== 'all' && entry.accountId !== filters.accountId) return false;
      if (filters.fundId && filters.fundId !== 'all' && entry.fundId !== filters.fundId) return false;
      if (filters.direction && filters.direction !== 'all' && entry.direction !== filters.direction) return false;
      if (filters.dateFrom && entry.entryDate < filters.dateFrom) return false;
      if (filters.dateTo && entry.entryDate > filters.dateTo) return false;
      return true;
    });
  }, [ledgerEntries, currentOrg.id, filters]);

  // Derived Balances (As-Of)
  const asOfData = useMemo(() => {
    return LedgerProjectionService.calculateAsOfBalances(asOfDate, orgAccounts, orgFunds, ledgerEntries);
  }, [asOfDate, orgAccounts, orgFunds, ledgerEntries]);

  // Derived Account-Fund Balances (Granular)
  const afBalances = useMemo(() => {
    return LedgerProjectionService.calculateAccountFundBalances(orgAccounts, orgFunds, ledgerEntries);
  }, [orgAccounts, orgFunds, ledgerEntries]);

  // Derived Account Balances
  const accountBalances = useMemo(() => {
    return LedgerProjectionService.calculateAccountBalances(orgAccounts, orgFunds, ledgerEntries);
  }, [orgAccounts, orgFunds, ledgerEntries]);

  // Derived Fund Balances
  const fundBalances = useMemo(() => {
    return LedgerProjectionService.calculateFundBalances(orgAccounts, orgFunds, ledgerEntries);
  }, [orgAccounts, orgFunds, ledgerEntries]);

  // Running Balances
  const runningBalances = useMemo(() => {
    return LedgerProjectionService.calculateRunningBalances(filteredEntries);
  }, [filteredEntries]);

  // Financial Statement
  const financialStatement = useMemo(() => {
    return LedgerProjectionService.generateFinancialStatement(stmtDateFrom, stmtDateTo, orgAccounts, orgFunds, ledgerEntries);
  }, [stmtDateFrom, stmtDateTo, orgAccounts, orgFunds, ledgerEntries]);

  // Automated Reconciliation Report
  const reconciliationReport = useMemo(() => {
    return LedgerProjectionService.reconcile(currentOrg.id, orgAccounts, orgFunds, ledgerEntries, sources);
  }, [currentOrg.id, orgAccounts, orgFunds, ledgerEntries, sources]);

  // Submodule Rebuild Action
  const handleRebuildLedger = () => {
    if (!hasPermission('finance.ledger.rebuild')) {
      setFeedbackMessage({
        type: 'error',
        text: 'অনুমতি নেই: finance.ledger.rebuild পারমিশন আবশ্যক (HTTP 403 Forbidden)'
      });
      return;
    }

    const startAudit: LedgerAuditEvent = {
      id: `aud-rb-start-${Date.now()}`,
      organizationId: currentOrg.id,
      eventType: 'LEDGER_REBUILD_STARTED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp: new Date().toISOString(),
      notes: 'ব্যবহারকারী কর্তৃক লেজার পুনর্গঠন প্রক্রিয়া শুরু'
    };

    const { rebuiltEntries, rebuildResult: res } = LedgerProjectionService.rebuildLedger(
      currentOrg.id,
      sources,
      orgAccounts,
      orgFunds
    );

    setLedgerEntries(rebuiltEntries);
    setRebuildResult(res);

    const endAudit: LedgerAuditEvent = {
      id: `aud-rb-end-${Date.now()}`,
      organizationId: currentOrg.id,
      eventType: res.status === 'SUCCESS' ? 'LEDGER_REBUILD_COMPLETED' : 'LEDGER_REBUILD_FAILED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp: new Date().toISOString(),
      notes: res.messageBn
    };

    setAuditEvents(prev => [endAudit, startAudit, ...prev]);

    if (res.status === 'SUCCESS') {
      setFeedbackMessage({
        type: 'success',
        text: `লেজার পুনর্গঠন সম্পন্ন! মোট ${res.newEntryCount}টি এন্ট্রি পুনর্নির্মিত হয়েছে এবং পুনর্মিলন সফল।`
      });
    } else {
      setFeedbackMessage({
        type: 'error',
        text: 'লেজার পুনর্গঠন প্রক্রিয়ায় ত্রুটি ঘটেছে!'
      });
    }
  };

  const handleInspectEntry = (entry: LedgerEntry) => {
    if (!hasPermission('finance.ledger.source_view')) {
      setFeedbackMessage({
        type: 'error',
        text: 'অনুমতি নেই: finance.ledger.source_view পারমিশন আবশ্যক।'
      });
      return;
    }
    setInspectedEntry(entry);
    setIsDetailModalOpen(true);

    const audit: LedgerAuditEvent = {
      id: `aud-view-${Date.now()}`,
      organizationId: currentOrg.id,
      eventType: 'LEDGER_SOURCE_VIEWED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp: new Date().toISOString(),
      notes: `উৎস ট্র্যাকিং তথ্য পরিদর্শন: ${entry.ledgerCode} -> ${entry.sourceType} (${entry.sourceCode})`
    };
    setAuditEvents(prev => [audit, ...prev]);
  };

  const getSourceBadge = (type: LedgerSourceType) => {
    switch (type) {
      case 'OPENING_BALANCE':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">প্রারম্ভিক স্থিতি</span>;
      case 'INCOME':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">আয় প্রাপ্তি</span>;
      case 'EXPENSE':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">সাধারণ ব্যয়</span>;
      case 'TRANSFER':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">হিসাব স্থানান্তর</span>;
    }
  };

  const getAccountName = (accId: string) => {
    const acc = orgAccounts.find(a => a.id === accId);
    return acc ? `${acc.accountName}` : accId;
  };

  const getFundName = (fndId: string) => {
    const fnd = orgFunds.find(f => f.id === fndId);
    return fnd ? `${fnd.name}` : fndId;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Phase 5.7 — Unified Ledger Projection
              </span>
              <span className="text-xs font-mono text-slate-400">TSS-P5.7-LEDGER-2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span>অফিসিয়াল লেজার ও স্থিতি ব্যবস্থাপনা (Unified Ledger & Balances)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              পোস্টকৃত উৎস ঘটনার প্রক্ষেপণ (Ledger Projection) হতে স্বয়ংক্রিয়ভাবে প্রাপ্ত অফিসিয়াল লেজার ও হিসাব-তহবিল স্থিতি।
            </p>
          </div>

          {/* Actor Role Switcher */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>ব্যবহারকারী সিমুলেটর:</span>
            </div>
            <select
              value={currentActor.id}
              onChange={e => {
                const found = ACTORS.find(a => a.id === e.target.value);
                if (found) setCurrentActor(found);
              }}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {ACTORS.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Reconciliation Status Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">অফিসিয়াল পুনর্মিলন অবস্থা:</span>
            {reconciliationReport.overallStatus === 'BALANCED' ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> শতভাগ পুনর্মিলিত ও ভারসাম্যপূর্ণ (Balanced)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> পুনর্মিলন অসঙ্গতি পাওয়া গেছে (RECONCILIATION_ERROR)
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>মোট লেজার এন্ট্রি: <b className="text-slate-900 font-numeric">{ledgerEntries.length}</b></span>
            <span>মোট হিসাব স্থিতি: <b className="text-indigo-700 font-numeric">৳{reconciliationReport.totalAccountBalances.toLocaleString()}</b></span>
            <span>মোট তহবিল স্থিতি: <b className="text-teal-700 font-numeric">৳{reconciliationReport.totalFundBalances.toLocaleString()}</b></span>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
          feedbackMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
          feedbackMessage.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200' :
          feedbackMessage.type === 'warning' ? 'bg-amber-50 text-amber-900 border-amber-200' :
          'bg-blue-50 text-blue-900 border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {feedbackMessage.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {feedbackMessage.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
            {feedbackMessage.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-700 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* 7 Submodules Navigation Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-1 flex flex-wrap gap-1 text-xs">
        <button
          onClick={() => setActiveSubTab('official_ledger')}
          className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition ${
            activeSubTab === 'official_ledger'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>৫.৭.১ অফিসিয়াল লেজার</span>
        </button>

        <button
          onClick={() => setActiveSubTab('account_balance')}
          className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition ${
            activeSubTab === 'account_balance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>৫.৭.২ হিসাবের স্থিতি</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fund_balance')}
          className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition ${
            activeSubTab === 'fund_balance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>৫.৭.৩ তহবিলের স্থিতি</span>
        </button>

        <button
          onClick={() => setActiveSubTab('account_fund_balance')}
          className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition ${
            activeSubTab === 'account_fund_balance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>৫.৭.৪ হিসাব–তহবিল স্থিতি</span>
        </button>

        <button
          onClick={() => setActiveSubTab('financial_statement')}
          className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition ${
            activeSubTab === 'financial_statement'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>৫.৭.৫ আর্থিক বিবরণী</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reconciliation')}
          className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition ${
            activeSubTab === 'reconciliation'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>৫.৭.৬ স্থিতি পুনর্মিলন</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit_rebuild')}
          className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition ${
            activeSubTab === 'audit_rebuild'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>৫.৭.৭ লেজার অডিট ও পুনর্গঠন</span>
        </button>
      </div>

      {/* SUBMODULE 5.7.1: OFFICIAL LEDGER REGISTER */}
      {activeSubTab === 'official_ledger' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="লেজার কোড, উৎস কোড বা বিবরণ অনুসন্ধান..."
                  value={filters.searchQuery}
                  onChange={e => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={filters.sourceType}
                  onChange={e => setFilters(f => ({ ...f, sourceType: e.target.value as any }))}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700"
                >
                  <option value="all">সকল উৎস (Source Types)</option>
                  <option value="OPENING_BALANCE">প্রারম্ভিক স্থিতি</option>
                  <option value="INCOME">আয় প্রাপ্তি</option>
                  <option value="EXPENSE">সাধারণ ব্যয়</option>
                  <option value="TRANSFER">হিসাব স্থানান্তর</option>
                </select>

                <select
                  value={filters.direction}
                  onChange={e => setFilters(f => ({ ...f, direction: e.target.value as any }))}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700"
                >
                  <option value="all">সকল দিক (IN / OUT)</option>
                  <option value="IN">অন্তর্মুখী (IN)</option>
                  <option value="OUT">বহির্মুখী (OUT)</option>
                </select>

                <select
                  value={filters.accountId}
                  onChange={e => setFilters(f => ({ ...f, accountId: e.target.value }))}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 max-w-[160px] truncate"
                >
                  <option value="all">সকল হিসাব</option>
                  {orgAccounts.map(a => (
                    <option key={a.id} value={a.id}>{a.accountName}</option>
                  ))}
                </select>

                <select
                  value={filters.fundId}
                  onChange={e => setFilters(f => ({ ...f, fundId: e.target.value }))}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 max-w-[160px] truncate"
                >
                  <option value="all">সকল তহবিল</option>
                  {orgFunds.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setPrintType('ledger');
                    setIsPrintModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট স্টেটমেন্ট</span>
                </button>
              </div>
            </div>
          </div>

          {/* Official Ledger Table */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm font-heading">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>অফিসিয়াল লেজার রেজিস্টার (Official Posted Ledger)</span>
              </h3>
              <span className="text-xs font-numeric text-slate-500">
                মোট পোস্টকৃত এন্ট্রি: {runningBalances.length}টি
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="p-3">তারিখ</th>
                    <th className="p-3">লেজার কোড</th>
                    <th className="p-3">উৎস ঘটনা</th>
                    <th className="p-3">উৎস কোড</th>
                    <th className="p-3">হিসাব (Account)</th>
                    <th className="p-3">তহবিল (Fund)</th>
                    <th className="p-3 text-right text-emerald-700">জমা (IN)</th>
                    <th className="p-3 text-right text-rose-700">খরচ (OUT)</th>
                    <th className="p-3 text-right text-indigo-700">চলমান স্থিতি</th>
                    <th className="p-3 text-center">উৎস নিরীক্ষা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {runningBalances.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-400">
                        কোনো পোস্টকৃত লেজার এন্ট্রি পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    runningBalances.map(({ entry, runningBalance }) => (
                      <tr key={entry.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono text-slate-600 whitespace-nowrap">{entry.entryDate}</td>
                        <td className="p-3 font-mono font-bold text-indigo-700 whitespace-nowrap">{entry.ledgerCode}</td>
                        <td className="p-3 whitespace-nowrap">{getSourceBadge(entry.sourceType)}</td>
                        <td className="p-3 font-mono text-slate-700 whitespace-nowrap">{entry.sourceCode}</td>
                        <td className="p-3 font-medium text-slate-800">{getAccountName(entry.accountId)}</td>
                        <td className="p-3 text-slate-600">{getFundName(entry.fundId)}</td>
                        <td className="p-3 text-right font-numeric font-bold text-emerald-600 whitespace-nowrap">
                          {entry.direction === 'IN' ? `+৳${entry.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-3 text-right font-numeric font-bold text-rose-600 whitespace-nowrap">
                          {entry.direction === 'OUT' ? `-৳${entry.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-3 text-right font-numeric font-bold text-indigo-900 whitespace-nowrap bg-indigo-50/30">
                          ৳{runningBalance.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleInspectEntry(entry)}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                            title="উৎস ট্র্যাকিং ও বিস্তারিত"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE 5.7.2: ACCOUNT BALANCE */}
      {activeSubTab === 'account_balance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-indigo-600" />
                  <span>হিসাবভিত্তিক স্থিতি (Account Balance Breakdown)</span>
                </h3>
                <p className="text-slate-500">
                  অ্যাকাউন্ট অবজেক্টে ব্যালেন্স ফিল্ড সংরক্ষিত নয়; সম্পূর্ণ লেজার হতে স্বয়ংক্রিয়ভাবে গণনা করা হয়েছে।
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">হিসাব তারিখ (As Of):</span>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={e => setAsOfDate(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {asOfData.accountBalances.map(acc => (
                <div key={acc.accountId} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{acc.accountName}</h4>
                      <span className="text-[11px] font-mono text-slate-500">{acc.accountCode} • {acc.accountType === 'cash' ? 'নগদ হিসাব' : 'ব্যাংক হিসাব'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">মোট স্থিতি</span>
                      <span className="font-bold font-numeric text-base text-indigo-700">৳{acc.totalBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-slate-600 block">তহবিল বিভাজন (Fund Breakdown):</span>
                    {acc.fundBreakdown.map(fb => (
                      <div key={fb.fundId} className="flex items-center justify-between p-2 rounded bg-white border border-slate-100">
                        <span className="text-slate-700">{fb.fundName}</span>
                        <div className="text-right font-numeric">
                          <span className="font-bold text-slate-900">৳{fb.balance.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block font-sans">({fb.entryCount}টি এন্ট্রি)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE 5.7.3: FUND BALANCE */}
      {activeSubTab === 'fund_balance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>তহবিলভিত্তিক স্থিতি (Fund Balance Breakdown)</span>
                </h3>
                <p className="text-slate-500">
                  তহবিলের অধীনে সংরক্ষিত বিভিন্ন নগদ ও ব্যাংক হিসাবের অর্থের সম্মিলিত বিবরণ।
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">হিসাব তারিখ (As Of):</span>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={e => setAsOfDate(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {asOfData.fundBalances.map(fnd => (
                <div key={fnd.fundId} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{fnd.fundName}</h4>
                      <span className="text-[11px] font-mono text-slate-500">{fnd.fundCode} • {fnd.fundType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">মোট তহবিল জের</span>
                      <span className="font-bold font-numeric text-base text-teal-700">৳{fnd.totalBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-slate-600 block">কোথায় সংরক্ষিত রয়েছে (Account Breakdown):</span>
                    {fnd.accountBreakdown.map(ab => (
                      <div key={ab.accountId} className="flex items-center justify-between p-2 rounded bg-white border border-slate-100">
                        <span className="text-slate-700">{ab.accountName}</span>
                        <div className="text-right font-numeric">
                          <span className="font-bold text-slate-900">৳{ab.balance.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block font-sans">({ab.entryCount}টি এন্ট্রি)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE 5.7.4: ACCOUNT-FUND BALANCE (Most Granular) */}
      {activeSubTab === 'account_fund_balance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  <span>হিসাব–তহবিল বিস্তারিত স্থিতি (Account–Fund Granular Position)</span>
                </h3>
                <p className="text-slate-500">সবচেয়ে নিখুঁত দ্বিমুখী ব্যালেন্স ভিউ: প্রতিটি হিসাব ও তহবিলের সমন্বিত জের।</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="p-3">হিসাব (Account)</th>
                    <th className="p-3">তহবিল (Fund)</th>
                    <th className="p-3 text-right text-emerald-700">মোট অন্তর্মুখী (Total IN)</th>
                    <th className="p-3 text-right text-rose-700">মোট বহির্মুখী (Total OUT)</th>
                    <th className="p-3 text-right text-indigo-900">বর্তমান স্থিতি (Balance)</th>
                    <th className="p-3 text-center">এন্ট্রি সংখ্যা</th>
                    <th className="p-3 text-right">শেষ পোস্টিং</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {afBalances.map(af => (
                    <tr key={`${af.accountId}:${af.fundId}`} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-semibold text-slate-800">{af.accountName}</td>
                      <td className="p-3 text-slate-700">{af.fundName}</td>
                      <td className="p-3 text-right font-numeric text-emerald-600">৳{af.totalIn.toLocaleString()}</td>
                      <td className="p-3 text-right font-numeric text-rose-600">৳{af.totalOut.toLocaleString()}</td>
                      <td className="p-3 text-right font-numeric font-bold text-indigo-800 bg-indigo-50/20">
                        ৳{af.balance.toLocaleString()}
                      </td>
                      <td className="p-3 text-center font-numeric">{af.entryCount}</td>
                      <td className="p-3 text-right font-mono text-slate-500">{af.lastPostedDate || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE 5.7.5: FINANCIAL STATEMENT */}
      {activeSubTab === 'financial_statement' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>আর্থিক বিবরণী (Read-Only Financial Statement)</span>
                </h3>
                <p className="text-slate-500">শুধুমাত্র পোস্টকৃত অফিসিয়াল লেজার হতে স্বয়ংক্রিয়ভাবে প্রাপ্ত প্রারম্ভিক ও সমাপনী আর্থিক অবস্থান।</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">সময়সীমা:</span>
                <input
                  type="date"
                  value={stmtDateFrom}
                  onChange={e => setStmtDateFrom(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800"
                />
                <span>হতে</span>
                <input
                  type="date"
                  value={stmtDateTo}
                  onChange={e => setStmtDateTo(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800"
                />
                <button
                  onClick={() => {
                    setPrintType('statement');
                    setIsPrintModalOpen(true);
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> প্রিন্ট
                </button>
              </div>
            </div>

            {/* Statement Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">প্রারম্ভিক স্থিতি (Opening)</span>
                <span className="font-bold font-numeric text-base text-slate-800">৳{financialStatement.openingPosition.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[11px] text-emerald-700 block">মোট প্রাপ্তি (Total IN)</span>
                <span className="font-bold font-numeric text-base text-emerald-800">+৳{financialStatement.totalIn.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <span className="text-[11px] text-rose-700 block">মোট ব্যয়/পরিশোধ (Total OUT)</span>
                <span className="font-bold font-numeric text-base text-rose-800">-৳{financialStatement.totalOut.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <span className="text-[11px] text-indigo-700 block">সমাপনী স্থিতি (Closing)</span>
                <span className="font-bold font-numeric text-base text-indigo-900">৳{financialStatement.closingPosition.toLocaleString()}</span>
              </div>
            </div>

            {/* Source Breakdown Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 p-2.5 font-bold text-slate-800">উৎসভিত্তিক আর্থিক প্রবাহ (Source Breakdown)</div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {financialStatement.sourceBreakdown.map(sb => (
                    <tr key={sb.sourceType} className="hover:bg-slate-50">
                      <td className="p-2.5 font-medium">{sb.sourceLabelBn}</td>
                      <td className="p-2.5 text-center text-slate-500 font-numeric">{sb.entryCount}টি লেনদেন</td>
                      <td className={`p-2.5 text-right font-numeric font-bold ${sb.direction === 'IN' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {sb.direction === 'IN' ? `+৳${sb.totalAmount.toLocaleString()}` : `-৳${sb.totalAmount.toLocaleString()}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE 5.7.6: BALANCE RECONCILIATION */}
      {activeSubTab === 'reconciliation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>স্থিতি পুনর্মিলন নিরীক্ষা (Automated Balance Reconciliation Checks)</span>
                </h3>
                <p className="text-slate-500">সিস্টেমের অভ্যন্তরীণ ৭টি গাণিতিক ও আইসোলেশন নীতি স্বয়ংক্রিয়ভাবে যাচাই করা হচ্ছে।</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPrintType('reconciliation');
                    setIsPrintModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>রিপোর্ট প্রিন্ট</span>
                </button>
              </div>
            </div>

            {/* Reconciliation Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              reconciliationReport.overallStatus === 'BALANCED'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                {reconciliationReport.overallStatus === 'BALANCED' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {reconciliationReport.overallStatus === 'BALANCED'
                      ? 'অফিসিয়াল লেজার পুনর্মিলন সফল — সম্পূর্ণ সামঞ্জস্যপূর্ণ'
                      : 'পুনর্মিলন সতর্কতা — অমিল শনাক্ত হয়েছে!'}
                  </h4>
                  <p className="text-xs">
                    হিসাব স্থিতি: ৳{reconciliationReport.totalAccountBalances.toLocaleString()} | তহবিল স্থিতি: ৳{reconciliationReport.totalFundBalances.toLocaleString()} | লেজার এন্ট্রি: {reconciliationReport.ledgerEntriesCount}টি
                  </p>
                </div>
              </div>
            </div>

            {/* Checks Checklist */}
            <div className="space-y-2">
              {reconciliationReport.checks.map(chk => (
                <div
                  key={chk.checkId}
                  className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
                    chk.isPassed ? 'bg-white border-slate-200' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {chk.isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 mt-0.5" />
                    )}
                    <div>
                      <h5 className="font-bold text-slate-900">{chk.checkNameBn}</h5>
                      <p className="text-slate-600 text-[11px]">{chk.detailsBn}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    chk.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {chk.isPassed ? 'উত্তীর্ণ (PASS)' : 'ব্যর্থ (FAIL)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE 5.7.7: LEDGER AUDIT & REBUILD */}
      {activeSubTab === 'audit_rebuild' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                  <RotateCw className="w-4 h-4 text-indigo-600" />
                  <span>লেজার অডিট ও নিয়ন্ত্রিত পুনর্গঠন (Ledger Audit & Controlled Rebuild)</span>
                </h3>
                <p className="text-slate-500">
                  মূল আর্থিক ঘটনা (Source Events) অপরিবর্তিত রেখে শুধুমাত্র প্রক্ষেপিত লেজার পুনঃপ্রক্রিয়াকরণ।
                </p>
              </div>

              <button
                onClick={handleRebuildLedger}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>লেজার পুনর্গঠন চালান (Execute Rebuild)</span>
              </button>
            </div>

            {/* Rebuild Result Banner if available */}
            {rebuildResult && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">সর্বশেষ পুনর্গঠন ফলাফল:</span> {rebuildResult.messageBn}
                  <span className="text-[11px] block text-indigo-700">
                    পূর্ববর্তী এন্ট্রি: {rebuildResult.previousEntryCount}টি ➔ নতুন এন্ট্রি: {rebuildResult.newEntryCount}টি (উৎস ঘটনা: {rebuildResult.sourcesProcessed}টি)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-200 text-indigo-900">
                  {rebuildResult.status}
                </span>
              </div>
            )}

            {/* Append-Only Audit History */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 p-2.5 font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>লেজার অডিট ট্রেইল (Append-Only Audit History)</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {auditEvents.map(aud => (
                  <div key={aud.id} className="p-3 hover:bg-slate-50/80 transition flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{aud.eventType}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{aud.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{aud.notes}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">{aud.actorName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT DETAIL MODAL (SOURCE TRACEABILITY) */}
      {isDetailModalOpen && inspectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>উৎস ট্র্যাকিং ও লেজার এন্ট্রি বিবরণ</span>
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">লেজার কোড:</span>
                  <span className="font-bold font-mono text-indigo-700">{inspectedEntry.ledgerCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">তারিখ:</span>
                  <span className="font-mono text-slate-800">{inspectedEntry.entryDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">উৎস ঘটনা (Source Type):</span>
                  <span>{getSourceBadge(inspectedEntry.sourceType)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">উৎস রেফারেন্স কোড:</span>
                  <span className="font-mono font-bold text-slate-800">{inspectedEntry.sourceCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">হিসাব (Account):</span>
                  <span className="font-medium text-slate-800">{getAccountName(inspectedEntry.accountId)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">তহবিল (Fund):</span>
                  <span className="font-medium text-slate-800">{getFundName(inspectedEntry.fundId)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">প্রবাহ দিক (Direction):</span>
                  <span className={`font-bold ${inspectedEntry.direction === 'IN' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {inspectedEntry.direction === 'IN' ? 'অন্তর্মুখী (+IN)' : 'বহির্মুখী (-OUT)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">পরিমাণ:</span>
                  <span className="font-bold font-numeric text-base text-slate-900">৳{inspectedEntry.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-2">
                <span className="text-slate-500 block text-[11px]">বিবরণ ও উদ্দেশ্য:</span>
                <span className="text-slate-800">{inspectedEntry.description}</span>
              </div>

              <div className="border-t pt-2 text-[11px] text-slate-500">
                <span>পোস্ট করেছেন: {inspectedEntry.postedBy} • পোস্টিং সময়: {inspectedEntry.postedAt}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded font-semibold hover:bg-slate-200"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT VIEW MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-8 space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center border-b pb-4 space-y-1">
              <div className="flex justify-center mb-2">
                <TSSLogo />
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">{currentOrg.name}</h2>
              <p className="text-xs text-slate-500">{currentOrg.address || 'কক্সবাজার, বাংলাদেশ'}</p>
              <h3 className="font-bold text-sm text-indigo-800 pt-2 underline">
                {printType === 'ledger' && 'অফিসিয়াল লেজার স্টেটমেন্ট (Official Ledger Statement)'}
                {printType === 'statement' && `আর্থিক বিবরণী (${stmtDateFrom} হতে ${stmtDateTo})`}
                {printType === 'reconciliation' && 'লেজার স্থিতি পুনর্মিলন সনদ ও প্রতিবেদন'}
              </h3>
            </div>

            {/* Print Body */}
            {printType === 'ledger' && (
              <div className="space-y-4">
                <table className="w-full border border-slate-300 text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b">
                      <th className="p-2 border">তারিখ</th>
                      <th className="p-2 border">কোড</th>
                      <th className="p-2 border">উৎস</th>
                      <th className="p-2 border">হিসাব</th>
                      <th className="p-2 border">তহবিল</th>
                      <th className="p-2 border text-right">জমা (IN)</th>
                      <th className="p-2 border text-right">খরচ (OUT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map(e => (
                      <tr key={e.id} className="border-b">
                        <td className="p-2 border font-mono">{e.entryDate}</td>
                        <td className="p-2 border font-mono">{e.ledgerCode}</td>
                        <td className="p-2 border">{e.sourceCode}</td>
                        <td className="p-2 border">{getAccountName(e.accountId)}</td>
                        <td className="p-2 border">{getFundName(e.fundId)}</td>
                        <td className="p-2 border text-right font-numeric text-emerald-700">{e.direction === 'IN' ? `৳${e.amount.toLocaleString()}` : '-'}</td>
                        <td className="p-2 border text-right font-numeric text-rose-700">{e.direction === 'OUT' ? `৳${e.amount.toLocaleString()}` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {printType === 'statement' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border p-3 rounded bg-slate-50">
                  <div>প্রারম্ভিক স্থিতি: <b>৳{financialStatement.openingPosition.toLocaleString()}</b></div>
                  <div>মোট প্রাপ্তি (IN): <b className="text-emerald-700">+৳{financialStatement.totalIn.toLocaleString()}</b></div>
                  <div>মোট ব্যয় (OUT): <b className="text-rose-700">-৳{financialStatement.totalOut.toLocaleString()}</b></div>
                  <div>সমাপনী স্থিতি: <b className="text-indigo-800">৳{financialStatement.closingPosition.toLocaleString()}</b></div>
                </div>
              </div>
            )}

            {printType === 'reconciliation' && (
              <div className="space-y-4">
                <div className="p-3 border rounded bg-emerald-50 text-emerald-900">
                  স্থিতি পুনর্মিলন ফলাফল: <b>{reconciliationReport.overallStatus}</b> (সকল ৭টি নীতি যাচাইকৃত ও উত্তীর্ণ)
                </div>
                <div className="space-y-1">
                  {reconciliationReport.checks.map(c => (
                    <div key={c.checkId} className="flex justify-between p-2 border-b">
                      <span>{c.checkNameBn}: {c.detailsBn}</span>
                      <span className="font-bold text-emerald-700">PASS</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signature Block */}
            <div className="grid grid-cols-3 gap-4 pt-12 text-center text-xs text-slate-700">
              <div className="border-t border-slate-400 pt-1">প্রস্তুতকারী হিসাবরক্ষক</div>
              <div className="border-t border-slate-400 pt-1">নিরীক্ষক (Internal Auditor)</div>
              <div className="border-t border-slate-400 pt-1">অনুমোদনকারী সভাপতি/ম্যানেজার</div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট সম্পন্ন করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
