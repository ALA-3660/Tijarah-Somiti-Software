# তিজারাহ সমিতি সফটওয়্যার — নেভিগেশন ও সাইডবার আর্কিটেকচার (Prompt 1.3)

---

## ১. ওভারভিউ ও নেভিগেশন দর্শন (Architecture Overview)

তিজারাহ সমিতি সফটওয়্যার একটি আধুনিক, স্কেলেবল ও দুই স্তরভিত্তিক (2-Tier Dual-Sidebar) নেভিগেশন ফ্রেমওয়ার্ক অনুসরণ করে।

```
┌───────────────────────────┬───────────────────────────┬───────────────────────────────────────┐
│  স্তর ১ — Main Sidebar     │  স্তর ২ — Sub-sidebar     │  মেইন কনটেন্ট এরিয়া (Content Canvas)   │
│  (Parent Modules Only)    │  (Child Routes Only)      │  (Screen / Module Workspace)          │
│                           │                           │                                       │
│  • ড্যাশবোর্ড              │  [অর্থ ও হিসাব]            │  [ব্রেডক্রাম্ব / অর্গানাইজেশন ব্যাজ]    │
│  • সংগঠন ও নিরাপত্তা       │  ├── আয়                   │                                       │
│  • সদস্য ব্যবস্থাপনা      │  ├── ব্যয়                 │  রুট: /finance/income                 │
│  • মাস্টার ডাটা           │  ├── স্থানান্তর            │  -----------------------------------  │
│  • অর্থ ও হিসাব (Active)  │  ├── তহবিল                │  মডিউল ওয়ার্কস্পেস                     │
│  • শেয়ার ও প্রকল্প        │  ├── হিসাব                 │                                       │
│  • হালাল ব্যবসা           │  ├── সংগ্রহকারী            │                                       │
│  • জমি ও সম্পদ            │  ├── নগদ                  │                                       │
│  • কমিটি ও পরিচালনা       │  ├── ব্যাংক                │                                       │
│  • ডকুমেন্ট ও ড্রাইভ       │  ├── খতিয়ান                │                                       │
│  • রিপোর্ট ও বিশ্লেষণ     │  ├── বাজেট                │                                       │
│  • প্রশাসন ও সেটিংস       │  └── রিপোর্ট              │                                       │
│  • সহায়িকা                │                           │                                       │
└───────────────────────────┴───────────────────────────┴───────────────────────────────────────┘
```

---

## ২. স্তর ১ — Main Sidebar (১৩টি প্রধান মডিউল)

| ক্রম | আইডি (`id`) | বাংলা শিরোনাম | ইংরেজি ট্যাগ | রুট (`Route`) | সাব-রুট সংখ্যা | ধরন |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| ১ | `dashboard` | **ড্যাশবোর্ড** | Dashboard | `/dashboard` | ০ | Standalone |
| ২ | `organization_security` | **সংগঠন, ব্যবহারকারী ও নিরাপত্তা** | Organization & Security | `/organization-security` | ৬ | Parent Module |
| ৩ | `members` | **সদস্য ব্যবস্থাপনা** | Member Management | `/members` | ৯ | Parent Module |
| ৪ | `master_data` | **মাস্টার ডাটা ও খাত ব্যবস্থাপনা** | Master Data Setup | `/master-data` | ৯ | Parent Module |
| ৫ | `finance` | **অর্থ ও হিসাব** | Finance & Accounting | `/finance` | ১১ | Parent Module |
| ৬ | `shares_projects` | **শেয়ার ও প্রকল্প** | Shares & Projects | `/shares-projects` | ৯ | Parent Module |
| ৭ | `halal_business` | **হালাল ব্যবসা** | Halal Trade & Sales | `/halal-business` | ১২ | Parent Module |
| ৮ | `assets` | **জমি, সম্পত্তি ও সম্পদ** | Property & Fixed Assets | `/assets` | ৯ | Parent Module |
| ৯ | `governance` | **কমিটি, সভা ও পরিচালনা** | Governance & Meetings | `/governance` | ১১ | Parent Module |
| ১০ | `documents` | **ডকুমেন্ট ও Google Drive** | Documents & Storage | `/documents` | ৭ | Parent Module |
| ১১ | `reports` | **রিপোর্ট ও বিশ্লেষণ** | Reports & Analytics | `/reports` | ১০ | Parent Module |
| ১২ | `administration` | **প্রশাসন ও সেটিংস** | Administration | `/administration` | ৯ | Parent Module |
| ১৩ | `help_guide` | **সহায়িকা** | Help & Knowledge | `/help-guide` | ৮ | Parent Module |

