import 'member_status.dart';

/// MemberStatusAuditRecord: সদস্য স্ট্যাটাস পরিবর্তনের অপরিবর্তনীয় ট্রেইল
class MemberStatusAuditRecord {
  final String id;
  final String organizationId;
  final String memberId;
  final String memberCode;
  final MemberStatus previousStatus;
  final MemberStatus newStatus;
  final String reason;
  final String changedByUserId;
  final String changedByName;
  final DateTime timestamp;

  const MemberStatusAuditRecord({
    required this.id,
    required this.organizationId,
    required this.memberId,
    required this.memberCode,
    required this.previousStatus,
    required this.newStatus,
    required this.reason,
    required this.changedByUserId,
    required this.changedByName,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_id': organizationId,
      'member_id': memberId,
      'member_code': memberCode,
      'previous_status': previousStatus.key,
      'new_status': newStatus.key,
      'reason': reason,
      'changed_by_user_id': changedByUserId,
      'changed_by_name': changedByName,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory MemberStatusAuditRecord.fromJson(Map<String, dynamic> json) {
    return MemberStatusAuditRecord(
      id: json['id'] as String,
      organizationId: json['organization_id'] as String,
      memberId: json['member_id'] as String,
      memberCode: json['member_code'] as String,
      previousStatus: MemberStatus.fromKey(json['previous_status'] as String?),
      newStatus: MemberStatus.fromKey(json['new_status'] as String?),
      reason: json['reason'] as String? ?? 'স্ট্যাটাস হালনাগাদ',
      changedByUserId: json['changed_by_user_id'] as String? ?? 'system',
      changedByName: json['changed_by_name'] as String? ?? 'অজানা কর্মকর্তা',
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'] as String)
          : DateTime.now(),
    );
  }
}
