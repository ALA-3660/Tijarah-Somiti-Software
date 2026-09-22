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
│   ├── authentication/            # অথেনটিকেশন মডিউল প্লেসহোল্ডার
│   ├── dashboard/                 # অ্যাপ্লিকেশন শেল ও ফাউন্ডেশন ড্যাশবোর্ড
│   └── organization/              # মাল্টি-টেন্যান্ট কনটেক্সট কন্ট্রোল
│
├── shared/
│   ├── layouts/                   # AppScaffold ও কমন ফ্রেম
│   └── widgets/                   # PrimaryButton, AppCard, AppLoading, AppError ইত্যাদি
│
└── main.dart                      # Flutter মূল বুটস্ট্র্যাপ ফাইল
```

---

## ৫. গুরুত্বপূর্ণ ডেভেলপমেন্ট রুলসমূহ (Core Rules)

### রুল ২১: আর্থিক ডেটার ত্রি-মাত্রিক নীতি (Head ≠ Fund ≠ Account)
* **খাত (Head):** টাকা কেন এসেছে বা খরচ হয়েছে (যেমন: সদস্য ভর্তি ফি, অফিস ভাড়া, কম্পিউটার ক্রয়)।
* **তহবিল (Fund):** টাকা কোন উদ্দেশ্যে বরাদ্দ (যেমন: সাধারণ তহবিল, যাকাত/কল্যাণ তহবিল, বিনিয়োগ তহবিল)।
* **হিসাব (Account):** টাকা বাস্তবিকভাবে কোথায় রাখা আছে (যেমন: ক্যাশ বাক্স, ইসলামী ব্যাংক সঞ্চয়ী হিসাব, বিকাশ মার্চেন্ট)।

### রুল ২২: অডিট ট্রেইল ও নো ডিরেক্ট ডিলিট (Audit-ready Trail)
* ইসলামি শরিয়াহ ও আর্থিক স্বচ্ছতার জন্য কোনো ফিন্যান্সিয়াল রেকর্ড সরাসরি ডিলিট করা যাবে না।
* প্রতিটি রেকর্ডের সঙ্গে `created_by`, `created_at`, `approved_by`, `approved_at`, `status` থাকবে। সংশোধনের ক্ষেত্রে রিভার্সাল এন্ট্রি প্রযোজ্য হবে।

### মাল্টি-টেন্যান্ট ডেটা আইসোলেশন
* প্রতিটি API কলে স্বয়ংক্রিয়ভাবে `X-Organization-Id` হেডার পাঠানো হয়।
* এক সমিতির সদস্য বা তথ্য অপর কোনো সমিতির সাথে মিশে যাওয়া সম্পূর্ণ অসম্ভব।

---

## ৬. অ্যাপটি রান করার নিয়ম (How to Run)

### পূর্বশর্ত
* Flutter SDK (3.10.0 বা তদূর্ধ্ব)
* Android Studio / VS Code
* Android SDK & Emulator

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

* **সম্পন্ন:** Prompt 1.1 — Project Foundation & Architecture (COMPLETE)
* **পরবর্তী ধাপ:** Prompt 1.2 — Typography, Detailed Design System & Extended Navigation Shell.
