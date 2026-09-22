# Demo Organization Policy — UI Testing Only

## Overview
**খুরুশকুল ওলামা সমিতি** হলো তিজারাহ সমিতি সফটওয়্যারের একটি নির্দিষ্ট **Demo Organization**, যা শুধুমাত্র নিম্নোক্ত কার্যাবলীর জন্য অনুমোদিত:

1. **UI Preview & Testing**: স্ক্রিন লেআউট ও ইউজার ইন্টারফেস যাচাইকরণ।
2. **Typography Testing**: Hind Siliguri, Baloo Da 2 এবং Tiro Bangla ফন্ট রেন্ডারিং পরীক্ষা।
3. **Organization Header Testing**: সমিতি হেডার, ব্র্যান্ডিং স্লোগান ও ব্যাজ রেন্ডারিং পরীক্ষা।
4. **Application Shell Testing**: AppBar, Drawer, Bottom Bar এবং উইজেট শেল স্ট্যাবিলিটি যাচাই।
5. **Demo Dashboard Placeholder**: ড্যাশবোর্ড স্থানধারক প্রিভিউ।
6. **Light/Dark Theme Testing**: কালার কনট্রাস্ট ও থিম টগল যাচাই।
7. **Responsive Layout Testing**: মোবাইল, ট্যাবলেট ও বিভিন্ন স্ক্রিন সাইজে রেসপনসিভনেস পরীক্ষা।

---

## Demo Display Specification

```text
খুরুশকুল ওলামা সমিতি
[DEMO ORGANIZATION] / [DEMO / SAMPLE DATA]

তিজারাহ সমিতি সফটওয়্যার
ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা
```

---

## কঠোর নিষেধাজ্ঞা ও নিয়মাবলী (Strict Prohibitions)

1. **No Production Hardcoding**:
   - `খুরুশকুল ওলামা সমিতি`-কে কোনো বাস্তব প্রোডাকশন অর্গানাইজেশন হিসেবে ডাটাবেজে বা ব্যাকএন্ডে হার্ডকোড করা যাবে না।
   - প্রোডাকশন মোডে (`Environment.production`) ডেমো অর্গানাইজেশন স্বয়ংক্রিয়ভাবে ব্লকড ও নিষ্ক্রিয় থাকবে।

2. **No Real Business / Financial Entities**:
   কোনো অবস্থাতেই নিম্নোক্ত বাস্তব তথ্য তৈরি বা সংরক্ষণ করা যাবে না:
   - বাস্তব সদস্য বা সদস্যের ব্যক্তিগত তথ্য (মোবাইল নম্বর, জাতীয় পরিচয়পত্র ইত্যাদি)
   - বাস্তব আয় বা ব্যয় ভাউচার
   - বাস্তব Fund Balance, Account Balance, Bank Balance, Cash Balance
   - শেয়ার মূলধন বা ডিভিডেন্ড ডেটা
   - প্রকল্প (Project) বা বিনিয়োগ হিসাব
   - গ্রাহক (Customer), পণ্য (Product), বিক্রয় (Sales) বা কিস্তি (Installment)
   - স্থাবর সম্পদ (Land / Asset)
   - পরিচালনা কমিটির আর্থিক লেনদেন

3. **Explicit Demo Value Marking**:
   - যদি UI পরীক্ষার স্বার্থে কোনো সংখ্যা বা টাকার অংক দেখানোর প্রয়োজন হয়, তবে সেটিকে স্পষ্টভাবে **"নমুনা মান / DEMO VALUE (UI পরীক্ষার জন্য)"** হিসেবে চিহ্নিত করতে হবে।

4. **Clean Architectural Separation**:
   - `DemoOrganizationConfig` সম্পূর্ণ আলাদা মডিউলে সংরক্ষিত (`lib/core/demo/demo_organization_config.dart`)।
   - প্রোডাকশন বিল্ডে কোনো পরিবর্তন ছাড়াই ডেমো কনফিগারেশন নিষ্ক্রিয় বা সরানো সম্ভব।
