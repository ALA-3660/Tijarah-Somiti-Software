# তিজারাহ সমিতি সফটওয়্যার (Tijarah Samity Software)

> **ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা।**

তিজারাহ সমিতি সফটওয়্যার হলো হালাল ব্যবসা ও ইসলামি শরীয়াহ নীতিসম্মত সমবায় সমিতি পরিচালনার জন্য একটি অত্যাধুনিক, প্রোডাকশন-গ্রেড মোবাইল অ্যাপ্লিকেশন। এই প্ল্যাটফর্মটি ভবিষ্যতে যেকোনো বৈধ ও হালাল বাণিজ্য পরিচালনাকারী সমিতি বা সংস্থার জন্য সম্পূর্ণ স্কেলেবল।

---

## ১. প্রজেক্ট পরিচিতি ও উদ্দেশ্য (Project Overview)

* **অ্যাপের নাম:** তিজারাহ সমিতি সফটওয়্যার
* **মূল উদ্দেশ্য:** ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা
* **টার্গেট প্ল্যাটফর্ম:** Android-first (Flutter & Dart)
* **ফিউচার ব্যাকএন্ড আর্কিটেকচার:** Django REST Framework + PostgreSQL
* **মাল্টি-টেন্যান্ট সাপোর্ট:** একাধিক স্বাধীন সমিতি ও তাদের সম্পূর্ণ ডেটা আইসোলেশন নিশ্চিত করা

---

## ২. প্রযুক্তিগত ভিত্তি (Technology Foundation)

```text
📱 Flutter Android App (Clean Layered Architecture)
              ↓ [HTTPS / JSON / JWT]
   🌐 REST API / Repository Layer
              ↓ [X-Organization-Id + Bearer Token]
      🐍 Django REST Framework
              ↓ [Row Level Security / Tenant Filtering]
      🐘 PostgreSQL Database
```

---

## ৩. আর্কিটেকচার লেয়ারিং (Architecture Layers)

অ্যাপ্লিকেশনটি কঠোরভাবে **Clean Layered Architecture** নীতি মেনে ডিজাইন করা হয়েছে যাতে UI, Business Logic এবং Data Access পরস্পরের সাথে টাইটলি কাপলড না থাকে:

1. **Presentation Layer (`lib/features/`, `lib/shared/`):**
   * UI, Screen, Widget, Dialog, State Management
   * কোনো সরাসরি ডাটাবেজ বা নেটওয়ার্ক কল থাকে না।
2. **Domain Layer (`lib/domain/`):**
   * Business Entities (`Organization`, `User`, `AuditMeta`, `FinancialDimension`)
   * Repository Interfaces (`OrganizationRepository`, `AuthRepository`)
   * Use Cases (`GetCurrentOrganizationUseCase`, `SwitchOrganizationUseCase`)
   * সম্পূর্ণ ফ্রেমওয়ার্ক-স্বাধীন এবং পিওর ডার্ট কোড।
3. **Data Layer (`lib/data/`):**
   * Data Transfer Objects / Models (`OrganizationModel`, `UserModel`)
   * Remote Data Sources (`ApiClient` সমন্বিত)
   * Local Data Sources (`SecureStorage`, `LocalStorage`)
   * Repository Implementations
4. **Core Layer (`lib/core/`):**
   * সেন্ট্রাল কনফিগারেশন (`AppConfig`, `Environment`)
   * নেটওয়ার্ক ক্লায়েন্ট ও ইন্টারসেপ্টর (`ApiClient`)
   * এক্সেপশন ও ফেইলিউর মডেলিং (`AppException`, `Failure`)
   * টাইপ-সেফ ফলাফল হ্যান্ডলার (`Result<T>`)
   * সিকিউরিটি ও লগার (`AppLogger`, `SecureStorageService`)

---

## ৪. ফোল্ডার স্ট্রাকচার (Folder Structure)

