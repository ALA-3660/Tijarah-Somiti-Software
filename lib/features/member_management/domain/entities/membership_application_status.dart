/// MembershipApplicationStatus: সদস্যপদ আবেদনের স্ট্যাটাস স্টেট মেশিন
enum MembershipApplicationStatus {
  draft('draft', 'খসড়া', 'আবেদনপত্রটি তৈরির পর্যায়ে রয়েছে'),
  submitted('submitted', 'জমা দেওয়া হয়েছে', 'আবেদনকারী কর্তৃক আনুষ্ঠানিকভাবে জমা দেওয়া হয়েছে'),
  underReview('under_review', 'যাচাইাধীন', 'অনুমোদিত কর্মকর্তা আবেদনটি পর্যালোচনা করছেন'),
  correctionRequired('correction_required', 'সংশোধন প্রয়োজন', 'আবেদনে অতিরিক্ত তথ্য বা সংশোধনের অনুরোধ জানানো হয়েছে'),
  resubmitted('resubmitted', 'পুনরায় জমা', 'সংশোধনের পর আবেদনটি পুনরায় যাচাইয়ের জন্য জমা দেওয়া হয়েছে'),
  approved('approved', 'অনুমোদিত', 'আবেদনটি অনুমোদিত হয়েছে এবং সদস্য কোড বরাদ্দ করা হয়েছে'),
  rejected('rejected', 'প্রত্যাখ্যাত', 'আবেদনটি সুনির্দিষ্ট কারণে প্রত্যাখ্যাত হয়েছে'),
  withdrawn('withdrawn', 'প্রত্যাহৃত', 'আবেদনকারী কর্তৃক আবেদনটি প্রত্যাহার করা হয়েছে');

  final String key;
  final String banglaLabel;
  final String description;

  const MembershipApplicationStatus(this.key, this.banglaLabel, this.description);

  static MembershipApplicationStatus fromKey(String? key) {
    if (key == null) return MembershipApplicationStatus.draft;
    return MembershipApplicationStatus.values.firstWhere(
      (s) => s.key == key,
      orElse: () => MembershipApplicationStatus.draft,
    );
  }

  /// স্টেট ট্রানজিশন বৈধতা যাচাই
  bool canTransitionTo(MembershipApplicationStatus target) {
    switch (this) {
      case MembershipApplicationStatus.draft:
        return target == MembershipApplicationStatus.submitted ||
               target == MembershipApplicationStatus.withdrawn;

      case MembershipApplicationStatus.submitted:
        return target == MembershipApplicationStatus.underReview ||
               target == MembershipApplicationStatus.withdrawn;

      case MembershipApplicationStatus.underReview:
        return target == MembershipApplicationStatus.correctionRequired ||
               target == MembershipApplicationStatus.approved ||
               target == MembershipApplicationStatus.rejected;

      case MembershipApplicationStatus.correctionRequired:
        return target == MembershipApplicationStatus.resubmitted ||
               target == MembershipApplicationStatus.withdrawn;

      case MembershipApplicationStatus.resubmitted:
        return target == MembershipApplicationStatus.underReview;

      case MembershipApplicationStatus.approved:
      case MembershipApplicationStatus.rejected:
      case MembershipApplicationStatus.withdrawn:
        // টার্মিনাল স্টেট: কোনো ট্রানজিশন সম্ভব নয়
        return false;
    }
  }

  /// সক্রিয় আবেদন কি না (যা ডুপ্লিকেট চেকিংয়ে বিবেচিত হয়)
  bool get isActive {
    return this == MembershipApplicationStatus.draft ||
           this == MembershipApplicationStatus.submitted ||
           this == MembershipApplicationStatus.underReview ||
           this == MembershipApplicationStatus.correctionRequired ||
           this == MembershipApplicationStatus.resubmitted;
  }
}
