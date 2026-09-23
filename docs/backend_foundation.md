# TSS Backend Foundation Architecture (Phase B1)
## তিজারাহ সমিতি সফটওয়্যার (Tijarah Samity Software — TSS)

---

## ১. ওভারভিউ ও আর্কিটেকচারাল দর্শন (Architecture & Philosophy)

**তিজারাহ সমিতি সফটওয়্যার (TSS)** একটি ইসলামি শরিয়াহ-সম্মত সমিতি ও ক্ষুদ্র ব্যবসায়িক আর্থিক ব্যবস্থাপনা প্ল্যাটফর্ম। 

### মূল আর্কিটেকচারাল ফ্লো:
```
Flutter Android App / Web SPA
            ↓ (REST HTTP JSON / Bearer Token)
     API Gateway Layer (/api/v1/)
            ↓
  Django + Django REST Framework (Business Rule Authoritative Layer)
            ↓ (SQL / Constraints / ACID Transactions)
   PostgreSQL (Authoritative Relational Database)
```

Backend হলো সিস্টেমের সমস্ত সিকিউরিটি, টেন্যান্ট আইসোলেশন, পারমিশন, অনুমোদন লাইফসাইকেল এবং শরিয়াহ আর্থিক নিয়মের প্রামাণিক (Authoritative) বাস্তবায়ন স্তর।

---

## ২. ডিরেক্টরি কাঠামো (Directory Layout)

```
backend/
├── manage.py                          # Django ম্যানেজমেন্ট CLI
├── requirements.txt                   # পিন করা ডিপেন্ডেন্সি তালিকা
├── .env.example                       # এনভায়রনমেন্ট কনফিগারেশন নমুনা
├── README.md                          # ব্যাকএন্ড লোকাল ডেভেলপমেন্ট গাইড
│
├── config/                            # প্রজেক্ট ওয়াইড কনফিগারেশন
│   ├── __init__.py
│   ├── asgi.py                        # ASGI সার্ভার এন্ট্রি
│   ├── wsgi.py                        # WSGI সার্ভার এন্ট্রি
│   ├── urls.py                        # রুট URL রাউটিং (/api/v1/)
│   └── settings/                      # এনভায়রনমেন্ট অনুযায়ী সেটিংস বিভাজন
│       ├── __init__.py
│       ├── base.py                    # মূল শেয়ার্ড কনফিগারেশন
│       ├── development.py             # লোকাল ডেভেলপমেন্ট ও ডিবাগ সেটিংস
│       └── production.py              # সিকিউর প্রোডাকশন সেটিংস
│
├── apps/                              # ডোমেইন ভিত্তিক মডুলার আর্কিটেকচার
│   ├── __init__.py
│   ├── core/                          # বেস মডেল, সেন্ট্রালাইজড এক্সেপশন, মিডলওয়্যার
│   │   ├── apps.py
│   │   ├── models.py                  # BaseUUIDModel, TimeStampedModel, OrganizationScopedModel
│   │   ├── middleware.py              # OrganizationContextMiddleware, RequestLoggingMiddleware
│   │   ├── exceptions.py              # Centralized Exception Handler & Custom Exceptions
│   │   ├── permissions.py             # IsTenantAuthorized, HasPermissionCode
│   │   ├── pagination.py              # StandardResultsSetPagination
│   │   ├── views.py                   # HealthCheckView
│   │   └── urls.py                    # /api/v1/health/
│   ├── authentication/                # প্রমাণীকরণ ও টোকেন ম্যানেজমেন্ট ফাউন্ডেশন
│   │   ├── apps.py
│   │   └── urls.py
│   ├── organizations/                 # বহু-সংগঠন বিচ্ছিন্নতা (Multi-tenancy) ফাউন্ডেশন
│   │   ├── apps.py
│   │   └── urls.py
│   └── audit/                         # সিকিউরিটি ও গভর্ন্যান্স অডিট ট্রেইল ফাউন্ডেশন
│       ├── apps.py
│       └── models.py                  # BaseAuditEvent
│
└── tests/                             # ব্যাকএন্ড টেস্ট ফাউন্ডেশন
    ├── __init__.py
    ├── test_settings.py               # সেটিংস ও কনফিগারেশন টেস্ট
    ├── test_health.py                 # হেলথ এন্ডপয়েন্ট টেস্ট
    ├── test_organization_middleware.py # অর্গানাইজেশন মিডলওয়্যার টেস্ট
    └── test_exceptions.py              # এক্সেপশন হ্যান্ডলার টেস্ট
```

