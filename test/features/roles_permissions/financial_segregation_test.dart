import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/core/authorization/authorization_service.dart';
import '../../../../lib/core/authorization/permission_catalog.dart';
import '../../../../lib/core/authorization/permission_keys.dart';
import '../../../../lib/domain/entities/role.dart';

void main() {
  group('Prompt 2.3 — Financial Segregation of Duties & Self-Approval Policy Tests', () {
    late AuthorizationService authService;

    setUp(() {
      authService = AuthorizationService.instance;
      authService.clearCache();
    });

    tearDown(() {
      authService.clearCache();
    });

    test('1. Financial permissions are distinct: Create ≠ Approve ≠ Reverse', () {
      final accountantPerms = PermissionCatalog.getDefaultRolePermissions('accountant');
      final treasurerPerms = PermissionCatalog.getDefaultRolePermissions('treasurer');
      final auditorPerms = PermissionCatalog.getDefaultRolePermissions('auditor');

      // হিসাবরক্ষক (Accountant): create আছে, কিন্তু approve এবং reverse নেই
      expect(accountantPerms.contains(PermissionKeys.financeTransactionCreate), isTrue);
      expect(accountantPerms.contains(PermissionKeys.financeTransactionApprove), isFalse);
      expect(accountantPerms.contains(PermissionKeys.financeTransactionReverse), isFalse);

      // কোষাধ্যক্ষ (Treasurer): approve আছে, কিন্তু ডিফল্টভাবে reverse নেই
      expect(treasurerPerms.contains(PermissionKeys.financeTransactionApprove), isTrue);
      expect(treasurerPerms.contains(PermissionKeys.financeTransactionReverse), isFalse);

      // নিরীক্ষক (Auditor): শুধুমাত্র view আছে, কোনো create/approve/reverse নেই
      expect(auditorPerms.contains(PermissionKeys.financeTransactionView), isTrue);
      expect(auditorPerms.contains(PermissionKeys.financeTransactionCreate), isFalse);
      expect(auditorPerms.contains(PermissionKeys.financeTransactionApprove), isFalse);
      expect(auditorPerms.contains(PermissionKeys.financeTransactionReverse), isFalse);
    });

    test('2. Destructive delete is prohibited for financial transactions: Reverse ≠ Delete', () {
      // পারমিশন ক্যাটালগে ফিন্যান্স ট্রানজ্যাকশনের জন্য কোনো 'delete' অ্যাকশন তৈরি করা হয়নি
      final allPermKeys = PermissionCatalog.allPermissions.map((p) => p.key).toList();
      expect(allPermKeys.contains('finance.transaction.delete'), isFalse);
      expect(allPermKeys.contains(PermissionKeys.financeTransactionReverse), isTrue);
    });

    test('3. Self-approval policy blocks approval when creator is the same user', () {
      final policy = authService.checkSelfApprovalPolicy(
        creatorUserId: 'usr-101',
        approverUserId: 'usr-101',
      );

      expect(policy.isAllowed, isFalse);
      expect(policy.code, equals('SELF_APPROVAL_FORBIDDEN'));
      expect(policy.message, contains('লেনদেন তৈরিকারী নিজেই তা অনুমোদন করতে পারবেন না'));
    });

    test('4. Self-approval policy allows approval when creator and approver are different', () {
      final policy = authService.checkSelfApprovalPolicy(
        creatorUserId: 'usr-101',
        approverUserId: 'usr-102',
      );

      expect(policy.isAllowed, isTrue);
    });

    test('5. canApproveTransaction() enforces both permission AND self-approval segregation', () async {
      final treasurerRole = Role(
        id: 'role-treasurer',
        organizationId: 'org-test',
        key: 'treasurer',
        name: 'কোষাধ্যক্ষ',
        description: 'কোষাধ্যক্ষ',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [
          PermissionKeys.financeTransactionApprove,
        ],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'treasurer-user-01',
        organizationId: 'org-test',
        assignedRoles: [treasurerRole],
      );

      // দৃশ্যপট ১: কোষাধ্যক্ষ অন্য কারও (যেমন হিসাবরক্ষকের) তৈরি ভাউচার অনুমোদন করতে পারবেন
      final canApproveOther = authService.canApproveTransaction(
        creatorUserId: 'accountant-user-02',
        currentUserId: 'treasurer-user-01',
      );
      expect(canApproveOther, isTrue);

      // দৃশ্যপট ২: কোষাধ্যক্ষ যদি নিজেই ভাউচার তৈরি করে থাকেন, তবে নিজের ভাউচার অনুমোদন করতে পারবেন না
      final canApproveOwn = authService.canApproveTransaction(
        creatorUserId: 'treasurer-user-01',
        currentUserId: 'treasurer-user-01',
      );
      expect(canApproveOwn, isFalse);
    });
  });
}
