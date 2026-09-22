import 'dart:async';
import '../../domain/entities/security_audit_record.dart';
import '../../domain/entities/security_event.dart';
import '../../domain/entities/security_session.dart';
import '../../domain/repositories/security_audit_repository.dart';
import '../../domain/repositories/session_security_repository.dart';
import 'security_audit_repository_impl.dart';

/// SessionSecurityRepositoryImpl: সেন্ট্রালাইজড সেশন সিকিউরিটি রিপোজিটরি
class SessionSecurityRepositoryImpl implements SessionSecurityRepository {
  static final SessionSecurityRepositoryImpl instance = SessionSecurityRepositoryImpl._internal(
    SecurityAuditRepositoryImpl.instance,
  );

  final SecurityAuditRepository _auditRepository;
  final List<SecuritySession> _sessions = [];
  final StreamController<List<SecuritySession>> _sessionStreamController =
      StreamController<List<SecuritySession>>.broadcast();

  SessionSecurityRepositoryImpl._internal(this._auditRepository) {
    _initializeDemoSessions();
  }

  factory SessionSecurityRepositoryImpl.create([SecurityAuditRepository? auditRepo]) {
    return SessionSecurityRepositoryImpl._internal(
      auditRepo ?? SecurityAuditRepositoryImpl.instance,
    );
  }

  @override
  Stream<List<SecuritySession>> get sessionStream => _sessionStreamController.stream;

  void _initializeDemoSessions() {
    const orgId = 'org_kholama_01';
    final now = DateTime.now();

    _sessions.addAll([
      SecuritySession(
        sessionId: 'SESS-8921-01',
        organizationId: orgId,
        userId: 'USR-000001',
        userName: 'মাওলানা আব্দুল্লাহ',
        userRoleName: 'সুপার অ্যাডমিন',
        createdAt: now.subtract(const Duration(minutes: 50)),
        lastActivityAt: now.subtract(const Duration(minutes: 2)),
        expiresAt: now.add(const Duration(hours: 7, minutes: 10)),
        status: SecuritySessionStatus.active,
        deviceReference: 'Chrome 124 / Windows 11',
        platformReference: 'Web Desktop',
        ipAddress: '192.168.1.102',
        lastKnownLocationReference: 'কক্সবাজার সদর, বাংলাদেশ',
        isCurrent: true,
      ),
      SecuritySession(
        sessionId: 'SESS-8921-02',
        organizationId: orgId,
        userId: 'USR-000002',
        userName: 'ক্বারী নূরুল ইসলাম',
        userRoleName: 'অডিটর / নিরীক্ষক',
        createdAt: now.subtract(const Duration(hours: 2)),
        lastActivityAt: now.subtract(const Duration(minutes: 15)),
        expiresAt: now.add(const Duration(hours: 6)),
        status: SecuritySessionStatus.active,
        deviceReference: 'Tijarah Mobile App / Android 14',
        platformReference: 'Android Mobile',
        ipAddress: '192.168.1.115',
        lastKnownLocationReference: 'খুরুশকুল, কক্সবাজার',
        isCurrent: false,
      ),
      SecuritySession(
        sessionId: 'SESS-8921-03',
        organizationId: orgId,
        userId: 'USR-000003',
        userName: 'মাওলানা মুফতি ইব্রাহিম',
        userRoleName: 'কোষাধ্যক্ষ',
        createdAt: now.subtract(const Duration(hours: 4)),
        lastActivityAt: now.subtract(const Duration(hours: 1)),
        expiresAt: now.add(const Duration(hours: 4)),
        status: SecuritySessionStatus.active,
        deviceReference: 'Safari / macOS Sonoma',
        platformReference: 'Web Desktop',
        ipAddress: '192.168.1.140',
        lastKnownLocationReference: 'কক্সবাজার সদর, বাংলাদেশ',
        isCurrent: false,
      ),
      SecuritySession(
        sessionId: 'SESS-8921-04',
        organizationId: orgId,
        userId: 'USR-000004',
        userName: 'হাফেজ কায়সার মাহমুদ',
        userRoleName: 'সাধারণ সদস্য',
        createdAt: now.subtract(const Duration(days: 1, hours: 2)),
        lastActivityAt: now.subtract(const Duration(hours: 20)),
        expiresAt: now.subtract(const Duration(hours: 16)),
        status: SecuritySessionStatus.expired,
        deviceReference: 'Chrome / Android Mobile',
        platformReference: 'Android Mobile',
        ipAddress: '103.145.22.88',
        lastKnownLocationReference: 'রামু, কক্সবাজার',
        isCurrent: false,
      ),
      SecuritySession(
        sessionId: 'SESS-8921-05',
        organizationId: orgId,
        userId: 'USR-000005',
        userName: 'মাওলানা আব্দুর রহমান',
        userRoleName: 'আদায়কারী',
        createdAt: now.subtract(const Duration(days: 2)),
        lastActivityAt: now.subtract(const Duration(days: 1, hours: 22)),
        expiresAt: now.subtract(const Duration(days: 1, hours: 16)),
        status: SecuritySessionStatus.terminated,
        deviceReference: 'Firefox / Windows 10',
        platformReference: 'Web Desktop',
        ipAddress: '103.145.22.99',
        lastKnownLocationReference: 'চকরিয়া, কক্সবাজার',
        terminatedAt: now.subtract(const Duration(days: 1, hours: 22)),
        terminationReason: 'ডিভাইস পরিবর্তনের কারণে রিমোটলি সেশন সমাপ্তকরণ',
        terminatedBy: 'USR-000001 (সুপার অ্যাডমিন)',
        isCurrent: false,
      ),
    ]);
  }

