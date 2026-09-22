# Application States Architecture — তিজারাহ সমিতি সফটওয়্যার

আল্লাহর নামে শুরু করছি।

## ১. ভূমিকা ও আর্কিটেকচার নীতি (State Paradigm)
তিজারাহ সমিতি সফটওয়্যারের প্রতিটি স্ক্রিন এবং অ্যাসিনক্রোনাস ডেটা প্রসেসিং স্ট্যান্ডার্ড `UiState<T>` সিলড ক্লাস আর্কিটেকচার অনুসরণ করে।

কোনো স্ক্রিনে ম্যানুয়াল `bool isLoading` বা আনহ্যান্ডেলড এরর স্টেট থাকবে না। সকল ফিচার `UiState` এর প্যাটার্ন ম্যাচিং ব্যবহার করে UI রেন্ডার করবে।

---

## ২. `UiState<T>` সংজ্ঞায়ন

ফাইলের অবস্থান: `/lib/core/state/ui_state.dart`

```dart
sealed class UiState<T> {
  const UiState();

  const factory UiState.initial() = _Initial<T>;
  const factory UiState.loading({String? message}) = _Loading<T>;
  const factory UiState.success(T data) = _Success<T>;
  const factory UiState.empty({String? message}) = _Empty<T>;
  const factory UiState.error(String message, {String? technicalCode, Object? rawError}) = _Error<T>;
  const factory UiState.offline({String? message}) = _Offline<T>;
  const factory UiState.unauthorized({String? message}) = _Unauthorized<T>;
  const factory UiState.forbidden({String? message}) = _Forbidden<T>;
}
```

---

## ৩. স্টেটসমূহের বিস্তারিত ও ব্যবহারের নিয়ম

| স্টেট | অর্থ | ব্যবহৃত উইজেট | ইউজার অ্যাকশন |
|---|---|---|---|
| **Initial** | প্রাথমিক অবস্থা, ডেটা ফেচ শুরু হয়নি | Blank / Placeholder | স্বয়ংক্রিয় ফেচ বা ট্রিগার |
| **Loading** | নেটওয়ার্ক/ডাটাবেজ ফেচিং চলমান | `AppLoading` বা `AppSkeleton` | প্রোগ্রেস ও বাংলা মেসেজ |
| **Success** | ডেটা সফলভাবে রিসিভ হয়েছে | মেইন কনটেন্ট উইজেট | ফুল ইন্টারেকশন |
| **Empty** | কোনো রেকর্ড পাওয়া যায়নি | `AppEmptyState` | `+ নতুন যুক্ত করুন` CTA |
| **Error** | নেটওয়ার্ক বা সার্ভার এরর | `AppErrorState` | `পুনরায় চেষ্টা করুন` বাটন |
| **Offline** | ইন্টারনেট বা লোকাল সার্ভার বিচ্ছিন্ন | `AppNetworkStateWidget(offline)` | `রিফ্রেশ` বাটন |
| **Unauthorized** | লগইন সেশনের মেয়াদ শেষ | `AppNetworkStateWidget(unauth)` | `লগইন পেজে যান` বাটন |
| **Forbidden** | ইউজারের নির্দিষ্ট পারমিশন নেই | `AppPermissionState` | পারমিশন রিকোয়েস্ট / সাপোর্ট |

---

## ৪. স্ক্রিনে স্টেট ব্যবহারের প্র্যাকটিক্যাল উদাহরণ

```dart
class MemberListScreen extends StatelessWidget {
  final UiState<List<Member>> state;
  final VoidCallback onRetry;
  final VoidCallback onAddNew;

  const MemberListScreen({
    super.key,
    required this.state,
    required this.onRetry,
    required this.onAddNew,
  });

  @override
  Widget build(BuildContext context) {
    return state.when(
      initial: () => const Center(child: Text('অপেক্ষা করুন...')),
      
      loading: (msg) => AppLoading(
        message: msg ?? 'সদস্য তালিকা লোড করা হচ্ছে...',
      ),
      
      success: (members) => AppDataTable<Member>(
        columns: [/* ... */],
        items: members,
        mobileCardBuilder: (m) => MemberCard(member: m),
      ),
      
      empty: (msg) => AppEmptyState(
        title: 'কোনো সদস্য পাওয়া যায়নি',
        description: msg ?? 'বর্তমানে কোনো সক্রিয় সদস্য নিবন্ধিত নেই।',
        primaryActionLabel: '+ নতুন সদস্য যুক্ত করুন',
        onPrimaryAction: onAddNew,
      ),
      
      error: (msg, code) => AppErrorState(
        message: msg,
        technicalCode: code,
        onRetry: onRetry,
      ),
      
      offline: (msg) => AppNetworkStateWidget(
        status: AppNetworkStatus.offline,
        onRetry: onRetry,
      ),
      
      unauthorized: (msg) => const AppNetworkStateWidget(
        status: AppNetworkStatus.unauthorized,
      ),
      
      forbidden: (msg) => const AppPermissionState(
        requiredRoleOrPermission: 'ROLE_MEMBER_VIEW',
      ),
    );
  }
}
```

---

## ৫. স্কেলিটন লোডিং (Skeleton Shimmer)

পূর্ণাঙ্গ পেজ স্পিনারের পাশাপাশি বড় কার্ড ও ড্যাশবোর্ড উইজেটের জন্য `AppSkeleton` এবং `AppSkeletonCard` ব্যবহৃত হবে। এতে লেআউট শিফট (CLS) প্রতিহত হয় এবং প্রিমিয়াম অনুভূতি দেয়।

```dart
// স্কেলিটন কার্ড
const AppSkeletonCard();

// কাস্টম স্কেলিটন ব্লক
const AppSkeleton(width: 140, height: 20, borderRadius: 4);
```

---

## ৬. গ্লোবাল রিফ্রেশ ভিউ (`AppRefreshView`)

মোবাইল ও ওয়েব উভয় স্ক্রিনে পুল-টু-রিফ্রেশ এবং ডেস্কটপ রিফ্রেশ আইকনের সমন্বিত সমাধান:

```dart
AppRefreshView(
  onRefresh: () async {
    await controller.refreshData();
  },
  child: ListView(/* ... */),
);
```
