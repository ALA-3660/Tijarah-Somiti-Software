# তিজারাহ সমিতি সফটওয়্যার — Django REST API Specification

## Membership Application Endpoints (`/api/v1/members/applications/`)

### ১. List & Search Applications
- **Endpoint:** `GET /api/v1/members/applications/`
- **Permissions:** `IsAuthenticated`, `HasPermission(membership.application.view)`
- **Query Params:**
  - `status`: `draft`, `submitted`, `under_review`, `correction_required`, `resubmitted`, `approved`, `rejected`, `withdrawn`
  - `search`: string (matches `applicant_full_name`, `application_code`, `mobile`)
  - `page`: integer
- **Response:**
```json
{
  "count": 4,
  "results": [
    {
      "id": "app-seed-001",
      "organization_id": "demo-org-khurushkul",
      "application_code": "APP-000001",
      "applicant_full_name": "মাওলানা আব্দুল হক চৌধুরী",
      "mobile": "01812999001",
      "application_status": "under_review",
      "submitted_at": "2026-09-18T10:00:00Z",
      "created_at": "2026-09-17T09:00:00Z"
    }
  ]
}
```

### ২. Create Draft Application
- **Endpoint:** `POST /api/v1/members/applications/`
- **Permissions:** `HasPermission(membership.application.create)`
- **Body:**
```json
{
  "applicant_full_name": "মাওলানা আব্দুর রহমান",
  "mobile": "01812999005",
  "email": "arahman@example.com",
  "date_of_birth": "1992-06-15",
  "gender": "male",
  "occupation": "শিক্ষক",
  "father_or_spouse_name": "আব্দুল মালেক",
  "mother_name": "রাবেয়া খাতুন",
  "current_address": "দক্ষিণ খুরুশকুল, কক্সবাজার",
  "permanent_address": "দক্ষিণ খুরুশকুল, কক্সবাজার",
  "is_same_address": true,
  "nid": "19921234567890123",
  "notes": "স্থানীয় সাধারণ সদস্যপদ আবেদন"
}
```

### ৩. Submit Application
- **Endpoint:** `POST /api/v1/members/applications/{id}/submit/`
- **Permissions:** `HasPermission(membership.application.submit)`

### ৪. Review & Update Checklist
- **Endpoint:** `POST /api/v1/members/applications/{id}/start-review/`
- **Endpoint:** `PATCH /api/v1/members/applications/{id}/checklist/`
- **Permissions:** `HasPermission(membership.application.review)`

### ৫. Request Correction
- **Endpoint:** `POST /api/v1/members/applications/{id}/request-correction/`
- **Permissions:** `HasPermission(membership.application.correction)`
- **Body:** `{"correction_reason": "স্থায়ী ঠিকানার প্রত্যয়নপত্র সংযুক্ত করুন।"}`

### ৬. Resubmit Application
- **Endpoint:** `POST /api/v1/members/applications/{id}/resubmit/`
- **Permissions:** `HasPermission(membership.application.submit)`

### ৭. Approve Application (Creates Member)
- **Endpoint:** `POST /api/v1/members/applications/{id}/approve/`
- **Permissions:** `HasPermission(membership.application.approve)`
- **Constraints Enforced:**
  - `creator_user_id != approver_user_id` (Separation of duties)
  - Concurrency lock: `select_for_update()`
  - Atomically creates `Member` with next `MEM-XXXXXX` code.
- **Body:** `{"decision_reason": "কার্যনির্বাহী পরিষদের অনুমোদনপ্রাপ্ত।"}`

### ৮. Reject Application
- **Endpoint:** `POST /api/v1/members/applications/{id}/reject/`
- **Permissions:** `HasPermission(membership.application.reject)`
- **Body:** `{"rejection_reason": "সমিতির শর্তাবলি অপূর্ণ থাকায়..."}`

### ৯. Withdraw Application
- **Endpoint:** `POST /api/v1/members/applications/{id}/withdraw/`
- **Permissions:** `HasPermission(membership.application.withdraw)`
- **Body:** `{"withdrawal_reason": "ব্যক্তিগত কারণ..."}`

---

## সদস্য রেজিস্টার, অনুসন্ধান ও অ্যাক্টিভিটি হিস্ট্রি API (Prompt 3.6)

