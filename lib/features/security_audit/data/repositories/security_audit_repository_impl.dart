import 'dart:async';
import '../../domain/entities/security_audit_record.dart';
import '../../domain/entities/security_event.dart';
import '../../domain/repositories/security_audit_repository.dart';

/// SecurityAuditRepositoryImpl: সেন্ট্রালাইজড ইন-মেমোরি/রিমোট নিরাপত্তা অডিট রিপোজিটরি
///
/// নীতি:
/// ১. Multi-tenant Isolation: শুধুমাত্র সংশ্লিষ্ট `organizationId`-এর রেকর্ড উন্মোচিত হবে।
/// ২. Immutability: কোনো এডিট বা ডিলিট মেথড নেই; সংযোজন কেবলমাত্র অ্যাপেন্ড (Append-Only)।
/// ৩. Privacy: কোনো পাসওয়ার্ড, টোকেন বা সিক্রেট সংরক্ষণ বা প্রদর্শন নিষিদ্ধ।
class SecurityAuditRepositoryImpl implements SecurityAuditRepository {
  static final SecurityAuditRepositoryImpl instance = SecurityAuditRepositoryImpl._internal();

  final List<SecurityAuditRecord> _records = [];
  final StreamController<SecurityAuditRecord> _auditStreamController =
      StreamController<SecurityAuditRecord>.broadcast();

  SecurityAuditRepositoryImpl._internal() {
    _initializeDemoAudits();
  }

  /// টেস্ট বা পৃথক ইন্সট্যান্সের জন্য ফ্যাক্টরি
  factory SecurityAuditRepositoryImpl.create() {
    return SecurityAuditRepositoryImpl._internal();
  }

  @override
  Stream<SecurityAuditRecord> get auditStream => _auditStreamController.stream;

  void _initializeDemoAudits() {
    const orgId = 'org_kholama_01';
    final now = DateTime.now();

    _records.addAll([
      SecurityAuditRecord(
        id: 'SEC-AUD-0001',
        organizationId: orgId,
        actorUserId: 'USR-000001',
        actorName: 'মাওলানা আব্দুল্লাহ',
        eventType: SecurityEventType.loginSuccess,
        action: 'সফল লগইন সম্পাদন',
        targetType: 'session',
        targetId: 'SESS-8921-01',
        targetName: 'ওয়েব ব্রাউজার সেশন',
        timestamp: now.subtract(const Duration(minutes: 50)),
        ipAddress: '192.168.1.102',
        deviceReference: 'Chrome / Windows 11',
        result: SecurityEventResult.success,
        reason: 'সঠিক শংসাপত্র দ্বারা দ্বি-স্তরি যাচাই ছাড়া নিরাপদ প্রবেশ',
      ),
      SecurityAuditRecord(
        id: 'SEC-AUD-0002',
        organizationId: orgId,
        actorUserId: 'USR-000001',
        actorName: 'মাওলানা আব্দুল্লাহ',
        eventType: SecurityEventType.roleAssigned,
        action: 'ভূমিকা অর্পণ',
        targetType: 'user',
        targetId: 'USR-000003',
        targetName: 'মাওলানা মুফতি ইব্রাহিম',
        timestamp: now.subtract(const Duration(minutes: 35)),
        ipAddress: '192.168.1.102',
        deviceReference: 'Chrome / Windows 11',
        previousState: {'role_keys': ['member']},
        newState: {'role_keys': ['member', 'treasurer']},
        reason: 'কার্যনির্বাহী কমিটির সিদ্ধান্ত মোতাবেক কোষাধ্যক্ষ দায়িত্ব অর্পণ',
        result: SecurityEventResult.success,
      ),
      SecurityAuditRecord(
        id: 'SEC-AUD-0003',
        organizationId: orgId,
        actorUserId: 'ANONYMOUS',
        actorName: '01819***890',
        eventType: SecurityEventType.loginFailed,
        action: 'লগইন ব্যর্থতা (অসঠিক পাসওয়ার্ড)',
        targetType: 'authentication',
        targetId: 'AUTH-FAIL-01',
        targetName: 'লগইন পেজ',
        timestamp: now.subtract(const Duration(minutes: 25)),
        ipAddress: '103.145.22.45',
        deviceReference: 'Firefox / Linux',
        reason: 'ভুল ক্রেডেনশিয়াল প্রদান করা হয়েছে (পাসওয়ার্ড কোনো অবস্থাতেই লগে নেই)',
        result: SecurityEventResult.failed,
      ),
      SecurityAuditRecord(
        id: 'SEC-AUD-0004',
        organizationId: orgId,
        actorUserId: 'USR-000002',
        actorName: 'ক্বারী নূরুল ইসলাম',
        eventType: SecurityEventType.privilegeEscalationBlocked,
        action: 'অননুমোদিত সেলফ-রোল বৃদ্ধির চেষ্টা',
        targetType: 'role',
        targetId: 'super_admin',
        targetName: 'সুপার অ্যাডমিন',
        timestamp: now.subtract(const Duration(minutes: 18)),
        ipAddress: '192.168.1.115',
        deviceReference: 'Android App / Mobile',
        reason: 'নিজের অ্যাকাউন্টে সুপার অ্যাডমিন রোল যুক্ত করার চেষ্টা রিপোজিটরি দ্বারা অবরুদ্ধ করা হয়েছে',
        result: SecurityEventResult.blocked,
      ),
      SecurityAuditRecord(
        id: 'SEC-AUD-0005',
        organizationId: orgId,
        actorUserId: 'USR-000002',
        actorName: 'ক্বারী নূরুল ইসলাম',
        eventType: SecurityEventType.accessDenied,
        action: 'রুট এক্সেস অস্বীকৃত (৪০৩)',
        targetType: 'route',
        targetId: '/organization-security/roles',
        targetName: 'ভূমিকা ও পারমিশন পেজ',
        timestamp: now.subtract(const Duration(minutes: 15)),
        ipAddress: '192.168.1.115',
        deviceReference: 'Android App / Mobile',
        reason: 'security.role.manage পারমিশন অনুপস্থিত থাকায় এক্সেস ডিনাইড হয়েছে',
        result: SecurityEventResult.denied,
      ),
      SecurityAuditRecord(
        id: 'SEC-AUD-0006',
        organizationId: orgId,
        actorUserId: 'USR-000001',
        actorName: 'মাওলানা আব্দুল্লাহ',
        eventType: SecurityEventType.userActivated,
        action: 'ব্যবহারকারী সক্রিয়করণ',
        targetType: 'user',
        targetId: 'USR-000004',
        targetName: 'হাফেজ কায়সার মাহমুদ',
        timestamp: now.subtract(const Duration(minutes: 8)),
        ipAddress: '192.168.1.102',
        deviceReference: 'Chrome / Windows 11',
        previousState: {'status': 'inactive'},
        newState: {'status': 'active'},
        reason: 'মোবাইল নম্বর ও পরিচিতি ভেরিফিকেশন সম্পন্ন হওয়ায় অ্যাকাউন্ট সচল করা হলো',
        result: SecurityEventResult.success,
      ),
    ]);
  }

