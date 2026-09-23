// TSS Income Type Configuration Architecture (Phase 5.3)
// 12 Authoritative Income Types with Financial Mappings, Fund Rules & Settlement Metadata

export type IncomeTypeCode =
  | 'member_monthly_fee'
  | 'member_annual_fee'
  | 'member_admission_passbook'
  | 'annual_admin_fee'
  | 'member_onetime_fee'
  | 'member_other_fee'
  | 'product_sale_receipt'
  | 'rental_receipt'
  | 'other_business_income'
  | 'asset_sale_receipt'
  | 'general_donation_receipt'
  | 'other_general_receipt';

export interface IncomeTypeDefinition {
  code: IncomeTypeCode;
  displayNameBn: string;
  category: 'member' | 'business' | 'general';
  categoryLabelBn: string;
  description: string;
  
  // Fund Governance
  isFundFixed: boolean;
  fixedFundId?: string;
  fixedFundNameBn?: string;
  
  // Refundability, Member Settlement & Capital Policy
  isRefundable: boolean;
  isMemberSettlementEligible: boolean;
  isCapital: boolean;
  
  // Field Requirement Triggers
  sourceType: 'member' | 'buyer' | 'tenant' | 'donor' | 'business_source' | 'general_source';
  requiresMember: boolean;
  allowAdvanceArrears: boolean;
  supportsInstallments: boolean;
  
  // Default Suggested Head Code (Must be INC-*)
  defaultHeadCode: string;
  defaultHeadNameBn: string;
  
  // Warnings / Guidance Notes
  guidanceNoteBn?: string;
  warningNoteBn?: string;
}

export const ADMIN_EXPENSE_FUND_ID = 'fnd-demo-admin';
export const ADMIN_EXPENSE_FUND_NAME_BN = 'প্রশাসনিক খরচের তহবিল';

