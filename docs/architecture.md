# আর্কিটেকচার ডিজাইন ডকুমেন্টেশন (Architecture Specification)

## ১. ওভারভিউ

"তিজারাহ সমিতি সফটওয়্যার" একটি এন্টারপ্রাইজ-গ্রেড, স্কেলেবল মোবাইল আর্কিটেকচার অনুসরণ করে।

```text
[ Presentation Layer ] (UI, Screens, Widgets, Shell)
        │
        ▼ (calls UseCase)
[ Domain Layer ] (Entities, UseCases, Repository Contracts)
        │
        ▲ (implements contract)
[ Data Layer ] (Models, DataSources, Repository Implementations)
        │
        ▼ (network/storage)
[ Core Layer ] (ApiClient, Network, Storage, Exceptions)
```

## ২. লেয়ারের দায়িত্ব ও সীমা

### Presentation Layer
* **কোডের অবস্থান:** `lib/features/`, `lib/shared/`
* **দায়িত্ব:** ব্যবহারকারীর কাছে তথ্য উপস্থাপন এবং ইনপুট গ্রহণ।
* **সীমাবদ্ধতা:** কোনো Business Calculation বা সরাসরি API রিকোয়েস্ট তৈরি করতে পারবে না।

### Domain Layer
* **কোডের অবস্থান:** `lib/domain/`
* **দায়িত্ব:** প্রজেক্টের কোর বিজনেস লজিক, রুলস ও এন্টিটি ধারণ করা।
* **সীমাবদ্ধতা:** কোনো থার্ড-পার্টি লাইব্রেরি বা Flutter UI নির্ভরতা থাকবে না (পিওর ডার্ট)।

### Data Layer
* **কোডের অবস্থান:** `lib/data/`
* **দায়িত্ব:** দূরবর্তী Django REST API এবং স্থানীয় Secure Storage থেকে ডেটা রিট্রিভ ও ফরম্যাট করা।
* **সীমাবদ্ধতা:** উপস্থাপনা বা প্রেজেন্টেশন লজিক স্পর্শ করবে না।

### Core Layer
* **কোডের অবস্থান:** `lib/core/`
* **দায়িত্ব:** ক্রসবর্ডার ইউটিলিটি, এরর ক্যাচিং, গ্লোবাল লগিং এবং নেটওয়ার্ক কমিউনিকেশন।

---

## ৩. Phase 2 — Organization Management Foundation (Prompt 2.1)

### ক. সংগঠন পরিচিতি ও উদ্দেশ্য
সফটওয়্যারে একটি সমিতি/প্রতিষ্ঠান/ব্যবসার আইনি ও দাপ্তরিক পরিচিতি, ইউনিক আইডেন্টিফায়ার এবং সিকিউর মাল্টি-টেন্যান্ট বাউন্ডারি নির্ধারণ করে।

### খ. ডোমেন ও সত্ত্বা বাউন্ডারি (Domain Boundary)
* **Entity:** `Organization` (`lib/domain/entities/organization.dart`)
* **Value Types:**
  - `OrganizationType`: `society` (সমবায়/সাধারণ সমিতি), `business` (ব্যবসায়িক পার্টনারশিপ), `social` (সামাজিক সংগঠন), `other` (অন্যান্য প্রতিষ্ঠান)
  - `OrganizationStatus`: `active` (সক্রিয়), `inactive` (নিষ্ক্রিয়), `suspended` (স্থগিত), `archived` (আর্কাইভকৃত)
* **অপরিবর্তনীয় ফিল্ড (Immutable):** `id` (Tenant UUID/Identifier) এবং `organizationCode` (অনন্য রেফারেন্স কোড)।
* **সম্পাদনাযোগ্য ফিল্ড:** `name`, `shortName`, `organizationType`, `phone`, `email`, `address`, `description`, `logo`.

### গ. আর্কিটেকচারাল রুলস (Scope Discipline)
1. **No Financial Scope Leakage:** Organization Entity-তে কোনো ব্যালেন্স, ইনকাম, এক্সপেন্স বা আর্থিক হিসাব থাকবে না।
2. **No Hard Delete:** ডেটাবেজ থেকে সমিতি স্থায়ীভাবে মোছা নিষিদ্ধ। শুধুমাত্র স্ট্যাটাস পরিবর্তন (`updateOrganizationStatus`) অনুমোদিত।
3. **Organization Ownership:** প্রতিটি বিজনেস এন্ট্রি (সদস্য, হিসাব, লেনদেন) সক্রিয় `Organization` আইডিতে আবদ্ধ থাকবে।

