# Django REST API & PostgreSQL ইন্টিগ্রেশন স্পেসিফিকেশন

## ১. মাল্টি-টেন্যান্ট ডেটা আইসোলেশন (Data Isolation)

Flutter ক্লায়েন্ট থেকে প্রতিটি অনুরোধে নিচের হেডারটি অন্তর্ভুক্ত থাকে:
```http
X-Organization-Id: <uuid-of-organization>
Authorization: Bearer <jwt-access-token>
Content-Type: application/json
```

### Django ব্যাকএন্ডে হ্যান্ডলিং নীতি:
```python
# Django Middleware Concept:
class TenantContextMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        org_id = request.headers.get('X-Organization-Id')
        if org_id:
            request.organization = Organization.objects.get(id=org_id)
        return self.get_response(request)
```

## ২. PostgreSQL ডেটাবেজ নীতি
* প্রতিটি ব্যবসায়িক টেবিলে `organization_id` কলাম ফরেন কি হিসেবে থাকবে।
* ব্যাকএন্ড কোয়েরি স্বয়ংক্রিয়ভাবে ফিল্টার করবে: `Model.objects.filter(organization=request.organization)`
* এক সমিতির ডাটা অন্য সমিতি দেখতে পারবে না।

## ৩. অডিট ট্রেইল স্পেসিফিকেশন
* টেবিলগুলোতে থাকবে:
  - `created_by_id`, `created_at`
  - `updated_by_id`, `updated_at`
  - `approved_by_id`, `approved_at`
  - `status` (DRAFT, PENDING, APPROVED, REVERSED)

---

## ৪. Organization Management API Endpoints (Prompt 2.1)

### ক. বর্তমান সক্রিয় সমিতি আনয়ন (Get Current Organization)
* **Method:** `GET`
* **URL:** `/api/v1/organization/current/`
* **Headers:** `X-Organization-Id: <uuid>`, `Authorization: Bearer <token>`
* **Response (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "organization_code": "ALF-001",
  "name": "আল-ফালাহ বহুমুখী সমবায় সমিতি লিমিটেড",
  "short_name": "আল-ফালাহ সমিতি",
  "organization_type": "society",
  "status": "active",
  "phone": "01711-223344",
  "email": "info@alfalah-samity.org",
  "address": "মিরপুর-১০, ঢাকা",
  "description": "হালাল বিনিয়োগ ও সদস্যদের কল্যাণে পরিচালিত বহুমুখী সমবায় সমিতি।",
  "logo": "https://api.tijarah.org/media/logos/alfalah.png",
  "created_at": "2018-05-12T00:00:00.000Z",
  "updated_at": "2026-09-22T00:00:00.000Z",
  "created_by": "System Administrator",
  "updated_by": "Authorized Operator"
}
```

### খ. সমিতি তথ্য হালনাগাদ (Update Organization)
* **Method:** `PATCH`
* **URL:** `/api/v1/organization/current/`
* **Headers:** `X-Organization-Id: <uuid>`, `Authorization: Bearer <token>`
* **Payload:**
```json
{
  "name": "আল-ফালাহ বহুমুখী সমবায় সমিতি লিমিটেড",
  "short_name": "আল-ফালাহ সমিতি",
  "organization_type": "society",
  "phone": "01711-223344",
  "email": "contact@alfalah-samity.org",
  "address": "মিরপুর-১০, ঢাকা-১২১৬",
  "description": "হালনাগাদকৃত প্রাতিষ্ঠানিক পরিচিতি।"
}
```
* **সীমাবদ্ধতা:** `id` এবং `organization_code` কোনোভাবেই ক্লায়েন্ট থেকে পরিবর্তনযোগ্য নয়।

### গ. সমিতির স্ট্যাটাস লাইফসাইকেল পরিবর্তন (Update Status)
* **Method:** `PATCH`
* **URL:** `/api/v1/organization/current/status/`
* **Payload:**
```json
{
  "status": "suspended",
  "reason": "আইনি নিরীক্ষার জন্য সাময়িক স্থগিত"
}
```
* **মানসমূহ:** `active`, `inactive`, `suspended`, `archived`
* **পলিসি:** নো হার্ড ডিলিট। Soft delete ও lifecycle স্ট্যাটাসের মাধ্যমে নিয়ন্ত্রিত।

