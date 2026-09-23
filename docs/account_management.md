# Account Management Foundation (Phase 5.1)
## তিজারাহ সমিতি সফটওয়্যার (Tijarah Samity Software — TSS)

---

## ১. ওভারভিউ ও মূল দর্শন (Overview & Core Philosophy)

**তিজারাহ সমিতি সফটওয়্যার (TSS)**-এ ইসলামি শরিয়াহ ও আর্থিক ব্যবস্থাপনার ৩টি স্পষ্ট ও অবিভাজ্য ডাইমেনশন রয়েছে:

1. **Head (খাত - কেন):** টাকা কেন এসেছে বা কেন ব্যয় হচ্ছে (Purpose / Classification of Income & Expense)
2. **Fund (তহবিল - উদ্দেশ্য/শ্রেণি):** কোন নির্দিষ্ট উদ্দেশ্য বা মূলধনী শ্রেণির অর্থ (Earmarked Capital / Purpose Pool)
3. **Account (হিসাব - কোথায়):** অর্থ বাস্তবিকভাবে **কোন আর্থিক অবস্থানে সংরক্ষিত আছে** (Financial Holding Location / Repository)

**Account Management Foundation (Phase 5.1)** মডিউলটি সংগঠনের অর্থ জমা রাখার বাস্তবিক অবস্থানসমূহ (যেমন: প্রধান ক্যাশ বাক্স, পেটি ক্যাশ, প্রাতিষ্ঠানিক ব্যাংক চলতি/সঞ্চয়ী হিসাব) সংরক্ষণ ও ব্যবস্থাপনার মাস্টার ডাটা প্ল্যাটফর্ম প্রদান করে।

---

## ২. স্কোপ ডিসিপ্লিন ও বাউন্ডারি (Strict Scope Boundaries)

### Phase 5.1-এ অন্তর্ভুক্ত:
- `Account` মাস্টার ডেটা এনটিটি (Money Holding Location)
- Account Types: `cash` (নগদ/ক্যাশ বাক্স) এবং `bank` (ব্যাংক অ্যাকাউন্ট)
- **Authoritative Lifecycle: `Active ↔ Inactive → Archived`**
- অ্যাকাউন্ট তৈরি, সম্পাদনা, স্ট্যাটাস পরিবর্তন
- সংবেদনশীল ডেটা মাস্কিং (Sensitive Account Number Masking: e.g. `******4589`)
- অনুমতি সাপেক্ষে সংবেদনশীল তথ্য উন্মোচন ও অডিট ট্রেইল (`ACCOUNT_SENSITIVE_REVEALED`)
- ফান্ড অ্যাসোসিয়েশন ভিত্তি (Many-to-Many Fund Association Foundation: `associatedFundIds`)
- মাস্টার ডাটা গভর্ন্যান্স ও অডিট লগ ইন্টিগ্রেশন (Phase 4.5 Framework Reuse)
- মাল্টি-টেন্যান্ট আইসোলেশন (`organizationId`)
- জিরো হার্ড ডিলিট সুরক্ষা (Zero Hard Delete Protection)

### ❌ Phase 5.1-এ সম্পূর্ণ বহির্ভূত ও নিষিদ্ধ (Strictly Out of Scope):
- ❌ Ledger / জাবেদা ও খতিয়ান (Phase 5.7+)
- ❌ Balance Engine / হিসাবের উদ্বৃত্ত বা ব্যালেন্স গণনা
- ❌ Income / Expense Financial Transactions
- ❌ Transfer / Voucher / Payment / Receipt
- ❌ Cash Book / Bank Book
- ❌ Automated Financial Posting
- ❌ Profit / Loss Engine / Interest Calculation

---

## ৩. ডোমেইন মডেল ও ডেটা স্ট্রাকচার (Domain Model)

```typescript
export type AccountType = 'cash' | 'bank' | 'mobile_financial' | 'custom';
export type AccountStatus = 'active' | 'inactive' | 'archived';

export interface Account {
  id: string;
  organizationId: string;
  accountCode: string;            // হিসাব কোড (যেমন: ACC-001, ACC-002) - অপরিবর্তনীয়
  accountName: string;            // হিসাবের নাম (যেমন: প্রধান ক্যাশ, ইসলামী ব্যাংক সঞ্চয়ী হিসাব)
  accountType: AccountType;       // 'cash' | 'bank'
  accountSubtype?: string;        // 'main_cash', 'petty_cash', 'savings', 'current'
  description?: string;           // বিবরণ
  
  // ব্যাংক সম্পর্কিত ফিল্ড (শুধুমাত্র bank অ্যাকাউন্টের জন্য)
  accountHolderName?: string;     // প্রাতিষ্ঠানিক হিসাবধারীর নাম
  bankName?: string;              // ব্যাংকের নাম (যেমন: ইসলামী ব্যাংক বাংলাদেশ পিএলসি)
  branchName?: string;            // শাখার নাম (যেমন: কক্সবাজার প্রধান শাখা)
  accountNumberMasked?: string;   // সংবেদনশীল মাস্কড নম্বর (যেমন: ******4589)
  routingNumberMasked?: string;   // মাস্কড রাউটিং নম্বর (যেমন: ***123)
  
  // ফান্ড সম্পর্ক ভিত্তি (Many-to-Many Foundation - Where vs Purpose)
  associatedFundIds?: string[];   // এই হিসাবে অনুমোদিত ফান্ডের আইডি তালিকা

  // স্ট্রাকচারাল মেটাডেটা (No calculations performed in Phase 5.1)
  openingBalanceSupported: boolean;
  isSystemDefined: boolean;
  status: AccountStatus;          // 'active' | 'inactive' | 'archived'
  sortOrder: number;
  
  // অডিট ট্রেইল ও টাইমস্ট্যাম্প
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
```

