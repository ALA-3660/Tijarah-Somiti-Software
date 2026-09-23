# Financial Transaction Core Foundation (Phase 5.2)
## তিজারাহ সমিতি সফটওয়্যার (Tijarah Samity Software — TSS)

---

## ১. ওভারভিউ ও মূল দর্শন (Overview & Core Philosophy)

**তিজারাহ সমিতি সফটওয়্যার (TSS)**-এ ইসলামি শরিয়াহ ও আধুনিক আর্থিক ব্যবস্থাপনার ৪টি স্পষ্ট ও অবিভাজ্য মাত্রা (Dimensions) রয়েছে:

```
                  Organization (সমিতি)
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
  Head (খাত)          Fund (তহবিল)        Account (হিসাব)
  "কেন টাকা আসছে/যাচ্ছে"  "কোন উদ্দেশ্য/শ্রেণির"  "টাকা বর্তমানে কোথায় আছে"
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
              Transaction Core (লেনদেন)
             "একটি আর্থিক ঘটনা বা লেনদেনের রেকর্ড"
                           │
                           ▼
                   Workflow / Approval
                  (খসড়া ➔ জমা ➔ অনুমোদন)
                           │
                           ▼
              Official Ledger & Balance Engine
                 (Phase 5.7 — শুধুমাত্র APPROVED)
```

**Financial Transaction Core (Phase 5.2)** মডিউলটি সংগঠনের অর্থ স্থানান্তরের মৌলিক লেনদেন ব্যাকবোন ও অনুমোদন প্ল্যাটফর্ম প্রদান করে।

---

## ২. স্কোপ ডিসিপ্লিন ও বাউন্ডারি (Strict Scope Boundaries)

### Phase 5.2-এ অন্তর্ভুক্ত:
- `FinancialTransaction` জেনেরিক কোর এনটিটি (Financial Event Record)
- Transaction Types: `INCOME` (আয়), `EXPENSE` (ব্যয়), `TRANSFER` (স্থানান্তর)
- **Authoritative Status Lifecycle: `DRAFT ➔ SUBMITTED ➔ APPROVED / REJECTED`**
- নিয়ন্ত্রিত রিসাবমিশন ফ্লো: `REJECTED ➔ DRAFT ➔ SUBMITTED`
- **Separation of Duties (দায়িত্ব পৃথকীকরণ):** প্রস্তুতকারী (`createdBy`) নিজে নিজের লেনদেন অনুমোদন করতে পারবে না।
- **Official Balance Rule:** পেন্ডিং, খসড়া বা প্রত্যাখ্যাত লেনদেনের ব্যালেন্স প্রভাব strictly ০.০০; শুধুমাত্র অনুমোদিত লেনদেন অফিসিয়াল লেজারে গণ্য হবে।
- ক্রস-অর্গানাইজেশন মাস্টার ডাটা প্রোটেকশন (`Account.orgId === Fund.orgId === Head.orgId === Transaction.orgId`)
- আর্কাইভকৃত মাস্টার ডাটা এক্সক্লুশন পলিসি (Archived Master Data Exclusion)
- খাত ও লেনদেন টাইপ সামঞ্জস্যতা (`INCOME ➔ Income Head`, `EXPENSE ➔ Expense Head`)
- ইতিবাচক ডেসিমেল পরিমাণ (Positive Monetary Numeric/Decimal Amount: `amount > 0`)
- কনকারেন্সি ও অপটিমিস্টিক লক টোকেন (`version`)
- অপরিবর্তনীয় অডিট ট্রেইল (`TRANSACTION_CREATED`, `SUBMITTED`, `APPROVED`, `REJECTED`, `RESUBMITTED`)
- জিরো হার্ড ডিলিট পলিসি (Zero Hard Delete)

### ❌ Phase 5.2-এ সম্পূর্ণ বহির্ভূত ও স্থগিত (Deferred to Future Phases):
- ❌ Income-specific business form / party flow (Phase 5.3)
- ❌ Expense-specific business form / approval thresholds (Phase 5.4)
- ❌ Transfer-specific double-entry workflow (Phase 5.5)
- ❌ Opening Balance Injection Engine (Phase 5.6)
- ❌ Official Ledger & Balance Engine (Phase 5.7)
- ❌ Reversal & Correction Engine (Phase 5.8)
- ❌ Advanced Financial Audit Hardening (Phase 5.9)
- ❌ Profit / Loss Calculation Engine
- ❌ Interest / Riba / Shariah Fatwa Decision Engine

