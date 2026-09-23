# তিজারাহ সমিতি সফটওয়্যার — Master Data Architecture & Configuration Specification
## Phase 4.1 Specification — Master Data Foundation & Governance

---

### ১. মূল দর্শন ও ডোমেন সেপারেশন (Domain Separation)

তিজারাহ সমিতি সফটওয়্যারের আর্কিটেকচারে শুরু থেকেই হিসাববিজ্ঞানের তিনটি মৌলিক ধারণাকে কঠোরভাবে পৃথক রাখা হয়েছে:

```
+-------------------------------------------------------------------------+
|                  DOMAIN SEPARATION PRINCIPLE                           |
|                                                                         |
|         HEAD                  FUND                   ACCOUNT            |
|   (খাত / কারণ)          (তহবিল / উদ্দেশ্য)        (হিসাব / অবস্থান)        |
|                                                                         |
|  টাকা কেন এসেছে বা      কোন উদ্দেশ্য বা শ্রেণির    টাকা বর্তমানে কোথায়     |
|  কেন খরচ হয়েছে।         অর্থ জমা রয়েছে।           (ক্যাশ/ব্যাংকে) আছে।    |
|                                                                         |
|                CRITICAL RULE: Head ≠ Fund ≠ Account                     |
+-------------------------------------------------------------------------+
```

* **HEAD (খাত):** আয় বা ব্যয়ের নির্দিষ্ট কারণ নির্দেশ করে (যেমন: সদস্য ভর্তি ফি, ফরম বিক্রয়, অফিস ভাড়া, বিদ্যুৎ বিল)।
* **FUND (তহবিল):** কোনো নির্দিষ্ট উদ্দেশ্য বা বিধিবদ্ধ নীতিমালার অধীনে সংরক্ষিত অর্থ (যেমন: সাধারণ তহবিল, উন্নয়ন তহবিল, রিজার্ভ ফান্ড)।
* **ACCOUNT (হিসাব):** অর্থ কোথায় সংরক্ষিত বা লেনদেন হচ্ছে (যেমন: প্রধান ক্যাশ বাক্স, ইসলামী ব্যাংক সঞ্চয়ী হিসাব, আল-আরাফাহ চলতি হিসাব)।

> **সতর্কতা (Strict Rule):** Phase 4.1-এ কোনো ফিন্যান্সিয়াল ট্রানজ্যাকশন (Income, Expense, Payment, Receipt, Ledger, Cash Book, Share, DPS, Loan ইত্যাদি) বাস্তবায়ন করা হয়নি। শুধুমাত্র ফিউচার ফাইন্যান্স ইঞ্জিনের জন্য মাস্টার ডাটা আর্কিটেকচার ভিত্তি প্রস্তুত করা হয়েছে।

---

### ২. জেনেরিক মাস্টার ডাটা মডেল স্ট্রাকচার (Generic Master Data Architecture)

মাস্টার ডাটা কাঠামো দুটি শ্রেণিবদ্ধ (hierarchical) সত্ত্বার উপর প্রতিষ্ঠিত:

#### ক. MasterDataDefinition (মাস্টার ডাটা সংজ্ঞা)
যে ধরনের মাস্টার ডাটা সিস্টেমে কনফিগারযোগ্য হবে তার অভিভাবক সংজ্ঞা।

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String / UUID | PK, Immutable | সংজ্ঞার অনন্য শনাক্তকারী |
| `organizationId` | String / UUID | FK, Indexed | সংশ্লিষ্ট প্রতিষ্ঠানের আইডি |
| `masterDataType` | String | Immutable key | মেশিনে পাঠযোগ্য কি (e.g. `occupation`, `gender`, `relation_type`, `member_classification`, `document_type`) |
| `code` | String | Unique in Org | মানব পাঠযোগ্য স্ট্যাবল কোড (e.g. `OCCUPATION`) |
| `name` | String | Required | সিস্টেম নাম |
| `displayName` | String | Required, Bengali | ইউজার ইন্টারফেসে প্রদর্শিত বাংলা শিরোনাম |
| `description` | String | Optional | সংজ্ঞার বিস্তারিত বিবরণ |
| `isSystemDefined` | Boolean | Default: false | সিস্টেম-নির্ধারিত নাকি কাস্টম |
| `isActive` | Boolean | Default: true | সক্রিয় বা নিষ্ক্রিয় ফ্ল্যাগ |
| `sortOrder` | Integer | Default: 1 | সাজানোর ক্রম |
| `createdAt` | ISO8601 Timestamp | Auto | তৈরির সময়কাল |
| `updatedAt` | ISO8601 Timestamp | Auto | সর্বশেষ হালনাগাদের সময়কাল |
| `createdBy` | String / UUID | Nullable | প্রস্তুতকারী কর্মকর্তা |
| `updatedBy` | String / UUID | Nullable | হালনাগাদকারী কর্মকর্তা |