```text
lib/
├── app/
│   ├── app.dart                   # মূল MaterialApp উইজেট
│   ├── config/                    # পরিবেশ ও কেন্দ্রীয় সেটিংস (AppConfig, Environment)
│   ├── router/                    # সেন্ট্রালাইজড নেভিগেশন (RouteNames, AppRouter)
│   └── theme/                     # থিম ও কালার সিস্টেম (AppColors, AppTheme)
│
├── core/
│   ├── constants/                 # স্টোরেজ কি, হেডার ও এন্ডপয়েন্ট তালিকা
│   ├── errors/                    # AppException ও Failure হায়ারার্কি
│   ├── logging/                   # নিরাপদ ও মাস্কড লগার
│   ├── network/                   # ApiClient, HttpMethod, NetworkInfo
│   ├── result/                    # টাইপ-সেফ Result<T> মন্যাদ
│   ├── storage/                   # SharedPreferences ও Hardware Keystore অ্যাবস্ট্রাকশন
│   └── utils/                     # তারিখ ফরম্যাটার ও UiState হ্যান্ডলার
│
├── domain/
│   ├── entities/                  # ডোমেইন অবজেক্ট (Organization, User, AuditMeta, FinancialDimension)
│   ├── repositories/              # রিপোজিটরির ইন্টারফেস কন্ট্রাক্ট
│   └── usecases/                  # সিঙ্গল-পারপাস বিজনেস লজিক
│
├── data/
│   ├── datasources/
│   │   ├── local/                 # লোকাল ক্যাশ ও সেশন স্টোরেজ
│   │   └── remote/                # রিমোট Django REST API ক্লায়েন্ট
│   ├── models/                    # JSON DTO মডেলসমূহ
│   └── repositories/              # ডোমেইন রিপোজিটরির বাস্তবায়ন
│
├── features/
│   ├── authentication/            # পূর্ণাঙ্গ অথেনটিকেশন ও সেশন ম্যানেজমেন্ট (Prompt 2.2)
│   │   ├── domain/                # AuthenticatedUser, AuthenticationSession, Use Cases
│   │   ├── data/                  # RemoteDataSource, RepositoryImpl, Models
│   │   └── presentation/          # AuthenticationController, LoginScreen (বাংলা UI)
│   ├── dashboard/                 # অ্যাপ্লিকেশন শেল ও ফাউন্ডেশন ড্যাশবোর্ড
│   └── organization/              # মাল্টি-টেন্যান্ট কনটেক্সট ও সংগঠন প্রোফাইল (Prompt 2.1)
│
├── shared/
│   ├── layouts/                   # AppScaffold ও ২-স্তর সাইডবার ফ্রেম
│   └── widgets/                   # PrimaryButton, AppCard, AppLoading, AppError ইত্যাদি
│
└── main.dart                      # Flutter মূল বুটস্ট্র্যাপ ফাইল
```

---

## ৫. গুরুত্বপূর্ণ ডেভেলপমেন্ট রুলসমূহ (Core Rules)

### রুল ২১: আর্থিক ডেটার ত্রি-মাত্রিক নীতি (Head ≠ Fund ≠ Account)
* **খাত (Head):** টাকা কেন এসেছে বা খরচ হয়েছে (যেমন: সদস্য ভর্তি ফি, অফিস ভাড়া, কম্পিউটার ক্রয়)।
* **তহবিল (Fund):** টাকা কোন উদ্দেশ্যে বরাদ্দ (যেমন: সাধারণ তহবিল, বিনিয়োগ তহবিল)।
* **হিসাব (Account):** টাকা বাস্তবিকভাবে কোথায় রাখা আছে (যেমন: ক্যাশ বাক্স, ইসলামী ব্যাংক সঞ্চয়ী হিসাব)।

### রুল ২২: অডিট ট্রেইল ও নো ডিরেক্ট ডিলিট (Audit-ready Trail)
* ইসলামি শরিয়াহ ও আর্থিক স্বচ্ছতার জন্য কোনো ফিন্যান্সিয়াল রেকর্ড সরাসরি ডিলিট করা যাবে না।
* প্রতিটি রেকর্ডের সঙ্গে `created_by`, `created_at`, `approved_by`, `approved_at`, `status` থাকবে। সংশোধনের ক্ষেত্রে রিভার্সাল এন্ট্রি প্রযোজ্য হবে।