---

## ৩. ডোমেইন মডেল ও ডেটা স্ট্রাকচার (Domain Model)

```typescript
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TransactionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface FinancialTransaction {
  id: string;                      // Immutable UUID
  organizationId: string;          // Tenant Boundary (X-Organization-Id)
  transactionCode: string;         // e.g. "TRX-2026-000001" (Human-Readable, Unique per Org)
  transactionType: TransactionType;// 'INCOME' | 'EXPENSE' | 'TRANSFER'
  transactionDate: string;         // YYYY-MM-DD (Economic activity date)
  amount: number;                  // Positive Decimal (2-decimal precision, e.g. 15000.00)
  
  // ত্রিমাত্রিক মাস্টার ডাটা রেফারেন্স
  accountId: string;               // Foreign Key -> Account (টাকা কোথায় আছে)
  fundId: string;                  // Foreign Key -> Fund (কোন উদ্দেশ্য/শ্রেণির অর্থ)
  headId: string;                  // Foreign Key -> Head (কেন টাকা আসছে/যাচ্ছে)
  
  description: string;             // লেনদেনের সুনির্দিষ্ট উদ্দেশ্য ও বিবরণ
  reference?: string;              // ভাউচার / চালান / ব্যাংক স্লিপ নম্বর
  status: TransactionStatus;       // 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  
  // দায়িত্ব পৃথকীকরণ ও অ্যাক্টর লগ
  createdBy: string;               // খসড়া প্রস্তুতকারী ইউজার আইডি
  createdByName?: string;
  submittedBy?: string;            // সাবমিটকারী ইউজার আইডি
  submittedByName?: string;
  submittedAt?: string;            // ISO 8601
  approvedBy?: string;             // অনুমোদনকারী ইউজার আইডি (Must NOT equal createdBy)
  approvedByName?: string;
  approvedAt?: string;             // ISO 8601
  rejectedBy?: string;             // প্রত্যাখ্যানকারী ইউজার আইডি
  rejectedByName?: string;
  rejectedAt?: string;             // ISO 8601
  rejectionReason?: string;        // প্রত্যাখ্যানের বাধ্যতামূলক কারণ
  
  // কনকারেন্সি নিয়ন্ত্রণ
  version: number;                 // Optimistic Lock Token
  
  // টাইমস্ট্যাম্প
  createdAt: string;               // ISO 8601
  updatedAt: string;               // ISO 8601
}
```

---

## ৪. লাইফসাইকেল ও অনুমোদন রূপান্তর নিয়মাবলী (Authoritative Lifecycle)

```
 [ DRAFT (খসড়া) ] 
        │
        ▼ (Submit)
 [ SUBMITTED (জমা) ] ──────────┐
        │                      │
        ▼ (Approve)            ▼ (Reject)
 [ APPROVED (অনুমোদিত) ]   [ REJECTED (প্রত্যাখ্যাত) ]
   (Immutable Terminal)        │
                               ▼ (Re-open as Draft)
                          [ DRAFT (খসড়া) ]
```

### অনুমোদিত ট্রানজিশনসমূহ:
1. `DRAFT ➔ SUBMITTED`: প্রস্তুতকারী বা হিসাবরক্ষক খসড়া তৈরি শেষে পর্যালোচনার জন্য জমা দেন।
2. `SUBMITTED ➔ APPROVED`: অ্যাডমিন বা ম্যানেজার লেনদেন চূড়ান্ত অনুমোদন দেন (প্রস্তুতকারী নিজে অনুমোদন করতে পারবেন না)।
3. `SUBMITTED ➔ REJECTED`: অসংগতি থাকলে কারণ উল্লেখপূর্বক প্রত্যাখ্যান করা হয়।
4. `REJECTED ➔ DRAFT`: প্রত্যাখ্যাত লেনদেন সংশোধন করে পুনরায় জমা দেওয়ার জন্য খসড়ায় স্থানান্তর করা হয়।

