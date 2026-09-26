import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  PlusCircle, 
  FileText, 
  Clock, 
  AlertOctagon, 
  Printer, 
  History, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Building2, 
  UserCheck, 
  FileSpreadsheet, 
  ArrowRight, 
  X, 
  Receipt, 
  FileCheck2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Landmark,
  Wallet,
  Tag,
  Eye,
  Info
} from 'lucide-react';
import { 
  ExpenseEntry, 
  ExpenseTypeCode, 
  ExpensePartyType, 
  ExpenseFilterCriteria, 
  ExpenseSummaryMetrics, 
  ExpenseAuditEvent,
  ExpensePermissionKey,
  SupportingDocumentMeta,
  OrganizationContext,
  TransactionStatus,
  PaymentMethodType,
  AccountEntity,
  FundEntity,
  HeadEntity,
  MemberType
} from '../types';
import { 
  EXPENSE_TYPES_CONFIG, 
  ALL_EXPENSE_TYPE_CODES, 
  ADMIN_EXPENSE_FUND_ID,
  ADMIN_EXPENSE_FUND_NAME_BN 
} from '../config/expenseTypeConfig';
import { TSSLogo, BRAND_CONFIG } from '../branding';
import { numberToBengaliWords, formatToBengaliCurrency } from '../utils/bengaliNumberWords';

interface ExpenseManagementViewProps {
  currentOrg: OrganizationContext;
  orgsList: OrganizationContext[];
}

// Initial Mock Master Data References
const INITIAL_ACCOUNTS: AccountEntity[] = [
  {
    id: 'acc-khu-01',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-001',
    accountName: 'প্রধান ক্যাশ কাউন্টার (অফিস)',
    accountType: 'cash',
    accountSubtype: 'main_cash',
    description: 'দৈনন্দিন নগদ ব্যয়ের প্রধান ক্যাশ বাক্স',
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
    accountName: 'ইসলামী ব্যাংক বাংলাদেশ লিঃ — চলতি হিসাব',
    accountType: 'bank',
    accountSubtype: 'current',
    bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    branchName: 'কক্সবাজার শাখা',
    accountNumberMasked: '******7890',
    description: 'প্রাতিষ্ঠানিক ব্যয়ের প্রধান ব্যাংক চলতি হিসাব',
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
    accountName: 'বিকাশ মার্চেন্ট অ্যাকাউন্ট',
    accountType: 'mobile_financial',
    accountSubtype: 'merchant',
    mobileNumberMasked: '01812****00',
    description: 'জরুরি ডিজিটাল পেমেন্ট ও ইউটিলিটি বিল পরিশোধ',
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

const INITIAL_FUNDS: FundEntity[] = [
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
    id: 'fnd-demo-admin',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-004',
    name: ADMIN_EXPENSE_FUND_NAME_BN,
    fundType: 'administrative',
    status: 'active',
    isActive: true,
    isSystemDefined: true,
    description: 'সংগঠন পরিচালনার প্রশাসনিক খরচের বাৎসরিক ফি ও ভর্তি ফি জমার তহবিল',
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'fnd-khu-03',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-003',
    name: 'জরুরি আপদকালীন ও রক্ষণাবেক্ষণ তহবিল',
    fundType: 'custom',
    status: 'active',
    isActive: true,
    isSystemDefined: false,
    description: 'চত্বর সংস্কার, হার্ডওয়্যার প্রতিস্থাপন ও জরুরি মেরামত ফান্ড',
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  }
];

const INITIAL_HEADS: HeadEntity[] = [
  {
    id: 'hd-exp-01',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-001',
    name: 'অফিস প্রশাসন ও কমিটি সভা খরচ',
    headType: 'expense',
    parentId: null,
    level: 1,
    isActive: true,
    description: 'কার্যনির্বাহী পরিষদ সভা, অফিস গভর্ন্যান্স ও পরিদর্শন আপ্যায়ন',
    isSystemDefined: true,
    status: 'active',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'hd-exp-02',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-002',
    name: 'অফিস ইউটিলিটি ও বিদ্যুৎ বিল',
    headType: 'expense',
    parentId: null,
    level: 1,
    isActive: true,
    description: 'কার্যালয়ের মাসিক বিদ্যুৎ, ইন্টারনেট ও পানি সংযোগ বিল',
    isSystemDefined: true,
    status: 'active',
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'hd-exp-03',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-003',
    name: 'স্টেশনারি, প্রিন্টিং ও রেজিস্টার ক্রয়',
    headType: 'expense',
    parentId: null,
    level: 1,
    isActive: true,
    description: 'সদস্য ভর্তি ফরম, ভাউচার বুক ও দৈনন্দিন লেখার সামগ্রী',
    isSystemDefined: true,
    status: 'active',
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'hd-exp-04',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-004',
    name: 'আইটি সার্ভিস ও সফটওয়্যার রক্ষণাবেক্ষণ ফি',
    headType: 'expense',
    parentId: null,
    level: 1,
    isActive: true,
    description: 'TSS ক্লাউড সার্ভার, ব্যাকআপ ও টেকনিক্যাল সাপোর্ট সম্মানী',
    isSystemDefined: true,
    status: 'active',
    sortOrder: 4,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'hd-exp-05',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-005',
    name: 'অফিস আসবাব ও বৈদ্যুতিক সরঞ্জাম মেরামত',
    headType: 'expense',
    parentId: null,
    level: 1,
    isActive: true,
    description: 'কার্যালয়ের ফ্যান, কম্পিউটার, ফটোকপিয়ার মেরামত ও সার্ভিসিং',
    isSystemDefined: true,
    status: 'active',
    sortOrder: 5,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'hd-exp-06',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-006',
    name: 'বার্ষিক অডিট ও লিগ্যাল কনসালটেন্সি ফি',
    headType: 'expense',
    parentId: null,
    level: 1,
    isActive: true,
    description: 'বহিঃনিরীক্ষক অডিট ফার্মের পেশাগত ফি ও ট্রেড লাইসেন্স নবায়ন',
    isSystemDefined: false,
    status: 'active',
    sortOrder: 6,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: 'hd-exp-07',
    organizationId: 'demo-org-khurushkul',
    headCode: 'EXP-007',
    name: 'অন্যান্য আনুষঙ্গিক সাধারণ পরিচালন ব্যয়',
    headType: 'expense',
    parentId: null,
    level: 1,
    isActive: true,
    description: 'সাধারণ প্রাতিষ্ঠানিক বিবিধ অফিস খরচ ও ডাক মাশুল',
    isSystemDefined: false,
    status: 'active',
    sortOrder: 7,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system'
  }
];

const INITIAL_MEMBERS: MemberType[] = [
  {
    id: 'mem-khu-01',
    organizationId: 'demo-org-khurushkul',
    memberCode: 'MEM-2026-001',
    fullName: 'মাওলানা মাহমুদ হাসান',
    mobile: '01812-345678',
    status: 'active',
    address: 'খুরুশকুল বাজার, কক্সবাজার সদর',
    joinedAt: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'mem-khu-02',
    organizationId: 'demo-org-khurushkul',
    memberCode: 'MEM-2026-002',
    fullName: 'মুহাম্মদ মুবিনুল হক',
    mobile: '01711-223344',
    status: 'active',
    address: 'দক্ষিণ খুরুশকুল, কক্সবাজার',
    joinedAt: '2026-01-15',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z'
  }
];

const INITIAL_EXPENSES: ExpenseEntry[] = [
  {
    id: 'exp-seed-01',
    organizationId: 'demo-org-khurushkul',
    expenseCode: 'EXP-2026-000101',
    voucherNumber: 'PV-2026-000101',
    transactionCode: 'TRX-2026-000301',
    sourceDomain: 'GENERAL_FINANCE',
    sourceType: 'general_operational',
    expenseTypeCode: 'administrative_expense',
    expenseHeadId: 'hd-exp-01',
    fundId: 'fnd-demo-admin',
    accountId: 'acc-khu-01',
    amount: 3500.00,
    amountInWordsBn: 'তিন হাজার পাঁচশত টাকা মাত্র',
    expenseDate: '2026-03-01',
    paymentMethod: 'cash',
    partyType: 'external_party',
    payeeName: 'বিসমিল্লাহ সুইটস অ্যান্ড ক্যাটারিং',
    billNumber: 'BILL-CAT-458',
    referenceNumber: 'REF-MTG-03',
    description: 'মাসিক নির্বাহী পরিষদ সভা ও বার্ষিক কর্মপরিকল্পনা পর্যালোচনায় আপ্যায়ন বিল',
    supportingDocuments: [
      {
        id: 'doc-01',
        name: 'ক্যাটারিং ক্যাশ মেমো.pdf',
        type: 'receipt',
        referenceNumber: 'BILL-CAT-458',
        status: 'verified',
        attachedAt: '2026-03-01T10:30:00Z'
      }
    ],
    status: 'APPROVED',
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (Accountant)',
    createdAt: '2026-03-01T10:00:00Z',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (Accountant)',
    submittedAt: '2026-03-01T10:15:00Z',
    approvedBy: 'usr-manager-01',
    approvedByName: 'ম্যানেজার (Manager)',
    approvedAt: '2026-03-01T11:00:00Z',
    version: 2,
    updatedAt: '2026-03-01T11:00:00Z',
    auditHistory: [
      {
        id: 'aud-01',
        expenseId: 'exp-seed-01',
        eventType: 'EXPENSE_CREATED',
        actorId: 'usr-accountant-01',
        actorName: 'হিসাবরক্ষক',
        timestamp: '2026-03-01T10:00:00Z',
        notes: 'খসড়া তৈরি সম্পন্ন'
      },
      {
        id: 'aud-02',
        expenseId: 'exp-seed-01',
        eventType: 'EXPENSE_SUBMITTED',
        actorId: 'usr-accountant-01',
        actorName: 'হিসাবরক্ষক',
        timestamp: '2026-03-01T10:15:00Z',
        notes: 'অনুমোদনের জন্য জমা দেওয়া হয়েছে'
      },
      {
        id: 'aud-03',
        expenseId: 'exp-seed-01',
        eventType: 'EXPENSE_APPROVED',
        actorId: 'usr-manager-01',
        actorName: 'ম্যানেজার',
        timestamp: '2026-03-01T11:00:00Z',
        notes: 'পেমেন্ট ভাউচার (PV-2026-000101) তৈরি ও অনুমোদিত'
      }
    ]
  },
  {
    id: 'exp-seed-02',
    organizationId: 'demo-org-khurushkul',
    expenseCode: 'EXP-2026-000102',
    voucherNumber: 'PV-2026-000102',
    transactionCode: 'TRX-2026-000302',
    sourceDomain: 'GENERAL_FINANCE',
    sourceType: 'general_operational',
    expenseTypeCode: 'general_operational_expense',
    expenseHeadId: 'hd-exp-02',
    fundId: 'fnd-khu-01',
    accountId: 'acc-khu-03',
    amount: 2450.00,
    amountInWordsBn: 'দুই হাজার চারশত পঞ্চাশ টাকা মাত্র',
    expenseDate: '2026-03-03',
    paymentMethod: 'other',
    partyType: 'organization',
    payeeName: 'পল্লী বিদ্যুৎ সমিতি, কক্সবাজার',
    billNumber: 'PBS-FEB-98210',
    description: 'কার্যালয়ের ফেব্রুয়ারি ২০২৬ মাসের বিদ্যুৎ বিল পরিশোধ',
    supportingDocuments: [
      {
        id: 'doc-02',
        name: 'বিদ্যুৎ বিল কপি.pdf',
        type: 'bill',
        referenceNumber: 'PBS-FEB-98210',
        status: 'verified',
        attachedAt: '2026-03-03T14:00:00Z'
      }
    ],
    status: 'APPROVED',
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (Accountant)',
    createdAt: '2026-03-03T12:00:00Z',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (Accountant)',
    submittedAt: '2026-03-03T13:00:00Z',
    approvedBy: 'usr-admin-01',
    approvedByName: 'অ্যাডমিনিস্ট্রেটর (Admin)',
    approvedAt: '2026-03-03T14:30:00Z',
    version: 2,
    updatedAt: '2026-03-03T14:30:00Z',
    auditHistory: [
      {
        id: 'aud-04',
        expenseId: 'exp-seed-02',
        eventType: 'EXPENSE_APPROVED',
        actorId: 'usr-admin-01',
        actorName: 'অ্যাডমিনিস্ট্রেটর',
        timestamp: '2026-03-03T14:30:00Z',
        notes: 'অনুমোদিত'
      }
    ]
  },
  {
    id: 'exp-seed-03',
    organizationId: 'demo-org-khurushkul',
    expenseCode: 'EXP-2026-000103',
    voucherNumber: 'PV-PENDING-03',
    transactionCode: 'TRX-PENDING-03',
    sourceDomain: 'GENERAL_FINANCE',
    sourceType: 'general_operational',
    expenseTypeCode: 'publicity_publication_communication_expense',
    expenseHeadId: 'hd-exp-03',
    fundId: 'fnd-khu-01',
    accountId: 'acc-khu-01',
    amount: 6500.00,
    amountInWordsBn: 'ছয় হাজার পাঁচশত টাকা মাত্র',
    expenseDate: '2026-03-05',
    paymentMethod: 'cash',
    partyType: 'external_party',
    payeeName: 'আল-আমিন অফসেট প্রেস',
    billNumber: 'PRESS-INV-891',
    referenceNumber: 'SANCTION-PB-26',
    description: 'নতুন ২০০ কপি সদস্য পাশ বই ও ৫০০ কপি ভর্তি ফরম মুদ্রণ বিল',
    supportingDocuments: [
      {
        id: 'doc-03',
        name: 'প্রেস ক্যাশ মেমো.pdf',
        type: 'receipt',
        referenceNumber: 'PRESS-INV-891',
        status: 'attached',
        attachedAt: '2026-03-05T09:30:00Z'
      }
    ],
    status: 'SUBMITTED',
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (Accountant)',
    createdAt: '2026-03-05T09:00:00Z',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (Accountant)',
    submittedAt: '2026-03-05T09:30:00Z',
    version: 1,
    updatedAt: '2026-03-05T09:30:00Z',
    auditHistory: [
      {
        id: 'aud-05',
        expenseId: 'exp-seed-03',
        eventType: 'EXPENSE_SUBMITTED',
        actorId: 'usr-accountant-01',
        actorName: 'হিসাবরক্ষক',
        timestamp: '2026-03-05T09:30:00Z',
        notes: 'অনুমোদন অপেক্ষায়'
      }
    ]
  },
  {
    id: 'exp-seed-04',
    organizationId: 'demo-org-khurushkul',
    expenseCode: 'EXP-2026-000104',
    voucherNumber: 'PV-REJECTED-04',
    transactionCode: 'TRX-REJECTED-04',
    sourceDomain: 'GENERAL_FINANCE',
    sourceType: 'general_operational',
    expenseTypeCode: 'maintenance_repair_expense',
    expenseHeadId: 'hd-exp-05',
    fundId: 'fnd-khu-03',
    accountId: 'acc-khu-01',
    amount: 4200.00,
    amountInWordsBn: 'চার হাজার দুইশত টাকা মাত্র',
    expenseDate: '2026-03-06',
    paymentMethod: 'cash',
    partyType: 'external_party',
    payeeName: 'কক্সবাজার হার্ডওয়্যার সলিউশন',
    billNumber: 'HW-REC-110',
    description: 'অফিস ইনভার্টার ব্যাটারির এসিড ও সিলিং ফ্যান মেরামত',
    supportingDocuments: [],
    status: 'REJECTED',
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (Accountant)',
    createdAt: '2026-03-06T11:00:00Z',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (Accountant)',
    submittedAt: '2026-03-06T11:30:00Z',
    rejectedBy: 'usr-manager-01',
    rejectedByName: 'ম্যানেজার (Manager)',
    rejectedAt: '2026-03-06T12:00:00Z',
    rejectionReason: 'ক্যাশ মেমোর সাথে টেকনিশিয়ানের জব কার্ড ও পুরাতন মালামাল জমার স্লিপ সংযুক্ত নেই। মেমো সংশোধন করে পুনঃজমা দিন।',
    version: 2,
    updatedAt: '2026-03-06T12:00:00Z',
    auditHistory: [
      {
        id: 'aud-06',
        expenseId: 'exp-seed-04',
        eventType: 'EXPENSE_REJECTED',
        actorId: 'usr-manager-01',
        actorName: 'ম্যানেজার',
        timestamp: '2026-03-06T12:00:00Z',
        notes: 'যথাযথ ভাউচার বিল না থাকায় প্রত্যাখ্যাত'
      }
    ]
  },
  {
    id: 'exp-seed-05',
    organizationId: 'demo-org-khurushkul',
    expenseCode: 'EXP-2026-000105',
    voucherNumber: 'PV-DRAFT-0105',
    transactionCode: 'TRX-DRAFT-0105',
    sourceDomain: 'GENERAL_FINANCE',
    sourceType: 'general_operational',
    expenseTypeCode: 'general_operational_expense',
    expenseHeadId: 'hd-exp-02',
    fundId: 'fnd-khu-01',
    accountId: 'acc-khu-01',
    amount: 1200.00,
    amountInWordsBn: 'এক হাজার দুইশত টাকা মাত্র',
    expenseDate: '2026-03-08',
    paymentMethod: 'cash',
    partyType: 'external_party',
    payeeName: 'রহমান স্টেশনারি মার্ট',
    billNumber: 'STA-8812',
    description: 'অফিস নোটবুক, কলম ও ফাইল খসড়া ক্রয়',
    supportingDocuments: [],
    status: 'DRAFT',
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (Accountant)',
    createdAt: '2026-03-08T10:00:00Z',
    version: 1,
    updatedAt: '2026-03-08T10:00:00Z',
    auditHistory: [
      {
        id: 'aud-07',
        expenseId: 'exp-seed-05',
        eventType: 'EXPENSE_CREATED',
        actorId: 'usr-accountant-01',
        actorName: 'হিসাবরক্ষক',
        timestamp: '2026-03-08T10:00:00Z',
        notes: 'খসড়া প্রস্তুত সম্পন্ন'
      }
    ]
  }
];

// RBAC Permission Mapping for Expense Management (Phase 2 & Phase 5.4 Unified)
const EXPENSE_ROLE_PERMISSIONS: Record<'admin' | 'manager' | 'accountant' | 'viewer', ExpensePermissionKey[]> = {
  admin: [
    'finance.expense.view',
    'finance.expense.create',
    'finance.expense.edit',
    'finance.expense.submit',
    'finance.expense.approve',
    'finance.expense.reject',
    'finance.expense.reopen',
    'finance.expense.print',
    'finance.expense.voucher_print'
  ],
  manager: [
    'finance.expense.view',
    'finance.expense.create',
    'finance.expense.edit',
    'finance.expense.submit',
    'finance.expense.approve',
    'finance.expense.reject',
    'finance.expense.reopen',
    'finance.expense.print',
    'finance.expense.voucher_print'
  ],
  accountant: [
    'finance.expense.view',
    'finance.expense.create',
    'finance.expense.edit',
    'finance.expense.submit',
    'finance.expense.reopen',
    'finance.expense.print',
    'finance.expense.voucher_print'
  ],
  viewer: [
    'finance.expense.view',
    'finance.expense.print'
  ]
};

// Asia/Dhaka Today Date Helper (Centralized Timezone Policy)
const getDhakaTodayDateString = (): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
};

