import 'authenticated_user.dart';

/// AuthenticationMethod: অথেনটিকেশন মেথড এক্সটেনশন পয়েন্ট
///
/// এই মুহূর্তে শুধুমাত্র `password` মেথড বাস্তবায়িত।
/// ভবিষ্যতে `otp` এবং `twoFactorAuthentication` সাপোর্ট করার জন্য এটি রাখা হয়েছে।
enum AuthenticationMethod {
  password,
  otp,
  twoFactorAuthentication,
}

/// AuthenticationSession: নিরাপদ অথেনটিকেশন সেশন ডোমেইন এন্টিটি
///
/// এতে অ্যাক্সেস ও রিফ্রেশ টোকেন, মেয়াদোত্তীর্ণ হওয়ার সময়সীমা এবং
/// বর্তমান লগইনকৃত ইউজার ও অর্গানাইজেশন মেটাডাটা সংরক্ষিত থাকে।
/// সংবেদনশীল টোকেন স্ট্রিং সরাসরি UI স্তরে দেখানো নিষিদ্ধ।
class AuthenticationSession {
  final String accessToken;
  final String refreshToken;
  final DateTime accessTokenExpiresAt;
  final DateTime refreshTokenExpiresAt;
  final AuthenticatedUser user;
  final String organizationId;
  final DateTime authenticatedAt;
  final AuthenticationMethod method;

  const AuthenticationSession({
    required this.accessToken,
    required this.refreshToken,
    required this.accessTokenExpiresAt,
    required this.refreshTokenExpiresAt,
    required this.user,
    required this.organizationId,
    required this.authenticatedAt,
    this.method = AuthenticationMethod.password,
  });

  /// অ্যাক্সেস টোকেন কি মেয়াদোত্তীর্ণ হয়েছে? (ডিফল্ট ৩০ সেকেন্ড বাফার রাখা হয়)
  bool isAccessTokenExpired({DateTime? now, Duration buffer = const Duration(seconds: 30)}) {
    final referenceTime = now ?? DateTime.now();
    return referenceTime.isAfter(accessTokenExpiresAt.subtract(buffer));
  }

  /// রিফ্রেশ টোকেন কি মেয়াদোত্তীর্ণ হয়েছে?
  bool isRefreshTokenExpired({DateTime? now}) {
    final referenceTime = now ?? DateTime.now();
    return referenceTime.isAfter(refreshTokenExpiresAt);
  }

  /// সেশন কার্যকর ও ব্যবহারযোগ্য কিনা
  bool get isValid => !isRefreshTokenExpired();

  /// কপি উইথ মেথড (যেমন টোকেন রিফ্রেশের পর নতুন অ্যাক্সেস টোকেন আপডেট করতে)
  AuthenticationSession copyWith({
    String? accessToken,
    String? refreshToken,
    DateTime? accessTokenExpiresAt,
    DateTime? refreshTokenExpiresAt,
    AuthenticatedUser? user,
    String? organizationId,
    DateTime? authenticatedAt,
    AuthenticationMethod? method,
  }) {
    return AuthenticationSession(
      accessToken: accessToken ?? this.accessToken,
      refreshToken: refreshToken ?? this.refreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt ?? this.accessTokenExpiresAt,
      refreshTokenExpiresAt: refreshTokenExpiresAt ?? this.refreshTokenExpiresAt,
      user: user ?? this.user,
      organizationId: organizationId ?? this.organizationId,
      authenticatedAt: authenticatedAt ?? this.authenticatedAt,
      method: method ?? this.method,
    );
  }

  @override
  String toString() {
    // সংবেদনশীল টোকেন কখনোই লগে বা স্ট্রিং রিপ্রেজেন্টেশনে প্রকাশ করা যাবে না
    return 'AuthenticationSession('
        'userId: ${user.id}, '
        'orgId: $organizationId, '
        'accessExpiresAt: $accessTokenExpiresAt, '
        'refreshExpiresAt: $refreshTokenExpiresAt, '
        'accessToken: [PROTECTED], '
        'refreshToken: [PROTECTED])';
  }
}
