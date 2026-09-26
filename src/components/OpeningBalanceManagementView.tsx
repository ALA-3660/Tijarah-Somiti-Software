import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Calendar,
  Layers,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  UserCheck,
  Lock,
  Landmark,
  Coins,
  FileText,
  FileCheck,
  FilePlus,
  HelpCircle,
  History
} from 'lucide-react';
import {
  OpeningBalanceEntry,
  OpeningBalanceStatus,
  OpeningBalanceReasonCode,
  OpeningBalanceFilterCriteria,
  OpeningBalanceSummaryMetrics,
  OpeningBalanceAuditEvent,
  OpeningBalancePermissionKey,
  OrganizationContext,
  Account,
  Fund,
  SupportingDocumentMeta
} from '../types';
import { OPENING_BALANCE_REASONS } from '../config/openingBalanceReasonConfig';
import { TSSLogo } from '../branding';
import { numberToBengaliWords } from '../utils/bengaliNumberWords';

interface OpeningBalanceManagementViewProps {
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

const OB_ROLE_PERMISSIONS: Record<UserRole, OpeningBalancePermissionKey[]> = {
  admin: [
    'finance.opening_balance.view',
    'finance.opening_balance.create',
    'finance.opening_balance.edit',
    'finance.opening_balance.submit',
    'finance.opening_balance.approve',
    'finance.opening_balance.reject',
    'finance.opening_balance.reopen',
    'finance.opening_balance.print',
    'finance.opening_balance.post',
  ],
  manager: [
    'finance.opening_balance.view',
    'finance.opening_balance.create',
    'finance.opening_balance.edit',
    'finance.opening_balance.submit',
    'finance.opening_balance.approve',
    'finance.opening_balance.reject',
    'finance.opening_balance.reopen',
    'finance.opening_balance.print',
    'finance.opening_balance.post',
  ],
  accountant: [
    'finance.opening_balance.view',
    'finance.opening_balance.create',
    'finance.opening_balance.edit',
    'finance.opening_balance.submit',
    'finance.opening_balance.print',
  ],
  viewer: [
    'finance.opening_balance.view',
    'finance.opening_balance.print',
  ],
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
    associatedFundIds: ['fnd-khu-01'], // Note: only supports General Fund
    openingBalanceSupported: true,
    isSystemDefined: false,
    status: 'active',
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'acc-khu-04',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-004',
    accountName: 'স্থগিত ক্যাশ বাক্স (Inactive Cash)',
    accountType: 'cash',
    associatedFundIds: ['fnd-khu-01'],
    openingBalanceSupported: true,
    isSystemDefined: false,
    status: 'inactive',
    sortOrder: 4,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'acc-khu-05',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-005',
    accountName: 'পেটি ক্যাশ (Opening Balance Unsupported)',
    accountType: 'cash',
    associatedFundIds: ['fnd-khu-01'],
    openingBalanceSupported: false, // Explicitly false for test
    isSystemDefined: false,
    status: 'active',
    sortOrder: 5,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'acc-brk-01',
    organizationId: 'org-barakah-02',
    accountCode: 'ACC-001',
    accountName: 'বারাকাহ প্রধান ক্যাশ',
    accountType: 'cash',
    associatedFundIds: ['fnd-brk-01'],
    openingBalanceSupported: true,
    isSystemDefined: true,
    status: 'active',
    sortOrder: 1,
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
  },
  {
    id: 'fnd-khu-99',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-099',
    name: 'স্থগিত তহবিল (Inactive Fund)',
    fundType: 'custom',
    status: 'inactive',
    isActive: false,
    isSystemDefined: false,
    description: 'স্থগিত ও নিষ্ক্রিয় তহবিল',
    sortOrder: 99,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  }
];

const INITIAL_OPENING_BALANCES: OpeningBalanceEntry[] = [
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
    supportingDocuments: [
      {
        id: 'doc-ob-01',
        name: 'পূর্ববর্তী_ক্যাশবহি_সমাপনী_২০২৫.pdf',
        type: 'previous_cashbook',
        referenceNumber: 'CB-2025-PAGE-88',
        status: 'verified',
        attachedAt: '2026-01-01T10:00:00Z'
      }
    ],
    referenceNumber: 'RES-2026-01-A',
    notes: '২০২৫ সালের অডিটেড সমাপনী ক্যাশ ব্যালেন্স হিসেবে গৃহীত',
    status: 'POSTED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T11:00:00Z',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-01-01T10:15:00Z',
    approvedBy: 'usr-manager-01',
    approvedByName: 'আব্দুর রহমান (ম্যানেজার)',
    approvedAt: '2026-01-01T10:45:00Z',
    postedBy: 'usr-manager-01',
    postedByName: 'আব্দুর রহমান (ম্যানেজার)',
    postedAt: '2026-01-01T11:00:00Z',
    financialTransactionId: 'TRX-2026-OB-000001',
    isFinancialPosted: true,
    auditHistory: [
      {
        id: 'aud-ob-01',
        openingBalanceId: 'ob-seed-01',
        eventType: 'OPENING_BALANCE_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-01-01T10:00:00Z',
        version: 1
      },
      {
        id: 'aud-ob-02',
        openingBalanceId: 'ob-seed-01',
        eventType: 'OPENING_BALANCE_SUBMITTED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-01-01T10:15:00Z',
        version: 1
      },
      {
        id: 'aud-ob-03',
        openingBalanceId: 'ob-seed-01',
        eventType: 'OPENING_BALANCE_APPROVED',
        actorId: 'usr-manager-01',
        actorName: 'আব্দুর রহমান (ম্যানেজার)',
        timestamp: '2026-01-01T10:45:00Z',
        version: 1
      },
      {
        id: 'aud-ob-04',
        openingBalanceId: 'ob-seed-01',
        eventType: 'OPENING_BALANCE_POSTED',
        actorId: 'usr-manager-01',
        actorName: 'আব্দুর রহমান (ম্যানেজার)',
        timestamp: '2026-01-01T11:00:00Z',
        notes: 'Financial posting reference generated: TRX-2026-OB-000001',
        version: 1
      }
    ]
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
    supportingDocuments: [
      {
        id: 'doc-ob-02',
        name: 'IBBL_Statement_Dec_2025.pdf',
        type: 'bank_statement',
        referenceNumber: 'IBBL-STMT-9921',
        status: 'verified',
        attachedAt: '2026-01-01T10:30:00Z'
      }
    ],
    referenceNumber: 'IBBL-STMT-9921',
    notes: '৩১ ডিসেম্বর ২০২৫ তারিখের অফিসিয়াল ব্যাংক স্টেটমেন্ট অনুযায়ী প্রারম্ভিক ব্যাংক জের',
    status: 'APPROVED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    createdAt: '2026-01-01T10:30:00Z',
    updatedAt: '2026-01-01T11:30:00Z',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-01-01T10:45:00Z',
    approvedBy: 'usr-admin-01',
    approvedByName: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
    approvedAt: '2026-01-01T11:30:00Z',
    auditHistory: [
      {
        id: 'aud-ob-05',
        openingBalanceId: 'ob-seed-02',
        eventType: 'OPENING_BALANCE_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-01-01T10:30:00Z',
        version: 1
      },
      {
        id: 'aud-ob-06',
        openingBalanceId: 'ob-seed-02',
        eventType: 'OPENING_BALANCE_SUBMITTED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-01-01T10:45:00Z',
        version: 1
      },
      {
        id: 'aud-ob-07',
        openingBalanceId: 'ob-seed-02',
        eventType: 'OPENING_BALANCE_APPROVED',
        actorId: 'usr-admin-01',
        actorName: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
        timestamp: '2026-01-01T11:30:00Z',
        version: 1
      }
    ]
  },
  {
    id: 'ob-seed-03',
    organizationId: 'demo-org-khurushkul',
    openingBalanceCode: 'OB-2026-000003',
    version: 1,
    accountId: 'acc-khu-01',
    fundId: 'fnd-khu-02',
    amount: 50000,
    amountInWordsBn: 'পঞ্চাশ হাজার টাকা মাত্র',
    openingDate: '2026-01-01',
    reasonCode: 'committee_approved',
    supportingDocuments: [],
    referenceNumber: 'COM-RES-2026-02',
    notes: 'ক্যাশ বাক্সে সংরক্ষিত প্রকল্প তহবিলের প্রারম্ভিক শেয়ার মূলধন',
    status: 'SUBMITTED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    createdAt: '2026-01-02T09:00:00Z',
    updatedAt: '2026-01-02T09:15:00Z',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-01-02T09:15:00Z',
    auditHistory: [
      {
        id: 'aud-ob-08',
        openingBalanceId: 'ob-seed-03',
        eventType: 'OPENING_BALANCE_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-01-02T09:00:00Z',
        version: 1
      },
      {
        id: 'aud-ob-09',
        openingBalanceId: 'ob-seed-03',
        eventType: 'OPENING_BALANCE_SUBMITTED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-01-02T09:15:00Z',
        version: 1
      }
    ]
  },
  {
    id: 'ob-seed-04',
    organizationId: 'demo-org-khurushkul',
    openingBalanceCode: 'OB-2026-000004',
    version: 1,
    accountId: 'acc-khu-03',
    fundId: 'fnd-khu-01',
    amount: 60000,
    amountInWordsBn: 'ষাট হাজার টাকা মাত্র',
    openingDate: '2026-01-03',
    reasonCode: 'other',
    reasonDetails: 'পুরাতন অডিট রিপোর্টের অমিল সংশোধনের প্রস্তাবনা',
    supportingDocuments: [],
    notes: 'অসম্পূর্ণ কাগজপত্র থাকায় প্রত্যাখ্যাত হয়েছে',
    status: 'REJECTED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    createdAt: '2026-01-03T10:00:00Z',
    updatedAt: '2026-01-03T11:00:00Z',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-01-03T10:15:00Z',
    rejectedBy: 'usr-manager-01',
    rejectedByName: 'আব্দুর রহমান (ম্যানেজার)',
    rejectedAt: '2026-01-03T11:00:00Z',
    rejectionReason: 'যথাযথ ব্যাংক স্টেটমেন্ট বা রেজুলেশন কপি সংযুক্ত করা হয়নি',
    auditHistory: [
      {
        id: 'aud-ob-10',
        openingBalanceId: 'ob-seed-04',
        eventType: 'OPENING_BALANCE_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-01-03T10:00:00Z',
        version: 1
      },
      {
        id: 'aud-ob-11',
        openingBalanceId: 'ob-seed-04',
        eventType: 'OPENING_BALANCE_SUBMITTED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-01-03T10:15:00Z',
        version: 1
      },
      {
        id: 'aud-ob-12',
        openingBalanceId: 'ob-seed-04',
        eventType: 'OPENING_BALANCE_REJECTED',
        actorId: 'usr-manager-01',
        actorName: 'আব্দুর রহমান (ম্যানেজার)',
        timestamp: '2026-01-03T11:00:00Z',
        notes: 'প্রত্যাখ্যানের কারণ: যথাযথ ব্যাংক স্টেটমেন্ট বা রেজুলেশন কপি সংযুক্ত করা হয়নি',
        version: 1
      }
    ]
  }
];

