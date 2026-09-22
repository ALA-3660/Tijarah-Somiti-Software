import '../../../../domain/entities/managed_user.dart';
import '../../../../domain/entities/user_status.dart';
import '../entities/user_audits.dart';

/// UserRepository: ব্যবহারকারী ব্যবস্থাপনা রিপোজিটরি ইন্টারফেস
///
/// **আর্কিটেকচারাল রুলস:**
/// ১. সকল অপারেশন `organizationId`-এর অধীনে কঠোরভাবে আইসোলেটেড।
/// ২. সরাসরি পারমিশন অ্যাসাইনমেন্ট নিষিদ্ধ; রোল ভিত্তিক অ্যাসাইনমেন্ট প্রযোজ্য।
/// ৩. সেলফ-প্রিভিলেজ এস্কেলেশন প্রতিরোধ করতে হবে।
/// ৪. পার্মানেন্ট ডিলিট নিষিদ্ধ; লাইফসাইকেল ট্রানজিশন প্রযোজ্য।
abstract class UserRepository {
  /// অর্গানাইজেশনের ব্যবহারকারী তালিকা অনুসন্ধান ও ফিল্টারসহ লোড করা
  Future<List<ManagedUser>> getUsers({
    required String organizationId,
    String? searchQuery,
    UserStatus? statusFilter,
    String? roleFilter,
  });

  /// নির্দিষ্ট ব্যবহারকারীর বিস্তারিত তথ্য সংগ্রহ
  Future<ManagedUser?> getUserById({
    required String organizationId,
    required String userId,
  });

  /// নতুন ব্যবহারকারী অ্যাকাউন্ট তৈরি
  Future<ManagedUser> createUser({
    required String organizationId,
    required String fullName,
    required String mobile,
    required String email,
    required List<String> initialRoleKeys,
    required String actorUserId,
    required String actorName,
  });

  /// বিদ্যমান ব্যবহারকারীর তথ্য হালনাগাদ
  Future<ManagedUser> updateUser({
    required String organizationId,
    required String userId,
    required String fullName,
    required String mobile,
    required String email,
    String? profilePhoto,
    required String actorUserId,
    required String actorName,
  });

  /// ব্যবহারকারীর লাইফসাইকেল স্ট্যাটাস পরিবর্তন (সক্রিয়/স্থগিত/আর্কাইভ)
  Future<ManagedUser> changeUserStatus({
    required String organizationId,
    required String userId,
    required UserStatus newStatus,
    required String actorUserId,
    required String actorName,
    String? reason,
  });

  /// ব্যবহারকারীকে ভূমিকা (Role) অর্পণ করা
  Future<ManagedUser> assignRoleToUser({
    required String organizationId,
    required String userId,
    required String roleKey,
    required String actorUserId,
    required String actorName,
    String? reason,
  });

  /// ব্যবহারকারীর ভূমিকা (Role) প্রত্যাহার করা
  Future<ManagedUser> removeRoleFromUser({
    required String organizationId,
    required String userId,
    required String roleKey,
    required String actorUserId,
    required String actorName,
    String? reason,
  });

  /// ভূমিকা অর্পণ ও প্রত্যাহারের অডিট রেকর্ড সংগ্রহ
  Future<List<UserRoleAuditRecord>> getRoleAuditRecords({
    required String organizationId,
    String? targetUserId,
  });

  /// স্ট্যাটাস পরিবর্তনের অডিট রেকর্ড সংগ্রহ
  Future<List<UserStatusAuditRecord>> getStatusAuditRecords({
    required String organizationId,
    String? targetUserId,
  });
}
