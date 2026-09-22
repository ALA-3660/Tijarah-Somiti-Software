import 'package:flutter_test/flutter_test.dart';
import '../../../lib/core/authorization/permission_catalog.dart';
import '../../../lib/core/authorization/permission_keys.dart';
import '../../../lib/core/authorization/system_role_keys.dart';
import '../../../lib/features/security_audit/data/repositories/security_audit_repository_impl.dart';
import '../../../lib/features/security_audit/domain/entities/security_event.dart';
import '../../../lib/features/security_audit/presentation/controllers/security_audit_controller.dart';
import '../../../lib/features/security_audit/presentation/controllers/session_security_controller.dart';
import '../../../lib/features/user_management/data/repositories/user_repository_impl.dart';
import '../../../lib/domain/entities/user_status.dart';

void main() {
  group('Prompt 2.5 — Security Audit & Session Integration Tests', () {
    // Test K: Authorization Catalog and Role Mappings
    test('Test K: Permission keys exist and are granted to appropriate roles', () {
      final allPermissions = PermissionCatalog.allPermissions;

      // Verify all 3 new permissions exist
      expect(allPermissions.any((p) => p.key == PermissionKeys.auditLogView), isTrue);
      expect(allPermissions.any((p) => p.key == PermissionKeys.sessionView), isTrue);
      expect(allPermissions.any((p) => p.key == PermissionKeys.sessionTerminate), isTrue);

      final roles = PermissionCatalog.createDefaultSystemRoles('org_test');
      final auditorRole = roles.firstWhere((r) => r.key == SystemRoleKey.auditor);
      final secretaryRole = roles.firstWhere((r) => r.key == SystemRoleKey.secretary);
      final superAdminRole = roles.firstWhere((r) => r.key == SystemRoleKey.superAdmin);

      // Auditor must have auditLogView and sessionView
      expect(auditorRole.permissionKeys.contains(PermissionKeys.auditLogView), isTrue);
      expect(auditorRole.permissionKeys.contains(PermissionKeys.sessionView), isTrue);

      // Secretary must have auditLogView, sessionView, sessionTerminate
      expect(secretaryRole.permissionKeys.contains(PermissionKeys.auditLogView), isTrue);
      expect(secretaryRole.permissionKeys.contains(PermissionKeys.sessionView), isTrue);
      expect(secretaryRole.permissionKeys.contains(PermissionKeys.sessionTerminate), isTrue);

      // SuperAdmin must have all
      expect(superAdminRole.permissionKeys.contains(PermissionKeys.auditLogView), isTrue);
      expect(superAdminRole.permissionKeys.contains(PermissionKeys.sessionView), isTrue);
      expect(superAdminRole.permissionKeys.contains(PermissionKeys.sessionTerminate), isTrue);
    });

    // Test L: Privilege Escalation Protection Emits Security Audit
    test('Test L: Self-role assignment and self-suspension attempts emit privilegeEscalationBlocked audit', () async {
      final userRepo = UserRepositoryImpl.instance;
      final auditRepo = SecurityAuditRepositoryImpl.instance;
      const orgId = 'org_kholama_01';

      // 1. Attempt self-role assignment (Privilege Escalation attempt)
      expect(
        () => userRepo.assignRoleToUser(
          organizationId: orgId,
          userId: 'USR-000001',
          roleKey: SystemRoleKey.auditor,
          actorUserId: 'USR-000001', // Self actor
          actorName: 'মাওলানা মুহাম্মদ ওসমান',
          reason: 'নিজেই নিজেকে অডিটর রোল দেওয়া',
        ),
        throwsA(isA<Exception>()),
      );

      // Verify that privilegeEscalationBlocked was logged in SecurityAuditRepository
      final logs = await auditRepo.getAuditLogs(organizationId: orgId);
      final escalationBlockLog = logs.firstWhere(
        (l) => l.eventType == SecurityEventType.privilegeEscalationBlocked,
      );
      expect(escalationBlockLog.result, SecurityEventResult.blocked);
      expect(escalationBlockLog.actorUserId, 'USR-000001');

      // 2. Attempt self-suspension
      expect(
        () => userRepo.changeUserStatus(
          organizationId: orgId,
          userId: 'USR-000001',
          newStatus: UserStatus.suspended,
          actorUserId: 'USR-000001', // Self actor
          actorName: 'মাওলানা মুহাম্মদ ওসমান',
        ),
        throwsA(isA<Exception>()),
      );
    });

    // Test N: SecurityAuditController state flow
    test('Test N: SecurityAuditController transitions and filters correctly', () async {
      final controller = SecurityAuditController();

      await controller.loadAudits();
      expect(controller.state.isSuccess, isTrue);

      final initialCount = controller.state.dataOrNull?.length ?? 0;
      expect(initialCount, greaterThan(0));
      expect(controller.selectedRecord, isNotNull);

      // Filter by result: failed
      controller.setResultFilter(SecurityEventResult.failed);
      await Future.delayed(const Duration(milliseconds: 50));
      expect(controller.filterResult, SecurityEventResult.failed);
      expect(
        controller.state.dataOrNull?.every((r) => r.result == SecurityEventResult.failed),
        isTrue,
      );

      // Reset filters
      controller.resetFilters();
      await Future.delayed(const Duration(milliseconds: 50));
      expect(controller.filterResult, isNull);
      expect(controller.state.dataOrNull?.length, initialCount);

      controller.dispose();
    });

    // Test O: SessionSecurityController state flow
    test('Test O: SessionSecurityController loads sessions and handles termination', () async {
      final controller = SessionSecurityController();

      await controller.loadSessions();
      expect(controller.state.isSuccess, isTrue);
      expect(controller.state.dataOrNull?.isNotEmpty, isTrue);
      expect(controller.currentSession, isNotNull);

      final sessions = controller.state.dataOrNull!;
      final activeTarget = sessions.firstWhere((s) => s.isActive && !s.isCurrent);

      final success = await controller.terminateSession(
        sessionId: activeTarget.sessionId,
        actorUserId: 'USR-000001',
        reason: 'টেস্ট টারমিনেশন রিকোয়েস্ট',
      );

      expect(success, isTrue);

      controller.dispose();
    });
  });
}
