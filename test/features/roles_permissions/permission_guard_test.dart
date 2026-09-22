import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/core/authorization/authorization_service.dart';
import '../../../../lib/core/authorization/permission_guard.dart';
import '../../../../lib/core/authorization/permission_keys.dart';
import '../../../../lib/domain/entities/role.dart';
import '../../../../lib/shared/widgets/app_permission_state.dart';

void main() {
  group('Prompt 2.3 — PermissionGuard Widget Tests', () {
    late AuthorizationService authService;

    setUp(() {
      authService = AuthorizationService.instance;
      authService.clearCache();
    });

    tearDown(() {
      authService.clearCache();
    });

    Widget createTestApp(Widget child) {
      return MaterialApp(
        home: Scaffold(
          body: child,
        ),
      );
    }

    testWidgets('1. Renders child when user has required permission', (tester) async {
      final role = Role(
        id: 'r-01',
        organizationId: 'org-test',
        key: 'accountant',
        name: 'হিসাবরক্ষক',
        description: 'হিসাবরক্ষক',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [PermissionKeys.financeTransactionCreate],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'u-01',
        organizationId: 'org-test',
        assignedRoles: [role],
      );

      await tester.pumpWidget(
        createTestApp(
          const PermissionGuard(
            permission: PermissionKeys.financeTransactionCreate,
            child: Text('লেনদেন যোগ করুন বাটন'),
          ),
        ),
      );

      expect(find.text('লেনদেন যোগ করুন বাটন'), findsOneWidget);
    });

    testWidgets('2. Hides child completely when permission is missing (mode: hide)', (tester) async {
      await authService.initialize(
        userId: 'u-01',
        organizationId: 'org-test',
        assignedRoles: [],
      );

      await tester.pumpWidget(
        createTestApp(
          const PermissionGuard(
            permission: PermissionKeys.financeTransactionApprove,
            mode: PermissionGuardMode.hide,
            child: Text('অনুমোদন বাটন'),
          ),
        ),
      );

      expect(find.text('অনুমোদন বাটন'), findsNothing);
    });

    testWidgets('3. Renders AppPermissionState when mode is accessDenied', (tester) async {
      await authService.initialize(
        userId: 'u-01',
        organizationId: 'org-test',
        assignedRoles: [],
      );

      await tester.pumpWidget(
        createTestApp(
          PermissionGuard.page(
            permission: PermissionKeys.organizationStatusChange,
            child: const Text('সংগঠন স্ট্যাটাস প্যানেল'),
          ),
        ),
      );

      expect(find.text('সংগঠন স্ট্যাটাস প্যানেল'), findsNothing);
      expect(find.byType(AppPermissionState), findsOneWidget);
      expect(find.text('অনুমতি নেই (Access Restricted)'), findsOneWidget);
    });
  });
}
