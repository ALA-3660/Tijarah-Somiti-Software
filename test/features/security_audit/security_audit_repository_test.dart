import 'package:flutter_test/flutter_test.dart';
import '../../../lib/features/security_audit/data/repositories/security_audit_repository_impl.dart';
import '../../../lib/features/security_audit/data/repositories/session_security_repository_impl.dart';
import '../../../lib/features/security_audit/domain/entities/security_audit_record.dart';
import '../../../lib/features/security_audit/domain/entities/security_event.dart';
import '../../../lib/features/security_audit/domain/entities/security_session.dart';
import '../../../lib/features/security_audit/domain/usecases/get_security_audit_logs_use_case.dart';
import '../../../lib/features/security_audit/domain/usecases/record_security_audit_use_case.dart';
import '../../../lib/features/security_audit/domain/usecases/terminate_session_use_case.dart';

void main() {
  group('Prompt 2.5 — Security Audit & Session Repositories & Use Cases', () {
    late SecurityAuditRepositoryImpl auditRepo;
    late SessionSecurityRepositoryImpl sessionRepo;

    setUp(() {
      auditRepo = SecurityAuditRepositoryImpl.instance;
      sessionRepo = SessionSecurityRepositoryImpl.instance;
    });

    // Test C: Security Audit Repository isolation by organizationId
    test('Test C: SecurityAuditRepository isolates records by organizationId', () async {
      final recordsOrg1 = await auditRepo.getAuditLogs(organizationId: 'org_kholama_01');
      expect(recordsOrg1.isNotEmpty, isTrue);
      expect(recordsOrg1.every((r) => r.organizationId == 'org_kholama_01'), isTrue);

      final recordsEmptyOrg = await auditRepo.getAuditLogs(organizationId: 'org_non_existent');
      expect(recordsEmptyOrg.isEmpty, isTrue);
    });

    // Test D: Immutability constraint: audit records cannot be mutated or deleted
    test('Test D: SecurityAuditRepository strictly prevents modification and deletion', () async {
      expect(
        () => auditRepo.deleteRecord('any_id'),
        throwsA(isA<UnsupportedError>()),
      );

      expect(
        () => auditRepo.updateRecord(SecurityAuditRecord(
          id: 'test',
          organizationId: 'test',
          actorUserId: 'u',
          actorName: 'u',
          eventType: SecurityEventType.loginSuccess,
          action: 'a',
          targetType: 't',
          timestamp: DateTime.now(),
          result: SecurityEventResult.success,
        )),
        throwsA(isA<UnsupportedError>()),
      );
    });

    // Test F: GetSecurityAuditLogsUseCase filtering
    test('Test F: GetSecurityAuditLogsUseCase filters by eventType, result, and search query', () async {
      final useCase = GetSecurityAuditLogsUseCase(auditRepo);

      // Filter by result: failed
      final failedLogs = await useCase(
        const GetSecurityAuditLogsParams(
          organizationId: 'org_kholama_01',
          result: SecurityEventResult.failed,
        ),
      );
      expect(failedLogs.every((r) => r.result == SecurityEventResult.failed), isTrue);

      // Filter by search query: 'মাওলানা'
      final searchLogs = await useCase(
        const GetSecurityAuditLogsParams(
          organizationId: 'org_kholama_01',
          searchQuery: 'মাওলানা',
        ),
      );
      expect(
        searchLogs.every((r) =>
            r.actorName.contains('মাওলানা') ||
            r.action.contains('মাওলানা') ||
            (r.targetName != null && r.targetName!.contains('মাওলানা'))),
        isTrue,
      );
    });

    // Test G: RecordSecurityAuditUseCase functionality
    test('Test G: RecordSecurityAuditUseCase appends record at top of log', () async {
      final recordUseCase = RecordSecurityAuditUseCase(auditRepo);
      final newId = 'SEC-TEST-${DateTime.now().millisecondsSinceEpoch}';

      final newRecord = SecurityAuditRecord(
        id: newId,
        organizationId: 'org_kholama_01',
        actorUserId: 'usr_unit_test',
        actorName: 'টেস্ট অ্যাডমিন',
        eventType: SecurityEventType.passwordChanged,
        action: 'পাসওয়ার্ড সফলভাবে হালনাগাদ',
        targetType: 'user',
        targetId: 'usr_unit_test',
        targetName: 'টেস্ট অ্যাডমিন',
        timestamp: DateTime.now(),
        reason: 'ইউনিট টেস্ট এন্ট্রি',
        result: SecurityEventResult.success,
      );

      await recordUseCase(newRecord);

      final logs = await auditRepo.getAuditLogs(organizationId: 'org_kholama_01');
      expect(logs.first.id, newId);
      expect(logs.first.eventType, SecurityEventType.passwordChanged);
    });

    // Test I: Session Security Repository isolation & retrieval
    test('Test I: SessionSecurityRepository retrieves sessions isolated by organization', () async {
      final sessions = await sessionRepo.getSessions(organizationId: 'org_kholama_01');
      expect(sessions.isNotEmpty, isTrue);
      expect(sessions.every((s) => s.organizationId == 'org_kholama_01'), isTrue);

      final otherOrgSessions = await sessionRepo.getSessions(organizationId: 'other_org');
      expect(otherOrgSessions.isEmpty, isTrue);
    });

    // Test J: TerminateSessionUseCase updates status and records security audit
    test('Test J: TerminateSessionUseCase terminates session and records security audit event', () async {
      final terminateUseCase = TerminateSessionUseCase(sessionRepo);

      // Get an active session to terminate
      final sessions = await sessionRepo.getSessions(organizationId: 'org_kholama_01');
      final activeTarget = sessions.firstWhere((s) => s.isActive && !s.isCurrent);

      final initialAuditCount = (await auditRepo.getAuditLogs(organizationId: 'org_kholama_01')).length;

      final updatedSession = await terminateUseCase(
        organizationId: 'org_kholama_01',
        sessionId: activeTarget.sessionId,
        actorUserId: 'admin_terminator',
        reason: 'সন্দেহজনক কার্যকলাপ পরিলক্ষিত',
      );

      expect(updatedSession.status, SecuritySessionStatus.terminated);
      expect(updatedSession.isTerminated, isTrue);
      expect(updatedSession.terminationReason, 'সন্দেহজনক কার্যকলাপ পরিলক্ষিত');
      expect(updatedSession.terminatedBy, 'admin_terminator');

      // Verify that security audit log was automatically recorded for this session termination
      final updatedAudits = await auditRepo.getAuditLogs(organizationId: 'org_kholama_01');
      expect(updatedAudits.length, greaterThan(initialAuditCount));
      final latestAudit = updatedAudits.first;
      expect(latestAudit.eventType, SecurityEventType.sessionTerminated);
      expect(latestAudit.targetId, activeTarget.sessionId);
      expect(latestAudit.reason, 'সন্দেহজনক কার্যকলাপ পরিলক্ষিত');
    });
  });
}
