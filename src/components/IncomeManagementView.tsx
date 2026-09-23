import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  FileCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Printer,
  ChevronRight,
  Eye,
  AlertTriangle,
  Info,
  Calendar,
  Wallet,
  ShieldCheck,
  User,
  ShoppingBag,
  Home,
  Briefcase,
  HeartHandshake,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  FileText,
  DollarSign
} from 'lucide-react';
import {
  OrganizationContext,
  IncomeEntry,
  IncomeFilterCriteria,
  IncomeSummaryMetrics,
  PaymentMethodType,
  TransactionStatus,
  AccountEntity,
  FundEntity,
  HeadEntity,
  MemberType
} from '../types';
import {
  INCOME_TYPES_CONFIG,
  IncomeTypeCode,
  ADMIN_EXPENSE_FUND_ID,
  ADMIN_EXPENSE_FUND_NAME_BN,
  ALL_INCOME_TYPE_CODES
} from '../config/incomeTypeConfig';
import { numberToBengaliWords, formatToBengaliCurrency } from '../utils/bengaliNumberWords';
import { TSSLogo, TSSReportHeader, TSSReportFooter, BRAND_CONFIG } from '../branding';

// Mock Master Data for Demonstration & Testing
export const INITIAL_MEMBERS: MemberType[] = [
  {
    id: 'mem-001',
    organizationId: 'demo-org-khurushkul',
    memberCode: 'MEM-2026-001',
    fullName: 'মাওলানা মাহমুদ হাসান',
    mobile: '01812345678',
    status: 'active',
    joinedAt: '2026-01-01',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'mem-002',
    organizationId: 'demo-org-khurushkul',
    memberCode: 'MEM-2026-002',
    fullName: 'হাফেজ মোহাম্মদ তৈয়ব',
    mobile: '01712345679',
    status: 'active',
    joinedAt: '2026-01-15',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'mem-003',
    organizationId: 'demo-org-khurushkul',
    memberCode: 'MEM-2026-003',
    fullName: 'মাওলানা জসিম উদ্দিন',
    mobile: '01912345680',
    status: 'active',
    joinedAt: '2026-02-01',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z'
  }
];

