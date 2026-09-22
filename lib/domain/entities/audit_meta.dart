/// AuditStatus: অডিট অবস্থা
enum AuditStatus {
  draft,
  pendingApproval,
  approved,
  rejected,
  reversed,
  cancelled,
}

/// AuditMeta: আর্থিক ও ব্যবসায়িক লেনদেনের জন্য অডিট ট্রেইল মেটাডেটা
///
/// ইসলামি আর্থিক শরিয়াহ ও নীতি অনুযায়ী আর্থিক লেনদেন সরাসরি ডিলিট করা নিষিদ্ধ।
/// কোনো ভুল সংশোধনের ক্ষেত্রে রিভার্সাল/সংশোধনী এন্ট্রি এবং অনুমোদন প্রক্রিয়ার
/// জন্য এই মেটাডেটা আর্কিটেকচার প্রতিটি গুরুত্বপূর্ণ রেকর্ডের অংশ হবে।
class AuditMeta {
  final String createdById;
  final String? createdByName;
  final DateTime createdAt;
  final String? updatedById;
  final String? updatedByName;
  final DateTime? updatedAt;
  final String? approvedById;
  final String? approvedByName;
  final DateTime? approvedAt;
  final AuditStatus status;
  final String? rejectionReason;
  final String? reversalOfTransactionId;

  const AuditMeta({
    required this.createdById,
    this.createdByName,
    required this.createdAt,
    this.updatedById,
    this.updatedByName,
    this.updatedAt,
    this.approvedById,
    this.approvedByName,
    this.approvedAt,
    this.status = AuditStatus.draft,
    this.rejectionReason,
    this.reversalOfTransactionId,
  });

  bool get isApproved => status == AuditStatus.approved;
  bool get isReversed => status == AuditStatus.reversed;
}
