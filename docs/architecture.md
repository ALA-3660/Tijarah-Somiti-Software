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