### মাল্টি-টেন্যান্ট ডেটা আইসোলেশন ও অথেনটিকেশন সুরক্ষা (Prompt 2.1 & 2.2)
* প্রতিটি API কলে স্বয়ংক্রিয়ভাবে `X-Organization-Id` হেডার এবং `Authorization: Bearer <token>` পাঠানো হয়।
* পাসওয়ার্ড কখনোই লোকাল স্টোরেজ বা লগ ফাইলে সেভ হয় না।
* অ্যাক্সেস ও রিফ্রেশ টোকেন হার্ডওয়্যার এনক্রিপ্টেড `SecureStorageService` দ্বারা সংরক্ষিত।
* একাধিক কনকারেন্ট ৪০১ রিকোয়েস্টে রিফ্রেশ স্টর্ম প্রতিরোধের জন্য গ্লোবাল মিউটেক্স লক কার্যকর।

---

## ৬. অ্যাপটি রান করার নিয়ম (How to Run)

### পূর্বশর্ত
* Flutter SDK (3.10.0 বা তদূর্ধ্ব)
* Android Studio / VS Code
* Android SDK & Emulator
* Web Preview: Node.js 18+ (`npm run dev`)

### কমান্ডসমূহ
```bash
# ডিপেন্ডেন্সি ইনস্টল
flutter pub get

# ডেভেলপমেন্ট মোডে রান (Android Emulator)
flutter run

# নির্দিষ্ট ফ্লেভার বা এন্ট্রি পয়েন্ট রান
flutter run -t lib/main.dart
```

---

## ৭. বর্তমান অবস্থা ও পরবর্তী ধাপ

* **Phase 1 — COMPLETE → LOCKED**
  * Prompt 1.1 — Project Foundation & Architecture (LOCKED)
  * Prompt 1.2 — Design System & Typography (LOCKED)
  * Prompt 1.3 — Main Navigation & Sidebar Architecture (LOCKED)
  * Prompt 1.4 — Reusable UI Components & Application States (LOCKED)
  * Prompt 1.5 — Phase 1 Final Verification & Quality Gate (LOCKED)
* **Phase 2 — Organization, Users, Roles & Security (COMPLETE → LOCKED)**
  * Prompt 2.1 — Organization Management Foundation (COMPLETE → LOCKED)
  * Prompt 2.2 — Authentication & Session Management (COMPLETE → LOCKED)
  * Prompt 2.3 — Roles & Permission Architecture (COMPLETE → LOCKED)
    * Role ≠ Permission & Authentication ≠ Authorization decoupled architecture
    * Centralized `AuthorizationService` (`can()`, `canAny()`, `canAll()`)
    * Reusable `PermissionGuard` UI widget with hide, disable, and accessDenied modes
    * Financial segregation of duties (`Create ≠ Approve ≠ Reverse`) and Self-Approval Prohibition
    * Comprehensive permission catalog with 7 standard system roles & Bengali terminology
    * Complete unit, model, segregation, and widget tests
  * Prompt 2.4 — User Management & Role Assignment (COMPLETE → LOCKED)
    * User Management ≠ Member Management architecture enforced
    * User → Role → Permission access control model
    * Multi-tenant Organization Isolation (`organizationId` scoped, Cross-org blocked)
    * User lifecycle: Active, Inactive, Suspended, Archived (Operational access blocked for suspended/archived)
    * Privilege Escalation Protection & Self-role assignment prohibited
    * Immutable audit trails for role assignment (`ROLE_ASSIGNED`), role removal (`ROLE_REMOVED`), and status changes
    * Responsive Desktop Master-Detail, Tablet, and Mobile UI (`/organization-security/users`)
    * Complete automated Unit, Repository, Widget, and Integration tests (Tests A through N)
  * Prompt 2.5 — Security Audit, Session Security & Security Event Management (COMPLETE → LOCKED)
    * Security Audit ≠ Business/Financial Audit segregation enforced
    * Centralized `SecurityEvent` catalog across 5 event categories
    * Append-only & Immutable Audit Trail (Mutations/Deletions strictly throw `UnsupportedError`)
    * Zero credential exposure & Privacy Masking (IP, Mobile, Email, Session IDs)
    * Active & Historical Session Management with Remote Session Termination
    * Strict 401 Unauthorized vs 403 Forbidden event mapping
    * Full integration with Auth (`loginSuccess`, `loginFailed`, `logout`, `tokenRefresh`) and User Management (`privilegeEscalationBlocked`)
    * Responsive Master-Detail Security Audit Screen (`/organization-security/security-audit` & `/organization-security/logs`) and Session Management Screen (`/organization-security/sessions`)
    * Complete automated Unit, Repository, Widget, and Integration tests (Tests A through P)
