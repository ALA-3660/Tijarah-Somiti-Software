// TSS Expense Type Configuration Architecture (Phase 5.4)
// 7 Locked General Expense Types with Financial Mappings, Fund Rules & Threshold Policy

import { ExpenseTypeCode } from '../types';

export interface ExpenseTypeDefinition {
  code: ExpenseTypeCode;
  displayNameBn: string;
  categoryLabelBn: string;
  description: string;
  
  // Default Suggested Head Code (Must be EXP-*)
  defaultHeadCode: string;
  defaultHeadNameBn: string;

  // Fund Governance
  isFundFixed: boolean;
  fixedFundId?: string;
  fixedFundNameBn?: string;
  
  // Policy & Threshold Rules
  requiresSupportingDocumentAbove: number; // e.g., 5000 means receipt mandatory if amount >= 5000
  typicalPayeePartyType: 'member' | 'external_party' | 'organization' | 'other_approved';
  
  // Warnings / Guidance Notes
  guidanceNoteBn: string;
  warningNoteBn?: string;
}

export const ADMIN_EXPENSE_FUND_ID = 'fnd-demo-admin';
export const ADMIN_EXPENSE_FUND_NAME_BN = 'প্রশাসনিক খরচের তহবিল';

export const EXPENSE_TYPES_CONFIG: Record<ExpenseTypeCode, ExpenseTypeDefinition> = {
  administrative_expense: {
    code: 'administrative_expense',
    displayNameBn: '১. প্রশাসনিক ব্যয়',
    categoryLabelBn: 'প্রশাসনিক ও পরিচালন',
    description: 'সংগঠন পরিচালনার প্রাতিষ্ঠানিক প্রশাসনিক খরচ (কমিটি মিটিং, অফিস প্রশাসন, বাৎসরিক অডিট ও গভর্ন্যান্স খরচ)।',
    defaultHeadCode: 'EXP-001',
    defaultHeadNameBn: 'অফিস প্রশাসন ও প্রশাসনিক খরচ',
    isFundFixed: true,
    fixedFundId: ADMIN_EXPENSE_FUND_ID,
    fixedFundNameBn: ADMIN_EXPENSE_FUND_NAME_BN,
    requiresSupportingDocumentAbove: 3000,
    typicalPayeePartyType: 'external_party',
    guidanceNoteBn: 'এই ব্যয়ের অর্থ "প্রশাসনিক খরচের তহবিল" হতে ব্যয়িত হবে। এটি কোনো মূলধনী বা বিনিয়োগ খরচ নয়।',
    warningNoteBn: 'প্রশাসনিক ফি সংগ্রহ ও প্রশাসনিক ব্যয়ের উদ্বৃত্তকে কখনোই "প্রশাসনিক মুনাফা" হিসেবে গণ্য করা যাবে না।'
  },

  general_operational_expense: {
    code: 'general_operational_expense',
    displayNameBn: '২. সাধারণ পরিচালন ব্যয়',
    categoryLabelBn: 'দৈনন্দিন পরিচালন',
    description: 'দৈনন্দিন অফিস পরিচালনা, স্টেশনারি, ইউটিলিটি (বিদ্যুৎ/পানি/ইন্টারনেট), সাধারণ প্রাতিষ্ঠানিক যাতায়াত ও আপ্যায়ন।',
    defaultHeadCode: 'EXP-002',
    defaultHeadNameBn: 'দৈনন্দিন পরিচালন ও স্টেশনারি',
    isFundFixed: false,
    requiresSupportingDocumentAbove: 2000,
    typicalPayeePartyType: 'external_party',
    guidanceNoteBn: 'সাধারণ অফিস যাতায়াত/কনভেন্স এখানে অন্তর্ভুক্ত হবে। (ব্যবসা বা মাহফিলের পরিবহন সংশ্লিষ্ট ডোমেইনে থাকবে)।'
  },

  maintenance_repair_expense: {
    code: 'maintenance_repair_expense',
    displayNameBn: '৩. রক্ষণাবেক্ষণ ও মেরামত ব্যয়',
    categoryLabelBn: 'সম্পদ ও চত্বর রক্ষণাবেক্ষণ',
    description: 'কার্যালয়, আসবাবপত্র, কম্পিউটার/আইটি হার্ডওয়্যার এবং বৈদ্যুতিক সরঞ্জামের নিয়মিত সার্ভিসিং ও মেরামত।',
    defaultHeadCode: 'EXP-003',
    defaultHeadNameBn: 'রক্ষণাবেক্ষণ ও সরঞ্জাম মেরামত',
    isFundFixed: false,
    requiresSupportingDocumentAbove: 2500,
    typicalPayeePartyType: 'external_party',
    guidanceNoteBn: 'নতুন স্থায়ী সম্পদ ক্রয় এখানে আসবে না; শুধুমাত্র বিদ্যমান অফিস সম্পদের মেরামত ও সার্ভিসিং বিল।'
  },

  professional_service_expense: {
    code: 'professional_service_expense',
    displayNameBn: '৪. পেশাগত ও সেবা ব্যয়',
    categoryLabelBn: 'পেশাগত সেবা ও পরামর্শ',
    description: 'আইনি পরামর্শক ফি, বহিঃহিসাব নিরীক্ষক সম্মানী, সফটওয়্যার ক্লাউড সাবস্ক্রিপশন ও বিশেষ কারিগরি সেবা বিল।',
    defaultHeadCode: 'EXP-004',
    defaultHeadNameBn: 'পেশাগত ফি ও আইটি সার্ভিস',
    isFundFixed: false,
    requiresSupportingDocumentAbove: 5000,
    typicalPayeePartyType: 'external_party',
    guidanceNoteBn: 'প্রদানকারীর ইনভয়েস/বিল এবং সেবামূলক চুক্তির রেফারেন্স নম্বর সংযুক্ত করা আবশ্যক।'
  },

  publicity_publication_communication_expense: {
    code: 'publicity_publication_communication_expense',
    displayNameBn: '৫. প্রচার, প্রকাশনা ও যোগাযোগ ব্যয়',
    categoryLabelBn: 'প্রচার ও প্রকাশনা',
    description: 'বার্ষিক প্রতিবেদন ও পাশ বই মুদ্রণ, লিফলেট/ব্রোশার, প্রাতিষ্ঠানিক ব্যানার এবং বাল্ক এসএমএস/টেলিফোন ব্যয়।',
    defaultHeadCode: 'EXP-005',
    defaultHeadNameBn: 'প্রচার, প্রিন্টিং ও প্রকাশনা',
    isFundFixed: false,
    requiresSupportingDocumentAbove: 4000,
    typicalPayeePartyType: 'external_party',
    guidanceNoteBn: 'প্রিন্টিং প্রেসের মেমো এবং অনুমোদিত প্রকাশনা কপি রেফারেন্স হিসেবে উল্লেখ করুন।'
  },

  social_institutional_activity_expense: {
    code: 'social_institutional_activity_expense',
    displayNameBn: '৬. সামাজিক ও প্রাতিষ্ঠানিক কার্যক্রম ব্যয়',
    categoryLabelBn: 'প্রাতিষ্ঠানিক কার্যক্রম',
    description: 'সমিতির সাধারণ সভা, প্রাতিষ্ঠানিক সৌজন্য উপহার, জাতীয় দিবস ও সাধারণ সামাজিক সভার আয়োজন ব্যয়।',
    defaultHeadCode: 'EXP-006',
    defaultHeadNameBn: 'সামাজিক ও প্রাতিষ্ঠানিক কার্যক্রম',
    isFundFixed: false,
    requiresSupportingDocumentAbove: 3000,
    typicalPayeePartyType: 'organization',
    guidanceNoteBn: 'বিঃদ্রঃ নির্দিষ্ট জাকাত বা কল্যাণ বিতরণ এবং ইসলামিক মাহফিলের খরচ এখানে আসবে না (সেগুলো সংশ্লিষ্ট ডোমেইনের আওতাভুক্ত)।'
  },

  other_general_expense: {
    code: 'other_general_expense',
    displayNameBn: '৭. অন্যান্য সাধারণ ব্যয়',
    categoryLabelBn: 'বিবিধ সাধারণ ব্যয়',
    description: 'অন্য কোনো সুনির্দিষ্ট ক্যাটাগরিতে না পড়া আনক্ল্যাসিফায়েড সাধারণ বৈধ প্রাতিষ্ঠানিক খরচ।',
    defaultHeadCode: 'EXP-007',
    defaultHeadNameBn: 'অন্যান্য সাধারণ প্রাতিষ্ঠানিক ব্যয়',
    isFundFixed: false,
    requiresSupportingDocumentAbove: 1500,
    typicalPayeePartyType: 'external_party',
    guidanceNoteBn: 'এটি শুধুমাত্র এমন বৈধ সাধারণ খরচের জন্য ব্যবহার করুন যার জন্য আলাদা বিশেষায়িত ডোমেইন প্রযোজ্য নয়।',
    warningNoteBn: 'পণ্য ক্রয়, ঋণ বা বিনিয়োগের অর্থ এখানে ব্যয় হিসেবে দেখানো সম্পূর্ণ নিষিদ্ধ।'
  }
};

export const ALL_EXPENSE_TYPE_CODES = Object.keys(EXPENSE_TYPES_CONFIG) as ExpenseTypeCode[];
