import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  History,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Search,
  Filter,
  Eye,
  ArrowRight,
  ShieldCheck,
  Building2,
  Wallet,
  Landmark,
  Layers,
  FileText,
  UserCheck,
  Lock,
  PlusCircle,
  HelpCircle,
  Calendar,
  ExternalLink,
  ChevronRight,
  Download,
  SlidersHorizontal,
  RefreshCw,
  Info,
  GitFork,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import {
  OrganizationContext,
  ReversalEntry,
  ReversalStatus,
  ReversalReasonCode,
  ReversalPermissionKey,
  ReversalFilterCriteria,
  CorrectionEntry,
  CorrectionType,
  CorrectionReasonCode,
  CorrectionStatus,
  CorrectionPermissionKey,
  CorrectionFilterCriteria,
  CorrectionSnapshot,
  Account,
  Fund,
  OpeningBalanceEntry,
  IncomeEntry,
  ExpenseEntry,
  TransferEntry,
  LedgerSourceType
} from '../types';
import { SafeMoney } from '../utils/safeMoney';
import { numberToBengaliWords } from '../utils/bengaliNumberWords';
import { TSSLogo } from '../branding';

interface ReversalCorrectionManagementViewProps {
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

const REVERSAL_PERMISSIONS: Record<UserRole, (ReversalPermissionKey | CorrectionPermissionKey)[]> = {
  admin: [
    'finance.reversal.view',
    'finance.reversal.create',
    'finance.reversal.edit',
    'finance.reversal.submit',
    'finance.reversal.approve',
    'finance.reversal.reject',
    'finance.reversal.reopen',
    'finance.reversal.post',
    'finance.reversal.print',
    'finance.correction.view',
    'finance.correction.create',
    'finance.correction.edit',
    'finance.correction.submit',
    'finance.correction.approve',
    'finance.correction.reject',
    'finance.correction.reopen',
    'finance.correction.complete',
    'finance.correction.print'
  ],
  manager: [
    'finance.reversal.view',
    'finance.reversal.create',
    'finance.reversal.edit',
    'finance.reversal.submit',
    'finance.reversal.approve',
    'finance.reversal.reject',
    'finance.reversal.reopen',
    'finance.reversal.post',
    'finance.reversal.print',
    'finance.correction.view',
    'finance.correction.create',
    'finance.correction.edit',
    'finance.correction.submit',
    'finance.correction.approve',
    'finance.correction.reject',
    'finance.correction.reopen',
    'finance.correction.complete',
    'finance.correction.print'
  ],
  accountant: [
    'finance.reversal.view',
    'finance.reversal.create',
    'finance.reversal.edit',
    'finance.reversal.submit',
    'finance.reversal.print',
    'finance.correction.view',
    'finance.correction.create',
    'finance.correction.edit',
    'finance.correction.submit',
    'finance.correction.print'
  ],
  viewer: [
    'finance.reversal.view',
    'finance.reversal.print',
    'finance.correction.view',
    'finance.correction.print'
  ]
};

const REVERSAL_REASONS: { code: ReversalReasonCode; labelBn: string }[] = [
  { code: 'wrong_entry', labelBn: '১. ভুল এন্ট্রি (Wrong Entry)' },
  { code: 'duplicate_entry', labelBn: '২. ডুপ্লিকেট এন্ট্রি (Duplicate Entry)' },
  { code: 'wrongly_posted', labelBn: '৩. ভুলভাবে পোস্টকৃত (Wrongly Posted)' },
  { code: 'transaction_cancelled', labelBn: '৪. ট্রানজাকশন বাতিল (Transaction Cancelled)' },
  { code: 'pre_correction', labelBn: '৫. সংশোধনের পূর্বধাপ (Pre-requisite for Correction)' },
  { code: 'other', labelBn: '৬. অন্যান্য (Other - বিবরণ আবশ্যক)' },
];

const CORRECTION_REASONS: { code: CorrectionReasonCode; labelBn: string }[] = [
  { code: 'wrong_amount', labelBn: '১. ভুল টাকার পরিমাণ (Wrong Amount)' },
  { code: 'wrong_head', labelBn: '২. ভুল হিসাব খাত / Head (Wrong Head)' },
  { code: 'wrong_fund', labelBn: '৩. ভুল তহবিল / Fund (Wrong Fund)' },
  { code: 'wrong_account', labelBn: '৪. ভুল অ্যাকাউন্ট / ব্যাংক (Wrong Account)' },
  { code: 'wrong_date', labelBn: '৫. ভুল লেনদেনের তারিখ (Wrong Date)' },
  { code: 'wrong_party', labelBn: '৬. ভুল সদস্য / পার্টি (Wrong Party/Source)' },
  { code: 'duplicate_entry', labelBn: '৭. ডুপ্লিকেট এন্ট্রি (Duplicate Entry)' },
  { code: 'wrong_source_domain', labelBn: '৮. ভুল ডোমেইন শ্রেণি (Wrong Source Domain)' },
  { code: 'other', labelBn: '৯. অন্যান্য (Other - বিবরণ আবশ্যক)' },
];

// Mock Master Data for Testing & Demonstration
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
    associatedFundIds: ['fnd-khu-01', 'fnd-khu-02'],
    openingBalanceSupported: true,
    isSystemDefined: false,
    status: 'active',
    sortOrder: 2,
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
    isSystemDefined: true,
    isActive: true,
    status: 'active',
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
    name: 'কল্যাণ ও অনুদান তহবিল (Welfare Fund)',
    fundType: 'custom',
    isSystemDefined: false,
    isActive: true,
    status: 'active',
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  }
];

// Initial Posted Sources for Simulation
const INITIAL_INCOMES: IncomeEntry[] = [
  {
    id: 'inc-posted-01',
    organizationId: 'demo-org-khurushkul',
    incomeTypeCode: 'member_monthly_fee',
    transactionCode: 'TRX-2026-INC-001',
    receiptNo: 'REC-2026-000101',
    entryDate: '2026-02-01',
    amount: 15000,
    amountInWordsBn: 'পনের হাজার টাকা মাত্র',
    paymentMethod: 'cash',
    accountId: 'acc-khu-01',
    fundId: 'fnd-khu-01',
    headId: 'head-inc-01',
    description: 'মাসিক সঞ্চয় কিস্তি আদায় (রশিদ নং ১০১)',
    status: 'APPROVED',
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    createdBy: 'usr-acc-01',
    approvedBy: 'usr-admin-01',
    approvedAt: '2026-02-01T10:00:00Z',
    isFinancialPosted: true,
    financialTransactionId: 'FIN-TRX-INC-001',
    version: 1,
    createdAt: '2026-02-01T09:30:00Z',
    updatedAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'inc-posted-02',
    organizationId: 'demo-org-khurushkul',
    incomeTypeCode: 'donation',
    transactionCode: 'TRX-2026-INC-002',
    receiptNo: 'REC-2026-000102',
    entryDate: '2026-02-05',
    amount: 25000,
    amountInWordsBn: 'পঁচিশ হাজার টাকা মাত্র',
    paymentMethod: 'bank_transfer',
    accountId: 'acc-khu-02',
    fundId: 'fnd-khu-02',
    headId: 'head-inc-02',
    description: 'কল্যাণ তহবিলে অনুদান জমা',
    status: 'APPROVED',
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    createdBy: 'usr-acc-01',
    approvedBy: 'usr-admin-01',
    approvedAt: '2026-02-05T11:00:00Z',
    isFinancialPosted: true,
    financialTransactionId: 'FIN-TRX-INC-002',
    version: 1,
    createdAt: '2026-02-05T10:30:00Z',
    updatedAt: '2026-02-05T11:00:00Z'
  }
];

const INITIAL_EXPENSES: ExpenseEntry[] = [
  {
    id: 'exp-posted-01',
    organizationId: 'demo-org-khurushkul',
    expenseCode: 'EXP-2026-000101',
    voucherNumber: 'PV-2026-000101',
    transactionCode: 'TRX-2026-EXP-001',
    financialTransactionId: 'FIN-TRX-EXP-001',
    isFinancialPosted: true,
    sourceDomain: 'GENERAL_FINANCE',
    sourceType: 'general_operational',
    expenseTypeCode: 'general_operational_expense',
    expenseHeadId: 'head-exp-01',
    fundId: 'fnd-khu-01',
    accountId: 'acc-khu-01',
    amount: 8000,
    amountInWordsBn: 'আট হাজার টাকা মাত্র',
    expenseDate: '2026-02-03',
    paymentMethod: 'cash',
    partyType: 'external_party',
    payeeName: 'অফিস বাড়িওয়ালা',
    description: 'ফেব্রুয়ারি ২০২৬ মাসের অফিস ভাড়া পরিশোধ',
    supportingDocuments: [],
    status: 'APPROVED',
    createdBy: 'usr-acc-01',
    createdAt: '2026-02-03T09:00:00Z',
    approvedBy: 'usr-manager-01',
    approvedAt: '2026-02-03T10:30:00Z',
    version: 1,
    updatedAt: '2026-02-03T10:30:00Z',
    auditHistory: []
  }
];

const INITIAL_TRANSFERS: TransferEntry[] = [
  {
    id: 'trf-posted-01',
    organizationId: 'demo-org-khurushkul',
    transferCode: 'TRF-2026-000001',
    version: 1,
    transferType: 'cash_deposit',
    sourceAccountId: 'acc-khu-01',
    destinationAccountId: 'acc-khu-02',
    fundId: 'fnd-khu-01',
    amount: 10000,
    amountInWordsBn: 'দশ হাজার টাকা মাত্র',
    transferDate: '2026-02-04',
    transferMethod: 'bank_transfer',
    transferPurpose: 'ক্যাশ বাক্স হতে ব্যাংক অ্যাকাউন্টে জমা',
    description: 'নগদ উদ্বৃত্ত ব্যাংক ডিপোজিট',
    supportingDocuments: [],
    status: 'POSTED',
    createdBy: 'usr-acc-01',
    createdAt: '2026-02-04T10:00:00Z',
    updatedAt: '2026-02-04T11:00:00Z',
    approvedBy: 'usr-admin-01',
    approvedAt: '2026-02-04T10:30:00Z',
    postedBy: 'usr-admin-01',
    postedAt: '2026-02-04T11:00:00Z',
    isFinancialPosted: true,
    financialTransactionId: 'TRX-2026-TRF-000001',
    auditHistory: []
  }
];

