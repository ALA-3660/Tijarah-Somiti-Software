import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
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
  Coins,
  RefreshCw,
  FileText,
  FileCheck
} from 'lucide-react';
import {
  TransferEntry,
  TransferTypeCode,
  TransferMethodType,
  TransferStatus,
  TransferFilterCriteria,
  TransferSummaryMetrics,
  TransferAuditEvent,
  TransferPermissionKey,
  OrganizationContext,
  Account,
  Fund,
  SupportingDocumentMeta
} from '../types';
import { TRANSFER_TYPES_CONFIG } from '../config/transferTypeConfig';
import { TSSLogo, TSSReportHeader, TSSReportFooter, BRAND_CONFIG } from '../branding';
import { numberToBengaliWords } from '../utils/bengaliNumberWords';

interface TransferManagementViewProps {
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

const TRANSFER_ROLE_PERMISSIONS: Record<UserRole, TransferPermissionKey[]> = {
  admin: [
    'finance.transfer.view',
    'finance.transfer.create',
    'finance.transfer.edit',
    'finance.transfer.submit',
    'finance.transfer.approve',
    'finance.transfer.reject',
    'finance.transfer.reopen',
    'finance.transfer.post',
    'finance.transfer.print',
    'finance.transfer.voucher_print',
  ],
  manager: [
    'finance.transfer.view',
    'finance.transfer.create',
    'finance.transfer.edit',
    'finance.transfer.submit',
    'finance.transfer.approve',
    'finance.transfer.reject',
    'finance.transfer.reopen',
    'finance.transfer.post',
    'finance.transfer.print',
    'finance.transfer.voucher_print',
  ],
  accountant: [
    'finance.transfer.view',
    'finance.transfer.create',
    'finance.transfer.edit',
    'finance.transfer.submit',
    'finance.transfer.print',
    'finance.transfer.voucher_print',
  ],
  viewer: [
    'finance.transfer.view',
    'finance.transfer.print',
    'finance.transfer.voucher_print',
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
    associatedFundIds: ['fnd-khu-01'], // Note: Only supports General Fund (fnd-khu-01)
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
    accountName: 'বিকাশ মার্চেন্ট হিসাব (bKash)',
    accountType: 'mobile_financial',
    accountSubtype: 'merchant',
    mobileNumberMasked: '01812****00',
    associatedFundIds: ['fnd-khu-01'], // Note: Only supports General Fund (fnd-khu-01)
    openingBalanceSupported: true,
    isSystemDefined: false,
    status: 'active',
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
    accountName: 'স্থগিত ক্যাশ বাক্স (Inactive Cash)',
    accountType: 'cash',
    associatedFundIds: ['fnd-khu-01'],
    openingBalanceSupported: false,
    isSystemDefined: false,
    status: 'inactive',
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
    description: 'পরীক্ষামূলক স্থগিত ও নিষ্ক্রিয় তহবিল',
    sortOrder: 99,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  }
];

const INITIAL_TRANSFERS: TransferEntry[] = [
  {
    id: 'trf-seed-01',
    organizationId: 'demo-org-khurushkul',
    transferCode: 'TRF-2026-000001',
    version: 1,
    transferType: 'cash_deposit',
    sourceAccountId: 'acc-khu-01',
    destinationAccountId: 'acc-khu-02',
    fundId: 'fnd-khu-01',
    amount: 50000,
    amountInWordsBn: 'পঞ্চাশ হাজার টাকা মাত্র',
    transferDate: '2026-03-01',
    transferMethod: 'cash',
    depositSlipNumber: 'DEP-2026-8812',
    bankTransactionId: 'IBBL-DEP-9901',
    transferPurpose: 'প্রধান ক্যাশের উদ্বৃত্ত অর্থ ইসলামী ব্যাংকে জমা',
    description: 'দৈনন্দিন নগদ জমার উদ্বৃত্ত ব্যাংকে জমা প্রদান',
    notes: 'শাখা কাউন্টারে জমা স্লিপ জমা দেওয়া হয়েছে',
    supportingDocuments: [
      {
        id: 'doc-01',
        name: 'ব্যাংক জমা রশিদ (কাউন্টারফয়েল).pdf',
        type: 'deposit_slip',
        referenceNumber: 'DEP-2026-8812',
        status: 'verified',
        attachedAt: '2026-03-01T10:00:00Z'
      }
    ],
    status: 'POSTED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T11:00:00Z',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-03-01T10:15:00Z',
    approvedBy: 'usr-manager-01',
    approvedByName: 'আব্দুর রহমান (ম্যানেজার)',
    approvedAt: '2026-03-01T10:45:00Z',
    postedBy: 'usr-manager-01',
    postedByName: 'আব্দুর রহমান (ম্যানেজার)',
    postedAt: '2026-03-01T11:00:00Z',
    financialTransactionId: 'TRX-2026-TRF-001',
    isFinancialPosted: true,
    auditHistory: [
      {
        id: 'aud-t-01',
        transferId: 'trf-seed-01',
        eventType: 'TRANSFER_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-03-01T10:00:00Z',
        version: 1
      },
      {
        id: 'aud-t-02',
        transferId: 'trf-seed-01',
        eventType: 'TRANSFER_SUBMITTED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-03-01T10:15:00Z',
        version: 1
      },
      {
        id: 'aud-t-03',
        transferId: 'trf-seed-01',
        eventType: 'TRANSFER_APPROVED',
        actorId: 'usr-manager-01',
        actorName: 'আব্দুর রহমান (ম্যানেজার)',
        timestamp: '2026-03-01T10:45:00Z',
        version: 1
      },
      {
        id: 'aud-t-04',
        transferId: 'trf-seed-01',
        eventType: 'TRANSFER_POSTED',
        actorId: 'usr-manager-01',
        actorName: 'আব্দুর রহমান (ম্যানেজার)',
        timestamp: '2026-03-01T11:00:00Z',
        notes: 'Financial posting reference generated: TRX-2026-TRF-001',
        version: 1
      }
    ]
  },
  {
    id: 'trf-seed-02',
    organizationId: 'demo-org-khurushkul',
    transferCode: 'TRF-2026-000002',
    version: 1,
    transferType: 'cash_withdrawal',
    sourceAccountId: 'acc-khu-02',
    destinationAccountId: 'acc-khu-01',
    fundId: 'fnd-khu-01',
    amount: 30000,
    amountInWordsBn: 'ত্রিশ হাজার টাকা মাত্র',
    transferDate: '2026-03-02',
    transferMethod: 'cheque',
    chequeNumber: 'CHQ-882190',
    transferPurpose: 'অফিস ক্যাশ বাক্স রিফান্ড ও জরুরি পেটি ক্যাশ উত্তোলন',
    description: 'ব্যাংক হিসাব থেকে চেক মারফত নগদ ক্যাশ উত্তোলন',
    supportingDocuments: [],
    status: 'APPROVED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    createdAt: '2026-03-02T09:30:00Z',
    updatedAt: '2026-03-02T10:00:00Z',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-03-02T09:40:00Z',
    approvedBy: 'usr-admin-01',
    approvedByName: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
    approvedAt: '2026-03-02T10:00:00Z',
    auditHistory: [
      {
        id: 'aud-t-05',
        transferId: 'trf-seed-02',
        eventType: 'TRANSFER_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-03-02T09:30:00Z',
        version: 1
      },
      {
        id: 'aud-t-06',
        transferId: 'trf-seed-02',
        eventType: 'TRANSFER_SUBMITTED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-03-02T09:40:00Z',
        version: 1
      },
      {
        id: 'aud-t-07',
        transferId: 'trf-seed-02',
        eventType: 'TRANSFER_APPROVED',
        actorId: 'usr-admin-01',
        actorName: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
        timestamp: '2026-03-02T10:00:00Z',
        version: 1
      }
    ]
  },
  {
    id: 'trf-seed-03',
    organizationId: 'demo-org-khurushkul',
    transferCode: 'TRF-2026-000003',
    version: 1,
    transferType: 'bank_to_bank',
    sourceAccountId: 'acc-khu-02',
    destinationAccountId: 'acc-khu-03',
    fundId: 'fnd-khu-01',
    amount: 100000,
    amountInWordsBn: 'এক লাখ টাকা মাত্র',
    transferDate: '2026-03-05',
    transferMethod: 'bank_transfer',
    bankTransactionId: 'BEFTN-2026-3391',
    transferPurpose: 'আল-আরাফাহ ব্যাংকে প্রকল্প অ্যাকাউন্টের তারল্য স্থানান্তর',
    description: 'ইসলামী ব্যাংক থেকে আল-আরাফাহ ব্যাংকে BEFTN স্থানান্তর',
    supportingDocuments: [],
    status: 'SUBMITTED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    createdAt: '2026-03-05T11:00:00Z',
    updatedAt: '2026-03-05T11:10:00Z',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-03-05T11:10:00Z',
    auditHistory: [
      {
        id: 'aud-t-08',
        transferId: 'trf-seed-03',
        eventType: 'TRANSFER_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-03-05T11:00:00Z',
        version: 1
      },
      {
        id: 'aud-t-09',
        transferId: 'trf-seed-03',
        eventType: 'TRANSFER_SUBMITTED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-03-05T11:10:00Z',
        version: 1
      }
    ]
  },
  {
    id: 'trf-seed-04',
    organizationId: 'demo-org-khurushkul',
    transferCode: 'TRF-2026-000004',
    version: 1,
    transferType: 'account_to_account',
    sourceAccountId: 'acc-khu-01',
    destinationAccountId: 'acc-khu-04',
    fundId: 'fnd-khu-01',
    amount: 15000,
    amountInWordsBn: 'পনেরো হাজার টাকা মাত্র',
    transferDate: '2026-03-06',
    transferMethod: 'mobile_banking',
    transferPurpose: 'বিকাশ মার্চেন্ট ক্যাশ-ইন রিফিল',
    description: 'ক্যাশ বাক্স থেকে বিকাশ অ্যাকাউন্টে ক্যাশ-ইন',
    supportingDocuments: [],
    status: 'DRAFT',
    createdBy: 'usr-admin-01',
    createdByName: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
    createdAt: '2026-03-06T09:00:00Z',
    updatedAt: '2026-03-06T09:00:00Z',
    auditHistory: [
      {
        id: 'aud-t-10',
        transferId: 'trf-seed-04',
        eventType: 'TRANSFER_CREATED',
        actorId: 'usr-admin-01',
        actorName: 'মোঃ আরিফুল ইসলাম (অ্যাডমিন)',
        timestamp: '2026-03-06T09:00:00Z',
        version: 1
      }
    ]
  },
  {
    id: 'trf-seed-05',
    organizationId: 'demo-org-khurushkul',
    transferCode: 'TRF-2026-000005',
    version: 1,
    transferType: 'bank_to_bank',
    sourceAccountId: 'acc-khu-02',
    destinationAccountId: 'acc-khu-03',
    fundId: 'fnd-khu-01',
    amount: 40000,
    amountInWordsBn: 'চল্লিশ হাজার টাকা মাত্র',
    transferDate: '2026-03-04',
    transferMethod: 'bank_transfer',
    transferPurpose: 'প্রকল্প তহবিল স্থানান্তর (ভুল হিসাব নির্বাচন)',
    description: 'ভুল হিসাব নির্বাচনের কারণে প্রত্যাখ্যাত',
    supportingDocuments: [],
    status: 'REJECTED',
    createdBy: 'usr-acc-01',
    createdByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    createdAt: '2026-03-04T10:00:00Z',
    updatedAt: '2026-03-04T11:00:00Z',
    submittedBy: 'usr-acc-01',
    submittedByName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
    submittedAt: '2026-03-04T10:15:00Z',
    rejectedBy: 'usr-manager-01',
    rejectedByName: 'আব্দুর রহমান (ম্যানেজার)',
    rejectedAt: '2026-03-04T11:00:00Z',
    rejectionReason: 'গন্তব্য ব্যাংক হিসাবের অমিল ও অপর্যাপ্ত তথ্য',
    auditHistory: [
      {
        id: 'aud-t-11',
        transferId: 'trf-seed-05',
        eventType: 'TRANSFER_CREATED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-03-04T10:00:00Z',
        version: 1
      },
      {
        id: 'aud-t-12',
        transferId: 'trf-seed-05',
        eventType: 'TRANSFER_SUBMITTED',
        actorId: 'usr-acc-01',
        actorName: 'কামাল উদ্দিন (হিসাবরক্ষক)',
        timestamp: '2026-03-04T10:15:00Z',
        version: 1
      },
      {
        id: 'aud-t-13',
        transferId: 'trf-seed-05',
        eventType: 'TRANSFER_REJECTED',
        actorId: 'usr-manager-01',
        actorName: 'আব্দুর রহমান (ম্যানেজার)',
        timestamp: '2026-03-04T11:00:00Z',
        notes: 'প্রত্যাখ্যানের কারণ: গন্তব্য ব্যাংক হিসাবের অমিল ও অপর্যাপ্ত তথ্য',
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

export const TransferManagementView: React.FC<TransferManagementViewProps> = ({ currentOrg }) => {
  const [transfers, setTransfers] = useState<TransferEntry[]>(INITIAL_TRANSFERS);
  const [currentActor, setCurrentActor] = useState<Actor>(ACTORS[0]);
  const [activeSubTab, setActiveSubTab] = useState<'register' | 'new_transfer' | 'posting_monitor' | 'principles'>('register');

  // Form State
  const [editingTransferId, setEditingTransferId] = useState<string | null>(null);
  const [formTransferType, setFormTransferType] = useState<TransferTypeCode>('cash_deposit');
  const [formSourceAccountId, setFormSourceAccountId] = useState<string>('acc-khu-01');
  const [formDestinationAccountId, setFormDestinationAccountId] = useState<string>('acc-khu-02');
  const [formFundId, setFormFundId] = useState<string>('fnd-khu-01');
  const [formAmount, setFormAmount] = useState<string>('25000');
  const [formDate, setFormDate] = useState<string>(getDhakaTodayDateString());
  const [formMethod, setFormMethod] = useState<TransferMethodType>('cash');
  const [formInternalRef, setFormInternalRef] = useState<string>('');
  const [formExternalRef, setFormExternalRef] = useState<string>('');
  const [formBankTxnId, setFormBankTxnId] = useState<string>('');
  const [formChequeNumber, setFormChequeNumber] = useState<string>('');
  const [formDepositSlipNumber, setFormDepositSlipNumber] = useState<string>('');
  const [formInstrumentRef, setFormInstrumentRef] = useState<string>('');
  const [formPurpose, setFormPurpose] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');

  // Modals & Inspection
  const [selectedTransfer, setSelectedTransfer] = useState<TransferEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [transferToReject, setTransferToReject] = useState<TransferEntry | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [isSensitiveRevealed, setIsSensitiveRevealed] = useState(false);
  const [isDuplicateWarningModalOpen, setIsDuplicateWarningModalOpen] = useState(false);
  const [pendingDuplicateAction, setPendingDuplicateAction] = useState<{ asDraft: boolean; candidateCode: string } | null>(null);

  // Messages & Filters
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; text: string } | null>(null);
  const [filters, setFilters] = useState<TransferFilterCriteria>({
    searchQuery: '',
    transferType: 'all',
    status: 'all',
    sourceAccountId: 'all',
    destinationAccountId: 'all',
    fundId: 'all',
    transferMethod: 'all'
  });

  const hasPermission = (perm: TransferPermissionKey): boolean => {
    const allowed = TRANSFER_ROLE_PERMISSIONS[currentActor.role] || [];
    return allowed.includes(perm);
  };

  const orgAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter(a => a.organizationId === currentOrg.id && a.status === 'active');
  }, [currentOrg.id]);

  const orgFunds = useMemo(() => {
    return MOCK_FUNDS.filter(f => f.organizationId === currentOrg.id && f.status === 'active');
  }, [currentOrg.id]);

  const orgTransfers = useMemo(() => {
    return transfers.filter(t => t.organizationId === currentOrg.id);
  }, [transfers, currentOrg.id]);

  const filteredTransfers = useMemo(() => {
    return orgTransfers.filter(item => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesCode = item.transferCode.toLowerCase().includes(q);
        const matchesPurpose = item.transferPurpose.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesRef = (item.bankTransactionId || '').toLowerCase().includes(q) || (item.chequeNumber || '').toLowerCase().includes(q);
        if (!matchesCode && !matchesPurpose && !matchesDesc && !matchesRef) return false;
      }
      if (filters.transferType && filters.transferType !== 'all' && item.transferType !== filters.transferType) return false;
      if (filters.status && filters.status !== 'all' && item.status !== filters.status) return false;
      if (filters.sourceAccountId && filters.sourceAccountId !== 'all' && item.sourceAccountId !== filters.sourceAccountId) return false;
      if (filters.destinationAccountId && filters.destinationAccountId !== 'all' && item.destinationAccountId !== filters.destinationAccountId) return false;
      if (filters.fundId && filters.fundId !== 'all' && item.fundId !== filters.fundId) return false;
      if (filters.transferMethod && filters.transferMethod !== 'all' && item.transferMethod !== filters.transferMethod) return false;
      return true;
    });
  }, [orgTransfers, filters]);

