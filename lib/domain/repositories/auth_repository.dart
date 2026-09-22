import '../../core/result/result.dart';
import '../entities/user.dart';

/// AuthRepository: অথেনটিকেশন ও সেশনের ডোমেইন ইন্টারফেস
abstract class AuthRepository {
  /// বর্তমান লগইনকৃত ইউজার পাওয়ার মেথড
  Future<Result<User?>> getCurrentUser();

  /// ইউজার কি লগইন অবস্থায় আছে?
  Future<bool> isAuthenticated();

  /// লগআউট করার মেথড
  Future<Result<void>> logout();

  /// টোকেন রিফ্রেশ করার মেথড
  Future<Result<String>> refreshToken();
}