const INITIAL_OPENING_BALANCES: OpeningBalanceEntry[] = [
  {
    id: 'ob-posted-01',
    organizationId: 'demo-org-khurushkul',
    openingBalanceCode: 'OB-2026-000001',
    version: 1,
    accountId: 'acc-khu-01',
    fundId: 'fnd-khu-01',
    amount: 50000,
    amountInWordsBn: 'পঞ্চাশ হাজার টাকা মাত্র',
    openingDate: '2026-01-01',
    reasonCode: 'system_migration',
    supportingDocuments: [],
    status: 'POSTED',
    createdBy: 'usr-acc-01',
    createdAt: '2026-01-01T09:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
    approvedBy: 'usr-admin-01',
    approvedAt: '2026-01-01T09:30:00Z',
    postedBy: 'usr-admin-01',
    postedAt: '2026-01-01T10:00:00Z',
    isFinancialPosted: true,
    financialTransactionId: 'TRX-2026-OB-000001',
    auditHistory: []
  }
];

// Initial Seed Reversals & Corrections
const INITIAL_REVERSALS: ReversalEntry[] = [
  {
    id: 'rev-khu-01',
    organizationId: 'demo-org-khurushkul',
    reversalCode: 'REV-2026-000001',
    version: 1,
    sourceType: 'INCOME',
    sourceId: 'inc-posted-01',
    sourceCode: 'REC-2026-000101',
    sourceDomain: 'GENERAL_FINANCE',
    reversalReasonCode: 'wrong_entry',
    reversalDate: '2026-02-02',
    originalAmount: 15000,
    reversalAmount: 15000,
    amountInWordsBn: 'পনের হাজার টাকা মাত্র',
    accountId: 'acc-khu-01',
    fundId: 'fnd-khu-01',
    originalPostedAt: '2026-02-01T10:00:00Z',
    originalPostedBy: 'usr-admin-01',
    status: 'POSTED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-02-02T10:00:00Z',
    approvedBy: 'usr-manager-01',
    approvedByName: 'আব্দুর রহমান (ম্যানেজার)',
    approvedAt: '2026-02-02T11:00:00Z',
    postedBy: 'usr-admin-01',
    postedByName: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
    postedAt: '2026-02-02T11:30:00Z',
    financialTransactionId: 'FIN-REV-2026-000001',
    isFinancialPosted: true,
    notes: 'ভুল রশিদ নম্বরে এন্ট্রি করায় সম্পূর্ণ রিভার্সাল সম্পন্ন।',
    createdAt: '2026-02-02T09:30:00Z',
    updatedAt: '2026-02-02T11:30:00Z',
    auditHistory: [
      {
        id: 'aud-rev-1',
        reversalId: 'rev-khu-01',
        eventType: 'REVERSAL_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন',
        timestamp: '2026-02-02T09:30:00Z',
        notes: 'রিভার্সাল এন্ট্রি তৈরি করা হয়েছে।'
      },
      {
        id: 'aud-rev-2',
        reversalId: 'rev-khu-01',
        eventType: 'REVERSAL_POSTED',
        actorId: 'usr-admin-01',
        actorName: 'মোঃ আরিফুল ইসলাম',
        timestamp: '2026-02-02T11:30:00Z',
        notes: 'লেজার পোস্টিং সম্পন্ন (FIN-REV-2026-000001)।'
      }
    ]
  }
];

const INITIAL_CORRECTIONS: CorrectionEntry[] = [
  {
    id: 'cor-khu-01',
    organizationId: 'demo-org-khurushkul',
    correctionCode: 'COR-2026-000001',
    version: 1,
    originalSourceId: 'inc-posted-01',
    originalSourceCode: 'REC-2026-000101',
    sourceType: 'INCOME',
    reversalId: 'rev-khu-01',
    reversalCode: 'REV-2026-000001',
    correctedSourceId: 'inc-posted-02',
    correctedSourceCode: 'REC-2026-000102',
    correctionType: 'FINANCIAL',
    reasonCode: 'wrong_amount',
    reasonDetails: 'আসল পরিমাণ ছিল ৳২৫,০০০, ভুলে ৳১৫,০০০ এন্ট্রি হয়েছিল।',
    originalSnapshot: {
      sourceCode: 'REC-2026-000101',
      sourceType: 'INCOME',
      amount: 15000,
      accountId: 'acc-khu-01',
      accountName: 'প্রধান ক্যাশ বাক্স',
      fundId: 'fnd-khu-01',
      fundName: 'সাধারণ তহবিল',
      date: '2026-02-01',
      sourceDomain: 'GENERAL_FINANCE',
      originalStatus: 'APPROVED',
      originalPostedAt: '2026-02-01T10:00:00Z',
      originalPostedBy: 'usr-admin-01'
    },
    correctedSnapshot: {
      sourceCode: 'REC-2026-000102',
      sourceType: 'INCOME',
      amount: 25000,
      accountId: 'acc-khu-02',
      accountName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
      fundId: 'fnd-khu-02',
      fundName: 'কল্যাণ ও অনুদান তহবিল',
      date: '2026-02-05'
    },
    financialEffect: 'পূর্বের ৳১৫,০০০ রিভার্সাল এবং নতুন ৳২৫,০০০ পোস্টিং সফল।',
    status: 'COMPLETED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-02-02T10:15:00Z',
    approvedBy: 'usr-admin-01',
    approvedByName: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
    approvedAt: '2026-02-02T11:45:00Z',
    completedBy: 'usr-admin-01',
    completedByName: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
    completedAt: '2026-02-05T11:00:00Z',
    createdAt: '2026-02-02T10:00:00Z',
    updatedAt: '2026-02-05T11:00:00Z',
    auditHistory: [
      {
        id: 'aud-cor-1',
        correctionId: 'cor-khu-01',
        eventType: 'CORRECTION_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন',
        timestamp: '2026-02-02T10:00:00Z',
        notes: 'আর্থিক সংশোধন রিকোয়েস্ট তৈরি করা হয়েছে।'
      },
      {
        id: 'aud-cor-2',
        correctionId: 'cor-khu-01',
        eventType: 'CORRECTION_COMPLETED',
        actorId: 'usr-admin-01',
        actorName: 'মোঃ আরিফুল ইসলাম',
        timestamp: '2026-02-05T11:00:00Z',
        notes: 'সংশোধিত এন্ট্রি পোস্টিংয়ের পর চেইন সম্পন্ন।'
      }
    ]
  }
];