---

## ৩. স্তর ২ — Internal Left Sub-sidebar (মডিউলভিত্তিক সাব-মেনু)

### ৩.১ সংগঠন, ব্যবহারকারী ও নিরাপত্তা (`/organization-security`)
- `সংগঠনের তথ্য` (`/organization-security/info`)
- `ব্যবহারকারী` (`/organization-security/users`)
- `ভূমিকা ও অনুমতি` (`/organization-security/roles`)
- `লগইন ও নিরাপত্তা` (`/organization-security/login-security`)
- `সেশন ও ডিভাইস` (`/organization-security/sessions`)
- `নিরাপত্তা লগ` (`/organization-security/logs`)

### ৩.২ সদস্য ব্যবস্থাপনা (`/members`)
- `সদস্য তালিকা` (`/members/list`)
- `নতুন সদস্য` (`/members/new`)
- `সদস্য প্রোফাইল` (`/members/profile`)
- `সদস্য আবেদন` (`/members/applications`)
- `সদস্যের হিসাব` (`/members/accounts`)
- `সদস্যের শেয়ার` (`/members/shares`)
- `সদস্যের কিস্তি` (`/members/installments`)
- `সদস্যের কার্যক্রম` (`/members/activities`)
- `রিপোর্ট` (`/members/reports`)

### ৩.৩ মাস্টার ডাটা ও খাত ব্যবস্থাপনা (`/master-data`)
- `আয় খাত` (`/master-data/income-heads`)
- `ব্যয় খাত` (`/master-data/expense-heads`)
- `তহবিল` (`/master-data/funds` — Administrative, General, Share, Project, Custom)
- `হিসাব` (`/master-data/accounts`)
- `সদস্যের ধরন` (`/master-data/member-types`)
- `ব্যবসার ধরন` (`/master-data/business-types`)
- `পণ্য ও সেবা` (`/master-data/products-services`)
- `সাধারণ সেটআপ` (`/master-data/general-setup`)
- `রিপোর্ট` (`/master-data/reports`)

### ৩.৪ অর্থ ও হিসাব (`/finance`)
- `আয়` (`/finance/income`)
- `ব্যয়` (`/finance/expense`)
- `স্থানান্তর` (`/finance/transfer`)
- `তহবিল` (`/finance/funds`)
- `হিসাব` (`/finance/accounts`)
- `সংগ্রহকারী` (`/finance/collectors`)
- `নগদ` (`/finance/cash`)
- `ব্যাংক` (`/finance/bank`)
- `খতিয়ান` (`/finance/ledger`)
- `বাজেট` (`/finance/budget`)
- `রিপোর্ট` (`/finance/reports`)

> **গুরুত্বপূর্ণ হিসাব নীতি (Accounting Principle):**
> - **Head (খাত):** কেন টাকা এসেছে বা কেন খরচ হয়েছে (উদ্দেশ্য)।
> - **Fund (তহবিল):** টাকা কোন উদ্দেশ্যে বা ফান্ডের অন্তর্ভুক্ত (দায়বদ্ধতা)।
> - **Account (হিসাব):** টাকা বর্তমানে বস্তুগতভাবে কোথায় জমা আছে (মাধ্যম)।

