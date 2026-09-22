/// RolePermissionAuditRecord: ভূমিকা ও পারমিশন পরিবর্তন অডিট ট্রেইল রেকর্ড
///
/// শরিয়াহ অডিট ও রেগুলেটরি স্বচ্ছতার জন্য রোল বা পারমিশনে যেকোনো পরিবর্তন
/// এই অবজেক্টের মাধ্যমে অডিট-রেডি ফরম্যাটে সংরক্ষণ করা হয়।
class RolePermissionAuditRecord {
  final String id;
  final String organizationId;
  final String actorUserId;
  final String actorName;
  final String targetRoleId;
  final String targetRoleName;
  final String? permissionKey;
  final String action; // 'role_created', 'role_updated', 'permission_granted', 'permission_revoked'
  final DateTime timestamp;
  final Map<String, dynamic>? previousState;
  final Map<String, dynamic>? newState;
  final String? reason;

  const RolePermissionAuditRecord({
    required this.id,
    required this.organizationId,
    required this.actorUserId,
    required this.actorName,
    required this.targetRoleId,
    required this.targetRoleName,
    this.permissionKey,
    required this.action,
    required this.timestamp,
    this.previousState,
    this.newState,
    this.reason,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_id': organizationId,
      'actor_user_id': actorUserId,
      'actor_name': actorName,
      'target_role_id': targetRoleId,
      'target_role_name': targetRoleName,
      'permission_key': permissionKey,
      'action': action,
      'timestamp': timestamp.toIso8601String(),
      'previous_state': previousState,
      'new_state': newState,
      'reason': reason,
    };
  }

  factory RolePermissionAuditRecord.fromJson(Map<String, dynamic> json) {
    return RolePermissionAuditRecord(
      id: json['id'] as String? ?? '',
      organizationId: json['organization_id'] as String? ?? '',
      actorUserId: json['actor_user_id'] as String? ?? '',
      actorName: json['actor_name'] as String? ?? '',
      targetRoleId: json['target_role_id'] as String? ?? '',
      targetRoleName: json['target_role_name'] as String? ?? '',
      permissionKey: json['permission_key'] as String?,
      action: json['action'] as String? ?? '',
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'].toString()) ?? DateTime.now()
          : DateTime.now(),
      previousState: json['previous_state'] as Map<String, dynamic>?,
      newState: json['new_state'] as Map<String, dynamic>?,
      reason: json['reason'] as String?,
    );
  }
}