function getDhakaTodayDateString(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export const OpeningBalanceManagementView: React.FC<OpeningBalanceManagementViewProps> = ({ currentOrg }) => {
  const [openingBalances, setOpeningBalances] = useState<OpeningBalanceEntry[]>(INITIAL_OPENING_BALANCES);
  const [currentActor, setCurrentActor] = useState<Actor>(ACTORS[0]);

  // Submodules navigation (5.6.1 to 5.6.6)
  const [activeSubTab, setActiveSubTab] = useState<'new_entry' | 'register' | 'pending_approval' | 'rejected_register' | 'voucher_view' | 'audit_history'>('register');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formAccountId, setFormAccountId] = useState<string>('acc-khu-01');
  const [formFundId, setFormFundId] = useState<string>('fnd-khu-01');
  const [formAmount, setFormAmount] = useState<string>('25000');
  const [formDate, setFormDate] = useState<string>('2026-01-01');
  const [formReasonCode, setFormReasonCode] = useState<OpeningBalanceReasonCode>('system_migration');
  const [formReasonDetails, setFormReasonDetails] = useState<string>('');
  const [formReferenceNumber, setFormReferenceNumber] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');

  // Modals & Inspection
  const [selectedEntry, setSelectedEntry] = useState<OpeningBalanceEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [entryToReject, setEntryToReject] = useState<OpeningBalanceEntry | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [isSensitiveRevealed, setIsSensitiveRevealed] = useState(false);

  // Feedback & Filters
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; text: string } | null>(null);
  const [filters, setFilters] = useState<OpeningBalanceFilterCriteria>({
    searchQuery: '',
    accountId: 'all',
    fundId: 'all',
    status: 'all',
    reasonCode: 'all'
  });

  const hasPermission = (perm: OpeningBalancePermissionKey): boolean => {
    const allowed = OB_ROLE_PERMISSIONS[currentActor.role] || [];
    return allowed.includes(perm);
  };

  // Eligible accounts for Opening Balance: current org, active, Cash/Bank, openingBalanceSupported === true
  const orgAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter(a =>
      a.organizationId === currentOrg.id &&
      a.status === 'active' &&
      (a.accountType === 'cash' || a.accountType === 'bank') &&
      a.openingBalanceSupported === true
    );
  }, [currentOrg.id]);

  const orgFunds = useMemo(() => {
    return MOCK_FUNDS.filter(f => f.organizationId === currentOrg.id && f.status === 'active' && f.isActive !== false);
  }, [currentOrg.id]);

  const orgEntries = useMemo(() => {
    return openingBalances.filter(o => o.organizationId === currentOrg.id);
  }, [openingBalances, currentOrg.id]);

  const filteredEntries = useMemo(() => {
    return orgEntries.filter(item => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesCode = item.openingBalanceCode.toLowerCase().includes(q);
        const matchesRef = (item.referenceNumber || '').toLowerCase().includes(q);
        const matchesNotes = (item.notes || '').toLowerCase().includes(q);
        if (!matchesCode && !matchesRef && !matchesNotes) return false;
      }
      if (filters.accountId && filters.accountId !== 'all' && item.accountId !== filters.accountId) return false;
      if (filters.fundId && filters.fundId !== 'all' && item.fundId !== filters.fundId) return false;
      if (filters.status && filters.status !== 'all' && item.status !== filters.status) return false;
      if (filters.reasonCode && filters.reasonCode !== 'all' && item.reasonCode !== filters.reasonCode) return false;
      return true;
    });
  }, [orgEntries, filters]);

  const metrics: OpeningBalanceSummaryMetrics = useMemo(() => {
    let draftCount = 0;
    let submittedCount = 0;
    let approvedCount = 0;
    let postedCount = 0;
    let rejectedCount = 0;
    let totalApprovedAmount = 0;
    let totalPostedAmount = 0;

    orgEntries.forEach(entry => {
      if (entry.status === 'DRAFT') draftCount++;
      if (entry.status === 'SUBMITTED') submittedCount++;
      if (entry.status === 'APPROVED') {
        approvedCount++;
        totalApprovedAmount += entry.amount;
      }
      if (entry.status === 'POSTED') {
        postedCount++;
        totalPostedAmount += entry.amount;
      }
      if (entry.status === 'REJECTED') rejectedCount++;
    });

    return {
      totalCount: orgEntries.length,
      draftCount,
      submittedCount,
      approvedCount,
      postedCount,
      rejectedCount,
      totalApprovedAmount,
      totalPostedAmount
    };
  }, [orgEntries]);

  const amountInWords = useMemo(() => {
    const val = parseFloat(formAmount);
    return isNaN(val) || val <= 0 ? 'শূন্য টাকা মাত্র' : numberToBengaliWords(val);
  }, [formAmount]);

  const resetForm = () => {
    setEditingId(null);
    setFormAccountId(orgAccounts[0]?.id || 'acc-khu-01');
    setFormFundId(orgFunds[0]?.id || 'fnd-khu-01');
    setFormAmount('25000');
    setFormDate('2026-01-01');
    setFormReasonCode('system_migration');
    setFormReasonDetails('');
    setFormReferenceNumber('');
    setFormNotes('');
  };

  const handleEditDraft = (entry: OpeningBalanceEntry) => {
    if (entry.status !== 'DRAFT') {
      setFeedbackMessage({ type: 'error', text: 'শুধুমাত্র খসড়া (DRAFT) প্রারম্ভিক স্থিতি সম্পাদনযোগ্য।' });
      return;
    }
    if (!hasPermission('finance.opening_balance.edit')) {
      setFeedbackMessage({ type: 'error', text: 'অনুমতি নেই: finance.opening_balance.edit পারমিশন আবশ্যক।' });
      return;
    }
    setEditingId(entry.id);
    setFormAccountId(entry.accountId);
    setFormFundId(entry.fundId);
    setFormAmount(entry.amount.toString());
    setFormDate(entry.openingDate);
    setFormReasonCode(entry.reasonCode);
    setFormReasonDetails(entry.reasonDetails || '');
    setFormReferenceNumber(entry.referenceNumber || '');
    setFormNotes(entry.notes || '');
    setActiveSubTab('new_entry');
  };

  const handleSaveEntry = (asDraft: boolean) => {
    const requiredPermission = editingId
      ? 'finance.opening_balance.edit'
      : (asDraft ? 'finance.opening_balance.create' : 'finance.opening_balance.submit');

    if (!hasPermission(requiredPermission)) {
      setFeedbackMessage({
        type: 'error',
        text: `অনুমতি নেই: ${requiredPermission} পারমিশন আবশ্যক (HTTP 403 Forbidden)`
      });
      return;
    }

    const numAmount = parseFloat(formAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFeedbackMessage({ type: 'error', text: 'অনুগ্রহ করে একটি বৈধ ধনাত্মক টাকার পরিমাণ দিন (পরিমাণ শূন্য বা ঋণাত্মক হতে পারবে না)।' });
      return;
    }

    // Validation 1: Future Date Block (Asia/Dhaka)
    const todayStr = getDhakaTodayDateString();
    if (formDate > todayStr) {
      setFeedbackMessage({
        type: 'error',
        text: `প্রারম্ভিক তারিখ ভবিষ্যতের হতে পারবে না (Asia/Dhaka আজকের তারিখ: ${todayStr})।`
      });
      return;
    }

    // Validation 2: Reason 'other' requires reasonDetails
    if (formReasonCode === 'other' && !formReasonDetails.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: 'কারণ হিসেবে "অন্যান্য" নির্বাচন করলে বিস্তারিত কারণ (Reason Details) লেখা বাধ্যতামূলক।'
      });
      return;
    }

    // Validation 3: Account verification
    const targetAccount = MOCK_ACCOUNTS.find(a => a.id === formAccountId && a.organizationId === currentOrg.id);
    if (!targetAccount) {
      setFeedbackMessage({
        type: 'error',
        text: 'নির্বাচিত হিসাব বর্তমান অর্গানাইজেশনের অন্তর্ভুক্ত নয়।'
      });
      return;
    }
    if (targetAccount.status !== 'active') {
      setFeedbackMessage({
        type: 'error',
        text: 'নির্বাচিত হিসাবটি সক্রিয় নয় (Inactive/Archived Account)।'
      });
      return;
    }
    if (targetAccount.accountType !== 'cash' && targetAccount.accountType !== 'bank') {
      setFeedbackMessage({
        type: 'error',
        text: 'প্রারম্ভিক স্থিতি শুধুমাত্র নগদ (Cash) বা ব্যাংক (Bank) হিসাবের ক্ষেত্রে প্রযোজ্য।'
      });
      return;
    }
    if (targetAccount.openingBalanceSupported !== true) {
      setFeedbackMessage({
        type: 'error',
        text: 'এই হিসাবের জন্য প্রারম্ভিক স্থিতি অনুমোদিত নয় (openingBalanceSupported=false)।'
      });
      return;
    }

    // Validation 4: Fund verification
    const targetFund = MOCK_FUNDS.find(f => f.id === formFundId && f.organizationId === currentOrg.id);
    if (!targetFund) {
      setFeedbackMessage({
        type: 'error',
        text: 'নির্বাচিত তহবিল বর্তমান অর্গানাইজেশনের অন্তর্ভুক্ত নয়।'
      });
      return;
    }
    if (targetFund.status !== 'active' || targetFund.isActive === false) {
      setFeedbackMessage({
        type: 'error',
        text: 'নির্বাচিত তহবিল সক্রিয় নয় (Inactive/Archived Fund)।'
      });
      return;
    }

    // Validation 5: Fund-Account Association
    if (targetAccount.associatedFundIds && targetAccount.associatedFundIds.length > 0) {
      if (!targetAccount.associatedFundIds.includes(formFundId)) {
        setFeedbackMessage({
          type: 'error',
          text: `নির্বাচিত হিসাব ও তহবিলের মধ্যে সংযোগ নেই (হিসাব "${targetAccount.accountName}" তহবিল "${targetFund.name}" সমর্থন করে না)।`
        });
        return;
      }
    }

    // Validation 6: Duplicate Dimension (Org + Date + Account + Fund)
    const existingDuplicate = orgEntries.find(o =>
      o.id !== editingId &&
      o.accountId === formAccountId &&
      o.fundId === formFundId &&
      o.openingDate === formDate &&
      (o.status === 'APPROVED' || o.status === 'POSTED' || o.status === 'SUBMITTED')
    );

    if (existingDuplicate) {
      setFeedbackMessage({
        type: 'error',
        text: `এই হিসাব ও তহবিলের জন্য একই তারিখে প্রারম্ভিক স্থিতি ইতোমধ্যে রয়েছে (${existingDuplicate.openingBalanceCode} — স্ট্যাটাস: ${existingDuplicate.status})।`
      });
      return;
    }

    const timestamp = new Date().toISOString();

    if (editingId) {
      // Editing existing draft
      const existing = openingBalances.find(o => o.id === editingId);
      if (!existing || existing.status !== 'DRAFT') {
        setFeedbackMessage({ type: 'error', text: 'অনুমোদিত বা প্রক্রিয়াকৃত প্রারম্ভিক স্থিতি পরিবর্তন করা যাবে না।' });
        return;
      }

      const updateAudit: OpeningBalanceAuditEvent = {
        id: `aud-ob-upd-${Date.now()}`,
        openingBalanceId: existing.id,
        eventType: 'OPENING_BALANCE_UPDATED',
        actorId: currentActor.id,
        actorName: currentActor.name,
        timestamp,
        version: existing.version + 1,
        notes: asDraft ? 'খসড়া প্রারম্ভিক স্থিতি হালনাগাদ করা হয়েছে' : 'খসড়া হালনাগাদ ও দাখিল সম্পন্ন'
      };

      const updatedEntry: OpeningBalanceEntry = {
        ...existing,
        version: existing.version + 1,
        accountId: formAccountId,
        fundId: formFundId,
        amount: numAmount,
        amountInWordsBn: amountInWords,
        openingDate: formDate,
        reasonCode: formReasonCode,
        reasonDetails: formReasonCode === 'other' ? formReasonDetails : undefined,
        referenceNumber: formReferenceNumber,
        notes: formNotes,
        status: asDraft ? 'DRAFT' : 'SUBMITTED',
        updatedAt: timestamp,
        submittedBy: asDraft ? existing.submittedBy : currentActor.id,
        submittedByName: asDraft ? existing.submittedByName : currentActor.name,
        submittedAt: asDraft ? existing.submittedAt : timestamp,
        auditHistory: [...existing.auditHistory, updateAudit]
      };

      setOpeningBalances(prev => prev.map(o => o.id === existing.id ? updatedEntry : o));
      setFeedbackMessage({
        type: 'success',
        text: asDraft
          ? `প্রারম্ভিক স্থিতি ${existing.openingBalanceCode} সফলভাবে হালনাগাদ করা হয়েছে।`
          : `প্রারম্ভিক স্থিতি ${existing.openingBalanceCode} হালনাগাদ করে অনুমোদনের জন্য দাখিল করা হয়েছে।`
      });
      resetForm();
      setActiveSubTab('register');
      return;
    }

    // New Entry Creation
    const newSeq = (orgEntries.length + 1).toString().padStart(6, '0');
    const newCode = `OB-2026-${newSeq}`;
    const newId = `ob-${Date.now()}`;

    const createAudit: OpeningBalanceAuditEvent = {
      id: `aud-ob-${Date.now()}-1`,
      openingBalanceId: newId,
      eventType: 'OPENING_BALANCE_CREATED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp,
      version: 1,
      notes: asDraft ? 'নতুন খসড়া প্রারম্ভিক স্থিতি প্রস্তুত' : 'প্রারম্ভিক স্থিতি দাখিলের জন্য প্রস্তুত'
    };

    const newEntry: OpeningBalanceEntry = {
      id: newId,
      organizationId: currentOrg.id,
      openingBalanceCode: newCode,
      version: 1,
      accountId: formAccountId,
      fundId: formFundId,
      amount: numAmount,
      amountInWordsBn: amountInWords,
      openingDate: formDate,
      reasonCode: formReasonCode,
      reasonDetails: formReasonCode === 'other' ? formReasonDetails : undefined,
      supportingDocuments: [],
      referenceNumber: formReferenceNumber,
      notes: formNotes,
      status: asDraft ? 'DRAFT' : 'SUBMITTED',
      createdBy: currentActor.id,
      createdByName: currentActor.name,
      createdAt: timestamp,
      updatedAt: timestamp,
      submittedBy: asDraft ? undefined : currentActor.id,
      submittedByName: asDraft ? undefined : currentActor.name,
      submittedAt: asDraft ? undefined : timestamp,
      auditHistory: [createAudit]
    };

    if (!asDraft) {
      newEntry.auditHistory.push({
        id: `aud-ob-${Date.now()}-2`,
        openingBalanceId: newId,
        eventType: 'OPENING_BALANCE_SUBMITTED',
        actorId: currentActor.id,
        actorName: currentActor.name,
        timestamp,
        version: 1,
        notes: 'অনুমোদনের জন্য দাখিল সম্পন্ন'
      });
    }

    setOpeningBalances(prev => [newEntry, ...prev]);
    setFeedbackMessage({
      type: 'success',
      text: asDraft
        ? `খসড়া প্রারম্ভিক স্থিতি ${newCode} সফলভাবে তৈরি হয়েছে।`
        : `প্রারম্ভিক স্থিতি ${newCode} অনুমোদনের জন্য দাখিল করা হয়েছে (Maker-Checker চেকের অপেক্ষমাণ)।`
    });
    resetForm();
    setActiveSubTab('register');
  };

  const handleSubmitDraft = (entry: OpeningBalanceEntry) => {
    if (!hasPermission('finance.opening_balance.submit')) {
      setFeedbackMessage({ type: 'error', text: 'অনুমতি নেই: finance.opening_balance.submit পারমিশন আবশ্যক।' });
      return;
    }
    if (entry.status !== 'DRAFT') {
      setFeedbackMessage({ type: 'error', text: 'শুধুমাত্র খসড়া প্রারম্ভিক স্থিতি দাখিল করা যায়।' });
      return;
    }

    const timestamp = new Date().toISOString();
    const updated: OpeningBalanceEntry = {
      ...entry,
      status: 'SUBMITTED',
      submittedBy: currentActor.id,
      submittedByName: currentActor.name,
      submittedAt: timestamp,
      updatedAt: timestamp,
      auditHistory: [
        ...entry.auditHistory,
        {
          id: `aud-ob-${Date.now()}`,
          openingBalanceId: entry.id,
          eventType: 'OPENING_BALANCE_SUBMITTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: entry.version,
          notes: 'খসড়া থেকে দাখিল সম্পন্ন'
        }
      ]
    };
    setOpeningBalances(prev => prev.map(o => o.id === entry.id ? updated : o));
    setFeedbackMessage({ type: 'success', text: `প্রারম্ভিক স্থিতি ${entry.openingBalanceCode} দাখিল করা হয়েছে।` });
  };

  const handleApproveEntry = (entry: OpeningBalanceEntry) => {
    if (!hasPermission('finance.opening_balance.approve')) {
      setFeedbackMessage({ type: 'error', text: 'অনুমতি নেই: finance.opening_balance.approve পারমিশন আবশ্যক (HTTP 403 Forbidden)।' });
      return;
    }

    // Maker-Checker Rule
    if (entry.createdBy === currentActor.id) {
      setFeedbackMessage({
        type: 'error',
        text: 'আপনি নিজের তৈরি প্রারম্ভিক স্থিতি অনুমোদন করতে পারবেন না (Maker-Checker Separation of Duties)।'
      });
      return;
    }

    // State Machine Check
    if (entry.status !== 'SUBMITTED') {
      setFeedbackMessage({
        type: 'error',
        text: `অবৈধ ট্রানজিশন: শুধুমাত্র SUBMITTED প্রারম্ভিক স্থিতি অনুমোদনযোগ্য। বর্তমান স্ট্যাটাস: ${entry.status}`
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const updated: OpeningBalanceEntry = {
      ...entry,
      status: 'APPROVED',
      approvedBy: currentActor.id,
      approvedByName: currentActor.name,
      approvedAt: timestamp,
      updatedAt: timestamp,
      auditHistory: [
        ...entry.auditHistory,
        {
          id: `aud-ob-${Date.now()}`,
          openingBalanceId: entry.id,
          eventType: 'OPENING_BALANCE_APPROVED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: entry.version,
          notes: 'যাচাই ও অনুমোদন সম্পন্ন; পোস্টিংয়ের জন্য প্রস্তুত'
        }
      ]
    };

    setOpeningBalances(prev => prev.map(o => o.id === entry.id ? updated : o));
    setFeedbackMessage({
      type: 'success',
      text: `প্রারম্ভিক স্থিতি ${entry.openingBalanceCode} অনুমোদিত হয়েছে (APPROVED)।`
    });
  };

  const handlePostEntry = (entry: OpeningBalanceEntry) => {
    if (!hasPermission('finance.opening_balance.post')) {
      setFeedbackMessage({ type: 'error', text: 'অনুমতি নেই: finance.opening_balance.post পারমিশন আবশ্যক।' });
      return;
    }

    // State machine check
    if (entry.status !== 'APPROVED') {
      setFeedbackMessage({
        type: 'error',
        text: 'অবৈধ ট্রানজিশন: শুধুমাত্র APPROVED প্রারম্ভিক স্থিতি পোস্টযোগ্য।'
      });
      return;
    }

    // Idempotency check
    if (entry.isFinancialPosted || entry.financialTransactionId) {
      setFeedbackMessage({
        type: 'warning',
        text: `আইডেমপোটেন্সি সতর্কতা: প্রারম্ভিক স্থিতি ${entry.openingBalanceCode} ইতোমধ্যে পোস্ট করা হয়েছে (${entry.financialTransactionId})।`
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const financialTxnId = `TRX-2026-OB-${entry.openingBalanceCode.replace('OB-2026-', '')}`;

    const updated: OpeningBalanceEntry = {
      ...entry,
      status: 'POSTED',
      postedBy: currentActor.id,
      postedByName: currentActor.name,
      postedAt: timestamp,
      financialTransactionId: financialTxnId,
      isFinancialPosted: true,
      updatedAt: timestamp,
      auditHistory: [
        ...entry.auditHistory,
        {
          id: `aud-ob-${Date.now()}`,
          openingBalanceId: entry.id,
          eventType: 'OPENING_BALANCE_POSTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: entry.version,
          notes: `অফিসিয়াল পোস্টিং সম্পন্ন: ${financialTxnId} (Idempotency Key Generated)`
        }
      ]
    };

    setOpeningBalances(prev => prev.map(o => o.id === entry.id ? updated : o));
    setFeedbackMessage({
      type: 'success',
      text: `প্রারম্ভিক স্থিতি ${entry.openingBalanceCode} সফলভাবে পোস্ট করা হয়েছে! পোস্টিং রেফারেন্স: ${financialTxnId}`
    });
  };

  const handleConfirmReject = () => {
    if (!entryToReject) return;
    if (!hasPermission('finance.opening_balance.reject')) {
      setFeedbackMessage({ type: 'error', text: 'অনুমতি নেই: finance.opening_balance.reject পারমিশন আবশ্যক।' });
      return;
    }
    if (!rejectionReasonInput.trim()) {
      setFeedbackMessage({ type: 'error', text: 'প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক।' });
      return;
    }

    const timestamp = new Date().toISOString();
    const updated: OpeningBalanceEntry = {
      ...entryToReject,
      status: 'REJECTED',
      rejectedBy: currentActor.id,
      rejectedByName: currentActor.name,
      rejectedAt: timestamp,
      rejectionReason: rejectionReasonInput.trim(),
      updatedAt: timestamp,
      auditHistory: [
        ...entryToReject.auditHistory,
        {
          id: `aud-ob-${Date.now()}`,
          openingBalanceId: entryToReject.id,
          eventType: 'OPENING_BALANCE_REJECTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: entryToReject.version,
          notes: `প্রত্যাখ্যানের কারণ: ${rejectionReasonInput.trim()}`
        }
      ]
    };

    setOpeningBalances(prev => prev.map(o => o.id === entryToReject.id ? updated : o));
    setIsRejectModalOpen(false);
    setEntryToReject(null);
    setRejectionReasonInput('');
    setFeedbackMessage({ type: 'warning', text: `প্রারম্ভিক স্থিতি ${entryToReject.openingBalanceCode} প্রত্যাখ্যাত (REJECTED) হয়েছে।` });
  };

  const handleReopenToDraft = (entry: OpeningBalanceEntry) => {
    if (!hasPermission('finance.opening_balance.reopen')) {
      setFeedbackMessage({
        type: 'error',
        text: 'অনুমতি নেই: finance.opening_balance.reopen পারমিশন আবশ্যক (HTTP 403 Forbidden)'
      });
      return;
    }
    if (entry.status !== 'REJECTED') {
      setFeedbackMessage({
        type: 'error',
        text: 'শুধুমাত্র প্রত্যাখ্যাত (REJECTED) প্রারম্ভিক স্থিতি পুনরায় খসড়া করা সম্ভব।'
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const reopenAudit: OpeningBalanceAuditEvent = {
      id: `aud-ob-${Date.now()}`,
      openingBalanceId: entry.id,
      eventType: 'OPENING_BALANCE_REOPENED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp,
      previousStatus: 'REJECTED',
      newStatus: 'DRAFT',
      version: entry.version + 1,
      notes: `প্রত্যাখ্যাত প্রারম্ভিক স্থিতি (${entry.openingBalanceCode}) পুনর্বিবেচনার জন্য খসড়ায় (DRAFT) রূপান্তর করা হয়েছে`
    };

    const updated: OpeningBalanceEntry = {
      ...entry,
      status: 'DRAFT',
      version: entry.version + 1,
      rejectionReason: undefined,
      rejectedBy: undefined,
      rejectedByName: undefined,
      rejectedAt: undefined,
      updatedAt: timestamp,
      // Zero financial posting impact
      financialTransactionId: undefined,
      isFinancialPosted: false,
      auditHistory: [...entry.auditHistory, reopenAudit]
    };

    setOpeningBalances(prev => prev.map(o => o.id === entry.id ? updated : o));
    setFeedbackMessage({
      type: 'info',
      text: `প্রারম্ভিক স্থিতি ${entry.openingBalanceCode} খসড়া হিসেবে উন্মুক্ত হয়েছে (OPENING_BALANCE_REOPENED অডিট সংরক্ষিত)।`
    });
  };

  const handleOpenVoucherModal = (entry: OpeningBalanceEntry) => {
    const timestamp = new Date().toISOString();
    const updated: OpeningBalanceEntry = {
      ...entry,
      auditHistory: [
        ...entry.auditHistory,
        {
          id: `aud-ob-${Date.now()}`,
          openingBalanceId: entry.id,
          eventType: 'OPENING_BALANCE_PRINTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: entry.version,
          notes: 'A4 প্রারম্ভিক স্থিতি ভাউচার প্রদর্শিত/প্রিন্ট রিকোয়েস্ট'
        }
      ]
    };
    setSelectedEntry(updated);
    setOpeningBalances(prev => prev.map(o => o.id === entry.id ? updated : o));
    setIsVoucherModalOpen(true);
  };

  const handleRevealSensitive = (entry: OpeningBalanceEntry) => {
    const timestamp = new Date().toISOString();
    const updated: OpeningBalanceEntry = {
      ...entry,
      auditHistory: [
        ...entry.auditHistory,
        {
          id: `aud-ob-${Date.now()}`,
          openingBalanceId: entry.id,
          eventType: 'OPENING_BALANCE_SENSITIVE_VIEWED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: entry.version,
          notes: 'সংবেদনশীল ব্যাংক হিসাব ও রাউটিং তথ্য প্রদর্শন করা হয়েছে'
        }
      ]
    };
    setIsSensitiveRevealed(true);
    setSelectedEntry(updated);
    setOpeningBalances(prev => prev.map(o => o.id === entry.id ? updated : o));
  };

  const getAccountName = (accId: string) => {
    const acc = MOCK_ACCOUNTS.find(a => a.id === accId);
    return acc ? `${acc.accountName} [${acc.accountCode}]` : accId;
  };

  const getFundName = (fndId: string) => {
    const fnd = MOCK_FUNDS.find(f => f.id === fndId);
    return fnd ? `${fnd.name}` : fndId;
  };

  const getStatusBadge = (status: OpeningBalanceStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">খসড়া (DRAFT)</span>;
      case 'SUBMITTED':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"><Clock className="w-3 h-3" /> দাখিলকৃত (SUBMITTED)</span>;
      case 'APPROVED':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> অনুমোদিত (APPROVED)</span>;
      case 'POSTED':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"><FileCheck className="w-3 h-3" /> পোস্টকৃত (POSTED)</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1"><XCircle className="w-3 h-3" /> প্রত্যাখ্যাত (REJECTED)</span>;
    }
  };

  // Pending approval list
  const pendingEntries = useMemo(() => {
    return orgEntries.filter(o => o.status === 'SUBMITTED');
  }, [orgEntries]);

  // Rejected entries list
  const rejectedEntries = useMemo(() => {
    return orgEntries.filter(o => o.status === 'REJECTED');
  }, [orgEntries]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                Phase 5.6 — Opening Balance
              </span>
              <span className="text-xs font-mono text-slate-400">OB-2026-ARCH</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <Wallet className="w-6 h-6 text-teal-600" />
              <span>প্রারম্ভিক স্থিতি ব্যবস্থাপনা (Opening Balance Management)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              হিসাবের প্রারম্ভিক জের নিয়ন্ত্রণ ও সংরক্ষণ — এটি কোনো আয়, ব্যয়, ট্রান্সফার, অনুদান বা মুনাফা নয়।
            </p>
          </div>

          {/* Actor / Role Selector for Simulator */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span>বর্তমান ইউজার সিমুলেশন:</span>
            </div>
            <select
              value={currentActor.id}
              onChange={(e) => {
                const found = ACTORS.find(a => a.id === e.target.value);
                if (found) setCurrentActor(found);
              }}
              className="text-xs font-semibold bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-teal-500"
            >
              {ACTORS.map(actor => (
                <option key={actor.id} value={actor.id}>
                  {actor.name} ({actor.role.toUpperCase()})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400">
              ({OB_ROLE_PERMISSIONS[currentActor.role].length} পারমিশন সক্রিয়)
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className={`mt-4 p-3 rounded-lg border text-xs flex items-center justify-between ${
            feedbackMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            feedbackMessage.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
            feedbackMessage.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
               feedbackMessage.type === 'error' ? <AlertTriangle className="w-4 h-4 text-rose-600" /> :
               <Info className="w-4 h-4 text-blue-600" />}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-slate-400 hover:text-slate-600 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 font-numeric">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <span className="text-[11px] text-slate-500 font-medium">মোট এন্ট্রি</span>
            <div className="text-lg font-bold text-slate-900">{metrics.totalCount} টি</div>
            <span className="text-[10px] text-slate-400">চলতি অর্গানাইজেশন</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <span className="text-[11px] text-amber-800 font-medium">দাখিলকৃত (Pending)</span>
            <div className="text-lg font-bold text-amber-900">{metrics.submittedCount} টি</div>
            <span className="text-[10px] text-amber-700">অনুমোদনের অপেক্ষায়</span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span className="text-[11px] text-blue-800 font-medium">অনুমোদিত (Ready)</span>
            <div className="text-lg font-bold text-blue-900">৳ {metrics.totalApprovedAmount.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-blue-700">{metrics.approvedCount} টি পোস্টিং প্রস্তুত</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <span className="text-[11px] text-emerald-800 font-medium">পোস্টকৃত (POSTED)</span>
            <div className="text-lg font-bold text-emerald-900">৳ {metrics.totalPostedAmount.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-emerald-700">{metrics.postedCount} টি চূড়ান্ত নিষ্পত্তিকৃত</span>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
            <span className="text-[11px] text-rose-800 font-medium">প্রত্যাখ্যাত</span>
            <div className="text-lg font-bold text-rose-900">{metrics.rejectedCount} টি</div>
            <span className="text-[10px] text-rose-700">পুনঃসংশোধনযোগ্য</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <span className="text-[11px] text-slate-600 font-medium">খসড়া (DRAFT)</span>
            <div className="text-lg font-bold text-slate-900">{metrics.draftCount} টি</div>
            <span className="text-[10px] text-slate-400">অসম্পূর্ণ খসড়া</span>
          </div>
        </div>

        {/* 6 Submodules Tab Navigation (5.6.1 to 5.6.6) */}
        <div className="flex border-b border-slate-200 mt-6 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('register')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'register' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>৫.৬.২ প্রারম্ভিক স্থিতি রেজিস্টার ({filteredEntries.length})</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setActiveSubTab('new_entry');
            }}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'new_entry' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingId ? '৫.৬.১ খসড়া সম্পাদনা' : '৫.৬.১ নতুন প্রারম্ভিক স্থিতি'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pending_approval')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'pending_approval' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>৫.৬.৩ Pending Approval ({pendingEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rejected_register')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'rejected_register' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>৫.৬.৪ Rejected Opening Balance ({rejectedEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit_history')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'audit_history' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4 text-indigo-600" />
            <span>৫.৬.৬ Opening Balance Audit History</span>
          </button>
        </div>
      </div>

      {/* SUBMODULE 5.6.2: REGISTER VIEW */}
      {activeSubTab === 'register' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-1 min-w-[240px] items-center gap-2 border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 text-xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="কোড, রেফারেন্স নম্বর বা বিবরণ দ্বারা অনুসন্ধান..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="bg-transparent flex-1 focus:outline-none text-slate-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="DRAFT">খসড়া (DRAFT)</option>
                <option value="SUBMITTED">দাখিলকৃত (SUBMITTED)</option>
                <option value="APPROVED">অনুমোদিত (APPROVED)</option>
                <option value="POSTED">পোস্টকৃত (POSTED)</option>
                <option value="REJECTED">প্রত্যাখ্যাত (REJECTED)</option>
              </select>

              <select
                value={filters.accountId}
                onChange={(e) => setFilters(prev => ({ ...prev, accountId: e.target.value }))}
                className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">সব হিসাব (All Accounts)</option>
                {orgAccounts.map(a => (
                  <option key={a.id} value={a.id}>{a.accountName}</option>
                ))}
              </select>

              <select
                value={filters.fundId}
                onChange={(e) => setFilters(prev => ({ ...prev, fundId: e.target.value }))}
                className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">সব তহবিল (All Funds)</option>
                {orgFunds.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <select
                value={filters.reasonCode}
                onChange={(e) => setFilters(prev => ({ ...prev, reasonCode: e.target.value as any }))}
                className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">সব কারণ (All Reasons)</option>
                {Object.values(OPENING_BALANCE_REASONS).map(r => (
                  <option key={r.code} value={r.code}>{r.labelBn}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">কোড / তারিখ</th>
                    <th className="py-3 px-4">হিসাব (Account)</th>
                    <th className="py-3 px-4">তহবিল (Fund)</th>
                    <th className="py-3 px-4 text-right">পরিমাণ (টাকা)</th>
                    <th className="py-3 px-4">কারণ (Reason)</th>
                    <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                    <th className="py-3 px-4">প্রস্তুতকারী / অনুমোদনকারী</th>
                    <th className="py-3 px-4 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        কোনো প্রারম্ভিক স্থিতি পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{item.openingBalanceCode}</div>
                          <div className="text-[11px] text-slate-500 font-numeric">{item.openingDate}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-900 block">{getAccountName(item.accountId)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-medium">
                            {getFundName(item.fundId)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-numeric font-bold text-slate-900">
                          ৳ {item.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="block font-medium text-slate-800">
                            {OPENING_BALANCE_REASONS[item.reasonCode]?.labelBn || item.reasonCode}
                          </span>
                          {item.reasonDetails && (
                            <span className="text-[11px] text-slate-500 line-clamp-1">{item.reasonDetails}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          <div>প্রস্তুতকারী: <span className="font-medium text-slate-700">{item.createdByName}</span></div>
                          {item.approvedByName && (
                            <div>অনুমোদনকারী: <span className="font-medium text-blue-700">{item.approvedByName}</span></div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Inspect */}
                            <button
                              onClick={() => {
                                setSelectedEntry(item);
                                setIsSensitiveRevealed(false);
                                setIsDetailModalOpen(true);
                              }}
                              title="বিস্তারিত বিবরণ"
                              className="p-1 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit (Draft only) */}
                            {item.status === 'DRAFT' && (
                              <button
                                onClick={() => handleEditDraft(item)}
                                title="খসড়া সম্পাদনা"
                                className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}

                            {/* Submit (Draft only) */}
                            {item.status === 'DRAFT' && (
                              <button
                                onClick={() => handleSubmitDraft(item)}
                                title="অনুমোদনের জন্য দাখিল করুন"
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}

                            {/* Post (Approved only) */}
                            {item.status === 'APPROVED' && !item.isFinancialPosted && (
                              <button
                                onClick={() => handlePostEntry(item)}
                                title="ফিন্যান্সিয়াল পোস্টিং সম্পন্ন করুন"
                                className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700 flex items-center gap-1"
                              >
                                <FileCheck className="w-3.5 h-3.5" />
                                <span>পোস্ট</span>
                              </button>
                            )}

                            {/* Reopen (Rejected only) */}
                            {item.status === 'REJECTED' && (
                              <button
                                onClick={() => handleReopenToDraft(item)}
                                title="পুনরায় খসড়া করুন"
                                className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}

                            {/* Print Voucher */}
                            <button
                              onClick={() => handleOpenVoucherModal(item)}
                              title="A4 প্রারম্ভিক স্থিতি ভাউচার প্রিন্ট"
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* SUBMODULE 5.6.1: NEW / EDIT ENTRY FORM */}
      {activeSubTab === 'new_entry' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-teal-600" />
              <span>{editingId ? 'খসড়া প্রারম্ভিক স্থিতি সম্পাদনা' : '৫.৬.১ নতুন প্রারম্ভিক স্থিতি এন্ট্রি (Opening Balance Entry)'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              হিসাবের প্রারম্ভিক জের সংযোজন করুন। এটি কোনো আয়, ব্যয়, লেনদেন বা অনুদান নয়।
            </p>
          </div>

          {/* Section A: Opening Information */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-600">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>সেকশন ক — প্রারম্ভিক তারিখ ও কারণ (Opening Information)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  প্রারম্ভিক তারিখ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  max={getDhakaTodayDateString()}
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 font-numeric focus:ring-1 focus:ring-teal-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  ভবিষ্যতের তারিখ অনুমোদিত নয় (সর্বোচ্চ আজকের তারিখ Asia/Dhaka)
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  প্রারম্ভিক স্থিতির কারণ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formReasonCode}
                  onChange={(e) => setFormReasonCode(e.target.value as OpeningBalanceReasonCode)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  {Object.values(OPENING_BALANCE_REASONS).map(r => (
                    <option key={r.code} value={r.code}>{r.labelBn}</option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {OPENING_BALANCE_REASONS[formReasonCode]?.descriptionBn}
                </span>
              </div>
            </div>

            {formReasonCode === 'other' && (
              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">
                  অন্যান্য কারণের বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formReasonDetails}
                  onChange={(e) => setFormReasonDetails(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-teal-500"
                  placeholder="সুনির্দিষ্ট ও গ্রহণযোগ্য কারণ উল্লেখ করুন"
                />
              </div>
            )}
          </div>

          {/* Section B: Financial Position */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-600">
              <Coins className="w-4 h-4 text-teal-600" />
              <span>সেকশন খ — আর্থিক অবস্থান ও তহবিল সংযোগ (Financial Position)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  হিসাব নির্বাচন (Account - Cash/Bank) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formAccountId}
                  onChange={(e) => setFormAccountId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  {orgAccounts.map(a => (
                    <option key={a.id} value={a.id}>{a.accountName} [{a.accountCode}]</option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  শুধুমাত্র প্রারম্ভিক স্থিতি সমর্থিত সক্রিয় নগদ ও ব্যাংক হিসাব
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  তহবিল নির্বাচন (Fund) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formFundId}
                  onChange={(e) => setFormFundId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  {orgFunds.map(f => (
                    <option key={f.id} value={f.id}>{f.name} [{f.fundCode}]</option>
                  ))}
                </select>
                <span className="text-[10px] text-teal-600 mt-1 block">
                  হিসাবের সমর্থিত তহবিলের তালিকায় থাকা বাধ্যতামূলক
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  প্রারম্ভিক টাকার পরিমাণ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 font-numeric font-bold text-sm focus:ring-1 focus:ring-teal-500"
                  placeholder="যেমন: 50000"
                />
                <span className="text-[11px] text-teal-700 font-medium block mt-1">
                  কথায়: {amountInWords}
                </span>
              </div>
            </div>
          </div>

          {/* Section C: Evidence & Notes */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-600">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>সেকশন গ — প্রমাণপত্র ও রেফারেন্স (Evidence & Notes)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">রেফারেন্স নম্বর / রেজুলেশন নম্বর</label>
                <input
                  type="text"
                  value={formReferenceNumber}
                  onChange={(e) => setFormReferenceNumber(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-teal-500"
                  placeholder="যেমন: RES-2026-01-A অথবা STMT-DEC-2025"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">অভ্যন্তরীণ নোট বা বিবরণ</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-teal-500"
                  placeholder="অডিট সংশ্লিষ্ট যেকোনো তথ্য"
                />
              </div>
            </div>
          </div>

          {/* Section D: Action Buttons */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-200 pt-4 gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              ফর্ম পরিষ্কার করুন
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveEntry(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>খসড়া (DRAFT) সংরক্ষণ করুন</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveEntry(false)}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>অনুমোদনের জন্য দাখিল করুন (Submit)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE 5.6.3: PENDING APPROVAL SUBVIEW */}
      {activeSubTab === 'pending_approval' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>৫.৬.৩ অনুমোদনের অপেক্ষায় থাকা প্রারম্ভিক স্থিতি (Pending Approval)</span>
              </h2>
              <p className="text-slate-500 mt-0.5">
                শুধুমাত্র SUBMITTED স্ট্যাটাসের প্রারম্ভিক জের তালিকাভুক্ত। প্রস্তুতকারী (Maker) নিজে অনুমোদন করতে পারবেন না।
              </p>
            </div>
            <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              অপেক্ষমাণ: {pendingEntries.length} টি
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">কোড / তারিখ</th>
                  <th className="py-2.5 px-3">হিসাব</th>
                  <th className="py-2.5 px-3">তহবিল</th>
                  <th className="py-2.5 px-3 text-right">পরিমাণ</th>
                  <th className="py-2.5 px-3">দাখিলকারী (Maker)</th>
                  <th className="py-2.5 px-3 text-right">অনুমোদন কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      অনুমোদনের অপেক্ষায় কোনো প্রারম্ভিক স্থিতি নেই।
                    </td>
                  </tr>
                ) : (
                  pendingEntries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900">{item.openingBalanceCode}</span>
                        <div className="text-[11px] text-slate-500 font-numeric">{item.openingDate}</div>
                      </td>
                      <td className="py-3 px-3">{getAccountName(item.accountId)}</td>
                      <td className="py-3 px-3">{getFundName(item.fundId)}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-numeric">
                        ৳ {item.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {item.submittedByName} ({item.submittedAt?.split('T')[0]})
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApproveEntry(item)}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন</span>
                          </button>
                          <button
                            onClick={() => {
                              setEntryToReject(item);
                              setIsRejectModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded font-semibold hover:bg-rose-700 flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>প্রত্যাখ্যান</span>
                          </button>
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

      {/* SUBMODULE 5.6.4: REJECTED REGISTER SUBVIEW */}
      {activeSubTab === 'rejected_register' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>৫.৬.৪ প্রত্যাখ্যাত প্রারম্ভিক স্থিতি রেজিস্টার (Rejected Opening Balance)</span>
              </h2>
              <p className="text-slate-500 mt-0.5">
                প্রত্যাখ্যাত এন্ট্রিগুলোর কারণ পর্যালোচনা করুন এবং সংশোধন করতে পুনরায় খসড়ায় রূপান্তর করুন।
              </p>
            </div>
            <span className="font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
              প্রত্যাখ্যাত: {rejectedEntries.length} টি
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">কোড / তারিখ</th>
                  <th className="py-2.5 px-3">হিসাব ও তহবিল</th>
                  <th className="py-2.5 px-3 text-right">পরিমাণ</th>
                  <th className="py-2.5 px-3">প্রত্যাখ্যানের কারণ</th>
                  <th className="py-2.5 px-3">প্রত্যাখ্যানকারী</th>
                  <th className="py-2.5 px-3 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rejectedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      কোনো প্রত্যাখ্যাত প্রারম্ভিক স্থিতি নেই।
                    </td>
                  </tr>
                ) : (
                  rejectedEntries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900">{item.openingBalanceCode}</span>
                        <div className="text-[11px] text-slate-500 font-numeric">{item.openingDate}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div>{getAccountName(item.accountId)}</div>
                        <span className="text-[11px] text-teal-700 font-medium">{getFundName(item.fundId)}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-numeric">
                        ৳ {item.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-rose-700">
                        <span className="bg-rose-50 border border-rose-200 px-2 py-1 rounded block">
                          {item.rejectionReason}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px]">
                        {item.rejectedByName} ({item.rejectedAt?.split('T')[0]})
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleReopenToDraft(item)}
                          className="px-3 py-1 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700 flex items-center gap-1 ml-auto"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>পুনরায় খসড়া করুন (Reopen)</span>
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

      {/* SUBMODULE 5.6.6: AUDIT HISTORY SUBVIEW */}
      {activeSubTab === 'audit_history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              <span>৫.৬.৬ Opening Balance Audit History (সকল প্রারম্ভিক স্থিতির নিরীক্ষা ইতিহাস)</span>
            </h2>
            <p className="text-slate-500 mt-0.5">
              অপরিবর্তনযোগ্য অ্যাপেন্ড-অনলি অডিট ট্রেইল। সংবেদনশীল ব্যাংক অ্যাকাউন্টের কাঁচা তথ্য অডিটে প্রদর্শিত হয় না।
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {orgEntries.flatMap(e => e.auditHistory.map(aud => ({ ...aud, code: e.openingBalanceCode }))).length === 0 ? (
              <div className="p-4 text-center text-slate-400">কোনো অডিট রেকর্ড পাওয়া যায়নি।</div>
            ) : (
              orgEntries.flatMap(e => e.auditHistory.map(aud => ({ ...aud, code: e.openingBalanceCode })))
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((aud) => (
                  <div key={aud.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-700">{aud.code}</span>
                        <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {aud.eventType}
                        </span>
                      </div>
                      <div className="text-slate-600">
                        সম্পাদনকারী: <span className="font-medium text-slate-800">{aud.actorName}</span>
                      </div>
                      {aud.notes && <div className="text-[11px] text-slate-500">{aud.notes}</div>}
                    </div>
                    <div className="text-right text-[11px] text-slate-400 font-numeric">
                      {aud.timestamp.replace('T', ' ').substring(0, 19)}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* DETAIL MODAL WITH SENSITIVE INFORMATION MASKING */}
      {isDetailModalOpen && selectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-teal-700 text-sm">{selectedEntry.openingBalanceCode}</span>
                {getStatusBadge(selectedEntry.status)}
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-base">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">হিসাবের নাম</span>
                <span className="font-bold text-slate-900">{getAccountName(selectedEntry.accountId)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">তহবিল</span>
                <span className="font-bold text-teal-900">{getFundName(selectedEntry.fundId)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">পরিমাণ ও কথায়</span>
                <span className="font-bold text-slate-900 font-numeric">৳ {selectedEntry.amount.toLocaleString('en-IN')}</span>
                <span className="block text-[10px] text-slate-500">{selectedEntry.amountInWordsBn}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">প্রারম্ভিক তারিখ</span>
                <span className="font-medium text-slate-800 font-numeric">{selectedEntry.openingDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">কারণ</span>
                <span className="font-medium text-slate-800">
                  {OPENING_BALANCE_REASONS[selectedEntry.reasonCode]?.labelBn || selectedEntry.reasonCode}
                </span>
                {selectedEntry.reasonDetails && (
                  <span className="block text-[10px] text-slate-500">{selectedEntry.reasonDetails}</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">পোস্টিং রেফারেন্স</span>
                <span className="font-mono font-bold text-emerald-800">
                  {selectedEntry.financialTransactionId || 'পোস্টিং সম্পন্ন হয়নি'}
                </span>
              </div>
            </div>

            {/* Sensitive Banking Identifiers Masking */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>সংবেদনশীল ব্যাংকিং তথ্য (Sensitive Financial Identifiers)</span>
                </span>
                {!isSensitiveRevealed && (
                  <button
                    onClick={() => handleRevealSensitive(selectedEntry)}
                    className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded font-semibold text-[11px] flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>সংবেদনশীল তথ্য উন্মোচন করুন</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">ব্যাংক হিসাব নম্বর: </span>
                  <span className="font-mono font-bold text-slate-800">
                    {isSensitiveRevealed ? 'IBBL-0199201948821' : '******4589'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">রাউটিং নম্বর: </span>
                  <span className="font-mono font-bold text-slate-800">
                    {isSensitiveRevealed ? '125260193' : '***123'}
                  </span>
                </div>
              </div>
              {isSensitiveRevealed && (
                <div className="text-[10px] text-amber-800 bg-amber-100 p-1.5 rounded">
                  অডিট সতর্কবার্তা: তথ্য প্রদর্শিত হয়েছে এবং OPENING_BALANCE_SENSITIVE_VIEWED ইভেন্ট লগে রেকর্ড হয়েছে।
                </div>
              )}
            </div>

            {/* Audit History Log */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>অডিট হিস্ট্রি লগ ({selectedEntry.auditHistory.length} টি ইভেন্ট)</span>
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 max-h-40 overflow-y-auto">
                {selectedEntry.auditHistory.map((aud) => (
                  <div key={aud.id} className="p-2 text-[11px] bg-white flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-teal-700 mr-2">{aud.eventType}</span>
                      <span className="text-slate-700">{aud.actorName}</span>
                      {aud.notes && <span className="text-slate-500 block text-[10px]">{aud.notes}</span>}
                    </div>
                    <span className="text-[10px] text-slate-400 font-numeric">{aud.timestamp.replace('T', ' ').substring(0, 19)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold hover:bg-slate-200"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {isRejectModalOpen && entryToReject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-rose-600">
              <XCircle className="w-4 h-4" />
              <span>প্রারম্ভিক স্থিতি প্রত্যাখ্যান (Reject Opening Balance)</span>
            </h3>
            <p className="text-slate-600">
              কোড: <span className="font-mono font-bold">{entryToReject.openingBalanceCode}</span>
            </p>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করুন <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="যেমন: ব্যাংক স্টেটমেন্টের সাথে পরিমাণের অমিল..."
                className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 h-24 focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setEntryToReject(null);
                  setRejectionReasonInput('');
                }}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-600 text-white rounded font-semibold hover:bg-rose-700"
              >
                প্রত্যাখ্যান নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE 5.6.5: A4 OPENING BALANCE VOUCHER PRINT MODAL */}
      {isVoucherModalOpen && selectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto p-8 space-y-6 font-body">
            <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
              <div className="flex justify-center mb-2">
                <TSSLogo variant="full" theme="light" size="md" showBangla={true} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">{currentOrg.name}</h2>
              <p className="text-xs text-slate-600">{currentOrg.address} | ফোন: {currentOrg.phone}</p>
              <div className="inline-block bg-teal-900 text-white px-4 py-1 rounded text-xs font-bold tracking-wider mt-2 uppercase font-mono">
                ৫.৬.৫ অফিসিয়াল প্রারম্ভিক স্থিতি ভাউচার (OPENING BALANCE VOUCHER)
              </div>
            </div>

            <div className="grid grid-cols-2 text-xs border border-slate-200 rounded p-3 gap-2 bg-slate-50 font-numeric">
              <div>
                <span className="text-slate-500">ভাউচার কোড: </span>
                <span className="font-bold text-slate-900 font-mono">{selectedEntry.openingBalanceCode}</span>
              </div>
              <div>
                <span className="text-slate-500">প্রারম্ভিক তারিখ: </span>
                <span className="font-bold text-slate-900">{selectedEntry.openingDate}</span>
              </div>
              <div>
                <span className="text-slate-500">তহবিল (Fund): </span>
                <span className="font-bold text-teal-900">{getFundName(selectedEntry.fundId)}</span>
              </div>
              <div>
                <span className="text-slate-500">পোস্টিং রেফারেন্স: </span>
                <span className="font-mono text-slate-900">{selectedEntry.financialTransactionId || 'পোস্টিং প্রক্রিয়াকরণ সম্পন্ন হয়নি'}</span>
              </div>
            </div>

            <div className="border border-slate-300 rounded overflow-hidden text-xs">
              <table className="w-full">
                <thead className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2.5 text-left">হিসাবের নাম ও বিবরণ</th>
                    <th className="p-2.5 text-left">স্থিতির কারণ ও রেফারেন্স</th>
                    <th className="p-2.5 text-right">প্রারম্ভিক জের (টাকা)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">
                      {getAccountName(selectedEntry.accountId)}
                    </td>
                    <td className="p-2.5">
                      <span className="font-medium text-slate-800">
                        {OPENING_BALANCE_REASONS[selectedEntry.reasonCode]?.labelBn}
                      </span>
                      {selectedEntry.referenceNumber && (
                        <div className="text-[11px] text-slate-500">Ref: {selectedEntry.referenceNumber}</div>
                      )}
                    </td>
                    <td className="p-2.5 text-right font-numeric font-bold text-teal-900 text-sm">
                      ৳ {selectedEntry.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">কথায়: </span>
              <span className="font-bold text-slate-900">{selectedEntry.amountInWordsBn}</span>
            </div>

            {/* Signature Grid */}
            <div className="grid grid-cols-3 gap-4 pt-12 text-center text-xs font-medium text-slate-700 border-t border-slate-200 mt-8">
              <div>
                <div className="border-t border-slate-400 pt-1 font-bold">{selectedEntry.createdByName || 'প্রস্তুতকারী'}</div>
                <span className="text-[10px] text-slate-400">প্রস্তুতকারী (Maker)</span>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-1 font-bold">{selectedEntry.approvedByName || 'যাচাইকারী / ম্যানেজার'}</div>
                <span className="text-[10px] text-slate-400">অনুমোদনকারী (Checker)</span>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-1 font-bold">{selectedEntry.postedByName || 'হিসাবরক্ষক'}</div>
                <span className="text-[10px] text-slate-400">লেজার পোস্টিং অফিসার</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono">
                TSS Controlled Opening Position — Audit Event: OPENING_BALANCE_PRINTED
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold text-xs"
                >
                  বন্ধ করুন
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-teal-600 text-white rounded font-semibold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
