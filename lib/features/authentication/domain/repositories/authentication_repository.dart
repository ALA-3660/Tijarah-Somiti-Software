import '../../../core/result/result.dart';
import '../entities/authenticated_user.dart';
import '../entities/authentication_session.dart';

/// AuthenticationRepository: অথেনটিকেশন ও সেশনের ডোমেইন ইন্টারফেস
///
/// এটি Clean Architecture অনুযায়ী প্রেজেন্টেশন এবং ডেটা লেয়ারের মাঝে চুক্তি হিসেবে কাজ করে।
abstract class AuthenticationRepository {
  /// ব্যবহারকারী লগইন
  Future<Result<AuthenticationSession>> login({
    required String identifier,
    required String password,
    bool rememberMe = true,
    AuthenticationMethod method = AuthenticationMethod.password,
  });

  /// ব্যবহারকারী লগআউট (সার্ভার ও স্থানীয় সেশন ক্লিয়ার)
  Future<Result<void>> logout();

  /// সংরক্ষিত সিকিউর সেশন পুনরুদ্ধার
  Future<Result<AuthenticationSession>> restoreSession();

  /// অ্যাক্সেস টোকেন রিফ্রেশ
  Future<Result<AuthenticationSession>> refreshSession();

  /// বর্তমান অথেনটিকেটেড ব্যবহারকারীর প্রোফাইল তথ্য
  Future<Result<AuthenticatedUser>> getCurrentUser();

  /// সেশন পরিবর্তন নোটিফিকেশন স্ট্রিম
  Stream<AuthenticationSession?> get sessionStream;

  /// বর্তমান ক্যাশড সেশন (মেমোরি)
  AuthenticationSession? get currentSession;
}
