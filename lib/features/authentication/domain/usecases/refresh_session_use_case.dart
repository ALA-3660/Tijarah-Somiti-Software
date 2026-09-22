import '../../../core/result/result.dart';
import '../entities/authentication_session.dart';
import '../repositories/authentication_repository.dart';

/// RefreshSessionUseCase: বিদ্যমান রিফ্রেশ টোকেন দিয়ে নতুন অ্যাক্সেস টোকেন আনা
class RefreshSessionUseCase {
  final AuthenticationRepository _repository;

  RefreshSessionUseCase(this._repository);

  Future<Result<AuthenticationSession>> call() {
    return _repository.refreshSession();
  }
}