### ১০. Member Register & Search List
- **Endpoint:** `GET /api/v1/members/`
- **Query Parameters:** `q`, `status`, `classification_id`, `gender`, `occupation`, `joined_from`, `joined_to`, `completeness`, `page`, `page_size`, `sort_by`, `sort_dir`
- **Permissions:** `HasPermission(member.view)`
- **Organization Header:** `X-Organization-Id: <uuid>`

### ১১. Member 360° Profile Summary
- **Endpoint:** `GET /api/v1/members/{id}/summary-360/`
- **Permissions:** `HasPermission(member.view)`

### ১২. Member Activity & Audit Timeline
- **Endpoint:** `GET /api/v1/members/{id}/activity-timeline/`
- **Permissions:** `HasPermission(member.history.view)`

### ১৩. Data Quality & Duplicate Candidates
- **Endpoint:** `GET /api/v1/members/duplicate-candidates/`
- **Permissions:** `HasPermission(member.quality.view)`
- **Review Endpoint:** `POST /api/v1/members/duplicate-candidates/{id}/review/`
- **Body:** `{"status": "reviewed_distinct", "review_notes": "ভিন্ন ব্যক্তি"}`

### ১৪. Safe Bulk Operations
- **Bulk Status:** `POST /api/v1/members/bulk-status-change/`
- **Body:** `{"member_ids": ["uuid-1", "uuid-2"], "new_status": "suspended", "reason": "শৃঙ্খলা তদন্তাধীন"}`
- **Bulk Classification:** `POST /api/v1/members/bulk-classification-change/`
- **Body:** `{"member_ids": ["uuid-1", "uuid-2"], "new_classification_id": "cls-uuid", "reason": "বোর্ড রেজুলেশন"}`
- **Permissions:** `HasPermission(member.bulk_action)`

### ১৫. Privacy-Safe CSV Export & Print
- **Endpoint:** `GET /api/v1/members/export-csv/`
- **Permissions:** `HasPermission(member.export)`

---

## মাস্টার ডাটা আর্কিটেকচার API (Phase 4.1)

### ১৬. List Master Data Definitions
- **Endpoint:** `GET /api/v1/master-data/definitions/`
- **Permissions:** `HasPermission(master_data.view)`
- **Header:** `X-Organization-Id: <uuid>`

### ১৭. List Master Data Items
- **Endpoint:** `GET /api/v1/master-data/items/`
- **Query Parameters:** `definition_id`, `status`, `origin` (`system` | `custom`), `q`, `page`, `page_size`
- **Permissions:** `HasPermission(master_data.view)`
- **Header:** `X-Organization-Id: <uuid>`

### ১৮. Create Custom Master Data Item
- **Endpoint:** `POST /api/v1/master-data/items/`
- **Permissions:** `HasPermission(master_data.create)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "definition_id": "uuid-def-001",
  "code": "SALT_FARMER",
  "name": "লবণ চাষী ও মৎস্যজীবী",
  "description": "উপকূলীয় এলাকার লবণ ও মৎস্য চাষী",
  "sort_order": 3,
  "reason": "নতুন কাস্টম পেশা অন্তর্ভুক্তি"
}
```

### ১৯. Update Master Data Item
- **Endpoint:** `PATCH /api/v1/master-data/items/{id}/`
- **Permissions:** `HasPermission(master_data.edit)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "name": "লবণ চাষী ও উপকূলীয় মৎস্যজীবী",
  "description": "হালনাগাদকৃত বিবরণ",
  "sort_order": 3,
  "reason": "নামের বানান ও স্পষ্টতা সংশোধন"
}
```
*(দ্রষ্টব্য: `code` অপরিবর্তনীয় এবং এডিট রিকোয়েস্টে পাঠালেও তা ফিল্টার আউট হবে)*

### ২০. Change Status (Active, Inactive, Archived)
- **Endpoint:** `POST /api/v1/master-data/items/{id}/status-change/`
- **Permissions:** `HasPermission(master_data.status_change)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "target_status": "inactive",
  "reason": "মৌসুমি পেশা সাময়িক বন্ধ"
}
```

