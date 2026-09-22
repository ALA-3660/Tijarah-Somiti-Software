# তিজারাহ সমিতি সফটওয়্যার — সেশন নিরাপত্তা স্পেসিফিকেশন (Session Security Specification)

## ১. সারসংক্ষেপ ও নীতি
সেশন নিরাপত্তা সিস্টেম প্রতিটি ব্যবহারকারীর সক্রিয় লগইন সেশন পর্যবেক্ষণ, বহু-ডিভাইস ট্র্যাক এবং অননুমোদিত প্রবেশ রোধে দূরবর্তী সেশন সমাপ্তিকরণ (Remote Session Termination) নিশ্চিত করে।

---

## ২. সেশন ডেটা মডেল (`SecuritySession`)

| ফিল্ড | টাইপ | বিবরণ |
| :--- | :--- | :--- |
| `sessionId` | `String` | অনন্য সেশন শনাক্তকারী (UI-তে মাস্কড) |
| `organizationId` | `String` | প্রতিষ্ঠানের অনন্য আইডি (Multi-tenant scoping) |
| `userId` | `String` | ব্যবহারকারীর আইডি |
| `userName` | `String` | ব্যবহারকারীর নাম |
| `userRoleName` | `String` | প্রাথমিক ভূমিকার নাম |
| `status` | `SecuritySessionStatus` | `active`, `expired`, `terminated` |
| `createdAt` | `DateTime` | সেশন তৈরির সময় |
| `lastActivityAt` | `DateTime` | সর্বশেষ সক্রিয়তার সময় |
| `expiresAt` | `DateTime` | সেশনের মেয়াদ শেষ হওয়ার সময় |
| `ipAddress` | `String?` | ক্লায়েন্ট আইপি অ্যাড্রেস (মাস্কড) |
| `deviceReference` | `String?` | ডিভাইস ও ওএস তথ্য (যেমন: Chrome / Windows 11) |
| `platformReference` | `String?` | প্ল্যাটফর্ম (Web Desktop, Android App ইত্যাদি) |
| `lastKnownLocationReference` | `String?` | আনুমানিক অবস্থান রেফারেন্স |
| `isCurrent` | `bool` | বর্তমান ডিভাইস কিনা |
| `terminatedAt` | `DateTime?` | সেশন সমাপ্তির সময় |
| `terminationReason` | `String?` | সমাপ্তির সুনির্দিষ্ট কারণ |
| `terminatedBy` | `String?` | সমাপ্তকারীর ইউজার আইডি |

---

## ৩. সেশন লাইফসাইকেল ও ট্রানজিশন

```text
[LOGIN] ───► ACTIVE ───► (Timeout) ──────► EXPIRED
               │
               └───────► (Terminate) ────► TERMINATED (Immutable Audit Event)
```

1. **Active**: ব্যবহারকারী সফলভাবে লগইন করেছেন এবং টোকেন সচল রয়েছে।
2. **Expired**: রিফ্রেশ টোকেন মেয়াদোত্তীর্ণ অথবা সেশন টাইমআউট ঘটেছে।
3. **Terminated**: অনুমোদিত প্রশাসক কর্তৃক সুনির্দিষ্ট কারণ উল্লেখপূর্বক দূরবর্তীভাবে সেশন বাতিল করা হয়েছে।

---

## ৪. দূরবর্তী সেশন সমাপ্তিকরণ (Remote Session Termination Protocol)
1. **অনুমতি যাচাই**: শুধুমাত্র `security.session.terminate` পারমিশনপ্রাপ্ত ব্যবহারকারী অন্য সেশন সমাপ্ত করতে পারেন।
2. **বাধ্যতামূলক কারণ**: সেশন সমাপ্তি নিশ্চিতকরণ ডায়ালগে কমপক্ষে ৫ অক্ষরের কারণ উল্লেখ বাধ্যতামূলক।
3. **অডিট ট্রেইল লিংক**: সেশন সমাপ্ত করার সাথে সাথে `SESSION_TERMINATED` নিরাপত্তা অডিট স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।
4. **বর্তমান সেশন নিরাপত্তা**: ব্যবহারকারীর নিজের বর্তমান সক্রিয় সেশনটিতে টারমিনেট বাটন প্রদর্শিত হয় না; স্বেচ্ছায় প্রস্থান করতে `Logout` ব্যবহৃত হয়।
