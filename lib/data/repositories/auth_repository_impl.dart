import '../../../core/errors/app_exception.dart';
import '../../../core/errors/failure.dart';
import '../../../core/result/result.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/local/session_local_datasource.dart';
import '../datasources/remote/auth_remote_datasource.dart';

/// AuthRepositoryImpl: AuthRepository-এর বাস্তবায়ন
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final SessionLocalDataSource _localDataSource;

  AuthRepositoryImpl({
    required AuthRemoteDataSource remoteDataSource,
    required SessionLocalDataSource localDataSource,
  })  : _remoteDataSource = remoteDataSource,
        _localDataSource = localDataSource;

  @override
  Future<Result<User?>> getCurrentUser() async {
    try {
      final token = await _localDataSource.getAuthToken();
      if (token == null || token.isEmpty) {
        return Result.success(null);
      }
      final user = await _remoteDataSource.getUserProfile();
      return Result.success(user);
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      return Result.failure(GeneralFailure(message: e.toString()));
    }
  }

  @override
  Future<bool> isAuthenticated() async {
    final token = await _localDataSource.getAuthToken();
    return token != null && token.isNotEmpty;
  }

  @override
  Future<Result<void>> logout() async {
    try {
      await _remoteDataSource.logout();
    } catch (_) {
      // অফলাইন বা ব্যর্থ হলেও লোকাল সেশন ক্লিয়ার করতে হবে
    } finally {
      await _localDataSource.clearSession();
    }
    return Result.success(null);
  }

  @override
  Future<Result<String>> refreshToken() async {
    try {
      final refresh = await _localDataSource.getRefreshToken();
      if (refresh == null) {
        return const Result.failure(AuthFailure(message: 'রিফ্রেশ টোকেন পাওয়া যায়নি।'));
      }
      final newAccess = await _remoteDataSource.refreshToken(refresh);
      await _localDataSource.saveAuthToken(newAccess);
      return Result.success(newAccess);
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      return Result.failure(GeneralFailure(message: e.toString()));
    }
  }
}