export const ExpenseManagementView: React.FC<ExpenseManagementViewProps> = ({
  currentOrg
}) => {
  // Navigation State
  const [subTab, setSubTab] = useState<
    'new_expense' | 'expense_register' | 'payment_voucher' | 'expense_heads' | 'pending_approval' | 'rejected_expenses' | 'audit_history'
  >('expense_register');

  // Role Simulation for Maker-Checker
  const [currentUserRole, setCurrentUserRole] = useState<'accountant' | 'manager' | 'admin' | 'viewer'>('accountant');

  // Master Data State
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(INITIAL_EXPENSES);
  const [accounts] = useState<AccountEntity[]>(INITIAL_ACCOUNTS);
  const [funds] = useState<FundEntity[]>(INITIAL_FUNDS);
  const [heads] = useState<HeadEntity[]>(INITIAL_HEADS);
  const [members] = useState<MemberType[]>(INITIAL_MEMBERS);

  // Filters State
  const [filters, setFilters] = useState<ExpenseFilterCriteria>({
    searchQuery: '',
    expenseTypeCode: 'all',
    status: 'all',
    accountId: 'all',
    fundId: 'all',
    expenseHeadId: 'all',
    partyType: 'all',
    paymentMethod: 'all'
  });

  // Modal Dialog States
  const [selectedExpense, setSelectedExpense] = useState<ExpenseEntry | null>(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isPOSModalOpen, setIsPOSModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [possibleDuplicateWarning, setPossibleDuplicateWarning] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Expense Form State
  const [formExpenseType, setFormExpenseType] = useState<ExpenseTypeCode>('general_operational_expense');
  const [formExpenseDate, setFormExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [formHeadId, setFormHeadId] = useState(INITIAL_HEADS[1]?.id || '');
  const [formFundId, setFormFundId] = useState(INITIAL_FUNDS[0]?.id || '');
  const [formAccountId, setFormAccountId] = useState(INITIAL_ACCOUNTS[0]?.id || '');
  const [formAmount, setFormAmount] = useState<number>(1500);
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethodType>('cash');
  const [formPartyType, setFormPartyType] = useState<ExpensePartyType>('external_party');
  const [formPayeeName, setFormPayeeName] = useState('');
  const [formSelectedMemberId, setFormSelectedMemberId] = useState(INITIAL_MEMBERS[0]?.id || '');
  const [formBillNumber, setFormBillNumber] = useState('');
  const [formReferenceNumber, setFormReferenceNumber] = useState('');
  const [formExternalReference, setFormExternalReference] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDocName, setFormDocName] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [isSensitiveRevealed, setIsSensitiveRevealed] = useState(false);

  // Permission Check Helper (Phase 2 & Phase 5.4 RBAC Unified)
  const hasPermission = (permission: ExpensePermissionKey): boolean => {
    return EXPENSE_ROLE_PERMISSIONS[currentUserRole]?.includes(permission) ?? false;
  };

  // Resolved Actor Context
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

  // Lookup Maps
  const accountMap = useMemo(() => new Map(accounts.map(a => [a.id, a])), [accounts]);
  const fundMap = useMemo(() => new Map(funds.map(f => [f.id, f])), [funds]);
  const headMap = useMemo(() => new Map(heads.map(h => [h.id, h])), [heads]);
  const memberMap = useMemo(() => new Map(members.map(m => [m.id, m])), [members]);

  // Current Expense Type Config
  const currentTypeConfig = useMemo(() => {
    return EXPENSE_TYPES_CONFIG[formExpenseType] || EXPENSE_TYPES_CONFIG.general_operational_expense;
  }, [formExpenseType]);

  // Sync Fixed Fund Rule
  const handleExpenseTypeChange = (typeCode: ExpenseTypeCode) => {
    setFormExpenseType(typeCode);
    const config = EXPENSE_TYPES_CONFIG[typeCode];
    if (config.isFundFixed && config.fixedFundId) {
      setFormFundId(config.fixedFundId);
    }
    // Set default head if matching exists
    const matchingHead = heads.find(h => h.headCode === config.defaultHeadCode);
    if (matchingHead) {
      setFormHeadId(matchingHead.id);
    }
  };

  // Live Bengali Amount in Words
  const amountInWords = useMemo(() => {
    return numberToBengaliWords(Number(formAmount) || 0);
  }, [formAmount]);

  // Scoped Organization Expenses
  const orgExpenses = useMemo(() => {
    return expenses.filter(e => e.organizationId === currentOrg.id);
  }, [expenses, currentOrg.id]);

  // Summary Metrics
  const metrics: ExpenseSummaryMetrics = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const approved = orgExpenses.filter(e => e.status === 'APPROVED');
    const adminExpenses = approved.filter(e => e.expenseTypeCode === 'administrative_expense');
    const operationalExpenses = approved.filter(e => e.expenseTypeCode !== 'administrative_expense');

    return {
      totalCount: orgExpenses.length,
      draftCount: orgExpenses.filter(e => e.status === 'DRAFT').length,
      submittedCount: orgExpenses.filter(e => e.status === 'SUBMITTED').length,
      approvedCount: approved.length,
      rejectedCount: orgExpenses.filter(e => e.status === 'REJECTED').length,
      totalApprovedAmount: approved.reduce((sum, e) => sum + e.amount, 0),
      todayApprovedAmount: approved.filter(e => e.expenseDate === todayStr).reduce((sum, e) => sum + e.amount, 0),
      administrativeExpenseAmount: adminExpenses.reduce((sum, e) => sum + e.amount, 0),
      operationalExpenseAmount: operationalExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
  }, [orgExpenses]);

  // Filtered List
  const filteredExpenses = useMemo(() => {
    return orgExpenses.filter(e => {
      // Sub-tab view restrictions
      if (subTab === 'pending_approval' && e.status !== 'SUBMITTED') return false;
      if (subTab === 'rejected_expenses' && e.status !== 'REJECTED') return false;

      // Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const codeMatch = e.expenseCode.toLowerCase().includes(q);
        const voucherMatch = e.voucherNumber.toLowerCase().includes(q);
        const payeeMatch = e.payeeName.toLowerCase().includes(q);
        const descMatch = e.description.toLowerCase().includes(q);
        const billMatch = e.billNumber ? e.billNumber.toLowerCase().includes(q) : false;
        if (!codeMatch && !voucherMatch && !payeeMatch && !descMatch && !billMatch) return false;
      }

      // Dropdown Filters
      if (filters.expenseTypeCode !== 'all' && e.expenseTypeCode !== filters.expenseTypeCode) return false;
      if (filters.status !== 'all' && e.status !== filters.status) return false;
      if (filters.accountId !== 'all' && e.accountId !== filters.accountId) return false;
      if (filters.fundId !== 'all' && e.fundId !== filters.fundId) return false;
      if (filters.expenseHeadId !== 'all' && e.expenseHeadId !== filters.expenseHeadId) return false;
      if (filters.paymentMethod !== 'all' && e.paymentMethod !== filters.paymentMethod) return false;
      if (filters.partyType !== 'all' && e.partyType !== filters.partyType) return false;

      return true;
    });
  }, [orgExpenses, subTab, filters]);

  // Check Duplicate Logic
  const checkDuplicate = (
    payee: string,
    bill: string,
    amount: number,
    date: string,
    headId: string
  ): { isExact: boolean; isPossible: boolean; message?: string } => {
    const cleanPayee = payee.trim().toLowerCase();
    const cleanBill = bill.trim().toLowerCase();

    // 1. Exact Duplicate Condition: Same Org + Same Payee + Same Bill No + Same Amount
    if (cleanBill) {
      const exactMatch = orgExpenses.find(
        e => e.status !== 'REJECTED' &&
             e.payeeName.trim().toLowerCase() === cleanPayee &&
             e.billNumber && e.billNumber.trim().toLowerCase() === cleanBill &&
             Math.abs(e.amount - amount) < 0.01
      );
      if (exactMatch) {
        return {
          isExact: true,
          isPossible: false,
          message: `এক্সেক্ট ডুপ্লিকেট শনাক্ত! একই প্রাপক (${payee}), একই বিল/মেমো নং (${bill}) এবং একই পরিমাণ (৳${amount}) নিয়ে ইতোমধ্যেই এন্ট্রি বিদ্যমান [${exactMatch.expenseCode}]।`
        };
      }
    }

    // 2. Possible Duplicate Warning: Same Org + Same Payee + Same Date + Same Amount + Same Head
    const possibleMatch = orgExpenses.find(
      e => e.status !== 'REJECTED' &&
           e.payeeName.trim().toLowerCase() === cleanPayee &&
           e.expenseDate === date &&
           e.expenseHeadId === headId &&
           Math.abs(e.amount - amount) < 0.01
    );
    if (possibleMatch) {
      return {
        isExact: false,
        isPossible: true,
        message: `সম্ভাব্য ডুপ্লিকেট সতর্কতা: একই দিনে (${date}), একই প্রাপক (${payee}) এবং একই ব্যয়ের খাতে (৳${amount}) সমপরিমাণ ব্যয়ের এন্ট্রি পাওয়া গেছে [${possibleMatch.expenseCode}]। অনুগ্রহ করে নিশ্চিত হয়ে সংরক্ষণ করুন।`
      };
    }

    return { isExact: false, isPossible: false };
  };

  // Edit Draft Expense Handler (finance.expense.edit)
  const handleEditDraft = (entry: ExpenseEntry) => {
    if (entry.status !== 'DRAFT') {
      setErrorMessage('অনুমোদিত বা প্রক্রিয়াধীন ব্যয় সরাসরি সম্পাদন করা সম্পূর্ণ নিষিদ্ধ। শুধুমাত্র DRAFT ব্যয় সম্পাদনযোগ্য।');
      return;
    }
    if (!hasPermission('finance.expense.edit')) {
      setErrorMessage('ব্যয় সম্পাদন বা হালনাগাদের অনুমতি নেই (finance.expense.edit required - HTTP 403 Forbidden)।');
      return;
    }
    setEditingExpenseId(entry.id);
    setFormExpenseType(entry.expenseTypeCode);
    setFormExpenseDate(entry.expenseDate);
    setFormHeadId(entry.expenseHeadId);
    setFormFundId(entry.fundId);
    setFormAccountId(entry.accountId);
    setFormAmount(entry.amount);
    setFormPaymentMethod(entry.paymentMethod);
    setFormPartyType(entry.partyType);
    setFormPayeeName(entry.payeeName);
    if (entry.partyType === 'member' && entry.partyId) {
      setFormSelectedMemberId(entry.partyId);
    }
    setFormBillNumber(entry.billNumber || '');
    setFormReferenceNumber(entry.referenceNumber || '');
    setFormExternalReference(entry.externalReference || '');
    setFormDescription(entry.description);
    setFormDocName(entry.supportingDocuments[0]?.name || '');
    setFormNotes(entry.notes || '');
    setSubTab('new_expense');
  };

  // Submit / Update Expense Handler
  const handleSaveExpense = (targetStatus: 'DRAFT' | 'SUBMITTED') => {
    setErrorMessage(null);
    setPossibleDuplicateWarning(null);

    // Permission Enforcement
    if (editingExpenseId) {
      if (!hasPermission('finance.expense.edit')) {
        setErrorMessage('ব্যয় সম্পাদন বা হালনাগাদের অনুমতি নেই (finance.expense.edit required - HTTP 403 Forbidden)।');
        return;
      }
    } else {
      if (!hasPermission('finance.expense.create')) {
        setErrorMessage('নতুন ব্যয় এন্ট্রি তৈরির অনুমতি নেই (finance.expense.create required - HTTP 403 Forbidden)।');
        return;
      }
    }
    if (targetStatus === 'SUBMITTED' && !hasPermission('finance.expense.submit')) {
      setErrorMessage('ব্যয় জমা দেওয়ার অনুমতি নেই (finance.expense.submit required - HTTP 403 Forbidden)।');
      return;
    }

    // Validation 1: Amount must be positive decimal
    const numAmount = Number(formAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('ব্যয়ের পরিমাণ অবশ্যই ০ এর চেয়ে বেশি একটি বৈধ সংখ্যা হতে হবে।');
      return;
    }

    // Validation 2: Future Date Policy (Asia/Dhaka enforcement)
    const todayDhaka = getDhakaTodayDateString();
    if (formExpenseDate > todayDhaka) {
      setErrorMessage('ব্যয়ের তারিখ ভবিষ্যতের তারিখ হতে পারবে না।');
      return;
    }

    // Validation 3: Payee Name
    const resolvedPayee = formPartyType === 'member'
      ? (memberMap.get(formSelectedMemberId)?.fullName || 'সদস্য')
      : formPayeeName.trim();

    if (!resolvedPayee) {
      setErrorMessage('প্রাপক/গ্রহীতার নাম (Payee Name) প্রদান করা বাধ্যতামূলক।');
      return;
    }

    // Validation 4: Head Validation (Must be active and start with EXP-*)
    const selHead = headMap.get(formHeadId);
    if (!selHead || selHead.status !== 'active') {
      setErrorMessage('নির্বাচিত ব্যয়ের খাতটি সক্রিয় নয় বা পাওয়া যায়নি।');
      return;
    }
    if (selHead.headType !== 'expense' || !selHead.headCode.startsWith('EXP-')) {
      setErrorMessage('আয় খাত (Income Head) দিয়ে ব্যয় তৈরি করা নিষিদ্ধ। শুধুমাত্র EXP-* ব্যয় খাত নির্বাচন করুন।');
      return;
    }

    // Validation 5: Fund Validation & Fixed Fund Rule
    const selFund = fundMap.get(formFundId);
    if (!selFund || selFund.status !== 'active') {
      setErrorMessage('নির্বাচিত তহবিলটি নিষ্ক্রিয় বা পাওয়া যায়নি।');
      return;
    }
    if (currentTypeConfig.isFundFixed && currentTypeConfig.fixedFundId) {
      if (formFundId !== currentTypeConfig.fixedFundId) {
        setErrorMessage(`এই ব্যয়ের তহবিল অবশ্যই '${currentTypeConfig.fixedFundNameBn}' হতে হবে।`);
        return;
      }
    }

    // Validation 6: Account Validation (Active, Same Org)
    const selAccount = accountMap.get(formAccountId);
    if (!selAccount || selAccount.status !== 'active' || selAccount.organizationId !== currentOrg.id) {
      setErrorMessage('নির্বাচিত পেমেন্ট অ্যাকাউন্টটি সক্রিয় নয় বা অন্য অর্গানাইজেশনের (Cross-Tenant Blocked)।');
      return;
    }

    // Validation 7: Duplicate Protection (bypass check if editing same item)
    if (!editingExpenseId) {
      const dupCheck = checkDuplicate(resolvedPayee, formBillNumber, numAmount, formExpenseDate, formHeadId);
      if (dupCheck.isExact) {
        setErrorMessage(dupCheck.message || 'ডুপ্লিকেট এন্ট্রি শনাক্ত হওয়ায় সংরক্ষণ বাতিল করা হলো।');
        return;
      }
      if (dupCheck.isPossible && !possibleDuplicateWarning) {
        setPossibleDuplicateWarning(dupCheck.message || 'সম্ভাব্য ডুপ্লিকেট সতর্কতা।');
        return; // Stop once to show warning; clicking again will bypass
      }
    }

    // Validation 8: Supporting Document Threshold Policy
    if (numAmount >= currentTypeConfig.requiresSupportingDocumentAbove && !formBillNumber.trim() && !formDocName.trim()) {
      setErrorMessage(`নীতিমালা অনুযায়ী ৳${currentTypeConfig.requiresSupportingDocumentAbove.toLocaleString('en-IN')}-এর অধিক ব্যয়ের জন্য বিল/ভাউচার নম্বর অথবা সহায়ক মেমো উল্লেখ করা বাধ্যতামূলক।`);
      return;
    }

    const nowIso = new Date().toISOString();

    const newDocs: SupportingDocumentMeta[] = formDocName.trim() ? [
      {
        id: `doc-${Date.now()}`,
        name: formDocName.trim(),
        type: 'receipt',
        referenceNumber: formBillNumber.trim() || undefined,
        status: 'attached',
        attachedAt: nowIso
      }
    ] : [];

    // Case A: Editing an existing DRAFT expense
    if (editingExpenseId) {
      const existing = expenses.find(e => e.id === editingExpenseId);
      if (!existing) {
        setErrorMessage('সম্পাদনযোগ্য খসড়া ব্যয় পাওয়া যায়নি।');
        return;
      }
      if (existing.status !== 'DRAFT') {
        setErrorMessage('অনুমোদিত বা প্রক্রিয়াধীন ব্যয় সরাসরি সম্পাদন করা সম্পূর্ণ নিষিদ্ধ। শুধুমাত্র DRAFT ব্যয় সম্পাদনযোগ্য।');
        return;
      }

      const changedFields: string[] = [];
      if (existing.amount !== numAmount) changedFields.push(`পরিমাণ: ৳${numAmount}`);
      if (existing.payeeName !== resolvedPayee) changedFields.push(`প্রাপক: ${resolvedPayee}`);
      if (existing.expenseDate !== formExpenseDate) changedFields.push(`তারিখ: ${formExpenseDate}`);
      if (existing.expenseHeadId !== formHeadId) changedFields.push('ব্যয় খাত');
      if (existing.fundId !== formFundId) changedFields.push('তহবিল');
      if (existing.accountId !== formAccountId) changedFields.push('হিসাব');

      const updateAudit: ExpenseAuditEvent = {
        id: `aud-${Date.now()}`,
        expenseId: existing.id,
        eventType: 'EXPENSE_UPDATED',
        actorId: currentActor.id,
        actorName: currentActor.name,
        timestamp: nowIso,
        notes: `খসড়া ব্যয় হালনাগাদ করা হয়েছে (${changedFields.join(', ') || 'বিবরণ ও প্রমাণক'}) [সংস্করণ: ${existing.version + 1}]`
      };

      const updatedAudits = [...existing.auditHistory, updateAudit];
      if (targetStatus === 'SUBMITTED') {
        updatedAudits.push({
          id: `aud-${Date.now() + 1}`,
          expenseId: existing.id,
          eventType: 'EXPENSE_SUBMITTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp: nowIso,
          notes: 'হালনাগাদ শেষে অনুমোদনের জন্য জমা দেওয়া হয়েছে'
        });
      }

      const updatedVoucher = targetStatus === 'SUBMITTED' ? `PV-2026-${existing.expenseCode.slice(9)}` : existing.voucherNumber;

      const updatedEntry: ExpenseEntry = {
        ...existing,
        voucherNumber: updatedVoucher,
        expenseTypeCode: formExpenseType,
        expenseHeadId: formHeadId,
        fundId: formFundId,
        accountId: formAccountId,
        amount: numAmount,
        amountInWordsBn: amountInWords,
        expenseDate: formExpenseDate,
        paymentMethod: formPaymentMethod,
        partyType: formPartyType,
        partyId: formPartyType === 'member' ? formSelectedMemberId : undefined,
        payeeName: resolvedPayee,
        billNumber: formBillNumber.trim() || undefined,
        referenceNumber: formReferenceNumber.trim() || undefined,
        externalReference: formExternalReference.trim() || undefined,
        description: formDescription.trim() || `${currentTypeConfig.displayNameBn} বাবদ ব্যয় পরিশোধ`,
        supportingDocuments: newDocs.length > 0 ? newDocs : existing.supportingDocuments,
        notes: formNotes.trim() || undefined,
        status: targetStatus,
        submittedBy: targetStatus === 'SUBMITTED' ? currentActor.id : existing.submittedBy,
        submittedByName: targetStatus === 'SUBMITTED' ? currentActor.name : existing.submittedByName,
        submittedAt: targetStatus === 'SUBMITTED' ? nowIso : existing.submittedAt,
        version: existing.version + 1,
        updatedAt: nowIso,
        auditHistory: updatedAudits
      };

      setExpenses(prev => prev.map(e => e.id === editingExpenseId ? updatedEntry : e));
      setEditingExpenseId(null);
      setSuccessMessage(`ব্যয় এন্ট্রি [${updatedEntry.expenseCode}] সফলভাবে হালনাগাদ করা হয়েছে।`);
      setSubTab('expense_register');

      // Reset Form
      setFormAmount(1500);
      setFormPayeeName('');
      setFormBillNumber('');
      setFormReferenceNumber('');
      setFormDescription('');
      setFormDocName('');
      return;
    }

    // Case B: Creating New Expense
    const nextSeq = orgExpenses.length + 101;
    const newExpenseCode = `EXP-2026-${String(nextSeq).padStart(6, '0')}`;
    const newVoucherNo = targetStatus === 'SUBMITTED' ? `PV-2026-${String(nextSeq).padStart(6, '0')}` : `PV-DRAFT-${String(nextSeq).padStart(4, '0')}`;
    const newTrxCode = `TRX-2026-${String(nextSeq + 200).padStart(6, '0')}`;

    const newAudit: ExpenseAuditEvent = {
      id: `aud-${Date.now()}`,
      expenseId: `exp-${Date.now()}`,
      eventType: targetStatus === 'SUBMITTED' ? 'EXPENSE_SUBMITTED' : 'EXPENSE_CREATED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp: nowIso,
      notes: targetStatus === 'SUBMITTED' ? 'অনুমোদনের জন্য জমা দেওয়া হয়েছে' : 'খসড়া সংরক্ষণ সম্পন্ন'
    };

    const newEntry: ExpenseEntry = {
      id: `exp-${Date.now()}`,
      organizationId: currentOrg.id,
      expenseCode: newExpenseCode,
      voucherNumber: newVoucherNo,
      transactionCode: newTrxCode,
      sourceDomain: 'GENERAL_FINANCE',
      sourceType: 'general_operational',
      expenseTypeCode: formExpenseType,
      expenseHeadId: formHeadId,
      fundId: formFundId,
      accountId: formAccountId,
      amount: numAmount,
      amountInWordsBn: amountInWords,
      expenseDate: formExpenseDate,
      paymentMethod: formPaymentMethod,
      partyType: formPartyType,
      partyId: formPartyType === 'member' ? formSelectedMemberId : undefined,
      payeeName: resolvedPayee,
      billNumber: formBillNumber.trim() || undefined,
      referenceNumber: formReferenceNumber.trim() || undefined,
      externalReference: formExternalReference.trim() || undefined,
      description: formDescription.trim() || `${currentTypeConfig.displayNameBn} বাবদ ব্যয় পরিশোধ`,
      supportingDocuments: newDocs,
      notes: formNotes.trim() || undefined,
      status: targetStatus,
      createdBy: currentActor.id,
      createdByName: currentActor.name,
      createdAt: nowIso,
      submittedBy: targetStatus === 'SUBMITTED' ? currentActor.id : undefined,
      submittedByName: targetStatus === 'SUBMITTED' ? currentActor.name : undefined,
      submittedAt: targetStatus === 'SUBMITTED' ? nowIso : undefined,
      version: 1,
      updatedAt: nowIso,
      auditHistory: [newAudit]
    };

    setExpenses(prev => [newEntry, ...prev]);
    setSuccessMessage(`ব্যয় এন্ট্রি [${newEntry.expenseCode}] সফলভাবে ${targetStatus === 'SUBMITTED' ? 'জমা দেওয়া' : 'খসড়া সংরক্ষণ'} হয়েছে।`);
    setSubTab('expense_register');

    // Reset Form
    setFormAmount(1500);
    setFormPayeeName('');
    setFormBillNumber('');
    setFormReferenceNumber('');
    setFormDescription('');
    setFormDocName('');
  };

  // Workflow: Submit from DRAFT
  const handleSubmitFromDraft = (entry: ExpenseEntry) => {
    if (entry.status !== 'DRAFT') return;
    if (!hasPermission('finance.expense.submit')) {
      setErrorMessage('ব্যয় জমা দেওয়ার অনুমতি নেই (finance.expense.submit required - HTTP 403 Forbidden)।');
      return;
    }

    const nowIso = new Date().toISOString();
    const nextVoucher = `PV-2026-${entry.expenseCode.slice(9)}`;
    const updatedEntry: ExpenseEntry = {
      ...entry,
      voucherNumber: nextVoucher,
      status: 'SUBMITTED',
      submittedBy: currentActor.id,
      submittedByName: currentActor.name,
      submittedAt: nowIso,
      version: entry.version + 1,
      updatedAt: nowIso,
      auditHistory: [
        ...entry.auditHistory,
        {
          id: `aud-${Date.now()}`,
          expenseId: entry.id,
          eventType: 'EXPENSE_SUBMITTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp: nowIso,
          notes: 'খসড়া হতে অনুমোদনের জন্য জমা দেওয়া হয়েছে'
        }
      ]
    };
    setExpenses(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
    setSuccessMessage(`ব্যয় এন্ট্রি [${entry.expenseCode}] অনুমোদনের জন্য জমা দেওয়া হয়েছে।`);
  };

  // Workflow: Approve (Maker-Checker & Idempotency Enforced)
  const handleApproveExpense = (entry: ExpenseEntry) => {
    // 1. Permission Check
    if (!hasPermission('finance.expense.approve')) {
      setErrorMessage('অনুমোদনের অনুমতি সংরক্ষিত (finance.expense.approve required - HTTP 403 Forbidden)।');
      return;
    }

    // 2. Maker-Checker Separation of Duties: Creator cannot approve own expense
    if (entry.createdBy === currentActor.id) {
      setErrorMessage('দায়িত্ব পৃথকীকরণ নীতি (Separation of Duties): প্রস্তুতকারী নিজে নিজের ব্যয় অনুমোদন করতে পারবেন না (HTTP 403 Forbidden)।');
      return;
    }

    // 3. Idempotency Guard 1: Status must strictly be SUBMITTED
    if (entry.status !== 'SUBMITTED') {
      if (entry.status === 'APPROVED') {
        setErrorMessage(`এই ব্যয়টি ইতোমধ্যে অনুমোদিত [${entry.voucherNumber}] এবং এর লেনদেন কোড [${entry.transactionCode}] অপরিবর্তনীয় (Idempotent Approval - Duplicate Blocked)।`);
      } else {
        setErrorMessage('শুধুমাত্র জমাকৃত (SUBMITTED) ব্যয় অনুমোদন করা সম্ভব।');
      }
      return;
    }

    // 4. Idempotency Guard 2: If financial transaction already linked or posted
    if (entry.financialTransactionId || entry.isFinancialPosted) {
      setErrorMessage(`আর্থিক ট্রানজাকশন পোস্টিং ইতোমধ্যেই বিদ্যমান [${entry.financialTransactionId || entry.transactionCode}]। ডুপ্লিকেট আর্থিক পোস্টিং সম্পূর্ণ অবরুদ্ধ।`);
      return;
    }

    const nowIso = new Date().toISOString();
    const finalVoucherNo = entry.voucherNumber.startsWith('PV-2026-') ? entry.voucherNumber : `PV-2026-${entry.expenseCode.slice(9)}`;
    const finalTrxId = `FIN-TRX-${entry.transactionCode}`;

    const updatedEntry: ExpenseEntry = {
      ...entry,
      voucherNumber: finalVoucherNo,
      financialTransactionId: finalTrxId,
      isFinancialPosted: true,
      status: 'APPROVED',
      approvedBy: currentActor.id,
      approvedByName: currentActor.name,
      approvedAt: nowIso,
      version: entry.version + 1,
      updatedAt: nowIso,
      auditHistory: [
        ...entry.auditHistory,
        {
          id: `aud-${Date.now()}`,
          expenseId: entry.id,
          eventType: 'EXPENSE_APPROVED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp: nowIso,
          notes: `পেমেন্ট ভাউচার (${finalVoucherNo}) ও আর্থিক ট্রানজাকশন (${entry.transactionCode}) অনুমোদিত এবং লেজার পোস্টিং উপযোগী হিসেবে সংরক্ষিত`
        }
      ]
    };

    setExpenses(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
    setSuccessMessage(`পেমেন্ট ভাউচার [${finalVoucherNo}] সফলভাবে অনুমোদিত হয়েছে। লেনদেন কোড: [${entry.transactionCode}]।`);
  };

  // Workflow: Reject Expense
  const handleConfirmReject = () => {
    if (!selectedExpense) return;
    if (!hasPermission('finance.expense.reject')) {
      setErrorMessage('ব্যয় প্রত্যাখ্যান করার অনুমতি সংরক্ষিত (finance.expense.reject required - HTTP 403 Forbidden)।');
      return;
    }
    if (!rejectionReasonInput.trim()) {
      setErrorMessage('প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক।');
      return;
    }

    const nowIso = new Date().toISOString();
    const updatedEntry: ExpenseEntry = {
      ...selectedExpense,
      status: 'REJECTED',
      rejectedBy: currentActor.id,
      rejectedByName: currentActor.name,
      rejectedAt: nowIso,
      rejectionReason: rejectionReasonInput.trim(),
      version: selectedExpense.version + 1,
      updatedAt: nowIso,
      auditHistory: [
        ...selectedExpense.auditHistory,
        {
          id: `aud-${Date.now()}`,
          expenseId: selectedExpense.id,
          eventType: 'EXPENSE_REJECTED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp: nowIso,
          notes: `প্রত্যাখ্যাত: ${rejectionReasonInput.trim()}`
        }
      ]
    };

    setExpenses(prev => prev.map(e => e.id === selectedExpense.id ? updatedEntry : e));
    setIsRejectModalOpen(false);
    setSelectedExpense(null);
    setRejectionReasonInput('');
    setSuccessMessage(`ব্যয় এন্ট্রি [${selectedExpense.expenseCode}] প্রত্যাখ্যাত হয়েছে।`);
  };

  // Workflow: Reopen Rejected to DRAFT
  const handleReopenToDraft = (entry: ExpenseEntry) => {
    if (entry.status !== 'REJECTED') return;
    if (!hasPermission('finance.expense.reopen')) {
      setErrorMessage('ব্যয় পুনঃউন্মুক্ত করার অনুমতি সংরক্ষিত (finance.expense.reopen required)।');
      return;
    }

    const nowIso = new Date().toISOString();
    const updatedEntry: ExpenseEntry = {
      ...entry,
      status: 'DRAFT',
      rejectionReason: undefined,
      version: entry.version + 1,
      updatedAt: nowIso,
      auditHistory: [
        ...entry.auditHistory,
        {
          id: `aud-${Date.now()}`,
          expenseId: entry.id,
          eventType: 'EXPENSE_REOPENED',
          actorId: currentActor.id,
          actorName: currentActor.name,
          timestamp: nowIso,
          notes: 'সংশোধনের জন্য ড্রাফট স্ট্যাটাসে পুনরুন্মুক্ত করা হয়েছে'
        }
      ]
    };
    setExpenses(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
    setSuccessMessage(`ব্যয় এন্ট্রি [${entry.expenseCode}] সংশোধনের জন্য ড্রাফটে ফিরিয়ে নেওয়া হয়েছে।`);
  };

  // Print Handlers (Idempotency Guaranteed - No Financial Transaction Mutation)
  const handleOpenVoucherModal = (entry: ExpenseEntry) => {
    if (!hasPermission('finance.expense.voucher_print')) {
      setErrorMessage('ভাউচার প্রিন্ট করার অনুমতি সংরক্ষিত (finance.expense.voucher_print required)।');
      return;
    }
    const nowIso = new Date().toISOString();
    const printAudit: ExpenseAuditEvent = {
      id: `aud-${Date.now()}`,
      expenseId: entry.id,
      eventType: 'EXPENSE_VOUCHER_PRINTED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp: nowIso,
      notes: 'অফিসিয়াল A4 পেমেন্ট ভাউচার প্রিন্ট ভিউ খোলা হয়েছে'
    };
    const updated = {
      ...entry,
      auditHistory: [...entry.auditHistory, printAudit]
    };
    setSelectedExpense(updated);
    setExpenses(prev => prev.map(e => e.id === entry.id ? updated : e));
    setIsVoucherModalOpen(true);
  };

  const handleOpenPOSModal = (entry: ExpenseEntry) => {
    if (!hasPermission('finance.expense.print')) {
      setErrorMessage('পিওএস প্রিন্ট করার অনুমতি সংরক্ষিত (finance.expense.print required)।');
      return;
    }
    const nowIso = new Date().toISOString();
    const posAudit: ExpenseAuditEvent = {
      id: `aud-${Date.now()}`,
      expenseId: entry.id,
      eventType: 'EXPENSE_POS_PRINTED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp: nowIso,
      notes: 'থার্মাল পিওএস রসিদ প্রিন্ট ভিউ খোলা হয়েছে'
    };
    const updated = {
      ...entry,
      auditHistory: [...entry.auditHistory, posAudit]
    };
    setSelectedExpense(updated);
    setExpenses(prev => prev.map(e => e.id === entry.id ? updated : e));
    setIsPOSModalOpen(true);
  };

  // Reveal Sensitive Details Handler (EXPENSE_SENSITIVE_VIEWED)
  const handleRevealSensitive = () => {
    if (!selectedExpense) return;
    setIsSensitiveRevealed(true);
    const nowIso = new Date().toISOString();
    const sensitiveAudit: ExpenseAuditEvent = {
      id: `aud-${Date.now()}`,
      expenseId: selectedExpense.id,
      eventType: 'EXPENSE_SENSITIVE_VIEWED',
      actorId: currentActor.id,
      actorName: currentActor.name,
      timestamp: nowIso,
      notes: 'সংবেদনশীল পেমেন্ট অ্যাকাউন্ট ও শনাক্তকারী তথ্য উন্মোচন করা হয়েছে (Protected Info Accessed)'
    };
    const updated = {
      ...selectedExpense,
      auditHistory: [...selectedExpense.auditHistory, sensitiveAudit]
    };
    setSelectedExpense(updated);
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  return (
    <div className="space-y-6 font-body text-slate-800">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 font-numeric">
              Phase 5.4 — Expense Management
            </span>
            <span className="text-xs text-slate-500 font-mono">
              7 Locked Types • Payment Vouchers • Maker-Checker
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-700" />
            <span>ব্যয় ও পেমেন্ট ভাউচার ব্যবস্থাপনা</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            সংগঠনের দৈনন্দিন সাধারণ ব্যয়, ভাউচার প্রস্তুতকরণ, দ্বৈত অনুমোদন ও শরিয়াহ তহবিলভিত্তিক পরিশোধ ব্যবস্থাপনা।
          </p>
        </div>

        {/* Role Simulator Pill */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs font-numeric">
          <span className="text-[11px] font-semibold text-slate-600">বর্তমান ভূমিকা:</span>
          {(['accountant', 'manager', 'admin'] as const).map(role => (
            <button
              key={role}
              onClick={() => setCurrentUserRole(role)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                currentUserRole === role
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              {role === 'accountant' ? 'হিসাবরক্ষক (Maker)' : role === 'manager' ? 'ম্যানেজার (Checker)' : 'এডমিন'}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700 font-bold ml-2">✕</button>
        </div>
      )}

      {possibleDuplicateWarning && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{possibleDuplicateWarning} (আবার ক্লিক করলে নিশ্চিত করা হবে)</span>
          </div>
          <button onClick={() => setPossibleDuplicateWarning(null)} className="text-amber-600 hover:text-amber-800 font-bold ml-2">✕</button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">মোট ব্যয় এন্ট্রি</span>
          <div className="text-lg font-bold text-slate-900 font-numeric mt-1">{metrics.totalCount} টি</div>
          <div className="text-[10px] text-slate-400 mt-0.5">সব স্ট্যাটাস মিলিয়ে</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> অনুমোদন অপেক্ষমান
          </span>
          <div className="text-lg font-bold text-amber-800 font-numeric mt-1">{metrics.submittedCount} টি</div>
          <div className="text-[10px] text-amber-600 mt-0.5">চেকার যাচাইাধীন</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> অনুমোদিত ভাউচার
          </span>
          <div className="text-lg font-bold text-emerald-900 font-numeric mt-1">{metrics.approvedCount} টি</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">পোস্টিংযোগ্য কার্যকর</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">অনুমোদিত মোট পরিশোধ</span>
          <div className="text-lg font-bold text-slate-900 font-numeric mt-1">
            ৳ {metrics.totalApprovedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-numeric">আজকে: ৳ {metrics.todayApprovedAmount.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-indigo-700 font-medium">প্রশাসনিক খরচের তহবিল ব্যয়</span>
          <div className="text-lg font-bold text-indigo-900 font-numeric mt-1">
            ৳ {metrics.administrativeExpenseAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-indigo-600 mt-0.5">অফিস প্রশাসন ও গভর্ন্যান্স</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> প্রত্যাখ্যাত ব্যয়
          </span>
          <div className="text-lg font-bold text-rose-800 font-numeric mt-1">{metrics.rejectedCount} টি</div>
          <div className="text-[10px] text-rose-500 mt-0.5">সংশোধনযোগ্য খসড়া</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-semibold font-numeric bg-white rounded-t-xl px-2">
        <button
          onClick={() => setSubTab('expense_register')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            subTab === 'expense_register'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-700" />
          <span>ব্যয় রেজিস্টার ({orgExpenses.length})</span>
        </button>

        <button
          onClick={() => setSubTab('new_expense')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            subTab === 'new_expense'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-amber-700" />
          <span>নতুন ব্যয় ও পরিশোধ</span>
        </button>

        <button
          onClick={() => setSubTab('pending_approval')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            subTab === 'pending_approval'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-700" />
          <span>অনুমোদন অপেক্ষমান ({metrics.submittedCount})</span>
        </button>

        <button
          onClick={() => setSubTab('rejected_expenses')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            subTab === 'rejected_expenses'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          <span>প্রত্যাখ্যাত ব্যয় ({metrics.rejectedCount})</span>
        </button>

        <button
          onClick={() => setSubTab('payment_voucher')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            subTab === 'payment_voucher'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-amber-700" />
          <span>Payment Voucher ভিউ</span>
        </button>

        <button
          onClick={() => setSubTab('expense_heads')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            subTab === 'expense_heads'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-700" />
          <span>ব্যয় খাত রেফারেন্স</span>
        </button>

        <button
          onClick={() => setSubTab('audit_history')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            subTab === 'audit_history'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-amber-700" />
          <span>অডিট লগ ও ইতিহাস</span>
        </button>
      </div>

      {/* VIEW: NEW EXPENSE FORM */}
      {subTab === 'new_expense' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-700" />
                <span>
                  {editingExpenseId
                    ? `খসড়া ব্যয় সম্পাদনা (${expenses.find(e => e.id === editingExpenseId)?.expenseCode})`
                    : 'একীভূত নতুন ব্যয় ও পেমেন্ট ভাউচার এন্ট্রি (Unified Expense Form)'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {editingExpenseId
                  ? 'খসড়া ব্যয়ের তথ্য পরিবর্তন ও হালনাগাদ করুন। হালনাগাদ সংরক্ষিত হলে EXPENSE_UPDATED অডিট ইভেন্ট তৈরি হবে।'
                  : 'সাধারণ প্রাতিষ্ঠানিক ব্যয়ের জন্য ফর্মটি পূরণ করুন। ব্যয়ের ধরন পরিবর্তনের সাথে সাথে প্রাসঙ্গিক ফিল্ড ও তহবিল নিয়ম ডাইনামিকালি প্রযোজ্য হবে।'}
              </p>
            </div>
            {editingExpenseId && (
              <button
                type="button"
                onClick={() => {
                  setEditingExpenseId(null);
                  setSubTab('expense_register');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition w-fit"
              >
                সম্পাদনা বাতিল
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* SECTION 1: ব্যয়ের ধরন ও খাত */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-700" />
                <span>সেকশন ১: ব্যয়ের শ্রেণি ও খাত নির্ধারণ (৭টি সাধারণ ব্যয় টাইপ)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ব্যয়ের সাধারণ ক্যাটাগরি (Locked Type) *</label>
                  <select
                    value={formExpenseType}
                    onChange={e => handleExpenseTypeChange(e.target.value as ExpenseTypeCode)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-500"
                  >
                    {ALL_EXPENSE_TYPE_CODES.map(code => (
                      <option key={code} value={code}>
                        {EXPENSE_TYPES_CONFIG[code].displayNameBn}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {currentTypeConfig.description}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ব্যয় খাত (EXP-* Head) *</label>
                  <select
                    value={formHeadId}
                    onChange={e => setFormHeadId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-500"
                  >
                    {heads.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.headCode} — {h.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-amber-800 mt-1 block font-numeric">
                    সুপারিশকৃত: {currentTypeConfig.defaultHeadCode} ({currentTypeConfig.defaultHeadNameBn})
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ব্যয়ের প্রকৃত তারিখ (Expense Date) *</label>
                  <input
                    type="date"
                    value={formExpenseDate}
                    onChange={e => setFormExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-numeric focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">ভাউচার ও ট্রানজাকশনের হিসাব তারিখ</span>
                </div>
              </div>

              {/* Guidance / Warning Alert */}
              <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  <span>নীতিমালা নির্দেশনা:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{currentTypeConfig.guidanceNoteBn}</p>
                {currentTypeConfig.warningNoteBn && (
                  <p className="text-[11px] font-bold text-rose-800">{currentTypeConfig.warningNoteBn}</p>
                )}
              </div>
            </div>

            {/* SECTION 2: আর্থিক তথ্য ও তহবিল ম্যাপিং */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-700" />
                <span>সেকশন ২: আর্থিক তথ্য ও তহবিল ম্যাপিং (Head ≠ Fund ≠ Account)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">তহবিল (Fund / Purpose) *</label>
                  <select
                    value={formFundId}
                    onChange={e => setFormFundId(e.target.value)}
                    disabled={currentTypeConfig.isFundFixed}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-medium ${
                      currentTypeConfig.isFundFixed ? 'bg-amber-100/60 border-amber-300 text-amber-950 cursor-not-allowed' : 'bg-white border-slate-300'
                    }`}
                  >
                    {funds.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  {currentTypeConfig.isFundFixed && (
                    <span className="text-[10px] text-amber-800 font-bold mt-1 block">
                      🔒 লকড নীতি: এই ব্যয়ের তহবিল স্বয়ংক্রিয়ভাবে "{currentTypeConfig.fixedFundNameBn}"-এ নির্ধারিত।
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পরিশোধের হিসাব (Payment Account) *</label>
                  <select
                    value={formAccountId}
                    onChange={e => setFormAccountId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-500"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.accountName}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">যে ব্যাংক বা ক্যাশ থেকে টাকা বিতরণ হবে</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পেমেন্ট মাধ্যম (Payment Method) *</label>
                  <select
                    value={formPaymentMethod}
                    onChange={e => setFormPaymentMethod(e.target.value as PaymentMethodType)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="cash">নগদ টাকা (Cash Payment)</option>
                    <option value="bank_transfer">ব্যাংক ট্রান্সফার (Bank Transfer)</option>
                    <option value="cheque">ব্যাংক চেক (Cheque)</option>
                    <option value="other">মোবাইল ফিন্যান্সিয়াল / অন্যান্য (MFS/Other)</option>
                  </select>
                </div>
              </div>

              {/* Amount Inputs with Live Words Conversion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ব্যয়ের পরিমাণ (টাকা) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 font-numeric">৳</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={formAmount}
                      onChange={e => setFormAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-base font-bold text-slate-900 font-numeric focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">কথায় (Amount in Words):</span>
                  <p className="text-xs font-bold text-emerald-950 mt-0.5 font-body">
                    {amountInWords}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: প্রাপক ও গ্রহীতার তথ্য */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-700" />
                <span>সেকশন ৩: প্রাপক ও পক্ষ নির্ধারণ (Payee Information)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রাপকের ধরন (Party Type) *</label>
                  <select
                    value={formPartyType}
                    onChange={e => setFormPartyType(e.target.value as ExpensePartyType)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="external_party">বহিরাগত বিক্রেতা / ব্যক্তি (External Party)</option>
                    <option value="organization">প্রতিষ্ঠান / সরবরাহকারী (Organization/Agency)</option>
                    <option value="member">সমিতির সদস্য / কর্মকর্তা (Member/Official)</option>
                    <option value="other_approved">অন্যান্য অনুমোদিত পক্ষ</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {formPartyType === 'member' ? 'সদস্য নির্বাচন করুন *' : 'প্রাপকের পূর্ণ নাম ও মোবাইল *'}
                  </label>
                  {formPartyType === 'member' ? (
                    <select
                      value={formSelectedMemberId}
                      onChange={e => setFormSelectedMemberId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-500"
                    >
                      {members.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} ({m.memberCode}) — {m.mobile}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="উদাঃ আল-আমিন অফসেট প্রেস / ইঞ্জিনিয়ার রফিকুল ইসলাম (০১৮১২-৯৯৯০০১)"
                      value={formPayeeName}
                      onChange={e => setFormPayeeName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-500"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 4: রেফারেন্স ও মেমো নম্বর */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-amber-700" />
                <span>সেকশন ৪: ভাউচার বিল ও অনুমোদন রেফারেন্স (Audit Trail & Duplicate Check)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিক্রেতার বিল / ক্যাশ মেমো নং</label>
                  <input
                    type="text"
                    placeholder="উদাঃ BILL-2026-458"
                    value={formBillNumber}
                    onChange={e => setFormBillNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-numeric focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">ডুপ্লিকেট বিল পেমেন্ট রোধে সহায়ক</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অভ্যন্তরীণ অনুমোদন রেফারেন্স নং</label>
                  <input
                    type="text"
                    placeholder="উদাঃ RES-MTG-03/26"
                    value={formReferenceNumber}
                    onChange={e => setFormReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-numeric focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">চেক / ট্রানজাকশন আইডি (প্রযোজ্য ক্ষেত্রে)</label>
                  <input
                    type="text"
                    placeholder="উদাঃ CQ-9921004 / TrxID-8B90"
                    value={formExternalReference}
                    onChange={e => setFormExternalReference(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-numeric focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: সহায়ক তথ্য ও প্রমাণপত্র */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>সেকশন ৫: ব্যয়ের বিবরণ ও সংযুক্ত প্রমাণপত্র</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ব্যয়ের বিস্তারিত বিবরণ ও উদ্দেশ্য *</label>
                  <textarea
                    rows={3}
                    placeholder="ব্যয়ের সুনির্দিষ্ট কারণ ও প্রেক্ষাপট লিখুন..."
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">সংযুক্ত প্রমাণপত্র / স্ক্যান মেমো ফাইল নাম</label>
                    <input
                      type="text"
                      placeholder="উদাঃ প্রেস ক্যাশ মেমো ও ডেলিভারি চালান.pdf"
                      value={formDocName}
                      onChange={e => setFormDocName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">অতিরিক্ত নোট (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      placeholder="নিরীক্ষক বা কার্যনির্বাহী কমিটির জন্য অতিরিক্ত নির্দেশনা"
                      value={formNotes}
                      onChange={e => setFormNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: কর্মপ্রবাহ ও সংরক্ষণ বাটন */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>প্রস্তুতকারী: <strong className="text-slate-800">{currentActor.name}</strong></span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveExpense('DRAFT')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition"
                >
                  {editingExpenseId ? 'খসড়া আপডেট করুন' : 'খসড়া সংরক্ষণ (Save Draft)'}
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveExpense('SUBMITTED')}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>{editingExpenseId ? 'আপডেট ও জমা দিন' : 'অনুমোদনের জন্য জমা দিন (Submit for Approval)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: EXPENSE REGISTER / PENDING APPROVAL / REJECTED EXPENSES */}
      {(subTab === 'expense_register' || subTab === 'pending_approval' || subTab === 'rejected_expenses') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header & Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {subTab === 'pending_approval' ? 'অনুমোদন অপেক্ষমান ব্যয় তালিকা (Maker-Checker Review)' : subTab === 'rejected_expenses' ? 'প্রত্যাখ্যাত ব্যয় তালিকা (Rejected Expenses)' : 'কেন্দ্রীয় ব্যয় ও পেমেন্ট ভাউচার রেজিস্টার'}
              </h3>
              <p className="text-xs text-slate-500">
                {subTab === 'pending_approval' ? 'প্রস্তুতকৃত ব্যয় পর্যালোচনার পর অনুমোদন অথবা সুনির্দিষ্ট কারণসহ প্রত্যাখ্যান করুন।' : 'সকল ব্যয় এন্ট্রি, পেমেন্ট ভাউচার প্রিন্ট এবং অডিট ট্রেইল।'}
              </p>
            </div>

            {/* Filter Tools */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="কোড, ভাউচার, প্রাপক বা বিবরণ..."
                  value={filters.searchQuery}
                  onChange={e => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs w-48 sm:w-60 focus:ring-1 focus:ring-amber-500 font-numeric"
                />
              </div>

              {subTab === 'expense_register' && (
                <select
                  value={filters.status}
                  onChange={e => setFilters(f => ({ ...f, status: e.target.value as any }))}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  <option value="all">সকল স্ট্যাটাস</option>
                  <option value="DRAFT">খসড়া (DRAFT)</option>
                  <option value="SUBMITTED">জমা দেওয়া (SUBMITTED)</option>
                  <option value="APPROVED">অনুমোদিত (APPROVED)</option>
                  <option value="REJECTED">প্রত্যাখ্যাত (REJECTED)</option>
                </select>
              )}

              <select
                value={filters.expenseTypeCode}
                onChange={e => setFilters(f => ({ ...f, expenseTypeCode: e.target.value as any }))}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs max-w-[180px]"
              >
                <option value="all">সকল ব্যয়ের ধরন</option>
                {ALL_EXPENSE_TYPE_CODES.map(c => (
                  <option key={c} value={c}>
                    {EXPENSE_TYPES_CONFIG[c].displayNameBn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Listing */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">ভাউচার / কোড</th>
                  <th className="py-3 px-3.5">তারিখ</th>
                  <th className="py-3 px-3.5">ব্যয়ের ধরন ও খাত</th>
                  <th className="py-3 px-3.5">প্রাপক (Payee)</th>
                  <th className="py-3 px-3.5">তহবিল ও একাউন্ট</th>
                  <th className="py-3 px-3.5 text-right">পরিমাণ (টাকা)</th>
                  <th className="py-3 px-3.5 text-center">স্ট্যাটাস</th>
                  <th className="py-3 px-3.5 text-center">কর্মপ্রবাহ ও অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      কোনো ব্যয়ের রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map(item => {
                    const typeDef = EXPENSE_TYPES_CONFIG[item.expenseTypeCode] || EXPENSE_TYPES_CONFIG.other_general_expense;
                    const headObj = headMap.get(item.expenseHeadId);
                    const fundObj = fundMap.get(item.fundId);
                    const accObj = accountMap.get(item.accountId);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3.5 font-numeric">
                          <div className="font-bold text-slate-900">{item.voucherNumber}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{item.expenseCode}</div>
                        </td>

                        <td className="py-3 px-3.5 font-numeric text-slate-700 whitespace-nowrap">
                          {item.expenseDate}
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-slate-900">{typeDef.displayNameBn}</div>
                          <div className="text-[10px] text-slate-500 font-numeric">
                            {headObj ? `${headObj.headCode} — ${headObj.name}` : item.expenseHeadId}
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-slate-900">{item.payeeName}</div>
                          <div className="text-[10px] text-slate-400">
                            {item.billNumber ? `বিল: ${item.billNumber}` : item.partyType === 'member' ? 'সদস্য' : 'বাহ্যিক পক্ষ'}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 text-[11px]">
                          <div className="text-slate-800">{fundObj?.name || item.fundId}</div>
                          <div className="text-[10px] text-slate-400">{accObj?.accountName}</div>
                        </td>

                        <td className="py-3 px-3.5 text-right font-numeric">
                          <div className="font-bold text-slate-900 text-sm">
                            ৳ {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px] ml-auto">
                            {item.amountInWordsBn}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-numeric border ${
                              item.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : item.status === 'SUBMITTED'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : item.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {item.status === 'APPROVED'
                              ? 'অনুমোদিত'
                              : item.status === 'SUBMITTED'
                              ? 'জমা দেওয়া'
                              : item.status === 'REJECTED'
                              ? 'প্রত্যাখ্যাত'
                              : 'খসড়া'}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* POS Thermal Slip Print */}
                            <button
                              onClick={() => handleOpenPOSModal(item)}
                              className="p-1 text-slate-600 hover:text-amber-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition"
                              title="POS থার্মাল স্লিপ প্রিন্ট"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* Standard A4 Payment Voucher Print */}
                            <button
                              onClick={() => handleOpenVoucherModal(item)}
                              className="p-1 text-slate-600 hover:text-amber-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition"
                              title="Payment Voucher দেখুন ও প্রিন্ট করুন"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {/* Workflow Actions */}
                            {item.status === 'DRAFT' && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditDraft(item)}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition"
                                  title="খসড়া ব্যয় সম্পাদনা করুন (finance.expense.edit)"
                                >
                                  এডিট
                                </button>
                                <button
                                  onClick={() => handleSubmitFromDraft(item)}
                                  className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold transition"
                                  title="অনুমোদনের জন্য জমা দিন (finance.expense.submit)"
                                >
                                  জমা দিন
                                </button>
                              </div>
                            )}

                            {item.status === 'SUBMITTED' && (
                              <>
                                <button
                                  onClick={() => handleApproveExpense(item)}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition"
                                  title="Maker-Checker: প্রস্তুতকারী নিজে অনুমোদন করতে পারবেন না"
                                >
                                  অনুমোদন
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedExpense(item);
                                    setIsRejectModalOpen(true);
                                  }}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold transition"
                                >
                                  প্রত্যাখ্যান
                                </button>
                              </>
                            )}

                            {item.status === 'REJECTED' && (
                              <button
                                onClick={() => handleReopenToDraft(item)}
                                className="px-2 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>সংশোধন</span>
                              </button>
                            )}

                            {/* Audit / Details */}
                            <button
                              onClick={() => {
                                setSelectedExpense(item);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1 text-slate-500 hover:text-slate-800"
                              title="বিস্তারিত ও অডিট হিস্ট্রি"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
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
      )}

      {/* VIEW: PAYMENT VOUCHER REPOSITORY (A4 Print Center) */}
      {subTab === 'payment_voucher' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-700" />
                <span>পেমেন্ট ভাউচার সংগ্রহ ও সরাসরি প্রিন্ট সেন্টার (Payment Voucher Repository)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                অনুমোদিত ভাউচারগুলো স্ট্যান্ডার্ড A4 ডকুমেন্টে প্রিন্ট এবং আর্থিক নথিতে সংরক্ষণের উপযোগী।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgExpenses.filter(e => e.status === 'APPROVED').map(exp => (
              <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-400 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 font-numeric text-sm">{exp.voucherNumber}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-numeric">
                    APPROVED
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-900">{exp.payeeName}</div>
                  <div className="text-[11px] text-slate-500">{EXPENSE_TYPES_CONFIG[exp.expenseTypeCode]?.displayNameBn}</div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-2 font-numeric">
                  <span className="text-xs text-slate-500">{exp.expenseDate}</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ৳ {exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleOpenVoucherModal(exp)}
                    className="flex-1 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>A4 ভাউচার দেখুন</span>
                  </button>
                  <button
                    onClick={() => handleOpenPOSModal(exp)}
                    className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                    title="POS স্লিপ"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: EXPENSE HEAD REFERENCE */}
      {subTab === 'expense_heads' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-700" />
              <span>ব্যয় খাত (EXP-* Master Data Head) রেফারেন্স ক্যাটালগ</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phase 4 Master Data হতে সংজ্ঞায়িত অনুমোদিত ব্যয় খাতসমূহ। ব্যয়ের এন্ট্রিতে কোনো আয় খাত নির্বাচন করা যাবে না।
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">খাত কোড</th>
                  <th className="py-2.5 px-3">খাতের নাম (Head Name)</th>
                  <th className="py-2.5 px-3">প্রকৃতি</th>
                  <th className="py-2.5 px-3">বিবরণ ও উদ্দেশ্য</th>
                  <th className="py-2.5 px-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-numeric">
                {heads.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-amber-900">{h.headCode}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 font-body">{h.name}</td>
                    <td className="py-2.5 px-3 font-body">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">
                        {h.level === 1 ? 'মূল খাত (L1)' : 'উপ-খাত (L2)'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-body">{h.description}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-700 font-bold">সক্রিয়</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: EXPENSE AUDIT HISTORY */}
      {subTab === 'audit_history' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <History className="w-5 h-5 text-amber-700" />
              <span>ব্যয় ও ভাউচার অডিট লগ ও কেন্দ্রীয় ইতিহাস (Append-Only Audit History)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              প্রতিটি ব্যয়ের প্রস্তুতি, সংশোধন, সাবমিশন, অনুমোদন, প্রত্যাখ্যান এবং ভাউচার প্রিন্টের অপরিবর্তনীয় ট্রেইল।
            </p>
          </div>

          <div className="space-y-3">
            {orgExpenses.flatMap(e => e.auditHistory.map(a => ({ ...a, expense: e }))).sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map(log => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[10px]">
                      {log.eventType}
                    </span>
                    <span className="font-bold text-amber-900 font-numeric">{log.expense.voucherNumber}</span>
                    <span className="text-slate-400">({log.expense.expenseCode})</span>
                  </div>
                  <p className="text-slate-700 font-body">{log.notes || 'অডিট ইভেন্ট লিপিবদ্ধ'}</p>
                </div>

                <div className="text-right text-[11px] text-slate-500 shrink-0 font-numeric">
                  <div className="font-medium text-slate-700">{log.actorName}</div>
                  <div>{new Date(log.timestamp).toLocaleString('bn-BD')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: A4 PAYMENT VOUCHER PRINT MODAL */}
      {isVoucherModalOpen && selectedExpense && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto font-body space-y-6">
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                A4 Standard Payment Voucher
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button onClick={() => setIsVoucherModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold ml-2">
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Voucher Paper */}
            <div className="border-2 border-slate-800 p-6 sm:p-8 rounded-xl bg-white text-slate-900 space-y-6 shadow-sm">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <div className="flex justify-center mb-1">
                  <TSSLogo variant="compact" theme="light" size="sm" showBangla={true} />
                </div>
                <h1 className="text-xl font-bold font-heading text-slate-900">{currentOrg.name}</h1>
                <p className="text-xs text-slate-600">{currentOrg.address} | ফোন: {currentOrg.phone}</p>
                <div className="inline-block px-4 py-1 bg-slate-900 text-white text-xs font-bold tracking-widest uppercase rounded mt-2 font-heading">
                  পেমেন্ট ভাউচার (PAYMENT VOUCHER)
                </div>
              </div>

              {/* Voucher Meta Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-numeric border-b border-slate-300 pb-4">
                <div>
                  <span className="text-slate-500">ভাউচার নম্বর:</span>
                  <div className="font-bold text-sm text-slate-900">{selectedExpense.voucherNumber}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">তারিখ:</span>
                  <div className="font-bold text-sm text-slate-900">{selectedExpense.expenseDate}</div>
                </div>
                <div>
                  <span className="text-slate-500">লেনদেন কোড (Financial TRX):</span>
                  <div className="font-mono text-slate-800">{selectedExpense.transactionCode}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
                  <div className="font-bold text-slate-800 font-body">
                    {selectedExpense.paymentMethod === 'cash'
                      ? 'নগদ টাকা'
                      : (selectedExpense.paymentMethod === 'bank_transfer' || selectedExpense.paymentMethod === 'cheque')
                      ? 'ব্যাংক ট্রান্সফার / চেক'
                      : selectedExpense.paymentMethod === 'qr_payment'
                      ? 'মোবাইল ফিন্যান্সিয়াল / কিউআর'
                      : 'অন্যান্য মাধ্যম'}
                  </div>
                </div>
              </div>

              {/* Payee & Classification */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-300 pb-4">
                <div>
                  <span className="text-slate-500">প্রাপক / পরিশোধিত ব্যক্তি বা প্রতিষ্ঠান:</span>
                  <div className="font-bold text-base text-slate-900 mt-0.5">{selectedExpense.payeeName}</div>
                  {selectedExpense.billNumber && (
                    <div className="text-[11px] text-slate-600 font-numeric">ক্যাশ মেমো / বিল নং: {selectedExpense.billNumber}</div>
                  )}
                </div>
                <div className="space-y-1 text-right">
                  <div>
                    <span className="text-slate-500">ব্যয়ের ক্যাটাগরি: </span>
                    <strong className="text-slate-800">{EXPENSE_TYPES_CONFIG[selectedExpense.expenseTypeCode]?.displayNameBn}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">হিসাব খাত: </span>
                    <strong className="text-slate-800 font-numeric">
                      {headMap.get(selectedExpense.expenseHeadId)?.headCode} — {headMap.get(selectedExpense.expenseHeadId)?.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">তহবিল: </span>
                    <strong className="text-slate-800">{fundMap.get(selectedExpense.fundId)?.name}</strong>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs space-y-1 border-b border-slate-300 pb-4">
                <span className="text-slate-500">ব্যয়ের বিবরণ ও উদ্দেশ্য:</span>
                <p className="text-slate-800 leading-relaxed font-body">{selectedExpense.description}</p>
              </div>

              {/* Amount Box */}
              <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-400 space-y-1.5 text-center">
                <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">পরিশোধিত মোট অর্থ (Total Paid Amount)</div>
                <div className="text-2xl font-bold text-slate-950 font-numeric">
                  ৳ {selectedExpense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-800 font-bold font-body">
                  কথায়: {selectedExpense.amountInWordsBn}
                </div>
              </div>

              {/* 4-Signature Blocks */}
              <div className="grid grid-cols-4 gap-2 pt-10 text-center text-xs font-body">
                <div>
                  <div className="border-t border-slate-800 pt-1 font-semibold">{selectedExpense.createdByName || 'হিসাবরক্ষক'}</div>
                  <div className="text-[10px] text-slate-500">প্রস্তুতকারী (Maker)</div>
                </div>
                <div>
                  <div className="border-t border-slate-800 pt-1 font-semibold">নিরীক্ষক</div>
                  <div className="text-[10px] text-slate-500">যাচাইকারী (Checker)</div>
                </div>
                <div>
                  <div className="border-t border-slate-800 pt-1 font-semibold">{selectedExpense.approvedByName || 'অপেক্ষমান'}</div>
                  <div className="text-[10px] text-slate-500">অনুমোদনকারী (Approver)</div>
                </div>
                <div>
                  <div className="border-t border-slate-800 pt-1 font-semibold">স্বাক্ষর ও তারিখ</div>
                  <div className="text-[10px] text-slate-500">গ্রহীতার স্বাক্ষর (Payee)</div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="text-center text-[9px] text-slate-400 pt-3 border-t border-slate-200">
                Official Document generated by TSS (Tijarah Samity Software) • Status: {selectedExpense.status}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: POS THERMAL SLIP PRINT MODAL */}
      {isPOSModalOpen && selectedExpense && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 font-body space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800 font-heading">POS পেমেন্ট স্লিপ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-amber-700 text-white rounded text-xs font-bold"
                >
                  প্রিন্ট
                </button>
                <button onClick={() => setIsPOSModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
                  ✕
                </button>
              </div>
            </div>

            {/* Thermal POS Receipt Body */}
            <div className="p-4 bg-amber-50/30 border border-slate-300 rounded-lg space-y-3 font-numeric text-xs">
              <div className="text-center space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                <div className="font-bold text-sm text-slate-900">{currentOrg.name}</div>
                <div className="text-[10px] text-slate-500">ব্যয় পরিশোধ ভাউচার স্লিপ</div>
                <div className="font-bold text-slate-800 mt-1">{selectedExpense.voucherNumber}</div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">তারিখ:</span>
                  <span className="font-bold">{selectedExpense.expenseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">প্রাপক:</span>
                  <span className="font-bold truncate max-w-[140px]">{selectedExpense.payeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">খাত:</span>
                  <span className="truncate max-w-[140px]">{headMap.get(selectedExpense.expenseHeadId)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">তহবিল:</span>
                  <span>{fundMap.get(selectedExpense.fundId)?.name}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="p-2.5 bg-white border border-slate-300 rounded text-center space-y-1">
                <div className="text-[10px] text-slate-500">পরিশোধিত মোট অর্থ</div>
                <div className="text-lg font-bold text-slate-900">
                  ৳ {selectedExpense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-600 font-body">
                  কথায়: {selectedExpense.amountInWordsBn}
                </div>
              </div>

              <div className="pt-4 grid grid-cols-2 text-center text-[10px] text-slate-500 font-body">
                <div>
                  <div className="border-t border-slate-400 pt-1">প্রস্তুতকারী</div>
                  <div className="font-semibold text-slate-800">{selectedExpense.createdByName}</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1">অনুমোদনকারী</div>
                  <div className="font-semibold text-slate-800">{selectedExpense.approvedByName || 'অপেক্ষমান'}</div>
                </div>
              </div>

              <div className="text-center text-[9px] text-slate-400 pt-2 border-t border-dashed border-slate-300">
                Powered by TSS — {BRAND_CONFIG.tagline}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REJECTION REASON DIALOG */}
      {isRejectModalOpen && selectedExpense && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 font-body space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>ব্যয় এন্ট্রি প্রত্যাখ্যানের কারণ</span>
              </h3>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-slate-600">
                ভাউচার নং: <strong className="text-slate-900 font-numeric">{selectedExpense.voucherNumber}</strong> | পরিমাণ: <strong className="text-slate-900 font-numeric">৳ {selectedExpense.amount.toLocaleString('en-IN')}</strong>
              </p>
              <label className="block font-bold text-slate-700">প্রত্যাখ্যানের সুনির্দিষ্ট কারণ লিখুন *</label>
              <textarea
                rows={3}
                placeholder="উদাঃ বিলের সাথে অনুমোদিত মেমো ও টেকনিশিয়ানের জব স্লিপ সংযুক্ত নেই..."
                value={rejectionReasonInput}
                onChange={e => setRejectionReasonInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition"
              >
                প্রত্যাখ্যান নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DETAIL & AUDIT TIMELINE */}
      {isDetailModalOpen && selectedExpense && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 font-body space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-900 font-numeric">ভাউচার: {selectedExpense.voucherNumber}</span>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {EXPENSE_TYPES_CONFIG[selectedExpense.expenseTypeCode]?.displayNameBn}
                </h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-numeric">
              <div>
                <span className="text-slate-500">ব্যয় কোড:</span>
                <p className="font-bold text-slate-800">{selectedExpense.expenseCode}</p>
              </div>
              <div>
                <span className="text-slate-500">আর্থিক ট্রানজাকশন কোড:</span>
                <p className="font-bold text-slate-800">{selectedExpense.transactionCode}</p>
              </div>
              <div>
                <span className="text-slate-500">তারিখ:</span>
                <p className="font-bold text-slate-800">{selectedExpense.expenseDate}</p>
              </div>
              <div>
                <span className="text-slate-500">পরিমাণ:</span>
                <p className="font-bold text-amber-950 text-sm">
                  ৳ {selectedExpense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 font-body">কথায়:</span>
                <p className="font-bold text-slate-800 font-body">{selectedExpense.amountInWordsBn}</p>
              </div>
              <div>
                <span className="text-slate-500 font-body">প্রাপক:</span>
                <p className="font-bold text-slate-800 font-body">{selectedExpense.payeeName}</p>
              </div>
              <div>
                <span className="text-slate-500 font-body">হিসাব খাত:</span>
                <p className="font-bold text-slate-800 font-body">{headMap.get(selectedExpense.expenseHeadId)?.name}</p>
              </div>
            </div>

            {/* Sensitive Protected Information Block */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 font-heading">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>সংবেদনশীল আর্থিক তথ্য (Protected Financial Details)</span>
                  </span>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    ব্যাংক ও মোবাইল ফিন্যান্সিয়াল একাউন্টের গোপন নম্বর মাস্কড অবস্থায় সংরক্ষিত।
                  </p>
                </div>
                {!isSensitiveRevealed ? (
                  <button
                    onClick={handleRevealSensitive}
                    className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                    title="সংবেদনশীল তথ্য উন্মোচন করুন (EXPENSE_SENSITIVE_VIEWED লগ তৈরি হবে)"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>উন্মোচন করুন</span>
                  </button>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold">
                    উন্মোচিত (Logged in Audit)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-numeric">
                <div>
                  <span className="text-slate-500">পেমেন্ট অ্যাকাউন্ট:</span>
                  <p className="font-bold text-slate-800">{accountMap.get(selectedExpense.accountId)?.accountName}</p>
                </div>
                <div>
                  <span className="text-slate-500">অ্যাকাউন্ট / মোবাইল নম্বর:</span>
                  <p className="font-bold text-slate-900 font-mono">
                    {isSensitiveRevealed
                      ? (accountMap.get(selectedExpense.accountId)?.accountNumberMasked?.replace('******', '2050-') ||
                         accountMap.get(selectedExpense.accountId)?.mobileNumberMasked?.replace('****', '7891') ||
                         '01812-789100')
                      : (accountMap.get(selectedExpense.accountId)?.accountNumberMasked ||
                         accountMap.get(selectedExpense.accountId)?.mobileNumberMasked ||
                         '****** (Masked)')}
                  </p>
                </div>
              </div>
            </div>

            {selectedExpense.rejectionReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                <span className="font-bold">প্রত্যাখ্যানের কারণ:</span>
                <p>{selectedExpense.rejectionReason}</p>
              </div>
            )}

            {/* Audit History Timeline */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">অডিট লগ ও ইতিহাস:</h4>
              <div className="space-y-2">
                {selectedExpense.auditHistory.map(h => (
                  <div key={h.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 font-mono text-[10px] px-1.5 py-0.5 bg-slate-200 rounded mr-2">
                        {h.eventType}
                      </span>
                      <span className="text-slate-700">{h.notes}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-numeric">
                      {h.actorName} • {new Date(h.timestamp).toLocaleTimeString('bn-BD')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