  const metrics: TransferSummaryMetrics = useMemo(() => {
    let draftCount = 0;
    let submittedCount = 0;
    let approvedCount = 0;
    let postedCount = 0;
    let rejectedCount = 0;
    let totalApprovedAmount = 0;
    let totalPostedAmount = 0;
    let todayTransferredAmount = 0;

    const todayStr = getDhakaTodayDateString();

    orgTransfers.forEach(t => {
      if (t.status === 'DRAFT') draftCount++;
      if (t.status === 'SUBMITTED') submittedCount++;
      if (t.status === 'APPROVED') {
        approvedCount++;
        totalApprovedAmount += t.amount;
      }
      if (t.status === 'POSTED') {
        postedCount++;
        totalPostedAmount += t.amount;
        if (t.transferDate === todayStr) {
          todayTransferredAmount += t.amount;
        }
      }
      if (t.status === 'REJECTED') rejectedCount++;
    });

    return {
      totalCount: orgTransfers.length,
      draftCount,
      submittedCount,
      approvedCount,
      postedCount,
      rejectedCount,
      totalApprovedAmount,
      totalPostedAmount,
      todayTransferredAmount
    };
  }, [orgTransfers]);

  const amountInWords = useMemo(() => {
    const val = parseFloat(formAmount);
    return isNaN(val) || val <= 0 ? 'শূন্য টাকা মাত্র' : numberToBengaliWords(val);
  }, [formAmount]);