#### খ. MasterDataItem (মাস্টার ডাটা আইটেম)
নির্দিষ্ট সংজ্ঞার অধীনে অন্তর্ভুক্ত মান বা আইটেম।

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String / UUID | PK, Immutable | আইটেমের অনন্য শনাক্তকারী |
| `organizationId` | String / UUID | FK, Indexed | প্রতিষ্ঠানের আইডি (Multi-Tenant Scoped) |
| `definitionId` | String / UUID | FK, Indexed | অভিভাবক সংজ্ঞার আইডি |
| `code` | String | Immutable, Normalized | অনন্য স্ট্যাবল কোড (e.g. `TEACHER`, `SALT_FARMER`) |
| `name` | String | Bengali, Required | আইটেমের নাম |
| `description` | String | Optional | বিস্তারিত বিবরণ |
| `isSystemDefined` | Boolean | Default: false | সিস্টেম-ডিফাইন্ড (লকড কোড) বনাম প্রতিষ্ঠান কাস্টম |
| `status` | Enum (`active` \| `inactive` \| `archived`) | Required | লাইফসাইকেল স্ট্যাটাস |
| `sortOrder` | Integer | Default: 1 | প্রদর্শনের ক্রম নম্বর |
| `usageCount` | Integer | Calculated | অন্যান্য রেকর্ডে ব্যবহারের সংখ্যা |
| `createdAt` | ISO8601 Timestamp | Auto | তৈরির সময় |
| `updatedAt` | ISO8601 Timestamp | Auto | হালনাগাদের সময় |
| `createdBy` | String / UUID | Nullable | প্রস্তুতকারী ইউজার |
| `updatedBy` | String / UUID | Nullable | সর্বশেষ পরিবর্তনকারী ইউজার |

---

### ৩. কোড পলিসি ও ভ্যালিডেশন নিয়মাবলী (Code Policy & Rules)

1. **Organization-Scoped Uniqueness:** একই সংজ্ঞা (`definitionId`) এবং প্রতিষ্ঠানের (`organizationId`) অধীনে কোনো ডুপ্লিকেট কোড অনুমোদিত নয়।
2. **Whitespace Normalization:** কোড ইনপুটের স্পেস ও স্পেশাল ক্যারেক্টার স্বয়ংক্রিয়ভাবে আপারকেস এবং আন্ডারস্কোরে (`_`) রূপান্তরিত হয় (e.g., `"Salt Farmer "` -> `"SALT_FARMER"`).
3. **Code Immutability:** আইটেম তৈরির পর তার `code` অপরিবর্তনীয় (Immutable) থাকে; শুধুমাত্র প্রদর্শিত নাম (`name`), বিবরণ এবং ক্রম নম্বর পরিবর্তন করা যায়।
4. **Blank Code Prohibited:** খালি বা হোয়াইটস্পেস কোড সাবমিশন সিস্টেম ব্লক করে।
5. **No Cross-Org Interference:** প্রতিষ্ঠান A-এর কোড প্রতিষ্ঠান B-এর সাথে কোনো সংঘর্ষ তৈরি করে না।

---

### ৪. লাইফসাইকেল স্টেট মেশিন (Lifecycle State Machine)

মাস্টার ডাটার জন্য ত্রি-স্তরীয় লাইফসাইকেল নিশ্চিত করা হয়েছে:

```
      +-------------+        Deactivate        +---------------+
      |             | -----------------------> |               |
      |   ACTIVE    |                          |   INACTIVE    |
      |  (সক্রিয়)   | <----------------------- |  (নিষ্ক্রিয়)  |
      +-------------+        Activate          +---------------+
             \                                        /
              \                                      /
               \               Archive              /
                +--------------------------------->+
                               |
                               v
                       +---------------+
                       |   ARCHIVED    |
                       | (আর্কাইভকৃত)  |
                       +---------------+
                       (No Hard Delete)
```

