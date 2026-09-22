/// UserRole: ব্যবহারকারীর ভূমিকা বা পারমিশন রোল
enum UserRole {
  superAdmin,
  orgAdmin,
  manager,
  accountant,
  collector,
  auditor,
  generalMember,
}

/// User: ব্যবহারকারীর ডোমেইন এন্টিটি
class User {
  final String id;
  final String fullName;
  final String email;
  final String? phone;
  final String? avatarUrl;
  final bool isActive;
  final List<UserOrganizationMembership> memberships;

  const User({
    required this.id,
    required this.fullName,
    required this.email,
    this.phone,
    this.avatarUrl,
    required this.isActive,
    required this.memberships,
  });
}

/// নির্দিষ্ট অর্গানাইজেশনে ব্যবহারকারীর সদস্যপদ ও রোল
class UserOrganizationMembership {
  final String organizationId;
  final String organizationName;
  final UserRole role;
  final bool isDefault;

  const UserOrganizationMembership({
    required this.organizationId,
    required this.organizationName,
    required this.role,
    this.isDefault = false,
  });
}
