import 'dart:async';
import 'package:flutter/foundation.dart';
import '../../../../core/logging/app_logger.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/result/result.dart';
import '../../data/datasources/authentication_remote_data_source.dart';
import '../../data/repositories/authentication_repository_impl.dart';
import '../../domain/entities/authenticated_user.dart';
import '../../domain/entities/authentication_session.dart';
import '../../domain/repositories/authentication_repository.dart';
import '../../domain/usecases/login_use_case.dart';
import '../../domain/usecases/logout_use_case.dart';
import '../../domain/usecases/refresh_session_use_case.dart';
import '../../domain/usecases/restore_session_use_case.dart';
import '../../../security_audit/data/repositories/security_audit_repository_impl.dart';
import '../../../security_audit/domain/entities/security_audit_record.dart';
import '../../../security_audit/domain/entities/security_event.dart';

/// AuthenticationStatus: অথেনটিকেশন ও সেশনের সুনির্দিষ্ট অবস্থা
enum AuthenticationStatus {
  initial,
  restoring,
  unauthenticated,
  authenticating,
  authenticated,
  refreshing,
  sessionExpired,
  loggingOut,
  error,
  offline,
}

/// AuthenticationController: সেন্ট্রালাইজড অথেনটিকেশন স্টেট কন্ট্রোলার
class AuthenticationController extends ChangeNotifier {
  static final AuthenticationController instance = AuthenticationController._internal();

  final AuthenticationRepository _repository;
  final LoginUseCase _loginUseCase;
  final LogoutUseCase _logoutUseCase;
  final RestoreSessionUseCase _restoreSessionUseCase;
  final RefreshSessionUseCase _refreshSessionUseCase;

  AuthenticationStatus _status = AuthenticationStatus.initial;
  AuthenticationSession? _currentSession;
  String? _errorMessage;
  StreamSubscription? _sessionSubscription;

  AuthenticationController._internal()
      : _repository = AuthenticationRepositoryImpl(
          remoteDataSource: AuthenticationRemoteDataSourceImpl(ApiClient()),
        ),
        _loginUseCase = LoginUseCase(
          AuthenticationRepositoryImpl(
            remoteDataSource: AuthenticationRemoteDataSourceImpl(ApiClient()),
          ),
        ),
        _logoutUseCase = LogoutUseCase(
          AuthenticationRepositoryImpl(
            remoteDataSource: AuthenticationRemoteDataSourceImpl(ApiClient()),
          ),
        ),
        _restoreSessionUseCase = RestoreSessionUseCase(
          AuthenticationRepositoryImpl(
            remoteDataSource: AuthenticationRemoteDataSourceImpl(ApiClient()),
          ),
        ),
        _refreshSessionUseCase = RefreshSessionUseCase(
          AuthenticationRepositoryImpl(
            remoteDataSource: AuthenticationRemoteDataSourceImpl(ApiClient()),
          ),
        ) {
    _sessionSubscription = _repository.sessionStream.listen(_onSessionChanged);
    _bindApiClientInterceptors();
  }

  /// DI বা টেস্টের জন্য কাস্টম কনস্ট্রাক্টর
  AuthenticationController.withRepository(this._repository)
      : _loginUseCase = LoginUseCase(_repository),
        _logoutUseCase = LogoutUseCase(_repository),
        _restoreSessionUseCase = RestoreSessionUseCase(_repository),
        _refreshSessionUseCase = RefreshSessionUseCase(_repository) {
    _sessionSubscription = _repository.sessionStream.listen(_onSessionChanged);
    _bindApiClientInterceptors();
  }

  // --- গেটারসমূহ ---
  AuthenticationStatus get status => _status;
  AuthenticationSession? get currentSession => _currentSession;
  AuthenticatedUser? get currentUser => _currentSession?.user;
  String? get errorMessage => _errorMessage;

