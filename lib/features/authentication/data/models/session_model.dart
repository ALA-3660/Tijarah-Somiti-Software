import '../../domain/entities/authenticated_user.dart';
import '../../domain/entities/authentication_session.dart';

/// SessionModel: সিকিউর স্টোরেজে সেশন মেটাডাটা সংরক্ষণ ও পার্সিংয়ের DTO
///
/// পাসওয়ার্ড কখনোই এই মডেলে বা স্টোরেজে অন্তর্ভুক্ত করা যাবে না।
class SessionModel {
  final String accessToken;
  final String refreshToken;
  final DateTime accessTokenExpiresAt;
  final DateTime refreshTokenExpiresAt;
  final String userId;
  final String userCode;
  final String userName;
  final String userEmail;
  final String? userPhone;
  final String organizationId;
  final String organizationName;
  final bool isActive;
  final DateTime authenticatedAt;
  final AuthenticationMethod method;

  const SessionModel({
    required this.accessToken,
    required this.refreshToken,
    required this.accessTokenExpiresAt,
    required this.refreshTokenExpiresAt,
    required this.userId,
    required this.userCode,
    required this.userName,
    required this.userEmail,
    this.userPhone,
    required this.organizationId,
    required this.organizationName,
    required this.isActive,
    required this.authenticatedAt,
    this.method = AuthenticationMethod.password,
  });

  factory SessionModel.fromEntity(AuthenticationSession entity) {
    return SessionModel(
      accessToken: entity.accessToken,
      refreshToken: entity.refreshToken,
      accessTokenExpiresAt: entity.accessTokenExpiresAt,
      refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
      userId: entity.user.id,
      userCode: entity.user.userCode,
      userName: entity.user.name,
      userEmail: entity.user.email,
      userPhone: entity.user.phone,
      organizationId: entity.organizationId,
      organizationName: entity.user.organizationName,
      isActive: entity.user.isActive,
      authenticatedAt: entity.authenticatedAt,
      method: entity.method,
    );
  }

  AuthenticationSession toEntity() {
    return AuthenticationSession(
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt,
      refreshTokenExpiresAt: refreshTokenExpiresAt,
      user: AuthenticatedUser(
        id: userId,
        userCode: userCode,
        name: userName,
        email: userEmail,
        phone: userPhone,
        organizationId: organizationId,
        organizationName: organizationName,
        isActive: isActive,
        createdAt: authenticatedAt,
        updatedAt: authenticatedAt,
      ),
      organizationId: organizationId,
      authenticatedAt: authenticatedAt,
      method: method,
    );
  }

  factory SessionModel.fromJson(Map<String, dynamic> json) {
    return SessionModel(
      accessToken: (json['access_token'] ?? '').toString(),
      refreshToken: (json['refresh_token'] ?? '').toString(),
      accessTokenExpiresAt: DateTime.tryParse(json['access_expires_at'].toString()) ??
          DateTime.now().add(const Duration(hours: 1)),
      refreshTokenExpiresAt: DateTime.tryParse(json['refresh_expires_at'].toString()) ??
          DateTime.now().add(const Duration(days: 30)),
      userId: (json['user_id'] ?? '').toString(),
      userCode: (json['user_code'] ?? 'USR-001').toString(),
      userName: (json['user_name'] ?? 'ব্যবহারকারী').toString(),
      userEmail: (json['user_email'] ?? '').toString(),
      userPhone: json['user_phone']?.toString(),
      organizationId: (json['organization_id'] ?? '').toString(),
      organizationName: (json['organization_name'] ?? 'তিজারাহ সমিতি').toString(),
      isActive: json['is_active'] as bool? ?? true,
      authenticatedAt: DateTime.tryParse(json['authenticated_at'].toString()) ?? DateTime.now(),
      method: AuthenticationMethod.values.firstWhere(
        (m) => m.name == json['method'],
        orElse: () => AuthenticationMethod.password,
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'access_token': accessToken,
      'refresh_token': refreshToken,
      'access_expires_at': accessTokenExpiresAt.toIso8601String(),
      'refresh_expires_at': refreshTokenExpiresAt.toIso8601String(),
      'user_id': userId,
      'user_code': userCode,
      'user_name': userName,
      'user_email': userEmail,
      'user_phone': userPhone,
      'organization_id': organizationId,
      'organization_name': organizationName,
      'is_active': isActive,
      'authenticated_at': authenticatedAt.toIso8601String(),
      'method': method.name,
    };
  }
}
