import '../../../../domain/entities/permission.dart';
import '../../../../domain/entities/role.dart';
import '../../../../domain/entities/role_permission.dart';
import '../../../../core/authorization/role_permission_audit.dart';

/// RolePermissionRepository: ভূমিকা ও পারমিশন রিপোজিটরি ইন্টারফেস
abstract class RolePermissionRepository {
  /// নির্দিষ্ট অর্গানাইজেশনের সকল ভূমিকা (System + Custom)
  Future<List<Role>> getRoles({required String organizationId});

  /// নির্দিষ্ট ভূমিকার তথ্য
  Future<Role?> getRoleById({required String organizationId, required String roleId});

  /// সিস্টেমের সকল পারমিশন তালিকা
  Future<List<Permission>> getAllPermissions();

  /// নির্দিষ্ট ভূমিকার বর্তমান পারমিশন অ্যাসাইনমেন্ট
  Future<List<String>> getRolePermissions({
    required String organizationId,
    required String roleId,
  });

  /// নির্দিষ্ট রোলের পারমিশন তালিকা আপডেট (সিস্টেম ভূমিকা সুরক্ষিত)
  Future<Role> updateRolePermissions({
    required String organizationId,
    required String roleId,
    required List<String> permissionKeys,
    required String actorUserId,
    String? reason,
  });

  /// নতুন কাস্টম ভূমিকা তৈরি
  Future<Role> createCustomRole({
    required String organizationId,
    required String key,
    required String name,
    required String description,
    required List<String> permissionKeys,
    required String actorUserId,
  });

  /// ভূমিকা ও পারমিশন পরিবর্তনের অডিট রেকর্ড তালিকা
  Future<List<RolePermissionAuditRecord>> getAuditRecords({
    required String organizationId,
    String? targetRoleId,
  });
}
