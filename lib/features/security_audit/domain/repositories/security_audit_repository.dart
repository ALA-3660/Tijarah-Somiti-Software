import '../entities/security_audit_record.dart';
import '../entities/security_event.dart';

/// SecurityAuditRepository: নিরাপত্তা অডিট ডেটা রিপোজিটরি ইন্টারফেস
abstract class SecurityAuditRepository {
  /// নির্দিষ্ট প্রতিষ্ঠানের অডিট লগ সংগ্রহ
  Future<List<SecurityAuditRecord>> getAuditLogs({
    required String organizationId,
    SecurityEventType? eventType,
    SecurityEventResult? result,
    DateTime? startDate,
    DateTime? endDate,
    String? searchQuery,
    String? actorUserId,
  });

  /// নির্দিষ্ট অডিট লগের বিস্তারিত তথ্য
  Future<SecurityAuditRecord?> getAuditDetail(String organizationId, String auditId);

  /// নতুন নিরাপত্তা অডিট রেকর্ড সংযোজন (Immutable Append-Only)
  Future<SecurityAuditRecord> recordAudit(SecurityAuditRecord record);

  /// রিয়েল-টাইম অডিট ইভেন্ট স্ট্রিম
  Stream<SecurityAuditRecord> get auditStream;
}
