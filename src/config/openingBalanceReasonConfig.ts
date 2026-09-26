// TSS Opening Balance Reason Configuration (Phase 5.6)
// 5 Locked Opening Balance Reason Codes with Bengali Descriptions

import { OpeningBalanceReasonCode } from '../types';

export interface OpeningBalanceReasonDefinition {
  code: OpeningBalanceReasonCode;
  labelBn: string;
  descriptionBn: string;
  isDetailsMandatory: boolean;
}

export const OPENING_BALANCE_REASONS: Record<OpeningBalanceReasonCode, OpeningBalanceReasonDefinition> = {
  system_migration: {
    code: 'system_migration',
    labelBn: 'নতুন সফটওয়্যারে হিসাব স্থানান্তর',
    descriptionBn: 'পূর্বে ব্যবহৃত ডিজিটাল বা এক্সেল ব্যবস্থাপনা থেকে তিজারাহ সফটওয়্যারে উদ্বৃত্ত অর্থ স্থানান্তর।',
    isDetailsMandatory: false
  },
  previous_cashbook: {
    code: 'previous_cashbook',
    labelBn: 'পূর্ববর্তী হিসাব খাতা থেকে স্থানান্তর',
    descriptionBn: 'হাতে লেখা পূর্ববর্তী ক্যাশ বই ও রেজিস্টার খাতার সমাপনী স্থিতি হতে প্রারম্ভিক জের গ্রহণ।',
    isDetailsMandatory: false
  },
  bank_statement_alignment: {
    code: 'bank_statement_alignment',
    labelBn: 'ব্যাংক স্টেটমেন্ট অনুযায়ী',
    descriptionBn: 'ব্যাংক কর্তৃক প্রদত্ত অফিসিয়াল স্টেটমেন্টের নির্দিষ্ট তারিখের সমাপনী ব্যালেন্স জের হিসেবে গ্রহণ।',
    isDetailsMandatory: false
  },
  committee_approved: {
    code: 'committee_approved',
    labelBn: 'কমিটি অনুমোদিত প্রারম্ভিক হিসাব',
    descriptionBn: 'সমিতির কার্যনির্বাহী বা সাধারণ পরিষদ কমিটি রেজুলেশন দ্বারা অনুমোদিত প্রারম্ভিক স্থিতি।',
    isDetailsMandatory: false
  },
  other: {
    code: 'other',
    labelBn: 'অন্যান্য',
    descriptionBn: 'অন্য কোনো যুক্তিসংগত কারণ (সুনির্দিষ্ট কারণ ও বিবরণ বিস্তারিত লেখা বাধ্যতামূলক)।',
    isDetailsMandatory: true
  }
};