  @override
  Future<List<SecurityAuditRecord>> getAuditLogs({
    required String organizationId,
    SecurityEventType? eventType,
    SecurityEventResult? result,
    DateTime? startDate,
    DateTime? endDate,
    String? searchQuery,
    String? actorUserId,
  }) async {
    // সিমুলেটেড লেটেন্সি
    await Future.delayed(const Duration(milliseconds: 60));

    // Multi-tenant Scoping: শুধু বর্তমান অর্গানাইজেশনের ডেটা
    var filtered = _records.where((r) => r.organizationId == organizationId).toList();

    // ১. ইভেন্ট টাইপ ফিল্টার
    if (eventType != null) {
      filtered = filtered.where((r) => r.eventType == eventType).toList();
    }

    // ২. রেজাল্ট ফিল্টার
    if (result != null) {
      filtered = filtered.where((r) => r.result == result).toList();
    }

    // ৩. নির্দিষ্ট অ্যাক্টর
    if (actorUserId != null && actorUserId.isNotEmpty) {
      filtered = filtered.where((r) => r.actorUserId == actorUserId).toList();
    }

    // ৪. তারিখ রেঞ্জ ফিল্টার
    if (startDate != null) {
      filtered = filtered.where((r) => r.timestamp.isAfter(startDate) || r.timestamp.isAtSameMomentAs(startDate)).toList();
    }
    if (endDate != null) {
      final inclusiveEnd = DateTime(endDate.year, endDate.month, endDate.day, 23, 59, 59);
      filtered = filtered.where((r) => r.timestamp.isBefore(inclusiveEnd)).toList();
    }

    // ৫. সার্চ কুয়েরি
    if (searchQuery != null && searchQuery.trim().isNotEmpty) {
      final q = searchQuery.trim().toLowerCase();
      filtered = filtered.where((r) {
        final actor = r.actorName.toLowerCase();
        final actorId = r.actorUserId.toLowerCase();
        final action = r.action.toLowerCase();
        final target = (r.targetName ?? '').toLowerCase();
        final targetId = (r.targetId ?? '').toLowerCase();
        final eventBangla = r.eventType.banglaName.toLowerCase();
        final reason = (r.reason ?? '').toLowerCase();

        return actor.contains(q) ||
            actorId.contains(q) ||
            action.contains(q) ||
            target.contains(q) ||
            targetId.contains(q) ||
            eventBangla.contains(q) ||
            reason.contains(q);
      }).toList();
    }

    // টাইমস্ট্যাম্প অনুযায়ী সর্বশেষটি উপরে (Descending)
    filtered.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return List.unmodifiable(filtered);
  }

  @override
  Future<SecurityAuditRecord?> getAuditDetail(String organizationId, String auditId) async {
    await Future.delayed(const Duration(milliseconds: 30));
    final record = _records.cast<SecurityAuditRecord?>().firstWhere(
          (r) => r?.organizationId == organizationId && r?.id == auditId,
          orElse: () => null,
        );
    return record;
  }

  @override
  Future<SecurityAuditRecord> recordAudit(SecurityAuditRecord record) async {
    // নিরাপত্তা নিশ্চয়তা: পাসওয়ার্ড বা টোকেন সরাসরি ব্লকিং
    if (record.previousState?.containsKey('password') == true ||
        record.newState?.containsKey('password') == true ||
        record.metadata?.containsKey('password') == true ||
        record.metadata?.containsKey('token') == true) {
      throw ArgumentError('Security audit records cannot contain passwords or raw secret tokens.');
    }

    _records.add(record);
    _auditStreamController.add(record);
    return record;
  }

  /// অডিট পরিবর্তন প্রতিরোধ (Immutability Assertion)
  void preventMutation() {
    throw UnsupportedError('Security audit records are immutable and cannot be edited or deleted.');
  }

  void dispose() {
    _auditStreamController.close();
  }
}