  bool get isAuthenticated => _status == AuthenticationStatus.authenticated;
  bool get isLoading =>
      _status == AuthenticationStatus.authenticating ||
      _status == AuthenticationStatus.restoring ||
      _status == AuthenticationStatus.refreshing ||
      _status == AuthenticationStatus.loggingOut;
  bool get isSessionExpired => _status == AuthenticationStatus.sessionExpired;

  /// ApiClient-এর সাথে গ্লোবাল টোকেন রিফ্রেশ ও সেশন এক্সপায়ার ইন্টারসেপ্টর সংযুক্ত করা
  void _bindApiClientInterceptors() {
    ApiClient.onRefreshToken = () async {
      final result = await _refreshSessionUseCase();
      return result.when(
        success: (session) => session.accessToken,
        failure: (_) => null,
      );
    };

    ApiClient.onSessionExpired = () {
      _setStatus(
        AuthenticationStatus.sessionExpired,
        message: 'আপনার সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।',
      );
    };
  }

  void _onSessionChanged(AuthenticationSession? session) {
    _currentSession = session;
    if (session != null) {
      _status = AuthenticationStatus.authenticated;
    } else if (_status != AuthenticationStatus.sessionExpired) {
      _status = AuthenticationStatus.unauthenticated;
    }
    notifyListeners();
  }

  /// অ্যাপ চালুর সময় সেশন পুনরুদ্ধার
  Future<void> restoreSession() async {
    _setStatus(AuthenticationStatus.restoring);
    AppLogger.info('Restoring auth session...');

    final result = await _restoreSessionUseCase();
    result.when(
      success: (session) {
        _currentSession = session;
        _setStatus(AuthenticationStatus.authenticated);
      },
      failure: (failure) {
        _currentSession = null;
        _setStatus(AuthenticationStatus.unauthenticated);
      },
    );
  }

  /// লগইন সম্পাদন
  Future<bool> login({
    required String identifier,
    required String password,
    bool rememberMe = true,
    AuthenticationMethod method = AuthenticationMethod.password,
  }) async {
    _setStatus(AuthenticationStatus.authenticating);
    _errorMessage = null;

    final result = await _loginUseCase(LoginParams(
      identifier: identifier,
      password: password,
      rememberMe: rememberMe,
      method: method,
    ));

    return result.when(
      success: (session) {
        _currentSession = session;
        _setStatus(AuthenticationStatus.authenticated);

        // নিরাপত্তা অডিট রেকর্ড (LOGIN_SUCCESS)
        SecurityAuditRepositoryImpl.instance.recordAudit(
          SecurityAuditRecord(
            id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
            organizationId: session.user.organizationId,
            actorUserId: session.user.id,
            actorName: session.user.fullName,
            eventType: SecurityEventType.loginSuccess,
            action: 'সফল লগইন সম্পাদন',
            targetType: 'session',
            targetId: session.sessionId,
            targetName: 'ডিভাইস সেশন',
            timestamp: DateTime.now(),
            ipAddress: session.deviceInfo?.ipAddress ?? '192.168.1.102',
            deviceReference: session.deviceInfo?.deviceName ?? 'Web Browser',
            reason: 'সঠিক পরিচয় ও শংসাপত্র দ্বারা সফল প্রবেশ',
            result: SecurityEventResult.success,
          ),
        );

        return true;
      },
      failure: (failure) {
        _currentSession = null;
        if (failure.message.contains('ইন্টারনেট') || failure.message.contains('offline')) {
          _setStatus(AuthenticationStatus.offline, message: failure.message);
        } else {
          _setStatus(AuthenticationStatus.error, message: failure.message);
        }

        // নিরাপত্তা অডিট রেকর্ড (LOGIN_FAILED) - পাসওয়ার্ড সম্পূর্ণ অনুপস্থিত ও আইডেন্টিফায়ার মাস্কড
        SecurityAuditRepositoryImpl.instance.recordAudit(
          SecurityAuditRecord(
            id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
            organizationId: 'org_kholama_01',
            actorUserId: 'ANONYMOUS',
            actorName: SecurityAuditRecord.maskIdentifier(identifier),
            eventType: SecurityEventType.loginFailed,
            action: 'লগইন ব্যর্থতা (অসঠিক শংসাপত্র)',
            targetType: 'authentication',
            targetId: 'AUTH-FAIL',
            targetName: 'লগইন পেজ',
            timestamp: DateTime.now(),
            reason: failure.message,
            result: SecurityEventResult.failed,
          ),
        );

        return false;
      },
    );
  }

