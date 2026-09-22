# তিজারাহ সমিতি সফটওয়্যার — নিরাপত্তা অডিট ও ইভেন্ট ম্যানেজমেন্ট স্পেসিফিকেশন (Security Audit Specification)

## ১. সারসংক্ষেপ ও উদ্দেশ্য
তিজারাহ সমিতি সফটওয়্যারের Phase 2-এর Prompt 2.5 অনুযায়ী এটি একটি সেন্ট্রালাইজড **নিরাপত্তা অডিট ও ইভেন্ট ম্যানেজমেন্ট সিস্টেম**। এই সিস্টেমের কাজ হলো প্রমাণীকরণ (Authentication), অনুমতি ও ভূমিকা (Authorization/Role), ব্যবহারকারী নিরাপত্তা (User Security) এবং সেশনের সকল কার্যক্রম স্থায়ীভাবে সংরক্ষণ ও নিরীক্ষণ করা।

> **গুরুত্বপূর্ণ সীমারেখা:**
> Security Audit কোনো Financial Ledger, Member Ledger, Share Ledger বা Business Transaction Audit নয়। এটি কেবলমাত্র নিরাপত্তা, লগইন, এক্সেস নিয়ন্ত্রণ ও সিস্টেম স্টেট পরিবর্তনের ঐতিহাসিক রেকর্ড।

---

## ২. নিরাপত্তা অডিট ডেটা কাঠামো (`SecurityAuditRecord`)

| ফিল্ডের নাম | ডেটা টাইপ | বর্ণনা |
| :--- | :--- | :--- |
| `id` | `String` | অনন্য অডিট রেকর্ড আইডি (যেমন: `SEC-AUD-0001`) |
| `organizationId` | `String` | প্রতিষ্ঠান আইসোলেশন আইডি (Multi-tenant) |
| `actorUserId` | `String` | কার্যক্রম সম্পাদনকারীর আইডি |
| `actorName` | `String` | সম্পাদনকারীর নাম |
| `eventType` | `SecurityEventType` | অডিট ইভেন্টের ধরন |
| `action` | `String` | সম্পাদিত অ্যাকশনের বিবরণ |
| `targetType` | `String` | লক্ষ্যবস্তুর ধরন (`user`, `role`, `session`, `route`, ইত্যাদি) |
| `targetId` | `String?` | লক্ষ্যবস্তুর অনন্য আইডি |
| `targetName` | `String?` | লক্ষ্যবস্তুর নাম বা রেফারেন্স |
| `timestamp` | `DateTime` | ইভেন্ট সংঘটিত হওয়ার সুনির্দিষ্ট সময়কাল |
| `ipAddress` | `String?` | ক্লায়েন্ট আইপি অ্যাড্রেস (UI-তে মাস্কড) |
| `deviceReference` | `String?` | ক্লায়েন্ট ডিভাইস ও ব্রাউজার তথ্য |
| `previousState` | `Map<String, dynamic>?` | পরিবর্তনের পূর্ববর্তী স্টেট (Diff) |
| `newState` | `Map<String, dynamic>?` | পরিবর্তনের পরবর্তী নতুন স্টেট (Diff) |
| `reason` | `String?` | প্রশাসনিক বা কার্যসম্পাদনের কারণ |
| `result` | `SecurityEventResult` | `success`, `failed`, `blocked`, `denied` |
| `metadata` | `Map<String, dynamic>?` | অতিরিক্ত সুরক্ষিত মেটাডাটা |

---

## ৩. সেন্ট্রালাইজড ইভেন্ট ক্যাটালগ (`SecurityEvent`)