### ২১. Master Data Audit Logs
- **Endpoint:** `GET /api/v1/master-data/audit-logs/`
- **Query Parameters:** `entity_id`, `entity_type`, `action`, `page`, `page_size`
- **Permissions:** `HasPermission(master_data.view)`
- **Header:** `X-Organization-Id: <uuid>`

---

## খাত ব্যবস্থাপনা ও শ্রেণিবিভাগ API (Phase 4.3 — Income & Expense Head Classification & Integration)

### ২২. List Heads
- **Endpoint:** `GET /api/v1/heads/`
- **Query Parameters:** `head_type` (`income` | `expense`), `level` (`1` | `2`), `parent_id`, `status` (`active` | `inactive` | `archived`), `origin` (`system` | `custom`), `q`, `page`, `page_size`
- **Permissions:** `HasPermission(head.view)`
- **Header:** `X-Organization-Id: <uuid>`
- **Response:**
```json
{
  "count": 12,
  "results": [
    {
      "id": "uuid-head-01",
      "organization_id": "uuid-org-01",
      "head_code": "INC-001",
      "name": "সদস্যভিত্তিক আয়",
      "description": "সদস্যদের নিয়মিত চাঁদা ও অন্তর্ভুক্তি বাবদ আয়",
      "head_type": "income",
      "parent_id": null,
      "level": 1,
      "is_system_defined": true,
      "status": "active",
      "sort_order": 1,
      "created_at": "2026-01-10T09:00:00Z",
      "updated_at": "2026-01-10T09:00:00Z"
    }
  ]
}
```

### ২৩. Create Head (Main Head or Sub Head)
- **Endpoint:** `POST /api/v1/heads/`
- **Permissions:** `HasPermission(head.create)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "head_code": "EXP-001-04",
  "name": "স্টেশনারি ও মুদ্রণ খরচ",
  "description": "অফিস খাতা, কলম ও রশিদ বই মুদ্রণ",
  "head_type": "expense",
  "parent_id": "uuid-exp-main-01",
  "level": 2,
  "sort_order": 4
}
```
*(ভ্যালিডেশন: `head_type` বাধ্যতামূলক ও তৈরির পর অপরিবর্তনীয়; Sub Head-এর `parent_id` অবশ্যই একই সংগঠনের সমগোত্রীয় সক্রিয় Main Head হতে হবে; নাম ইউনিকোড NFC নরমালাইজড ডুপ্লিকেট চেকিং সাপেক্ষ)*

### ২৪. Update Head
- **Endpoint:** `PATCH /api/v1/heads/{id}/`
- **Permissions:** `HasPermission(head.edit)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "name": "স্টেশনারি, প্রকাশনা ও মুদ্রণ খরচ",
  "description": "হালনাগাদকৃত বিবরণ",
  "sort_order": 4
}
```
*(দ্রষ্টব্য: `head_code`, `head_type`, `level`, `parent_id` অপরিবর্তনীয় এবং কোনো এডিট রিকোয়েস্টে পরিবর্তনের চেষ্টা করলে তা ব্লক/উপেক্ষা করা হবে)*

### ২৫. Head Status Change (Active, Inactive, Archived)
- **Endpoint:** `POST /api/v1/heads/{id}/status-change/`
- **Permissions:** `HasPermission(head.status_change)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "target_status": "inactive",
  "reason": "চলতি অর্থবছরে এই খাতের লেনদেন সাময়িক স্থগিত"
}
```
*(ভ্যালিডেশন: মূল খাতের অধীনে সক্রিয় সাব-হেড থাকলে নিষ্ক্রিয়করণ ব্লক করা হবে)*

### ২৬. Head Audit Trail
- **Endpoint:** `GET /api/v1/heads/audit-logs/`
- **Query Parameters:** `head_id`, `action`, `page`, `page_size`
- **Permissions:** `HasPermission(head.view)`
- **Header:** `X-Organization-Id: <uuid>`

### ২৭. Head Export & Printable Register
- **Endpoint:** `GET /api/v1/heads/export-csv/`
- **Permissions:** `HasPermission(head.export)`
- **Header:** `X-Organization-Id: <uuid>`

---

## 🏛️ ৭. Fund Management Endpoints (Phase 4.4)

