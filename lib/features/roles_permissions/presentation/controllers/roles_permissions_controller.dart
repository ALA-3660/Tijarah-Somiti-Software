import 'package:flutter/foundation.dart';
import '../../../../core/authorization/authorization_service.dart';
import '../../../../core/authorization/permission_catalog.dart';
import '../../../../core/authorization/role_permission_audit.dart';
import '../../../../core/context/organization_context.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/state/ui_state.dart';
import '../../../../domain/entities/permission.dart';
import '../../../../domain/entities/role.dart';
import '../domain/repositories/role_permission_repository.dart';

/// RolesPermissionsController: ভূমিকা ও পারমিশন স্ক্রিনের কন্ট্রোলার
class RolesPermissionsController extends ChangeNotifier {
  final RolePermissionRepository repository;

  RolesPermissionsController({required this.repository});

  UiState<List<Role>> _state = const UiInitial();
  UiState<List<Role>> get state => _state;

  List<Role> _roles = [];
  List<Role> get roles => List.unmodifiable(_roles);

  List<Permission> _allPermissions = [];
  List<Permission> get allPermissions => List.unmodifiable(_allPermissions);

  Role? _selectedRole;
  Role? get selectedRole => _selectedRole;

  String _selectedCategory = 'সকল';
  String get selectedCategory => _selectedCategory;

  List<RolePermissionAuditRecord> _auditRecords = [];
  List<RolePermissionAuditRecord> get auditRecords => List.unmodifiable(_auditRecords);

  bool _isSaving = false;
  bool get isSaving => _isSaving;

  /// প্রারম্ভিক ডেটা লোড
  Future<void> loadRolesAndPermissions() async {
    final orgId = OrganizationContext.instance.currentOrganizationId ?? 'demo_org_khurushkul';
    _state = const UiLoading(message: 'ভূমিকা ও পারমিশন ক্যাটালগ লোড হচ্ছে...');
    notifyListeners();

    try {
      final fetchedRoles = await repository.getRoles(organizationId: orgId);
      final fetchedPerms = await repository.getAllPermissions();
      final fetchedAudits = await repository.getAuditRecords(organizationId: orgId);

      _roles = fetchedRoles;
      _allPermissions = fetchedPerms;
      _auditRecords = fetchedAudits;

      if (_roles.isNotEmpty && _selectedRole == null) {
        _selectedRole = _roles.first;
      } else if (_selectedRole != null) {
        _selectedRole = _roles.firstWhere(
          (r) => r.id == _selectedRole!.id,
          orElse: () => _roles.first,
        );
      }

      _state = UiSuccess(_roles);
    } catch (e) {
      _state = UiError(
        userMessage: 'ভূমিকা ও পারমিশন তথ্য লোড করা সম্ভব হয়নি।',
        failure: GeneralFailure(message: e.toString()),
        onRetry: loadRolesAndPermissions,
      );
    }

    notifyListeners();
  }

  /// ভূমিকা নির্বাচন
  void selectRole(Role role) {
    _selectedRole = role;
    notifyListeners();
  }

  /// ক্যাটাগরি ফিল্টার পরিবর্তন
  void setCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  /// ফিল্টারকৃত পারমিশন তালিকা
  List<Permission> get filteredPermissions {
    if (_selectedCategory == 'সকল') {
      return _allPermissions;
    }
    return _allPermissions.where((p) => p.categoryBangla == _selectedCategory).toList();
  }

  /// নির্বাচিত রোলে পারমিশন টগল করা (সিস্টেম ভূমিকা সুরক্ষিত)
  Future<bool> togglePermissionForSelectedRole(String permissionKey, String actorUserId) async {
    if (_selectedRole == null) return false;
    final orgId = OrganizationContext.instance.currentOrganizationId ?? 'demo_org_khurushkul';

    final currentPerms = List<String>.from(_selectedRole!.permissionKeys);
    if (currentPerms.contains(permissionKey)) {
      currentPerms.remove(permissionKey);
    } else {
      currentPerms.add(permissionKey);
    }

    _isSaving = true;
    notifyListeners();

    try {
      final updatedRole = await repository.updateRolePermissions(
        organizationId: orgId,
        roleId: _selectedRole!.id,
        permissionKeys: currentPerms,
        actorUserId: actorUserId,
      );

      final index = _roles.indexWhere((r) => r.id == updatedRole.id);
      if (index != -1) {
        _roles[index] = updatedRole;
      }
      _selectedRole = updatedRole;

      // অডিট রেকর্ড রিফ্রেশ
      _auditRecords = await repository.getAuditRecords(organizationId: orgId);

      // অথরাইজেশন সার্ভিস ক্যাশ আপডেট
      await AuthorizationService.instance.refreshAuthorization(
        updatedRoles: _roles,
      );

      _isSaving = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isSaving = false;
      notifyListeners();
      return false;
    }
  }

  /// স্বীয় লেনদেন অনুমোদন পলিসি সিমুলেশন টেস্ট
  SelfApprovalPolicyResult testSelfApproval({
    required String creatorId,
    required String approverId,
  }) {
    return AuthorizationService.instance.checkSelfApprovalPolicy(
      creatorUserId: creatorId,
      approverUserId: approverId,
    );
  }
}