  const resetForm = () => {
    setEditingTransferId(null);
    setFormTransferType('cash_deposit');
    setFormSourceAccountId(orgAccounts[0]?.id || 'acc-khu-01');
    setFormDestinationAccountId(orgAccounts[1]?.id || 'acc-khu-02');
    setFormFundId(orgFunds[0]?.id || 'fnd-khu-01');
    setFormAmount('25000');
    setFormDate(getDhakaTodayDateString());
    setFormMethod('cash');
    setFormInternalRef('');
    setFormExternalRef('');
    setFormBankTxnId('');
    setFormChequeNumber('');
    setFormDepositSlipNumber('');
    setFormInstrumentRef('');
    setFormPurpose('');
    setFormDescription('');
    setFormNotes('');
  };

  const handleEditDraft = (transfer: TransferEntry) => {
    if (transfer.status !== 'DRAFT') {
      setFeedbackMessage({ type: 'error', text: 'শুধুমাত্র খসড়া (DRAFT) ট্রান্সফার সম্পাদনা করা সম্ভব।' });
      return;
    }
    if (!hasPermission('finance.transfer.edit')) {
      setFeedbackMessage({ type: 'error', text: 'আপনার ট্রান্সফার সম্পাদনা (finance.transfer.edit) করার অনুমতি নেই।' });
      return;
    }
    setEditingTransferId(transfer.id);
    setFormTransferType(transfer.transferType);
    setFormSourceAccountId(transfer.sourceAccountId);
    setFormDestinationAccountId(transfer.destinationAccountId);
    setFormFundId(transfer.fundId);
    setFormAmount(transfer.amount.toString());
    setFormDate(transfer.transferDate);
    setFormMethod(transfer.transferMethod);
    setFormInternalRef(transfer.internalReference || '');
    setFormExternalRef(transfer.externalReference || '');
    setFormBankTxnId(transfer.bankTransactionId || '');
    setFormChequeNumber(transfer.chequeNumber || '');
    setFormDepositSlipNumber(transfer.depositSlipNumber || '');
    setFormInstrumentRef(transfer.instrumentReference || '');
    setFormPurpose(transfer.transferPurpose);
    setFormDescription(transfer.description);
    setFormNotes(transfer.notes || '');
    setActiveSubTab('new_transfer');
  };

  const handleSaveTransfer = (asDraft: boolean, duplicateConfirmed: boolean = false) => {
    const requiredPermission = editingTransferId
      ? 'finance.transfer.edit'
      : (asDraft ? 'finance.transfer.create' : 'finance.transfer.submit');

    if (!hasPermission(requiredPermission)) {
      setFeedbackMessage({
        type: 'error',
        text: `অনুমতি নেই: ${requiredPermission} পারমিশন আবশ্যক (HTTP 403 Forbidden)`
      });
      return;
    }

    const numAmount = parseFloat(formAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFeedbackMessage({ type: 'error', text: 'অনুগ্রহ করে একটি বৈধ ধনাত্মক টাকার পরিমাণ দিন।' });
      return;
    }

    // Validation 1: Source !== Destination
    if (formSourceAccountId === formDestinationAccountId) {
      setFeedbackMessage({
        type: 'error',
        text: 'উৎস হিসাব ও গন্তব্য হিসাব একই হতে পারবে না (Source Account !== Destination Account)।'
      });
      return;
    }

    // Validation 2: Future Date Block
    const todayStr = getDhakaTodayDateString();
    if (formDate > todayStr) {
      setFeedbackMessage({
        type: 'error',
        text: `ভবিষ্যতের তারিখে ট্রান্সফার রেকর্ড করা যাবে না (Asia/Dhaka আজকের তারিখ: ${todayStr})।`
      });
      return;
    }

    // Validation 3: Fund verification (Must exist, belong to currentOrg, and be active)
    const targetFund = MOCK_FUNDS.find(f => f.id === formFundId && f.organizationId === currentOrg.id);
    if (!targetFund) {
      setFeedbackMessage({
        type: 'error',
        text: 'নির্বাচিত তহবিল বর্তমান অর্গানাইজেশনের বৈধ তহবিল নয়।'
      });
      return;
    }
    if (targetFund.status !== 'active' || targetFund.isActive === false) {
      setFeedbackMessage({
        type: 'error',
        text: 'নির্বাচিত তহবিল নিষ্ক্রিয় (Inactive Fund); নিষ্ক্রিয় তহবিলে ট্রান্সফার সম্পন্ন করা সম্ভব নয়।'
      });
      return;
    }

    // Validation 4: Source Account verification (Must exist, belong to currentOrg, and be active)
    const srcAcc = MOCK_ACCOUNTS.find(a => a.id === formSourceAccountId && a.organizationId === currentOrg.id);
    if (!srcAcc) {
      setFeedbackMessage({
        type: 'error',
        text: 'উৎস হিসাব বর্তমান অর্গানাইজেশনের বৈধ হিসাব নয়।'
      });
      return;
    }
    if (srcAcc.status !== 'active') {
      setFeedbackMessage({
        type: 'error',
        text: 'উৎস হিসাবটি সক্রিয় নয় (Inactive Source Account); নিষ্ক্রিয় হিসাব হতে অর্থ স্থানান্তর নিষিদ্ধ।'
      });
      return;
    }

    // Validation 5: Destination Account verification (Must exist, belong to currentOrg, and be active)
    const destAcc = MOCK_ACCOUNTS.find(a => a.id === formDestinationAccountId && a.organizationId === currentOrg.id);
    if (!destAcc) {
      setFeedbackMessage({
        type: 'error',
        text: 'গন্তব্য হিসাব বর্তমান অর্গানাইজেশনের বৈধ হিসাব নয়।'
      });
      return;
    }
    if (destAcc.status !== 'active') {
      setFeedbackMessage({
        type: 'error',
        text: 'গন্তব্য হিসাবটি সক্রিয় নয় (Inactive Destination Account); নিষ্ক্রিয় হিসাবে অর্থ স্থানান্তর নিষিদ্ধ।'
      });
      return;
    }

    // Validation 6: Fund-Account Association for Source Account
    if (srcAcc.associatedFundIds && srcAcc.associatedFundIds.length > 0) {
      if (!srcAcc.associatedFundIds.includes(formFundId)) {
        setFeedbackMessage({
          type: 'error',
          text: `তহবিল-হিসাব সংগতি লঙ্ঘন: উৎস হিসাব (${srcAcc.accountName}) নির্বাচিত তহবিল (${targetFund.name}) সমর্থন করে না।`
        });
        return;
      }
    }

    // Validation 7: Fund-Account Association for Destination Account
    if (destAcc.associatedFundIds && destAcc.associatedFundIds.length > 0) {
      if (!destAcc.associatedFundIds.includes(formFundId)) {
        setFeedbackMessage({
          type: 'error',
          text: `তহবিল-হিসাব সংগতি লঙ্ঘন: গন্তব্য হিসাব (${destAcc.accountName}) নির্বাচিত তহবিল (${targetFund.name}) সমর্থন করে না।`
        });
        return;
      }
    }

    // Validation 8: Duplicate Candidate Detection (Only on new transfer creation)
    if (!editingTransferId && !duplicateConfirmed) {
      const duplicateCandidate = orgTransfers.find(t =>
        t.sourceAccountId === formSourceAccountId &&
        t.destinationAccountId === formDestinationAccountId &&
        t.fundId === formFundId &&
        t.amount === numAmount &&
        t.transferDate === formDate
      );

      if (duplicateCandidate) {
        setPendingDuplicateAction({
          asDraft,
          candidateCode: duplicateCandidate.transferCode
        });
        setIsDuplicateWarningModalOpen(true);
        return;
      }
    }

    const timestamp = new Date().toISOString();

    if (editingTransferId) {
      // Editing existing draft
      const existing = transfers.find(t => t.id === editingTransferId);
      if (!existing || existing.status !== 'DRAFT') {
        setFeedbackMessage({ type: 'error', text: 'অনুমোদিত বা প্রক্রিয়াকৃত ট্রান্সফার সম্পাদনা করা সম্ভব নয়।' });
        return;
      }

      const updatedAudit: TransferAuditEvent = {
        id: `aud-upd-${Date.now()}`,
        transferId: existing.id,
        eventType: 'TRANSFER_UPDATED',
        actorId: currentActor.id,
        actorName: currentActor.name,
        timestamp,
        version: existing.version + 1,
        notes: asDraft ? 'খসড়া ট্রান্সফার হালনাগাদ করা হয়েছে' : 'খসড়া ট্রান্সফার হালনাগাদ ও অনুমোদনের জন্য দাখিল করা হয়েছে'
      };

      const updatedEntry: TransferEntry = {
        ...existing,
        version: existing.version + 1,
        transferType: formTransferType,
        sourceAccountId: formSourceAccountId,
        destinationAccountId: formDestinationAccountId,
        fundId: formFundId,
        amount: numAmount,
        amountInWordsBn: amountInWords,
        transferDate: formDate,
        transferMethod: formMethod,
        internalReference: formInternalRef,
        externalReference: formExternalRef,
        bankTransactionId: formBankTxnId,
        chequeNumber: formChequeNumber,
        depositSlipNumber: formDepositSlipNumber,
        instrumentReference: formInstrumentRef,
        transferPurpose: formPurpose || `${TRANSFER_TYPES_CONFIG[formTransferType].displayNameBn}`,
        description: formDescription || 'অভ্যন্তরীণ তহবিল ব্যবস্থাপনা',
        notes: formNotes,
        status: asDraft ? 'DRAFT' : 'SUBMITTED',
        updatedAt: timestamp,
        submittedBy: asDraft ? existing.submittedBy : currentActor.id,
        submittedByName: asDraft ? existing.submittedByName : currentActor.name,
        submittedAt: asDraft ? existing.submittedAt : timestamp,
        auditHistory: [...existing.auditHistory, updatedAudit]
      };

      setTransfers(prev => prev.map(t => t.id === existing.id ? updatedEntry : t));
      setFeedbackMessage({
        type: 'success',
        text: asDraft
          ? `ট্রান্সফার ${existing.transferCode} সফলভাবে হালনাগাদ হয়েছে (TRANSFER_UPDATED অডিট সংরক্ষিত)।`
          : `ট্রান্সফার ${existing.transferCode} হালনাগাদ করে অনুমোদনের জন্য জমা দেওয়া হয়েছে।`
      });
      resetForm();
      setActiveSubTab('register');
      return;
    }

    // New Transfer Creation
    const newSeq = (orgTransfers.length + 1).toString().padStart(6, '0');
    const newCode = `TRF-2026-${newSeq}`;
    const newId = `trf-${Date.now()}`;

    const createAudit: TransferAuditEvent = {
      id: `aud-${Date.now()}-1`,
      transferId: newId,
      eventType: 'TRANSFER_CREATED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp,
      version: 1,
      notes: asDraft ? 'নতুন খসড়া ট্রান্সফার প্রস্তুতকৃত' : 'ট্রান্সফার দাখিলের উদ্দেশ্যে প্রস্তুত'
    };

    const newTransfer: TransferEntry = {
      id: newId,
      organizationId: currentOrg.id,
      transferCode: newCode,
      version: 1,
      transferType: formTransferType,
      sourceAccountId: formSourceAccountId,
      destinationAccountId: formDestinationAccountId,
      fundId: formFundId,
      amount: numAmount,
      amountInWordsBn: amountInWords,
      transferDate: formDate,
      transferMethod: formMethod,
      internalReference: formInternalRef,
      externalReference: formExternalRef,
      bankTransactionId: formBankTxnId,
      chequeNumber: formChequeNumber,
      depositSlipNumber: formDepositSlipNumber,
      instrumentReference: formInstrumentRef,
      transferPurpose: formPurpose || `${TRANSFER_TYPES_CONFIG[formTransferType].displayNameBn}`,
      description: formDescription || 'অভ্যন্তরীণ তহবিল ব্যবস্থাপনা',
      notes: formNotes,
      supportingDocuments: [],
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
      newTransfer.auditHistory.push({
        id: `aud-${Date.now()}-2`,
        transferId: newId,
        eventType: 'TRANSFER_SUBMITTED',
        actorId: currentActor.id,
        actorName: currentActor.name,
        timestamp,
        version: 1,
        notes: 'অনুমোদনের জন্য দাখিল করা হয়েছে'
      });
    }

    setTransfers(prev => [newTransfer, ...prev]);
    setFeedbackMessage({
      type: 'success',
      text: asDraft
        ? `খসড়া ট্রান্সফার ${newCode} সফলভাবে তৈরি হয়েছে।`
        : `ট্রান্সফার ${newCode} অনুমোদনের জন্য দাখিল করা হয়েছে (Maker-Checker চেকের অপেক্ষমাণ)।`
    });
    resetForm();
    setActiveSubTab('register');
  };