export const INCOME_TYPES_CONFIG: Record<IncomeTypeCode, IncomeTypeDefinition> = {
  member_monthly_fee: {
    code: 'member_monthly_fee',
    displayNameBn: '১. সদস্য মাসিক ফি',
    category: 'member',
    categoryLabelBn: 'সদস্যভিত্তিক আয়',
    description: 'সদস্যদের নিয়মিত মাসিক সঞ্চয় ফি আদায়।',
    isFundFixed: false,
    isRefundable: true,
    isMemberSettlementEligible: true,
    isCapital: false,
    sourceType: 'member',
    requiresMember: true,
    allowAdvanceArrears: true,
    supportsInstallments: false,
    defaultHeadCode: 'INC-001',
    defaultHeadNameBn: 'সদস্য মাসিক ফি',
    guidanceNoteBn: 'মাসিক ফি সিস্টেমে পূর্বনির্ধারিত। বকেয়া ও অগ্রিম স্বয়ংক্রিয়ভাবে ট্র্যাক করা হবে।'
  },

  member_annual_fee: {
    code: 'member_annual_fee',
    displayNameBn: '২. সদস্য বাৎসরিক ফি',
    category: 'member',
    categoryLabelBn: 'সদস্যভিত্তিক আয়',
    description: 'সদস্যদের সাধারণ বাৎসরিক কন্ট্রিবিউশন ফি (রিফান্ডযোগ্য ও সেটেলমেন্টযোগ্য)।',
    isFundFixed: false,
    isRefundable: true,
    isMemberSettlementEligible: true,
    isCapital: false,
    sourceType: 'member',
    requiresMember: true,
    allowAdvanceArrears: true,
    supportsInstallments: false,
    defaultHeadCode: 'INC-001',
    defaultHeadNameBn: 'সদস্য বাৎসরিক ফি',
    guidanceNoteBn: 'এখানে "ফি-এর বছর" ব্যবহার করুন ("অর্থ বছর" নয়)।'
  },

  member_admission_passbook: {
    code: 'member_admission_passbook',
    displayNameBn: '৩. সদস্য ভর্তি ফি + পাশ বই',
    category: 'member',
    categoryLabelBn: 'সদস্যভিত্তিক আয়',
    description: 'নতুন সদস্য অন্তর্ভুক্তি ফি ও পাশ বই বিক্রয় (অফেরতযোগ্য)।',
    isFundFixed: true,
    fixedFundId: ADMIN_EXPENSE_FUND_ID,
    fixedFundNameBn: ADMIN_EXPENSE_FUND_NAME_BN,
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    sourceType: 'member',
    requiresMember: true,
    allowAdvanceArrears: false,
    supportsInstallments: false,
    defaultHeadCode: 'INC-001',
    defaultHeadNameBn: 'ভর্তি ও পাশ বই ফি',
    guidanceNoteBn: 'ভর্তি ফি ও পাশ বই বিক্রয় উভয়ই অফেরতযোগ্য এবং সরাসরি "প্রশাসনিক খরচের তহবিল"-এ জমা হবে।'
  },

  annual_admin_fee: {
    code: 'annual_admin_fee',
    displayNameBn: '৪. বাৎসরিক প্রশাসনিক খরচের ফি',
    category: 'member',
    categoryLabelBn: 'সদস্যভিত্তিক আয়',
    description: 'সংগঠন পরিচালনার প্রশাসনিক খরচের বাৎসরিক ফি (অফেরতযোগ্য)।',
    isFundFixed: true,
    fixedFundId: ADMIN_EXPENSE_FUND_ID,
    fixedFundNameBn: ADMIN_EXPENSE_FUND_NAME_BN,
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    sourceType: 'member',
    requiresMember: true,
    allowAdvanceArrears: false,
    supportsInstallments: false,
    defaultHeadCode: 'INC-001',
    defaultHeadNameBn: 'প্রশাসনিক খরচ অনুদান/ফি',
    guidanceNoteBn: 'তহবিল নির্ধারিত: "প্রশাসনিক খরচের তহবিল"। এটি কোনো মূলধনী শেয়ার বা বিনিয়োগ নয়।',
    warningNoteBn: 'একই সদস্যের জন্য একই বছরের প্রশাসনিক ফি পুনরায় এন্ট্রি করা যাবে না।'
  },

  member_onetime_fee: {
    code: 'member_onetime_fee',
    displayNameBn: '৫. সদস্য এককালীন ফি',
    category: 'member',
    categoryLabelBn: 'সদস্যভিত্তিক আয়',
    description: 'বিশেষ উদ্যোগ বা সাধারণ উদ্দেশ্যে সদস্যের এককালীন কন্ট্রিবিউশন।',
    isFundFixed: false,
    isRefundable: true,
    isMemberSettlementEligible: true,
    isCapital: false,
    sourceType: 'member',
    requiresMember: true,
    allowAdvanceArrears: false,
    supportsInstallments: false,
    defaultHeadCode: 'INC-001',
    defaultHeadNameBn: 'এককালীন সদস্য কন্ট্রিবিউশন',
    guidanceNoteBn: 'প্রতিটি ইভেন্ট স্বাধীনভাবে ট্র্যাক করা হবে। কোনো "ফি-এর বছর" থাকবে না।'
  },

  member_other_fee: {
    code: 'member_other_fee',
    displayNameBn: '৬. সদস্য অন্যান্য ফি',
    category: 'member',
    categoryLabelBn: 'সদস্যভিত্তিক আয়',
    description: 'সদস্যের অন্যান্য বিবিধ অনুমোদিত ফি বা ডিপোজিট।',
    isFundFixed: false,
    isRefundable: true,
    isMemberSettlementEligible: true,
    isCapital: false,
    sourceType: 'member',
    requiresMember: true,
    allowAdvanceArrears: false,
    supportsInstallments: false,
    defaultHeadCode: 'INC-001',
    defaultHeadNameBn: 'সদস্য বিবিধ ফি',
    guidanceNoteBn: 'এটি শেয়ার ক্রয়, প্রকল্প বিনিয়োগ বা কল্যাণ তহবিলের জন্য ব্যবহার করবেন না।'
  },

  product_sale_receipt: {
    code: 'product_sale_receipt',
    displayNameBn: '৭. পণ্য বিক্রয় বাবদ প্রাপ্তি',
    category: 'business',
    categoryLabelBn: 'হালাল ব্যবসা ও বিক্রয়',
    description: 'সমিতির হালাল পণ্য বিক্রয় বাবদ নগদ বা কিস্তির প্রাপ্তি।',
    isFundFixed: false,
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    sourceType: 'buyer',
    requiresMember: false,
    allowAdvanceArrears: false,
    supportsInstallments: true,
    defaultHeadCode: 'INC-002',
    defaultHeadNameBn: 'পণ্য বিক্রয় রাজস্ব',
    guidanceNoteBn: 'পণ্য বিক্রয়ের মোট অর্থ ও কিস্তির পরিমাণ বিক্রয় ম্যানেজমেন্টের সাথে লিঙ্কযুক্ত।'
  },

  rental_receipt: {
    code: 'rental_receipt',
    displayNameBn: '৮. ভাড়া বাবদ প্রাপ্তি',
    category: 'business',
    categoryLabelBn: 'হালাল ব্যবসা ও বিক্রয়',
    description: 'সমিতির দোকান, ঘর বা জমি ভাড়া বাবদ প্রাপ্তি।',
    isFundFixed: false,
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    sourceType: 'tenant',
    requiresMember: false,
    allowAdvanceArrears: true,
    supportsInstallments: true,
    defaultHeadCode: 'INC-002',
    defaultHeadNameBn: 'দোকান/জমি ভাড়া আয়',
    guidanceNoteBn: 'ভাড়া চুক্তি, ভাড়ার সময়কাল এবং বকেয়া/অগ্রিম স্বয়ংক্রিয়ভাবে ট্র্যাক করা হবে।'
  },

  other_business_income: {
    code: 'other_business_income',
    displayNameBn: '৯. অন্যান্য ব্যবসায়িক আয়',
    category: 'business',
    categoryLabelBn: 'হালাল ব্যবসা ও বিক্রয়',
    description: 'নির্দিষ্ট কোনো dedicated Income Type বা Business Module-এর আওতায় না থাকা বৈধ ব্যবসায়িক আয়।',
    isFundFixed: false,
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    sourceType: 'business_source',
    requiresMember: false,
    allowAdvanceArrears: false,
    supportsInstallments: false,
    defaultHeadCode: 'INC-002',
    defaultHeadNameBn: 'অন্যান্য ব্যবসায়িক আয়',
    guidanceNoteBn: 'ঋণ, ফান্ড ট্রান্সফার বা জামানতের টাকা এখানে ব্যবসায়িক আয় হিসেবে দেখানো যাবে না।'
  },

  asset_sale_receipt: {
    code: 'asset_sale_receipt',
    displayNameBn: '১০. সম্পদ বিক্রয় বাবদ প্রাপ্তি',
    category: 'business',
    categoryLabelBn: 'হালাল ব্যবসা ও বিক্রয়',
    description: 'স্থায়ী সম্পদ (জমি, ফার্নিচার, গাড়ি) বিক্রয় বাবদ অর্থ প্রাপ্তি।',
    isFundFixed: false,
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    sourceType: 'buyer',
    requiresMember: false,
    allowAdvanceArrears: false,
    supportsInstallments: true,
    defaultHeadCode: 'INC-003',
    defaultHeadNameBn: 'স্থায়ী সম্পদ বিক্রয় প্রাপ্তি',
    guidanceNoteBn: 'বিক্রয় প্রাপ্তি হতে সম্পদমূল্য বাদ দিয়ে লাভ/ক্ষতি হিসাব করা হবে; আলাদা করে লাভের কোনো আয় এন্ট্রি তৈরি হবে না।'
  },

  general_donation_receipt: {
    code: 'general_donation_receipt',
    displayNameBn: '১১. সাধারণ অনুদান/দান প্রাপ্তি',
    category: 'general',
    categoryLabelBn: 'অনুদান ও অন্যান্য প্রাপ্তি',
    description: 'মাহফিল, মসজিদ বা সমিতির সাধারণ উন্নয়নমূলক অনুদান।',
    isFundFixed: false,
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    sourceType: 'donor',
    requiresMember: false,
    allowAdvanceArrears: false,
    supportsInstallments: false,
    defaultHeadCode: 'INC-003',
    defaultHeadNameBn: 'সাধারণ অনুদান ও এয়ানত',
    guidanceNoteBn: 'সদস্যের অনুদানও এখানে অনুদান হিসেবেই থাকবে (সদস্য ফিতে রূপান্তর হবে না)।'
  },

  other_general_receipt: {
    code: 'other_general_receipt',
    displayNameBn: '১২. অন্যান্য সাধারণ প্রাপ্তি',
    category: 'general',
    categoryLabelBn: 'অনুদান ও অন্যান্য প্রাপ্তি',
    description: 'অন্য কোনো ক্যাটাগরিতে না পড়া সাধারণ বিবিধ প্রাপ্তি।',
    isFundFixed: false,
    isRefundable: false,
    isMemberSettlementEligible: false,
    isCapital: false,
    sourceType: 'general_source',
    requiresMember: false,
    allowAdvanceArrears: false,
    supportsInstallments: false,
    defaultHeadCode: 'INC-003',
    defaultHeadNameBn: 'বিবিধ সাধারণ প্রাপ্তি',
    warningNoteBn: 'এটি শুধুমাত্র এমন সাধারণ প্রাপ্তির জন্য ব্যবহার করুন যার জন্য আলাদা Income Type বা নির্দিষ্ট Module প্রযোজ্য নয়।'
  }
};

export const ALL_INCOME_TYPE_CODES = Object.keys(INCOME_TYPES_CONFIG) as IncomeTypeCode[];
