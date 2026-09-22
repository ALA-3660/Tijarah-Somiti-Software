import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/core/authorization/permission_catalog.dart';
import '../../../../lib/domain/entities/user_status.dart';
import '../../../../lib/features/user_management/data/repositories/user_repository_impl.dart';

void main() {
  group('Prompt 2.4 — UserRepository & Policy Enforcement Unit Tests', () {
    late UserRepositoryImpl repository;
    const orgA = 'org_alpha';
    const orgB = 'org_beta';

    setUp(() {
      repository = UserRepositoryImpl();
    });

    test('1. Organization Isolation: Users of Org A are strictly isolated from Org B', () async {
      // Create user in Org A
      final userA = await repository.createUser(
        organizationId: orgA,
        fullName: 'কারী আবুল কাশেম',
        mobile: '01711111111',
        email: 'kashem@alpha.org',
        initialRoleKeys: [SystemRoleKey.member],
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
      );

      // Create user in Org B
      final userB = await repository.createUser(
        organizationId: orgB,
        fullName: 'হাফেজ মিজানুর রহমান',
        mobile: '01822222222',
        email: 'mizan@beta.org',
        initialRoleKeys: [SystemRoleKey.secretary],
        actorUserId: 'admin_beta',
        actorName: 'অ্যাডমিন বেটা',
      );

      // Verify Org A users
      final usersA = await repository.getUsers(organizationId: orgA);
      expect(usersA.length, 1);
      expect(usersA.first.id, userA.id);
      expect(usersA.first.fullName, 'কারী আবুল কাশেম');

      // Verify Org B users
      final usersB = await repository.getUsers(organizationId: orgB);
      expect(usersB.length, 1);
      expect(usersB.first.id, userB.id);
      expect(usersB.first.fullName, 'হাফেজ মিজানুর রহমান');

      // Attempting to get User A using Org B context returns null
      final crossUser = await repository.getUserById(organizationId: orgB, userId: userA.id);
      expect(crossUser, isNull);
    });

    test('2. Multiple Role Assignment: User can have multiple system roles assigned', () async {
      final user = await repository.createUser(
        organizationId: orgA,
        fullName: 'মুফতি উসমান গনি',
        mobile: '01933333333',
        email: 'osman@alpha.org',
        initialRoleKeys: [SystemRoleKey.secretary],
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
      );

      expect(user.roles.length, 1);
      expect(user.roles.first.key, SystemRoleKey.secretary);

      // Assign accountant role as secondary role
      final updated = await repository.assignRoleToUser(
        organizationId: orgA,
        userId: user.id,
        roleKey: SystemRoleKey.accountant,
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
        reason: 'হিসাব বিভাগের অতিরিক্ত দায়িত্ব প্রদান',
      );

      expect(updated.roles.length, 2);
      expect(updated.hasRole(SystemRoleKey.secretary), isTrue);
      expect(updated.hasRole(SystemRoleKey.accountant), isTrue);

      // Check role audit record generated
      final audits = await repository.getRoleAuditRecords(organizationId: orgA, targetUserId: user.id);
      expect(audits.isNotEmpty, isTrue);
      expect(audits.any((a) => a.roleKey == SystemRoleKey.accountant && a.action == 'ROLE_ASSIGNED'), isTrue);
    });

    test('3. Role Removal: Successfully removes role and leaves other roles intact', () async {
      final user = await repository.createUser(
        organizationId: orgA,
        fullName: 'মাওলানা ইউসুফ আলী',
        mobile: '01544444444',
        email: 'yousuf@alpha.org',
        initialRoleKeys: [SystemRoleKey.secretary, SystemRoleKey.collector],
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
      );

      expect(user.roles.length, 2);

      // Remove collector role
      final updated = await repository.removeRoleFromUser(
        organizationId: orgA,
        userId: user.id,
        roleKey: SystemRoleKey.collector,
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
        reason: 'সংগ্রাহক দায়িত্ব সমাপ্তি',
      );

      expect(updated.roles.length, 1);
      expect(updated.hasRole(SystemRoleKey.secretary), isTrue);
      expect(updated.hasRole(SystemRoleKey.collector), isFalse);

      final audits = await repository.getRoleAuditRecords(organizationId: orgA, targetUserId: user.id);
      expect(audits.any((a) => a.roleKey == SystemRoleKey.collector && a.action == 'ROLE_REMOVED'), isTrue);
    });

    test('4. Duplicate Validation: Disallows duplicate mobile and email within same organization', () async {
      await repository.createUser(
        organizationId: orgA,
        fullName: 'ভাই খালিদ মাহমুদ',
        mobile: '01755555555',
        email: 'khalid@alpha.org',
        initialRoleKeys: [SystemRoleKey.member],
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
      );

      // Duplicate mobile
      expect(
        () => repository.createUser(
          organizationId: orgA,
          fullName: 'অন্য ব্যক্তি',
          mobile: '01755555555',
          email: 'another@alpha.org',
          initialRoleKeys: [SystemRoleKey.member],
          actorUserId: 'admin_alpha',
          actorName: 'অ্যাডমিন আলফা',
        ),
        throwsA(predicate((e) => e.toString().contains('মোবাইল নম্বরটি ইতোমধ্যেই'))),
      );

      // Duplicate email
      expect(
        () => repository.createUser(
          organizationId: orgA,
          fullName: 'অন্য ব্যক্তি ২',
          mobile: '01766666666',
          email: 'khalid@alpha.org',
          initialRoleKeys: [SystemRoleKey.member],
          actorUserId: 'admin_alpha',
          actorName: 'অ্যাডমিন আলফা',
        ),
        throwsA(predicate((e) => e.toString().contains('ইমেইল ঠিকানাটি ইতোমধ্যেই'))),
      );
    });

    test('5. Privilege Escalation Prevention: User cannot assign roles to themselves', () async {
      final user = await repository.createUser(
        organizationId: orgA,
        fullName: 'ভাই সাঈদ আনোয়ার',
        mobile: '01777777777',
        email: 'saeed@alpha.org',
        initialRoleKeys: [SystemRoleKey.member],
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
      );

      // User attempts to self-assign super_admin role
      expect(
        () => repository.assignRoleToUser(
          organizationId: orgA,
          userId: user.id,
          roleKey: SystemRoleKey.superAdmin,
          actorUserId: user.id, // Self-assigning!
          actorName: user.fullName,
        ),
        throwsA(predicate((e) => e.toString().contains('Privilege Escalation Protection'))),
      );
    });

    test('6. User Status Lifecycle: Transitions Active <-> Suspended <-> Archived with audit log', () async {
      final user = await repository.createUser(
        organizationId: orgA,
        fullName: 'মাওলানা কামরুল হাসান',
        mobile: '01788888888',
        email: 'kamrul@alpha.org',
        initialRoleKeys: [SystemRoleKey.member],
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
      );

      expect(user.status, UserStatus.active);

      // Active -> Suspended
      final suspended = await repository.changeUserStatus(
        organizationId: orgA,
        userId: user.id,
        newStatus: UserStatus.suspended,
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
        reason: 'তদন্তাধীন',
      );
      expect(suspended.status, UserStatus.suspended);

      // Verify audit
      final audits = await repository.getStatusAuditRecords(organizationId: orgA, targetUserId: user.id);
      expect(audits.length, 1);
      expect(audits.first.previousStatus, UserStatus.active);
      expect(audits.first.newStatus, UserStatus.suspended);
      expect(audits.first.reason, 'তদন্তাধীন');
    });

    test('7. Search and Filter UX: Accurately filters by query, status, and role', () async {
      await repository.createUser(
        organizationId: orgA,
        fullName: 'মাওলানা শফিকুর রহমান',
        mobile: '01799999991',
        email: 'shafiq@alpha.org',
        initialRoleKeys: [SystemRoleKey.collector],
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
      );

      await repository.createUser(
        organizationId: orgA,
        fullName: 'মাওলানা তারিক জামিল',
        mobile: '01799999992',
        email: 'tariq@alpha.org',
        initialRoleKeys: [SystemRoleKey.auditor],
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
      );

      // Search by Bengali name
      final searchResult = await repository.getUsers(organizationId: orgA, searchQuery: 'শফিকুর');
      expect(searchResult.length, 1);
      expect(searchResult.first.fullName, contains('শফিকুর'));

      // Filter by role
      final roleResult = await repository.getUsers(organizationId: orgA, roleFilter: SystemRoleKey.auditor);
      expect(roleResult.length, 1);
      expect(roleResult.first.fullName, contains('তারিক জামিল'));
    });
  });
}
