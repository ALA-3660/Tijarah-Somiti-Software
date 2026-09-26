// TSS Transfer Type Configuration Architecture (Phase 5.5)
// 5 System-Defined Transfer Types with Financial Mappings, Guidance Notes & Accounting Boundaries

import { TransferTypeCode } from '../types';

export interface TransferTypeDefinition {
  code: TransferTypeCode;
  displayNameBn: string;
  categoryLabelBn: string;
  description: string;

  // Recommended Source / Destination Account Types
  sourceAccountTypeHintBn: string;
  destinationAccountTypeHintBn: string;

  // Policy & Threshold Rules
  typicalTransferMethod: 'cash' | 'bank_transfer' | 'cheque' | 'online' | 'internal_clearing';
  requiresSupportingDocumentAbove: number; // e.g. 10000 requires deposit slip / cheque scan

  // Governance & Guidance
  guidanceNoteBn: string;
  accountingNoteBn: string;
}

export const TRANSFER_TYPES_CONFIG: Record<TransferTypeCode, TransferTypeDefinition> = {
  cash_deposit: {
    code: 'cash_deposit',
    displayNameBn: '১. নগদ জমা (Cash Deposit)',
    categoryLabelBn: 'নগদ জমা',
    description: 'প্রধান ক্যাশ বা পেটি ক্যাশ থেকে উদ্বৃত্ত অর্থ ব্যাংকের নির্দিষ্ট চলতি বা সঞ্চয়ী হিসাবে জমা করণ।',
    sourceAccountTypeHintBn: 'ক্যাশ অ্যাকাউন্ট (Main Cash / Petty Cash)',
    destinationAccountTypeHintBn: 'ব্যাংক অ্যাকাউন্ট (Bank Current / Savings)',
    typicalTransferMethod: 'cash',
    requiresSupportingDocumentAbove: 10000,
    guidanceNoteBn: 'ব্যাংক জমা রশিদ (Bank Deposit Slip) স্ক্যান বা কাউন্টারফয়েল নম্বর সংরক্ষণ করুন।',
    accountingNoteBn: 'এটি আয় বা রাজস্ব নয়। কেবল নগদ অর্থ ব্যাংক হিসাবে জমা হওয়ায় ক্যাশ ক্রেডিট ও ব্যাংক ডেবিট হবে।'
  },

  cash_withdrawal: {
    code: 'cash_withdrawal',
    displayNameBn: '২. নগদ উত্তোলন (Cash Withdrawal)',
    categoryLabelBn: 'নগদ উত্তোলন',
    description: 'সংগঠনের দৈনন্দিন লেনদেন পরিচালনার সুবিধার্থে ব্যাংক হিসাব থেকে চেক বা স্লিপ মারফত নগদ উত্তোলন।',
    sourceAccountTypeHintBn: 'ব্যাংক অ্যাকাউন্ট (Bank Current / Savings)',
    destinationAccountTypeHintBn: 'ক্যাশ অ্যাকাউন্ট (Main Cash / Petty Cash)',
    typicalTransferMethod: 'cheque',
    requiresSupportingDocumentAbove: 5000,
    guidanceNoteBn: 'চেকের পাতা নম্বর (Cheque Leaf No) এবং অনুমোদিত উত্তোলক ব্যক্তির তথ্য লিপিবদ্ধ করুন।',
    accountingNoteBn: 'এটি কোনো ব্যয় বা খরচ নয়। কেবল ব্যাংকের তারল্য প্রধান ক্যাশ বাক্সে স্থানান্তর।'
  },

  bank_to_bank: {
    code: 'bank_to_bank',
    displayNameBn: '৩. ব্যাংক টু ব্যাংক ফান্ড স্থানান্তর (Bank-to-Bank Transfer)',
    categoryLabelBn: 'ব্যাংক টু ব্যাংক',
    description: 'সংগঠনের এক ব্যাংক হিসাব থেকে অন্য ব্যাংক হিসাবে তহবিল বা তারল্য ব্যবস্থাপনা স্থানান্তর (BEFTN / RTGS / NPSB)।',
    sourceAccountTypeHintBn: 'প্রেরক ব্যাংক অ্যাকাউন্ট',
    destinationAccountTypeHintBn: 'প্রাপক ব্যাংক অ্যাকাউন্ট',
    typicalTransferMethod: 'bank_transfer',
    requiresSupportingDocumentAbove: 20000,
    guidanceNoteBn: 'অনলাইন ব্যাংক রেফারেন্স নম্বর বা EFT/RTGS ট্রানজাকশন আইডি সংরক্ষণ আবশ্যক।',
    accountingNoteBn: 'একই তহবিলের অধীনে একাধিক ব্যাংকের তারল্য সমতা রক্ষায় এটি ব্যবহৃত হয়।'
  },

  account_to_account: {
    code: 'account_to_account',
    displayNameBn: '৪. সাধারণ হিসাব স্থানান্তর (Account-to-Account Transfer)',
    categoryLabelBn: 'সাধারণ হিসাব স্থানান্তর',
    description: 'সংগঠনের যেকোনো দুটি সক্রিয় হিসাবের (যেমন মোবাইল ফিন্যান্সিয়াল সার্ভিস বিকাশ/নগদ ও ক্যাশ) মধ্যে সাধারণ তারল্য আদান-প্রদান।',
    sourceAccountTypeHintBn: 'যেকোনো অনুমোদিত সক্রিয় হিসাব',
    destinationAccountTypeHintBn: 'যেকোনো ভিন্ন অনুমোদিত সক্রিয় হিসাব',
    typicalTransferMethod: 'internal_clearing',
    requiresSupportingDocumentAbove: 15000,
    guidanceNoteBn: 'উৎস হিসাব ও গন্তব্য হিসাব অবশ্যই ভিন্ন হতে হবে (Source !== Destination)।',
    accountingNoteBn: 'উভয় হিসাব একই অর্গানাইজেশনের অন্তর্ভুক্ত হতে হবে।'
  },

  internal_fund_preserving: {
    code: 'internal_fund_preserving',
    displayNameBn: '৫. অভ্যন্তরীণ তহবিল-সংরক্ষিত স্থানান্তর (Internal Fund-Preserving Transfer)',
    categoryLabelBn: 'তহবিল-সংরক্ষিত স্থানান্তর',
    description: 'সংগঠনের নির্দিষ্ট ফান্ড কাঠামোর অভ্যন্তরীণ হিসাবসমূহের মধ্যে তারল্য সমন্বয় যা ফান্ড সীমা অক্ষুণ্ণ রাখে।',
    sourceAccountTypeHintBn: 'তহবিলভুক্ত উৎস হিসাব',
    destinationAccountTypeHintBn: 'তহবিলভুক্ত গন্তব্য হিসাব',
    typicalTransferMethod: 'internal_clearing',
    requiresSupportingDocumentAbove: 25000,
    guidanceNoteBn: 'এই ট্রান্সফারে ফান্ডের প্রকৃতি অপরিবর্তিত থাকে এবং কোনো তহবিল পরিবর্তন ঘটে না।',
    accountingNoteBn: 'তহবিলের ব্যালেন্স অপরিবর্তিত রেখে শুধুমাত্র অর্থের প্রাতিষ্ঠানিক অবস্থান সমন্বিত হয়।'
  }
};
