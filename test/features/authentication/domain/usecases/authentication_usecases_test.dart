import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/core/errors/failures.dart';
import '../../../../lib/core/result/result.dart';
import '../../../../lib/features/authentication/domain/entities/authenticated_user.dart';
import '../../../../lib/features/authentication/domain/entities/authentication_session.dart';
import '../../../../lib/features/authentication/domain/repositories/authentication_repository.dart';
import '../../../../lib/features/authentication/domain/usecases/login_use_case.dart';
import '../../../../lib/features/authentication/domain/usecases/logout_use_case.dart';
import '../../../../lib/features/authentication/domain/usecases/refresh_session_use_case.dart';
import '../../../../lib/features/authentication/domain/usecases/restore_session_use_case.dart';

class FakeAuthenticationRepository implements AuthenticationRepository {
  AuthenticationSession? currentSession;
  bool shouldFail = false;

  final AuthenticatedUser _testUser = const AuthenticatedUser(
    id: 'usr-001',
    userCode: 'ADM-001',
    name: 'মাওলানা আব্দুল্লাহ',
    email: 'admin@khurushkul.org',
    organizationId: 'demo-org-khurushkul',
    organizationName: 'খুরুশকুল ওলামা সমিতি',
    isActive: true,
  );

  @override
  Stream<AuthenticationSession?> get sessionStream => Stream.value(currentSession);

  @override
  Future<Result<AuthenticationSession>> login({
    required String identifier,
    required String password,
    bool rememberMe = true,
    AuthenticationMethod method = AuthenticationMethod.password,
  }) async {
    if (shouldFail || password != 'ValidPassword123#') {
      return const Result.failure(
        ValidationFailure(message: 'ইমেইল/মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।'),
      );
    }

    final session = AuthenticationSession(
      accessToken: 'access_mock_123',
      refreshToken: 'refresh_mock_456',
      accessTokenExpiresAt: DateTime.now().add(const Duration(minutes: 15)),
      refreshTokenExpiresAt: DateTime.now().add(const Duration(days: 30)),
      user: _testUser,
      organizationId: _testUser.organizationId,
      authenticatedAt: DateTime.now(),
      method: method,
    );
    currentSession = session;
    return Result.success(session);
  }

  @override
  Future<Result<void>> logout() async {
    currentSession = null;
    return const Result.success(null);
  }

  @override
  Future<Result<AuthenticationSession>> refreshSession() async {
    if (shouldFail) {
      currentSession = null;
      return const Result.failure(
        UnauthorizedFailure(message: 'টোকেন রিনিউয়াল ব্যর্থ হয়েছে।'),
      );
    }
    final refreshed = currentSession!.copyWith(
      accessToken: 'access_refreshed_789',
      accessTokenExpiresAt: DateTime.now().add(const Duration(minutes: 15)),
    );
    currentSession = refreshed;
    return Result.success(refreshed);
  }

  @override
  Future<Result<AuthenticationSession?>> restoreSession() async {
    return Result.success(currentSession);
  }
}

void main() {
  group('Authentication UseCases Test Suite', () {
    late FakeAuthenticationRepository repository;
    late LoginUseCase loginUseCase;
    late LogoutUseCase logoutUseCase;
    late RefreshSessionUseCase refreshSessionUseCase;
    late RestoreSessionUseCase restoreSessionUseCase;

    setUp(() {
      repository = FakeAuthenticationRepository();
      loginUseCase = LoginUseCase(repository);
      logoutUseCase = LogoutUseCase(repository);
      refreshSessionUseCase = RefreshSessionUseCase(repository);
      restoreSessionUseCase = RestoreSessionUseCase(repository);
    });

    test('LoginUseCase succeeds with valid credentials', () async {
      final result = await loginUseCase(const LoginParams(
        identifier: '01812345678',
        password: 'ValidPassword123#',
        rememberMe: true,
      ));

      expect(result.isSuccess, true);
      result.when(
        success: (session) {
          expect(session.user.id, 'usr-001');
          expect(session.accessToken, 'access_mock_123');
          expect(session.organizationId, 'demo-org-khurushkul');
        },
        failure: (_) => fail('Expected success'),
      );
    });

    test('LoginUseCase fails with invalid credentials', () async {
      final result = await loginUseCase(const LoginParams(
        identifier: '01812345678',
        password: 'WrongPassword',
      ));

      expect(result.isFailure, true);
      result.when(
        success: (_) => fail('Expected failure'),
        failure: (failure) {
          expect(failure.message, 'ইমেইল/মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।');
        },
      );
    });

    test('RefreshSessionUseCase updates session access token', () async {
      // প্রথমে লগইন করা
      await loginUseCase(const LoginParams(
        identifier: '01812345678',
        password: 'ValidPassword123#',
      ));

      final refreshResult = await refreshSessionUseCase();
      expect(refreshResult.isSuccess, true);
      refreshResult.when(
        success: (session) {
          expect(session.accessToken, 'access_refreshed_789');
        },
        failure: (_) => fail('Expected refresh success'),
      );
    });

    test('LogoutUseCase clears active session', () async {
      await loginUseCase(const LoginParams(
        identifier: '01812345678',
        password: 'ValidPassword123#',
      ));
      expect(repository.currentSession, isNotNull);

      final logoutResult = await logoutUseCase();
      expect(logoutResult.isSuccess, true);
      expect(repository.currentSession, isNull);
    });
  });
}