  /// টোকেন রিফ্রেশ
  Future<bool> refreshToken() async {
    _setStatus(AuthenticationStatus.refreshing);
    final result = await _refreshSessionUseCase();

    return result.when(
      success: (session) {
        _currentSession = session;
        _setStatus(AuthenticationStatus.authenticated);

        SecurityAuditRepositoryImpl.instance.recordAudit(
          SecurityAuditRecord(
            id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
            organizationId: session.user.organizationId,
            actorUserId: session.user.id,
            actorName: session.user.fullName,
            eventType: SecurityEventType.tokenRefresh,
            action: 'টোকেন সফলভাবে নবায়ন করা হয়েছে',
            targetType: 'session',
            targetId: session.sessionId,
            targetName: 'সেশন টোকেন',
            timestamp: DateTime.now(),
            result: SecurityEventResult.success,
          ),
        );

        return true;
      },
      failure: (failure) {
        if (_currentSession != null) {
          final sess = _currentSession!;
          SecurityAuditRepositoryImpl.instance.recordAudit(
            SecurityAuditRecord(
              id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
              organizationId: sess.user.organizationId,
              actorUserId: sess.user.id,
              actorName: sess.user.fullName,
              eventType: SecurityEventType.tokenRefreshFailed,
              action: 'টোকেন নবায়ন ব্যর্থ / সেশন সমাপ্ত',
              targetType: 'session',
              targetId: sess.sessionId,
              targetName: 'সেশন টোকেন',
              timestamp: DateTime.now(),
              reason: 'রিফ্রেশ টোকেন অকার্যকর বা মেয়াদোত্তীর্ণ',
              result: SecurityEventResult.failed,
            ),
          );
        }

        _setStatus(
          AuthenticationStatus.sessionExpired,
          message: 'আপনার সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।',
        );
        return false;
      },
    );
  }

  /// লগআউট সম্পাদন
  Future<void> logout() async {
    _setStatus(AuthenticationStatus.loggingOut);

    if (_currentSession != null) {
      final sess = _currentSession!;
      SecurityAuditRepositoryImpl.instance.recordAudit(
        SecurityAuditRecord(
          id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
          organizationId: sess.user.organizationId,
          actorUserId: sess.user.id,
          actorName: sess.user.fullName,
          eventType: SecurityEventType.logout,
          action: 'ব্যবহারকারী লগআউট',
          targetType: 'session',
          targetId: sess.sessionId,
          targetName: 'ডিভাইস সেশন',
          timestamp: DateTime.now(),
          reason: 'ব্যবহারকারী স্বেচ্ছায় লগআউট করেছেন',
          result: SecurityEventResult.success,
        ),
      );
    }

    await _logoutUseCase();
    _currentSession = null;
    _setStatus(AuthenticationStatus.unauthenticated);
  }

  /// এরর মেসেজ ক্লিয়ার
  void clearError() {
    _errorMessage = null;
    if (_status == AuthenticationStatus.error || _status == AuthenticationStatus.offline) {
      _status = AuthenticationStatus.unauthenticated;
    }
    notifyListeners();
  }

  void _setStatus(AuthenticationStatus status, {String? message}) {
    _status = status;
    _errorMessage = message;
    notifyListeners();
  }

  @override
  void dispose() {
    _sessionSubscription?.cancel();
    super.dispose();
  }
}