### ৩.৫ শেয়ার ও প্রকল্প (`/shares-projects`)
- `প্রকল্প` (`/shares-projects/projects`)
- `প্রকল্প অংশগ্রহণ` (`/shares-projects/participation`)
- `শেয়ার` (`/shares-projects/shares`)
- `শেয়ার বরাদ্দ` (`/shares-projects/allocation`)
- `শেয়ার কিস্তি` (`/shares-projects/installments`)
- `পেমেন্ট` (`/shares-projects/payments`)
- `শেয়ার সার্টিফিকেট` (`/shares-projects/certificates`)
- `প্রকল্প সমাপ্তি` (`/shares-projects/completion`)
- `রিপোর্ট` (`/shares-projects/reports`)

### ৩.৬ হালাল ব্যবসা (`/halal-business`)
- `ব্যবসার ড্যাশবোর্ড` (`/halal-business/dashboard`)
- `সরবরাহকারী` (`/halal-business/suppliers`)
- `ক্রয়` (`/halal-business/purchase`)
- `পণ্য ও সেবা` (`/halal-business/products`)
- `মজুদ` (`/halal-business/inventory`)
- `বিক্রয়` (`/halal-business/sales`)
- `গ্রাহক` (`/halal-business/customers`)
- `কিস্তি বিক্রয়` (`/halal-business/installment-sales` — নির্ধারিত মুনাফায় সুদমুক্ত চুক্তি)
- `বিক্রয় চুক্তি` (`/halal-business/sale-contracts`)
- `আদায়` (`/halal-business/collections`)
- `বকেয়া` (`/halal-business/dues`)
- `রিপোর্ট` (`/halal-business/reports`)

### ৩.৭ জমি, সম্পত্তি ও সম্পদ (`/assets`)
- `জমি` (`/assets/land`)
- `ভবন` (`/assets/buildings`)
- `যানবাহন` (`/assets/vehicles`)
- `যন্ত্রপাতি` (`/assets/equipment`)
- `আসবাবপত্র` (`/assets/furniture`)
- `অন্যান্য সম্পদ` (`/assets/other`)
- `সম্পদ হস্তান্তর` (`/assets/transfer`)
- `সম্পদ রক্ষণাবেক্ষণ` (`/assets/maintenance`)
- `রিপোর্ট` (`/assets/reports`)

### ৩.৮ কমিটি, সভা ও পরিচালনা (`/governance`)
- `কমিটি` (`/governance/committees`)
- `পদ ও দায়িত্ব` (`/governance/roles-responsibilities`)
- `কমিটি সদস্য` (`/governance/members`)
- `কমিটির মেয়াদ` (`/governance/tenure`)
- `সভা` (`/governance/meetings`)
- `উপস্থিতি` (`/governance/attendance`)
- `এজেন্ডা` (`/governance/agendas`)
- `সিদ্ধান্ত / Resolution` (`/governance/resolutions`)
- `নোটিশ` (`/governance/notices`)
- `সংযুক্তি` (`/governance/attachments`)
- `রিপোর্ট` (`/governance/reports`)

### ৩.৯ ডকুমেন্ট ও Google Drive (`/documents`)
- `সকল ডকুমেন্ট` (`/documents/all`)
- `স্থানীয় আপলোড` (`/documents/local-upload`)
- `Google Drive` (`/documents/google-drive`)
- `ডকুমেন্টের ধরন` (`/documents/types`)
- `শেয়ার্ড ডকুমেন্ট` (`/documents/shared`)
- `ডকুমেন্ট অনুসন্ধান` (`/documents/search`)
- `রিপোর্ট` (`/documents/reports`)

### ৩.১০ রিপোর্ট ও বিশ্লেষণ (`/reports`)
- `Report Center` (`/reports/center`)
- `আর্থিক রিপোর্ট` (`/reports/financial`)
- `সদস্য রিপোর্ট` (`/reports/members`)
- `শেয়ার রিপোর্ট` (`/reports/shares`)
- `প্রকল্প রিপোর্ট` (`/reports/projects`)
- `ব্যবসা রিপোর্ট` (`/reports/business`)
- `সম্পদ রিপোর্ট` (`/reports/assets`)
- `কমিটি রিপোর্ট` (`/reports/governance`)
- `ডকুমেন্ট রিপোর্ট` (`/reports/documents`)
- `Custom Report` (`/reports/custom`)

