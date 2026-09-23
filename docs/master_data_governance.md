# Phase 4.5 — Master Data Governance, Change History & Audit Foundation

## তিজারাহ সমিতি সফটওয়্যার (Tijarah Samity Software)

---

### ১. মূল স্থাপত্য ও উদ্দেশ্য (Architecture Overview & Purpose)
তিজারাহ সমিতি সফটওয়্যারে মাস্টার ডাটা গভর্ন্যান্স (Master Data Governance Layer) হলো এমন একটি সার্বজনীন, নিরাপদ এবং ঐতিহাসিক অখণ্ডতা রক্ষাকারী আর্কিটেকচার যা সমিতির সকল মৌলিক শ্রেণিবিন্যাস কাঠামো (খাত, তহবিল, সদস্য শ্রেণি, ইত্যাদি)-র সৃষ্টি, পরিমার্জন, অবস্থা পরিবর্তন ও অডিট ট্রেইল সংরক্ষণ পরিচালনা করে।

#### মৌলিক হিসাবনীতি (Three Independent Financial Dimensions):
```text
┌─────────────────────────────────────────────────────────────┐
│  ১. খাত (Head)    = কেন টাকা আসছে বা যাচ্ছে (অর্থনৈতিক কারণ)│
│  ২. তহবিল (Fund)  = কোন উদ্দেশ্য/শ্রেণির অর্থ (ফ্ল্যাট ডাইমেনশন)│
│  ৩. হিসাব (Account) = টাকা বর্তমানে কোথায় গচ্ছিত আছে (Phase 4.5/5) │
└─────────────────────────────────────────────────────────────┘
                Head ≠ Fund ≠ Account
```
> **কঠোর সীমাবদ্ধতা:** Phase 4.5 হলো বিশুদ্ধ মাস্টার ডাটা গভর্ন্যান্স লেয়ার। এতে কোনো ফাইন্যান্স ট্রানজ্যাকশন ইঞ্জিন, ব্যালেন্স ক্যালকুলেশন, ভাউচার বা লেজার নেই।

---

### ২. অপরিবর্তনীয় আইডেন্টিটি নীতি (Immutable Identity Policy)
মাস্টার ডাটা এনটিটি একবার সৃষ্টি হওয়ার পর নিচের ফিল্ডগুলো ক্লায়েন্ট ও ডোমেন সব স্তরে সম্পূর্ণ অপরিবর্তনীয় (Immutable):
1. `id` (সিস্টেম ইউনিক আইডেন্টিফায়ার)
2. `organizationId` (মাল্টি-টেন্যান্ট সমিতি রেফারেন্স)
3. `entityCode` / `headCode` / `fundCode` (স্বয়ংক্রিয় ধারাবাহিক স্ট্যাবল কোড)
4. `createdAt` ও `createdBy` (সৃষ্টির টাইমস্ট্যাম্প ও ইউজার আইডি)

কোনো ব্যবহারকারী বা ক্লায়েন্ট এডিট অনুরোধের মাধ্যমে কোড পরিবর্তন করার চেষ্টা করলে তা ডোমেন লেয়ারে সরাসরি বাতিল (`BLOCKED`) হয়।

---

### ৩. চেঞ্জ হিস্ট্রি ও অডিট ট্রেইল মডেল (Change History Data Model)

```typescript
export interface MasterDataChangeHistoryRecord {
  id: string; // historyId
  organizationId: string; // টেন্যান্ট আইসোলেশন
  entityType: 'head' | 'fund' | 'member_classification' | 'custom_master';
  entityId: string;
  entityCode: string;
  entityName: string;
  action: 'CREATE' | 'UPDATE' | 'ACTIVATE' | 'DEACTIVATE' | 'ARCHIVE' | 'BULK_ACTIVATE' | 'BULK_DEACTIVATE' | 'BULK_ARCHIVE';
  actorUserId: string;
  actorName: string;
  actorRole?: string;
  timestamp: string; // ISO 8601
  reason: string; // বাধ্যতামূলক অডিট কারণ (Mandatory Reason)
  effectiveFrom: string; // কার্যকর তারিখ (YYYY-MM-DD)
  beforeState?: Record<string, any>; // পূর্ববর্তী অবস্থা
  afterState?: Record<string, any>; // পরবর্তী অবস্থা
  changedFields?: string[];
  referenceId?: string;
  correlationId?: string;
}
```

---

