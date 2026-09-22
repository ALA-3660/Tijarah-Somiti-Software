import 'package:flutter_test/flutter_test.dart';
import '../../../lib/features/security_audit/domain/entities/security_audit_record.dart';
import '../../../lib/features/security_audit/domain/entities/security_event.dart';
import '../../../lib/features/security_audit/domain/entities/security_session.dart';

void main() {
  group('Prompt 2.5 — Security Audit & Session Security Entity Tests', () {
    // Test A: Security Audit Record entity creation & immutability
    test('Test A: SecurityAuditRecord initializes correctly with all required fields', () {
      final now = DateTime(2025, 5, 20, 14, 30);
      final record = SecurityAuditRecord(
        id: 'SEC-001',
        organizationId: 'org_test_1',
        actorUserId: 'usr_001',
        actorName: 'মাওলানা আব্দুল করিম',
        eventType: SecurityEventType.loginSuccess,
        action: 'সফল লগইন সম্পাদন',
        targetType: 'session',
        targetId: 'sess_123',
        targetName: 'ডিভাইস সেশন',
        timestamp: now,
        ipAddress: '192.168.1.50',
        deviceReference: 'Chrome on MacOS',
        reason: 'সঠিক পাসওয়ার্ড যাচাই',
        result: SecurityEventResult.success,
      );

      expect(record.id, 'SEC-001');
      expect(record.organizationId, 'org_test_1');
      expect(record.actorUserId, 'usr_001');
      expect(record.actorName, 'মাওলানা আব্দুল করিম');
      expect(record.eventType, SecurityEventType.loginSuccess);
      expect(record.result, SecurityEventResult.success);
      expect(record.timestamp, now);
      expect(record.ipAddress, '192.168.1.50');
      expect(record.deviceReference, 'Chrome on MacOS');
    });

    // Test B: Masking test (IP masking, identifier masking, session ID masking)
    test('Test B: Privacy masking handles IP, identifiers and session IDs properly', () {
      // 1. IP masking: retains first two octets, masks the rest
      expect(SecurityAuditRecord.maskIp('192.168.1.102'), '192.168.***.***');
      expect(SecurityAuditRecord.maskIp('10.0.4.15'), '10.0.***.***');
      expect(SecurityAuditRecord.maskIp(null), '***.***.***.***');
      expect(SecurityAuditRecord.maskIp(''), '***.***.***.***');

      // 2. Identifier masking (Mobile & Email)
      // Mobile: 01711000001 -> 017****0001
      expect(SecurityAuditRecord.maskIdentifier('01711000001'), '017****0001');
      // Email: admin@tijarah.org -> a***n@tijarah.org
      expect(SecurityAuditRecord.maskIdentifier('admin@tijarah.org'), 'a***n@tijarah.org');
      expect(SecurityAuditRecord.maskIdentifier('user@domain.com'), 'u***r@domain.com');
      // Short or fallback
      expect(SecurityAuditRecord.maskIdentifier('ab'), 'ab***');

      // 3. Session ID masking
      expect(SecuritySession.maskSessionId('sess_kholama_sec_01'), 'sess_***_sec_01');
      expect(SecuritySession.maskSessionId('sess_admin_desktop_01'), 'sess_***_desktop_01');
      expect(SecuritySession.maskSessionId('short'), '***');
    });

    // Test E: Security Event Types & Results classification
    test('Test E: SecurityEventType and SecurityEventCategory have expected mappings', () {
      // Authentication Category
      expect(SecurityEventType.loginSuccess.category, SecurityEventCategory.authentication);
      expect(SecurityEventType.loginFailed.category, SecurityEventCategory.authentication);
      expect(SecurityEventType.logout.category, SecurityEventCategory.authentication);
      expect(SecurityEventType.tokenRefresh.category, SecurityEventCategory.authentication);

      // Authorization Category
      expect(SecurityEventType.permissionDenied.category, SecurityEventCategory.authorization);
      expect(SecurityEventType.unauthorizedAccessAttempt.category, SecurityEventCategory.authorization);

      // Role & Security Category
      expect(SecurityEventType.roleAssigned.category, SecurityEventCategory.roleAndSecurity);
      expect(SecurityEventType.roleRemoved.category, SecurityEventCategory.roleAndSecurity);
      expect(SecurityEventType.privilegeEscalationBlocked.category, SecurityEventCategory.roleAndSecurity);

      // User Security Category
      expect(SecurityEventType.userSuspended.category, SecurityEventCategory.userSecurity);
      expect(SecurityEventType.userActivated.category, SecurityEventCategory.userSecurity);
      expect(SecurityEventType.userArchived.category, SecurityEventCategory.userSecurity);

      // Session Category
      expect(SecurityEventType.sessionCreated.category, SecurityEventCategory.session);
      expect(SecurityEventType.sessionTerminated.category, SecurityEventCategory.session);
      expect(SecurityEventType.sessionExpired.category, SecurityEventCategory.session);

      // Results have proper Bengali names
      expect(SecurityEventResult.success.banglaName, 'সফল');
      expect(SecurityEventResult.failed.banglaName, 'ব্যর্থ');
      expect(SecurityEventResult.blocked.banglaName, 'অবরুদ্ধ');
      expect(SecurityEventResult.denied.banglaName, 'অননুমোদিত');
    });

    // Test H: Security Session entity creation and active status logic
    test('Test H: SecuritySession accurately tracks active status and properties', () {
      final now = DateTime.now();
      final activeSession = SecuritySession(
        sessionId: 'sess_test_101',
        organizationId: 'org_001',
        userId: 'usr_001',
        userName: 'মাওলানা ওসমান',
        userRoleName: 'সহ-সভাপতি',
        status: SecuritySessionStatus.active,
        createdAt: now.subtract(const Duration(hours: 1)),
        lastActivityAt: now.subtract(const Duration(minutes: 5)),
        expiresAt: now.add(const Duration(hours: 7)),
        ipAddress: '192.168.1.100',
        deviceReference: 'Firefox on Linux',
        isCurrent: true,
      );

      expect(activeSession.isActive, isTrue);
      expect(activeSession.isTerminated, isFalse);
      expect(activeSession.isExpired, isFalse);
      expect(activeSession.maskedIp, '192.168.***.***');
      expect(activeSession.maskedSessionId, 'sess_***_test_101');

      // Terminated session
      final terminated = activeSession.copyWith(
        status: SecuritySessionStatus.terminated,
        terminatedAt: now,
        terminatedBy: 'admin_001',
        terminationReason: 'সন্দেহজনক আইপি শনাক্ত',
      );

      expect(terminated.isActive, isFalse);
      expect(terminated.isTerminated, isTrue);
      expect(terminated.terminationReason, 'সন্দেহজনক আইপি শনাক্ত');
      expect(terminated.terminatedBy, 'admin_001');
    });
  });
}