  const handleSubmitDraft = (transfer: TransferEntry) => {
    if (!hasPermission('finance.transfer.submit')) {
      setFeedbackMessage({ type: 'error', text: 'ট্রান্সফার দাখিল (finance.transfer.submit) করার অনুমতি নেই।' });
      return;
    }
    if (transfer.status !== 'DRAFT') {
      setFeedbackMessage({ type: 'error', text: 'শুধুমাত্র খসড়া ট্রান্সফার দাখিল করা যায়।' });
      return;
    }

    const timestamp = new Date().toISOString();
    const updated: TransferEntry = {
      ...transfer,
      status: 'SUBMITTED',
      submittedBy: currentActor.id,
      submittedByName: currentActor.name,
      submittedAt: timestamp,
      updatedAt: timestamp,
      auditHistory: [
        ...transfer.auditHistory,
        {
          id: `aud-${Date.now()}`,
          transferId: transfer.id,
          eventType: 'TRANSFER_SUBMITTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: transfer.version,
          notes: 'খসড়া থেকে দাখিল সম্পন্ন'
        }
      ]
    };
    setTransfers(prev => prev.map(t => t.id === transfer.id ? updated : t));
    setFeedbackMessage({ type: 'success', text: `ট্রান্সফার ${transfer.transferCode} দাখিল করা হয়েছে।` });
  };