### ঘ. স্টেট ম্যানেজমেন্ট ও কনটেক্সট (OrganizationContext)
* **অবস্থান:** `lib/core/context/organization_context.dart`
* **প্যাটার্ন:** Singleton `ChangeNotifier`
* **সিঙ্ক পলিসি:**
  - মেমোরি ক্যাশ (`activeOrganization`)
  - লোকাল স্টোরেজ ক্যাশ (`LocalStorageService`)
  - সিকিউর স্টোরেজ সিঙ্ক (`SecureStorageService` → `X-Organization-Id` হেডার)
* **রিঅ্যাক্টিভ উইজেট:** `AppNavigationShell` `AnimatedBuilder`-এর মাধ্যমে টাইটেল বার ও ড্রয়ার আপডেট করে।

### ঙ. ডেমো ডাটা আইসোলেশন নীতি (Demo Policy)
* "খুরুশকুল ওলামা সমিতি" (`DEMO-KHU-001`) শুধুমাত্র UI ও নেভিগেশন পরীক্ষার জন্য সংরক্ষিত।
* `AppConfig.isProduction` সত্য হলে ডেমো মোড ব্লক থাকবে। প্রোডাকশনে কোনো ডেমো ডাটা দিয়ে কাজ করা যাবে না।

---

## ৪. Phase 2 — Authentication & Session Management (Prompt 2.2)

### ক. আর্কিটেকচারাল নীতি ও দায়িত্ব
* **Authentication ("আমি কে?"):** শুধুমাত্র ব্যবহারকারীর পরিচয় ও বৈধ সেশন নিশ্চিত করে। পারমিশন বা রোল অথরাইজেশন পরবর্তী প্রম্পটের বিষয়।
* **জিরো প্লেইনটেক্সট নীতি:** পাসওয়ার্ড কখনোই মেমোরির বাইরে SharedPreferences বা ক্যাশে সেভ করা নিষিদ্ধ।
* **এনক্রিপ্টেড স্টোরেজ:** অ্যাক্সেস ও রিফ্রেশ টোকেন হার্ডওয়্যার এনক্রিপ্টেড `SecureStorageService` দ্বারা সংরক্ষিত।

### খ. ডোমেন ও সত্ত্বা বাউন্ডারি
* **Entities:**
  - `AuthenticatedUser`: ব্যবহারকারী আইডি, কোড, নাম, ইমেইল, ফোন, অর্গানাইজেশন আইডি ও স্ট্যাটাস।
  - `AuthenticationSession`: অ্যাক্সেস টোকেন, রিফ্রেশ টোকেন, মেয়াদোত্তীর্ণ সময়, ইউজার রেফারেন্স ও লগইন মেথড।
* **Use Cases:**
  - `LoginUseCase`: ক্রেডেনশিয়াল ভ্যালিডেশন ও সেশন স্থাপন।
  - `LogoutUseCase`: রিমোট ও লোকাল সেশন পার্জিং।
  - `RestoreSessionUseCase`: অ্যাপ চালুর সময় প্রি-অথেনটিকেটেড সেশন রিট্রিভ ও রিফ্রেশ।
  - `RefreshSessionUseCase`: অ্যাক্সেস টোকেন রিনিউয়াল।

### গ. কনকারেন্ট রিফ্রেশ স্টর্ম প্রটেকশন (Mutex Queue)
* `ApiClient` ও `AuthenticationRepositoryImpl`-এ `Completer<String?>` ব্যবহার করে একটি গ্লোবাল রিফ্রেশ লক বলবৎ করা হয়েছে।
* একাধিক সমসাময়িক ৪০১ রিকোয়েস্ট একই রিফ্রেশ ফিউচারে আবদ্ধ থাকে, ফলে সার্ভারে রিফ্রেশ স্টর্ম ঘটে না।
* রিফ্রেশ ব্যর্থ হলে ক্লায়েন্ট `sessionExpired` স্টেটে স্থানান্তরিত হয় এবং ইউজারকে পুনরায় লগইন করতে অনুরোধ করে।