---

## ৪. লাইফসাইকেল ট্রানজিশন ও রুলস (Account Lifecycle)

```
[ Active ] <====================> [ Inactive ]
    |                                  |
    +------------> [ Archived ] <------+ (Terminal State)
```

1. **Active ↔ Inactive (Operational Status):**
   - যে কোনো সময় অ্যাকাউন্ট সক্রিয় বা নিষ্ক্রিয় করা যায়।
   - ট্রানজিশনের জন্য নীতিগত কারণ (`reason`) প্রদান বাধ্যতামূলক।
   - স্ট্যাটাস পরিবর্তনের সাথে সাথে গভর্ন্যান্স অডিট হিস্ট্রিতে `ACTIVATE` বা `DEACTIVATE` রেকর্ড যুক্ত হয়।

2. **Inactive/Active → Archived (Terminal State):**
   - শুধুমাত্র `Admin` রোলের ব্যবহারকারী হিসাব আর্কাইভ করতে পারেন।
   - আর্কাইভকৃত হিসাব সম্পূর্ণ **রিড-অনলি ও টার্মিনাল** স্টেটে পরিণত হয়।
   - কোনো তথ্য পরিবর্তন, পুনঃসক্রিয় বা ডিলিট করা সম্পূর্ণ নিষিদ্ধ।
   - অতীত আর্থিক রেফারেন্সের অখণ্ডতা শতভাগ বজায় থাকে।

3. **Closed / Suspended অপারেশনাল ম্যাপিং:**
   - ব্যাংকিং অপারেশনাল বন্ধ বা স্থগিতকরণ `Inactive` বা `Archived` স্ট্যাটাসে প্রতিফলিত হয়।
   - সিস্টেমে ডেটাবেস স্তরে আলাদা অপ্রয়োজনীয় স্ট্যাটাস কলিশন পরিহার করা হয়েছে।

---

## ৫. সংবেদনশীল ব্যাংকিং ডেটা সিকিউরিটি (Sensitive Data Security)

1. **ডিফল্ট মাস্কিং:** সাধারণ সকল ভিউ, ড্রপডাউন, টেবিল ও তালিকায় ব্যাংক হিসাব নম্বর `******4589` হিসেবে মাস্কড থাকে।
2. **অনুমোদিত উন্মোচন (Authorized Reveal):** শুধুমাত্র `Admin` রোলের ব্যবহারকারী বিস্তারিত প্যানেলে সম্পূর্ণ নম্বর দেখতে পারেন।
3. **সিকিউরিটি অডিট ইভেন্ট:** সংবেদনশীল নম্বর উন্মোচন করলে তাৎক্ষণিকভাবে `ACCOUNT_SENSITIVE_REVEALED` অডিট লগ লিপিবদ্ধ হয়।
4. **এক্সপোর্ট ও প্রিন্ট নিরাপত্তা:** CSV এক্সপোর্ট ও A4 প্রিন্ট রিপোর্টে শুধুমাত্র মাস্কড অ্যাকাউন্ট নম্বর রেন্ডার হয়।
5. **জিরো ক্রেডেনশিয়াল লিকেজ:** কোনো পাসওয়ার্ড, প্রাইভেট কি, বা সিক্রেট টোকেন অডিট পেলোড বা ক্লায়েন্ট স্টেট-এ রাখা হয় না।

---

## ৬. শরিয়াহ বাউন্ডারি (Shariah Boundary & Non-Fatwa Principle)

- **TSS কোনো ফতোয়া ইঞ্জিন নয়:** TSS কোনো Fatwa Engine, Halal/Haram Decision Engine, বা Shariah Certification Engine হিসেবে কাজ করে না।
- **তথ্যবহুল নির্দেশক (Informational Only):** শরিয়াহ ব্যাজ বা নোট থাকলে তা শুধুমাত্র ব্যবহারকারীর অবগতির জন্য তথ্যবহুল নির্দেশক (Review Indicator)। কোনো স্বয়ংক্রিয় আইনি সিদ্ধান্ত বা ফতোয়া প্রণীত হয় না।
- **রিবা ও সুদ নিষিদ্ধ:** সিস্টেমে কোনো ফিক্সড সুদ বা কনভেনশনাল লোনের ফিল্ড অন্তর্ভুক্ত নেই।

---

## ৭. ফান্ড ও হিসাবের দ্বৈত বিভাজন (Account ≠ Fund)

| বৈশিষ্ট্য | Account (হিসাব) | Fund (তহবিল) |
| :--- | :--- | :--- |
| **মূল প্রশ্ন** | টাকা বর্তমানে **কোথায়** রক্ষিত? | টাকা **কোন উদ্দেশ্য/শ্রেণির**? |
| **উদাহরণ** | ক্যাশ বাক্স, ইসলামী ব্যাংক সঞ্চয়ী হিসাব | সাধারণ তহবিল, শেয়ার মূলধন তহবিল |
| **সম্পর্ক** | Many-to-Many (`associatedFundIds`) | Many-to-Many (`associatedAccountIds`) |
| **আইসোলেশন** | অর্গানাইজেশন স্কোপড | অর্গানাইজেশন স্কোপড |

---

## ৮. নো হার্ড ডিলিট গ্যারান্টি (Zero Hard Delete)

- সিস্টেমে কোনো `DELETE /api/v1/accounts/{id}/` এন্ডপয়েন্ট নেই।
- ইউজার ইন্টারফেসে কোনো ডিলিট বাটন বা ডেস্ট্রাক্টিভ অ্যাকশন নেই।
- সকল হিসাব আজীবন অডিট ও রেফারেন্সের জন্য সংরক্ষিত থাকে।
