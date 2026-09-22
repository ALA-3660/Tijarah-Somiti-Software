# Reusable UI Components — তিজারাহ সমিতি সফটওয়্যার

আল্লাহর নামে শুরু করছি।

## ভূমিকা ও উদ্দেশ্য (Overview)
`Prompt 1.4` এর অধীনে তিজারাহ সমিতি সফটওয়্যারের সকল মডিউলের জন্য একটি সমন্বিত, বাংলা-ফার্স্ট (Bengali-First), অ্যাক্সেসিবল (WCAG AA), রেসপনসিভ এবং প্রেজেন্টেশনাল রিইউজেবল কম্পোনেন্ট লাইব্রেরি প্রতিষ্ঠা করা হয়েছে।

সকল কম্পোনেন্ট `/lib/shared/widgets/` ডিরেক্টরিতে রক্ষিত এবং `/lib/shared/widgets/widgets.dart` ব্যারেল ফাইলের মাধ্যমে এক্সপোর্ট করা।

---

## ১. বাটন ও অ্যাকশন কন্ট্রোল (Buttons & Icon Buttons)

### ১.১ `AppButton`
সব ধরণের প্রাইমারি, সেকেন্ডারি, আউটলাইন, টেক্সট, সাকসেস ও ডেস্ট্রাক্টিভ অ্যাকশনের জন্য একক স্ট্যান্ডার্ড বাটন।

- **অ্যাক্সেসিবিলিটি**: নূন্যতম ৪৮ × ৪৮ dp টাচ টার্গেট নিশ্চিত করা হয়েছে।
- **লোডিং স্টেট**: `isLoading: true` দিলে স্বয়ংক্রিয়ভাবে টেক্সট হাইড হয়ে স্পিনার প্রদর্শিত হয় এবং বাটন নিষ্ক্রিয় থাকে।
- **টাইপোগ্রাফি**: `Baloo Da 2` (বাংলা সংখ্যা ও অ্যাকশন টেক্সট)।

```dart
// প্রাইমারি বাটন
AppButton.primary(
  label: 'সংরক্ষণ করুন',
  icon: Icons.check,
  onPressed: () => _handleSave(),
);

// সেকেন্ডারি বাটন
AppButton.secondary(
  label: 'বাতিল',
  onPressed: () => Navigator.pop(context),
);

// আউটলাইন বাটন
AppButton.outline(
  label: 'রসিদ প্রিন্ট করুন',
  icon: Icons.print_outlined,
  onPressed: () => _handlePrint(),
);

// ডেস্ট্রাক্টিভ বাটন
AppButton.destructive(
  label: 'মুছে ফেলুন',
  icon: Icons.delete_outline,
  onPressed: () => _handleDelete(),
);

// লোডিং স্টেট
AppButton.primary(
  label: 'সংরক্ষণ করা হচ্ছে...',
  isLoading: true,
  onPressed: null,
);
```

### ১.২ `AppIconButton`
টুলবার, ডাটা টেবিল ও অ্যাকশন মেনুর জন্য আইকন বাটন।
- ভ্যারিয়েন্ট: `primary`, `secondary`, `destructive`, `outline`, `ghost`
- প্রতিটি বাটনে বাধ্যতামূলক বাংলা `tooltip` রয়েছে।

```dart
AppIconButton(
  icon: Icons.edit_outlined,
  tooltip: 'সম্পাদনা করুন',
  variant: AppIconButtonVariant.primary,
  onPressed: () => _onEdit(),
);
```

---

## ২. ফর্ম ইনপুট, ড্রপডাউন ও তারিখ চয়ন (Form Inputs)

### ২.১ `AppTextField`
সেন্ট্রালাইজড টেক্সট ফিল্ড যা লেবেল, রিকোয়ার্ড এস্টেরিস্ক (`*`), প্রিফিক্স/সাফিক্স আইকন, পাসওয়ার্ড টগল এবং বাংলা ভ্যালিডেশন সমর্থন করে।