### ২৮. List Funds
- **Endpoint:** `GET /api/v1/funds/`
- **Permissions:** `HasPermission(fund.view)`
- **Header:** `X-Organization-Id: <uuid>`
- **Query Parameters:** `search`, `fund_type`, `status`, `is_system_defined`, `ordering`, `page`, `page_size`

### ২৯. Create Fund
- **Endpoint:** `POST /api/v1/funds/`
- **Permissions:** `HasPermission(fund.create)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "name": "মৎস্য প্রকল্প তহবিল",
  "description": "উপকূলীয় বাণিজ্যিক মৎস্য উৎপাদন প্রকল্প",
  "fund_type": "project",
  "sort_order": 4,
  "reason": "নতুন বাণিজ্যিক প্রকল্পের জন্য তহবিল অনুমোদন"
}
```
*(স্বয়ংক্রিয়ভাবে জেনারেট হবে: `fund_code` যেমন `FND-004`)*

### ৩০. Retrieve Fund Detail
- **Endpoint:** `GET /api/v1/funds/{id}/`
- **Permissions:** `HasPermission(fund.view)`
- **Header:** `X-Organization-Id: <uuid>`

### ৩১. Update Fund
- **Endpoint:** `PATCH /api/v1/funds/{id}/`
- **Permissions:** `HasPermission(fund.edit)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "name": "মৎস্য ও সামুদ্রিক খাদ্য প্রকল্প তহবিল",
  "description": "হালনাগাদকৃত বিবরণ",
  "sort_order": 4,
  "reason": "প্রকল্পের নাম পরিমার্জন"
}
```
*(দ্রষ্টব্য: `fund_code`, `organization_id`, `is_system_defined`, `created_at` অপরিবর্তনীয়)*

### ৩২. Fund Lifecycle Status Change
- **Endpoint:** `POST /api/v1/funds/{id}/status-change/`
- **Permissions:** `HasPermission(fund.status_change)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "target_status": "inactive",
  "reason": "প্রকল্প সমাপ্তির প্রস্তুতিতে সাময়িক নিষ্ক্রিয়করণ"
}
```
*(ভ্যালিডেশন: `archived` তহবিলকে পুনরায় সক্রিয় করা যাবে না - Terminal State)*

### ৩৩. Fund Audit Trail
- **Endpoint:** `GET /api/v1/funds/{id}/audit/`
- **Permissions:** `HasPermission(fund.view)`
- **Header:** `X-Organization-Id: <uuid>`

### ৩৪. Fund Export
- **Endpoint:** `GET /api/v1/funds/export-csv/`
- **Permissions:** `HasPermission(fund.export)`
- **Header:** `X-Organization-Id: <uuid>`

---

## Account Management Endpoints (`/api/v1/accounts/`) — Phase 5.1

