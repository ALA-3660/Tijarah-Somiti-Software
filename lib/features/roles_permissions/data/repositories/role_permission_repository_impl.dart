import '../../../../core/authorization/permission_catalog.dart';
import '../../../../core/authorization/role_permission_audit.dart';
import '../../../../core/errors/failure.dart';
import '../../../../domain/entities/permission.dart';
import '../../../../domain/entities/role.dart';
import '../domain/repositories/role_permission_repository.dart';

/// RolePermissionRepositoryImpl: ভূমিকা ও পারমিশন রিপোজিটরি বাস্তবায়ন
class RolePermissionRepositoryImpl implements RolePermissionRepository {
  // মেমোরি ক্যাশ ও স্টোরেজ স্টেট (প্রতিষ্ঠানভিত্তিক আইসোলেটেড)
  final Map<String, List<Role>> _orgRolesMap = {};
  final List<RolePermissionAuditRecord> _auditRecords = [];

  RolePermissionRepositoryImpl();

  @override
  Future<List<Role>> getRoles({required String organizationId}) async {
    // অর্গানাইজেশনের জন্য প্রাথমিক রোল সেটআপ না থাকলে সিস্টেম ডিফল্ট তৈরি করা
    if (!_orgRolesMap.containsKey(organizationId)) {
      _orgRolesMap[organizationId] =
          PermissionCatalog.createDefaultSystemRoles(organizationId: organizationId);
    }
    return List.unmodifiable(_orgRolesMap[organizationId]!);
  }

  @override
  Future<Role?> getRoleById({
    required String organizationId,
    required String roleId,
  }) async {
    final roles = await getRoles(organizationId: organizationId);
    try {
      return roles.firstWhere((r) => r.id == roleId || r.key == roleId);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<List<Permission>> getAllPermissions() async {
    return List.unmodifiable(PermissionCatalog.allPermissions);
  }

  @override
  Future<List<String>> getRolePermissions({
    required String organizationId,
    required String roleId,
  }) async {
    final role = await getRoleById(organizationId: organizationId, roleId: roleId);
    return role?.permissionKeys ?? const [];
  }

  @override
  Future<Role> updateRolePermissions({
    required String organizationId,
    required String roleId,
    required List<String> permissionKeys,
    required String actorUserId,
    String? reason,
  }) async {
    final roles = await getRoles(organizationId: organizationId);
    final index = roles.indexWhere((r) => r.id == roleId || r.key == roleId);

    if (index == -1) {
      throw const GeneralFailure(message: 'কাঙ্ক্ষিত ভূমিকা পাওয়া যায়নি।');
    }

    final oldRole = roles[index];
    final updatedRole = oldRole.copyWith(
      permissionKeys: List.unmodifiable(permissionKeys),
      updatedAt: DateTime.now(),
      updatedBy: actorUserId,
    );

    // আপডেট সংরক্ষণ
    _orgRolesMap[organizationId]![index] = updatedRole;

    // অডিট রেকর্ড সংরক্ষণ
    final audit = RolePermissionAuditRecord(
      id: 'audit_${DateTime.now().millisecondsSinceEpoch}',
      organizationId: organizationId,
      actorUserId: actorUserId,
      actorName: 'অ্যাডমিন ইউজার',
      targetRoleId: updatedRole.id,
      targetRoleName: updatedRole.name,
      action: 'role_permissions_updated',
      timestamp: DateTime.now(),
      previousState: {'permission_count': oldRole.permissionKeys.length},
      newState: {'permission_count': updatedRole.permissionKeys.length},
      reason: reason ?? 'প্রশাসনিক প্রয়োজনে পারমিশন ম্যাট্রিক্স সংশোধন',
    );
    _auditRecords.add(audit);

    return updatedRole;
  }

  @override
  Future<Role> createCustomRole({
    required String organizationId,
    required String key,
    required String name,
    required String description,
    required List<String> permissionKeys,
    required String actorUserId,
  }) async {
    if (SystemRoleKey.isSystemRole(key)) {
      throw const GeneralFailure(
        message: 'সিস্টেম রোলের কী দিয়ে কোনো কাস্টম ভূমিকা তৈরি করা যাবে না।',
      );
    }

    final roles = await getRoles(organizationId: organizationId);
    if (roles.any((r) => r.key == key)) {
      throw const GeneralFailure(message: 'এই কী সম্বলিত একটি ভূমিকা ইতোমধ্যে বিদ্যমান।');
    }

    final now = DateTime.now();
    final newRole = Role(
      id: 'custom_role_${key}_$organizationId',
      organizationId: organizationId,
      key: key,
      name: name,
      description: description,
      isSystemRole: false,
      isActive: true,
      permissionKeys: permissionKeys,
      createdAt: now,
      updatedAt: now,
      createdBy: actorUserId,
    );

    _orgRolesMap[organizationId]!.add(newRole);

    // অডিট রেকর্ড
    _auditRecords.add(
      RolePermissionAuditRecord(
        id: 'audit_${now.millisecondsSinceEpoch}',
        organizationId: organizationId,
        actorUserId: actorUserId,
        actorName: 'অ্যাডমিন ইউজার',
        targetRoleId: newRole.id,
        targetRoleName: newRole.name,
        action: 'custom_role_created',
        timestamp: now,
        newState: newRole.toJson(),
      ),
    );

    return newRole;
  }

  @override
  Future<List<RolePermissionAuditRecord>> getAuditRecords({
    required String organizationId,
    String? targetRoleId,
  }) async {
    final filtered = _auditRecords.where((a) => a.organizationId == organizationId);
    if (targetRoleId != null) {
      return filtered.where((a) => a.targetRoleId == targetRoleId).toList();
    }
    return filtered.toList();
  }
}