### ঘ. OrganizationContext ইন্টিগ্রেশন
* সফল লগইনের পর ব্যবহারকারীর অর্গানাইজেশন আইডি স্বয়ংক্রিয়ভাবে `OrganizationContext`-এ সিঙ্ক হয়।
* পরবর্তী সকল আউটগোয়িং রিকোয়েস্টে `X-Organization-Id` হেডার ও `Authorization: Bearer <token>` ইনজেক্ট করা হয়।

---

## ৫. Phase 2 — Roles & Permission Architecture (Prompt 2.3)

### ক. আর্কিটেকচারাল মূলনীতি
* **Role ≠ Permission:** ইউজার রোল ধারণ করে, রোল পারমিশন ধারণ করে। ইউআই বা সার্ভারে হার্ডকোডেড রোল নেম দিয়ে সিকিউরিটি ডিসিশন নেওয়া নিষিদ্ধ; সর্বদা ডট-নোটেশন পারমিশন কী (`can('finance.transaction.create')`) ব্যবহার করতে হবে।
* **Authentication ≠ Authorization:** প্রমাণীকরণ (৪০১ — ইউজার কে?) এবং প্রবেশাধিকার (৪০৩ — কী করতে পারবেন?) সুস্পষ্টভাবে পৃথক।
* **আর্থিক দায়িত্ব পৃথকীকরণ নীতি (Segregation of Duties):**
  - `View ≠ Manage`
  - `Create ≠ Approve`
  - `Approve ≠ Reverse`
  - `Reverse ≠ Delete` (আর্থিক লেনদেনে কোনো পার্মানেন্ট ডিলিট পারমিশন নেই; ভুল হলে সমপরিমাণ বিপরীতমুখী রিভার্সাল এন্ট্রি প্রযোজ্য)।
* **স্বীয় অনুমোদন সম্পূর্ণ নিষিদ্ধ (Self-Approval Prohibited):** লেনদেন প্রস্তুতকারী কর্মকর্তা কোনো অবস্থাতেই নিজের তৈরিকৃত লেনদেন নিজে অনুমোদন করতে পারবেন না (`creator_user_id != approver_user_id`)।
* **ক্লায়েন্ট গার্ড বনাম সার্ভার সিকিউরিটি:** ক্লায়েন্টে ইউআই এলিমেন্ট লুকানো বা ডিজেবল করা কেবল একটি ব্যবহারিক অভিজ্ঞতা (UX Optimization)। ব্যাকএন্ড এপিআই (Django REST Framework) হলো চূড়ান্ত সিকিউরিটি অথরিটি।

### খ. ডোমেন ও সত্ত্বা বাউন্ডারি
* **Entities:**
  - `Permission`: কী, নাম, মডিউল, রিসোর্স, অ্যাকশন, সিস্টেম ফ্ল্যাগ ও সক্রিয় স্ট্যাটাস।
  - `Role`: আইডি, অর্গানাইজেশন আইডি, কী, নাম, বিবরণ, সিস্টেম রোল ফ্ল্যাগ ও পারমিশন কী তালিকা।
  - `RolePermission`: রোল-পারমিশন ম্যাপিং সত্ত্বা।
  - `RolePermissionAuditRecord`: পরিবর্তন অডিট ট্রেইল (অ্যাক্টর আইডি, টাইমস্ট্যাম্প, পূর্ববর্তী ও বর্তমান অবস্থা)।
* **৭টি অপরিবর্তনীয় সিস্টেম রোল (System Roles):**
  - `super_admin` (সুপার অ্যাডমিন)
  - `secretary` (সম্পাদক)
  - `treasurer` (কোষাধ্যক্ষ)
  - `collector` (আদায়কারী)
  - `accountant` (হিসাবরক্ষক)
  - `auditor` (নিরীক্ষক)
  - `member` (সাধারণ সদস্য)

### গ. সেন্ট্রাল সার্ভিস ও উইজেট
* `AuthorizationService`: সেন্ট্রালাইজড ইঞ্জিন (`can`, `canAny`, `canAll`, `hasRole`, `checkSelfApprovalPolicy`, `canApproveTransaction`, `clearCache`)।
* `PermissionGuard`: ডেকোরেটর উইজেট (`hide`, `disable`, `accessDenied`, `customFallback`)।
* `RoutePermissionGuard` & `AccessDeniedScreen`: রুট-লেভেল প্রোটেকশন ও স্ট্যান্ডার্ড ৪০৩ বাংলা স্ক্রিন।