* **Phase 3 — Member Management (Prompts 3.1 - 3.6 COMPLETE & LOCKED)**
  * Prompt 3.1 — Member Management Foundation (COMPLETE → LOCKED)
  * Prompt 3.2 — Member Profile & Contact/Family Information (COMPLETE → LOCKED)
  * Prompt 3.3 — Membership Application, Verification & Approval Workflow (COMPLETE → LOCKED)
  * Prompt 3.4 — Member Classification, Relations & Configurable Master Data (COMPLETE → LOCKED)
  * Prompt 3.5 — Member Documents, Photos & Attachment Management (COMPLETE → LOCKED)
  * Prompt 3.6 — Member Register, Search, 360 View, Duplicate Engine & Final Integration (COMPLETE → LOCKED)
* **Phase 4.1 — Master Data Architecture Foundation (COMPLETE → LOCKED)**
  * Domain Separation: `Head ≠ Fund ≠ Account` (খাত ≠ তহবিল ≠ হিসাব)
  * Generic Extensible Architecture: `MasterDataDefinition` & `MasterDataItem`
  * System-Defined vs. Organization-Custom separation & code immutability
  * Stable Code Policy: organization-scoped uniqueness, whitespace normalization & zero duplicate codes
  * Lifecycle State Machine: Active → Inactive → Archived (Strictly No Hard Delete)
  * Historical Integrity: Renaming display names preserves stable code/ID references
  * Organization Isolation: Strict multi-tenant boundaries (Khurushkul vs Al-Falah)
  * RBAC & Audit: `master_data.view/create/edit/status_change/export/print` & Immutable Audit Logs
  * UI: Responsive Bengali Register, Search, Multi-Filter, UTF-8 CSV Export & Official A4 Print Layout
* **Phase 4.2 — Head Management Foundation (COMPLETE → LOCKED)**
  * Domain Separation: Head (কেন - কারণ/শ্রেণি) ≠ Fund (কোন উদ্দেশ্যে) ≠ Account (কোথায়) — No Financial Transaction
  * Head Domain Model: `id`, `organizationId`, `headCode`, `name`, `description`, `headType` (`income` | `expense`), `parentId`, `level` (1=Main, 2=Sub), `isSystemDefined`, `status`, `sortOrder`
  * Strict 2-Level Hierarchy: Main Head (level 1, parentId=null) → Sub Head (level 2, parentId=Main Head ID)
  * Hierarchy Rules: Type Consistency (Income Sub Head under Income Main, Expense Sub Head under Expense Main), No Cross-Org parent, No Circular/Self parent
  * Safe Deactivation Policy: Blocking deactivation/archival of Main Heads with active Sub Heads
  * Stable Code Policy: Immutable code after creation, organization-scoped uniqueness, case-insensitive duplicate prevention
  * UI/UX: Bengali-first Register, Interactive Tree View, Create/Edit Dialogs, Lifecycle Status Modal, UTF-8 CSV & A4 Print
  * Multi-tenant Isolation: Scoped to `organizationId`, complete data and parent isolation between organizations
  * RBAC & Security: `head.view`, `head.create`, `head.edit`, `head.status_change`, `head.export`, `head.print` (403 Forbidden feedback)
  * Audit Trail: Immutable lifecycle logging (`HEAD_CREATED`, `HEAD_UPDATED`, `HEAD_ACTIVATED`, `HEAD_DEACTIVATED`, `HEAD_ARCHIVED`)