### ৪. লাইফসাইকেল ও জিরো হার্ড-ডিলিট পলিসি (Lifecycle & Zero Hard-Delete)
- **Active ↔ Inactive**: সাধারণ অপারেশনাল প্রয়োজনে সক্রিয় বা নিষ্ক্রিয়করণ।
- **Active/Inactive → Archived**: সমাপ্ত বা অব্যবহৃত আইটেমের জন্য টার্মিনাল স্টেট।
- **Archived → Active (Forbidden)**: একবার আর্কাইভ করা হলে তা পুনরায় সক্রিয় করা সম্পূর্ণ নিষিদ্ধ।
- **জিরো হার্ড-ডিলিট**: সিস্টেমে কোনো `DELETE` এপিআই বা ডিলিট বাটন নেই। হিস্টোরিক্যাল রেফারেন্স অক্ষুণ্ণ রাখতে কেবলমাত্র লাইফসাইকেল স্ট্যাটাস ব্যবহৃত হয়।

---

### ৫. বাধ্যতামূলক কারণ ও কার্যকর তারিখ (Mandatory Reason & Effective Date)
যেকোনো সংবেদনশীল একশন (Update, Status Change, Archive, Bulk Operations)-এর ক্ষেত্রে ব্যবহারকারীকে বাধ্যতামূলকভাবে নীতিগত কারণ (`reason`) প্রদান করতে হয়। একই সাথে ভবিষ্যতে ট্রানজ্যাকশন রেফারেন্সের সুবিধার জন্য `effectiveFrom` সংরক্ষিত হয়।

---

### ৬. নিরাপদ বাল্ক অপারেশন (Safe Bulk Governance Operations)
একাধিক আইটেমের স্ট্যাটাস পরিবর্তনের জন্য নিরাপদ বাল্ক অপারেশন ব্যবস্থা:
- অনুমোদিত অপারেশন: **Bulk Activate, Bulk Deactivate, Bulk Archive** (কোনো Bulk Delete নেই)।
- প্রতিটি আইটেমের জন্য পৃথক ভ্যালিডেশন (যেমন: সিস্টেম-ডিফাইন্ড আইটেম অ্যাডমিন ছাড়া আর্কাইভ না হওয়া, আর্কাইভকৃত আইটেমের টার্মিনাল সুরক্ষা)।
- আংশিক ব্যর্থতা হ্যান্ডলিং (Partial Failure Reporting) এবং প্রতি আইটেমের জন্য স্বয়ংক্রিয় অ্যাপেন্ড-অনলি অডিট ট্রেইল।

---

### ৭. দায়িত্ব পৃথকীকরণ (Separation of Duties Readiness)
আর্কিটেকচারালভাবে প্রস্তুত রাখা হয়েছে:
- `Creator ≠ Approver` (যিনি মাস্টার ডাটা তৈরি করবেন, অনুমোদনকারী হবেন ভিন্ন কর্মকর্তা)।

---

### ৮. আরব্যাক পারমিশন ম্যাট্রিক্স (RBAC Matrix)
- `master_data.governance.view`: অডিট হিস্ট্রি ও ড্যাশবোর্ড দেখা।
- `master_data.governance.history.view`: বিস্তারিত Before/After Diff দেখা।
- `master_data.governance.change`: সিঙ্গেল আইটেম স্ট্যাটাস ও তথ্য পরিবর্তন।
- `master_data.governance.bulk_change`: বাল্ক স্ট্যাটাস ট্রানজিশন এক্সিকিউশন।
- `master_data.governance.export`: অডিট হিস্ট্রি UTF-8 CSV এক্সপোর্ট।
- `master_data.governance.print`: অফিসিয়াল A4 প্রিন্ট প্রিভিউ।

---

### ৯. মাল্টি-টেন্যান্ট আইসোলেশন ও ডেটা নিরাপত্তা
- `X-Organization-Id` ও অথেনটিকেটেড ইউজার কনটেক্সট প্রতিটি রিকোয়েস্টে বাধ্যতামূলক।
- অর্গানাইজেশন A (`demo-org-khurushkul`)-এর অডিট লগ কোনোভাবেই অর্গানাইজেশন B (`org-alfalah-01`) দেখতে পারে না।
- পাসওয়ার্ড, প্রাইভেট কি, টোকেন বা সংবেদনশীল কোনো ক্রেডেনশিয়াল অডিট লগে বা এক্সপোর্টে সংরক্ষিত হয় না।
