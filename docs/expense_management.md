# TSS — Phase 5.4: Expense Management & Payment Vouchers
**Authoritative Architectural Specification & Technical Guide**

---

## ১. ওভারভিউ (Module Overview)

**Phase 5.4 — Expense Management (ব্যয় ও পেমেন্ট ভাউচার ব্যবস্থাপনা)** হলো **তিজারাহ সমিতি সফটওয়্যার (TSS)**-এর একীভূত পরিচালন ও সাধারণ প্রাতিষ্ঠানিক ব্যয় ব্যবস্থাপনা মডিউল।

এই মডিউলটির মূল ডিজাইন দর্শন:
> **Specialized operational domain থাকলে expense সেই domain-এ যাবে। কোনো বিশেষায়িত ডোমেইনের আওতায় না পড়লে General Income & Expense-এর মাধ্যমে এন্ট্রি হবে। Finance & Accounting হলো central financial engine এবং General Expense হলো fallback operational entry domain।**

---

## ২. ত্রি-মাত্রিক আইডেন্টিটি আর্কিটেকচার (3-Identity Architecture)

একই পেমেন্ট যেন দুইবার ফিন্যান্সিয়াল পোস্টিং না হয়, সেজন্য প্রতিটি ব্যয়ের ৩টি স্বতন্ত্র সত্তা রয়েছে:

1. **Expense ID (`EXP-UUID`):** ব্যয়ের ডাটাবেস ও সিস্টেম আইডেন্টিটি।
2. **Payment Voucher (`PV-2026-XXXXXX`):** ভাউচার নম্বর (A4 পেমেন্ট ভাউচার ও নিরীক্ষা নম্বর)।
3. **Financial Transaction Code (`TRX-2026-XXXXXX`):** কেন্দ্রীয় ফিন্যান্স পোস্টিং রেফারেন্স।

$$\text{Expense Entry} \xrightarrow{\text{Submit}} \text{Approve} \xrightarrow{\text{Generate Voucher}} \text{Payment Voucher (PV)} \xrightarrow{\text{Eligible}} \text{Financial TRX}$$

---

## ৩. ৭টি লকড সাধারণ ব্যয় ক্যাটাগরি (7 Locked General Expense Types)

| # | Expense Type Code | বাংলা নাম | ক্যাটাগরি | ডিফল্ট খাত | তহবিল নীতি | প্রমাণপত্র থ্রেশহোল্ড |
|---|---|---|---|---|---|---|
| ১ | `administrative_expense` | প্রশাসনিক ব্যয় | প্রশাসনিক ও পরিচালন | `EXP-001` | 🔒 প্রশাসনিক খরচের তহবিল (`fnd-demo-admin`) | ৳৩,০০০+ |
| ২ | `general_operational_expense` | সাধারণ পরিচালন ব্যয় | দৈনন্দিন পরিচালন | `EXP-002` | সাধারণ তহবিল | ৳২,০০০+ |
| ৩ | `maintenance_repair_expense` | রক্ষণাবেক্ষণ ও মেরামত ব্যয় | সম্পদ ও চত্বর রক্ষণাবেক্ষণ | `EXP-003` | সাধারণ/আপদকালীন তহবিল | ৳২,৫০০+ |
| ৪ | `professional_service_expense` | পেশাগত ও সেবা ব্যয় | পেশাগত সেবা ও পরামর্শ | `EXP-004` | সাধারণ তহবিল | ৳৫,০০০+ |
| ৫ | `publicity_publication_communication_expense` | প্রচার, প্রকাশনা ও যোগাযোগ ব্যয় | প্রচার ও প্রকাশনা | `EXP-005` | সাধারণ তহবিল | ৳৪,০০০+ |
| ৬ | `social_institutional_activity_expense` | সামাজিক ও প্রাতিষ্ঠানিক কার্যক্রম ব্যয় | প্রাতিষ্ঠানিক কার্যক্রম | `EXP-006` | সাধারণ তহবিল | ৳৩,০০০+ |
| ৭ | `other_general_expense` | অন্যান্য সাধারণ ব্যয় | বিবিধ সাধারণ ব্যয় | `EXP-007` | সাধারণ তহবিল | ৳১,৫০০+ |

> **যাতায়াত নীতি:** যাতায়াত বা পরিবহন কোনো স্বতন্ত্র ক্যাটাগরি নয়। সাধারণ অফিস যাতায়াত `সাধারণ পরিচালন ব্যয়`-এর অংশ; ব্যবসা ও মাহফিলের পরিবহন সংশ্লিষ্ট বিশেষায়িত ডোমেইনের অংশ।

---