---

## ৩. এনভায়রনমেন্ট ভেরিয়েবল স্পেসিফিকেশন (Environment Variables)

| ভেরিয়েবল | ডিফল্ট মান | বর্ণনা |
| :--- | :--- | :--- |
| `DJANGO_SETTINGS_MODULE` | `config.settings.development` | সক্রিয় সেটিংস মডিউল |
| `DJANGO_SECRET_KEY` | *(Secret)* | ক্রিপ্টোগ্রাফিক সিক্রেট কি (প্রোডাকশনে বাধ্যতামূলক) |
| `DJANGO_DEBUG` | `True` (dev) / `False` (prod) | ডিবাগ মোড ফ্ল্যাগ |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | অনুমোদিত হোস্ট তালিকা |
| `DATABASE_ENGINE` | `django.db.backends.postgresql` | ডাটাবেস ইঞ্জিন (PostgreSQL বাধ্যতামূলক) |
| `DATABASE_NAME` | `tss_db` | ডাটাবেসের নাম |
| `DATABASE_USER` | `tss_user` | ডাটাবেস ইউজার |
| `DATABASE_PASSWORD` | *(Secret)* | ডাটাবেস পাসওয়ার্ড |
| `DATABASE_HOST` | `127.0.0.1` | ডাটাবেস সার্ভার হোস্ট |
| `DATABASE_PORT` | `5432` | ডাটাবেস পোর্ট |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | ফ্রন্টএন্ড ক্লায়েন্ট অরিজিন তালিকা |
| `DJANGO_LOG_LEVEL` | `INFO` | লগিং লেভেল (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |

---

## ৪. হেলথ চেক এন্ডপয়েন্ট স্পেসিফিকেশন (Health Check Specification)

- **URL:** `GET /api/v1/health/`
- **Method:** `GET`
- **Authentication:** `AllowAny` (কোনো প্রমাণীকরণ প্রয়োজন নেই)
- **Tenant Scope:** ঐচ্ছিক (Organization Context ছাড়া কাজ করবে)
- **Database Dependency:** ডাটাবেস ডিসকানেক্টেড থাকলেও এটি প্রসেস লাইভনেস নিশ্চিত করতে ২০২/২০০ কোডে রেসপন্স প্রদান করবে।
- **রেসপন্স কাঠামো (JSON):**
```json
{
  "success": true,
  "status": "healthy",
  "message": "TSS API সচল আছে",
  "service": "Tijarah Samity Software Core Backend",
  "version": "v1",
  "environment": "development"
}
```

---

## ৫. সেন্ট্রালাইজড এরর হ্যান্ডলিং কাঠামো (Standard Error Response)

সমস্ত ব্যর্থ অনুরোধের ক্ষেত্রে সিস্টেম একটি স্ট্যান্ডার্ড মেশিন-রিডেবল ফরম্যাট প্রদান করে:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "প্রদত্ত ইনপুটে ত্রুটি রয়েছে।",
    "details": {
      "amount": ["পরিমাণ অবশ্যই ধনাত্মক সংখ্যা হতে হবে।"]
    }
  }
}
```

### প্রধান এরর কোড তালিকা:
* `400 Bad Request`: `VALIDATION_ERROR`, `INVALID_ORGANIZATION_ID`, `ORGANIZATION_HEADER_REQUIRED`
* `401 Unauthorized`: `AUTHENTICATION_REQUIRED`
* `403 Forbidden`: `PERMISSION_DENIED`, `CROSS_TENANT_ACCESS_FORBIDDEN`, `SEPARATION_OF_DUTIES_VIOLATION`
* `404 Not Found`: `RESOURCE_NOT_FOUND`
* `405 Method Not Allowed`: `METHOD_NOT_ALLOWED`, `APPROVED_ENTITY_IMMUTABLE`
* `429 Too Many Requests`: `RATE_LIMIT_EXCEEDED`
* `500 Internal Server Error`: `INTERNAL_SERVER_ERROR`

---

## ৬. আর্থিক ও নিরাপত্তা নীতি (Financial & Security Guardrails)

### ক. Account Entity Boundary (Phase 5.1 Locked):
* `Account` হলো শুধুমাত্র **টাকা কোথায় আছে** (Where money is held) তার নির্দেশক।
* কোনো `balance`, `currentBalance`, `availableBalance`, `debit`, `credit`, `totalIncome`, `totalExpense`, `ledgerBalance`, বা `closingBalance` ফিল্ড Account মডেলে থাকবে না।
* `openingBalanceSupported` ফিল্ডটি শুধুমাত্র স্ট্রাকচারাল ক্যাপাবিলিটি নির্দেশক বুলিয়ান ফ্ল্যাগ (কোনো টাকা বা ব্যালেন্স নয়)।
* হিসাবের সমাপনী ব্যালেন্স ও লেজার খতিয়ান ভবিষ্যতের **Phase 5.7 (Official Ledger & Balance Engine)**-এর অধীন।

### খ. ডেসিমেল আর্থিক নীতি (Decimal Precision Policy):
* আর্থিক লেনদেনে ফ্লোটিং-পয়েন্ট এরিথমেটিক সম্পূর্ণ নিষিদ্ধ। সমস্ত আর্থিক ফিল্ড `models.DecimalField(max_digits=14, decimal_places=2)` ব্যবহার করবে।

### গ. দায়িত্বের বিভাজন (Separation of Duties):
* লেনদেন প্রস্তুতকারী ব্যবহারকারী নিজে তার তৈরিকৃত লেনদেন অনুমোদন করতে পারবেন না (`created_by != approved_by`)।

---

## ৭. B1 স্কোপ বনাম ভবিষ্যৎ রোডম্যাপ (Roadmap & Phase Boundaries)

```
B1: Django Backend Foundation + PostgreSQL Configuration [THIS STEP]
    ↓
