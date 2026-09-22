import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/core/authorization/authorization_service.dart';
import '../../../../lib/core/authorization/permission_catalog.dart';
import '../../../../lib/core/authorization/permission_keys.dart';
import '../../../../lib/core/context/organization_context.dart';
import '../../../../lib/domain/entities/role.dart';

void main() {
  group('Prompt 2.3 — AuthorizationService Unit Tests', () {
    late AuthorizationService authService;

    setUp(() {
      authService = AuthorizationService.instance;
      authService.clearCache();
    });

    tearDown(() {
      authService.clearCache();
    });

    test('1. Uninitialized service denies all permission checks (Default Closed)', () {
      expect(authService.isInitialized, isFalse);
      expect(authService.can(PermissionKeys.organizationView), isFalse);
      expect(authService.canAny([PermissionKeys.organizationView, PermissionKeys.memberView]), isFalse);
      expect(authService.canAll([PermissionKeys.organizationView]), isFalse);
    });

    test('2. can(), canAny(), canAll() correctly evaluate assigned permissions', () async {
      final role = Role(
        id: 'role-accountant',
        organizationId: 'org-test',
        key: 'accountant',
        name: 'হিসাবরক্ষক',
        description: 'হিসাবরক্ষক ভূমিকা',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [
          PermissionKeys.financeTransactionView,
          PermissionKeys.financeTransactionCreate,
          PermissionKeys.financeTransactionSubmit,
        ],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr-acc-01',
        organizationId: 'org-test',
        assignedRoles: [role],
      );

      expect(authService.isInitialized, isTrue);
      // can()
      expect(authService.can(PermissionKeys.financeTransactionCreate), isTrue);
      expect(authService.can(PermissionKeys.financeTransactionApprove), isFalse);

      // canAny()
      expect(
        authService.canAny([
          PermissionKeys.financeTransactionApprove,
          PermissionKeys.financeTransactionCreate,
        ]),
        isTrue,
      );
      expect(
        authService.canAny([
          PermissionKeys.financeTransactionApprove,
          PermissionKeys.financeTransactionReverse,
        ]),
        isFalse,
      );

      // canAll()
      expect(
        authService.canAll([
          PermissionKeys.financeTransactionView,
          PermissionKeys.financeTransactionCreate,
        ]),
        isTrue,
      );
      expect(
        authService.canAll([
          PermissionKeys.financeTransactionView,
          PermissionKeys.financeTransactionApprove,
        ]),
        isFalse,
      );
    });

    test('3. Organization isolation: roles from different organization are ignored', () async {
      final roleOrgA = Role(
        id: 'role-org-a',
        organizationId: 'org-A',
        key: 'treasurer',
        name: 'কোষাধ্যক্ষ',
        description: 'Org A কোষাধ্যক্ষ',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [PermissionKeys.financeTransactionApprove],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      // ব্যবহারকারী Org B-তে অথেনটিকেটেড কিন্তু রোল Org A-এর
      await authService.initialize(
        userId: 'usr-cross-org',
        organizationId: 'org-B',
        assignedRoles: [roleOrgA],
      );

      // Org B বাউন্ডারির কারণে পারমিশন গ্রান্ট হবে না
      expect(authService.can(PermissionKeys.financeTransactionApprove), isFalse);
      expect(authService.roles.isEmpty, isTrue);
    });

    test('4. clearCache() invalidates all cached permissions and roles on logout', () async {
      final role = Role(
        id: 'role-super',
        organizationId: 'org-test',
        key: 'super_admin',
        name: 'সুপার অ্যাডমিন',
        description: 'অ্যাডমিন',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [PermissionKeys.roleManage],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'admin-01',
        organizationId: 'org-test',
        assignedRoles: [role],
      );

      expect(authService.can(PermissionKeys.roleManage), isTrue);

      authService.clearCache();

      expect(authService.isInitialized, isFalse);
      expect(authService.permissions.isEmpty, isTrue);
      expect(authService.roles.isEmpty, isTrue);
      expect(authService.can(PermissionKeys.roleManage), isFalse);
    });

    test('5. Super Admin evaluation is strictly permission-based, never hardcoded role string', () async {
      final superAdminRole = Role(
        id: 'role-super',
        organizationId: 'org-test',
        key: 'super_admin',
        name: 'সুপার অ্যাডমিন',
        description: 'সুপার অ্যাডমিন',
        isSystemRole: true,
        isActive: true,
        permissionKeys: PermissionCatalog.getDefaultRolePermissions('super_admin'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'super-01',
        organizationId: 'org-test',
        assignedRoles: [superAdminRole],
      );

      // Security decision uses permission key, not "if role == super_admin"
      expect(authService.can(PermissionKeys.organizationStatusChange), isTrue);
      expect(authService.can(PermissionKeys.userManage), isTrue);
      expect(authService.can(PermissionKeys.roleManage), isTrue);
    });
  });
}
