import '../../domain/entities/authentication_session.dart';

/// LoginRequestModel: লগইন রিকোয়েস্ট DTO
class LoginRequestModel {
  final String identifier;
  final String password;
  final bool rememberMe;
  final AuthenticationMethod method;

  const LoginRequestModel({
    required this.identifier,
    required this.password,
    this.rememberMe = true,
    this.method = AuthenticationMethod.password,
  });

  /// ইনপুটটি ইমেইল নাকি ফোন নম্বর তা শনাক্ত করে
  bool get isEmail => identifier.contains('@');

  Map<String, dynamic> toJson() {
    return {
      'identifier': identifier,
      if (isEmail) 'email': identifier,
      if (!isEmail) 'phone': identifier,
      'password': password,
      'remember_me': rememberMe,
      'method': method.name,
    };
  }

  @override
  String toString() {
    // পাসওয়ার্ড কখনোই স্ট্রিং বা লগে অন্তর্ভুক্ত করা যাবে না
    return 'LoginRequestModel(identifier: $identifier, rememberMe: $rememberMe, method: ${method.name}, password: [PROTECTED])';
  }
}