B2: Master Data (Head, Fund) + Account Backend
    ↓
B3: Generic Transaction Core Backend
    ↓
B4: Unified Income API (12 Income Types)
    ↓
B5: Live PostgreSQL + Live API + End-to-End Verification
    ↓
Phase 5.3 LOCK
    ↓
Phase 5.4: Expense Management
```

### B1-এ যা অন্তর্ভুক্ত:
- Django 5 প্রজেক্ট কাঠামো ও সেটিংস বিভাজন
- DRF ও CORS ইন্টিগ্রেশন
- PostgreSQL-ফার্স্ট ডাটাবেস কনফিগারেশন
- সেন্ট্রালাইজড এরর হ্যান্ডলিং ও কাস্টম এক্সেপশন
- অর্গানাইজেশন কনটেক্সট মিডলওয়্যার ও টেন্যান্ট আইসোলেশন বেস
- অডিট লগিং বেস মডেল
- বেস অ্যাবস্ট্রাক্ট মডেলসমূহ (`BaseUUIDModel`, `TimeStampedModel`, `OrganizationScopedModel`, `AuditableModel`)
- হেলথ চেক এন্ডপয়েন্ট (`/api/v1/health/`)
- টেস্ট কাঠামো ও কনফিগারেশন পরীক্ষা

### ❌ B1-এ যা সম্পূর্ণ বহির্ভূত:
- ❌ Income / Expense / Transfer লেনদেন ইঞ্জিন
- ❌ Opening Balance Injection
- ❌ Official Ledger / Balance Engine
- ❌ Share / Project Accounting
- ❌ Welfare / Qard-e-Hasana
- ❌ Member Settlement
- ❌ Payment Gateway