### ৩.১ প্রমাণীকরণ ইভেন্টস (Authentication Events)
- `LOGIN_SUCCESS`: সফল ব্যবহারকারী লগইন
- `LOGIN_FAILED`: ভুল পরিচয় বা ক্রেডেনশিয়াল জনিত লগইন ব্যর্থতা
- `LOGOUT`: ব্যবহারকারীর স্বেচ্ছায় লগআউট
- `SESSION_EXPIRED`: সেশনের মেয়াদ উত্তীর্ণ
- `TOKEN_REFRESH`: টোকেন সফলভাবে নবায়ন
- `TOKEN_REFRESH_FAILED`: টোকেন নবায়ন ব্যর্থতা

### ৩.২ অনুমতি ইভেন্টস (Authorization Events)
- `ACCESS_DENIED`: নিষিদ্ধ রুটে প্রবেশের চেষ্টা (HTTP 403)
- `ROUTE_ACCESS_DENIED`: রাউট গার্ড দ্বারা বাধা
- `PERMISSION_DENIED`: প্রয়োজনীয় পারমিশন অনুপস্থিত থাকায় অ্যাকশন বাতিল

### ৩.৩ ভূমিকা ও নিরাপত্তা ইভেন্টস (Role & Security Events)
- `ROLE_ASSIGNED`: ব্যবহারকারীকে ভূমিকা অর্পণ
- `ROLE_REMOVED`: ব্যবহারকারীর ভূমিকা প্রত্যাহার
- `PRIVILEGE_ESCALATION_BLOCKED`: নিজের ভূমিকা নিজে বাড়ানো বা সেলফ-সাসপেনশনের চেষ্টা অবরুদ্ধ

### ৩.৪ ব্যবহারকারী নিরাপত্তা ইভেন্টস (User Security Events)
- `USER_SUSPENDED`: ব্যবহারকারী অ্যাকাউন্ট স্থগিতকরণ
- `USER_ACTIVATED`: ব্যবহারকারী অ্যাকাউন্ট সক্রিয়করণ
- `USER_ARCHIVED`: ব্যবহারকারী অ্যাকাউন্ট সংরক্ষণ/আর্কাইভ
- `USER_STATUS_CHANGED`: অন্যান্য স্ট্যাটাস পরিবর্তন

### ৩.৫ সেশন ইভেন্টস (Session Events)
- `SESSION_CREATED`: নতুন সেশন উৎপত্তি
- `SESSION_TERMINATED`: অ্যাডমিন দ্বারা দূরবর্তী সেশন সমাপ্তি
- `SESSION_TERMINATION_FAILED`: সেশন সমাপ্তিতে ত্রুটি

---

## ৪. অপরিবর্তনীয়তা নীতি (Audit Immutability Policy)
- অডিট রেকর্ডসমূহ **Append-Only**; একবার রচিত হলে ডেটাবেজ বা স্টোরেজে কোনো রূপ এডিট বা ডিলিট মেথড উন্মুক্ত নয়।
- রিপোজিটরিতে কোনো মিউটেশন রিকোয়েস্টে সরাসরি `UnsupportedError('Security audit records are immutable and cannot be updated or deleted')` থ্রো করা হয়।
- কোনো সংশোধন বা প্রশাসনিক পদক্ষেপ নেওয়া হলে পূর্ববর্তী রেকর্ড পরিবর্তন না করে নতুন সংশোধন ইভেন্ট সংযোজন করা হয়।

---

## ৫. তথ্য গোপনীয়তা ও ডেটা মাস্কিং (Privacy & Secret Protection)
- কোনো পাসওয়ার্ড, পাসওয়ার্ড হ্যাশ, এক্সেস টোকেন, রিফ্রেশ টোকেন বা কাঁচা সিক্রেট অডিট লগে সংরক্ষণ করা সম্পূর্ণ নিষিদ্ধ।
- UI এবং পাবলিক ভিউতে সংবেদনশীল তথ্য মাস্কিং বাধ্যতামূলক:
  - **মোবাইল নম্বর**: `017****0001`
  - **ইমেইল**: `a***n@tijarah.org`
  - **আইপি অ্যাড্রেস**: `192.168.***.***`
  - **সেশন আইডি**: `sess_***_01`
