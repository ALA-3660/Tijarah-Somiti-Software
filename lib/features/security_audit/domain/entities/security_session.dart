/// SecuritySessionStatus: সেশন লাইফসাইকেল স্ট্যাটাস
enum SecuritySessionStatus {
  active('ACTIVE', 'সক্রিয়'),
  expired('EXPIRED', 'মেয়াদোত্তীর্ণ'),
  terminated('TERMINATED', 'সমাপ্ত');

  final String key;
  final String banglaName;

  const SecuritySessionStatus(this.key, this.banglaName);

  static SecuritySessionStatus fromKey(String? key) {
    if (key == null) return SecuritySessionStatus.terminated;
    for (final s in SecuritySessionStatus.values) {
      if (s.key == key) return s;
    }
    return SecuritySessionStatus.terminated;
  }
}

/// SecuritySession: নিরাপদ সেশন সত্ত্বা (কোনো টোকেন বা পাসওয়ার্ড মুক্ত)
class SecuritySession {
  final String sessionId;
  final String organizationId;
  final String userId;
  final String userName;
  final String userRoleName;
  final DateTime createdAt;
  final DateTime lastActivityAt;
  final DateTime expiresAt;
  final SecuritySessionStatus status;
  final String? deviceReference;
  final String? platformReference;
  final String? ipAddress;
  final String? lastKnownLocationReference;
  final DateTime? terminatedAt;
  final String? terminationReason;
  final String? terminatedBy;
  final bool isCurrent;

  const SecuritySession({
    required this.sessionId,
    required this.organizationId,
    required this.userId,
    required this.userName,
    required this.userRoleName,
    required this.createdAt,
    required this.lastActivityAt,
    required this.expiresAt,
    required this.status,
    this.deviceReference,
    this.platformReference,
    this.ipAddress,
    this.lastKnownLocationReference,
    this.terminatedAt,
    this.terminationReason,
    this.terminatedBy,
    this.isCurrent = false,
  });

  /// মাস্কড সেশন আইডি (UI ডিসপ্লে)
  String get maskedSessionId {
    if (sessionId.length > 8) {
      return '${sessionId.substring(0, 4)}-****-${sessionId.substring(sessionId.length - 2)}';
    }
    return 'SESS-****';
  }

  /// মাস্কড আইপি
  String get maskedIp {
    if (ipAddress == null || ipAddress!.isEmpty) return '***.***';
    final parts = ipAddress!.split('.');
    if (parts.length == 4) {
      return '${parts[0]}.${parts[1]}.***.***';
    }
    return 'IP-***';
  }

  bool get isActive => status == SecuritySessionStatus.active;
  bool get isExpired => status == SecuritySessionStatus.expired;
  bool get isTerminated => status == SecuritySessionStatus.terminated;

  SecuritySession copyWith({
    SecuritySessionStatus? status,
    DateTime? terminatedAt,
    String? terminationReason,
    String? terminatedBy,
    DateTime? lastActivityAt,
    bool? isCurrent,
  }) {
    return SecuritySession(
      sessionId: sessionId,
      organizationId: organizationId,
      userId: userId,
      userName: userName,
      userRoleName: userRoleName,
      createdAt: createdAt,
      lastActivityAt: lastActivityAt ?? this.lastActivityAt,
      expiresAt: expiresAt,
      status: status ?? this.status,
      deviceReference: deviceReference,
      platformReference: platformReference,
      ipAddress: ipAddress,
      lastKnownLocationReference: lastKnownLocationReference,
      terminatedAt: terminatedAt ?? this.terminatedAt,
      terminationReason: terminationReason ?? this.terminationReason,
      terminatedBy: terminatedBy ?? this.terminatedBy,
      isCurrent: isCurrent ?? this.isCurrent,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'session_id': sessionId,
      'organization_id': organizationId,
      'user_id': userId,
      'user_name': userName,
      'user_role_name': userRoleName,
      'created_at': createdAt.toIso8601String(),
      'last_activity_at': lastActivityAt.toIso8601String(),
      'expires_at': expiresAt.toIso8601String(),
      'status': status.key,
      'device_reference': deviceReference,
      'platform_reference': platformReference,
      'ip_address': ipAddress,
      'last_known_location_reference': lastKnownLocationReference,
      'terminated_at': terminatedAt?.toIso8601String(),
      'termination_reason': terminationReason,
      'terminated_by': terminatedBy,
      'is_current': isCurrent,
    };
  }

  factory SecuritySession.fromJson(Map<String, dynamic> json) {
    return SecuritySession(
      sessionId: json['session_id'] as String? ?? '',
      organizationId: json['organization_id'] as String? ?? '',
      userId: json['user_id'] as String? ?? '',
      userName: json['user_name'] as String? ?? '',
      userRoleName: json['user_role_name'] as String? ?? '',
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      lastActivityAt: json['last_activity_at'] != null
          ? DateTime.tryParse(json['last_activity_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      expiresAt: json['expires_at'] != null
          ? DateTime.tryParse(json['expires_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      status: SecuritySessionStatus.fromKey(json['status'] as String?),
      deviceReference: json['device_reference'] as String?,
      platformReference: json['platform_reference'] as String?,
      ipAddress: json['ip_address'] as String?,
      lastKnownLocationReference: json['last_known_location_reference'] as String?,
      terminatedAt: json['terminated_at'] != null
          ? DateTime.tryParse(json['terminated_at'].toString())
          : null,
      terminationReason: json['termination_reason'] as String?,
      terminatedBy: json['terminated_by'] as String?,
      isCurrent: json['is_current'] as bool? ?? false,
    );
  }
}
