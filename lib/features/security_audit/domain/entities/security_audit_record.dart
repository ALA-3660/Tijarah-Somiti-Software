import 'security_event.dart';

/// SecurityAuditRecord: ঐতিহাসিক অপরিবর্তনীয় নিরাপত্তা অডিট ট্রেইল সত্ত্বা
///
/// নীতি:
/// ১. কোনো পাসওয়ার্ড, হ্যাশ, সেশন সিক্রেট বা অ্যাক্সেস/রিফ্রেশ টোকেন এখানে সংরক্ষণ নিষিদ্ধ।
/// ২. অডিট রেকর্ড ডিলিট বা এডিট করা সম্পূর্ণ নিষিদ্ধ (Immutable Historical Truth)।
/// ৩. মাল্টি-টেন্যান্ট সুরক্ষায় `organizationId` বাধ্যতামূলক।
class SecurityAuditRecord {
  final String id;
  final String organizationId;
  final String actorUserId;
  final String actorName;
  final SecurityEventType eventType;
  final String action;
  final String targetType;
  final String? targetId;
  final String? targetName;
  final DateTime timestamp;
  final String? ipAddress;
  final String? deviceReference;
  final Map<String, dynamic>? previousState;
  final Map<String, dynamic>? newState;
  final String? reason;
  final SecurityEventResult result;
  final Map<String, dynamic>? metadata;

  const SecurityAuditRecord({
    required this.id,
    required this.organizationId,
    required this.actorUserId,
    required this.actorName,
    required this.eventType,
    required this.action,
    required this.targetType,
    this.targetId,
    this.targetName,
    required this.timestamp,
    this.ipAddress,
    this.deviceReference,
    this.previousState,
    this.newState,
    this.reason,
    required this.result,
    this.metadata,
  });

  /// সংবেদনশীল ডেটা মাস্কিং সহায়তা
  static String maskIdentifier(String? value) {
    if (value == null || value.isEmpty) return '***';
    if (value.contains('@')) {
      final parts = value.split('@');
      final name = parts[0];
      final domain = parts.length > 1 ? parts[1] : '';
      if (name.length <= 2) return '$name***@$domain';
      return '${name.substring(0, 2)}***@$domain';
    }
    if (value.length >= 7) {
      return '${value.substring(0, 3)}***${value.substring(value.length - 2)}';
    }
    return '${value.substring(0, 1)}***';
  }

  /// আইপি অ্যাড্রেস মাস্কিং
  static String maskIp(String? ip) {
    if (ip == null || ip.isEmpty) return '***.***.***.***';
    final parts = ip.split('.');
    if (parts.length == 4) {
      return '${parts[0]}.${parts[1]}.***.***';
    }
    return 'IP-***';
  }

  /// সেশন আইডি মাস্কিং
  static String maskSessionId(String? sessionId) {
    if (sessionId == null || sessionId.isEmpty) return 'SESS-***';
    if (sessionId.length > 8) {
      return '${sessionId.substring(0, 4)}-****-${sessionId.substring(sessionId.length - 2)}';
    }
    return 'SESS-****';
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_id': organizationId,
      'actor_user_id': actorUserId,
      'actor_name': actorName,
      'event_type': eventType.key,
      'action': action,
      'target_type': targetType,
      'target_id': targetId,
      'target_name': targetName,
      'timestamp': timestamp.toIso8601String(),
      'ip_address': ipAddress,
      'device_reference': deviceReference,
      'previous_state': previousState,
      'new_state': newState,
      'reason': reason,
      'result': result.key,
      'metadata': metadata,
    };
  }

  factory SecurityAuditRecord.fromJson(Map<String, dynamic> json) {
    return SecurityAuditRecord(
      id: json['id'] as String? ?? '',
      organizationId: json['organization_id'] as String? ?? '',
      actorUserId: json['actor_user_id'] as String? ?? 'SYSTEM',
      actorName: json['actor_name'] as String? ?? 'সিস্টেম',
      eventType: SecurityEventType.fromKey(json['event_type'] as String?),
      action: json['action'] as String? ?? '',
      targetType: json['target_type'] as String? ?? 'user',
      targetId: json['target_id'] as String?,
      targetName: json['target_name'] as String?,
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'].toString()) ?? DateTime.now()
          : DateTime.now(),
      ipAddress: json['ip_address'] as String?,
      deviceReference: json['device_reference'] as String?,
      previousState: json['previous_state'] as Map<String, dynamic>?,
      newState: json['new_state'] as Map<String, dynamic>?,
      reason: json['reason'] as String?,
      result: SecurityEventResult.fromKey(json['result'] as String?),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }
}
