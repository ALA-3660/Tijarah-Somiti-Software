import '../../../core/result/result.dart';
import '../entities/authentication_session.dart';
import '../repositories/authentication_repository.dart';

/// LoginParams: লগইন প্যারামিটার
class LoginParams {
  final String identifier;
  final String password;
  final bool rememberMe;
  final AuthenticationMethod method;

  const LoginParams({
    required this.identifier,
    required this.password,
    this.rememberMe = true,
    this.method = AuthenticationMethod.password,
  });
}

/// LoginUseCase: ব্যবহারকারীকে সুরক্ষিতভাবে লগইন করানো
class LoginUseCase {
  final AuthenticationRepository _repository;

  LoginUseCase(this._repository);

  Future<Result<AuthenticationSession>> call(LoginParams params) {
    return _repository.login(
      identifier: params.identifier.trim(),
      password: params.password,
      rememberMe: params.rememberMe,
      method: params.method,
    );
  }
}
