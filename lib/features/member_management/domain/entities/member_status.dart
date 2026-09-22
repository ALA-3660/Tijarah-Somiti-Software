/// MemberStatus: সদস্যের প্রাতিষ্ঠানিক লাইফসাইকেল স্ট্যাটাস
///
/// তিজারাহ সমিতি সফটওয়্যারে সদস্যপদ সংক্রান্ত লাইফসাইকেল
/// হার্ড-ডিলিট সম্পূর্ণ নিষিদ্ধ; শুধুমাত্র স্ট্যাটাস ট্রানজিশন সমর্থিত।
enum MemberStatus {
  /// সক্রিয় সদস্য (Active): সমবায় বা সমিতির পূর্ণ সক্রিয় সদস্য
  active('active', 'সক্রিয়', 0xFF1B5E20, 0xFFE8F5E9),

  /// নিষ্ক্রিয় সদস্য (Inactive): সাময়িকভাবে নিষ্ক্রিয় বা লেনদেন স্থগিত
  inactive('inactive', 'নিষ্ক্রিয়', 0xFFE65100, 0xFFFFF3E0),

  /// স্থগিত সদস্য (Suspended): শৃঙ্খলাভঙ্গ বা প্রশাসনিক কারণে স্থগিত
  suspended('suspended', 'স্থগিত', 0xFFB71C1C, 0xFFFFEBEE),

  /// আর্কাইভকৃত সদস্য (Archived): পদত্যাগ, স্থানান্তর বা সদস্যপদ বাতিলকৃত
  archived('archived', 'আর্কাইভকৃত', 0xFF424242, 0xFFEEEEEE);

  final String key;
  final String banglaName;
  final int primaryColorValue;
  final int backgroundColorValue;

  const MemberStatus(
    this.key,
    this.banglaName,
    this.primaryColorValue,
    this.backgroundColorValue,
  );

  /// স্ট্যাটাস কী থেকে অবজেক্টে রূপান্তর
  static MemberStatus fromKey(String? key) {
    if (key == null) return MemberStatus.active;
    for (final status in MemberStatus.values) {
      if (status.key.toLowerCase() == key.toLowerCase()) {
        return status;
      }
    }
    return MemberStatus.active;
  }

  bool get isActive => this == MemberStatus.active;
  bool get isSuspended => this == MemberStatus.suspended;
  bool get isArchived => this == MemberStatus.archived;
  bool get isInactive => this == MemberStatus.inactive;
}
