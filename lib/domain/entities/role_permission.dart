/// RolePermission: রোল এবং পারমিশনের ম্যাপিং এন্টিটি
///
/// প্রতিষ্ঠান-নির্দিষ্ট (organizationId) বাউন্ডারির মধ্যে কোন রোলে
/// কোন পারমিশন প্রদান করা হয়েছে তা নির্ধারণ ও অডিট ট্রেইল সংরক্ষণ করে।
class RolePermission {
  final String roleId;
  final String permissionId;
  final String permissionKey;
  final String organizationId;
  final DateTime grantedAt;
  final String? grantedBy;

  const RolePermission({
    required this.roleId,
    required this.permissionId,
    required this.permissionKey,
    required this.organizationId,
    required this.grantedAt,
    this.grantedBy,
  });

  Map<String, dynamic> toJson() {
    return {
      'role_id': roleId,
      'permission_id': permissionId,
      'permission_key': permissionKey,
      'organization_id': organizationId,
      'granted_at': grantedAt.toIso8601String(),
      'granted_by': grantedBy,
    };
  }

  factory RolePermission.fromJson(Map<String, dynamic> json) {
    return RolePermission(
      roleId: json['role_id'] as String? ?? '',
      permissionId: json['permission_id'] as String? ?? '',
      permissionKey: json['permission_key'] as String? ?? '',
      organizationId: json['organization_id'] as String? ?? '',
      grantedAt: json['granted_at'] != null
          ? DateTime.tryParse(json['granted_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      grantedBy: json['granted_by'] as String?,
    );
  }
}