export const ReversalCorrectionManagementView: React.FC<ReversalCorrectionManagementViewProps> = ({ currentOrg }) => {
  // Current logged in actor simulator
  const [currentActor, setCurrentActor] = useState<Actor>(ACTORS[0]);

  // Sub-Navigation Tabs (10 submodules)
  const [activeSubTab, setActiveSubTab] = useState<
    | 'new_reversal'
    | 'reversal_register'
    | 'pending_reversal_approval'
    | 'rejected_reversal'
    | 'reversal_voucher'
    | 'new_correction'
    | 'correction_register'
    | 'pending_correction_approval'
    | 'correction_history'
    | 'audit_history'
  >('reversal_register');

  // State Stores
  const [reversals, setReversals] = useState<ReversalEntry[]>(INITIAL_REVERSALS);
  const [corrections, setCorrections] = useState<CorrectionEntry[]>(INITIAL_CORRECTIONS);
  const [incomes] = useState<IncomeEntry[]>(INITIAL_INCOMES);
  const [expenses] = useState<ExpenseEntry[]>(INITIAL_EXPENSES);
  const [transfers] = useState<TransferEntry[]>(INITIAL_TRANSFERS);
  const [openingBalances] = useState<OpeningBalanceEntry[]>(INITIAL_OPENING_BALANCES);

  // Selected item for modals / detail views / print
  const [selectedReversal, setSelectedReversal] = useState<ReversalEntry | null>(INITIAL_REVERSALS[0]);
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionEntry | null>(INITIAL_CORRECTIONS[0]);
  const [inspectingChainSource, setInspectingChainSource] = useState<any | null>(null);

  // Reversal Form States
  const [revSourceType, setRevSourceType] = useState<LedgerSourceType>('INCOME');
  const [revSelectedSourceId, setRevSelectedSourceId] = useState<string>('');
  const [revReasonCode, setRevReasonCode] = useState<ReversalReasonCode>('wrong_entry');
  const [revReasonDetails, setRevReasonDetails] = useState<string>('');
  const [revNotes, setRevNotes] = useState<string>('');
  const [revConfirmed, setRevConfirmed] = useState<boolean>(false);

  // Correction Form States
  const [corSourceType, setCorSourceType] = useState<LedgerSourceType>('INCOME');
  const [corSelectedSourceId, setCorSelectedSourceId] = useState<string>('');
  const [corType, setCorType] = useState<CorrectionType>('FINANCIAL');
  const [corReasonCode, setCorReasonCode] = useState<CorrectionReasonCode>('wrong_amount');
  const [corReasonDetails, setCorReasonDetails] = useState<string>('');
  const [corNotes, setCorNotes] = useState<string>('');
  const [corConfirmed, setCorConfirmed] = useState<boolean>(false);

  // Action Modals & Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [rejectionModalItem, setRejectionModalItem] = useState<{ type: 'reversal' | 'correction'; item: any } | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');

  // Filters
  const [revFilter, setRevFilter] = useState<ReversalFilterCriteria>({
    searchQuery: '',
    sourceType: 'all',
    status: 'all',
    reversalReasonCode: 'all'
  });

  const [corFilter, setCorFilter] = useState<CorrectionFilterCriteria>({
    searchQuery: '',
    correctionType: 'all',
    sourceType: 'all',
    status: 'all',
    reasonCode: 'all'
  });

  // Helper permission check
  const hasPermission = (key: ReversalPermissionKey | CorrectionPermissionKey): boolean => {
    const userPerms = REVERSAL_PERMISSIONS[currentActor.role] || [];
    return userPerms.includes(key);
  };

  // Helper: Find posted sources for selection
  const allPostedSources = useMemo(() => {
    const orgId = currentOrg.id;
    const list: Array<{
      id: string;
      code: string;
      sourceType: LedgerSourceType;
      amount: number;
      accountId: string;
      destinationAccountId?: string;
      fundId: string;
      date: string;
      description: string;
      postedAt: string;
      postedBy: string;
      isReversed: boolean;
      reversalEntry?: ReversalEntry;
    }> = [];

    // Incomes (must be APPROVED or POSTED and isFinancialPosted === true)
    incomes.filter(i => i.organizationId === orgId && (i.status === 'APPROVED' || i.status === 'POSTED') && i.isFinancialPosted).forEach(i => {
      const existingRev = reversals.find(r => r.organizationId === orgId && r.sourceType === 'INCOME' && r.sourceId === i.id && r.status !== 'REJECTED');
      list.push({
        id: i.id,
        code: i.receiptNo || i.transactionCode,
        sourceType: 'INCOME',
        amount: i.amount,
        accountId: i.accountId,
        fundId: i.fundId,
        date: i.entryDate,
        description: i.description,
        postedAt: i.approvedAt || i.createdAt,
        postedBy: i.approvedBy || i.createdBy,
        isReversed: !!existingRev,
        reversalEntry: existingRev
      });
    });

    // Expenses (must be APPROVED or POSTED and isFinancialPosted === true)
    expenses.filter(e => e.organizationId === orgId && (e.status === 'APPROVED' || e.status === 'POSTED') && e.isFinancialPosted).forEach(e => {
      const existingRev = reversals.find(r => r.organizationId === orgId && r.sourceType === 'EXPENSE' && r.sourceId === e.id && r.status !== 'REJECTED');
      list.push({
        id: e.id,
        code: e.voucherNumber || e.expenseCode,
        sourceType: 'EXPENSE',
        amount: e.amount,
        accountId: e.accountId,
        fundId: e.fundId,
        date: e.expenseDate,
        description: e.description,
        postedAt: e.approvedAt || e.createdAt,
        postedBy: e.approvedBy || e.createdBy,
        isReversed: !!existingRev,
        reversalEntry: existingRev
      });
    });

    // Transfers (must be POSTED)
    transfers.filter(t => t.organizationId === orgId && t.status === 'POSTED' && t.isFinancialPosted).forEach(t => {
      const existingRev = reversals.find(r => r.organizationId === orgId && r.sourceType === 'TRANSFER' && r.sourceId === t.id && r.status !== 'REJECTED');
      list.push({
        id: t.id,
        code: t.transferCode,
        sourceType: 'TRANSFER',
        amount: t.amount,
        accountId: t.sourceAccountId,
        destinationAccountId: t.destinationAccountId,
        fundId: t.fundId,
        date: t.transferDate,
        description: t.transferPurpose,
        postedAt: t.postedAt || t.approvedAt || t.createdAt,
        postedBy: t.postedBy || t.approvedBy || t.createdBy,
        isReversed: !!existingRev,
        reversalEntry: existingRev
      });
    });

    // Opening Balances (must be POSTED)
    openingBalances.filter(o => o.organizationId === orgId && o.status === 'POSTED' && o.isFinancialPosted).forEach(o => {
      const existingRev = reversals.find(r => r.organizationId === orgId && r.sourceType === 'OPENING_BALANCE' && r.sourceId === o.id && r.status !== 'REJECTED');
      list.push({
        id: o.id,
        code: o.openingBalanceCode,
        sourceType: 'OPENING_BALANCE',
        amount: o.amount,
        accountId: o.accountId,
        fundId: o.fundId,
        date: o.openingDate,
        description: o.reasonDetails || o.reasonCode,
        postedAt: o.postedAt || o.approvedAt || o.createdAt,
        postedBy: o.postedBy || o.approvedBy || o.createdBy,
        isReversed: !!existingRev,
        reversalEntry: existingRev
      });
    });

    return list;
  }, [incomes, expenses, transfers, openingBalances, reversals, currentOrg.id]);

  // Selected source for Reversal creation
  const selectedSourceForReversal = useMemo(() => {
    return allPostedSources.find(s => s.sourceType === revSourceType && s.id === revSelectedSourceId) || null;
  }, [allPostedSources, revSourceType, revSelectedSourceId]);

  // Selected source for Correction creation
  const selectedSourceForCorrection = useMemo(() => {
    return allPostedSources.find(s => s.sourceType === corSourceType && s.id === corSelectedSourceId) || null;
  }, [allPostedSources, corSourceType, corSelectedSourceId]);

  // Filtered Reversals
  const filteredReversals = useMemo(() => {
    return reversals.filter(r => {
      if (r.organizationId !== currentOrg.id) return false;
      if (revFilter.sourceType !== 'all' && r.sourceType !== revFilter.sourceType) return false;
      if (revFilter.status !== 'all' && r.status !== revFilter.status) return false;
      if (revFilter.reversalReasonCode !== 'all' && r.reversalReasonCode !== revFilter.reversalReasonCode) return false;
      if (revFilter.searchQuery) {
        const q = revFilter.searchQuery.toLowerCase();
        const matchCode = r.reversalCode.toLowerCase().includes(q) || r.sourceCode.toLowerCase().includes(q);
        const matchNotes = (r.notes || '').toLowerCase().includes(q);
        if (!matchCode && !matchNotes) return false;
      }
      return true;
    });
  }, [reversals, currentOrg.id, revFilter]);

  // Filtered Corrections
  const filteredCorrections = useMemo(() => {
    return corrections.filter(c => {
      if (c.organizationId !== currentOrg.id) return false;
      if (corFilter.correctionType !== 'all' && c.correctionType !== corFilter.correctionType) return false;
      if (corFilter.sourceType !== 'all' && c.sourceType !== corFilter.sourceType) return false;
      if (corFilter.status !== 'all' && c.status !== corFilter.status) return false;
      if (corFilter.reasonCode !== 'all' && c.reasonCode !== corFilter.reasonCode) return false;
      if (corFilter.searchQuery) {
        const q = corFilter.searchQuery.toLowerCase();
        const matchCode = c.correctionCode.toLowerCase().includes(q) || c.originalSourceCode.toLowerCase().includes(q);
        const matchNotes = (c.notes || '').toLowerCase().includes(q);
        if (!matchCode && !matchNotes) return false;
      }
      return true;
    });
  }, [corrections, currentOrg.id, corFilter]);

  // Helper name lookups
  const getAccountName = (accId: string) => MOCK_ACCOUNTS.find(a => a.id === accId)?.accountName || accId;
  const getFundName = (fndId: string) => MOCK_FUNDS.find(f => f.id === fndId)?.name || fndId;

  // Handler: Create Reversal
  const handleCreateReversal = (submitImmediately = false) => {
    setFeedback(null);
    if (!hasPermission('finance.reversal.create')) {
      setFeedback({ type: 'error', message: 'অনুমতি নেই: finance.reversal.create পারমিশন আবশ্যক।' });
      return;
    }

    if (!selectedSourceForReversal) {
      setFeedback({ type: 'error', message: 'অনুগ্রহ করে একটি অনুমোদিত/পোস্টকৃত মূল লেনদেন নির্বাচন করুন।' });
      return;
    }

    // Check if already reversed
    if (selectedSourceForReversal.isReversed) {
      setFeedback({
        type: 'error',
        message: `এই লেনদেনটি ইতোমধ্যে রিভার্স করা হয়েছে (${selectedSourceForReversal.reversalEntry?.reversalCode})। একটি লেনদেনের জন্য একাধিক রিভার্সাল অবরুদ্ধ।`
      });
      return;
    }

    // Reason validation
    if (revReasonCode === 'other' && !revReasonDetails.trim()) {
      setFeedback({ type: 'error', message: 'অন্যান্য কারণ নির্বাচন করলে বিস্তারিত বিবরণ প্রদান বাধ্যতামূলক।' });
      return;
    }

    if (!revConfirmed) {
      setFeedback({ type: 'error', message: 'নিরাপত্তা বার্তা নিশ্চিতকরণে সম্মতি প্রদান আবশ্যক।' });
      return;
    }

    const timestamp = new Date().toISOString();
    const seq = reversals.length + 1;
    const reversalCode = `REV-2026-${seq.toString().padStart(6, '0')}`;
    const initialStatus: ReversalStatus = submitImmediately ? 'SUBMITTED' : 'DRAFT';

    const newRev: ReversalEntry = {
      id: `rev-${Date.now()}`,
      organizationId: currentOrg.id,
      reversalCode,
      version: 1,
      sourceType: selectedSourceForReversal.sourceType as any,
      sourceId: selectedSourceForReversal.id,
      sourceCode: selectedSourceForReversal.code,
      sourceDomain: 'GENERAL_FINANCE',
      reversalReasonCode: revReasonCode,
      reversalReasonDetails: revReasonDetails.trim() || undefined,
      reversalDate: new Date().toISOString().split('T')[0],
      originalAmount: selectedSourceForReversal.amount,
      reversalAmount: selectedSourceForReversal.amount, // Exactly equal
      amountInWordsBn: numberToBengaliWords(selectedSourceForReversal.amount),
      accountId: selectedSourceForReversal.accountId,
      destinationAccountId: selectedSourceForReversal.destinationAccountId,
      fundId: selectedSourceForReversal.fundId,
      originalPostedAt: selectedSourceForReversal.postedAt,
      originalPostedBy: selectedSourceForReversal.postedBy,
      status: initialStatus,
      createdBy: currentActor.id,
      createdByName: currentActor.name,
      createdAt: timestamp,
      updatedAt: timestamp,
      submittedBy: submitImmediately ? currentActor.id : undefined,
      submittedByName: submitImmediately ? currentActor.name : undefined,
      submittedAt: submitImmediately ? timestamp : undefined,
      notes: revNotes.trim() || undefined,
      auditHistory: [
        {
          id: `aud-rev-${Date.now()}`,
          reversalId: `rev-${Date.now()}`,
          eventType: 'REVERSAL_CREATED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          notes: `রিভার্সাল এন্ট্রি ${reversalCode} (${initialStatus}) তৈরি করা হয়েছে।`
        }
      ]
    };

    setReversals(prev => [newRev, ...prev]);
    setSelectedReversal(newRev);
    setFeedback({
      type: 'success',
      message: `রিভার্সাল ${reversalCode} সফলভাবে ${initialStatus === 'SUBMITTED' ? 'দাখিল' : 'সংরক্ষণ'} করা হয়েছে।`
    });

    // Reset form
    setRevSelectedSourceId('');
    setRevReasonDetails('');
    setRevNotes('');
    setRevConfirmed(false);
    setActiveSubTab('reversal_register');
  };

  // Handler: Submit Reversal
  const handleSubmitReversal = (rev: ReversalEntry) => {
    if (!hasPermission('finance.reversal.submit')) {
      setFeedback({ type: 'error', message: 'অনুমতি নেই: finance.reversal.submit পারমিশন আবশ্যক।' });
      return;
    }
    const timestamp = new Date().toISOString();
    const updated: ReversalEntry = {
      ...rev,
      status: 'SUBMITTED',
      submittedBy: currentActor.id,
      submittedByName: currentActor.name,
      submittedAt: timestamp,
      updatedAt: timestamp,
      auditHistory: [
        ...rev.auditHistory,
        {
          id: `aud-rev-${Date.now()}`,
          reversalId: rev.id,
          eventType: 'REVERSAL_SUBMITTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          notes: 'অনুমোদনের জন্য দাখিল করা হয়েছে।'
        }
      ]
    };
    setReversals(prev => prev.map(r => r.id === rev.id ? updated : r));
    setFeedback({ type: 'success', message: `রিভার্সাল ${rev.reversalCode} অনুমোদনের জন্য দাখিল করা হয়েছে।` });
  };

  // Handler: Approve Reversal (Maker-Checker Enforced)
  const handleApproveReversal = (rev: ReversalEntry) => {
    if (!hasPermission('finance.reversal.approve')) {
      setFeedback({ type: 'error', message: 'অনুমতি নেই: finance.reversal.approve পারমিশন আবশ্যক।' });
      return;
    }
    // Maker-Checker Separation of Duties
    if (rev.createdBy === currentActor.id) {
      setFeedback({
        type: 'error',
        message: 'দায়িত্ব পৃথকীকরণ নীতি (Maker-Checker): প্রস্তুতকারী নিজে নিজের রিভার্সাল অনুমোদন করতে পারেন না।'
      });
      return;
    }

    if (rev.status !== 'SUBMITTED') {
      setFeedback({ type: 'error', message: 'শুধুমাত্র দাখিলকৃত (SUBMITTED) রিভার্সাল অনুমোদনযোগ্য।' });
      return;
    }

    const timestamp = new Date().toISOString();
    const updated: ReversalEntry = {
      ...rev,
      status: 'APPROVED',
      approvedBy: currentActor.id,
      approvedByName: currentActor.name,
      approvedAt: timestamp,
      updatedAt: timestamp,
      auditHistory: [
        ...rev.auditHistory,
        {
          id: `aud-rev-${Date.now()}`,
          reversalId: rev.id,
          eventType: 'REVERSAL_APPROVED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          notes: 'রিভার্সাল অনুমোদিত হয়েছে (পোস্টিংয়ের অপেক্ষায়)।'
        }
      ]
    };
    setReversals(prev => prev.map(r => r.id === rev.id ? updated : r));
    setFeedback({ type: 'success', message: `রিভার্সাল ${rev.reversalCode} সফলভাবে অনুমোদিত হয়েছে।` });
  };

  // Handler: Post Reversal (Official Ledger Impact)
  const handlePostReversal = (rev: ReversalEntry) => {
    if (!hasPermission('finance.reversal.post')) {
      setFeedback({ type: 'error', message: 'অনুমতি নেই: finance.reversal.post পারমিশন আবশ্যক।' });
      return;
    }

    if (rev.status !== 'APPROVED') {
      setFeedback({ type: 'error', message: 'শুধুমাত্র অনুমোদিত (APPROVED) রিভার্সাল অফিশিয়াল লেজারে পোস্ট করা সম্ভব।' });
      return;
    }

    // Idempotency check
    if (rev.isFinancialPosted || rev.financialTransactionId) {
      setFeedback({
        type: 'warning',
        message: `আইডেমপোটেন্সি সতর্কতা: রিভার্সাল ${rev.reversalCode} ইতোমধ্যেই পোস্ট করা হয়েছে (${rev.financialTransactionId})।`
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const financialTxnId = `FIN-REV-2026-${rev.reversalCode.replace('REV-2026-', '')}`;

    const updated: ReversalEntry = {
      ...rev,
      status: 'POSTED',
      postedBy: currentActor.id,
      postedByName: currentActor.name,
      postedAt: timestamp,
      financialTransactionId: financialTxnId,
      isFinancialPosted: true,
      updatedAt: timestamp,
      auditHistory: [
        ...rev.auditHistory,
        {
          id: `aud-rev-${Date.now()}`,
          reversalId: rev.id,
          eventType: 'REVERSAL_POSTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          notes: `অফিশিয়াল লেজার পোস্টিং সম্পন্ন (${financialTxnId})।`
        }
      ]
    };

    setReversals(prev => prev.map(r => r.id === rev.id ? updated : r));
    setFeedback({
      type: 'success',
      message: `রিভার্সাল ${rev.reversalCode} অফিশিয়াল লেজারে সফলভাবে পোস্ট করা হয়েছে! (ID: ${financialTxnId})`
    });
  };

  // Handler: Confirm Rejection
  const handleConfirmRejection = () => {
    if (!rejectionModalItem) return;
    if (!rejectionReasonInput.trim()) {
      setFeedback({ type: 'error', message: 'প্রত্যাখ্যানের কারণ উল্লেখ করা বাধ্যতামূলক।' });
      return;
    }

    const timestamp = new Date().toISOString();

    if (rejectionModalItem.type === 'reversal') {
      const rev = rejectionModalItem.item as ReversalEntry;
      const updated: ReversalEntry = {
        ...rev,
        status: 'REJECTED',
        rejectedBy: currentActor.id,
        rejectedByName: currentActor.name,
        rejectedAt: timestamp,
        rejectionReason: rejectionReasonInput.trim(),
        updatedAt: timestamp,
        auditHistory: [
          ...rev.auditHistory,
          {
            id: `aud-rev-${Date.now()}`,
            reversalId: rev.id,
            eventType: 'REVERSAL_REJECTED',
            actorId: currentActor.id,
            actorName: currentActor.name,
            timestamp,
            notes: `প্রত্যাখ্যাত: ${rejectionReasonInput.trim()}`
          }
        ]
      };
      setReversals(prev => prev.map(r => r.id === rev.id ? updated : r));
      setFeedback({ type: 'warning', message: `রিভার্সাল ${rev.reversalCode} প্রত্যাখ্যাত হয়েছে।` });
    } else {
      const cor = rejectionModalItem.item as CorrectionEntry;
      const updated: CorrectionEntry = {
        ...cor,
        status: 'REJECTED',
        rejectedBy: currentActor.id,
        rejectedByName: currentActor.name,
        rejectedAt: timestamp,
        rejectionReason: rejectionReasonInput.trim(),
        updatedAt: timestamp,
        auditHistory: [
          ...cor.auditHistory,
          {
            id: `aud-cor-${Date.now()}`,
            correctionId: cor.id,
            eventType: 'CORRECTION_REJECTED',
            actorId: currentActor.id,
            actorName: currentActor.name,
            timestamp,
            notes: `সংশোধন প্রত্যাখ্যাত: ${rejectionReasonInput.trim()}`
          }
        ]
      };
      setCorrections(prev => prev.map(c => c.id === cor.id ? updated : c));
      setFeedback({ type: 'warning', message: `সংশোধন ${cor.correctionCode} প্রত্যাখ্যাত হয়েছে।` });
    }

    setRejectionModalItem(null);
    setRejectionReasonInput('');
  };

  // Handler: Reopen Rejected Reversal
  const handleReopenReversal = (rev: ReversalEntry) => {
    if (!hasPermission('finance.reversal.reopen')) {
      setFeedback({ type: 'error', message: 'অনুমতি নেই: finance.reversal.reopen পারমিশন আবশ্যক।' });
      return;
    }
    const timestamp = new Date().toISOString();
    const updated: ReversalEntry = {
      ...rev,
      status: 'DRAFT',
      rejectedBy: undefined,
      rejectedByName: undefined,
      rejectedAt: undefined,
      rejectionReason: undefined,
      updatedAt: timestamp,
      auditHistory: [
        ...rev.auditHistory,
        {
          id: `aud-rev-${Date.now()}`,
          reversalId: rev.id,
          eventType: 'REVERSAL_REOPENED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          notes: 'সংশোধনের জন্য পুনরায় খসড়া (DRAFT) করা হয়েছে।'
        }
      ]
    };
    setReversals(prev => prev.map(r => r.id === rev.id ? updated : r));
    setFeedback({ type: 'success', message: `রিভার্সাল ${rev.reversalCode} পুনরায় খসড়ায় রূপান্তর করা হয়েছে।` });
  };

  // Handler: Create Correction
  const handleCreateCorrection = () => {
    setFeedback(null);
    if (!hasPermission('finance.correction.create')) {
      setFeedback({ type: 'error', message: 'অনুমতি নেই: finance.correction.create পারমিশন আবশ্যক।' });
      return;
    }

    if (!selectedSourceForCorrection) {
      setFeedback({ type: 'error', message: 'অনুগ্রহ করে একটি অনুমোদিত/পোস্টকৃত মূল লেনদেন নির্বাচন করুন।' });
      return;
    }

    if (corReasonCode === 'other' && !corReasonDetails.trim()) {
      setFeedback({ type: 'error', message: 'অন্যান্য কারণ নির্বাচন করলে বিস্তারিত বিবরণ প্রদান আবশ্যক।' });
      return;
    }

    if (!corConfirmed) {
      setFeedback({ type: 'error', message: 'নিরাপত্তা বার্তা নিশ্চিতকরণে সম্মতি প্রদান আবশ্যক।' });
      return;
    }

    const timestamp = new Date().toISOString();
    const seq = corrections.length + 1;
    const correctionCode = `COR-2026-${seq.toString().padStart(6, '0')}`;

    const originalSnapshot: CorrectionSnapshot = {
      sourceCode: selectedSourceForCorrection.code,
      sourceType: selectedSourceForCorrection.sourceType as any,
      amount: selectedSourceForCorrection.amount,
      accountId: selectedSourceForCorrection.accountId,
      accountName: getAccountName(selectedSourceForCorrection.accountId),
      destinationAccountId: selectedSourceForCorrection.destinationAccountId,
      destinationAccountName: selectedSourceForCorrection.destinationAccountId ? getAccountName(selectedSourceForCorrection.destinationAccountId) : undefined,
      fundId: selectedSourceForCorrection.fundId,
      fundName: getFundName(selectedSourceForCorrection.fundId),
      date: selectedSourceForCorrection.date,
      sourceDomain: 'GENERAL_FINANCE',
      description: selectedSourceForCorrection.description,
      originalStatus: 'POSTED',
      originalPostedAt: selectedSourceForCorrection.postedAt,
      originalPostedBy: selectedSourceForCorrection.postedBy
    };

    const newCor: CorrectionEntry = {
      id: `cor-${Date.now()}`,
      organizationId: currentOrg.id,
      correctionCode,
      version: 1,
      originalSourceId: selectedSourceForCorrection.id,
      originalSourceCode: selectedSourceForCorrection.code,
      sourceType: selectedSourceForCorrection.sourceType as any,
      correctionType: corType,
      reasonCode: corReasonCode,
      reasonDetails: corReasonDetails.trim() || undefined,
      originalSnapshot,
      status: 'SUBMITTED',
      createdBy: currentActor.id,
      createdByName: currentActor.name,
      submittedBy: currentActor.id,
      submittedByName: currentActor.name,
      submittedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      notes: corNotes.trim() || undefined,
      auditHistory: [
        {
          id: `aud-cor-${Date.now()}`,
          correctionId: `cor-${Date.now()}`,
          eventType: 'CORRECTION_CREATED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          notes: `সংশোধন রিকোয়েস্ট ${correctionCode} তৈরি ও দাখিল করা হয়েছে।`
        }
      ]
    };

    setCorrections(prev => [newCor, ...prev]);
    setSelectedCorrection(newCor);
    setFeedback({ type: 'success', message: `সংশোধন রিকোয়েস্ট ${correctionCode} সফলভাবে তৈরি ও দাখিল হয়েছে।` });

    // Reset form
    setCorSelectedSourceId('');
    setCorReasonDetails('');
    setCorNotes('');
    setCorConfirmed(false);
    setActiveSubTab('correction_register');
  };

  // Handler: Approve Correction
  const handleApproveCorrection = (cor: CorrectionEntry) => {
    if (!hasPermission('finance.correction.approve')) {
      setFeedback({ type: 'error', message: 'অনুমতি নেই: finance.correction.approve পারমিশন আবশ্যক।' });
      return;
    }
    // Maker-Checker
    if (cor.createdBy === currentActor.id) {
      setFeedback({
        type: 'error',
        message: 'দায়িত্ব পৃথকীকরণ নীতি (Maker-Checker): প্রস্তুতকারী নিজে নিজের সংশোধন অনুমোদন করতে পারেন না।'
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const isFinancial = cor.correctionType === 'FINANCIAL';

    const updated: CorrectionEntry = {
      ...cor,
      status: isFinancial ? 'APPROVED' : 'COMPLETED',
      approvedBy: currentActor.id,
      approvedByName: currentActor.name,
      approvedAt: timestamp,
      completedBy: isFinancial ? undefined : currentActor.id,
      completedByName: isFinancial ? undefined : currentActor.name,
      completedAt: isFinancial ? undefined : timestamp,
      updatedAt: timestamp,
      auditHistory: [
        ...cor.auditHistory,
        {
          id: `aud-cor-${Date.now()}`,
          correctionId: cor.id,
          eventType: isFinancial ? 'CORRECTION_APPROVED' : 'CORRECTION_COMPLETED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          notes: isFinancial
            ? 'আর্থিক সংশোধন অনুমোদিত হয়েছে; রিভার্সাল ও নতুন এন্ট্রি চেইন শুরু হয়েছে।'
            : 'অ-আর্থিক সংশোধন সফলভাবে সম্পন্ন হয়েছে।'
        }
      ]
    };

    setCorrections(prev => prev.map(c => c.id === cor.id ? updated : c));
    setFeedback({
      type: 'success',
      message: `সংশোধন ${cor.correctionCode} ${isFinancial ? 'অনুমোদিত হয়েছে (রিভার্সাল চেইনের অপেক্ষায়)' : 'সফলভাবে সম্পন্ন হয়েছে'}।`
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider font-mono">
            <RotateCcw className="w-4 h-4" />
            <span>Phase 5.8: Reversal & Correction Architecture</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 font-heading">
            সংশোধন ও রিভার্সাল ব্যবস্থাপনা (Reversal & Correction Management)
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-body">
            পোস্টকৃত কোনো আর্থিক এন্ট্রি স্থায়ীভাবে মোছা বা এডিট হয় না; সম্পূর্ণ রিভার্সাল ও সংশোধন চেইন দ্বারা নিখুঁত অডিট ট্রেইল সংরক্ষিত হয়।
          </p>
        </div>

        {/* Current Actor Switcher for Maker-Checker Simulation */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <UserCheck className="w-4 h-4 text-slate-500" />
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 block font-heading">বর্তমান ব্যবহারকারী (Maker-Checker):</span>
            <select
              value={currentActor.id}
              onChange={(e) => {
                const found = ACTORS.find(a => a.id === e.target.value);
                if (found) setCurrentActor(found);
              }}
              className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer text-xs"
            >
              {ACTORS.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between transition ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
          feedback.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' :
          'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> :
             feedback.type === 'error' ? <XCircle className="w-4 h-4 text-rose-700" /> :
             <AlertTriangle className="w-4 h-4 text-amber-700" />}
            <span className="font-medium font-body">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold hover:underline">বন্ধ করুন</button>
        </div>
      )}

      {/* 10 Submodule Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 text-xs whitespace-nowrap min-w-max font-numeric">
          <button
            onClick={() => setActiveSubTab('reversal_register')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'reversal_register' ? 'bg-rose-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>১. Reversal Register</span>
          </button>

          <button
            onClick={() => setActiveSubTab('new_reversal')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'new_reversal' ? 'bg-rose-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>২. নতুন Reversal</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pending_reversal_approval')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'pending_reversal_approval' ? 'bg-rose-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>৩. Reversal অনুমোদন</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-white font-mono">
              {reversals.filter(r => r.status === 'SUBMITTED').length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('rejected_reversal')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'rejected_reversal' ? 'bg-rose-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>৪. প্রত্যাখ্যাত Reversal</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reversal_voucher')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'reversal_voucher' ? 'bg-rose-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>৫. Reversal Voucher (A4)</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            onClick={() => setActiveSubTab('correction_register')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'correction_register' ? 'bg-indigo-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>৬. Correction Register</span>
          </button>

          <button
            onClick={() => setActiveSubTab('new_correction')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'new_correction' ? 'bg-indigo-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>৭. নতুন Correction</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pending_correction_approval')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'pending_correction_approval' ? 'bg-indigo-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>৮. Correction অনুমোদন</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-500 text-white font-mono">
              {corrections.filter(c => c.status === 'SUBMITTED').length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('correction_history')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'correction_history' ? 'bg-indigo-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>৯. Correction History & Chain</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit_history')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'audit_history' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>১০. অডিট হিস্ট্রি</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: REVERSAL REGISTER */}
      {activeSubTab === 'reversal_register' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="রিভার্সাল কোড, সোর্স কোড দিয়ে খুঁজুন..."
                  value={revFilter.searchQuery}
                  onChange={(e) => setRevFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-700"
                />
              </div>

              <select
                value={revFilter.sourceType}
                onChange={(e) => setRevFilter(prev => ({ ...prev, sourceType: e.target.value as any }))}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer"
              >
                <option value="all">সকল উৎস টাইপ (All Sources)</option>
                <option value="INCOME">আয় (INCOME)</option>
                <option value="EXPENSE">ব্যয় (EXPENSE)</option>
                <option value="TRANSFER">স্থানান্তর (TRANSFER)</option>
                <option value="OPENING_BALANCE">প্রারম্ভিক স্থিতি (OPENING BALANCE)</option>
              </select>

              <select
                value={revFilter.status}
                onChange={(e) => setRevFilter(prev => ({ ...prev, status: e.target.value as any }))}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer"
              >
                <option value="all">সকল স্ট্যাটাস (All Status)</option>
                <option value="DRAFT">খসড়া (DRAFT)</option>
                <option value="SUBMITTED">দাখিলকৃত (SUBMITTED)</option>
                <option value="APPROVED">অনুমোদিত (APPROVED)</option>
                <option value="POSTED">পোস্টকৃত (POSTED)</option>
                <option value="REJECTED">প্রত্যাখ্যাত (REJECTED)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('new_reversal')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>নতুন Reversal</span>
              </button>
            </div>
          </div>

          {/* Reversal Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-heading">
                  <th className="p-3.5 font-bold">রিভার্সাল কোড</th>
                  <th className="p-3.5 font-bold">উৎস টাইপ ও কোড</th>
                  <th className="p-3.5 font-bold">হিসাব ও তহবিল</th>
                  <th className="p-3.5 font-bold text-right">রিভার্সাল পরিমাণ</th>
                  <th className="p-3.5 font-bold">কারণ</th>
                  <th className="p-3.5 font-bold text-center">স্ট্যাটাস</th>
                  <th className="p-3.5 font-bold text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body">
                {filteredReversals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-body">
                      কোনো রিভার্সাল রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredReversals.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-mono font-bold text-rose-900">
                        {r.reversalCode}
                        <span className="block text-[10px] text-slate-400 font-normal font-sans">
                          তারিখ: {r.reversalDate}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 font-mono">
                          {r.sourceType}
                        </span>
                        <span className="block font-semibold text-slate-800 mt-0.5 font-mono">
                          {r.sourceCode}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{getAccountName(r.accountId)}</div>
                        <div className="text-[11px] text-slate-500">{getFundName(r.fundId)}</div>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-rose-800">
                        -৳{r.reversalAmount.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-slate-700">
                        {REVERSAL_REASONS.find(re => re.code === r.reversalReasonCode)?.labelBn || r.reversalReasonCode}
                        {r.reversalReasonDetails && (
                          <span className="block text-[10px] text-slate-400 truncate max-w-[200px]">
                            {r.reversalReasonDetails}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                          r.status === 'POSTED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          r.status === 'APPROVED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          r.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          r.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {r.status}
                        </span>
                        {r.isFinancialPosted && (
                          <span className="block text-[9px] text-emerald-700 font-mono font-bold mt-0.5">
                            POSTED IN LEDGER
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedReversal(r);
                              setActiveSubTab('reversal_voucher');
                            }}
                            title="ভাউচার দেখুন ও প্রিন্ট করুন"
                            className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {r.status === 'DRAFT' && hasPermission('finance.reversal.submit') && (
                            <button
                              onClick={() => handleSubmitReversal(r)}
                              title="দাখিল করুন"
                              className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold"
                            >
                              দাখিল
                            </button>
                          )}

                          {r.status === 'SUBMITTED' && hasPermission('finance.reversal.approve') && (
                            <button
                              onClick={() => handleApproveReversal(r)}
                              title="অনুমোদন করুন"
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                            >
                              অনুমোদন
                            </button>
                          )}

                          {r.status === 'APPROVED' && !r.isFinancialPosted && hasPermission('finance.reversal.post') && (
                            <button
                              onClick={() => handlePostReversal(r)}
                              title="লেজারে পোস্ট করুন"
                              className="px-2 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-[10px] font-bold"
                            >
                              পোস্ট
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
        </div>
      )}

      {/* SUBTAB 2: NEW REVERSAL FORM */}
      {activeSubTab === 'new_reversal' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-800" />
              নতুন রিভার্সাল এন্ট্রি তৈরি (Full Reversal Only)
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-body">
              শুধুমাত্র চূড়ান্ত পোস্টকৃত লেনদেন সম্পূর্ণভাবে রিভার্স করা যাবে। রিভার্সালের পরিমাণ ও অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে মূল লেনদেন থেকে গৃহীত হবে।
            </p>
          </div>

          {/* Step 1: Select Source Type & Original Posted Source */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-wide">
              ধাপ ১: মূল পোস্টকৃত লেনদেন নির্বাচন
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">উৎস ঘটনা টাইপ (Source Type) *</label>
                <select
                  value={revSourceType}
                  onChange={(e) => {
                    setRevSourceType(e.target.value as any);
                    setRevSelectedSourceId('');
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-700"
                >
                  <option value="INCOME">আয় প্রাপ্তি (INCOME)</option>
                  <option value="EXPENSE">সাধারণ ব্যয় (EXPENSE)</option>
                  <option value="TRANSFER">হিসাব স্থানান্তর (TRANSFER)</option>
                  <option value="OPENING_BALANCE">প্রারম্ভিক স্থিতি (OPENING BALANCE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">মূল লেনদেন রসিদ/কোড নির্বাচন *</label>
                <select
                  value={revSelectedSourceId}
                  onChange={(e) => setRevSelectedSourceId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-700"
                >
                  <option value="">-- লেনদেন নির্বাচন করুন --</option>
                  {allPostedSources
                    .filter(s => s.sourceType === revSourceType)
                    .map(s => (
                      <option key={s.id} value={s.id} disabled={s.isReversed}>
                        {s.code} - ৳{s.amount.toLocaleString()} ({s.date}) {s.isReversed ? '[ইতোমধ্যে রিভার্সড]' : ''}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Read-only Derived Preview */}
            {selectedSourceForReversal && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5 font-body">
                <div className="text-[11px] font-bold text-slate-800 flex items-center justify-between border-b pb-1">
                  <span>মূল লেনদেনের বিবরণ (Derived Details):</span>
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                    POSTED
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>মূল কোড: <b className="text-slate-800 font-mono">{selectedSourceForReversal.code}</b></div>
                  <div>তারিখ: <b className="text-slate-800">{selectedSourceForReversal.date}</b></div>
                  <div>মূল পরিমাণ: <b className="text-slate-800 font-mono">৳{selectedSourceForReversal.amount.toLocaleString()}</b></div>
                  <div>রিভার্সাল পরিমাণ: <b className="text-rose-800 font-mono">৳{selectedSourceForReversal.amount.toLocaleString()} (১০০% অপরিবর্তনীয়)</b></div>
                  <div>হিসাব: <b className="text-slate-800">{getAccountName(selectedSourceForReversal.accountId)}</b></div>
                  <div>তহবিল: <b className="text-slate-800">{getFundName(selectedSourceForReversal.fundId)}</b></div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Reversal Reason */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-wide">
              ধাপ ২: রিভার্সালের সুনির্দিষ্ট কারণ ও বিবরণ
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">রিভার্সালের কারণ (Reversal Reason) *</label>
              <select
                value={revReasonCode}
                onChange={(e) => setRevReasonCode(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-700"
              >
                {REVERSAL_REASONS.map(r => (
                  <option key={r.code} value={r.code}>{r.labelBn}</option>
                ))}
              </select>
            </div>

            {revReasonCode === 'other' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">বিস্তারিত কারণ (Mandatory for Other) *</label>
                <textarea
                  rows={2}
                  value={revReasonDetails}
                  onChange={(e) => setRevReasonDetails(e.target.value)}
                  placeholder="অন্যান্য কারণ বিস্তারিতভাবে উল্লেখ করুন..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-700"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">অভ্যন্তরীণ নোট (ঐচ্ছিক)</label>
              <input
                type="text"
                value={revNotes}
                onChange={(e) => setRevNotes(e.target.value)}
                placeholder="অডিট ও নিরীক্ষার জন্য প্রয়োজনীয় মন্তব্য..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-700"
              />
            </div>
          </div>

          {/* Step 3: Mandatory Bengali Safety Confirmation */}
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-rose-900 font-heading">
                  বাধ্যতামূলক আর্থিক নিরাপত্তা বার্তা
                </h5>
                <p className="text-xs text-rose-800 font-body mt-0.5">
                  “এই Reversal অনুমোদিত ও পোস্ট হলে মূল হিসাবের আর্থিক প্রভাব সম্পূর্ণভাবে বিপরীত হবে। মূল Transaction মুছে যাবে না।”
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-rose-900 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={revConfirmed}
                onChange={(e) => setRevConfirmed(e.target.checked)}
                className="rounded border-rose-300 text-rose-800 focus:ring-rose-800"
              />
              <span>আমি এই নীতি পুরোপুরি পড়েছি এবং সম্মত হয়েছি</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setActiveSubTab('reversal_register')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              বাতিল
            </button>
            <button
              onClick={() => handleCreateReversal(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
            >
              খসড়া সংরক্ষণ (Save Draft)
            </button>
            <button
              onClick={() => handleCreateReversal(true)}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition shadow-xs"
            >
              দাখিল করুন (Submit for Approval)
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PENDING REVERSAL APPROVAL */}
      {activeSubTab === 'pending_reversal_approval' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                অনুমোদনের অপেক্ষায় থাকা রিভার্সাল তালিকা (Pending Reversals)
              </h3>
              <p className="text-xs text-slate-500 font-body">
                মেকার-চেকার নীতি অনুযায়ী প্রস্তুতকারী নিজে নিজের রিভার্সাল অনুমোদন করতে পারবেন না।
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-heading">
                  <th className="p-3.5 font-bold">রিভার্সাল কোড</th>
                  <th className="p-3.5 font-bold">মূল এন্ট্রি</th>
                  <th className="p-3.5 font-bold text-right">পরিমাণ</th>
                  <th className="p-3.5 font-bold">প্রস্তুতকারী (Maker)</th>
                  <th className="p-3.5 font-bold">কারণ</th>
                  <th className="p-3.5 font-bold text-center">অনুমোদন অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body">
                {reversals.filter(r => r.status === 'SUBMITTED').length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-body">
                      বর্তমানে অনুমোদনের অপেক্ষায় কোনো রিভার্সাল নেই।
                    </td>
                  </tr>
                ) : (
                  reversals.filter(r => r.status === 'SUBMITTED').map(r => {
                    const isSelf = r.createdBy === currentActor.id;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5 font-mono font-bold text-rose-900">{r.reversalCode}</td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 font-mono">{r.sourceCode}</span>
                          <span className="block text-[10px] text-slate-500">{r.sourceType}</span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-rose-800">
                          -৳{r.reversalAmount.toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{r.createdByName || r.createdBy}</div>
                          <div className="text-[10px] text-slate-400">{r.createdAt}</div>
                        </td>
                        <td className="p-3.5 text-slate-700">
                          {REVERSAL_REASONS.find(re => re.code === r.reversalReasonCode)?.labelBn}
                        </td>
                        <td className="p-3.5 text-center">
                          {isSelf ? (
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-semibold">
                              নিজে প্রস্তুতকারী (ব্লকড)
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleApproveReversal(r)}
                                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                              >
                                অনুমোদন
                              </button>
                              <button
                                onClick={() => setRejectionModalItem({ type: 'reversal', item: r })}
                                className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                              >
                                প্রত্যাখ্যান
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: REJECTED REVERSALS */}
      {activeSubTab === 'rejected_reversal' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              প্রত্যাখ্যাত রিভার্সাল তালিকা (Rejected Reversals)
            </h3>
            <p className="text-xs text-slate-500 font-body">
              প্রত্যাখ্যাত রিভার্সাল প্রয়োজনে পুনরায় খসড়ায় রূপান্তর করে পুনঃদাখিল করা যাবে।
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-heading">
                  <th className="p-3.5 font-bold">রিভার্সাল কোড</th>
                  <th className="p-3.5 font-bold">মূল লেনদেন</th>
                  <th className="p-3.5 font-bold">প্রত্যাখ্যানকারী</th>
                  <th className="p-3.5 font-bold">প্রত্যাখ্যানের কারণ</th>
                  <th className="p-3.5 font-bold text-center">পুনরায় খসড়া</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body">
                {reversals.filter(r => r.status === 'REJECTED').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-body">
                      কোনো প্রত্যাখ্যাত রিভার্সাল নেই।
                    </td>
                  </tr>
                ) : (
                  reversals.filter(r => r.status === 'REJECTED').map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-mono font-bold text-rose-900">{r.reversalCode}</td>
                      <td className="p-3.5 font-mono font-semibold text-slate-800">{r.sourceCode}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{r.rejectedByName || r.rejectedBy}</div>
                        <div className="text-[10px] text-slate-400">{r.rejectedAt}</div>
                      </td>
                      <td className="p-3.5 text-rose-900 font-medium">{r.rejectionReason}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleReopenReversal(r)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          Reopen to Draft
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 5: REVERSAL VOUCHER (A4 PRINTABLE) */}
      {activeSubTab === 'reversal_voucher' && selectedReversal && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                রিভার্সাল ভাউচার (A4 Printable Voucher)
              </h3>
              <p className="text-xs text-slate-500 font-body">
                অফিসিয়াল আর্থিক নিরীক্ষা ও ফাইলে সংরক্ষণের জন্য A4 ফরম্যাট ভাউচার।
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন (Print A4)</span>
            </button>
          </div>

          {/* A4 Sheet Container */}
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm max-w-4xl mx-auto space-y-6 text-slate-900 font-body print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <TSSLogo variant="compact" theme="light" size="md" showBangla={true} />
                <h2 className="text-lg font-bold mt-2 font-heading">{currentOrg.name}</h2>
                <p className="text-xs text-slate-600">{currentOrg.address} | ফোন: {currentOrg.phone}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-900 border border-rose-300 font-mono">
                  OFFICIAL REVERSAL VOUCHER
                </span>
                <div className="mt-2 text-xs">
                  <div>ভাউচার নং: <b className="font-mono text-rose-900 text-sm">{selectedReversal.reversalCode}</b></div>
                  <div>তারিখ: <b>{selectedReversal.reversalDate}</b></div>
                </div>
              </div>
            </div>

            {/* Voucher Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">মূল লেনদেনের কোড / ভাউচার:</span>
                <span className="font-bold font-mono text-slate-900">{selectedReversal.sourceCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block">উৎস ঘটনা ও ডোমেইন:</span>
                <span className="font-bold text-slate-900">{selectedReversal.sourceType} ({selectedReversal.sourceDomain})</span>
              </div>
              <div>
                <span className="text-slate-500 block">হিসাবের নাম (Account):</span>
                <span className="font-bold text-slate-900">{getAccountName(selectedReversal.accountId)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">তহবিলের নাম (Fund):</span>
                <span className="font-bold text-slate-900">{getFundName(selectedReversal.fundId)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">রিভার্সালের কারণ:</span>
                <span className="font-bold text-slate-900">
                  {REVERSAL_REASONS.find(r => r.code === selectedReversal.reversalReasonCode)?.labelBn}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">পোস্টিং রেফারেন্স (Idempotency Key):</span>
                <span className="font-mono font-bold text-emerald-900">
                  {selectedReversal.financialTransactionId || 'PENDING POSTING'}
                </span>
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-1">
              <span className="text-xs font-bold uppercase text-rose-800 font-heading">
                সম্পূর্ণ রিভার্সালকৃত টাকার পরিমাণ (Reversal Amount)
              </span>
              <div className="text-2xl font-bold font-mono text-rose-900">
                -৳ {selectedReversal.reversalAmount.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-rose-950 font-body">
                কথায়: {selectedReversal.amountInWordsBn}
              </div>
            </div>

            {/* Workflow Signatures */}
            <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs">
              <div className="border-t border-slate-400 pt-2">
                <div className="font-bold text-slate-800">{selectedReversal.createdByName || selectedReversal.createdBy}</div>
                <div className="text-[10px] text-slate-500">প্রস্তুতকারীর স্বাক্ষর (Maker)</div>
                <div className="text-[9px] text-slate-400 font-mono">{selectedReversal.createdAt.split('T')[0]}</div>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <div className="font-bold text-slate-800">{selectedReversal.approvedByName || selectedReversal.approvedBy || '---'}</div>
                <div className="text-[10px] text-slate-500">অনুমোদনকারীর স্বাক্ষর (Checker)</div>
                <div className="text-[9px] text-slate-400 font-mono">{selectedReversal.approvedAt ? selectedReversal.approvedAt.split('T')[0] : '---'}</div>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <div className="font-bold text-slate-800">{selectedReversal.postedByName || selectedReversal.postedBy || '---'}</div>
                <div className="text-[10px] text-slate-500">পোস্টিং অফিসারের স্বাক্ষর (Poster)</div>
                <div className="text-[9px] text-slate-400 font-mono">{selectedReversal.postedAt ? selectedReversal.postedAt.split('T')[0] : '---'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: CORRECTION REGISTER */}
      {activeSubTab === 'correction_register' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="সংশোধন কোড, মূল কোড দিয়ে খুঁজুন..."
                  value={corFilter.searchQuery}
                  onChange={(e) => setCorFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-700"
                />
              </div>

              <select
                value={corFilter.correctionType}
                onChange={(e) => setCorFilter(prev => ({ ...prev, correctionType: e.target.value as any }))}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer"
              >
                <option value="all">সকল সংশোধন ধরন</option>
                <option value="FINANCIAL">আর্থিক সংশোধন (Financial)</option>
                <option value="NON_FINANCIAL">অ-আর্থিক সংশোধন (Non-Financial)</option>
              </select>

              <select
                value={corFilter.status}
                onChange={(e) => setCorFilter(prev => ({ ...prev, status: e.target.value as any }))}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="SUBMITTED">দাখিলকৃত (SUBMITTED)</option>
                <option value="APPROVED">অনুমোদিত (APPROVED)</option>
                <option value="COMPLETED">সম্পন্ন (COMPLETED)</option>
                <option value="REJECTED">প্রত্যাখ্যাত (REJECTED)</option>
              </select>
            </div>

            <button
              onClick={() => setActiveSubTab('new_correction')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>নতুন Correction</span>
            </button>
          </div>

          {/* Correction Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-heading">
                  <th className="p-3.5 font-bold">সংশোধন কোড</th>
                  <th className="p-3.5 font-bold">মূল লেনদেন</th>
                  <th className="p-3.5 font-bold">সংশোধনের ধরন</th>
                  <th className="p-3.5 font-bold">কারণ</th>
                  <th className="p-3.5 font-bold">চেইন লিংক</th>
                  <th className="p-3.5 font-bold text-center">স্ট্যাটাস</th>
                  <th className="p-3.5 font-bold text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body">
                {filteredCorrections.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-body">
                      কোনো সংশোধন রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredCorrections.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-mono font-bold text-indigo-900">{c.correctionCode}</td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 font-mono">{c.originalSourceCode}</span>
                        <span className="block text-[10px] text-slate-500">{c.sourceType}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.correctionType === 'FINANCIAL' ? 'bg-rose-100 text-rose-800 font-mono' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.correctionType}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700">
                        {CORRECTION_REASONS.find(cr => cr.code === c.reasonCode)?.labelBn}
                      </td>
                      <td className="p-3.5 font-mono text-[11px]">
                        {c.reversalCode && (
                          <div className="text-rose-800">REV: {c.reversalCode}</div>
                        )}
                        {c.correctedSourceCode && (
                          <div className="text-emerald-800">NEW: {c.correctedSourceCode}</div>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                          c.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          c.status === 'APPROVED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          c.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedCorrection(c);
                            setActiveSubTab('correction_history');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold transition"
                        >
                          চেইন দেখুন
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 7: NEW CORRECTION FORM */}
      {activeSubTab === 'new_correction' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-800" />
              নতুন সংশোধন রিকোয়েস্ট তৈরি (Correction Management)
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-body">
              মূল লেনদেন অপরিবর্তিত থাকবে; প্রয়োজনে স্বয়ংক্রিয় রিভার্সাল ও নতুন সংশোধিত এন্ট্রি চেইন সৃষ্টি হবে।
            </p>
          </div>

          {/* Select Source */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-wide">
              ধাপ ১: সংশোধনযোগ্য মূল লেনদেন নির্বাচন
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">উৎস ঘটনা টাইপ *</label>
                <select
                  value={corSourceType}
                  onChange={(e) => {
                    setCorSourceType(e.target.value as any);
                    setCorSelectedSourceId('');
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-700"
                >
                  <option value="INCOME">আয় প্রাপ্তি (INCOME)</option>
                  <option value="EXPENSE">সাধারণ ব্যয় (EXPENSE)</option>
                  <option value="TRANSFER">হিসাব স্থানান্তর (TRANSFER)</option>
                  <option value="OPENING_BALANCE">প্রারম্ভিক স্থিতি (OPENING BALANCE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">মূল লেনদেন রসিদ/কোড *</label>
                <select
                  value={corSelectedSourceId}
                  onChange={(e) => setCorSelectedSourceId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-700"
                >
                  <option value="">-- লেনদেন নির্বাচন করুন --</option>
                  {allPostedSources
                    .filter(s => s.sourceType === corSourceType)
                    .map(s => (
                      <option key={s.id} value={s.id}>
                        {s.code} - ৳{s.amount.toLocaleString()} ({s.date})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {selectedSourceForCorrection && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1 font-body">
                <div className="font-bold text-slate-800">অপরিবর্তনীয় মূল স্ন্যাপশট:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>কোড: <b className="font-mono text-slate-900">{selectedSourceForCorrection.code}</b></div>
                  <div>পরিমাণ: <b className="font-mono text-slate-900">৳{selectedSourceForCorrection.amount.toLocaleString()}</b></div>
                  <div>হিসাব: <b>{getAccountName(selectedSourceForCorrection.accountId)}</b></div>
                  <div>তহবিল: <b>{getFundName(selectedSourceForCorrection.fundId)}</b></div>
                </div>
              </div>
            )}
          </div>

          {/* Correction Classification */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 font-heading uppercase tracking-wide">
              ধাপ ২: সংশোধনের ধরন ও কারণ
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">সংশোধনের ধরন (Correction Type) *</label>
                <select
                  value={corType}
                  onChange={(e) => setCorType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-700"
                >
                  <option value="FINANCIAL">আর্থিক সংশোধন (Financial - Full Reversal + New Event)</option>
                  <option value="NON_FINANCIAL">অ-আর্থিক সংশোধন (Non-Financial - Memo/Doc Update)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">সংশোধনের কারণ (Reason) *</label>
                <select
                  value={corReasonCode}
                  onChange={(e) => setCorReasonCode(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-700"
                >
                  {CORRECTION_REASONS.map(r => (
                    <option key={r.code} value={r.code}>{r.labelBn}</option>
                  ))}
                </select>
              </div>
            </div>

            {corReasonCode === 'other' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">বিস্তারিত কারণ *</label>
                <textarea
                  rows={2}
                  value={corReasonDetails}
                  onChange={(e) => setCorReasonDetails(e.target.value)}
                  placeholder="সংশোধনের বিস্তারিত কারণ লিখুন..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-700"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">সংশোধন সংক্রান্ত মন্তব্য</label>
              <input
                type="text"
                value={corNotes}
                onChange={(e) => setCorNotes(e.target.value)}
                placeholder="অডিট নোট..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-700"
              />
            </div>
          </div>

          {/* Safety Confirmation */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-indigo-900 font-heading">
                  সংশোধন নিরাপত্তা বার্তা
                </h5>
                <p className="text-xs text-indigo-800 font-body mt-0.5">
                  “এই Correction-এর মাধ্যমে মূল Transaction অপরিবর্তিত থাকবে। প্রয়োজন অনুযায়ী Reversal এবং নতুন Corrected Transaction তৈরি হবে।”
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-indigo-900 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={corConfirmed}
                onChange={(e) => setCorConfirmed(e.target.checked)}
                className="rounded border-indigo-300 text-indigo-800 focus:ring-indigo-800"
              />
              <span>আমি এই নীতি পুরোপুরি পড়েছি এবং সম্মত হয়েছি</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setActiveSubTab('correction_register')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              বাতিল
            </button>
            <button
              onClick={handleCreateCorrection}
              className="px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-xs"
            >
              সংশোধন দাখিল করুন (Submit Correction)
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 8: PENDING CORRECTION APPROVAL */}
      {activeSubTab === 'pending_correction_approval' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              অনুমোদনের অপেক্ষায় থাকা সংশোধন তালিকা (Pending Corrections)
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-heading">
                  <th className="p-3.5 font-bold">সংশোধন কোড</th>
                  <th className="p-3.5 font-bold">মূল লেনদেন</th>
                  <th className="p-3.5 font-bold">ধরন</th>
                  <th className="p-3.5 font-bold">প্রস্তুতকারী (Maker)</th>
                  <th className="p-3.5 font-bold text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body">
                {corrections.filter(c => c.status === 'SUBMITTED').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-body">
                      বর্তমানে অনুমোদনের অপেক্ষায় কোনো সংশোধন নেই।
                    </td>
                  </tr>
                ) : (
                  corrections.filter(c => c.status === 'SUBMITTED').map(c => {
                    const isSelf = c.createdBy === currentActor.id;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5 font-mono font-bold text-indigo-900">{c.correctionCode}</td>
                        <td className="p-3.5 font-mono font-semibold text-slate-800">{c.originalSourceCode}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.correctionType === 'FINANCIAL' ? 'bg-rose-100 text-rose-800 font-mono' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {c.correctionType}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{c.createdByName || c.createdBy}</div>
                        </td>
                        <td className="p-3.5 text-center">
                          {isSelf ? (
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-semibold">
                              নিজে প্রস্তুতকারী (ব্লকড)
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleApproveCorrection(c)}
                                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                              >
                                অনুমোদন
                              </button>
                              <button
                                onClick={() => setRejectionModalItem({ type: 'correction', item: c })}
                                className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                              >
                                প্রত্যাখ্যান
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 9: CORRECTION HISTORY & CHAIN */}
      {activeSubTab === 'correction_history' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              সম্পূর্ণ সংশোধন চেইন ও ইতিহাস (Complete Correction Chain & Lineage)
            </h3>
            <p className="text-xs text-slate-500 font-body">
              Original Event → Reversal → Correction Record → Corrected New Event
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {corrections.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-900">{c.correctionCode}</span>
                    <span className="ml-2 text-xs text-slate-500">তৈরি: {c.createdAt.split('T')[0]}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {c.status}
                  </span>
                </div>

                {/* 4-Stage Visual Chain */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Step 1: Original */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block font-heading">১. মূল ঘটনা (Original)</span>
                    <div className="font-bold text-slate-800 font-mono">{c.originalSnapshot.sourceCode}</div>
                    <div className="text-slate-600">পরিমাণ: ৳{c.originalSnapshot.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">{c.originalSnapshot.date}</div>
                  </div>

                  {/* Step 2: Reversal */}
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-rose-700 block font-heading">২. রিভার্সাল (Reversal)</span>
                    <div className="font-bold text-rose-900 font-mono">{c.reversalCode || 'স্বয়ংক্রিয় প্রস্তুত'}</div>
                    <div className="text-rose-800">-৳{c.originalSnapshot.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-rose-600">১০০% প্রভাব বাতিল</div>
                  </div>

                  {/* Step 3: Correction Record */}
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-indigo-700 block font-heading">৩. সংশোধন রেকর্ড</span>
                    <div className="font-bold text-indigo-900 font-mono">{c.correctionCode}</div>
                    <div className="text-indigo-800">{CORRECTION_REASONS.find(r => r.code === c.reasonCode)?.labelBn}</div>
                    <div className="text-[10px] text-indigo-600">{c.correctionType}</div>
                  </div>

                  {/* Step 4: Corrected Event */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block font-heading">৪. সংশোধিত ঘটনা (New Event)</span>
                    <div className="font-bold text-emerald-900 font-mono">{c.correctedSourceCode || c.correctedSnapshot?.sourceCode || 'চেইনভুক্ত'}</div>
                    <div className="text-emerald-800">
                      {c.correctedSnapshot?.amount ? `৳${c.correctedSnapshot.amount.toLocaleString()}` : 'সংশোধিত তথ্য'}
                    </div>
                    <div className="text-[10px] text-emerald-600">স্বতন্ত্র নতুন পরিচিতি</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 10: AUDIT HISTORY */}
      {activeSubTab === 'audit_history' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              রিভার্সাল ও সংশোধন অডিট লগ (Append-Only Audit Trail)
            </h3>
            <p className="text-xs text-slate-500 font-body">
              সংশোধন ও রিভার্সালের প্রতিটি কার্যক্রম অপরিবর্তনীয়ভাবে সংরক্ষণ করা হয়েছে।
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3 font-body">
            {reversals.flatMap(r => r.auditHistory).map((aud) => (
              <div key={aud.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  REV
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 font-mono">{aud.eventType}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{aud.timestamp}</span>
                  </div>
                  <div className="text-slate-600 mt-0.5">অ্যাক্টর: <b>{aud.actorName}</b> ({aud.actorId})</div>
                  <div className="text-slate-700 text-[11px] mt-1 bg-white p-2 rounded border border-slate-100">
                    {aud.notes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold font-heading">
              <XCircle className="w-5 h-5" />
              <span>প্রত্যাখ্যানের কারণ উল্লেখ করুন</span>
            </div>
            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="প্রত্যাখ্যানের সুস্পষ্ট কারণ লিখুন (বাধ্যতামূলক)..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-700 font-body"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setRejectionModalItem(null);
                  setRejectionReasonInput('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmRejection}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
              >
                প্রত্যাখ্যান নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
