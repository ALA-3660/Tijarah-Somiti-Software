# তিজারাহ সমিতি সফটওয়্যার (Tijarah Samity Software)

## Phase 3 — Member Management
### Prompt 3.5 — Member Documents, Photos & Attachments Specification (`docs/member_documents.md`)

---

## ১. মূল আর্কিটেকচারাল নীতিমালা (Core Architectural Principles)

### ক. Member ≠ User
* **Member Document/Photo:** সমবায়/সমিতির সদস্যের পরিচিতি, জাতীয় পরিচয়পত্র, ছবি বা চুক্তিপত্রের নথি।
* এটি সফটওয়্যার ইউজার অ্যাকাউন্টের সাথে মিশ্রিত নয়। সদস্যের কোনো ডকুমেন্ট ইউজার সিকিউরিটি ক্রেডেনশিয়াল নয়।

### খ. Document ≠ Financial Transaction (Rule 21 & 22)
* কোনো ডকুমেন্টস বা অ্যাটাচমেন্ট কোনো ফিনান্সিয়াল ট্রানজ্যাকশন (শেয়ার, সঞ্চয়, ডিপিএস, ঋণ, বিনিয়োগ, চাঁদা, কিস্তি, আয়, ব্যয়, লেজার) নির্দেশ করে না।
* কোনো ধর্মীয় তহবিল (জাকাত, ওয়াকফ, সদকা, ফিতরা) বা আর্থিক ব্যালেন্স প্রভাবিত হয় না।

### গ. Multi-tenant Organization Isolation
* প্রতিটি ডকুমেন্ট (`MemberDocumentType`), ছবি (`MemberPhotoType`) এবং ডকুমেন্ট টাইপ কনফিগারেশন (`DocumentTypeConfig`) বাধ্যতামূলকভাবে একটি নির্দিষ্ট `organizationId`-এর অধীনে সংরক্ষিত।
* কোনো সংস্থার ডকুমেন্ট বা ছবি অন্য কোনো সংস্থা দেখতে বা এক্সেস করতে পারবে না।

### ঘ. Single Primary Photo Enforcement
* সদস্যের একাধিক ফটো (প্রোফাইল, এনআইডি ফটো, পরিচয়পত্র ইত্যাদি) গ্যালারিতে সংরক্ষিত হতে পারে।
* এক সময়ে সুনির্দিষ্ট ১টি ছবি `isPrimary: true` থাকবে। নতুন ছবিকে প্রাইমারি হিসেবে সেট করলে পূর্ববর্তী প্রাইমারি ছবি স্বয়ংক্রিয়ভাবে সেকেন্ডারি হিসেবে আপডেট হয়।

### ঙ. Document Verification Lifecycle & Mandatory Rejection Reason
* ডকুমেন্টের স্ট্যাটাস লাইফসাইকেল: `pending_verification` ➔ `verified` / `rejected` / `archived`।
* কোনো ডকুমেন্ট প্রত্যাখ্যান (`rejected`) করার ক্ষেত্রে পর্যালোচনাকারীকে বাধ্যতামূলকভাবে প্রত্যাখ্যানের কারণ (`rejectionReason`) প্রদান করতে হবে।

### চ. Sensitive Identification Privacy & Masking
* জাতীয় পরিচয়পত্র (NID), পাসপোর্ট বা সংবেদনশীল সনদপত্র নম্বর সাধারণ ভিউতে `********1234` ফরম্যাটে মাস্কড থাকে।
* শুধুমাত্র অনুমোদিত অ্যাডমিন ও ম্যানেজার ভিউয়াররা সিকিউর টগলের মাধ্যমে পূর্ণ নম্বর দেখতে পারেন। সংবেদনশীল ডেটা ইউআরএল বা পাবলিক ক্যাশে এক্সপোজড হয় না।

### ছ. Storage Architecture & Google Drive Foundation
* **Local Reference:** অভ্যন্তরীণ ফাইল সিস্টেম বা সার্ভার রেফারেন্স পাথ।
* **Remote Reference:** নিরাপদ রিমোট অবজেক্ট স্টোরেজ রেফারেন্স।
* **Google Drive Reference Foundation:** ডকুমেন্ট মেটাডাটা ও ড্রাইভ রেফারেন্স স্ট্রাকচার (`GoogleDriveReference`) প্রস্তুত রয়েছে, তবে পূর্ণ থার্ড-পার্টি OAuth বা লাইভ ড্রাইভ আপলোড রানটাইমে সংযুক্ত নয়।

### জ. অপরিবর্তনীয় অডিট ট্রেইল (Immutable Audit Trail)
* প্রতিটি ডকুমেন্ট ও ছবির আপলোড, যাচাইকরণ, প্রত্যাখ্যান, স্ট্যাটাস পরিবর্তন, প্রাইমারি ফটো নির্বাচন ও আর্কাইভাল কার্যক্রমে অপরিবর্তনীয় অডিট লগ তৈরি হয় (`DocumentAuditLogType`)।

### ঝ. হার্ড-ডিলিট সম্পূর্ণ নিষিদ্ধ (No Hard Deletion)
* ডকুমেন্ট বা ছবি ডাটাবেজ থেকে স্থায়ীভাবে মুছে ফেলা সম্পূর্ণ নিষিদ্ধ।
* কার্যকারিতা শেষ হলে `archived` ফ্ল্যাগের মাধ্যমে সফট-আর্কাইভাল লাইফসাইকেল বজায় রাখা হয়।

---

## ২. সত্ত্বা পরিচিতি (Entity Schemas)

### MemberPhotoType
```typescript
interface MemberPhotoType {
  id: string;
  organizationId: string;
  memberId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageReference: string;
  thumbnailReference?: string;
  photoType: MemberPhotoCategory; // 'profile' | 'identity' | 'signature' | 'other'
  isPrimary: boolean;
  uploadedAt: string;
  uploadedBy?: string;
  updatedAt: string;
  status: 'active' | 'archived';
}
```

### MemberDocumentType
```typescript
interface MemberDocumentType {
  id: string;
  organizationId: string;
  memberId: string;
  documentTypeId: string;
  documentTitle: string;
  documentNumberReference?: string;
  description?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageType: DocumentStorageType; // 'local_reference' | 'google_drive_reference' | 'external_url'
  storageReference: string;
  googleDriveReference?: GoogleDriveReference;
  issueDate?: string;
  expiryDate?: string;
  verificationStatus: DocumentVerificationStatus; // 'pending_verification' | 'verified' | 'rejected' | 'archived'
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

### DocumentTypeConfig
```typescript
interface DocumentTypeConfig {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  description?: string;
  isSystemDefined: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```