### ৩৫. List Accounts
- **Endpoint:** `GET /api/v1/accounts/`
- **Permissions:** `HasPermission(account.view)`
- **Header:** `X-Organization-Id: <uuid>`
- **Query Parameters:** `q`, `account_type` (`cash`|`bank`), `status` (`active`|`inactive`|`closed`|`suspended`), `fund_id`, `page`, `page_size`
- **Response:**
```json
{
  "count": 2,
  "results": [
    {
      "id": "acc-demo-001",
      "organization_id": "demo-org-khurushkul",
      "name": "প্রধান ক্যাশ বাক্স (সেন্ট্রাল ক্যাশ)",
      "code": "ACC-CSH-001",
      "account_type": "cash",
      "status": "active",
      "custodian_name": "মাওলানা আব্দুল করিম (ক্যাশিয়ার)",
      "location": "প্রধান কার্যালয়, খুরুশকুল",
      "associated_fund_ids": ["fnd-demo-001", "fnd-demo-002"],
      "is_default": true,
      "created_at": "2026-01-01T00:00:00Z"
    },
    {
      "id": "acc-demo-002",
      "organization_id": "demo-org-khurushkul",
      "name": "ইসলামী ব্যাংক বাংলাদেশ পিএলসি",
      "code": "ACC-BNK-001",
      "account_type": "bank",
      "status": "active",
      "bank_name": "ইসলামী ব্যাংক বাংলাদেশ পিএলসি",
      "branch_name": "চকোরিয়া শাখা",
      "masked_account_number": "******4589",
      "routing_number": "125271234",
      "associated_fund_ids": ["fnd-demo-001", "fnd-demo-003"],
      "shariah_notes": "মুদারাবা চলতি ও সঞ্চয়ী হিসাব পরিচালনা নীতিমালা",
      "is_default": false,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### ৩৬. Create Account
- **Endpoint:** `POST /api/v1/accounts/`
- **Permissions:** `HasPermission(account.create)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "name": "আল-আরাফাহ্ ইসলামী ব্যাংক সঞ্চয়ী হিসাব",
  "account_type": "bank",
  "bank_name": "আল-আরাফাহ্ ইসলামী ব্যাংক পিএলসি",
  "branch_name": "কক্সবাজার শাখা",
  "account_number": "1041120098765",
  "routing_number": "015270987",
  "swift_code": "ALABBDDH",
  "associated_fund_ids": ["fnd-demo-001"],
  "shariah_notes": "মুদারাবা স্কিম",
  "description": "প্রকল্প লেনদেনের বিশেষ ব্যাংক হিসাব"
}
```

### ৩৭. Update Account
- **Endpoint:** `PATCH /api/v1/accounts/{id}/`
- **Permissions:** `HasPermission(account.edit)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "name": "আল-আরাফাহ্ ইসলামী ব্যাংক সাধারণ সঞ্চয়ী হিসাব",
  "custodian_name": "মাওলানা জসিম উদ্দিন",
  "associated_fund_ids": ["fnd-demo-001", "fnd-demo-002"],
  "reason": "কাস্টোডিয়ান ও ফান্ড ম্যাপিং হালনাগাদ"
}
```

### ৩৮. Account Status Change (Active ↔ Inactive → Archived)
- **Endpoint:** `POST /api/v1/accounts/{id}/status-change/`
- **Permissions:** `HasPermission(account.status_change)` (Archiving requires `account.archive`)
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "target_status": "inactive",
  "reason": "শাখা স্থানান্তরজনিত কারণে হিসাব সাময়িকভাবে নিষ্ক্রিয় করা হলো",
  "effective_from": "2026-03-01"
}
```

### ৩৯. Account Sensitive Data Reveal (Audited)
- **Endpoint:** `POST /api/v1/accounts/{id}/reveal-sensitive/`
- **Permissions:** `HasPermission(account.view_sensitive)` (Admin only)
- **Header:** `X-Organization-Id: <uuid>`
- **Audit Action:** `ACCOUNT_SENSITIVE_REVEALED`
- **Response:**
```json
{
  "account_id": "uuid-acc-01",
  "account_number_plain": "205012345678",
  "routing_number_plain": "125271234",
  "revealed_at": "2026-03-01T10:00:00Z",
  "audit_logged": true
}
```

### ৪০. Account Audit Trail
- **Endpoint:** `GET /api/v1/accounts/{id}/audit/`
- **Permissions:** `HasPermission(account.view)`
- **Header:** `X-Organization-Id: <uuid>`

---

## আর্থিক লেনদেন কোর ও অনুমোদন API (Phase 5.2 — Financial Transaction Core)

### ৪১. List Transactions
- **Endpoint:** `GET /api/v1/finance/transactions/`
- **Query Parameters:** `type` (`INCOME` | `EXPENSE` | `TRANSFER`), `status` (`DRAFT` | `SUBMITTED` | `APPROVED` | `REJECTED`), `account_id`, `fund_id`, `head_id`, `date_from`, `date_to`, `q`, `page`, `page_size`
- **Permissions:** `HasPermission(transaction.view)`
- **Header:** `X-Organization-Id: <uuid>`
- **Response:**
```json
{
  "count": 42,
  "results": [
    {
      "id": "uuid-trx-001",
      "organization_id": "uuid-org-01",
      "transaction_code": "TRX-2026-000001",
      "transaction_type": "INCOME",
      "transaction_date": "2026-03-01",
      "amount": "15000.00",
      "account_id": "uuid-acc-01",
      "fund_id": "uuid-fnd-01",
      "head_id": "uuid-hd-01",
      "description": "সদস্যদের নিয়মিত মাসিক সঞ্চয় কিস্তি আদায়",
      "reference": "MR-2026-041",
      "status": "APPROVED",
      "created_by": "uuid-usr-accountant",
      "created_by_name": "হিসাবরক্ষক",
      "submitted_by": "uuid-usr-accountant",
      "submitted_at": "2026-03-01T10:00:00Z",
      "approved_by": "uuid-usr-manager",
      "approved_by_name": "ম্যানেজার",
      "approved_at": "2026-03-01T11:30:00Z",
      "version": 2,
      "created_at": "2026-03-01T09:45:00Z",
      "updated_at": "2026-03-01T11:30:00Z"
    }
  ]
}
```