---

## ৬. Phase 2 — User Management & Role Assignment (Prompt 2.4)

### ক. আর্কিটেকচারাল মূলনীতি
* **User Management ≠ Member Management:** ব্যবহারকারী অ্যাকাউন্ট ব্যবস্থাপনা (সফটওয়্যার আইডেন্টিটি ও ভূমিকা) এবং সদস্য ব্যবস্থাপনা (সমিতির আর্থিক সদস্যপদ ও মূলধন) সুস্পষ্টভাবে পৃথক রাখা হয়েছে।
* **User → Role → Permission মডেল:** ব্যবহারকারীকে সরাসরি কোনো অনুমতি দেওয়া হয় না; ব্যবহারকারী এক বা একাধিক ভূমিকা (`Role`) ধারণ করেন এবং প্রতিটি ভূমিকা সংশ্লিষ্ট অনুমতি বা পারমিশন কী ধারণ করে। একাধিক ভূমিকার ক্ষেত্রে কার্যকরী অনুমতি তাদের ইউনিয়ন হিসেবে নির্ধারিত হয়।
* **Multi-tenant Organization Isolation:** প্রতিটি ব্যবহারকারী নির্দিষ্ট `organizationId` দ্বারা সংরক্ষিত। ক্রস-অর্গানাইজেশন অ্যাক্সেস ডেটাবেজ ও রিপোজিটরি স্তরে সম্পূর্ণ অবরুদ্ধ।
* **Privilege Escalation Protection:** কোনো ব্যবহারকারী নিজে নিজের ভূমিকা বা স্ট্যাটাস পরিবর্তন করে উচ্চতর সুবিধাপ্রাপ্ত হতে পারেন না।
* **অপরিবর্তনীয় অডিট ট্রেইল:** ভূমিকা অর্পণ (`ROLE_ASSIGNED`), ভূমিকা প্রত্যাহার (`ROLE_REMOVED`) এবং স্ট্যাটাস পরিবর্তনের প্রতিটি ক্ষেত্রে অপরিবর্তনীয় অডিট রেকর্ড সংরক্ষিত হয়।

---

## ৭. Phase 2 — Security Audit, Session Security & Security Event Management (Prompt 2.5)

### ক. আর্কিটেকচারাল মূলনীতি
* **Security Audit ≠ Business/Financial Audit:** এটি কোনো ক্যাশ বুক বা সদস্য লেজার নয়। এটি শুধুমাত্র অথেনটিকেশন, অথরাইজেশন, রোল অ্যাসাইনমেন্ট এবং সেশনের নিরাপত্তা ইভেন্ট ট্রেইল।
* **Append-Only Immutability:** কোনো অডিট রেকর্ড এডিট বা ডিলিট করা যায় না। স্টোরেজ ও রিপোজিটরিতে মিউটেশন অপারেশন `UnsupportedError` দ্বারা অবরুদ্ধ।
* **Privacy-First Data Protection:** কোনো পাসওয়ার্ড, টোকেন বা সিক্রেট অডিট রেকর্ড অথবা সেশন অবজেক্টে রাখা নিষিদ্ধ। ক্লায়েন্ট আইপি, মোবাইল, ইমেইল ও সেশন আইডি মাস্কড ফরম্যাটে সংরক্ষিত ও প্রদর্শিত হয়।
* **সেশন নিরাপত্তা ও দূরবর্তী সমাপ্তি:** প্রতিটি সক্রিয় সেশন পর্যবেক্ষণযোগ্য এবং অনুমোদিত অ্যাডমিন সুনির্দিষ্ট কারণ উল্লেখপূর্বক যেকোনো ঝুঁকিপূর্ণ সেশন অবিলম্বে বাতিল (`SESSION_TERMINATED`) করতে পারেন।

---

## ৮. Phase 3 — Member Management Foundation (Prompt 3.1 & 3.2)