  const handleApproveTransfer = (transfer: TransferEntry) => {
    if (!hasPermission('finance.transfer.approve')) {
      setFeedbackMessage({ type: 'error', text: 'অনুমতি নেই: finance.transfer.approve পারমিশন আবশ্যক (HTTP 403)।' });
      return;
    }

    // Maker-Checker Rule: createdBy !== currentActor.id
    if (transfer.createdBy === currentActor.id) {
      setFeedbackMessage({
        type: 'error',
        text: 'দায়িত্ব পৃথকীকরণ নীতি (Maker-Checker Separation of Duties): ট্রান্সফার প্রস্তুতকারী (Maker) নিজে অনুমোদন করতে পারবেন না।'
      });
      return;
    }

    // State machine check: must be SUBMITTED
    if (transfer.status !== 'SUBMITTED') {
      setFeedbackMessage({
        type: 'error',
        text: `অবৈধ ট্রানজিশন: শুধুমাত্র SUBMITTED ট্রান্সফার অনুমোদন করা যায়। বর্তমান স্ট্যাটাস: ${transfer.status}`
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const updated: TransferEntry = {
      ...transfer,
      status: 'APPROVED',
      approvedBy: currentActor.id,
      approvedByName: currentActor.name,
      approvedAt: timestamp,
      updatedAt: timestamp,
      auditHistory: [
        ...transfer.auditHistory,
        {
          id: `aud-${Date.now()}`,
          transferId: transfer.id,
          eventType: 'TRANSFER_APPROVED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: transfer.version,
          notes: 'যাচাই ও অনুমোদন সম্পন্ন; পোস্টিংয়ের জন্য প্রস্তুত'
        }
      ]
    };

    setTransfers(prev => prev.map(t => t.id === transfer.id ? updated : t));
    setFeedbackMessage({
      type: 'success',
      text: `ট্রান্সফার ${transfer.transferCode} অনুমোদিত হয়েছে (APPROVED)। এখন এটি ফিন্যান্সিয়াল পোস্টিংয়ের জন্য প্রস্তুত।`
    });
  };

  const handlePostTransfer = (transfer: TransferEntry) => {
    if (!hasPermission('finance.transfer.post')) {
      setFeedbackMessage({ type: 'error', text: 'অনুমতি নেই: finance.transfer.post পারমিশন আবশ্যক।' });
      return;
    }

    // State machine check: must be APPROVED
    if (transfer.status !== 'APPROVED') {
      setFeedbackMessage({
        type: 'error',
        text: `অবৈধ ট্রানজিশন: সরাসরি খসড়া বা দাখিলকৃত ট্রান্সফার পোস্ট করা নিষিদ্ধ। শুধুমাত্র APPROVED ট্রান্সফার পোস্টযোগ্য।`
      });
      return;
    }

    // Idempotency check: cannot post twice
    if (transfer.isFinancialPosted || transfer.financialTransactionId) {
      setFeedbackMessage({
        type: 'warning',
        text: `আইডেমপোটেন্সি সতর্কতা: ট্রান্সফার ${transfer.transferCode} ইতোমধ্যে পোস্ট করা হয়েছে (Financial Ref: ${transfer.financialTransactionId})।`
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const financialTxnId = `TRX-2026-TRF-${transfer.transferCode.replace('TRF-2026-', '')}`;

    const updated: TransferEntry = {
      ...transfer,
      status: 'POSTED',
      postedBy: currentActor.id,
      postedByName: currentActor.name,
      postedAt: timestamp,
      financialTransactionId: financialTxnId,
      isFinancialPosted: true,
      updatedAt: timestamp,
      auditHistory: [
        ...transfer.auditHistory,
        {
          id: `aud-${Date.now()}`,
          transferId: transfer.id,
          eventType: 'TRANSFER_POSTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: transfer.version,
          notes: `অফিসিয়াল পোস্টিং আইডি তৈরি: ${financialTxnId} (Idempotent Posting Complete)`
        }
      ]
    };

    setTransfers(prev => prev.map(t => t.id === transfer.id ? updated : t));
    setFeedbackMessage({
      type: 'success',
      text: `ট্রান্সফার ${transfer.transferCode} সফলভাবে পোস্ট করা হয়েছে! পোস্টিং রেফারেন্স: ${financialTxnId}`
    });
  };

  const handleConfirmReject = () => {
    if (!transferToReject) return;
    if (!hasPermission('finance.transfer.reject')) {
      setFeedbackMessage({ type: 'error', text: 'অনুমতি নেই: finance.transfer.reject পারমিশন আবশ্যক।' });
      return;
    }
    if (!rejectionReasonInput.trim()) {
      setFeedbackMessage({ type: 'error', text: 'প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক।' });
      return;
    }

    const timestamp = new Date().toISOString();
    const updated: TransferEntry = {
      ...transferToReject,
      status: 'REJECTED',
      rejectedBy: currentActor.id,
      rejectedByName: currentActor.name,
      rejectedAt: timestamp,
      rejectionReason: rejectionReasonInput.trim(),
      updatedAt: timestamp,
      auditHistory: [
        ...transferToReject.auditHistory,
        {
          id: `aud-${Date.now()}`,
          transferId: transferToReject.id,
          eventType: 'TRANSFER_REJECTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: transferToReject.version,
          notes: `প্রত্যাখ্যানের কারণ: ${rejectionReasonInput.trim()}`
        }
      ]
    };

    setTransfers(prev => prev.map(t => t.id === transferToReject.id ? updated : t));
    setIsRejectModalOpen(false);
    setTransferToReject(null);
    setRejectionReasonInput('');
    setFeedbackMessage({ type: 'warning', text: `ট্রান্সফার ${transferToReject.transferCode} প্রত্যাখ্যাত (REJECTED) হয়েছে।` });
  };

  const handleReopenToDraft = (transfer: TransferEntry) => {
    if (!hasPermission('finance.transfer.reopen')) {
      setFeedbackMessage({
        type: 'error',
        text: 'অনুমতি নেই: finance.transfer.reopen পারমিশন আবশ্যক (HTTP 403 Forbidden)'
      });
      return;
    }
    if (transfer.status !== 'REJECTED') {
      setFeedbackMessage({
        type: 'error',
        text: 'শুধুমাত্র প্রত্যাখ্যাত (REJECTED) ট্রান্সফার পুনরায় খসড়া করা সম্ভব।'
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const reopenAudit: TransferAuditEvent = {
      id: `aud-${Date.now()}`,
      transferId: transfer.id,
      eventType: 'TRANSFER_REOPENED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp,
      version: transfer.version + 1,
      notes: `প্রত্যাখ্যাত ট্রান্সফার (${transfer.transferCode}) পুনরায় সংশোধনের জন্য খসড়ায় (DRAFT) রূপান্তর করা হয়েছে`
    };

    const updated: TransferEntry = {
      ...transfer,
      status: 'DRAFT',
      version: transfer.version + 1,
      rejectionReason: undefined,
      rejectedBy: undefined,
      rejectedByName: undefined,
      rejectedAt: undefined,
      updatedAt: timestamp,
      // Zero financial posting impact
      financialTransactionId: undefined,
      isFinancialPosted: false,
      auditHistory: [...transfer.auditHistory, reopenAudit]
    };
    setTransfers(prev => prev.map(t => t.id === transfer.id ? updated : t));
    setFeedbackMessage({
      type: 'info',
      text: `ট্রান্সফার ${transfer.transferCode} খসড়া (DRAFT) হিসেবে উন্মুক্ত হয়েছে (TRANSFER_REOPENED অডিট সংরক্ষিত)। এখন এটি সংশোধন করা যাবে।`
    });
  };

  const handleOpenVoucherModal = (transfer: TransferEntry) => {
    const timestamp = new Date().toISOString();
    const updated: TransferEntry = {
      ...transfer,
      auditHistory: [
        ...transfer.auditHistory,
        {
          id: `aud-${Date.now()}`,
          transferId: transfer.id,
          eventType: 'TRANSFER_VOUCHER_PRINTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: transfer.version,
          notes: 'A4 অফিসিয়াল ট্রান্সফার ভাউচার প্রদর্শিত/প্রিন্ট রিকোয়েস্ট'
        }
      ]
    };
    setSelectedTransfer(updated);
    setTransfers(prev => prev.map(t => t.id === transfer.id ? updated : t));
    setIsVoucherModalOpen(true);
  };

  const handleOpenPosModal = (transfer: TransferEntry) => {
    const timestamp = new Date().toISOString();
    const updated: TransferEntry = {
      ...transfer,
      auditHistory: [
        ...transfer.auditHistory,
        {
          id: `aud-${Date.now()}`,
          transferId: transfer.id,
          eventType: 'TRANSFER_POS_PRINTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: transfer.version,
          notes: '৮০ মিমি POS থার্মাল ট্রান্সফার রসিদ প্রদর্শিত/প্রিন্ট রিকোয়েস্ট'
        }
      ]
    };
    setSelectedTransfer(updated);
    setTransfers(prev => prev.map(t => t.id === transfer.id ? updated : t));
    setIsPosModalOpen(true);
  };

  const handleRevealSensitive = (transfer: TransferEntry) => {
    const timestamp = new Date().toISOString();
    const updated: TransferEntry = {
      ...transfer,
      auditHistory: [
        ...transfer.auditHistory,
        {
          id: `aud-${Date.now()}`,
          transferId: transfer.id,
          eventType: 'TRANSFER_SENSITIVE_VIEWED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp,
          version: transfer.version,
          notes: 'সংবেদনশীল ব্যাংক ও হিসাব তথ্য প্রদর্শন করা হয়েছে (মাস্কবিহীন ভিউ রেকর্ডকৃত)'
        }
      ]
    };
    setIsSensitiveRevealed(true);
    setSelectedTransfer(updated);
    setTransfers(prev => prev.map(t => t.id === transfer.id ? updated : t));
  };

  const getAccountName = (accId: string) => {
    const acc = MOCK_ACCOUNTS.find(a => a.id === accId);
    return acc ? `${acc.accountName} [${acc.accountCode}]` : accId;
  };

  const getFundName = (fndId: string) => {
    const fnd = MOCK_FUNDS.find(f => f.id === fndId);
    return fnd ? `${fnd.name}` : fndId;
  };

  const getStatusBadge = (status: TransferStatus) => {
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

  return (
    <div className="space-y-6">
      {/* Top Banner & Multi-Tenant Context */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Phase 5.5 — Transfer Management
              </span>
              <span className="text-xs font-mono text-slate-400">TRF-2026-ARCH</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <ArrowLeftRight className="w-6 h-6 text-indigo-600" />
              <span>হিসাব স্থানান্তর ও তারল্য ব্যবস্থাপনা (Transfer Management)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              সংগঠনের এক অ্যাকাউন্ট থেকে অন্য অ্যাকাউন্টে অর্থের অবস্থান পরিবর্তন — এটি কোনো আয়, ব্যয়, লাভ বা লোকসান নয়।
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
              className="text-xs font-semibold bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-indigo-500"
            >
              {ACTORS.map(actor => (
                <option key={actor.id} value={actor.id}>
                  {actor.name} ({actor.role.toUpperCase()})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400">
              ({TRANSFER_ROLE_PERMISSIONS[currentActor.role].length} পারমিশন সক্রিয়)
            </span>
          </div>
        </div>

        {/* Quick Feedback Alert */}
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
            <span className="text-[11px] text-slate-500 font-medium">মোট ট্রান্সফার</span>
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

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <span className="text-[11px] text-indigo-800 font-medium">আজকের ট্রান্সফার</span>
            <div className="text-lg font-bold text-indigo-900">৳ {metrics.todayTransferredAmount.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-indigo-700">Dhaka Timezone</span>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
            <span className="text-[11px] text-rose-800 font-medium">প্রত্যাখ্যাত / খসড়া</span>
            <div className="text-lg font-bold text-rose-900">{metrics.draftCount + metrics.rejectedCount} টি</div>
            <span className="text-[10px] text-rose-700">খসড়া: {metrics.draftCount}, প্রত্যাখ্যাত: {metrics.rejectedCount}</span>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-200 mt-6 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('register')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'register' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>ট্রান্সফার তালিকা ও রেজিস্টার ({filteredTransfers.length})</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setActiveSubTab('new_transfer');
            }}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'new_transfer' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingTransferId ? 'খসড়া ট্রান্সফার সম্পাদনা' : 'নতুন ট্রান্সফার তৈরি'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('posting_monitor')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'posting_monitor' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>পোস্টিং ও আইডেমপোটেন্সি মনিটর</span>
          </button>

          <button
            onClick={() => setActiveSubTab('principles')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'principles' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>ট্রান্সফার গভর্ন্যান্স ও অ্যাকাউন্টিং নীতিমালা</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: REGISTER VIEW */}
      {activeSubTab === 'register' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-1 min-w-[240px] items-center gap-2 border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 text-xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="কোড, উদ্দেশ্য, বিবরণ, ব্যাংক রেফারেন্স দ্বারা অনুসন্ধান..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="bg-transparent flex-1 focus:outline-none text-slate-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={filters.transferType}
                onChange={(e) => setFilters(prev => ({ ...prev, transferType: e.target.value as any }))}
                className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">সব ধরন (All Types)</option>
                {Object.values(TRANSFER_TYPES_CONFIG).map(t => (
                  <option key={t.code} value={t.code}>{t.categoryLabelBn}</option>
                ))}
              </select>

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
                value={filters.sourceAccountId}
                onChange={(e) => setFilters(prev => ({ ...prev, sourceAccountId: e.target.value }))}
                className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">সব উৎস হিসাব</option>
                {orgAccounts.map(a => (
                  <option key={a.id} value={a.id}>{a.accountName}</option>
                ))}
              </select>

              <select
                value={filters.destinationAccountId}
                onChange={(e) => setFilters(prev => ({ ...prev, destinationAccountId: e.target.value }))}
                className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">সব গন্তব্য হিসাব</option>
                {orgAccounts.map(a => (
                  <option key={a.id} value={a.id}>{a.accountName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Transfers Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">ট্রান্সফার কোড / তারিখ</th>
                    <th className="py-3 px-4">ধরন ও উদ্দেশ্য</th>
                    <th className="py-3 px-4">উৎস হিসাব (Out)</th>
                    <th className="py-3 px-4">গন্তব্য হিসাব (In)</th>
                    <th className="py-3 px-4 text-right">পরিমাণ (টাকা)</th>
                    <th className="py-3 px-4">তহবিল (Fund)</th>
                    <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransfers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        কোনো ট্রান্সফার রেকর্ড পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredTransfers.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{item.transferCode}</div>
                          <div className="text-[11px] text-slate-500 font-numeric">{item.transferDate}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-indigo-900 block">
                            {TRANSFER_TYPES_CONFIG[item.transferType]?.categoryLabelBn || item.transferType}
                          </span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{item.transferPurpose}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-rose-700 flex items-center gap-1">
                            <span className="text-[10px] bg-rose-50 border border-rose-200 px-1 rounded">উৎস</span>
                            <span className="truncate max-w-[140px]">{getAccountName(item.sourceAccountId)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-emerald-700 flex items-center gap-1">
                            <span className="text-[10px] bg-emerald-50 border border-emerald-200 px-1 rounded">গন্তব্য</span>
                            <span className="truncate max-w-[140px]">{getAccountName(item.destinationAccountId)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-numeric font-bold text-slate-900">
                          ৳ {item.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {getFundName(item.fundId)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Detail Inspection */}
                            <button
                              onClick={() => {
                                setSelectedTransfer(item);
                                setIsSensitiveRevealed(false);
                                setIsDetailModalOpen(true);
                              }}
                              title="বিস্তারিত বিবরণ"
                              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
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
                                title="দাখিল করুন"
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}

                            {/* Reopen Rejected back to Draft */}
                            {item.status === 'REJECTED' && (
                              <button
                                onClick={() => handleReopenToDraft(item)}
                                title="পুনরায় খসড়া করুন"
                                className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}

                            {/* Approve / Reject (Submitted only) */}
                            {item.status === 'SUBMITTED' && (
                              <>
                                <button
                                  onClick={() => handleApproveTransfer(item)}
                                  title="অনুমোদন করুন (Maker-Checker)"
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded font-semibold"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setTransferToReject(item);
                                    setIsRejectModalOpen(true);
                                  }}
                                  title="প্রত্যাখ্যান করুন"
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded font-semibold"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {/* Post (Approved only) */}
                            {item.status === 'APPROVED' && !item.isFinancialPosted && (
                              <button
                                onClick={() => handlePostTransfer(item)}
                                title="ফিন্যান্সিয়াল পোস্টিং সম্পন্ন করুন"
                                className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700 flex items-center gap-1"
                              >
                                <FileCheck className="w-3.5 h-3.5" />
                                <span>পোস্ট</span>
                              </button>
                            )}

                            {/* Print Voucher */}
                            <button
                              onClick={() => handleOpenVoucherModal(item)}
                              title="A4 ট্রান্সফার ভাউচার প্রিন্ট"
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Print POS */}
                            <button
                              onClick={() => handleOpenPosModal(item)}
                              title="POS স্লিপ প্রিন্ট"
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

      {/* SUB-TAB 2: NEW / EDIT TRANSFER FORM */}
      {activeSubTab === 'new_transfer' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
              <span>{editingTransferId ? 'খসড়া ট্রান্সফার সম্পাদনা (Edit Draft Transfer)' : 'নতুন অ্যাকাউন্ট ট্রান্সফার এন্ট্রি (Unified Account Transfer)'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              উৎস ও গন্তব্য হিসাবের মধ্যে তারল্য সমন্বয় করুন। ট্রান্সফারে ফান্ডের মূল ব্যালেন্স অপরিবর্তিত থাকে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Transfer Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ট্রান্সফারের ধরন (Transfer Type) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formTransferType}
                onChange={(e) => setFormTransferType(e.target.value as TransferTypeCode)}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                {Object.values(TRANSFER_TYPES_CONFIG).map(t => (
                  <option key={t.code} value={t.code}>{t.displayNameBn}</option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {TRANSFER_TYPES_CONFIG[formTransferType]?.description}
              </span>
            </div>

            {/* Source Account */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                উৎস হিসাব (Source Account - টাকা কাটা যাবে) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formSourceAccountId}
                onChange={(e) => setFormSourceAccountId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                {orgAccounts.map(a => (
                  <option key={a.id} value={a.id}>{a.accountName} [{a.accountCode}]</option>
                ))}
              </select>
              <span className="text-[10px] text-indigo-600 block mt-0.5">
                প্রস্তাবিত: {TRANSFER_TYPES_CONFIG[formTransferType]?.sourceAccountTypeHintBn}
              </span>
            </div>

            {/* Destination Account */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                গন্তব্য হিসাব (Destination Account - টাকা জমা হবে) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formDestinationAccountId}
                onChange={(e) => setFormDestinationAccountId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                {orgAccounts.map(a => (
                  <option key={a.id} value={a.id}>{a.accountName} [{a.accountCode}]</option>
                ))}
              </select>
              <span className="text-[10px] text-indigo-600 block mt-0.5">
                প্রস্তাবিত: {TRANSFER_TYPES_CONFIG[formTransferType]?.destinationAccountTypeHintBn}
              </span>
            </div>

            {/* Fund Selection (Preserved) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                তহবিল কাঠামো (Fund - তহবিল সংরক্ষণ নীতি) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formFundId}
                onChange={(e) => setFormFundId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                {orgFunds.map(f => (
                  <option key={f.id} value={f.id}>{f.name} [{f.fundCode}]</option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                ট্রান্সফার ফান্ডের ব্যালেন্স পরিবর্তন করে না; তহবিলের হিসাবসমূহ সংরক্ষিত থাকে।
              </span>
            </div>

            {/* Transfer Amount */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                স্থানান্তরের পরিমাণ (টাকা) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 font-numeric font-bold text-sm focus:ring-1 focus:ring-indigo-500"
                placeholder="যেমন: 50000"
              />
              <span className="text-[11px] text-indigo-700 font-medium block mt-1">
                কথায়: {amountInWords}
              </span>
            </div>

            {/* Transfer Date */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ট্রান্সফারের তারিখ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                max={getDhakaTodayDateString()}
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 font-numeric focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                ভবিষ্যতের তারিখ অনুমোদিত নয় (সর্বোচ্চ আজকের তারিখ)
              </span>
            </div>

            {/* Transfer Method */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">পদ্ধতি (Method)</label>
              <select
                value={formMethod}
                onChange={(e) => setFormMethod(e.target.value as TransferMethodType)}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="cash">নগদ লেনদেন (Cash)</option>
                <option value="bank_transfer">ব্যাংক ট্রান্সফার / EFT / RTGS</option>
                <option value="cheque">চেক মারফত (Cheque)</option>
                <option value="online">অনলাইন ব্যাংকিং / NPSB</option>
                <option value="mobile_banking">মোবাইল ব্যাংকিং (bKash/Nagad)</option>
                <option value="internal_clearing">অভ্যন্তরীণ সমন্বয় (Internal Clearing)</option>
              </select>
            </div>

            {/* Bank Txn ID */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ব্যাংক ট্রানজাকশন / EFT আইডি</label>
              <input
                type="text"
                value={formBankTxnId}
                onChange={(e) => setFormBankTxnId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-indigo-500"
                placeholder="যেমন: BEFTN-2026-9901"
              />
            </div>

            {/* Cheque / Slip No */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">চেক নম্বর / জমা স্লিপ নম্বর</label>
              <input
                type="text"
                value={formChequeNumber || formDepositSlipNumber}
                onChange={(e) => {
                  setFormChequeNumber(e.target.value);
                  setFormDepositSlipNumber(e.target.value);
                }}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-indigo-500"
                placeholder="যেমন: CHQ-882190 অথবা DEP-8812"
              />
            </div>
          </div>

          {/* Description & Purpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ট্রান্সফারের উদ্দেশ্য (Transfer Purpose) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formPurpose}
                onChange={(e) => setFormPurpose(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-indigo-500"
                placeholder="যেমন: প্রধান ক্যাশের উদ্বৃত্ত অর্থ ইসলামী ব্যাংকে জমা করণ"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">অভ্যন্তরীণ নোট বা বিবরণ</label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-1 focus:ring-indigo-500"
                placeholder="শাখা বা ভাউচার অনুমোদন সংশ্লিষ্ট বিবরণ"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
                onClick={() => handleSaveTransfer(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>খসড়া (DRAFT) সংরক্ষণ করুন</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveTransfer(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>অনুমোদনের জন্য দাখিল করুন (Submit)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: POSTING MONITOR */}
      {activeSubTab === 'posting_monitor' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>পোস্টিং প্রস্তুত ও আইডেমপোটেন্সি গার্ড মনিটর (Posting & Idempotency Ready)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              APPROVED ট্রান্সফার ফিন্যান্সিয়াল পোস্টিংয়ের জন্য যোগ্য কিন্তু এখনো ব্যালেন্স পরিবর্তন করেনি। POSTED সম্পন্ন হলে একটি অনন্য লেজার রেফারেন্স তৈরি হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Approved - Ready to Post */}
            <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>অনুমোদিত ও পোস্টিংয়ের অপেক্ষায় ({orgTransfers.filter(t => t.status === 'APPROVED').length})</span>
                </h3>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                  APPROVED ≠ POSTED
                </span>
              </div>
              <p className="text-xs text-blue-700">
                এই ট্রান্সফারগুলো মেকার-চেকার যাচাই পার করেছে। চূড়ান্ত নিষ্পত্তির জন্য পোস্ট বাটনে ক্লিক করুন।
              </p>

              <div className="space-y-2 mt-2">
                {orgTransfers.filter(t => t.status === 'APPROVED').length === 0 ? (
                  <div className="text-xs text-slate-400 py-4 text-center">পোস্টিংয়ের অপেক্ষমাণ কোনো অনুমোদিত ট্রান্সফার নেই।</div>
                ) : (
                  orgTransfers.filter(t => t.status === 'APPROVED').map(t => (
                    <div key={t.id} className="bg-white p-3 rounded-lg border border-blue-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{t.transferCode} — ৳ {t.amount.toLocaleString('en-IN')}</div>
                        <div className="text-[11px] text-slate-500">{t.transferPurpose}</div>
                        <div className="text-[10px] text-blue-600 mt-0.5">অনুমোদনকারী: {t.approvedByName} ({t.approvedAt?.split('T')[0]})</div>
                      </div>
                      <button
                        onClick={() => handlePostTransfer(t)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>পোস্ট করুন</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Posted - Finalized */}
            <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>চূড়ান্ত নিষ্পত্তিকৃত ও পোস্টকৃত ({orgTransfers.filter(t => t.status === 'POSTED').length})</span>
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                  IDEMPOTENT POSTED
                </span>
              </div>
              <p className="text-xs text-emerald-700">
                এই ট্রান্সফারগুলোর বিপরীতে অনন্য আর্থিক রেফারেন্স (Financial Transaction ID) বরাদ্দকৃত। এগুলো সম্পূর্ণ অপরিবর্তনীয়।
              </p>

              <div className="space-y-2 mt-2">
                {orgTransfers.filter(t => t.status === 'POSTED').length === 0 ? (
                  <div className="text-xs text-slate-400 py-4 text-center">কোনো পোস্টকৃত ট্রান্সফার রেকর্ড নেই।</div>
                ) : (
                  orgTransfers.filter(t => t.status === 'POSTED').map(t => (
                    <div key={t.id} className="bg-white p-3 rounded-lg border border-emerald-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{t.transferCode}</span>
                        <span className="font-mono text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                          {t.financialTransactionId}
                        </span>
                      </div>
                      <div className="text-slate-600 mt-1 font-numeric">৳ {t.amount.toLocaleString('en-IN')} — {t.transferPurpose}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex justify-between">
                        <span>পোস্ট করেছেন: {t.postedByName}</span>
                        <span>{t.postedAt?.split('T')[0]}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PRINCIPLES & GOVERNANCE */}
      {activeSubTab === 'principles' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Phase 5.5 — ট্রান্সফার গভর্ন্যান্স ও অ্যাকাউন্টিং নীতিমালা</span>
            </h2>
            <p className="text-slate-500 mt-1">
              ইসলামি সমবায় সমিতি ও তিজারাহ অ্যাকাউন্টিং নীতিমালায় তহবিল স্থানান্তরের অপরিহার্য নিয়মাবলি।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>১. ট্রান্সফার কোনো আয়, ব্যয় বা মুনাফা নয়</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                অর্থের অবস্থান পরিবর্তন (যেমন: ক্যাশ বাক্স থেকে ব্যাংক হিসাবে জমা দেওয়া) কোনো রাজস্ব (Revenue) বা খরচ (Expense) নয়। এটি শুধুমাত্র সমিতির তারল্যের অবস্থান পুনর্বিন্যাস করে।
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>২. তহবিল সংরক্ষণ নীতি (Fund Preservation Rule)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                স্থানান্তর চলাকালীন ফান্ডের কাঠামো অক্ষুণ্ণ থাকে। সাধারণ তহবিলের ক্যাশ ব্যাংক হিসাবে জমা দিলে তা সাধারণ তহবিলের ব্যাংক হিসেবেই জমা হয়। কোনো তহবিল পরিবর্তন বা পুনর্নির্ধারণ Phase 5.5-এ ঘটবে না।
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>৩. মেকার-চেকার পৃথকীকরণ (Maker-Checker Separation of Duties)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                যিনি ট্রান্সফার এন্ট্রি তৈরি (Maker) করবেন, তিনি নিজে তা অনুমোদন (Checker) করতে পারবেন না। ব্যবস্থাপক বা অন্য অনুমোদিত প্রশাসক তা যাচাই ও অনুমোদন করবেন।
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>৪. APPROVED বনাম POSTED পার্থক্য</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                APPROVED মানে মেকার-চেকার যাচাই সফল এবং স্থানান্তরের অনুমতি দেওয়া হয়েছে। POSTED মানে চূড়ান্ত অ্যাকাউন্টিং লেজারে এন্ট্রি বরাদ্দ হয়েছে। ড্রাফট থেকে সরাসরি পোস্ট করা সম্পূর্ণ নিষিদ্ধ।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL WITH SENSITIVE DATA MASKING */}
      {isDetailModalOpen && selectedTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-700 text-sm">{selectedTransfer.transferCode}</span>
                {getStatusBadge(selectedTransfer.status)}
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-base">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">ট্রান্সফারের ধরন</span>
                <span className="font-bold text-slate-900">{TRANSFER_TYPES_CONFIG[selectedTransfer.transferType]?.displayNameBn}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">পরিমাণ ও কথায়</span>
                <span className="font-bold text-slate-900 font-numeric">৳ {selectedTransfer.amount.toLocaleString('en-IN')}</span>
                <span className="block text-[10px] text-slate-500">{selectedTransfer.amountInWordsBn}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">উৎস হিসাব</span>
                <span className="font-medium text-rose-700">{getAccountName(selectedTransfer.sourceAccountId)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">গন্তব্য হিসাব</span>
                <span className="font-medium text-emerald-700">{getAccountName(selectedTransfer.destinationAccountId)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">তহবিল</span>
                <span className="font-medium text-slate-800">{getFundName(selectedTransfer.fundId)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">তারিখ ও পদ্ধতি</span>
                <span className="font-medium text-slate-800 font-numeric">{selectedTransfer.transferDate} ({selectedTransfer.transferMethod})</span>
              </div>
            </div>

            {/* Sensitive Information Masking Section */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>সংবেদনশীল ব্যাংকিং তথ্য (Sensitive Financial Identifiers)</span>
                </span>
                {!isSensitiveRevealed && (
                  <button
                    onClick={() => handleRevealSensitive(selectedTransfer)}
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
                  অডিট সতর্কবার্তা: সংবেদনশীল তথ্য প্রদর্শিত হয়েছে এবং TRANSFER_SENSITIVE_VIEWED ইভেন্ট হিসেবে লগে সংরক্ষিত হয়েছে।
                </div>
              )}
            </div>

            {/* Audit History Log */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>অডিট হিস্ট্রি লগ ({selectedTransfer.auditHistory.length} টি ইভেন্ট)</span>
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {selectedTransfer.auditHistory.map((aud) => (
                  <div key={aud.id} className="p-2 text-[11px] bg-white flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-indigo-600 mr-2">{aud.eventType}</span>
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
      {isRejectModalOpen && transferToReject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-rose-600">
              <XCircle className="w-4 h-4" />
              <span>ট্রান্সফার প্রত্যাখ্যান (Reject Transfer)</span>
            </h3>
            <p className="text-slate-600">
              ট্রান্সফার কোড: <span className="font-mono font-bold">{transferToReject.transferCode}</span>
            </p>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করুন <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="যেমন: ব্যাংক স্লিপে স্বাক্ষরের অমিল বা ভুল হিসাব নির্বাচন..."
                className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 h-24 focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setTransferToReject(null);
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

      {/* A4 VOUCHER PRINT MODAL */}
      {isVoucherModalOpen && selectedTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto p-8 space-y-6 font-body">
            <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
              <div className="flex justify-center mb-2">
                <TSSLogo variant="full" theme="light" size="md" showBangla={true} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">{currentOrg.name}</h2>
              <p className="text-xs text-slate-600">{currentOrg.address} | ফোন: {currentOrg.phone}</p>
              <div className="inline-block bg-slate-900 text-white px-4 py-1 rounded text-xs font-bold tracking-wider mt-2 uppercase font-mono">
                অফিসিয়াল ট্রান্সফার ভাউচার (TRANSFER VOUCHER)
              </div>
            </div>

            <div className="grid grid-cols-2 text-xs border border-slate-200 rounded p-3 gap-2 bg-slate-50 font-numeric">
              <div>
                <span className="text-slate-500">ভাউচার কোড: </span>
                <span className="font-bold text-slate-900 font-mono">{selectedTransfer.transferCode}</span>
              </div>
              <div>
                <span className="text-slate-500">তারিখ: </span>
                <span className="font-bold text-slate-900">{selectedTransfer.transferDate}</span>
              </div>
              <div>
                <span className="text-slate-500">তহবিল: </span>
                <span className="font-bold text-slate-900">{getFundName(selectedTransfer.fundId)}</span>
              </div>
              <div>
                <span className="text-slate-500">পোস্টিং রেফারেন্স: </span>
                <span className="font-mono text-slate-900">{selectedTransfer.financialTransactionId || 'পোস্টিং প্রক্রিয়াকরণ সম্পন্ন হয়নি'}</span>
              </div>
            </div>

            <div className="border border-slate-300 rounded overflow-hidden text-xs">
              <table className="w-full">
                <thead className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2 text-left">বিবরণ / খাত</th>
                    <th className="p-2 text-left">হিসাবের নাম ও বিবরণ</th>
                    <th className="p-2 text-right">টাকার পরিমাণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 font-bold text-rose-700">উৎস হিসাব (Debit/Credit Source)</td>
                    <td className="p-2">{getAccountName(selectedTransfer.sourceAccountId)}</td>
                    <td className="p-2 text-right font-numeric font-bold text-slate-900">৳ {selectedTransfer.amount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-emerald-700">গন্তব্য হিসাব (Destination Account)</td>
                    <td className="p-2">{getAccountName(selectedTransfer.destinationAccountId)}</td>
                    <td className="p-2 text-right font-numeric font-bold text-slate-900">৳ {selectedTransfer.amount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">কথায়: </span>
              <span className="font-bold text-slate-900">{selectedTransfer.amountInWordsBn}</span>
            </div>

            {/* Signature Grid */}
            <div className="grid grid-cols-3 gap-4 pt-12 text-center text-xs font-medium text-slate-700 border-t border-slate-200 mt-8">
              <div>
                <div className="border-t border-slate-400 pt-1 font-bold">{selectedTransfer.createdByName || 'প্রস্তুতকারী'}</div>
                <span className="text-[10px] text-slate-400">প্রস্তুতকারী (Maker)</span>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-1 font-bold">{selectedTransfer.approvedByName || 'যাচাইকারী / ম্যানেজার'}</div>
                <span className="text-[10px] text-slate-400">অনুমোদনকারী (Checker)</span>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-1 font-bold">{selectedTransfer.postedByName || 'হিসাবরক্ষক'}</div>
                <span className="text-[10px] text-slate-400">লেজার পোস্টিং অফিসার</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono">
                TSS Unified Transfer Engine — Audit Event: TRANSFER_VOUCHER_PRINTED
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
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 80mm POS RECEIPT MODAL */}
      {isPosModalOpen && selectedTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 space-y-4 font-mono text-xs">
            <div className="text-center border-b pb-2 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">{currentOrg.name}</h3>
              <p className="text-[10px] text-slate-500">ট্রান্সফার কাউন্টার ক্যাশ মেমো (POS)</p>
              <div className="font-bold text-slate-800 text-[11px]">{selectedTransfer.transferCode}</div>
            </div>

            <div className="space-y-1 text-[11px] border-b pb-2">
              <div className="flex justify-between">
                <span>তারিখ:</span>
                <span>{selectedTransfer.transferDate}</span>
              </div>
              <div className="flex justify-between">
                <span>ধরন:</span>
                <span>{TRANSFER_TYPES_CONFIG[selectedTransfer.transferType]?.categoryLabelBn}</span>
              </div>
              <div className="flex justify-between">
                <span>উৎস:</span>
                <span className="truncate max-w-[150px]">{getAccountName(selectedTransfer.sourceAccountId)}</span>
              </div>
              <div className="flex justify-between">
                <span>গন্তব্য:</span>
                <span className="truncate max-w-[150px]">{getAccountName(selectedTransfer.destinationAccountId)}</span>
              </div>
            </div>

            <div className="text-center py-2 border-b">
              <div className="text-xs text-slate-500">স্থানান্তরের মোট পরিমাণ</div>
              <div className="text-lg font-bold text-slate-900">৳ {selectedTransfer.amount.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-slate-500">{selectedTransfer.amountInWordsBn}</div>
            </div>

            <div className="text-[10px] text-slate-400 text-center space-y-1">
              <p>ক্যাশিয়ার: {selectedTransfer.createdByName}</p>
              <p>প্রিন্ট অডিট: TRANSFER_POS_PRINTED</p>
              <p className="font-sans">টিজারাহ সমিতি সফটওয়্যার (TSS)</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setIsPosModalOpen(false)}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold"
              >
                বন্ধ
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold flex items-center gap-1"
              >
                <Printer className="w-3 h-3" />
                <span>প্রিন্ট</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE CANDIDATE WARNING MODAL */}
      {isDuplicateWarningModalOpen && pendingDuplicateAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-amber-600">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>সম্ভাব্য ডুপ্লিকেট ট্রান্সফার সতর্কতা (Duplicate Transfer Candidate)</span>
            </h3>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 space-y-1">
              <p className="font-medium text-xs leading-relaxed">
                ⚠️ একই তারিখে একই উৎস হিসাব, গন্তব্য হিসাব, তহবিল ও পরিমাণের একটি Transfer ({pendingDuplicateAction.candidateCode}) ইতোমধ্যে পাওয়া গেছে। আপনি কি নতুন Transfer তৈরি করতে চান?
              </p>
              <p className="text-[11px] text-amber-700">
                (নোট: "তবুও তৈরি করুন" নির্বাচন করলে একটি নতুন স্বতন্ত্র ট্রান্সফার তৈরি হবে এবং বিদ্যমান ট্রান্সফার অপরিবর্তিত থাকবে।)
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsDuplicateWarningModalOpen(false);
                  setPendingDuplicateAction(null);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded font-semibold hover:bg-slate-200"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  const draftFlag = pendingDuplicateAction.asDraft;
                  setIsDuplicateWarningModalOpen(false);
                  setPendingDuplicateAction(null);
                  handleSaveTransfer(draftFlag, true);
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700"
              >
                তবুও তৈরি করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