### ৪২. Create Transaction Draft (DRAFT)
- **Endpoint:** `POST /api/v1/finance/transactions/`
- **Permissions:** `HasPermission(transaction.create)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "transaction_type": "INCOME",
  "transaction_date": "2026-03-15",
  "amount": "25000.00",
  "account_id": "uuid-acc-01",
  "fund_id": "uuid-fnd-01",
  "head_id": "uuid-hd-01",
  "description": "নতুন সদস্যদের ভর্তি ও শেয়ার ফি বাবদ নগদ আদায়",
  "reference": "MR-2026-088"
}
```
*(ভ্যালিডেশন: পরিমাণ অবশ্যই ধনাত্মক সংখ্যা হতে হবে; একাউন্ট, ফান্ড ও হেড একই অর্গানাইজেশনের সক্রিয় মাস্টার ডাটা হতে হবে; আয় লেনদেনের জন্য আয় খাত ও ব্যয় লেনদেনের জন্য ব্যয় খাত হতে হবে)*

### ৪৩. Update Transaction Draft
- **Endpoint:** `PATCH /api/v1/finance/transactions/{id}/`
- **Permissions:** `HasPermission(transaction.edit_draft)`
- **Header:** `X-Organization-Id: <uuid>`
- **Condition:** শুধুমাত্র `DRAFT` স্ট্যাটাসে থাকা লেনদেন আপডেটযোগ্য।

### ৪৪. Submit Transaction for Approval (DRAFT → SUBMITTED)
- **Endpoint:** `POST /api/v1/finance/transactions/{id}/submit/`
- **Permissions:** `HasPermission(transaction.submit)`
- **Header:** `X-Organization-Id: <uuid>`
- **Audit Action:** `TRANSACTION_SUBMITTED`

### ৪৫. Approve Transaction (SUBMITTED → APPROVED)
- **Endpoint:** `POST /api/v1/finance/transactions/{id}/approve/`
- **Permissions:** `HasPermission(transaction.approve)` (Admin or Manager only)
- **Header:** `X-Organization-Id: <uuid>`
- **Enforcement:** `request.user.id !== transaction.created_by` (Separation of Duties). লঙ্ঘন হলে HTTP 403 Forbidden.
- **Audit Action:** `TRANSACTION_APPROVED`

