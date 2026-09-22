import '../../domain/entities/authenticated_user.dart';
import '../../domain/entities/authentication_session.dart';

/// AuthenticationResponseModel: লগইন ও টোকেন রিফ্রেশ রেসপন্স DTO
class AuthenticationResponseModel {
  final String accessToken;
  final String refreshToken;
  final DateTime accessTokenExpiresAt;
  final DateTime refreshTokenExpiresAt;
  final AuthenticatedUser user;
  final String organizationId;
  final String organizationName;

  const AuthenticationResponseModel({
    required this.accessToken,
    required this.refreshToken,
    required this.accessTokenExpiresAt,
    required this.refreshTokenExpiresAt,
    required this.user,
    required this.organizationId,
    required this.organizationName,
  });

  factory AuthenticationResponseModel.fromJson(Map<String, dynamic> json) {
    final now = DateTime.now();

    // টোকেন এক্সট্র্যাকশন (access / token / accessToken)
    final access = json['access'] ?? json['access_token'] ?? json['token'] ?? '';
    final refresh = json['refresh'] ?? json['refresh_token'] ?? '';

    // মেয়াদ উত্তীর্ণের সময় নির্ধারণ (যদি ব্যাকএন্ড দেয়, নাহলে স্ট্যান্ডার্ড ডিফল্ট)
    DateTime accessExpires;
    if (json['access_expires_at'] != null) {
      accessExpires = DateTime.tryParse(json['access_expires_at'].toString()) ??
          now.add(const Duration(minutes: 60));
    } else if (json['expires_in'] != null) {
      final seconds = int.tryParse(json['expires_in'].toString()) ?? 3600;
      accessExpires = now.add(Duration(seconds: seconds));
    } else {
      accessExpires = now.add(const Duration(hours: 1)); // ডিফল্ট ১ ঘণ্টা
    }

    DateTime refreshExpires;
    if (json['refresh_expires_at'] != null) {
      refreshExpires = DateTime.tryParse(json['refresh_expires_at'].toString()) ??
          now.add(const Duration(days: 30));
    } else {
      refreshExpires = now.add(const Duration(days: 30)); // ডিফল্ট ৩০ দিন
    }

    // ইউজার ও অর্গানাইজেশন ইনফরমেশন পার্সিং
    final userData = json['user'] as Map<String, dynamic>? ?? {};
    final orgData = json['organization'] as Map<String, dynamic>? ?? {};

    final orgId = json['organization_id'] ??
        orgData['id'] ??
        userData['organization_id'] ??
        userData['organizationId'] ??
        '';

    final orgName = json['organization_name'] ??
        orgData['name'] ??
        userData['organization_name'] ??
        userData['organizationName'] ??
        'তিজারাহ সমিতি';

    final authenticatedUser = AuthenticatedUser(
      id: (userData['id'] ?? json['user_id'] ?? '').toString(),
      userCode: (userData['user_code'] ?? userData['code'] ?? 'USR-001').toString(),
      name: (userData['name'] ?? userData['full_name'] ?? 'ব্যবহারকারী').toString(),
      email: (userData['email'] ?? '').toString(),
      phone: userData['phone']?.toString(),
      organizationId: orgId.toString(),
      organizationName: orgName.toString(),
      isActive: userData['is_active'] as bool? ?? true,
      createdAt: userData['created_at'] != null
          ? DateTime.tryParse(userData['created_at'].toString()) ?? now
          : now,
      updatedAt: userData['updated_at'] != null
          ? DateTime.tryParse(userData['updated_at'].toString()) ?? now
          : now,
      metadata: userData['metadata'] as Map<String, dynamic>?,
    );

    return AuthenticationResponseModel(
      accessToken: access.toString(),
      refreshToken: refresh.toString(),
      accessTokenExpiresAt: accessExpires,
      refreshTokenExpiresAt: refreshExpires,
      user: authenticatedUser,
      organizationId: orgId.toString(),
      organizationName: orgName.toString(),
    );
  }

  /// ডোমেইন সেশন এন্টিটিতে রূপান্তর
  AuthenticationSession toEntity({AuthenticationMethod method = AuthenticationMethod.password}) {
    return AuthenticationSession(
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt,
      refreshTokenExpiresAt: refreshTokenExpiresAt,
      user: user,
      organizationId: organizationId,
      authenticatedAt: DateTime.now(),
      method: method,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'access': accessToken,
      'refresh': refreshToken,
      'access_expires_at': accessTokenExpiresAt.toIso8601String(),
      'refresh_expires_at': refreshTokenExpiresAt.toIso8601String(),
      'organization_id': organizationId,
      'organization_name': organizationName,
      'user': {
        'id': user.id,
        'user_code': user.userCode,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'organization_id': user.organizationId,
        'organization_name': user.organizationName,
        'is_active': user.isActive,
        'created_at': user.createdAt.toIso8601String(),
        'updated_at': user.updatedAt.toIso8601String(),
        'metadata': user.metadata,
      },
    };
  }
}