```dart
// স্ট্যান্ডার্ড টেক্সট ইনপুট
AppTextField(
  label: 'সদস্যের নাম',
  isRequired: true,
  controller: _nameController,
  hintText: 'পূর্ণ নাম লিখুন',
  validator: AppFormValidation.required('সদস্যের নাম আবশ্যক'),
);

// কারেন্সি / টাকার ইনপুট (৳ প্রিফিক্স ও সংখ্যা কীবোর্ড)
AppTextField.currency(
  label: 'শেয়ার ক্রয়ের পরিমাণ',
  isRequired: true,
  controller: _amountController,
  hintText: '০.০০',
  validator: AppFormValidation.positiveNumber('সঠিক টাকার পরিমাণ দিন'),
);

// পাসওয়ার্ড ইনপুট (টগল ভিজিবিলিটি সহ)
AppTextField.password(
  label: 'পাসওয়ার্ড',
  isRequired: true,
  controller: _passwordController,
);
```

### ২.২ `AppDropdown<T>`
সার্চ ও সাবটাইটেল সাপোর্টসহ ড্রপডাউন মেনু।

```dart
AppDropdown<String>(
  label: 'তহবিল নির্বাচন (Fund Selection)',
  isRequired: true,
  hint: 'তহবিল বেছে নিন',
  value: _selectedFund,
  items: const [
    AppDropdownItem(value: 'general', label: 'সাধারণ তহবিল', subtitle: 'General Fund'),
    AppDropdownItem(value: 'welfare', label: 'কল্যাণ তহবিল', subtitle: 'Member Welfare Fund'),
    AppDropdownItem(value: 'share', label: 'শেয়ার মূলধন তহবিল', subtitle: 'Share Capital'),
  ],
  onChanged: (val) => setState(() => _selectedFund = val),
);
```

### ২.৩ `AppDatePicker` ও `AppDateRangePicker`
বাংলা ডিজিট ও স্থানীয় ফরম্যাট সহ একক তারিখ ও তারিখ রেঞ্জ চয়ন।

```dart
AppDatePicker(
  label: 'ভর্তির তারিখ',
  isRequired: true,
  selectedDate: _joiningDate,
  onDateSelected: (date) => setState(() => _joiningDate = date),
);

AppDateRangePicker(
  label: 'হিসাবকাল নির্বাচন',
  selectedRange: _reportDateRange,
  onRangeSelected: (range) => setState(() => _reportDateRange = range),
);
```

---

## ৩. সার্চ ও ফিল্টার বার (Search & Filter Bar)

### ৩.১ `AppSearchField`
৩০০ মিলিসেকেন্ড ডিব্যউন্সড সার্চ ইনপুট ফিল্ড ও ক্লিয়ার বাটন।

```dart
AppSearchField(
  hint: 'সদস্য নাম, কোড বা মোবাইল দিয়ে খুঁজুন...',
  onSearch: (query) => _handleSearch(query),
);
```

### ৩.২ `AppFilterBar`
হরাইজন্টাল স্ক্রোলযোগ্য ফিল্টার চিপস, অ্যাক্টিভ ফিল্টার কাউন্ট ও এক-ক্লিকে রিসেট সাপোর্ট।

```dart
AppFilterBar(
  filters: _filterList,
  onFilterSelected: (item) => _toggleFilter(item),
  onClearAll: () => _resetFilters(),
  activeFilterSummary: 'ফিল্টারকৃত ৩টি ফলাফল প্রদর্শিত হচ্ছে',
);
```

---

## ৪. স্ট্যাটাস ব্যাজ ও শরিয়াহ ব্যাজ (Status Badges)

### ৪.১ `AppStatusBadge`
সিস্টেমের যেকোনো এনটিটির স্ট্যাটাস প্রদর্শনের জন্য:
- `active` (সক্রিয়)
- `pending` (অপেক্ষমাণ)
- `approved` (অনুমোদিত)
- `rejected` (বাতিলকৃত)
- `draft` (খসড়া)
- `completed` (সম্পন্ন)
- `cancelled` (স্থগিত)
- `requiresReview` (পর্যালোচনা প্রয়োজন)

```dart
const AppStatusBadge(status: AppGenericStatus.active);
```

### ৪.২ `AppShariahBadge`
শরিয়াহ কমপ্লায়েন্স সংক্রান্ত তথ্যবহুল ব্যাজ (ফতোয়া বা জাজমেন্ট নয়, স্ট্যান্ডার্ড ট্র্যাকিং):
- `shariahCompliant` (শরিয়াহ সম্মত কাঠামো)
- `underReview` (পর্যালোচনাধীন)
- `guidanceRequired` (পরামর্শ প্রয়োজন)
- `documentationPending` (ডকুমেন্টেশন অপেক্ষমাণ)

