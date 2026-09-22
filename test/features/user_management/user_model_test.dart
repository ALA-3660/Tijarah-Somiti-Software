import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/domain/entities/managed_user.dart';
import '../../../../lib/domain/entities/role.dart';
import '../../../../lib/domain/entities/user_status.dart';
import '../../../../lib/features/user_management/domain/entities/user_audits.dart';

void main() {
  group('Prompt 2.4 — User Model & Lifecycle Unit Tests', () {
    final testRole1 = Role(
      id: 'role_01',
      organizationId: 'org_001',
      key: 'secretary',
      name: 'সম্পাদক',
      description: 'সম্পাদক ভূমিকা',
      isSystemRole: true,
      isActive: true,
      permissionKeys: const ['security.user.view', 'member.profile.view'],
      createdAt: DateTime(2025, 1, 1),
      updatedAt: DateTime(2025, 1, 1),
    );

    final testRole2 = Role(
      id: 'role_02',
      organizationId: 'org_001',
      key: 'accountant',
      name: 'হিসাবরক্ষক',
      description: 'হিসাবরক্ষক ভূমিকা',
      isSystemRole: true,
      isActive: true,
      permissionKeys: const ['finance.transaction.create', 'finance.account.view'],
      createdAt: DateTime(2025, 1, 1),
      updatedAt: DateTime(2025, 1, 1),
    );

    test('1. ManagedUser serialization and deserialization preserves all required fields', () {
      final user = ManagedUser(
        id: 'usr_101',
        organizationId: 'org_001',
        userCode: 'USR-000001',
        fullName: 'মাওলানা আব্দুল্লাহ',
        mobile: '01711000001',
        email: 'abdullah@tijarah.org',
        status: UserStatus.active,
        roles: [testRole1, testRole2],
        createdAt: DateTime(2025, 1, 1, 10, 0),
        updatedAt: DateTime(2025, 1, 2, 12, 0),
        createdBy: 'admin_01',
        updatedBy: 'admin_02',
      );

      final json = user.toJson();
      expect(json['id'], 'usr_101');
      expect(json['organization_id'], 'org_001');
      expect(json['user_code'], 'USR-000001');
      expect(json['full_name'], 'মাওলানা আব্দুল্লাহ');
      expect(json['mobile'], '01711000001');
      expect(json['email'], 'abdullah@tijarah.org');
      expect(json['status'], 'active');
      expect(json['created_by'], 'admin_01');
      expect(json['updated_by'], 'admin_02');

      final deserialized = ManagedUser.fromJson(json);
      expect(deserialized.id, user.id);
      expect(deserialized.userCode, user.userCode);
      expect(deserialized.organizationId, user.organizationId);
      expect(deserialized.fullName, user.fullName);
      expect(deserialized.mobile, user.mobile);
      expect(deserialized.email, user.email);
      expect(deserialized.status, UserStatus.active);
      expect(deserialized.roles.length, 2);
    });

    test('2. Multiple roles produce union of effective permissions', () {
      final user = ManagedUser(
        id: 'usr_102',
        organizationId: 'org_001',
        userCode: 'USR-000002',
        fullName: 'মাস্টার শামসুল হুদা',
        mobile: '01711000002',
        email: 'shamsul@tijarah.org',
        status: UserStatus.active,
        roles: [testRole1, testRole2],
        createdAt: DateTime(2025, 1, 1),
        updatedAt: DateTime(2025, 1, 1),
        createdBy: 'admin_01',
        updatedBy: 'admin_01',
      );

      final effective = user.effectivePermissions;
      expect(effective.contains('security.user.view'), isTrue);
      expect(effective.contains('member.profile.view'), isTrue);
      expect(effective.contains('finance.transaction.create'), isTrue);
      expect(effective.contains('finance.account.view'), isTrue);
      expect(effective.contains('finance.transaction.approve'), isFalse);
    });

    test('3. UserStatus lifecycle Bengali labels and operational states', () {
      expect(UserStatus.active.banglaName, 'সক্রিয়');
      expect(UserStatus.inactive.banglaName, 'নিষ্ক্রিয়');
      expect(UserStatus.suspended.banglaName, 'স্থগিত');
      expect(UserStatus.archived.banglaName, 'আর্কাইভ');

      expect(UserStatus.active.isOperational, isTrue);
      expect(UserStatus.inactive.isOperational, isFalse);
      expect(UserStatus.suspended.isOperational, isFalse);
      expect(UserStatus.archived.isOperational, isFalse);
    });

    test('4. UserRoleAuditRecord serialization and deserialization', () {
      final record = UserRoleAuditRecord(
        id: 'audit_01',
        organizationId: 'org_001',
        actorUserId: 'admin_01',
        actorName: 'মাওলানা আব্দুল্লাহ',
        targetUserId: 'usr_102',
        targetUserName: 'মাস্টার শামসুল হুদা',
        roleId: 'role_01',
        roleKey: 'secretary',
        roleName: 'সম্পাদক',
        action: UserRoleAuditAction.roleAssigned,
        reason: 'কার্যনির্বাহী কমিটির সিদ্ধান্ত',
        timestamp: DateTime(2025, 2, 1, 10, 0),
      );

      final json = record.toJson();
      expect(json['id'], 'audit_01');
      expect(json['actor_user_id'], 'admin_01');
      expect(json['action'], 'ROLE_ASSIGNED');
      expect(json['role_key'], 'secretary');

      final fromJson = UserRoleAuditRecord.fromJson(json);
      expect(fromJson.id, 'audit_01');
      expect(fromJson.actorName, 'মাওলানা আব্দুল্লাহ');
      expect(fromJson.targetUserName, 'মাস্টার শামসুল হুদা');
      expect(fromJson.action, UserRoleAuditAction.roleAssigned);
    });

    test('5. UserStatusAuditRecord tracks status transitions', () {
      final record = UserStatusAuditRecord(
        id: 'status_audit_01',
        organizationId: 'org_001',
        actorUserId: 'admin_01',
        actorName: 'মাওলানা আব্দুল্লাহ',
        targetUserId: 'usr_102',
        targetUserName: 'মাস্টার শামসুল হুদা',
        previousStatus: UserStatus.active,
        newStatus: UserStatus.suspended,
        reason: 'প্রশাসনিক তদন্তের স্বার্থে সাময়িক স্থগিত',
        timestamp: DateTime(2025, 2, 2, 14, 0),
      );

      final json = record.toJson();
      expect(json['previous_status'], 'active');
      expect(json['new_status'], 'suspended');
      expect(json['reason'], contains('সাময়িক স্থগিত'));

      final fromJson = UserStatusAuditRecord.fromJson(json);
      expect(fromJson.previousStatus, UserStatus.active);
      expect(fromJson.newStatus, UserStatus.suspended);
    });
  });
}
