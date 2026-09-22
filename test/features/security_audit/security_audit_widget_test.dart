import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../../../lib/core/authorization/authorization_service.dart';
import '../../../lib/core/authorization/permission_keys.dart';
import '../../../lib/domain/entities/role.dart';
import '../../../lib/features/organization/presentation/controllers/organization_context.dart';
import '../../../lib/features/security_audit/domain/entities/security_audit_record.dart';
import '../../../lib/features/security_audit/domain/entities/security_event.dart';
import '../../../lib/features/security_audit/domain/entities/security_session.dart';
import '../../../lib/features/security_audit/presentation/screens/security_audit_screen.dart';
import '../../../lib/features/security_audit/presentation/screens/session_security_screen.dart';
import '../../../lib/features/security_audit/presentation/widgets/security_audit_detail_panel.dart';
import '../../../lib/features/security_audit/presentation/widgets/session_card.dart';

void main() {
  group('Prompt 2.5 — Security Audit & Session Security Widget Tests', () {
    late AuthorizationService authService;

    setUp(() async {
      authService = AuthorizationService.instance;
      authService.clearCache();
      OrganizationContext.instance.setOrganization(
        id: 'org_kholama_01',
        name: 'খুরুশকুল ওলামা সমিতি',
        code: 'KOS-01',
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

    testWidgets('1. SecurityAuditDetailPanel displays record details properly', (tester) async {
      final record = SecurityAuditRecord(
        id: 'SEC-TEST-99',
        organizationId: 'org_kholama_01',
        actorUserId: 'USR-000001',
        actorName: 'মাওলানা মুহাম্মদ ওসমান',
        eventType: SecurityEventType.loginSuccess,
        action: 'সফল লগইন সম্পাদন',
        targetType: 'session',
        targetId: 'sess_test_101',
        targetName: 'ডিভাইস সেশন',
        timestamp: DateTime(2025, 6, 15, 10, 30),
        ipAddress: '192.168.1.102',
        deviceReference: 'Chrome on MacOS',
        reason: 'সঠিক পাসওয়ার্ড যাচাই',
        result: SecurityEventResult.success,
      );

      await tester.pumpWidget(createTestApp(
        Scaffold(
          body: SecurityAuditDetailPanel(record: record),
        ),
      ));
      await tester.pumpAndSettle();

      expect(find.text('সফল লগইন'), findsWidgets);
      expect(find.text('মাওলানা মুহাম্মদ ওসমান'), findsOneWidget);
      expect(find.text('192.168.***.***'), findsOneWidget);
      expect(find.text('Chrome on MacOS'), findsOneWidget);
      expect(find.text('সঠিক পাসওয়ার্ড যাচাই'), findsOneWidget);
    });

    testWidgets('2. SessionCard displays masked session ID and device info', (tester) async {
      final session = SecuritySession(
        sessionId: 'sess_kholama_sec_01',
        organizationId: 'org_kholama_01',
        userId: 'USR-000001',
        userName: 'মাওলানা মুহাম্মদ ওসমান',
        userRoleName: 'সহ-সভাপতি',
        status: SecuritySessionStatus.active,
        createdAt: DateTime(2025, 6, 15, 8, 0),
        lastActivityAt: DateTime(2025, 6, 15, 10, 0),
        expiresAt: DateTime(2025, 6, 15, 16, 0),
        ipAddress: '192.168.1.102',
        deviceReference: 'Google Chrome / macOS',
        isCurrent: true,
      );

      await tester.pumpWidget(createTestApp(
        Scaffold(
          body: SessionCard(session: session, isCurrent: true),
        ),
      ));
      await tester.pumpAndSettle();

      expect(find.text('sess_***_sec_01'), findsOneWidget);
      expect(find.text('মাওলানা মুহাম্মদ ওসমান'), findsOneWidget);
      expect(find.text('বর্তমান সেশন'), findsOneWidget);
      expect(find.text('আইপি: 192.168.***.***'), findsOneWidget);
    });

    testWidgets('3. SecurityAuditScreen displays with auditLogView permission', (tester) async {
      final role = Role(
        id: 'r_auditor',
        organizationId: 'org_kholama_01',
        key: 'auditor',
        name: 'অডিটর',
        description: 'অডিট ও নিরীক্ষা',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [
          PermissionKeys.auditLogView,
          PermissionKeys.sessionView,
        ],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_auditor',
        organizationId: 'org_kholama_01',
        roles: [role],
      );

      tester.view.physicalSize = const Size(1200, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createTestApp(const SecurityAuditScreen()));
      await tester.pumpAndSettle();

      expect(find.text('নিরাপত্তা অডিট ও ইভেন্ট লগ'), findsOneWidget);
      expect(find.text('সকল ইভেন্ট টাইপ'), findsOneWidget);
      expect(find.text('সকল ফলাফল'), findsOneWidget);
    });

    testWidgets('4. SessionSecurityScreen displays with sessionView permission', (tester) async {
      final role = Role(
        id: 'r_secretary',
        organizationId: 'org_kholama_01',
        key: 'secretary',
        name: 'সাধারণ সম্পাদক',
        description: 'প্রশাসনিক নিয়ন্ত্রণ',
        isSystemRole: true,
        isActive: true,
        permissionKeys: const [
          PermissionKeys.sessionView,
          PermissionKeys.sessionTerminate,
        ],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await authService.initialize(
        userId: 'usr_sec',
        organizationId: 'org_kholama_01',
        roles: [role],
      );

      tester.view.physicalSize = const Size(1200, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createTestApp(const SessionSecurityScreen()));
      await tester.pumpAndSettle();

      expect(find.text('সেশন ও ডিভাইস নিরাপত্তা'), findsOneWidget);
      expect(find.text('সকল'), findsOneWidget);
      expect(find.text('সক্রিয়'), findsOneWidget);
    });
  });
}
