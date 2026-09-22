import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/core/authorization/action_catalog.dart';
import '../../../../lib/core/authorization/permission_catalog.dart';
import '../../../../lib/core/authorization/permission_keys.dart';
import '../../../../lib/core/authorization/resource_catalog.dart';
import '../../../../lib/domain/entities/permission.dart';
import '../../../../lib/domain/entities/role.dart';
import '../../../../lib/domain/entities/role_permission.dart';

void main() {
  group('Prompt 2.3 — Role & Permission Models and System Catalog Tests', () {
    test('1. SystemRoleKey correctly defines 7 standard system roles with Bengali names', () {
      expect(SystemRoleKey.all.length, equals(7));
      expect(SystemRoleKey.isSystemRole('super_admin'), isTrue);
      expect(SystemRoleKey.isSystemRole('secretary'), isTrue);
      expect(SystemRoleKey.isSystemRole('treasurer'), isTrue);
      expect(SystemRoleKey.isSystemRole('collector'), isTrue);
      expect(SystemRoleKey.isSystemRole('accountant'), isTrue);
      expect(SystemRoleKey.isSystemRole('auditor'), isTrue);
      expect(SystemRoleKey.isSystemRole('member'), isTrue);
      expect(SystemRoleKey.isSystemRole('custom_role'), isFalse);

      expect(SystemRoleKey.getBanglaName('super_admin'), equals('সুপার অ্যাডমিন'));
      expect(SystemRoleKey.getBanglaName('secretary'), equals('সম্পাদক'));
      expect(SystemRoleKey.getBanglaName('treasurer'), equals('কোষাধ্যক্ষ'));
      expect(SystemRoleKey.getBanglaName('collector'), equals('আদায়কারী'));
      expect(SystemRoleKey.getBanglaName('accountant'), equals('হিসাবরক্ষক'));
      expect(SystemRoleKey.getBanglaName('auditor'), equals('নিরীক্ষক'));
      expect(SystemRoleKey.getBanglaName('member'), equals('সদস্য'));
    });

    test('2. Permission model serialization and deserialization preserves all metadata', () {
      const perm = Permission(
        id: 'perm-001',
        key: PermissionKeys.financeTransactionCreate,
        name: 'নতুন আর্থিক লেনদেন তৈরি',
        description: 'আয়, ব্যয় বা স্থানান্তরের প্রাথমিক ভাউচার তৈরি করার অনুমতি',
        module: AppModule.finance,
        resource: AppResource.transaction,
        action: AppAction.create,
        categoryBangla: 'অর্থ ও হিসাব',
        isSystemPermission: true,
        isActive: true,
      );

      final json = perm.toJson();
      expect(json['key'], equals('finance.transaction.create'));
      expect(json['module'], equals('finance'));
      expect(json['resource'], equals('transaction'));
      expect(json['action'], equals('create'));

      final fromJson = Permission.fromJson(json);
      expect(fromJson.key, equals(perm.key));
      expect(fromJson.name, equals(perm.name));
      expect(fromJson.module, equals(AppModule.finance));
      expect(fromJson.resource, equals(AppResource.transaction));
      expect(fromJson.action, equals(AppAction.create));
    });

    test('3. Role model correctly tracks organizationId and permissionKeys', () {
      final role = Role(
        id: 'role-001',
        organizationId: 'org-test-01',
        key: 'accountant',
        name: 'হিসাবরক্ষক',
        description: 'ভাউচার প্রস্তুতকারী',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [
          PermissionKeys.financeTransactionView,
          PermissionKeys.financeTransactionCreate,
        ],
        createdAt: DateTime(2026, 1, 1),
        updatedAt: DateTime(2026, 1, 1),
      );

      expect(role.organizationId, equals('org-test-01'));
      expect(role.hasPermission(PermissionKeys.financeTransactionView), isTrue);
      expect(role.hasPermission(PermissionKeys.financeTransactionCreate), isTrue);
      expect(role.hasPermission(PermissionKeys.financeTransactionApprove), isFalse);
    });

    test('4. PermissionCatalog default roles generate valid organization-scoped system roles', () {
      const orgId = 'org-khurushkul-001';
      final roles = PermissionCatalog.createDefaultSystemRoles(organizationId: orgId);

      expect(roles.length, equals(7));
      for (final r in roles) {
        expect(r.organizationId, equals(orgId));
        expect(r.isSystemRole, isTrue);
        expect(r.isActive, isTrue);
        expect(r.permissionKeys, isNotEmpty);
      }
    });

    test('5. RolePermission mapping entity preserves roleId, permissionKey and organizationId', () {
      final rp = RolePermission(
        roleId: 'role-treasurer',
        permissionId: 'perm-approve',
        permissionKey: PermissionKeys.financeTransactionApprove,
        organizationId: 'org-khurushkul-001',
        grantedAt: DateTime.now(),
        grantedBy: 'admin-01',
      );

      final json = rp.toJson();
      expect(json['role_id'], equals('role-treasurer'));
      expect(json['permission_key'], equals('finance.transaction.approve'));
      expect(json['organization_id'], equals('org-khurushkul-001'));
    });
  });
}