* **Phase 4.3 — Income & Expense Head Classification & Integration (COMPLETE → LOCKED)**
  * Income & Expense Dual Classification: Strict immutability of `headType` (`income` | `expense`) post creation (No Income ↔ Expense conversion)
  * Parent-Child Type Integrity: Sub Heads restricted strictly to same-type Main Heads (`Income Main → Income Sub`, `Expense Main → Expense Sub`)
  * Unicode NFC Normalized Duplicate Engine: `normalizeText` preventing duplicate head names across whitespace & Unicode variants
  * Multi-view Integration: Integrated Register (All, Income, Expense views), Collapsible Hierarchical Tree View, Immutable Audit Log Timeline, and Domain Guide
  * Historical Data Integrity: Immutable Code, ID, Type and Organization references with Zero Hard Delete governance
  * Security & Isolation: Complete multi-tenant scoping, cross-organization ID tampering blocked, RBAC matrix enforced
* **Phase 4.4 — Fund Management Foundation (COMPLETE → LOCKED)**
  * Domain Architecture: `Fund` flat dimension entity (`Head ≠ Fund ≠ Account` preserved). No sub-funds or hierarchy.
  * Standard Fund Types: `general` (সাধারণ), `administrative` (প্রশাসনিক), `share` (শেয়ার মূলধন), `project` (প্রকল্প), `custom` (কাস্টম).
  * Scope Discipline: Completely free of prohibited religious funds (Zakat, Waqf, Sadaqa, Fitra, Emergency funds hardcoding omitted). Custom funds available per society needs.
  * Auto Code Generator & Immutability: Auto-generated sequential collision-free `FND-001`, `FND-002`... immutable post creation.
  * Zero Hard-Delete & Controlled Lifecycle: `Active ↔ Inactive → Archived` state machine with terminal archived state.
  * Duplicate Prevention Engine: Unicode NFC normalization (`normalizeText`) preventing duplicate names under same fund type within tenant.
  * Responsive Bengali UI: Fund Register with search, multi-filter (Type, Status, Origin), sorting, pagination, Detail 360 modal, UTF-8 CSV export & A4 print layout.
  * Multi-Tenant Isolation & RBAC: Organization context scoping (`X-Organization-Id`), simulated role switcher (Admin, Manager, Accountant, Viewer), and append-only immutable audit trail.
* **Phase 4.5 — Master Data Governance, Change History & Audit Foundation (COMPLETE → LOCKED)**
  * Reusable Master Data Governance Architecture: Centralized governance framework applying across all financial/master dimensions (Head, Fund, Member Master Data).
  * Strict Financial Dimension Separation: `Head (কেন)` ≠ `Fund (কোন উদ্দেশ্য/শ্রেণি)` ≠ `Account (কোথায়)` strictly preserved.
  * Immutable Identity Protection: Domain-level rejection of modifications to `id`, `organizationId`, stable codes (`headCode`, `fundCode`), `createdAt` and `createdBy`.
  * Append-Only Change History: Immutable `MasterDataChangeHistoryRecord` storing `beforeState`, `afterState`, `changedFields`, `reason`, `effectiveFrom`, and actor metadata.
  * Mandatory Audit Reason: Enforced non-empty change reasons for all sensitive actions (Update, Activate, Deactivate, Archive, Bulk Operations).
  * Safe Bulk Operations: Safe multi-item state transitions (Bulk Activate, Bulk Deactivate, Bulk Archive) with per-item validation, partial failure handling, and zero hard deletes.
  * Centralized Governance UI: Governance Summary Dashboard (NO financial balances), Audit Register with Bengali Unicode search, multi-dimension filter, Before/After Diff viewer, UTF-8 CSV export, and A4 print layout.
  * Multi-Tenant Isolation & RBAC: `X-Organization-Id` tenant boundary enforcement and RBAC matrix (`master_data.governance.view/history.view/change/bulk_change/export/print`) with 403 Forbidden feedback.
* **Phase 4.6 — Master Data & Head Management — Final Integration & Verification (COMPLETE → LOCKED)**
  * Cohesive Domain Integration: End-to-end integration of Head Management, Fund Management, and Master Data Governance.
  * Comprehensive Security & Multi-Tenant Scoping: Rigorous tenant isolation (`X-Organization-Id`) and RBAC matrix.
