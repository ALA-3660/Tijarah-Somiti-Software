# TSS — Phase 5.3: Income Management (Unified Dynamic Income Entry)
**Authoritative Architectural Specification & Technical Guide**

---

## ১. ওভারভিউ (Module Overview)

**Phase 5.3 — Income Management** হলো **তিজারাহ সমিতি সফটওয়্যার (TSS)**-এর একীভূত আয় ও অর্থ প্রাপ্তি মডিউল।

এই মডিউলটির মূল ডিজাইন দর্শন:
> **সব ধরনের আয় ও প্রাপ্তির জন্য একটিমাত্র Unified "আয় ও প্রাপ্তি এন্ট্রি" (Unified Dynamic Income Entry) থাকবে। কোনো Income Type-এর জন্য আলাদা স্বাধীন এন্ট্রি স্ক্রিন থাকবে না। নির্বাচিত আয়ের ধরন (Income Type) অনুযায়ী ফর্মটি স্বয়ংক্রিয়ভাবে প্রাসঙ্গিক ফিল্ড, শরিয়াহ তহবিল লক, ভ্যালিডেশন এবং পেমেন্ট লজিক প্রদর্শন করবে।**

---

## ২. চতুর্মুখী আর্থিক নীতি (Core Accounting & Shariah Principles)

TSS-এর প্রতিটি আয় এন্ট্রি চতুর্মুখী আর্থিক নীতিমালার সাথে সংগতিপূর্ণ:
1. **Head (খাত — কেন টাকা এসেছে):** অবশ্যই সক্রিয় `INC-*` Income Head হতে হবে। কোনো অবস্থাতেই `EXP-*` Expense Head গ্রহণযোগ্য নয়।
2. **Fund (তহবিল — কোন উদ্দেশ্য বা শ্রেণির অর্থ):** সাধারণ তহবিল, মূলধনী তহবিল, অথবা নির্ধারিত প্রশাসনিক তহবিল।
3. **Account (হিসাব — টাকা বর্তমানে কোথায় জমা হয়েছে):** সক্রিয় ক্যাশ বা ব্যাংক হিসাব।
4. **Payment Method (পেমেন্ট মাধ্যম — কীভাবে টাকা দেওয়া হয়েছে):** নগদ, ব্যাংক ট্রান্সফার, কিউআর পেমেন্ট, চেক, ইত্যাদি।

$$\text{Head (কেন)} \neq \text{Fund (উদ্দেশ্য)} \neq \text{Account (কোথায়)} \neq \text{Payment Method (কীভাবে)}$$

---

## ৩. ১২টি অনুমোদিত আয় ধরন ও কনফিগারেশন মেট্রিক্স (12 Authoritative Income Types)

| # | Income Type Code | বাংলা নাম | ক্যাটাগরি | নির্ধারিত ফান্ড লক (Fund Lock) | রিফান্ডযোগ্য? (isRefundable) | সেটেলমেন্টযোগ্য? (isSettlementEligible) | মূলধনী? (isCapital) |
|---|---|---|---|---|---|---|---|
| ১ | `member_monthly_fee` | সদস্য মাসিক ফি | সদস্যভিত্তিক আয় | উন্মুক্ত (Active eligible fund) | ✅ হ্যাঁ | ✅ হ্যাঁ | ❌ না |
| ২ | `member_annual_fee` | সদস্য বাৎসরিক ফি | সদস্যভিত্তিক আয় | উন্মুক্ত (Active eligible fund) | ✅ হ্যাঁ | ✅ হ্যাঁ | ❌ না |
| ৩ | `member_admission_passbook` | সদস্য ভর্তি ফি + পাশ বই | সদস্যভিত্তিক আয় | 🔒 প্রশাসনিক খরচের তহবিল | ❌ না (অফেরতযোগ্য) | ❌ না | ❌ না |
| ৪ | `annual_admin_fee` | বাৎসরিক প্রশাসনিক খরচের ফি | সদস্যভিত্তিক আয় | 🔒 প্রশাসনিক খরচের তহবিল | ❌ না (অফেরতযোগ্য) | ❌ না | ❌ না |
| ৫ | `member_onetime_fee` | সদস্য এককালীন ফি | সদস্যভিত্তিক আয় | উন্মুক্ত (Active eligible fund) | ✅ পলিসি অনুযায়ী | ✅ হ্যাঁ | ❌ না |
| ৬ | `member_other_fee` | সদস্য অন্যান্য ফি | সদস্যভিত্তিক আয় | উন্মুক্ত (Active eligible fund) | ✅ পলিসি অনুযায়ী | ✅ হ্যাঁ | ❌ না |
| ৭ | `product_sale_receipt` | পণ্য বিক্রয় বাবদ প্রাপ্তি | হালাল ব্যবসা ও বিক্রয় | উন্মুক্ত (Active eligible fund) | ❌ না | ❌ না | ❌ না |
| ৮ | `rental_receipt` | ভাড়া বাবদ প্রাপ্তি | হালাল ব্যবসা ও বিক্রয় | উন্মুক্ত (Active eligible fund) | ❌ না | ❌ না | ❌ না |
| ৯ | `other_business_income` | অন্যান্য ব্যবসায়িক আয় | হালাল ব্যবসা ও বিক্রয় | উন্মুক্ত (Active eligible fund) | ❌ না | ❌ না | ❌ না |
| ১০ | `asset_sale_receipt` | সম্পদ বিক্রয় বাবদ প্রাপ্তি | হালাল ব্যবসা ও বিক্রয় | উন্মুক্ত (Active eligible fund) | ❌ না | ❌ না | ❌ না |
| ১১ | `general_donation_receipt` | সাধারণ অনুদান/দান প্রাপ্তি | অনুদান ও অন্যান্য | উন্মুক্ত (Active eligible fund) | ❌ না | ❌ না | ❌ না |
| ১২ | `other_general_receipt` | অন্যান্য সাধারণ প্রাপ্তি | অনুদান ও অন্যান্য | উন্মুক্ত (Active eligible fund) | ❌ না | ❌ না | ❌ না |