```dart
const AppShariahBadge(status: AppShariahStatus.shariahCompliant);
```

---

## ৫. টাকা ও সংখ্যা প্রদর্শন (Currency & Number Display)

### ৫.১ `AppCurrencyDisplay`
বাংলাদেশি কারেন্সি ফরম্যাটিং (`৳`), দক্ষিণ এশীয় কমা বিভাজন (`১২,৫০,০০০.০০`) এবং বাংলা অঙ্কে প্রদর্শন।

```dart
const AppCurrencyDisplay(
  amount: 1250000,
  size: CurrencyDisplaySize.large,
  label: 'মোট শেয়ার মূলধন',
);
```

### ৫.২ `AppNumberDisplay`
শতাংশ (`৮৫.৫%`), কম্প্যাক্ট ফরম্যাটিং (`১২.৫K`) ও কাস্টম কালার সাপোর্ট।

---

## ৬. ফিডব্যাক ও ডায়ালগ (Dialogs, Modals, Snackbars)

### ৬.১ `AppDialog`
```dart
// তথ্য ডায়ালগ
AppDialog.showInfo(
  context,
  title: 'বিজ্ঞপ্তি',
  message: 'আগামী শুক্রবার সমিতির সাধারণ সভা অনুষ্ঠিত হবে।',
);

// নিশ্চিতকরণ ডায়ালগ
final confirmed = await AppDialog.showConfirmation(
  context,
  title: 'ভাউচার অনুমোদন',
  message: 'আপনি কি এই জমা ভাউচারটি অনুমোদন করতে চান?',
);
```

### ৬.২ `AppSnackbar`
উপরে ভাসমান ফ্লোটিং নোটিফিকেশন (সাকসেস, এরর, ওয়ার্নিং, ইনফো) এবং দ্রুত একাধিক ট্যাপের ক্ষেত্রে স্বয়ংক্রিয় থ্রোটলিং।

```dart
AppSnackbar.showSuccess(context, message: 'সফলভাবে সংরক্ষিত হয়েছে।');
AppSnackbar.showError(context, message: 'সার্ভার সংযোগ বিচ্ছিন্ন।');
```

### ৬.৩ `AppConfirmAction`
গুরুত্বপূর্ণ বা অপূরণীয় আর্থিক কার্যক্রমে ইনলাইন সতর্কতা ও নিশ্চিতকরণ কার্ড।

---

## ৭. রেসপনসিভ ডাটা টেবিল ও পেজিনেশন (Data Table & Pagination)

### `AppDataTable<T>`
- ডেস্কটপ/ওয়েবে মাল্টি-কলাম গ্রিড।
- মোবাইল বা সরু স্ক্রিনে স্বয়ংক্রিয়ভাবে `mobileCardBuilder` অনুযায়ী কার্ড লিস্টে রূপান্তর।
- পেজিনেশন কন্ট্রোল (`AppPagination`) অন্তর্ভুক্তি।

```dart
AppDataTable<MemberSummary>(
  columns: [
    AppTableColumn(title: 'কোড', cellBuilder: (m) => Text(m.code)),
    AppTableColumn(title: 'সদস্যের নাম', cellBuilder: (m) => Text(m.name)),
    AppTableColumn(title: 'শেয়ার', isNumeric: true, cellBuilder: (m) => Text(m.shares)),
  ],
  items: memberList,
  mobileCardBuilder: (m) => AppListTile(title: m.name, subtitle: m.code),
  pagination: AppPagination(
    currentPage: _page,
    totalPages: _total,
    onPageChanged: (p) => setState(() => _page = p),
  ),
);
```

---

## ৮. ফাইল সংযুক্তি ও অডিট কার্ড (Attachment Picker & Stat Cards)

- `AppAttachmentPicker`: ডকুমেন্ট, স্ক্যান কপি ও চুক্তিপত্র আপলোড ও লিস্ট প্রদর্শন।
- `AppStatCard`: মূল মেট্রিক ও ট্রেন্ড লেবেল প্রদর্শন (`isDemo: true` সহ)।
- `AppSectionHeader`: প্রতি সেকশনের টাইটেল, কাউন্ট ব্যাজ ও ডানপাশের কাস্টম অ্যাকশন বাটন।