### ৩.১১ প্রশাসন ও সেটিংস (`/administration`)
- `অ্যাপ সেটিংস` (`/administration/app-settings`)
- `সংগঠন সেটিংস` (`/administration/org-settings`)
- `ব্যবহারকারী সেটিংস` (`/administration/user-settings`)
- `অনুমতি` (`/administration/permissions`)
- `নোটিফিকেশন` (`/administration/notifications`)
- `ডাটা ও ব্যাকআপ` (`/administration/backup`)
- `ইন্টিগ্রেশন` (`/administration/integrations`)
- `অডিট` (`/administration/audit`)
- `সিস্টেম তথ্য` (`/administration/system-info`)

### ৩.১২ সহায়িকা (`/help-guide`)
- `শুরু করার নির্দেশিকা` (`/help-guide/getting-started`)
- `ব্যবহার নির্দেশিকা` (`/help-guide/user-manual`)
- `FAQ` (`/help-guide/faq`)
- `হিসাব ব্যবস্থাপনা নির্দেশিকা` (`/help-guide/accounting-guide`)
- `হালাল ব্যবসা নির্দেশিকা` (`/help-guide/halal-business-guide`)
- `শরিয়াহ নীতিমালা` (`/help-guide/shariah-principles` — তথ্যবহুল নির্দেশিকা মাত্র)
- `যোগাযোগ / Support` (`/help-guide/support`)
- `About` (`/help-guide/about`)

---

## ৪. নেভিগেশন স্টেট মডেল (Supported Navigation States)

নেভিগেশন সিস্টেমে নিম্নলিখিত স্টেটসমূহ সম্পূর্ণ সমর্থিত:
1. **Active / Current**: বর্তমানে সক্রিয় থাকা রুট বা মডিউল।
2. **Selected**: নির্বাচিত প্যারেন্ট মডিউল যার উপ-মেনু ড্রয়ার খোলা রয়েছে।
3. **Expanded / Collapsed**: সাইডবার সংকুচিত বা প্রসারিত করার মোড।
4. **Disabled**: সিস্টেমে নিষ্ক্রিয় থাকা আইটেম।
5. **Loading**: ডেটা লোডিং সময়ের উইজেট স্টেট।
6. **Error / 404**: অসংজ্ঞায়িত রুটের জন্য সুন্দর বাংলা 404 হ্যান্ডলার।
7. **Permission Restricted**: রোলভিত্তিক পারমিশন না থাকলে নিরাপদ প্লেসহোল্ডার।

---

## ৫. রেসপনসিভ আচরণ (Responsive Behavior Matrix)

- **Desktop (≥1024px):**
  - স্তর ১ (Main Sidebar) এবং স্তর ২ (Sub-sidebar) পাশাপাশি দৃশ্যমান।
  - কলাপ্স ও এক্সপ্যান্ড টগলযোগ্য।
- **Tablet (768px – 1023px):**
  - স্তর ১ আইকন মোডে (Collapsed 72dp) প্রদর্শিত হয়।
  - স্তর ২ প্রসারিত থাকে।
- **Mobile (<768px):**
  - স্তর ১ স্ট্যান্ডার্ড ড্রয়ার (Navigation Drawer) হিসেবে ওপেন হয়।
  - স্তর ২ দ্রুত নির্বাচনের জন্য BottomSheet / সাব-মেনু শিট প্রদান করে।
  - শীর্ষ বারে ব্রেডক্রাম্ব ও বর্তমান সক্রিয় মডিউলের নাম প্রদর্শিত থাকে।

---

## ৬. ফিউচার এক্সটেনশন ও পারমিশন রুলস (Future Extension Rules)

1. নতুন কোনো মডিউল যোগ করতে হলে প্রথমে `lib/app/router/route_names.dart`-এ কনস্ট্যান্ট ডিফাইন করতে হবে।
2. এরপর `lib/app/router/navigation_registry.dart`-এ নতুন `NavigationItem` যুক্ত করতে হবে।
3. কোনো বিজনেস ক্যালকুলেশন বা ডেটাবেজ লজিক নেভিগেশন লেয়ারে যুক্ত করা যাবে না।
