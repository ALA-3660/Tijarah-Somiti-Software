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