* **Active (সক্রিয়):** নতুন সদস্য তৈরি, আবেদন বা ড্রপডাউনে নির্বাচনযোগ্য।
* **Inactive (নিষ্ক্রিয়):** নতুন কোনো সিলেকশনে আসবে না; তবে পূর্বে সংরক্ষিত ডেটায় অক্ষুণ্ণ থাকবে।
* **Archived (আর্কাইভকৃত):** সাধারণ ভিউ থেকে অপসারিত, শুধুমাত্র অডিট ও হিস্টোরিক্যাল রেকর্ডের জন্য সংরক্ষিত।
* **জিরো হার্ড-ডিলিট (Zero Hard Delete):** ডাটাবেস থেকে কোনো মাস্টার ডাটা আইটেম স্থায়ীভাবে মোছা যায় না।

---

### ৫. হিস্টোরিক্যাল রেফারেন্স নিরাপত্তা (Historical Integrity)

যদি কোনো মাস্টার ডাটা আইটেমের নাম পরিবর্তিত হয়:
* **উদাহরণ:** `মৎস্যজীবী` পরিবর্তিত হয়ে `লবণ চাষী ও উপকূলীয় মৎস্যজীবী` হলেও ডেটাবেজের স্ট্যাবল `id` ও `code` অপরিবর্তিত থাকে।
* পূর্বে সম্পন্নকৃত সকল মেম্বার প্রোফাইল ও ভবিষ্যতে Phase 5 ফিন্যান্সিয়াল অডিট রিপোর্ট সম্পূর্ণ নির্ভুল ফলাফল প্রদর্শন করবে।

---

### ৬. মাল্টি-টেন্যান্ট আইসোলেশন ও আরবিকিউ (Multi-Tenant & RBAC)

* **Isolation:** প্রতিটি কোয়েরি ও অপারেশনে `organizationId` বাধ্যতামূলক।
* **Role Permissions:**
  - `master_data.view` (Viewer, Manager, Admin)
  - `master_data.create` (Manager, Admin)
  - `master_data.edit` (Manager, Admin)
  - `master_data.status_change` (Manager, Admin)
  - `master_data.export` (Manager, Admin)
  - `master_data.print` (Manager, Admin)
* ভিউয়ার রোল দ্বারা অননুমোদিত রিকোয়েস্ট পাঠালে HTTP 403 Forbidden নোটিশ প্রদান করা হয়।

---

### ৭. অপরিবর্তনীয় অডিট ট্রেইল (Immutable Audit Trail)

মাস্টার ডাটা ডোমেনের নিম্নোক্ত সকল অ্যাকশন অডিট লগে সংরক্ষিত হয়:
1. `CREATE` — নতুন আইটেম সংযোজন
2. `UPDATE` — নাম, বিবরণ বা ক্রম পরিবর্তন
3. `ACTIVATE` — আইটেম সক্রিয়করণ
4. `DEACTIVATE` — আইটেম সাময়িক নিষ্ক্রিয়করণ (বাধ্যতামূলক কারণসহ)
5. `ARCHIVE` — আইটেম আর্কাইভকরণ

অডিট লগে সম্পাদনকারী কর্মকর্তার নাম, ইউজার আইডি, টাইমস্ট্যাম্প, পরিবর্তনের কারণ এবং Before/After সারাংশ সংরক্ষিত থাকে।

---

### ৮. তহবিল ব্যবস্থাপনা (Phase 4.4 — Fund Management Foundation)

তিজারাহ সফটওয়্যারে তহবিল (Fund) একটি সমতল মাস্টার ডাটা ডাইমেনশন (Flat Dimension):
* **নীতি:** `Head (কেন)` $\neq$ `Fund (কোন উদ্দেশ্য/শ্রেণি)` $\neq$ `Account (কোথায়)`
* **তহবিলের ধরন:** সাধারণ (`general`), প্রশাসনিক (`administrative`), শেয়ার মূলধন (`share`), প্রকল্প (`project`), কাস্টম (`custom`)
* **লাইফসাইকেল:** `Active ↔ Inactive → Archived` (কোনো হার্ড ডিলিট নেই, আর্কাইভ একটি টার্মিনাল স্টেট)
* **কোড ও আইডেন্টিটি:** স্বয়ংক্রিয় ধারাবাহিক কোড (`FND-001`, `FND-002`...), অপরিবর্তনীয় আইডি ও কোড
* **জিরো ব্যালেন্স/লেজার:** ফান্ডে কোনো আর্থিক ব্যালেন্স বা লেনদেন ক্যালকুলেশন থাকে না।
* **স্কোপ সুরক্ষা:** যাকাত, ওয়াকফ, সদকা, ফিতরা বা ইমার্জেন্সি ফান্ডের কোনো প্রাক-নির্ধারিত হার্ডকোডিং নেই।

