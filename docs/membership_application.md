# তিজারাহ সমিতি সফটওয়্যার — Membership Application, Verification & Approval (Prompt 3.3)

## ১. মূল দর্শন ও আর্কিটেকচার নীতি (Core Philosophy & Architectural Policy)

সদস্যপদ আবেদন (Membership Application) এবং অফিসিয়াল সদস্য (Member) সম্পূর্ণ ভিন্ন এন্টিটি:

```text
Membership Application (খসড়া / জমা / যাচাইাধীন)
        ↓
Verification Checklist (সত্যতা নিরূপণ ও নথি নিরীক্ষা)
        ↓
Executive Decision (অনুমোদন / প্রত্যাখ্যান / প্রত্যাহার)
        ↓
Approved → Official Member Record Created (MEM-XXXXXX)
```

### প্রধান সুরক্ষানীতিসমূহ:
1. **Application ≠ Member:**
   - একটি আবেদন যে কোনো অমীমাংসিত (Pending, Under Review, Correction Required) অবস্থায় থাকলে তা কখনই অফিসিয়াল সদস্য হিসেবে গণ্য হবে না।
   - **Zero Financial Impact:** আবেদনে কোনো শেয়ার (Share), সঞ্চয় (Savings), ঋণ (Investment/Loan), চাঁদা বা লেজার ব্যালেন্স তৈরি হতে পারে না।
2. **Sequential Code Generation:**
   - প্রতিটি আবেদনের জন্য সংস্থা অনুযায়ী ক্রমানুসারে `APP-000001` থেকে `APP-999999` কোড বরাদ্দ হয়।
3. **NID Privacy & Masking:**
   - জাতীয় পরিচয়পত্র নম্বর ডিফল্টভাবে মাস্কড (`********1234`) আকারে সংরক্ষিত ও প্রদর্শিত হয়।
   - অনুমোদিত যাচাইকারী কর্মকর্তা ছাড়া কেউ সম্পূর্ণ NID উন্মুক্ত করতে পারবেন না।
4. **Separation of Duties (প্রস্তুতকারী ≠ অনুমোদনকারী):**
   - যে কর্মকর্তা আবেদনটি সিস্টেমে ডাটা এন্ট্রি বা প্রস্তুত (`createdBy`) করেছেন, তিনি নিজে সেই আবেদন অনুমোদন করতে পারেন না (`creatorUserId !== approverUserId`)।
5. **Concurrency & Double-Approval Protection:**
   - একবার অনুমোদিত হয়ে গেলে সিস্টেমে পুনরায় কোনো ডাবল অ্যাপ্রুভাল বা ডুপ্লিকেট সদস্য তৈরি হওয়া কঠোরভাবে নিষিদ্ধ।
6. **No Hard Delete:**
   - কোনো আবেদন হার্ড ডিলিট করা যাবে না। ড্রাফট বা ভুল আবেদন কেবল `withdrawn` বা `rejected` হতে পারে, যা স্থায়ী অডিট লগ হিসেবে বহাল থাকবে।

---

## ২. লাইফসাইকেল স্টেট মেশিন (State Machine Lifecycle)

| স্টেট (Status) | বাংলা বিবরণ | পরবর্তী অনুমোদিত স্টেট |
| :--- | :--- | :--- |
| `draft` | খসড়া | `submitted`, `withdrawn` |
| `submitted` | জমা দেওয়া হয়েছে | `under_review`, `withdrawn` |
| `under_review` | যাচাইাধীন | `correction_required`, `approved`, `rejected` |
| `correction_required` | সংশোধন প্রয়োজন | `resubmitted`, `withdrawn` |
| `resubmitted` | পুনরায় জমা | `under_review` |
| `approved` | অনুমোদিত (টার্মিনাল) | *কোনো ট্রানজিশন নেই* (সদস্য তৈরি সম্পন্ন) |
| `rejected` | প্রত্যাখ্যাত (টার্মিনাল) | *কোনো ট্রানজিশন নেই* (কারণ বাধ্যতামূলক) |
| `withdrawn` | প্রত্যাহৃত (টার্মিনাল) | *কোনো ট্রানজিশন নেই* |

---

## ৩. ডুপ্লিকেট সনাক্তকরণ নীতি (Duplicate Detection Rules)

সদস্যপদ আবেদন এন্ট্রি বা সাবমিট করার সময় রিয়েল-টাইমে দুটি স্তর যাচাই করা হয়:
1. **বিদ্যমান সদস্য ম্যাচ (Existing Member Match):**
   - মোবাইল নম্বর বা NID যদি একই সমিতিতে নিবন্ধিত কোনো সদস্যের সাথে মিলে যায়, তবে স্পষ্ট সতর্কতা (Warning Banner) প্রদর্শিত হয়।
   - সিস্টেম স্বয়ংক্রিয়ভাবে বিদ্যমান ডাটা ওভাররাইট করে না।
2. **একই সংস্থায় সক্রিয় আবেদন ম্যাচ (Active Application Match):**
   - যদি同一个 মোবাইল নম্বর বা NID দিয়ে ইতোমধ্যে একটি আবেদন `draft`, `submitted`, `under_review`, `correction_required`, বা `resubmitted` অবস্থায় থাকে, তবে তা চিহ্নিত করে সতর্ক করা হয়।

---

## ৪. যাচাইকরণ চেকলিস্ট (Verification Checklist)

সদস্যপদ চূড়ান্ত অনুমোদনের পূর্বে ৬-দফা যাচাইকরণ সম্পন্ন করা হয়:
1. পরিচয় তথ্য যাচাই (Full Name, Gender, DOB)
2. মোবাইল নম্বর সত্যতা যাচাই (OTP / Call verification)
3. ঠিকানা সরেজমিন পরিদর্শন (Current & Permanent Address Verification)
4. পারিবারিক তথ্য যাচাই (Father/Spouse, Mother)
5. জাতীয় পরিচয়পত্র (NID) সত্যতা যাচাই
6. ছবি ও স্বাক্ষর সঠিকতা

---

## ৫. অডিট ও সিকিউরিটি লগিং (Audit Trail)

প্রতিটি স্ট্যাটাস পরিবর্তন এবং সিদ্ধান্তের জন্য অপরিবর্তনীয় টাইমলাইন ইভেন্ট রেকর্ড করা হয়:
- `MEMBERSHIP_APPLICATION_CREATED`
- `MEMBERSHIP_APPLICATION_SUBMITTED`
- `MEMBERSHIP_APPLICATION_REVIEW_STARTED`
- `MEMBERSHIP_APPLICATION_CORRECTION_REQUIRED`
- `MEMBERSHIP_APPLICATION_RESUBMITTED`
- `MEMBERSHIP_APPLICATION_APPROVED`
- `MEMBER_CREATED_FROM_APPLICATION`
- `MEMBERSHIP_APPLICATION_REJECTED`
- `MEMBERSHIP_APPLICATION_WITHDRAWN`
