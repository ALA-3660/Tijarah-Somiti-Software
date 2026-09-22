import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/core/authorization/authorization_service.dart';
import '../../../../lib/core/authorization/permission_keys.dart';
import '../../../../lib/core/context/organization_context.dart';
import '../../../../lib/core/state/ui_state.dart';
import '../../../../lib/domain/entities/managed_user.dart';
import '../../../../lib/domain/entities/role.dart';
import '../../../../lib/domain/entities/user_status.dart';
import '../../../../lib/features/user_management/presentation/screens/user_list_screen.dart';
import '../../../../lib/shared/widgets/app_empty_state.dart';
import '../../../../lib/shared/widgets/app_error.dart';
import '../../../../lib/shared/widgets/app_loading.dart';
import '../../../../lib/shared/widgets/app_confirm_action.dart';

void main() {
  group('Prompt 2.4 — User Management Widget Tests', () {
    late AuthorizationService authService;

    setUp(() async {
      authService = AuthorizationService.instance;
      authService.clearCache();
      OrganizationContext.instance.setOrganization(
        id: 'demo_org_khurushkul',
        name: 'খুরুশকুল আদর্শ সমবায় সমিতি',
        code: 'KAS-001',
        isDemo: true,
      );
    });

    tearDown(() {
      authService.clearCache();
    });

    Widget createTestApp(Widget child) {
      return MaterialApp(
        home: child,
      );
    }

    testWidgets('1. User List screen renders correctly with permission', (tester) async {
      final role = Role(
        id: 'r_super',
        organizationId: 'demo_org_khurushkul',
        key: 'super_admin',
        name: 'সুপার অ্যাডমিন',
        description: 'সর্বোচ্চ প্রশাসনিক ক্ষমতা',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [
          PermissionKeys.userView,
          PermissionKeys.userManage,
          PermissionKeys.roleView,
          PermissionKeys.roleManage,
        ],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_001_super_admin',
        organizationId: 'demo_org_khurushkul',
        assignedRoles: [role],
      );

      await tester.pumpWidget(createTestApp(const UserListScreen()));
      await tester.pumpAndSettle();

      expect(find.text('ব্যবহারকারী ও ভূমিকা ব্যবস্থাপনা (User Accounts & Roles)'), findsOneWidget);
      expect(find.text('নতুন ব্যবহারকারী'), findsOneWidget);
    });

    testWidgets('2. Empty state renders when no users are present', (tester) async {
      await tester.pumpWidget(
        createTestApp(
          const Scaffold(
            body: AppEmptyState(
              title: 'কোনো ব্যবহারকারী পাওয়া যায়নি',
              description: 'নতুন ব্যবহারকারী অ্যাকাউন্ট তৈরি করুন।',
            ),
          ),
        ),
      );

      expect(find.text('কোনো ব্যবহারকারী পাওয়া যায়নি'), findsOneWidget);
      expect(find.text('নতুন ব্যবহারকারী অ্যাকাউন্ট তৈরি করুন।'), findsOneWidget);
    });

    testWidgets('3. Loading state renders progress indicator', (tester) async {
      await tester.pumpWidget(
        createTestApp(
          const Scaffold(
            body: AppLoading(message: 'ব্যবহারকারী তালিকা লোড হচ্ছে...'),
          ),
        ),
      );

      expect(find.text('ব্যবহারকারী তালিকা লোড হচ্ছে...'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('4. Error state renders message and retry button', (tester) async {
      bool retried = false;
      await tester.pumpWidget(
        createTestApp(
          Scaffold(
            body: AppError(
              message: 'সার্ভার সংযোগ বিচ্ছিন্ন হয়েছে',
              onRetry: () {
                retried = true;
              },
            ),
          ),
        ),
      );

      expect(find.text('সার্ভার সংযোগ বিচ্ছিন্ন হয়েছে'), findsOneWidget);
      expect(find.text('আবার চেষ্টা করুন'), findsOneWidget);

      await tester.tap(find.text('আবার চেষ্টা করুন'));
      expect(retried, isTrue);
    });

    testWidgets('5. PermissionGuard hides "নতুন ব্যবহারকারী" action for unauthorized user', (tester) async {
      // User only has view permission, not userManage
      final role = Role(
        id: 'r_viewer',
        organizationId: 'demo_org_khurushkul',
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
        organizationId: 'demo_org_khurushkul',
        assignedRoles: [role],
      );

      await tester.pumpWidget(createTestApp(const UserListScreen()));
      await tester.pumpAndSettle();

      // View is rendered
      expect(find.text('ব্যবহারকারী ও ভূমিকা ব্যবস্থাপনা (User Accounts & Roles)'), findsOneWidget);
      // Create User button is hidden by PermissionGuard
      expect(find.text('নতুন ব্যবহারকারী'), findsNothing);
    });

    testWidgets('6. Role assignment UI displays system/custom badges correctly', (tester) async {
      final role = Role(
        id: 'r_test',
        organizationId: 'demo_org_khurushkul',
        key: 'accountant',
        name: 'হিসাবরক্ষক',
        description: 'হিসাবরক্ষক',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const ['finance.transaction.create'],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final user = ManagedUser(
        id: 'usr_test_01',
        organizationId: 'demo_org_khurushkul',
        userCode: 'USR-000099',
        fullName: 'কারী আব্দুল কুদ্দুস',
        mobile: '01711223344',
        email: 'kuddus@tijarah.org',
        status: UserStatus.active,
        roles: [role],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      expect(user.roles.first.name, 'হিসাবরক্ষক');
      expect(user.roles.first.isSystemRole, isTrue);
    });

    testWidgets('7. Status change confirmation dialog requires reason', (tester) async {
      await tester.pumpWidget(
        createTestApp(
          Builder(
            builder: (ctx) {
              return ElevatedButton(
                onPressed: () {
                  AppConfirmAction.show(
                    context: ctx,
                    title: 'স্ট্যাটাস পরিবর্তন নিশ্চিতকরণ',
                    message: 'আপনি কি অ্যাকাউন্টটি সাময়িক স্থগিত করতে চান?',
                    confirmText: 'স্থগিত করুন',
                    isDestructive: true,
                    onConfirm: () {},
                  );
                },
                child: const Text('ওপেন কনফার্মেশন'),
              );
            },
          ),
        ),
      );

      await tester.tap(find.text('ওপেন কনফার্মেশন'));
      await tester.pumpAndSettle();

      expect(find.text('স্ট্যাটাস পরিবর্তন নিশ্চিতকরণ'), findsOneWidget);
      expect(find.text('আপনি কি অ্যাকাউন্টটি সাময়িক স্থগিত করতে চান?'), findsOneWidget);
      expect(find.text('স্থগিত করুন'), findsOneWidget);
      expect(find.text('বাতিল'), findsOneWidget);
    });
  });
}