export const INITIAL_ACCOUNTS: AccountEntity[] = [
  {
    id: 'acc-demo-cash',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-001',
    accountName: 'প্রধান ক্যাশ বাক্স (হাতে নগদ)',
    accountType: 'cash',
    status: 'active',
    associatedFundIds: ['fnd-demo-gen', 'fnd-demo-admin'],
    openingBalanceSupported: true,
    isSystemDefined: true,
    sortOrder: 1,
    createdBy: 'System',
    updatedBy: 'System',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'acc-demo-bank',
    organizationId: 'demo-org-khurushkul',
    accountCode: 'ACC-002',
    accountName: 'ইসলামী ব্যাংক সঞ্চয়ী হিসাব',
    accountType: 'bank',
    bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    branchName: 'কক্সবাজার শাখা',
    accountNumberMasked: '******8901',
    status: 'active',
    associatedFundIds: ['fnd-demo-gen', 'fnd-demo-share'],
    openingBalanceSupported: true,
    isSystemDefined: true,
    sortOrder: 2,
    createdBy: 'System',
    updatedBy: 'System',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

export const INITIAL_FUNDS: FundEntity[] = [
  {
    id: 'fnd-demo-gen',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-001',
    name: 'সাধারণ তহবিল (General Fund)',
    fundType: 'general',
    isActive: true,
    status: 'active',
    isSystemDefined: true,
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fnd-demo-share',
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-002',
    name: 'শেয়ার মূলধন তহবিল (Share Capital Fund)',
    fundType: 'share',
    isActive: true,
    status: 'active',
    isSystemDefined: true,
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: ADMIN_EXPENSE_FUND_ID,
    organizationId: 'demo-org-khurushkul',
    fundCode: 'FND-004',
    name: ADMIN_EXPENSE_FUND_NAME_BN,
    fundType: 'administrative',
    isActive: true,
    status: 'active',
    isSystemDefined: true,
    sortOrder: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

export const INITIAL_HEADS: HeadEntity[] = [
  {
    id: 'hd-inc-monthly',
    organizationId: 'demo-org-khurushkul',
    headCode: 'INC-001',
    name: 'সদস্য নিয়মিত সঞ্চয় কিস্তি ও ফি',
    headType: 'income',
    parentId: null,
    level: 1,
    isActive: true,
    status: 'active',
    isSystemDefined: true,
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'hd-inc-sales',
    organizationId: 'demo-org-khurushkul',
    headCode: 'INC-002',
    name: 'ব্যবসায়িক পণ্য বিক্রয় ও ভাড়া আয়',
    headType: 'income',
    parentId: null,
    level: 1,
    isActive: true,
    status: 'active',
    isSystemDefined: true,
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'hd-inc-donation',
    organizationId: 'demo-org-khurushkul',
    headCode: 'INC-003',
    name: 'সাধারণ অনুদান ও অন্যান্য প্রাপ্তি',
    headType: 'income',
    parentId: null,
    level: 1,
    isActive: true,
    status: 'active',
    isSystemDefined: true,
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

// Seed initial demo income entries
export const INITIAL_INCOME_ENTRIES: IncomeEntry[] = [
  {
    id: 'inc-demo-001',
    organizationId: 'demo-org-khurushkul',
    incomeTypeCode: 'member_monthly_fee',
    transactionCode: 'TRX-2026-000101',
    receiptNo: 'REC-2026-00101',
    entryDate: '2026-03-01',
    amount: 3000,
    amountInWordsBn: 'তিন হাজার টাকা মাত্র',
    paymentMethod: 'cash',
    accountId: 'acc-demo-cash',
    fundId: 'fnd-demo-gen',
    headId: 'hd-inc-monthly',
    description: 'মাওলানা মাহমুদ হাসান-এর জানুয়ারি-মার্চ ২০২৬ মাসের মাসিক ফি আদায়।',
    status: 'APPROVED',
    isRefundable: true,
    isMemberSettlementEligible: true,
    isCapital: false,
    memberDetails: {
      memberId: 'mem-001',
      memberCode: 'MEM-2026-001',
      memberName: 'মাওলানা মাহমুদ হাসান',
      fiscalYear: '2025-2026',
      monthlyFeeRate: 1000,
      startMonth: 'জানুয়ারি ২০২৬',
      endMonth: 'মার্চ ২০২৬',
      totalMonths: 3,
      totalPayable: 3000,
      previouslyPaid: 0,
      arrears: 0,
      advance: 0
    },
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (মাওলানা আবদুল্লাহ)',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (মাওলানা আবদুল্লাহ)',
    submittedAt: '2026-03-01T10:00:00Z',
    approvedBy: 'usr-manager-01',
    approvedByName: 'ম্যানেজার (মুফতি কামরুল)',
    approvedAt: '2026-03-01T11:00:00Z',
    version: 2,
    createdAt: '2026-03-01T09:30:00Z',
    updatedAt: '2026-03-01T11:00:00Z'
  },
  {
    id: 'inc-demo-002',
    organizationId: 'demo-org-khurushkul',
    incomeTypeCode: 'member_admission_passbook',
    transactionCode: 'TRX-2026-000102',
    receiptNo: 'REC-2026-00102',
    entryDate: '2026-03-05',
    amount: 1200,
    amountInWordsBn: 'এক হাজার দুই শত টাকা মাত্র',
    paymentMethod: 'cash',
    accountId: 'acc-demo-cash',
    fundId: ADMIN_EXPENSE_FUND_ID,
    headId: 'hd-inc-monthly',
    description: 'হাফেজ মোহাম্মদ তৈয়ব-এর সদস্য ভর্তি ফি (১০০০) ও পাশ বই বিক্রয় (২০০)।',
    status: 'SUBMITTED',
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    memberDetails: {
      memberId: 'mem-002',
      memberCode: 'MEM-2026-002',
      memberName: 'হাফেজ মোহাম্মদ তৈয়ব',
      admissionFee: 1000,
      hasPassbook: true,
      passbookPrice: 200,
      passbookNumber: 'PB-2026-0089',
      totalPayable: 1200
    },
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (মাওলানা আবদুল্লাহ)',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (মাওলানা আবদুল্লাহ)',
    submittedAt: '2026-03-05T09:15:00Z',
    version: 1,
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-03-05T09:15:00Z'
  },
  {
    id: 'inc-demo-003',
    organizationId: 'demo-org-khurushkul',
    incomeTypeCode: 'product_sale_receipt',
    transactionCode: 'TRX-2026-000103',
    receiptNo: 'REC-2026-00103',
    entryDate: '2026-03-10',
    amount: 15000,
    amountInWordsBn: 'পনেরো হাজার টাকা মাত্র',
    paymentMethod: 'bank_transfer',
    paymentMethodDetails: 'IBBL TrxID: 987654321',
    accountId: 'acc-demo-bank',
    fundId: 'fnd-demo-gen',
    headId: 'hd-inc-sales',
    description: 'হালাল ভোগ্যপণ্য বিক্রয় চালান নং SLS-2026-015 বাবদ প্রাপ্তি।',
    status: 'APPROVED',
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    saleDetails: {
      buyerType: 'member',
      buyerId: 'mem-003',
      buyerName: 'মাওলানা জসিম উদ্দিন',
      salesNo: 'SLS-2026-015',
      products: [
        { productName: 'খাঁটি সরিষার তেল (৫ লিটার)', quantity: 20, unit: 'বোতল', unitPrice: 750, lineTotal: 15000 }
      ],
      discount: 0,
      totalSaleAmount: 15000,
      previouslyPaid: 0,
      outstanding: 0,
      paymentType: 'full'
    },
    createdBy: 'usr-accountant-01',
    createdByName: 'হিসাবরক্ষক (মাওলানা আবদুল্লাহ)',
    submittedBy: 'usr-accountant-01',
    submittedByName: 'হিসাবরক্ষক (মাওলানা আবদুল্লাহ)',
    submittedAt: '2026-03-10T12:00:00Z',
    approvedBy: 'usr-admin-01',
    approvedByName: 'অ্যাডমিন (মাওলানা রফিক)',
    approvedAt: '2026-03-10T14:30:00Z',
    version: 2,
    createdAt: '2026-03-10T11:45:00Z',
    updatedAt: '2026-03-10T14:30:00Z'
  }
];

export const IncomeManagementView: React.FC<{
  currentOrg: OrganizationContext;
}> = ({ currentOrg }) => {
  // Current active logged in actor role simulation
  const [currentUserRole, setCurrentUserRole] = useState<'accountant' | 'manager' | 'admin' | 'viewer'>('accountant');
  const currentUserId = currentUserRole === 'accountant' ? 'usr-accountant-01' : currentUserRole === 'manager' ? 'usr-manager-01' : currentUserRole === 'admin' ? 'usr-admin-01' : 'usr-viewer-01';
  const currentUserName = currentUserRole === 'accountant' ? 'হিসাবরক্ষক (মাওলানা আবদুল্লাহ)' : currentUserRole === 'manager' ? 'ম্যানেজার (মুফতি কামরুল)' : currentUserRole === 'admin' ? 'অ্যাডমিন (মাওলানা রফিক)' : 'পর্যবেক্ষক';

  // Data Store
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>(INITIAL_INCOME_ENTRIES);
  const [members] = useState<MemberType[]>(INITIAL_MEMBERS);
  const [accounts] = useState<AccountEntity[]>(INITIAL_ACCOUNTS);
  const [funds] = useState<FundEntity[]>(INITIAL_FUNDS);
  const [heads] = useState<HeadEntity[]>(INITIAL_HEADS);

  // Filter State
  const [filters, setFilters] = useState<IncomeFilterCriteria>({
    searchQuery: '',
    incomeTypeCode: 'all',
    status: 'all',
    accountId: 'all',
    fundId: 'all',
    headId: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Modal / Drawer States
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPOSModalOpen, setIsPOSModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<IncomeEntry | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Unified Form State (Dynamic)
  const [formIncomeType, setFormIncomeType] = useState<IncomeTypeCode>('member_monthly_fee');
  const [formEntryDate, setFormEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [formReceiptNo, setFormReceiptNo] = useState(`REC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethodType>('cash');
  const [formPaymentDetails, setFormPaymentDetails] = useState('');
  const [formAccountId, setFormAccountId] = useState(INITIAL_ACCOUNTS[0]?.id || '');
  const [formFundId, setFormFundId] = useState(INITIAL_FUNDS[0]?.id || '');
  const [formHeadId, setFormHeadId] = useState(INITIAL_HEADS[0]?.id || '');
  const [formDescription, setFormDescription] = useState('');
  const [formReference, setFormReference] = useState('');
  const [formAmount, setFormAmount] = useState<number>(1000);

  // Member-Specific Fields
  const [formMemberId, setFormMemberId] = useState<string>(INITIAL_MEMBERS[0]?.id || '');
  const [formFiscalYear, setFormFiscalYear] = useState('2025-2026');
  const [formFeeYear, setFormFeeYear] = useState(2026);
  const [formMonthlyFeeRate, setFormMonthlyFeeRate] = useState(1000);
  const [formStartMonth, setFormStartMonth] = useState('জানুয়ারি ২০২৬');
  const [formEndMonth, setFormEndMonth] = useState('মার্চ ২০২৬');
  const [formTotalMonths, setFormTotalMonths] = useState(3);
  const [formAdjustmentDiscount, setFormAdjustmentDiscount] = useState(0);
  const [formAdjustmentReason, setFormAdjustmentReason] = useState('');
  const [formAdmissionFee, setFormAdmissionFee] = useState(1000);
  const [formHasPassbook, setFormHasPassbook] = useState(true);
  const [formPassbookPrice, setFormPassbookPrice] = useState(200);
  const [formPassbookNumber, setFormPassbookNumber] = useState(`PB-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [formFeeName, setFormFeeName] = useState('');
  const [formFeePurpose, setFormFeePurpose] = useState('');

  // Business / Sale / Rent / Asset / Donation Fields
  const [formBuyerType, setFormBuyerType] = useState<'member' | 'external_party'>('member');
  const [formBuyerName, setFormBuyerName] = useState('');
  const [formSalesNo, setFormSalesNo] = useState(`SLS-2026-0${Math.floor(10 + Math.random() * 90)}`);
  const [formProductName, setFormProductName] = useState('হালাল ভোগ্যপণ্য প্যাকেজ');
  const [formProductQty, setFormProductQty] = useState(1);
  const [formProductUnit, setFormProductUnit] = useState('প্যাকেট');
  const [formProductUnitPrice, setFormProductUnitPrice] = useState(5000);

  const [formAssetType, setFormAssetType] = useState('দোকান ঘর');
  const [formAssetName, setFormAssetName] = useState('দোকান নং ০৪ (মার্কেট ভবন)');
  const [formTenantType, setFormTenantType] = useState<'member' | 'external_party'>('member');
  const [formTenantName, setFormTenantName] = useState('');
  const [formLeaseAgreementNo, setFormLeaseAgreementNo] = useState('LSE-2026-012');
  const [formRentPeriodStart, setFormRentPeriodStart] = useState('2026-03-01');
  const [formRentPeriodEnd, setFormRentPeriodEnd] = useState('2026-03-31');

  const [formAssetSaleName, setFormAssetSaleName] = useState('পুরাতন ডেলিভারি ভ্যান');
  const [formAssetBookValue, setFormAssetBookValue] = useState(80000);
  const [formAssetSalePrice, setFormAssetSalePrice] = useState(95000);
  const [formAssetSaleCost, setFormAssetSaleCost] = useState(5000);

  const [formDonationPurposeType, setFormDonationPurposeType] = useState<'general' | 'event' | 'initiative'>('event');
  const [formDonationPurposeName, setFormDonationPurposeName] = useState('বার্ষিক মাহফিল ও সামাজিক উদ্যোগ');
  const [formDonorType, setFormDonorType] = useState<'member' | 'external_party' | 'anonymous'>('member');
  const [formDonorName, setFormDonorName] = useState('');

  const [formReceiptTitle, setFormReceiptTitle] = useState('সাধারণ প্রশাসনিক বিবিধ প্রাপ্তি');

  // Active Type Configuration
  const currentTypeConfig = INCOME_TYPES_CONFIG[formIncomeType];

  // Auto-manage Fund locking for Type 3 (Admission+Passbook) and Type 4 (Annual Admin Fee)
  React.useEffect(() => {
    if (currentTypeConfig.isFundFixed && currentTypeConfig.fixedFundId) {
      setFormFundId(currentTypeConfig.fixedFundId);
    }
  }, [formIncomeType, currentTypeConfig]);

  // Real-time calculation of amount for admission + passbook
  React.useEffect(() => {
    if (formIncomeType === 'member_admission_passbook') {
      const passPrice = formHasPassbook ? Number(formPassbookPrice) || 0 : 0;
      const total = (Number(formAdmissionFee) || 0) + passPrice;
      setFormAmount(total);
    } else if (formIncomeType === 'member_monthly_fee') {
      const total = ((Number(formMonthlyFeeRate) || 0) * (Number(formTotalMonths) || 1)) - (Number(formAdjustmentDiscount) || 0);
      setFormAmount(Math.max(0, total));
    }
  }, [formIncomeType, formAdmissionFee, formHasPassbook, formPassbookPrice, formMonthlyFeeRate, formTotalMonths, formAdjustmentDiscount]);

  // Derived Bengali Amount in Words
  const amountInWords = useMemo(() => {
    return numberToBengaliWords(formAmount);
  }, [formAmount]);

  // Metrics
  const metrics: IncomeSummaryMetrics = useMemo(() => {
    const orgEntries = incomeEntries.filter(e => e.organizationId === currentOrg.id);
    const approved = orgEntries.filter(e => e.status === 'APPROVED');
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayApproved = approved.filter(e => e.entryDate === todayStr);

    return {
      totalCount: orgEntries.length,
      draftCount: orgEntries.filter(e => e.status === 'DRAFT').length,
      submittedCount: orgEntries.filter(e => e.status === 'SUBMITTED').length,
      approvedCount: approved.length,
      rejectedCount: orgEntries.filter(e => e.status === 'REJECTED').length,
      totalApprovedAmount: approved.reduce((sum, e) => sum + e.amount, 0),
      todayApprovedAmount: todayApproved.reduce((sum, e) => sum + e.amount, 0)
    };
  }, [incomeEntries, currentOrg.id]);

  // Filtered List
  const filteredEntries = useMemo(() => {
    return incomeEntries.filter((entry) => {
      if (entry.organizationId !== currentOrg.id) return false;
      if (filters.incomeTypeCode && filters.incomeTypeCode !== 'all' && entry.incomeTypeCode !== filters.incomeTypeCode) {
        return false;
      }
      if (filters.status && filters.status !== 'all' && entry.status !== filters.status) {
        return false;
      }
      if (filters.accountId && filters.accountId !== 'all' && entry.accountId !== filters.accountId) {
        return false;
      }
      if (filters.fundId && filters.fundId !== 'all' && entry.fundId !== filters.fundId) {
        return false;
      }
      if (filters.headId && filters.headId !== 'all' && entry.headId !== filters.headId) {
        return false;
      }
      if (filters.dateFrom && entry.entryDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && entry.entryDate > filters.dateTo) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const codeMatch = entry.transactionCode.toLowerCase().includes(q);
        const receiptMatch = entry.receiptNo.toLowerCase().includes(q);
        const descMatch = entry.description.toLowerCase().includes(q);
        const memberMatch = entry.memberDetails?.memberName?.toLowerCase().includes(q);
        if (!codeMatch && !receiptMatch && !descMatch && !memberMatch) return false;
      }
      return true;
    });
  }, [incomeEntries, currentOrg.id, filters]);

  // Helper Maps
  const accountMap = useMemo(() => new Map(accounts.map(a => [a.id, a])), [accounts]);
  const fundMap = useMemo(() => new Map(funds.map(f => [f.id, f])), [funds]);
  const headMap = useMemo(() => new Map(heads.map(h => [h.id, h])), [heads]);
  const memberMap = useMemo(() => new Map(members.map(m => [m.id, m])), [members]);

  // Handlers
  const handleOpenNewEntry = () => {
    setFormIncomeType('member_monthly_fee');
    setFormEntryDate(new Date().toISOString().slice(0, 10));
    setFormReceiptNo(`REC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormAmount(1000);
    setFormDescription('');
    setFormReference('');
    setFormPaymentMethod('cash');
    setFormPaymentDetails('');
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsEntryModalOpen(true);
  };

  const handleSaveIncome = (targetStatus: 'DRAFT' | 'SUBMITTED') => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Domain Validations
    if (!formAmount || formAmount <= 0) {
      setErrorMessage('লেনদেনের পরিমাণ অবশ্যই শূন্যের চেয়ে বড় (Amount > 0) হতে হবে।');
      return;
    }

    if (!formAccountId) {
      setErrorMessage('একটি সক্রিয় হিসাব (Account) নির্বাচন করুন।');
      return;
    }

    if (!formFundId) {
      setErrorMessage('একটি সক্রিয় তহবিল (Fund) নির্বাচন করুন।');
      return;
    }

    if (!formHeadId) {
      setErrorMessage('একটি সক্রিয় আয় খাত (Income Head) নির্বাচন করুন।');
      return;
    }

    // Account Status Check
    const selAcc = accountMap.get(formAccountId);
    if (!selAcc || selAcc.status !== 'active') {
      setErrorMessage('নির্বাচিত হিসাবটি নিষ্ক্রিয় বা পাওয়া যায়নি (Active Account Required)।');
      return;
    }

    // Fund Status Check
    const selFund = fundMap.get(formFundId);
    if (!selFund || selFund.status !== 'active') {
      setErrorMessage('নির্বাচিত তহবিলটি নিষ্ক্রিয় বা পাওয়া যায়নি (Active Fund Required)।');
      return;
    }

    // Fund Lock Enforcement (Admission + Passbook and Annual Admin Fee MUST use ADMIN_EXPENSE_FUND_ID)
    if (currentTypeConfig.isFundFixed && currentTypeConfig.fixedFundId) {
      if (formFundId !== currentTypeConfig.fixedFundId) {
        setErrorMessage(`এই আয়ের তহবিল অবশ্যই '${currentTypeConfig.fixedFundNameBn}' হতে হবে।`);
        return;
      }
    }

    // Head Validation (Strict INC-* and active)
    const selHead = headMap.get(formHeadId);
    if (!selHead || selHead.status !== 'active') {
      setErrorMessage('নির্বাচিত আয় খাতটি নিষ্ক্রিয় বা পাওয়া যায়নি (Active Head Required)।');
      return;
    }
    if (selHead.headType !== 'income' || !selHead.headCode.startsWith('INC-')) {
      setErrorMessage('ব্যয় খাত (Expense Head) দিয়ে আয় এন্ট্রি তৈরি করা সম্পূর্ণ নিষিদ্ধ। শুধুমাত্র সক্রিয় INC-* খাত গ্রহণযোগ্য।');
      return;
    }

    // Passbook Number uniqueness check
    if (formIncomeType === 'member_admission_passbook' && formHasPassbook) {
      if (!formPassbookNumber.trim()) {
        setErrorMessage('পাশ বই নম্বর প্রদান করা বাধ্যতামূলক।');
        return;
      }
      const duplicatePB = incomeEntries.some(
        e => e.incomeTypeCode === 'member_admission_passbook' &&
             e.memberDetails?.passbookNumber === formPassbookNumber.trim()
      );
      if (duplicatePB) {
        setErrorMessage('এই পাশ বই নম্বরটি ইতোমধ্যে অন্য সদস্যের অনুকূলে ইস্যু করা হয়েছে।');
        return;
      }
    }

    // Annual Admin Fee duplication check
    if (formIncomeType === 'annual_admin_fee') {
      const duplicateAdminFee = incomeEntries.some(
        e => e.incomeTypeCode === 'annual_admin_fee' &&
             e.memberDetails?.memberId === formMemberId &&
             e.memberDetails?.feeYear === formFeeYear &&
             e.status === 'APPROVED'
      );
      if (duplicateAdminFee) {
        setErrorMessage(`নির্বাচিত সদস্যের জন্য ${formFeeYear} সালের বাৎসরিক প্রশাসনিক ফি ইতোমধ্যে অনুমোদিত রয়েছে।`);
        return;
      }
    }

    // Build payload
    const selectedMember = memberMap.get(formMemberId);
    const newEntry: IncomeEntry = {
      id: `inc-${Date.now()}`,
      organizationId: currentOrg.id,
      incomeTypeCode: formIncomeType,
      transactionCode: `TRX-2026-${String(incomeEntries.length + 101).padStart(6, '0')}`,
      receiptNo: formReceiptNo,
      entryDate: formEntryDate,
      amount: Number(formAmount),
      amountInWordsBn: amountInWords,
      paymentMethod: formPaymentMethod,
      paymentMethodDetails: formPaymentDetails,
      accountId: formAccountId,
      fundId: formFundId,
      headId: formHeadId,
      description: formDescription.trim() || `${currentTypeConfig.displayNameBn} বাবদ প্রাপ্তি`,
      reference: formReference.trim(),
      status: targetStatus,
      isRefundable: currentTypeConfig.isRefundable,
      isMemberSettlementEligible: currentTypeConfig.isMemberSettlementEligible,
      isCapital: currentTypeConfig.isCapital,
      createdBy: currentUserId,
      createdByName: currentUserName,
      submittedBy: targetStatus === 'SUBMITTED' ? currentUserId : undefined,
      submittedByName: targetStatus === 'SUBMITTED' ? currentUserName : undefined,
      submittedAt: targetStatus === 'SUBMITTED' ? new Date().toISOString() : undefined,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Attach type-specific payload
    if (currentTypeConfig.category === 'member') {
      newEntry.memberDetails = {
        memberId: formMemberId,
        memberCode: selectedMember?.memberCode,
        memberName: selectedMember?.fullName,
        fiscalYear: formFiscalYear,
        feeYear: formFeeYear,
        monthlyFeeRate: formMonthlyFeeRate,
        startMonth: formStartMonth,
        endMonth: formEndMonth,
        totalMonths: formTotalMonths,
        totalPayable: formAmount,
        admissionFee: formAdmissionFee,
        hasPassbook: formHasPassbook,
        passbookPrice: formPassbookPrice,
        passbookNumber: formPassbookNumber,
        feeName: formFeeName,
        feePurpose: formFeePurpose
      };
    } else if (formIncomeType === 'product_sale_receipt') {
      newEntry.saleDetails = {
        buyerType: formBuyerType,
        buyerName: formBuyerType === 'member' ? (selectedMember?.fullName || 'সদস্য') : (formBuyerName || 'বাহ্যিক গ্রাহক'),
        salesNo: formSalesNo,
        products: [
          {
            productName: formProductName,
            quantity: Number(formProductQty),
            unit: formProductUnit,
            unitPrice: Number(formProductUnitPrice),
            lineTotal: Number(formAmount)
          }
        ],
        discount: 0,
        totalSaleAmount: Number(formAmount),
        previouslyPaid: 0,
        outstanding: 0,
        paymentType: 'full'
      };
    } else if (formIncomeType === 'rental_receipt') {
      newEntry.rentalDetails = {
        assetType: formAssetType,
        assetName: formAssetName,
        tenantType: formTenantType,
        tenantName: formTenantType === 'member' ? (selectedMember?.fullName || 'সদস্য') : (formTenantName || 'বাহ্যিক ভাড়াটিয়া'),
        leaseAgreementNo: formLeaseAgreementNo,
        rentPeriodStart: formRentPeriodStart,
        rentPeriodEnd: formRentPeriodEnd,
        periodCount: 1,
        scheduledRent: Number(formAmount),
        previousArrears: 0,
        outstanding: 0,
        advance: 0
      };
    } else if (formIncomeType === 'asset_sale_receipt') {
      const netProceeds = formAssetSalePrice - formAssetSaleCost;
      const gainLoss = netProceeds - formAssetBookValue;
      newEntry.assetSaleDetails = {
        assetName: formAssetSaleName,
        buyerName: formBuyerName || 'ক্রেতা',
        saleDate: formEntryDate,
        acquisitionCost: formAssetBookValue,
        acquisitionIncidentalCost: 0,
        totalAcquisitionCost: formAssetBookValue,
        subsequentCapitalExpenditure: 0,
        totalAssetCost: formAssetBookValue,
        accumulatedDepreciation: 0,
        bookValueAtSale: formAssetBookValue,
        salePrice: formAssetSalePrice,
        saleCost: formAssetSaleCost,
        netSaleProceeds: netProceeds,
        netGainOrLoss: gainLoss,
        previouslyPaid: 0,
        outstanding: 0
      };
    } else if (formIncomeType === 'general_donation_receipt') {
      newEntry.donationDetails = {
        purposeType: formDonationPurposeType,
        purposeName: formDonationPurposeName,
        donorType: formDonorType,
        donorName: formDonorType === 'anonymous' ? 'বেনামী দাতা' : (formDonorType === 'member' ? (selectedMember?.fullName || 'সদস্য') : (formDonorName || 'শুভাকাঙ্ক্ষী')),
        isAnonymous: formDonorType === 'anonymous'
      };
    } else if (formIncomeType === 'other_general_receipt') {
      newEntry.generalReceiptDetails = {
        receiptTitle: formReceiptTitle,
        sourceType: 'general',
        sourceName: formBuyerName || 'সাধারণ উৎস'
      };
    }

    setIncomeEntries(prev => [newEntry, ...prev]);
    setIsEntryModalOpen(false);
    setSuccessMessage(`আয় এন্ট্রি (${newEntry.receiptNo}) সফলভাবে ${targetStatus === 'SUBMITTED' ? 'জমা দেওয়া' : 'খসড়া সংরক্ষণ'} হয়েছে।`);
  };

  // Workflow Handlers
  const handleSubmitEntry = (entry: IncomeEntry) => {
    if (entry.status !== 'DRAFT') return;
    setIncomeEntries(prev =>
      prev.map(item =>
        item.id === entry.id
          ? {
              ...item,
              status: 'SUBMITTED',
              submittedBy: currentUserId,
              submittedByName: currentUserName,
              submittedAt: new Date().toISOString(),
              version: item.version + 1,
              updatedAt: new Date().toISOString()
            }
          : item
      )
    );
    setSuccessMessage(`রশিদ নং ${entry.receiptNo} পর্যালোচনার জন্য জমা দেওয়া হয়েছে।`);
  };

  const handleApproveEntry = (entry: IncomeEntry) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (entry.status !== 'SUBMITTED') {
      setErrorMessage('শুধুমাত্র জমা দেওয়া (SUBMITTED) এন্ট্রি অনুমোদন করা যায়।');
      return;
    }

    // Enforce Separation of Duties: Creator cannot approve own transaction
    if (entry.createdBy === currentUserId) {
      setErrorMessage('দায়িত্ব পৃথকীকরণ নীতি (Separation of Duties): প্রস্তুতকারী নিজে নিজের লেনদেন অনুমোদন করতে পারেন না।');
      return;
    }

    // Role check: Only Admin or Manager can approve
    if (currentUserRole !== 'admin' && currentUserRole !== 'manager') {
      setErrorMessage('অনুমোদন করার জন্য আপনার অ্যাকাউন্টের প্রয়োজনীয় অনুমতি নেই (Admin/Manager role required)।');
      return;
    }

    setIncomeEntries(prev =>
      prev.map(item =>
        item.id === entry.id
          ? {
              ...item,
              status: 'APPROVED',
              approvedBy: currentUserId,
              approvedByName: currentUserName,
              approvedAt: new Date().toISOString(),
              version: item.version + 1,
              updatedAt: new Date().toISOString()
            }
          : item
      )
    );

    setSuccessMessage(`রশিদ নং ${entry.receiptNo} চূড়ান্তভাবে অনুমোদিত হয়েছে। (অফিসিয়াল ব্যালেন্স কার্যকর)`);
  };

  const handleOpenRejectModal = (entry: IncomeEntry) => {
    setSelectedEntry(entry);
    setRejectionReasonInput('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedEntry) return;
    if (!rejectionReasonInput.trim()) {
      setErrorMessage('প্রত্যাখ্যানের কারণ উল্লেখ করা বাধ্যতামূলক।');
      return;
    }

    setIncomeEntries(prev =>
      prev.map(item =>
        item.id === selectedEntry.id
          ? {
              ...item,
              status: 'REJECTED',
              rejectedBy: currentUserId,
              rejectedByName: currentUserName,
              rejectedAt: new Date().toISOString(),
              rejectionReason: rejectionReasonInput.trim(),
              version: item.version + 1,
              updatedAt: new Date().toISOString()
            }
          : item
      )
    );

    setIsRejectModalOpen(false);
    setSelectedEntry(null);
    setSuccessMessage(`রশিদ নং ${selectedEntry.receiptNo} প্রত্যাখ্যাত হয়েছে।`);
  };

  const handleReopenToDraft = (entry: IncomeEntry) => {
    if (entry.status !== 'REJECTED') return;
    setIncomeEntries(prev =>
      prev.map(item =>
        item.id === entry.id
          ? {
              ...item,
              status: 'DRAFT',
              version: item.version + 1,
              updatedAt: new Date().toISOString()
            }
          : item
      )
    );
    setSuccessMessage(`রশিদ নং ${entry.receiptNo} সংশোধনের জন্য ড্রাফটে ফিরিয়ে নেওয়া হয়েছে।`);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 font-numeric">
              Phase 5.3: Income Management
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Organization: {currentOrg.shortName}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-heading mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-700" />
            আয় ও প্রাপ্তি ব্যবস্থাপনা (Unified Dynamic Income Entry)
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl font-body">
            ১২টি সুনির্দিষ্ট আয় ক্যাটাগরির জন্য একটিমাত্র ডায়নামিক এন্ট্রি ফর্ম, শতভাগ শরিয়াহ ও হিসাব নীতিমালা (Head ≠ Fund ≠ Account), বাধ্যতামূলক কথায় রূপান্তর এবং অনুমোদনে দায়িত্ব পৃথকীকরণ।
          </p>
        </div>

        {/* Action Controls & Role Simulator */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active User Simulator */}
          <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2 text-xs">
            <User className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-600 font-semibold">সক্রিয় ইউজার:</span>
            <select
              value={currentUserRole}
              onChange={e => setCurrentUserRole(e.target.value as any)}
              className="bg-white border border-slate-300 rounded px-2 py-0.5 font-bold text-emerald-950 font-numeric"
            >
              <option value="accountant">হিসাবরক্ষক (প্রস্তুতকারী)</option>
              <option value="manager">ম্যানেজার (অনুমোদনকারী)</option>
              <option value="admin">অ্যাডমিন (অনুমোদনকারী)</option>
              <option value="viewer">ভিউয়ার (রিড-অনলি)</option>
            </select>
          </div>

          <button
            onClick={handleOpenNewEntry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs font-heading cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন আয় ও প্রাপ্তি এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-900 font-bold">×</button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">×</button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-numeric">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">মোট এন্ট্রি</span>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{metrics.totalCount} টি</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs bg-amber-50/40">
          <span className="text-[11px] font-semibold text-amber-800">খসড়া (DRAFT)</span>
          <p className="text-lg font-bold text-amber-900 mt-0.5">{metrics.draftCount} টি</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs bg-blue-50/40">
          <span className="text-[11px] font-semibold text-blue-800">জমা (SUBMITTED)</span>
          <p className="text-lg font-bold text-blue-900 mt-0.5">{metrics.submittedCount} টি</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/40">
          <span className="text-[11px] font-semibold text-emerald-800">অনুমোদিত (APPROVED)</span>
          <p className="text-lg font-bold text-emerald-900 mt-0.5">{metrics.approvedCount} টি</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-xs bg-rose-50/40">
          <span className="text-[11px] font-semibold text-rose-800">প্রত্যাখ্যাত (REJECTED)</span>
          <p className="text-lg font-bold text-rose-900 mt-0.5">{metrics.rejectedCount} টি</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-xs bg-emerald-100/50">
          <span className="text-[11px] font-semibold text-emerald-900">অনুমোদিত মোট আদায়</span>
          <p className="text-base font-bold text-emerald-950 mt-0.5">৳ {metrics.totalApprovedAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="রশিদ নং, কোড বা সদস্য খুঁজুন..."
              value={filters.searchQuery || ''}
              onChange={e => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-emerald-600"
            />
          </div>

          {/* Income Type Filter */}
          <div>
            <select
              value={filters.incomeTypeCode || 'all'}
              onChange={e => setFilters(f => ({ ...f, incomeTypeCode: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
            >
              <option value="all">সকল আয় ক্যাটাগরি (১২টি ধরন)</option>
              {ALL_INCOME_TYPE_CODES.map(code => (
                <option key={code} value={code}>
                  {INCOME_TYPES_CONFIG[code].displayNameBn}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status || 'all'}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value as any }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white font-numeric"
            >
              <option value="all">সকল অনুমোদন স্ট্যাটাস</option>
              <option value="DRAFT">খসড়া (DRAFT)</option>
              <option value="SUBMITTED">জমা দেওয়া (SUBMITTED)</option>
              <option value="APPROVED">অনুমোদিত (APPROVED)</option>
              <option value="REJECTED">প্রত্যাখ্যাত (REJECTED)</option>
            </select>
          </div>

          {/* Account Filter */}
          <div>
            <select
              value={filters.accountId || 'all'}
              onChange={e => setFilters(f => ({ ...f, accountId: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
            >
              <option value="all">সকল হিসাব (Where)</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountName} ({acc.accountType === 'cash' ? 'নগদ' : 'ব্যাংক'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Income Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 font-heading flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700" />
            আয় ও প্রাপ্তি রেজিস্টার ({filteredEntries.length} টি রেকর্ড)
          </h3>
          <span className="text-[11px] text-slate-500 font-body">
            শুধুমাত্র APPROVED লেনদেন অফিশিয়াল আর্থিক ব্যালেন্সে অন্তর্ভুক্ত হবে।
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 font-heading">
              <tr>
                <th className="py-3 px-4">তারিখ ও রশিদ নং</th>
                <th className="py-3 px-3">আয়ের ধরন</th>
                <th className="py-3 px-3">সদস্য / উৎস</th>
                <th className="py-3 px-3 text-right">পরিমাণ (টাকা)</th>
                <th className="py-3 px-3">হিসাব ও তহবিল</th>
                <th className="py-3 px-3">খাত (Why)</th>
                <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-body">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    কোনো আয় বা প্রাপ্তির রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredEntries.map(entry => {
                  const typeDef = INCOME_TYPES_CONFIG[entry.incomeTypeCode as IncomeTypeCode] || INCOME_TYPES_CONFIG.other_general_receipt;
                  const acc = accountMap.get(entry.accountId);
                  const fnd = fundMap.get(entry.fundId);
                  const hd = headMap.get(entry.headId);

                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 font-numeric">{entry.receiptNo}</div>
                        <div className="text-[11px] text-slate-500 font-numeric">{entry.entryDate}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{entry.transactionCode}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{typeDef.displayNameBn}</span>
                        <div className="text-[10px] text-slate-500">{typeDef.categoryLabelBn}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-900">
                          {entry.memberDetails?.memberName || entry.saleDetails?.buyerName || entry.rentalDetails?.tenantName || entry.donationDetails?.donorName || entry.generalReceiptDetails?.sourceName || 'সাধারণ উৎস'}
                        </div>
                        {entry.memberDetails?.memberCode && (
                          <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-100 px-1 py-0.2 rounded">
                            {entry.memberDetails.memberCode}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-emerald-950 font-numeric text-sm">
                          ৳ {entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]" title={entry.amountInWordsBn}>
                          {entry.amountInWordsBn}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">{acc?.accountName || 'হিসাব'}</div>
                        <div className="text-[10px] text-emerald-700">{fnd?.name || 'তহবিল'}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-700">{hd?.name || 'খাত'}</span>
                      </td>

                      <td className="py-3 px-3 text-center font-numeric">
                        {entry.status === 'APPROVED' && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold">
                            অনুমোদিত
                          </span>
                        )}
                        {entry.status === 'SUBMITTED' && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-[10px] font-bold">
                            জমা দেওয়া
                          </span>
                        )}
                        {entry.status === 'DRAFT' && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold">
                            খসড়া
                          </span>
                        )}
                        {entry.status === 'REJECTED' && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-[10px] font-bold">
                            প্রত্যাখ্যাত
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 font-numeric">
                          {/* POS Print */}
                          <button
                            onClick={() => {
                              setSelectedEntry(entry);
                              setIsPOSModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                            title="POS প্রিন্ট"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* View Detail */}
                          <button
                            onClick={() => {
                              setSelectedEntry(entry);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                            title="বিস্তারিত দেখুন"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Submit Draft */}
                          {entry.status === 'DRAFT' && (
                            <button
                              onClick={() => handleSubmitEntry(entry)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                            >
                              <Send className="w-3 h-3" />
                              <span>জমা দিন</span>
                            </button>
                          )}

                          {/* Approve (Separation of Duties enforced) */}
                          {entry.status === 'SUBMITTED' && (
                            <button
                              onClick={() => handleApproveEntry(entry)}
                              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>অনুমোদন</span>
                            </button>
                          )}

                          {/* Reject */}
                          {entry.status === 'SUBMITTED' && (
                            <button
                              onClick={() => handleOpenRejectModal(entry)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>প্রত্যাখ্যান</span>
                            </button>
                          )}

                          {/* Reopen Rejected */}
                          {entry.status === 'REJECTED' && (
                            <button
                              onClick={() => handleReopenToDraft(entry)}
                              className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>সংশোধন</span>
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
      </div>

      {/* UNIFIED DYNAMIC INCOME ENTRY MODAL */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    একীভূত আয় ও প্রাপ্তি এন্ট্রি (Unified Dynamic Income Form)
                  </h3>
                  <p className="text-xs text-slate-500 font-body">
                    আয়ের ধরন নির্বাচন অনুযায়ী ফরম স্বয়ংক্রিয়ভাবে প্রয়োজনীয় ফিল্ড ও শরিয়াহ তহবিল নিয়মাবলী প্রদর্শন করবে।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEntryModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-5 sm:p-6 space-y-6 text-xs">
              {/* SECTION 1: মূল তথ্য (Primary Category & Metadata) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider font-heading flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                  ১. আয়ের ধরন ও মূল তথ্য
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Income Type Selector */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      আয়ের ধরন (১২টি অনুমোদিত ক্যাটাগরি) *
                    </label>
                    <select
                      value={formIncomeType}
                      onChange={e => setFormIncomeType(e.target.value as IncomeTypeCode)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-emerald-600"
                    >
                      {ALL_INCOME_TYPE_CODES.map(code => (
                        <option key={code} value={code}>
                          {INCOME_TYPES_CONFIG[code].displayNameBn} — ({INCOME_TYPES_CONFIG[code].categoryLabelBn})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1 font-body">
                      {currentTypeConfig.description}
                    </p>
                  </div>

                  {/* Entry Date */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      আদায়ের তারিখ *
                    </label>
                    <input
                      type="date"
                      value={formEntryDate}
                      onChange={e => setFormEntryDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-numeric focus:outline-emerald-600"
                    />
                  </div>
                </div>

                {/* Guidance / Warning Alert Box */}
                {currentTypeConfig.guidanceNoteBn && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{currentTypeConfig.guidanceNoteBn}</span>
                  </div>
                )}
                {currentTypeConfig.warningNoteBn && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{currentTypeConfig.warningNoteBn}</span>
                  </div>
                )}
              </div>

              {/* SECTION 2: সংশ্লিষ্ট ডোমেইন ও পার্টি তথ্য (Dynamic Type-Specific Section) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  ২. সংশ্লিষ্ট বিবরণ ও নির্দিষ্ট ফিল্ডসমূহ
                </h4>

                {/* Type 1: সদস্য মাসিক ফি */}
                {formIncomeType === 'member_monthly_fee' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">সদস্য নির্বাচন *</label>
                      <select
                        value={formMemberId}
                        onChange={e => setFormMemberId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        {members.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.fullName} ({m.memberCode}) — {m.mobile}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">অর্থ বছর *</label>
                      <input
                        type="text"
                        value={formFiscalYear}
                        onChange={e => setFormFiscalYear(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-numeric"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">মাসিক কিস্তি হার (টাকা) *</label>
                      <input
                        type="number"
                        value={formMonthlyFeeRate}
                        onChange={e => setFormMonthlyFeeRate(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-numeric"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">শুরুর মাস</label>
                      <input
                        type="text"
                        value={formStartMonth}
                        onChange={e => setFormStartMonth(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">শেষের মাস ও মোট মাস</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formEndMonth}
                          onChange={e => setFormEndMonth(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                        <input
                          type="number"
                          value={formTotalMonths}
                          onChange={e => setFormTotalMonths(Number(e.target.value))}
                          className="w-20 px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-numeric text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Type 2: সদস্য বাৎসরিক ফি */}
                {formIncomeType === 'member_annual_fee' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">সদস্য নির্বাচন *</label>
                      <select
                        value={formMemberId}
                        onChange={e => setFormMemberId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        {members.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.fullName} ({m.memberCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">ফি-এর বছর *</label>
                      <input
                        type="number"
                        value={formFeeYear}
                        onChange={e => setFormFeeYear(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-numeric"
                      />
                    </div>
                  </div>
                )}

                {/* Type 3: সদস্য ভর্তি ফি + পাশ বই */}
                {formIncomeType === 'member_admission_passbook' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">সদস্য নির্বাচন *</label>
                      <select
                        value={formMemberId}
                        onChange={e => setFormMemberId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        {members.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.fullName} ({m.memberCode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">ভর্তি ফি (টাকা) *</label>
                      <input
                        type="number"
                        value={formAdmissionFee}
                        onChange={e => setFormAdmissionFee(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-numeric"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">পাশ বই দেওয়া হয়েছে?</label>
                      <select
                        value={formHasPassbook ? 'yes' : 'no'}
                        onChange={e => setFormHasPassbook(e.target.value === 'yes')}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="yes">হ্যাঁ (Yes)</option>
                        <option value="no">না (No)</option>
                      </select>
                    </div>

                    {formHasPassbook && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">পাশ বই নম্বর ও মূল্য *</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="PB-2026-001"
                            value={formPassbookNumber}
                            onChange={e => setFormPassbookNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-numeric"
                          />
                          <input
                            type="number"
                            value={formPassbookPrice}
                            onChange={e => setFormPassbookPrice(Number(e.target.value))}
                            className="w-24 px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-numeric text-right"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Type 4: বাৎসরিক প্রশাসনিক খরচের ফি */}
                {formIncomeType === 'annual_admin_fee' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">সদস্য নির্বাচন *</label>
                      <select
                        value={formMemberId}
                        onChange={e => setFormMemberId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        {members.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.fullName} ({m.memberCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">ফি-এর বছর *</label>
                      <input
                        type="number"
                        value={formFeeYear}
                        onChange={e => setFormFeeYear(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-numeric"
                      />
                    </div>
                  </div>
                )}

                {/* Type 7: পণ্য বিক্রয় বাবদ প্রাপ্তি */}
                {formIncomeType === 'product_sale_receipt' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ক্রেতার ধরন</label>
                        <select
                          value={formBuyerType}
                          onChange={e => setFormBuyerType(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="member">সমিতির সদস্য</option>
                          <option value="external_party">বাহ্যিক কাস্টমার</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ক্রেতার নাম / সদস্য *</label>
                        {formBuyerType === 'member' ? (
                          <select
                            value={formMemberId}
                            onChange={e => setFormMemberId(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          >
                            {members.map(m => (
                              <option key={m.id} value={m.id}>
                                {m.fullName} ({m.memberCode})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="ক্রেতার পূর্ণ নাম ও মোবাইল"
                            value={formBuyerName}
                            onChange={e => setFormBuyerName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">পণ্যের নাম / বিবরণ</label>
                        <input
                          type="text"
                          value={formProductName}
                          onChange={e => setFormProductName(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">পরিমাণ ও একক</label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={formProductQty}
                            onChange={e => setFormProductQty(Number(e.target.value))}
                            className="w-14 px-1 py-1.5 bg-white border border-slate-300 rounded text-xs text-center font-numeric"
                          />
                          <input
                            type="text"
                            value={formProductUnit}
                            onChange={e => setFormProductUnit(e.target.value)}
                            className="w-full px-1 py-1.5 bg-white border border-slate-300 rounded text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">একক মূল্য (টাকা)</label>
                        <input
                          type="number"
                          value={formProductUnitPrice}
                          onChange={e => {
                            const up = Number(e.target.value);
                            setFormProductUnitPrice(up);
                            setFormAmount(up * formProductQty);
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-numeric text-right"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Type 8: ভাড়া বাবদ প্রাপ্তি */}
                {formIncomeType === 'rental_receipt' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">ভাড়াকৃত সম্পদ / দোকান *</label>
                      <input
                        type="text"
                        value={formAssetName}
                        onChange={e => setFormAssetName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">ভাড়াটিয়া ধরন ও নাম *</label>
                      <input
                        type="text"
                        placeholder="ভাড়াটিয়ার নাম"
                        value={formTenantName}
                        onChange={e => setFormTenantName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">ভাড়া চুক্তিপত্র নং</label>
                      <input
                        type="text"
                        value={formLeaseAgreementNo}
                        onChange={e => setFormLeaseAgreementNo(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-numeric"
                      />
                    </div>
                  </div>
                )}

                {/* Type 10: সম্পদ বিক্রয় বাবদ প্রাপ্তি */}
                {formIncomeType === 'asset_sale_receipt' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">সম্পদের নাম *</label>
                        <input
                          type="text"
                          value={formAssetSaleName}
                          onChange={e => setFormAssetSaleName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ক্রেতার নাম *</label>
                        <input
                          type="text"
                          value={formBuyerName}
                          onChange={e => setFormBuyerName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Read-only asset accounting cards */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 font-numeric text-center">
                      <div>
                        <span className="text-[10px] text-slate-500">হিসাবি মূল্য (Book Value)</span>
                        <div className="font-bold text-slate-800 text-xs">৳ {formAssetBookValue.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">বিক্রয় মূল্য</span>
                        <div className="font-bold text-emerald-800 text-xs">৳ {formAssetSalePrice.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">হিসাবকৃত লাভ / (ক্ষতি)</span>
                        <div className="font-bold text-blue-800 text-xs">
                          ৳ {(formAssetSalePrice - formAssetSaleCost - formAssetBookValue).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Type 11: সাধারণ অনুদান/দান প্রাপ্তি */}
                {formIncomeType === 'general_donation_receipt' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">অনুদানের খাত/উদ্দেশ্য *</label>
                      <input
                        type="text"
                        value={formDonationPurposeName}
                        onChange={e => setFormDonationPurposeName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">দাতার ধরন *</label>
                      <select
                        value={formDonorType}
                        onChange={e => setFormDonorType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="member">সমিতির সদস্য</option>
                        <option value="external_party">বহিরাগত শুভাকাঙ্ক্ষী</option>
                        <option value="anonymous">বেনামী / প্রকাশে অনিচ্ছুক</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">দাতার নাম</label>
                      <input
                        type="text"
                        disabled={formDonorType === 'anonymous'}
                        placeholder={formDonorType === 'anonymous' ? 'বেনামী দাতা' : 'দাতার নাম'}
                        value={formDonorName}
                        onChange={e => setFormDonorName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: আর্থিক তথ্য ও শরিয়াহ তহবিল ম্যাপিং (Head ≠ Fund ≠ Account) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider font-heading flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  ৩. আর্থিক তথ্য ও শতভাগ শরিয়াহ তহবিল ম্যাপিং (Head ≠ Fund ≠ Account)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Head (Why) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      আয় খাত (Head — কেন টাকা আসছে) *
                    </label>
                    <select
                      value={formHeadId}
                      onChange={e => setFormHeadId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                    >
                      {heads.map(hd => (
                        <option key={hd.id} value={hd.id}>
                          {hd.name} ({hd.headCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fund (Purpose / Class) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      তহবিল (Fund — কোন শ্রেণির অর্থ) *
                      {currentTypeConfig.isFundFixed && (
                        <span className="text-[10px] text-rose-700 ml-1 font-bold">(লকড)</span>
                      )}
                    </label>
                    <select
                      disabled={currentTypeConfig.isFundFixed}
                      value={formFundId}
                      onChange={e => setFormFundId(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-xs font-medium ${
                        currentTypeConfig.isFundFixed
                          ? 'bg-amber-100/70 border-amber-300 text-amber-950 cursor-not-allowed font-bold'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      {funds.map(fnd => (
                        <option key={fnd.id} value={fnd.id}>
                          {fnd.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account (Where) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      জমা হিসাব (Account — টাকা কোথায় আছে) *
                    </label>
                    <select
                      value={formAccountId}
                      onChange={e => setFormAccountId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.accountName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amount & Bengali Words */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 mt-2 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">
                        আদায়কৃত মোট পরিমাণ (Numeric Amount) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500 font-bold">৳</span>
                        <input
                          type="number"
                          value={formAmount}
                          onChange={e => setFormAmount(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 bg-emerald-50/50 border border-emerald-300 rounded-lg text-base font-bold text-emerald-950 font-numeric"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        পেমেন্ট মাধ্যম (Payment Method) *
                      </label>
                      <select
                        value={formPaymentMethod}
                        onChange={e => setFormPaymentMethod(e.target.value as PaymentMethodType)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="cash">নগদ গ্রহণ (Cash)</option>
                        <option value="bank_transfer">ব্যাংক ট্রান্সফার / এনপিএসবি</option>
                        <option value="qr_payment">কিউআর পেমেন্ট (QR Payment)</option>
                        <option value="cheque">চেক (Cheque)</option>
                        <option value="other">অন্যান্য ডিজিটাল মাধ্যম</option>
                      </select>
                    </div>
                  </div>

                  {/* Reactive Bengali Amount in Words Display */}
                  <div className="p-3 bg-emerald-800 text-white rounded-lg flex items-center justify-between font-body text-xs shadow-xs">
                    <span className="font-semibold">কথায় (স্বয়ংক্রিয়):</span>
                    <strong className="text-sm font-heading">{amountInWords}</strong>
                  </div>
                </div>
              </div>

              {/* SECTION 4: রেফারেন্স ও বিবরণ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ভাউচার / ব্যাংক রেফারেন্স</label>
                  <input
                    type="text"
                    placeholder="যেমন: স্লিপ নং, ট্রানজ্যাকশন আইডি"
                    value={formReference}
                    onChange={e => setFormReference(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">সুনির্দিষ্ট বিবরণ / মন্তব্য</label>
                  <input
                    type="text"
                    placeholder="লেনদেনের প্রয়োজনীয় বিবরণ..."
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Workflow Actions */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between z-10 font-numeric">
              <button
                onClick={() => setIsEntryModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
              >
                বাতিল করুন
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveIncome('DRAFT')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>খসড়া সংরক্ষণ (Draft)</span>
                </button>

                <button
                  onClick={() => handleSaveIncome('SUBMITTED')}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs font-heading cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>অনুমোদনের জন্য জমা দিন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POS PRINT MODAL & RECEIPT PREVIEW */}
      {isPOSModalOpen && selectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 font-body space-y-4 max-h-[95vh] overflow-y-auto">
            {/* Header Controls */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 font-heading">
                <Printer className="w-4 h-4" />
                POS মানসম্মত রশিদ প্রিভিউ
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setIsPOSModalOpen(false)}
                  className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Standard POS Receipt Container */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3 text-xs font-mono">
              {/* POS Brand Header */}
              <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
                <div className="flex justify-center">
                  <TSSLogo variant="compact" theme="light" size="sm" showBangla={true} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm font-heading">{currentOrg.name}</h3>
                {currentOrg.address && <p className="text-[10px] text-slate-600">{currentOrg.address}</p>}
                {currentOrg.phone && <p className="text-[10px] text-slate-600">ফোন: {currentOrg.phone}</p>}
              </div>

              {/* Receipt & Trx Metadata */}
              <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-2">
                <div className="flex justify-between">
                  <span>রশিদ নং:</span>
                  <strong className="font-bold text-slate-900">{selectedEntry.receiptNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span>লেনদেন কোড:</span>
                  <span>{selectedEntry.transactionCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>তারিখ:</span>
                  <span>{selectedEntry.entryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>আয়ের ক্যাটাগরি:</span>
                  <span>{INCOME_TYPES_CONFIG[selectedEntry.incomeTypeCode as IncomeTypeCode]?.displayNameBn}</span>
                </div>
              </div>

              {/* Payer / Source */}
              <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-2">
                <div className="flex justify-between">
                  <span>প্রদানকারী:</span>
                  <strong className="text-slate-900">
                    {selectedEntry.memberDetails?.memberName || selectedEntry.saleDetails?.buyerName || selectedEntry.rentalDetails?.tenantName || selectedEntry.donationDetails?.donorName || 'সাধারণ উৎস'}
                  </strong>
                </div>
                {selectedEntry.memberDetails?.memberCode && (
                  <div className="flex justify-between">
                    <span>সদস্য কোড:</span>
                    <span>{selectedEntry.memberDetails.memberCode}</span>
                  </div>
                )}
                {selectedEntry.memberDetails?.passbookNumber && (
                  <div className="flex justify-between">
                    <span>ইস্যুকৃত পাশ বই নং:</span>
                    <span>{selectedEntry.memberDetails.passbookNumber}</span>
                  </div>
                )}
              </div>

              {/* Amount & In Words */}
              <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-200 text-center space-y-1">
                <div className="text-[11px] text-emerald-900 font-semibold">আদায়কৃত মোট অর্থ</div>
                <div className="text-xl font-bold text-emerald-950 font-numeric">
                  ৳ {selectedEntry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-emerald-800 font-body">
                  কথায়: {selectedEntry.amountInWordsBn}
                </div>
              </div>

              {/* Accounting Dimension Mapping */}
              <div className="text-[10px] text-slate-500 space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                <div>তহবিল: {fundMap.get(selectedEntry.fundId)?.name}</div>
                <div>হিসাব: {accountMap.get(selectedEntry.accountId)?.accountName}</div>
                <div>পেমেন্ট মাধ্যম: {selectedEntry.paymentMethod === 'cash' ? 'নগদ' : 'ব্যাংক / ডিজিটাল'}</div>
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 text-center text-[10px] text-slate-600 font-body">
                <div>
                  <div className="border-t border-slate-400 pt-1">প্রস্তুতকারী</div>
                  <div className="font-semibold text-slate-800">{selectedEntry.createdByName}</div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1">অনুমোদনকারী</div>
                  <div className="font-semibold text-slate-800">{selectedEntry.approvedByName || 'অপেক্ষমান'}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-[9px] text-slate-400 pt-2">
                Powered by TSS — {BRAND_CONFIG.tagline}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL & AUDIT TIMELINE */}
      {isDetailModalOpen && selectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 font-body space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-800 font-numeric">রশিদ নং: {selectedEntry.receiptNo}</span>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {INCOME_TYPES_CONFIG[selectedEntry.incomeTypeCode as IncomeTypeCode]?.displayNameBn}
                </h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
                ✕
              </button>
            </div>

            {/* Content Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-medium">লেনদেন কোড:</span>
                <p className="font-bold text-slate-800 font-mono">{selectedEntry.transactionCode}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">তারিখ:</span>
                <p className="font-bold text-slate-800 font-numeric">{selectedEntry.entryDate}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">পরিমাণ:</span>
                <p className="font-bold text-emerald-950 text-sm font-numeric">
                  ৳ {selectedEntry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">স্ট্যাটাস:</span>
                <p className="font-bold text-slate-800 font-numeric">{selectedEntry.status}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 font-medium">কথায়:</span>
                <p className="font-bold text-slate-800">{selectedEntry.amountInWordsBn}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">হিসাব (Where):</span>
                <p className="font-bold text-slate-800">{accountMap.get(selectedEntry.accountId)?.accountName}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">তহবিল (Fund):</span>
                <p className="font-bold text-slate-800">{fundMap.get(selectedEntry.fundId)?.name}</p>
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                অডিট ও অনুমোদন টাইমলাইন
              </h4>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span>খসড়া প্রস্তুতকারী:</span>
                  <strong>{selectedEntry.createdByName}</strong>
                </div>
                {selectedEntry.submittedByName && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>জমা দিয়েছেন:</span>
                    <strong>{selectedEntry.submittedByName} ({selectedEntry.submittedAt?.slice(0, 10)})</strong>
                  </div>
                )}
                {selectedEntry.approvedByName && (
                  <div className="flex items-center justify-between text-emerald-800">
                    <span>অনুমোদন করেছেন:</span>
                    <strong>{selectedEntry.approvedByName} ({selectedEntry.approvedAt?.slice(0, 10)})</strong>
                  </div>
                )}
                {selectedEntry.rejectionReason && (
                  <div className="p-2 bg-rose-50 text-rose-800 rounded border border-rose-200 text-[11px]">
                    <strong>প্রত্যাখ্যানের কারণ:</strong> {selectedEntry.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {isRejectModalOpen && selectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300 font-body space-y-4">
            <h3 className="text-base font-bold text-rose-900 font-heading flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-700" />
              আয় এন্ট্রি প্রত্যাখ্যান নিশ্চিতকরণ
            </h3>
            <p className="text-xs text-slate-600">
              রশিদ নং <strong>{selectedEntry.receiptNo}</strong> প্রত্যাখ্যান করার জন্য সুনির্দিষ্ট নীতিগত কারণ উল্লেখ করুন।
            </p>

            <textarea
              rows={3}
              placeholder="প্রত্যাখ্যানের কারণ লিখুন..."
              value={rejectionReasonInput}
              onChange={e => setRejectionReasonInput(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-rose-600"
            />

            <div className="flex items-center justify-end gap-2 font-numeric">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold font-heading"
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