## ৪. ডোমেইন বাউন্ডারি গার্ড (Domain Boundary Guard)

General Expense দিয়ে নিচের কোনো লেনদেন করা যাবে না (এগুলো স্ব-স্ব ডোমেইনে থাকবে):
* পণ্য ক্রয় (Product Purchase)
* ব্যবসায়িক ক্রয় ও সরবরাহকারী পাওনা (Supplier Payable)
* ইনভেন্টরি পারচেজ (Inventory)
* মাহফিল ব্যয় (Mahfil Expense)
* কল্যাণ ও জাকাত বিতরণ (Welfare Disbursement)
* কর্জে হাসানা প্রদান (Qard Disbursement)
* শেয়ার ক্রয় (Share Purchase)
* প্রকল্প বিনিয়োগ (Project Investment)
* স্থায়ী সম্পদ বিক্রয় খরচ (Asset Disposal)
* ভাড়া সংশ্লিষ্ট খরচ (Rental-specific expense)

---

## ৫. চতুর্মুখী আর্থিক নীতি (Head ≠ Fund ≠ Account ≠ Payee)

1. **Head (খাত — কেন খরচ হয়েছে):** অবশ্যই সক্রিয় `EXP-*` Expense Head হতে হবে। কোনো `INC-*` খাত গ্রহণযোগ্য নয়।
2. **Fund (তহবিল — কোন তহবিলের অর্থে পরিশোধ):** সাধারণ তহবিল অথবা প্রশাসনিক তহবিল।
3. **Account (হিসাব — কোথা থেকে অর্থ বের হলো):** সক্রিয় ক্যাশ বা ব্যাংক অ্যাকাউন্ট।
4. **Payee (প্রাপক — কে টাকা গ্রহণ করেছে):** সদস্য, বহিরাগত বিক্রেতা, বা সরবরাহকারী প্রতিষ্ঠান।

$$\text{Head (কেন)} \neq \text{Fund (তহবিল)} \neq \text{Account (কোথা থেকে)} \neq \text{Payee (কে পেল)}$$

---

## ৬. লাইফসাইকেল ও Maker-Checker নীতি

$$\text{DRAFT} \xrightarrow{\text{Submit}} \text{SUBMITTED} \xrightarrow{\text{Approve (Creator } \neq \text{ Approver)}} \text{APPROVED}$$
$$\text{SUBMITTED} \xrightarrow{\text{Reject (With Reason)}} \text{REJECTED} \xrightarrow{\text{Reopen}} \text{DRAFT}$$

### মূল নিয়মাবলী:
1. **Maker-Checker:** প্রস্তুতকারী (`createdBy`) নিজে ব্যয় অনুমোদন করতে পারবে না (`createdBy !== approvedBy`)। লঙ্ঘন হলে HTTP 403 Forbidden।
2. **অপরিবর্তনীয়তা (Immutability):** `APPROVED` ব্যয় সরাসরি এডিট, ডিলিট বা পরিবর্তন সম্পূর্ণ নিষিদ্ধ।
3. **Pay Later নিষিদ্ধ:** জেনারেল এক্সপেন্সে কোনো বাকিতে ব্যয় বা Pay Later নেই; এটি প্রকৃত পরিশোধ (Payment) ভিত্তিক।

---

## ৭. ডুপ্লিকেট পেমেন্ট প্রতিরোধ (Duplicate Protection)

1. **Exact Duplicate Block:**
   $$\text{Same Org} + \text{Same Payee} + \text{Same Bill No} + \text{Same Amount} \implies \text{BLOCK}$$
2. **Possible Duplicate Warning:**
   $$\text{Same Org} + \text{Same Payee} + \text{Same Date} + \text{Same Amount} + \text{Same Head} \implies \text{WARNING}$$

---

## ৮. প্রিন্ট আর্কিটেকচার (Print Architecture)

1. **Payment Voucher (A4 Layout):**
   * প্রতিষ্ঠানের নাম ও মেটাডাটা
   * ভাউচার নম্বর, ট্রানজাকশন কোড ও তারিখ
   * প্রাপকের নাম ও ক্যাশ মেমো রেফারেন্স
   * ব্যয়ের বিবরণ, খাত ও তহবিল
   * সংখ্যায় পরিমাণ ও সরাসরি নিচে বাংলায় কথায় পরিমাণ
   * ৪টি স্বাক্ষর ব্লক: প্রস্তুতকারী, পরীক্ষাকারী, অনুমোদনকারী, গ্রহীতা।
2. **POS Thermal Slip Print:**
   * থার্মাল স্লিপে ভাউচার নম্বর, প্রাপক, খাত, তহবিল, পরিমাণ ও স্বাক্ষর।