---

## ৪. লাইফসাইকেল ও স্টেট মেশিন (Authoritative Lifecycle State Machine)

$$\text{DRAFT} \xrightarrow{\text{Submit}} \text{SUBMITTED} \xrightarrow{\text{Approve (Creator } \neq \text{ Approver)}} \text{APPROVED}$$
$$\text{SUBMITTED} \xrightarrow{\text{Reject (With Reason)}} \text{REJECTED} \xrightarrow{\text{Reopen}} \text{DRAFT}$$

### মূল নিয়মাবলী:
1. **দায়িত্ব পৃথকীকরণ (Separation of Duties):** প্রস্তুতকারী ইউজার (`createdBy`) কখনো নিজের এন্ট্রি অনুমোদন করতে পারবেন না (`createdBy !== approvedBy`)।
2. **অফিসিয়াল ব্যালেন্স প্রভাব (Zero Balance Leakage):** `DRAFT`, `SUBMITTED` এবং `REJECTED` এন্ট্রির আর্থিক ব্যালেন্স প্রভাব strictly **০.০০**। শুধুমাত্র `APPROVED` এন্ট্রি ভবিষ্যৎ Official Ledger-এ গণ্য হবে।
3. **অনুমোদিত এন্ট্রির অপরিবর্তনীয়তা (Immutability):** `APPROVED` এন্ট্রি সরাসরি এডিট বা হার্ড ডিলিট করা সম্পূর্ণ নিষিদ্ধ।

---

## ৫. কথায় টাকায় রূপান্তর ও POS প্রিন্ট (Bengali Words & POS Receipt)

* **স্বয়ংক্রিয় টাকায় কথায় রূপান্তর:** `numberToBengaliWords()` ইউটিলিটির মাধ্যমে দশমিক ও পয়সাসহ বাংলা ব্যাকরণ অনুযায়ী রূপান্তর করা হয় (যেমন: `৳ ২৫,০০০.০০` $\rightarrow$ `কথায়: পঁচিশ হাজার টাকা মাত্র`)।
* **POS রশিদ বিন্যাস:**
  - TSS লোগো ও ব্র্যান্ড স্লোগান
  - প্রতিষ্ঠানের নাম, ঠিকানা ও যোগাযোগ
  - রশিদ নম্বর ও সিস্টেম জেনারেটেড লেনদেন কোড
  - আয়ের ক্যাটাগরি ও প্রদানকারীর পরিচয় (সদস্য কোড/ক্রেতা/ভাড়াটিয়া/দাতা)
  - মোট টাকার পরিমাণ ও বাংলায় কথায় বিবরণ
  - সংশ্লিষ্ট তহবিল ও জমা হিসাব
  - প্রস্তুতকারী ও অনুমোদনকারীর দায়িত্বশীল স্বাক্ষর

---

## ৬. ব্যাকএন্ড ও রেস্ট এপিআই স্পেসিফিকেশন (Django REST API Endpoints)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/finance/income/` | আয় ও প্রাপ্তি রেজিস্টার তালিকা (ফিল্টার ও পেজিনেশন) |
| `POST` | `/api/v1/finance/income/` | নতুন আয় এন্ট্রি তৈরি (খসড়া / সরাসরি সাবমিশন) |
| `GET` | `/api/v1/finance/income/{id}/` | সুনির্দিষ্ট আয় এন্ট্রির বিস্তারিত তথ্য |
| `PATCH` | `/api/v1/finance/income/{id}/` | খসড়া আয় এন্ট্রি সংশোধন |
| `POST` | `/api/v1/finance/income/{id}/submit/` | খসড়া এন্ট্রি অনুমোদনের জন্য জমা দেওয়া |
| `POST` | `/api/v1/finance/income/{id}/approve/` | জমা দেওয়া এন্ট্রি অনুমোদন (`createdBy !== approvedBy`) |
| `POST` | `/api/v1/finance/income/{id}/reject/` | জমা দেওয়া এন্ট্রি প্রত্যাখ্যান (কারণ আবশ্যক) |
| `POST` | `/api/v1/finance/income/{id}/reopen/` | প্রত্যাখ্যাত এন্ট্রি ড্রাফটে পুনঃউন্মুক্তকরণ |
| `GET` | `/api/v1/finance/income/{id}/pos-receipt/` | POS থার্মাল প্রিন্ট ডেটা ও মেটাডাটা |
