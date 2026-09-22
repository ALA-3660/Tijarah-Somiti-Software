import '../../domain/entities/user.dart';

/// UserModel: ডোমেইন User এন্টিটির DTO মডেল
class UserModel extends User {
  const UserModel({
    required super.id,
    required super.fullName,
    required super.email,
    super.phone,
    super.avatarUrl,
    required super.isActive,
    required super.memberships,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    final membershipsList = (json['memberships'] as List<dynamic>?)
            ?.map((m) => UserOrganizationMembershipModel.fromJson(m as Map<String, dynamic>))
            .toList() ??
        [];

    return UserModel(
      id: json['id']?.toString() ?? '',
      fullName: json['full_name']?.toString() ?? json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString(),
      avatarUrl: json['avatar_url']?.toString(),
      isActive: json['is_active'] as bool? ?? true,
      memberships: membershipsList,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'full_name': fullName,
      'email': email,
      'phone': phone,
      'avatar_url': avatarUrl,
      'is_active': isActive,
    };
  }
}

class UserOrganizationMembershipModel extends UserOrganizationMembership {
  const UserOrganizationMembershipModel({
    required super.organizationId,
    required super.organizationName,
    required super.role,
    super.isDefault,
  });

  factory UserOrganizationMembershipModel.fromJson(Map<String, dynamic> json) {
    return UserOrganizationMembershipModel(
      organizationId: json['organization_id']?.toString() ?? json['organization']?.toString() ?? '',
      organizationName: json['organization_name']?.toString() ?? '',
      role: _parseRole(json['role']?.toString()),
      isDefault: json['is_default'] as bool? ?? false,
    );
  }

  static UserRole _parseRole(String? role) {
    switch (role?.toLowerCase()) {
      case 'super_admin':
      case 'superadmin':
        return UserRole.superAdmin;
      case 'org_admin':
      case 'admin':
        return UserRole.orgAdmin;
      case 'manager':
        return UserRole.manager;
      case 'accountant':
        return UserRole.accountant;
      case 'collector':
        return UserRole.collector;
      case 'auditor':
        return UserRole.auditor;
      default:
        return UserRole.generalMember;
    }
  }
}