### ক. আর্কিটেকচারাল মূলনীতি
* **Member ≠ User:** সমিতির সদস্য (Member) এবং সফটওয়্যার ব্যবহারকারী (User) দুটি সম্পূর্ণ পৃথক সত্ত্বা। কোনো সদস্য সৃষ্টি বা বিলুপ্তিতে ইউজার অ্যাকাউন্ট সৃষ্টি বা বিলুপ্ত হয় না।
* **সদস্য কোড নীতি:** প্রতিটি প্রতিষ্ঠানে স্বয়ংক্রিয় ও অনন্য ক্রমানুসারে সদস্য কোড (`MEM-000001`, `MEM-000002`...) প্রস্তুত হয়।
* **মাল্টি-টেন্যান্ট আইসোলেশন:** প্রতিটি সদস্য নির্দিষ্ট `organizationId` দ্বারা সংরক্ষিত। এক সমিতির সদস্য অন্য কোনো সমিতি থেকে দেখা বা পরিচালনা করা যাবে না।
* **হার্ড-ডিলিট সম্পূর্ণ নিষিদ্ধ:** ডাটাবেজ থেকে সদস্যের তথ্য স্থায়ীভাবে মোছা যায় না। স্ট্যাটাস লাইফসাইকেল (`active`, `inactive`, `suspended`, `archived`) এবং কারণ দর্শানো সাপেক্ষে স্ট্যাটাস ট্রানজিশন সমর্থিত।
* **সংবেদনশীল ডাটা ও আর্থিক বাউন্ডারি:** সদস্য তালিকা স্ক্রিনে NID উন্মুক্ত নয়; কোনো শেয়ার, সঞ্চয় বা আর্থিক হিসাব Prompt 3.1 বা 3.2-এ যুক্ত নয় (পরবর্তী নির্ধারিত ফেজে অর্পিত হবে)।

---

## ৯. Phase 3 — Membership Application, Verification & Approval Workflow (Prompt 3.3)

### ক. আর্কিটেকচারাল মূলনীতি
* **Application ≠ Member:**
  ```text
  MembershipApplication ≠ Member
  Pending Application has zero financial impact.
  ```
  - একটি আবেদন (MembershipApplication) যে কোনো অমীমাংসিত বা পর্যালোচনামূলক অবস্থায় (Draft, Submitted, UnderReview, CorrectionRequired, Resubmitted) থাকুক না কেন, তা কখনই সদস্য (Member) হিসেবে গণ্য হবে না।
  - **Zero Financial Impact:** কোনো খসড়া বা বিচারাধীন আবেদন শেয়ার, সঞ্চয়, ডিপিএস, ঋণ, চাঁদা, আয়, ব্যয় বা সাধারণ লেজারে কোনো প্রকার ব্যালেন্স বা লেনদেনের প্রভাব ফেলে না।
* **Sequential Application Code:** প্রতিটি সমিতিতে ক্রমানুসারে `APP-000001` থেকে `APP-999999` ফরম্যাটে ইউনিক ও অপরিবর্তনীয় কোড বরাদ্দ হয়।
* **State Machine Integrity:**
  - স্টেটসমূহ: `Draft` → `Submitted` → `UnderReview` → `CorrectionRequired` / `Resubmitted` → `Approved` / `Rejected` / `Withdrawn`
  - টার্মিনাল স্টেট: `Approved`, `Rejected`, এবং `Withdrawn` থেকে কোনো ব্যাকওয়ার্ড ট্রানজিশন সম্ভব নয়।
* **Separation of Duties (প্রস্তুতকারী ≠ অনুমোদনকারী):**
  - যে কর্মকর্তা আবেদনটি প্রস্তুত (`createdBy`) করেছেন, তিনি নিজে তা অনুমোদন করতে পারেন না (`creatorUserId !== approverUserId`)।
* **Double Approval & Concurrency Protection:**
  - কনকারেন্সি রেস ও ডাবল অ্যাপ্রুভাল কঠোরভাবে অবরুদ্ধ; একবার অনুমোদিত হলে পুনরায় অনুমোদন প্রতিরোধ করা হয় এবং একবারই মাত্র অনন্য `MEM-XXXXXX` সদস্য সৃষ্টি হয়।
* **NID Privacy & Data Security:**
  - তালিকায় NID সম্পূর্ণ অনুপস্থিত; বিস্তারিত স্ক্রিনে ডিফল্টভাবে মাস্কড (`********1234`) থাকে। শুধুমাত্র অনুমোদিত রিভিউর পারমিশন থাকলে উন্মুক্ত করা যায়। অডিট লগ বা ইউআরএল প্যারামিটারে কোনো র এনআইডি সংরক্ষিত হয় না।