### নিষিদ্ধ ট্রানজিশনসমূহ (Strictly Blocked):
- ❌ `DRAFT ➔ APPROVED`: সাবমিশন ছাড়া সরাসরি অনুমোদন নিষিদ্ধ (HTTP 400 Bad Request)।
- ❌ `APPROVED ➔ DRAFT / SUBMITTED / REJECTED`: অনুমোদিত লেনদেন অপরিবর্তনীয় ও স্থায়ী।
- ❌ `APPROVED ➔ DELETE`: অনুমোদিত লেনদেন মোছা সম্পূর্ণ নিষিদ্ধ।
- ❌ `createdBy === approvedBy`: প্রস্তুতকারী নিজে অনুমোদন করলে HTTP 403 Forbidden রিটার্ন করবে।

---

## ৫. অফিসিয়াল ব্যালেন্স নীতি (Official Balance Rule)

| স্ট্যাটাস | অফিসিয়াল লেজার স্ট্যাটাস | একাউন্ট/ফান্ড ব্যালেন্স প্রভাব |
| :--- | :--- | :--- |
| **DRAFT** | Non-eligible | **০.০০ (Zero Impact)** |
| **SUBMITTED** | Non-eligible | **০.০০ (Zero Impact)** |
| **REJECTED** | Non-eligible | **০.০০ (Zero Impact)** |
| **APPROVED** | **Eligible for Ledger (Phase 5.7)** | **প্রকৃত লেনদেন অংক দ্বারা প্রভাবিত হবে** |

---

## ৬. মাস্টার ডাটা ইন্টিগ্রিটি ও ক্রস-অর্গানাইজেশন সুরক্ষা

1. **টেন্যান্ট আইসোলেশন:** লেনদেন তৈরির সময় `X-Organization-Id` দ্বারা যাচাই করা হয় যে `Transaction.orgId === Account.orgId === Fund.orgId === Head.orgId`। কোনো অমিল থাকলে তাৎক্ষণিকভাবে রিকোয়েস্ট বাতিল হয়।
2. **আর্কাইভ মাস্টার ডাটা রোধ:** যদি কোনো হিসাব, ফান্ড বা খাত `archived` অবস্থায় থাকে, তা দিয়ে নতুন লেনদেন তৈরি বা সাবমিট করা যাবে না।
3. **খাত ও লেনদেনের ধরন সামঞ্জস্যতা:**
   - `INCOME` লেনদেনে শুধুমাত্র `income` খাত গ্রহণযোগ্য।
   - `EXPENSE` লেনদেনে শুধুমাত্র `expense` খাত গ্রহণযোগ্য।

---

## ৭. কনকারেন্সি ও ডুপ্লিকেট অনুমোদন প্রতিরোধ (Concurrency & Idempotency)

- প্রতিটি লেনদেনে একটি `version` টোকেন থাকে।
- যখন কোনো অফিসার লেনদেন অনুমোদন বা প্রত্যাখ্যান করেন, তখন `WHERE id = :id AND version = :currentVersion` শর্তে আপডেট করা হয়।
- দুইজন ব্যবহারকারী একই সাথে অনুমোদন করার চেষ্টা করলে দ্বিতীয় ব্যবহারকারীর অনুরোধ কনফ্লিক্ট শনাক্ত করে বাতিল হবে।

---

## ৮. শরিয়াহ বাউন্ডারি (Shariah Boundary & Non-Fatwa Principle)

- **TSS কোনো ফতোয়া ইঞ্জিন নয়:** TSS কোনো Fatwa Engine, Halal/Haram Decision Engine, বা Shariah Certification Engine হিসেবে কাজ করে না।
- **রিবা ও সুদ অনুপস্থিত:** সিস্টেমে কোনো ফিক্সড সুদ, পিরিয়ডিক্যাল পেনাল্টি বা কনভেনশনাল লোনের কোনো ফিল্ড নেই।

---

## ৯. নো হার্ড ডিলিট পলিসি (Zero Hard Delete)

- সিস্টেমে কোনো `DELETE /api/v1/finance/transactions/{id}/` এন্ডপয়েন্ট নেই।
- ফিন্যান্সিয়াল হিস্ট্রির শতভাগ অখণ্ডতা নিশ্চিত করতে সকল লেনদেন ও অডিট রেকর্ড আজীবন ডেটাবেজে সংরক্ষিত থাকে।
