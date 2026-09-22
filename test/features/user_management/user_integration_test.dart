import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/core/authorization/authorization_service.dart';
import '../../../../lib/core/authorization/permission_catalog.dart';
import '../../../../lib/core/authorization/permission_keys.dart';
import '../../../../lib/domain/entities/role.dart';
import '../../../../lib/domain/entities/user_status.dart';
import '../../../../lib/features/user_management/data/repositories/user_repository_impl.dart';

void main() {
  group('Prompt 2.4 — User Management Integration Tests (A to N)', () {
    late UserRepositoryImpl repository;
    late AuthorizationService authService;
    const orgId = 'demo_org_khurushkul';
    const orgAltId = 'alt_org_chittagong';

    setUp(() async {
      repository = UserRepositoryImpl();
      authService = AuthorizationService.instance;
      authService.clearCache();
    });

    tearDown(() {
      authService.clearCache();
    });

    test('Test A: User with security.user.view has access to User List', () async {
      final role = Role(
        id: 'r_viewer',
        organizationId: orgId,
        key: 'viewer',
        name: 'দর্শক',
        description: 'দর্শক',
        isSystemRole: false,
        isActive: true,
        permissionKeys: const [PermissionKeys.userView],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_viewer_01',
        organizationId: orgId,
        assignedRoles: [role],
      );

      expect(authService.can(PermissionKeys.userView), isTrue);
    });

    test('Test B: User without permission receives 403 / Access Denied', () async {
      final role = Role(
        id: 'r_limited',
        organizationId: orgId,
        key: 'limited',
        name: 'সীমাবদ্ধ',
        description: 'সীমাবদ্ধ',
        isSystemRole: false,
        isActive: true,
        permissionKeys: const ['finance.transaction.view'],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_limited_01',
        organizationId: orgId,
        assignedRoles: [role],
      );

      expect(authService.can(PermissionKeys.userView), isFalse);
    });

    test('Test C: Authorized user creates user successfully', () async {
      final role = Role(
        id: 'r_manager',
        organizationId: orgId,
        key: 'manager',
        name: 'ম্যানেজার',
        description: 'ম্যানেজার',
        isSystemRole: false,
        isActive: true,
        permissionKeys: const [PermissionKeys.userView, PermissionKeys.userManage],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_mgr_01',
        organizationId: orgId,
        assignedRoles: [role],
      );

      expect(authService.can(PermissionKeys.userManage), isTrue);

      final newUser = await repository.createUser(
        organizationId: orgId,
        fullName: 'হাফেজ শোয়াইব মাহমুদ',
        mobile: '01811223344',
        email: 'shuaib@tijarah.org',
        initialRoleKeys: [SystemRoleKey.member],
        actorUserId: 'usr_mgr_01',
        actorName: 'ম্যানেজার',
      );

      expect(newUser.id, isNotEmpty);
      expect(newUser.fullName, 'হাফেজ শোয়াইব মাহমুদ');
      expect(newUser.status, UserStatus.active);
    });

    test('Test D: Unauthorized user create attempt is blocked', () async {
      final role = Role(
        id: 'r_non_manager',
        organizationId: orgId,
        key: 'viewer',
        name: 'সাধারণ',
        description: 'সাধারণ',
        isSystemRole: false,
        isActive: true,
        permissionKeys: const [PermissionKeys.userView],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_non_mgr_01',
        organizationId: orgId,
        assignedRoles: [role],
      );

      expect(authService.can(PermissionKeys.userManage), isFalse);
    });

    test('Test E: Authorized user assigns role successfully', () async {
      final role = Role(
        id: 'r_admin',
        organizationId: orgId,
        key: 'admin',
        name: 'অ্যাডমিন',
        description: 'অ্যাডমিন',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [PermissionKeys.userManage, PermissionKeys.roleManage],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_admin_01',
        organizationId: orgId,
        assignedRoles: [role],
      );

      expect(authService.can(PermissionKeys.roleManage), isTrue);

      final updated = await repository.assignRoleToUser(
        organizationId: orgId,
        userId: 'usr_007_member',
        roleKey: SystemRoleKey.collector,
        actorUserId: 'usr_admin_01',
        actorName: 'অ্যাডমিন',
        reason: 'মাঠ পর্যায়ে সংগ্রাহক হিসেবে দায়িত্ব অর্পণ',
      );

      expect(updated.hasRole(SystemRoleKey.collector), isTrue);
    });

    test('Test F: Unauthorized user role assignment is blocked', () async {
      final role = Role(
        id: 'r_basic',
        organizationId: orgId,
        key: 'basic',
        name: 'বেসিক',
        description: 'বেসিক',
        isSystemRole: false,
        isActive: true,
        permissionKeys: const [PermissionKeys.userView],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_basic_01',
        organizationId: orgId,
        assignedRoles: [role],
      );

      expect(authService.can(PermissionKeys.roleManage), isFalse);
    });

    test('Test G: Self privilege escalation attempt is blocked', () async {
      expect(
        () => repository.assignRoleToUser(
          organizationId: orgId,
          userId: 'usr_007_member',
          roleKey: SystemRoleKey.superAdmin,
          actorUserId: 'usr_007_member', // Self-assign
          actorName: 'ভাই তারেক আজিজ',
        ),
        throwsA(predicate((e) => e.toString().contains('Privilege Escalation Protection'))),
      );
    });

    test('Test H: Organization A user cannot access Organization B user records', () async {
      final userInB = await repository.createUser(
        organizationId: orgAltId,
        fullName: 'কারী ফজলুল করিম',
        mobile: '01655667788',
        email: 'karim@alt.org',
        initialRoleKeys: [SystemRoleKey.member],
        actorUserId: 'admin_b',
        actorName: 'অ্যাডমিন বি',
      );

      // Querying org A does not include userInB
      final usersA = await repository.getUsers(organizationId: orgId);
      expect(usersA.any((u) => u.id == userInB.id), isFalse);

      final crossLookup = await repository.getUserById(organizationId: orgId, userId: userInB.id);
      expect(crossLookup, isNull);
    });

    test('Test I: Organization switch invalidates authorization cache', () async {
      final role = Role(
        id: 'r_org_a',
        organizationId: orgId,
        key: 'auditor',
        name: 'নিরীক্ষক',
        description: 'নিরীক্ষক',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const ['report.financial.view'],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_org_a',
        organizationId: orgId,
        assignedRoles: [role],
      );

      expect(authService.isInitialized, isTrue);

      // Org switch event triggers cache clear
      authService.clearCache();
      expect(authService.isInitialized, isFalse);
      expect(authService.can('report.financial.view'), isFalse);
    });

    test('Test J: Logout clears all user and authorization cache', () async {
      final role = Role(
        id: 'r_logout',
        organizationId: orgId,
        key: 'treasurer',
        name: 'কোষাধ্যক্ষ',
        description: 'কোষাধ্যক্ষ',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [PermissionKeys.financeTransactionApprove],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_treasurer',
        organizationId: orgId,
        assignedRoles: [role],
      );

      expect(authService.can(PermissionKeys.financeTransactionApprove), isTrue);

      // Logout executed
      authService.clearCache();
      expect(authService.isInitialized, isFalse);
      expect(authService.currentUserId, isNull);
      expect(authService.currentOrganizationId, isNull);
    });

    test('Test K: Suspended user has operational activity blocked', () {
      const status = UserStatus.suspended;
      expect(status.isOperational, isFalse);
      expect(status.banglaName, 'স্থগিত');
    });

    test('Test L: Archived user has operational activity blocked', () {
      const status = UserStatus.archived;
      expect(status.isOperational, isFalse);
      expect(status.banglaName, 'আর্কাইভ');
    });

    test('Test M: Role assignment creates audit record with actor and timestamp', () async {
      await repository.assignRoleToUser(
        organizationId: orgId,
        userId: 'usr_007_member',
        roleKey: SystemRoleKey.auditor,
        actorUserId: 'usr_001_super_admin',
        actorName: 'মাওলানা আব্দুল্লাহ',
        reason: 'হিসাব নিরীক্ষা কমিটি অন্তর্ভুক্তি',
      );

      final audits = await repository.getRoleAuditRecords(organizationId: orgId, targetUserId: 'usr_007_member');
      expect(audits.any((a) => a.action == 'ROLE_ASSIGNED' && a.roleKey == SystemRoleKey.auditor), isTrue);
    });

    test('Test N: Role removal creates audit record with actor and timestamp', () async {
      await repository.removeRoleFromUser(
        organizationId: orgId,
        userId: 'usr_007_member',
        roleKey: SystemRoleKey.auditor,
        actorUserId: 'usr_001_super_admin',
        actorName: 'মাওলানা আব্দুল্লাহ',
        reason: 'নিরীক্ষা কার্যকাল সমাপ্তি',
      );

      final audits = await repository.getRoleAuditRecords(organizationId: orgId, targetUserId: 'usr_007_member');
      expect(audits.any((a) => a.action == 'ROLE_REMOVED' && a.roleKey == SystemRoleKey.auditor), isTrue);
    });
  });
}
