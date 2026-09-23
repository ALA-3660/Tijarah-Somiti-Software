# Phase 4.4 — Fund Management Specification & Architecture

## তিজারাহ সমিতি সফটওয়্যার (Tijarah Samity Software)

### ১. মূল হিসাবনীতি ও ডাইমেনশন বিভাজন (Three Financial Dimensions)
তিজারাহ সমিতি সফটওয়্যারে হিসাবের তিনটি ডাইমেনশন সম্পূর্ণ স্বাধীন ও স্বতন্ত্র:
1. **খাত (Head)**: কেন টাকা আসছে বা যাচ্ছে (অর্থনৈতিক কারণ/শ্রেণিবিভাগ, যেমন: ভর্তি ফি, অফিস ভাড়া)। এটি ২-স্তরীয় (Main Head → Sub Head)।
2. **তহবিল (Fund)**: কোন উদ্দেশ্য বা শ্রেণির অর্থ (যেমন: সাধারণ তহবিল, শেয়ার মূলধন তহবিল, প্রকল্প তহবিল)। এটি একটি সমতল মাত্রা (Flat Dimension, No Sub-funds)।
3. **হিসাব (Account)**: টাকা বর্তমানে কোথায় গচ্ছিত আছে (যেমন: ক্যাশ, ব্যাংক অ্যাকাউন্ট, মোবাইল ব্যাংকিং)। (Phase 4.5/5)

**কঠোর সীমাবদ্ধতা (Strict Boundary):**
- `Head ≠ Fund ≠ Account`
- ফান্ড কখনো খাত বা ব্যাংক অ্যাকাউন্ট হিসেবে কাজ করবে না।
- ফান্ডে কোনো আর্থিক ব্যালেন্স, লেজার বা ভাউচার ট্রানজ্যাকশন থাকবে না (Phase 4.4 শুধুমাত্র মাস্টার ডাটা ও ক্লাসিফিকেশন)।

---

### ২. ফান্ড ডোমেন এনটিটি (Domain Entity Specification)

```typescript
export type FundType = 'general' | 'administrative' | 'share' | 'project' | 'custom';
export type FundStatus = 'active' | 'inactive' | 'archived';

export interface Fund {
  id: string; // অপরিবর্তনীয় সিস্টেম আইডি
  organizationId: string; // মাল্টি-টেন্যান্ট অর্গানাইজেশন স্কোপিং
  fundCode: string; // অপরিবর্তনীয় কোড (FND-001, FND-002...)
  name: string; // তহবিলের নাম (ইউনিকোড NFC নরমালাইজড ও ডুপ্লিকেট সুরক্ষিত)
  description?: string; // বিবরণ ও ব্যবহারের উদ্দেশ্য
  fundType: FundType; // অনুমোদিত ৫টি স্ট্যান্ডার্ড টাইপ
  isSystemDefined: boolean; // সিস্টেম নির্ধারিত নাকি কাস্টম
  isActive: boolean; // সক্রিয়তা ফ্ল্যাগ
  status: FundStatus; // নিয়ন্ত্রিত লাইফসাইকেল
  sortOrder: number; // উপস্থাপনের ক্রম
  createdAt: string; // ISO 8601 টাইমস্ট্যাম্প
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
```

---

### ৩. তহবিলের ধরন (Fund Types)
1. **সাধারণ তহবিল (General Fund - `general`)**: সমিতির সাধারণ কার্যক্রম ও বহুমুখী উদ্দেশ্য।
2. **প্রশাসনিক তহবিল (Administrative Fund - `administrative`)**: দাপ্তরিক ও ব্যবস্থাপনা ব্যয় নির্বাহ।
3. **শেয়ার মূলধন তহবিল (Share Capital Fund - `share`)**: সদস্যদের স্থায়ী ইকুইটি ও শেয়ার মূলধন।
4. **প্রকল্প তহবিল (Project Fund - `project`)**: নির্দিষ্ট বাণিজ্যিক বা উন্নয়নমূলক প্রকল্প (যেমন: মৎস্য প্রকল্প)।
5. **কাস্টম তহবিল (Custom Fund - `custom`)**: সমিতির নিজস্ব বিশেষ চাহিদায় নির্মিত তহবিল।

> **নিষেধাজ্ঞা নীতি (Prohibited Scope):** সিস্টেমে কোনো যাকাত, সদকা, ওয়াকফ, ফিতরা বা ইমার্জেন্সি ফান্ড হার্ডকোড করা নেই। সমিতি প্রয়োজন অনুযায়ী কাস্টম তহবিল নিবন্ধন করতে পারবে।

---

### ৪. লাইফসাইকেল ও ট্রানজিশন রুলস (Lifecycle Rules)
- **Active ↔ Inactive**: সাধারণ অপারেশন চলাকালীন পরিবর্তনযোগ্য।
- **Active/Inactive → Archived**: সমাপ্ত প্রকল্প বা তহবিলের জন্য টার্মিনাল স্টেট।
- **Archived → Active (Forbidden)**: আর্কাইভকৃত তহবিল পুনরায় সক্রিয় করা নিষিদ্ধ।
- **Zero Hard-Delete**: হিস্টোরিক্যাল ডাটা ইন্টিগ্রিটি রক্ষার্থে কোনো ডিলিট মেথড নেই।

---

### ৫. অডিট লগিং ও ট্রেইল (Audit Trail)
প্রতিটি ফান্ড অপারেশনে অ্যাপেন্ড-অনলি অডিট ট্রেইল তৈরি হয়:
- `FUND_CREATED`
- `FUND_UPDATED`
- `FUND_ACTIVATED`
- `FUND_DEACTIVATED`
- `FUND_ARCHIVED`
লগে অপরিবর্তনীয় টাইমস্ট্যাম্প, ব্যবহারকারীর পরিচয়, পরিবর্তনের কারণ ও পূর্ববর্তী/পরবর্তী অবস্থার স্ন্যাপশট সংরক্ষিত থাকে।

---

### ৬. আরব্যাক পারমিশন ম্যাট্রিক্স (RBAC Matrix)
- **Admin**: View, Create, Edit, Status Change, Export, Print.
- **Manager**: View, Create, Edit, Export, Print (No Status Change).
- **Accountant**: View, Export, Print.
- **Viewer**: View Only.