  @override
  Future<List<SecuritySession>> getSessions(String organizationId) async {
    await Future.delayed(const Duration(milliseconds: 50));
    // Multi-tenant Scoping: শুধু বর্তমান অর্গানাইজেশনের সেশনসমূহ
    final list = _sessions.where((s) => s.organizationId == organizationId).toList();
    // সক্রিয় সেশন প্রথমে, পরে সর্বশেষ কার্যক্রম অনুযায়ী
    list.sort((a, b) {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return b.lastActivityAt.compareTo(a.lastActivityAt);
    });
    return List.unmodifiable(list);
  }

  @override
  Future<SecuritySession?> getCurrentSession(String organizationId, String userId) async {
    await Future.delayed(const Duration(milliseconds: 20));
    return _sessions.cast<SecuritySession?>().firstWhere(
          (s) => s?.organizationId == organizationId && s?.userId == userId && s?.isActive == true,
          orElse: () => null,
        );
  }

  @override
  Future<SecuritySession> terminateSession({
    required String organizationId,
    required String sessionId,
    required String actorUserId,
    required String reason,
  }) async {
    await Future.delayed(const Duration(milliseconds: 60));

    final index = _sessions.indexWhere(
      (s) => s.organizationId == organizationId && s.sessionId == sessionId,
    );

    if (index == -1) {
      throw ArgumentError('Session not found in the specified organization.');
    }

    final targetSession = _sessions[index];

    // সমাপ্ত সেশন তৈরি
    final terminated = targetSession.copyWith(
      status: SecuritySessionStatus.terminated,
      terminatedAt: DateTime.now(),
      terminationReason: reason,
      terminatedBy: actorUserId,
      isCurrent: false,
    );

    _sessions[index] = terminated;

    // নিরাপত্তা অডিট ইভেন্ট তৈরি ও সংরক্ষণ (SESSION_TERMINATED)
    await _auditRepository.recordAudit(
      SecurityAuditRecord(
        id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
        organizationId: organizationId,
        actorUserId: actorUserId,
        actorName: actorUserId == 'USR-000001' ? 'মাওলানা আব্দুল্লাহ' : actorUserId,
        eventType: SecurityEventType.sessionTerminated,
        action: 'সেশন দূরবর্তী সমাপ্তকরণ (Remote Session Termination)',
        targetType: 'session',
        targetId: sessionId,
        targetName: 'ব্যবহারকারী: ${targetSession.userName} (${targetSession.deviceReference ?? 'ডিভাইস'})',
        timestamp: DateTime.now(),
        previousState: {'status': targetSession.status.key},
        newState: {'status': SecuritySessionStatus.terminated.key},
        reason: reason,
        result: SecurityEventResult.success,
      ),
    );

    _sessionStreamController.add(List.unmodifiable(_sessions));
    return terminated;
  }

  void dispose() {
    _sessionStreamController.close();
  }
}
