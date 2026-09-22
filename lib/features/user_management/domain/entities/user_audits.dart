import '../../../../domain/entities/user_status.dart';

/// UserRoleAuditAction: রোল অ্যাসাইনমেন্ট পরিবর্তনের ধরণ
class UserRoleAuditAction {
  static const String roleAssigned = 'ROLE_ASSIGNED';
  static const String roleRemoved = 'ROLE_REMOVED';
}

/// UserRoleAuditRecord: ব্যবহারকারীর ভূমিকা পরিবর্তনের অডিট ট্রেইল
class UserRoleAuditRecord {
  final String id;
  final String organizationId;
  final String actorUserId;
  final String actorName;
  final String targetUserId;
  final String targetUserName;
  final String roleId;
  final String roleKey;
  final String roleName;
  final String action; // ROLE_ASSIGNED, ROLE_REMOVED
  final Map<String, dynamic>? previousState;
  final Map<String, dynamic>? newState;
  final String? reason;
  final DateTime timestamp;

  const UserRoleAuditRecord({
    required this.id,
    required this.organizationId,
    required this.actorUserId,
    required this.actorName,
    required this.targetUserId,
    required this.targetUserName,
    required this.roleId,
    required this.roleKey,
    required this.roleName,
    required this.action,
    this.previousState,
    this.newState,
    this.reason,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_id': organizationId,
      'actor_user_id': actorUserId,
      'actor_name': actorName,
      'target_user_id': targetUserId,
      'target_user_name': targetUserName,
      'role_id': roleId,
      'role_key': roleKey,
      'role_name': roleName,
      'action': action,
      'previous_state': previousState,
      'new_state': newState,
      'reason': reason,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory UserRoleAuditRecord.fromJson(Map<String, dynamic> json) {
    return UserRoleAuditRecord(
      id: json['id'] as String? ?? '',
      organizationId: json['organization_id'] as String? ?? '',
      actorUserId: json['actor_user_id'] as String? ?? '',
      actorName: json['actor_name'] as String? ?? '',
      targetUserId: json['target_user_id'] as String? ?? '',
      targetUserName: json['target_user_name'] as String? ?? '',
      roleId: json['role_id'] as String? ?? '',
      roleKey: json['role_key'] as String? ?? '',
      roleName: json['role_name'] as String? ?? '',
      action: json['action'] as String? ?? '',
      previousState: json['previous_state'] as Map<String, dynamic>?,
      newState: json['new_state'] as Map<String, dynamic>?,
      reason: json['reason'] as String?,
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

/// UserStatusAuditRecord: অ্যাকাউন্ট লাইফসাইকেল পরিবর্তনের অডিট ট্রেইল
class UserStatusAuditRecord {
  final String id;
  final String organizationId;
  final String actorUserId;
  final String actorName;
  final String targetUserId;
  final String targetUserName;
  final UserStatus previousStatus;
  final UserStatus newStatus;
  final String? reason;
  final DateTime timestamp;

  const UserStatusAuditRecord({
    required this.id,
    required this.organizationId,
    required this.actorUserId,
    required this.actorName,
    required this.targetUserId,
    required this.targetUserName,
    required this.previousStatus,
    required this.newStatus,
    this.reason,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_id': organizationId,
      'actor_user_id': actorUserId,
      'actor_name': actorName,
      'target_user_id': targetUserId,
      'target_user_name': targetUserName,
      'previous_status': previousStatus.name,
      'new_status': newStatus.name,
      'reason': reason,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory UserStatusAuditRecord.fromJson(Map<String, dynamic> json) {
    return UserStatusAuditRecord(
      id: json['id'] as String? ?? '',
      organizationId: json['organization_id'] as String? ?? '',
      actorUserId: json['actor_user_id'] as String? ?? '',
      actorName: json['actor_name'] as String? ?? '',
      targetUserId: json['target_user_id'] as String? ?? '',
      targetUserName: json['target_user_name'] as String? ?? '',
      previousStatus: UserStatus.fromString(json['previous_status'] as String? ?? 'active'),
      newStatus: UserStatus.fromString(json['new_status'] as String? ?? 'active'),
      reason: json['reason'] as String?,
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}
