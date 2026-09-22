import '../entities/member.dart';
import '../entities/member_audit_record.dart';
import '../entities/member_status.dart';

/// MemberRepository: সদস্য ব্যবস্থাপনা ডোমেইন রিপোজিটরি ইন্টারফেস
abstract class MemberRepository {
  /// নির্দিষ্ট অর্গানাইজেশনের সদস্য তালিকা আনা (ফিল্টারিং ও সার্চসহ)
  Future<List<Member>> getMembers({
    required String organizationId,
    MemberStatus? status,
    String? searchQuery,
    int page = 1,
    int limit = 50,
  });

  /// নির্দিষ্ট আইডি অনুযায়ী সদস্যের তথ্য আনা
  Future<Member?> getMemberById({
    required String organizationId,
    required String memberId,
  });

  /// সদস্য কোড (MEM-XXXXXX) অনুযায়ী সদস্যের তথ্য আনা
  Future<Member?> getMemberByCode({
    required String organizationId,
    required String memberCode,
  });

  /// নতুন সদস্য নিবন্ধন করা
  Future<Member> createMember({
    required String organizationId,
    required String fullName,
    required String mobile,
    String? email,
    DateTime? dateOfBirth,
    String? gender,
    String? occupation,
    String? fatherOrSpouseName,
    String? motherName,
    String? nid,
    String? currentAddress,
    String? permanentAddress,
    bool isSameAddress = false,
    String? address,
    DateTime? joinedAt,
    String? photoUrl,
    String? notes,
    required String actorUserId,
    required String actorName,
  });

  /// সদস্যের তথ্য হালনাগাদ করা
  Future<Member> updateMember({
    required String organizationId,
    required String memberId,
    required String fullName,
    required String mobile,
    String? email,
    DateTime? dateOfBirth,
    String? gender,
    String? occupation,
    String? fatherOrSpouseName,
    String? motherName,
    String? nid,
    String? currentAddress,
    String? permanentAddress,
    bool isSameAddress = false,
    String? address,
    String? photoUrl,
    String? notes,
    required String actorUserId,
    required String actorName,
  });

  /// সদস্যের স্ট্যাটাস পরিবর্তন করা (লাইফসাইকেল ট্রানজিশন ও অডিট)
  Future<Member> changeMemberStatus({
    required String organizationId,
    required String memberId,
    required MemberStatus newStatus,
    required String reason,
    required String actorUserId,
    required String actorName,
  });

  /// সদস্যের স্ট্যাটাস পরিবর্তনের অডিট ট্রেইল সংগ্রহ করা
  Future<List<MemberStatusAuditRecord>> getMemberStatusAudits({
    required String organizationId,
    required String memberId,
  });

  /// অর্গানাইজেশনের মোট সদস্য সংখ্যা
  Future<int> getTotalMembersCount({
    required String organizationId,
  });

  /// স্ট্যাটাসভিত্তিক সদস্য পরিসংখ্যান
  Future<Map<MemberStatus, int>> getMemberCountByStatus({
    required String organizationId,
  });
}