### ৪৬. Reject Transaction (SUBMITTED → REJECTED)
- **Endpoint:** `POST /api/v1/finance/transactions/{id}/reject/`
- **Permissions:** `HasPermission(transaction.reject)` (Admin or Manager only)
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "rejection_reason": "ভাউচারের মূল মেমো রশিদ সংযুক্ত নেই।"
}
```
- **Audit Action:** `TRANSACTION_REJECTED`

### ৪৭. Reopen Rejected Transaction to Draft (REJECTED → DRAFT)
- **Endpoint:** `POST /api/v1/finance/transactions/{id}/reopen-draft/`
- **Permissions:** `HasPermission(transaction.edit_draft)`
- **Header:** `X-Organization-Id: <uuid>`
- **Audit Action:** `TRANSACTION_RESUBMITTED`

---

## আয় ও প্রাপ্তি ব্যবস্থাপনা API (Phase 5.3 — Income Management)

### ৪৮. List Income Entries
- **Endpoint:** `GET /api/v1/finance/income/`
- **Query Parameters:** `income_type_code`, `status`, `account_id`, `fund_id`, `head_id`, `member_id`, `date_from`, `date_to`, `q`, `page`, `page_size`
- **Permissions:** `HasPermission(income.view)`
- **Header:** `X-Organization-Id: <uuid>`
- **Response:**
```json
{
  "count": 28,
  "results": [
    {
      "id": "uuid-inc-001",
      "organization_id": "uuid-org-01",
      "income_type_code": "member_monthly_fee",
      "transaction_code": "TRX-2026-000101",
      "receipt_no": "REC-2026-00101",
      "entry_date": "2026-03-01",
      "amount": "3000.00",
      "amount_in_words_bn": "তিন হাজার টাকা মাত্র",
      "payment_method": "cash",
      "account_id": "uuid-acc-01",
      "fund_id": "uuid-fnd-01",
      "head_id": "uuid-hd-01",
      "status": "APPROVED",
      "is_refundable": true,
      "is_member_settlement_eligible": true,
      "member_details": {
        "member_id": "uuid-mem-01",
        "member_code": "MEM-2026-001",
        "member_name": "মাওলানা মাহমুদ হাসান",
        "fiscal_year": "2025-2026",
        "monthly_fee_rate": 1000,
        "total_months": 3
      },
      "created_by": "uuid-usr-accountant",
      "approved_by": "uuid-usr-manager"
    }
  ]
}
```

### ৪৯. Create Income Entry (Unified Dynamic Form)
- **Endpoint:** `POST /api/v1/finance/income/`
- **Permissions:** `HasPermission(income.create)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:**
```json
{
  "income_type_code": "member_admission_passbook",
  "entry_date": "2026-03-15",
  "amount": "1200.00",
  "payment_method": "cash",
  "account_id": "uuid-acc-01",
  "fund_id": "fnd-demo-admin",
  "head_id": "uuid-hd-inc-01",
  "description": "নতুন সদস্য ভর্তি ও পাশ বই বাবদ আদায়",
  "member_details": {
    "member_id": "uuid-mem-02",
    "admission_fee": 1000,
    "has_passbook": true,
    "passbook_price": 200,
    "passbook_number": "PB-2026-088"
  },
  "status": "SUBMITTED"
}
```
*(ভ্যালিডেশন: ভর্তি ও পাশ বইয়ের জন্য ফান্ড অবশ্যই "প্রশাসনিক খরচের তহবিল" হতে হবে; পাসবুক নম্বর ইউনিক হতে হবে; হেড অবশ্যই INC-* হতে হবে)*

### ৫০. Income Entry Details
- **Endpoint:** `GET /api/v1/finance/income/{id}/`
- **Permissions:** `HasPermission(income.view)`
- **Header:** `X-Organization-Id: <uuid>`

### ৫১. Update Income Draft
- **Endpoint:** `PATCH /api/v1/finance/income/{id}/`
- **Permissions:** `HasPermission(income.edit)`
- **Header:** `X-Organization-Id: <uuid>`
- **Condition:** শুধুমাত্র `DRAFT` স্ট্যাটাসে পরিবর্তন সম্ভব।

### ৫২. Submit Income Entry (DRAFT → SUBMITTED)
- **Endpoint:** `POST /api/v1/finance/income/{id}/submit/`
- **Permissions:** `HasPermission(income.submit)`
- **Header:** `X-Organization-Id: <uuid>`

### ৫৩. Approve Income Entry (SUBMITTED → APPROVED)
- **Endpoint:** `POST /api/v1/finance/income/{id}/approve/`
- **Permissions:** `HasPermission(income.approve)`
- **Header:** `X-Organization-Id: <uuid>`
- **Enforcement:** `request.user.id !== income.created_by` (Separation of Duties).

### ৫৪. Reject Income Entry (SUBMITTED → REJECTED)
- **Endpoint:** `POST /api/v1/finance/income/{id}/reject/`
- **Permissions:** `HasPermission(income.reject)`
- **Header:** `X-Organization-Id: <uuid>`
- **Body:** `{"rejection_reason": "..."}`

### ৫৫. Get POS Receipt Metadata
- **Endpoint:** `GET /api/v1/finance/income/{id}/pos-receipt/`
- **Permissions:** `HasPermission(income.view)`
- **Header:** `X-Organization-Id: <uuid>`





