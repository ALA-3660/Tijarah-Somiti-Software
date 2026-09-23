# তিজারাহ সমিতি সফটওয়্যার (TSS) — Django Backend Foundation

---

## ১. ওভারভিউ (Overview)
TSS Backend হলো সংগঠনের যাবতীয় ব্যবসায়িক নীতি, নিরাপত্তা, বহু-সংগঠন বিচ্ছিন্নতা (Multi-tenancy), এবং আর্থিক লেনদেনের নীতি প্রয়োগের নির্ভরযোগ্য ও প্রামাণিক (Authoritative) স্তর।

- **Framework:** Django 5.x + Django REST Framework (DRF)
- **Target Database:** PostgreSQL (Authoritative)
- **API Prefix:** `/api/v1/`
- **Time Zone:** `Asia/Dhaka`
- **Language Code:** `bn-bd` (Bengali-First)

---

## ২. ডিরেক্টরি কাঠামো (Directory Structure)

```
backend/
├── manage.py                  # Django CLI এন্ট্রি পয়েন্ট
├── requirements.txt           # Python ডিপেন্ডেন্সি তালিকা
├── .env.example               # এনভায়রনমেন্ট কনফিগারেশন টেমপ্লেট
├── README.md                  # ব্যাকএন্ড সম্পর্কিত নির্দেশিকা
│
├── config/                    # প্রজেক্ট কনফিগারেশন
│   ├── settings/
│   │   ├── base.py            # মূল শেয়ার্ড সেটিংস
│   │   ├── development.py     # ডেভেলপমেন্ট সেটিংস
│   │   └── production.py      # সিকিউর প্রোডাকশন সেটিংস
│   ├── urls.py                # রুট URL রাউটিং
│   ├── asgi.py                # ASGI এন্ট্রি পয়েন্ট
│   └── wsgi.py                # WSGI এন্ট্রি পয়েন্ট
│
├── apps/                      # ডোমেইন ভিত্তিক মডুলার অ্যাপস
│   ├── core/                  # বেস মডেল, মিডলওয়্যার, সেন্ট্রালাইজড এক্সেপশন, হেলথ চেক
│   ├── organizations/         # অর্গানাইজেশন ও মাল্টি-টেন্যান্ট ফাউন্ডেশন
│   ├── authentication/        # প্রমাণীকরণ ও সেশন ফাউন্ডেশন
│   └── audit/                 # গভর্ন্যান্স ও অডিট লগ ফাউন্ডেশন
│
└── tests/                     # ব্যাকএন্ড টেস্ট সুইট
```

---

## ৩. লোকাল ডেভেলপমেন্ট সেটআপ (Local Setup Instructions)

### Windows / Linux / macOS:
```bash
cd backend

# ১. ভার্চুয়াল এনভায়রনমেন্ট তৈরি করুন
python -m venv .venv

# ২. অ্যাক্টিভেশন:
# Windows:
.venv\Scripts\activate
# Linux / macOS:
source .venv/bin/activate

# ৩. ডিপেন্ডেন্সি ইন্সটল করুন
pip install -r requirements.txt

# ৪. এনভায়রনমেন্ট ফাইল প্রস্তুত করুন
cp .env.example .env
# (.env ফাইলে আপনার PostgreSQL ডাটাবেস ক্রেডেনশিয়াল প্রদান করুন)

# ৫. সিস্টেম চেক ও মাইগ্রেশন চালান
python manage.py check
python manage.py migrate

# ৬. ডেভেলপমেন্ট সার্ভার চালু করুন
python manage.py runserver 0.0.0.0:8000
```

---

## ৪. হেলথ চেক এন্ডপয়েন্ট (Health Check)
- **URL:** `GET /api/v1/health/`
- **Authentication:** উন্মুক্ত (Public)
- **নমুনা রেসপন্স:**
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

## ৫. মূল আর্কিটেকচারাল পলিসি ও আর্থিক নীতি (Financial Guardrails)

1. **Account Entity Boundary (Phase 5.1 Locked):**
   - `Account` এনটিটির একমাত্র দায়িত্ব হলো "টাকা বর্তমানে কোথায় আছে" (Where money is held)।
   - Account মডেলে কোনো `balance`, `currentBalance`, `availableBalance`, `debit`, `credit`, `totalIncome`, `totalExpense`, `ledgerBalance`, বা `closingBalance` ফিল্ড থাকবে না।
   - `openingBalanceSupported` ফিল্ডটি শুধুমাত্র স্ট্রাকচারাল বুলিয়ান ফ্ল্যাগ হিসেবে কাজ করবে (কোনো আর্থিক মান নয়)।
   - ব্যালেন্স ও খতিয়ান হিসাব শুধুমাত্র **Phase 5.7 (Official Ledger & Balance Engine)**-এ অনুমোদিত হবে।

2. **Monetary Precision Rule:**
   - যাবতীয় আর্থিক মানের জন্য `DecimalField` (`DECIMAL(14,2)`) ব্যবহার বাধ্যতামূলক। ফ্লোটিং-পয়েন্ট এরিথমেটিক সম্পূর্ণ নিষিদ্ধ।

3. **Separation of Duties:**
   - লেনদেন প্রস্তুতকারী (`created_by`) নিজে তার লেনদেন অনুমোদন (`approved_by`) করতে পারবেন না।

4. **Multi-Tenant Isolation:**
   - প্রতিটি অনুরোধে `X-Organization-Id` হেডার যাচাই করা হবে এবং ক্রস-টেন্যান্ট ডেটা এক্সেস ৪০৩ ফোরবিডেন রিটার্ন করবে।