* **Phase 5.0 — TSS Brand Identity, Logo & Application-Wide Branding (COMPLETE → LOCKED)**
  * Official Branding: TSS (Tijarah Samity Software / তিজারাহ সমিতি সফটওয়্যার)
  * Identity Hierarchy: Software Brand (TSS) vs Organization Name separation
  * Assets & Config: Centralized branding configuration, SVG logo variants, A4 Report Headers/Footers, Favicon and HTML metadata.
* **Phase 5.1 — Account Management Foundation (COMPLETE → LOCKED)**
  * Domain Architecture: `Account` financial holding location entity (`Head ≠ Fund ≠ Account` preserved).
  * Account Types: `cash` (নগদ/ক্যাশ বাক্স) এবং `bank` (ব্যাংক অ্যাকাউন্ট).
  * Authoritative Lifecycle: `Active ↔ Inactive → Archived` with terminal archival protection & mandatory audit reasons.
  * Sensitive Data Security: Masked banking numbers (`******4589`), audited admin reveal flow (`ACCOUNT_SENSITIVE_REVEALED`), masked CSV export and A4 print view.
  * Fund Association Foundation: Many-to-Many association (`associatedFundIds`) strictly organization-scoped with zero cross-tenant leakage.
  * Shariah Boundary: Purely informational indicator / review metadata; TSS is NOT a Fatwa Engine or Halal/Haram Decision Engine.
  * Zero Financial Scope Leakage: Zero balances, ledgers, vouchers, transactions, or interest calculation engines.
  * Governance & Zero Hard Delete: 100% append-only audit trail and zero hard deletes.
* **Phase 5.2 — Financial Transaction Core (COMPLETE → LOCKED)**
  * Core Financial Backbone: Generic `FinancialTransaction` entity with positive numeric/decimal precision.
  * 4-Dimensional Accounting Architecture: `Head (কেন)` ≠ `Fund (উদ্দেশ্য/শ্রেণি)` ≠ `Account (কোথায়)` ≠ `Transaction (ঘটনা)` complete separation.
  * Authoritative Status Lifecycle: `DRAFT ➔ SUBMITTED ➔ APPROVED / REJECTED` with controlled resubmission (`REJECTED ➔ DRAFT ➔ SUBMITTED`).
  * Separation of Duties: Creator cannot approve own transaction (`createdBy !== approvedBy` enforced at domain and API levels with HTTP 403 response).
  * Official Balance Rule: Pending/Draft/Rejected transactions have 0.00 financial balance impact; only `APPROVED` transactions are eligible for the future Phase 5.7 Official Ledger.
  * Master Data Integrity: Cross-tenant master data references strictly blocked; archived accounts/funds/heads excluded from new transactions.
  * Concurrency & Idempotency: Optimistic locking token (`version`) and duplicate state transition prevention.
* **Phase 5.3 — Income Management (COMPLETE → READY TO LOCK)**
  * Unified Single Dynamic Income Entry: All 12 income types processed through a single configuration-driven dynamic form engine.
  * 12 Authoritative Income Types: Monthly fee, annual fee, admission + passbook, administrative fee, one-time fee, other fee, product sales, rental, other business income, asset sales, general donations, and other general receipts.
  * Bengali Currency Words Engine: Reactive `numberToBengaliWords` (কথায়: ... টাকা মাত্র) converter.
  * Strict Financial Dimension Separation: `Head (কেন)` ≠ `Fund (উদ্দেশ্য/শ্রেণি)` ≠ `Account (কোথায়)` ≠ `Payment Method (কীভাবে)`.
  * Administrative Expense Fund Lock: Hardcoded automatic locking of `প্রশাসনিক খরচের তহবিল` for Admission, Passbook & Annual Admin fees.
  * Separation of Duties & Immutability: `createdBy !== approvedBy` strictly enforced; zero edit/hard delete on `APPROVED` entries.
  * POS Thermal Receipt Engine: Official TSS-branded POS print simulation with full audit details and Bengali currency words.
* **পরবর্তী ধাপ:** Phase 5.4 — Expense Management (Do not start until Phase 5.3 is locked)।


