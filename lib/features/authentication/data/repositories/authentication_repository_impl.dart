import 'dart:async';
import 'dart:convert';
import '../../../core/context/organization_context.dart';
import '../../../core/demo/demo_organization_config.dart';
import '../../../core/errors/app_exception.dart';
import '../../../core/errors/failure.dart';
import '../../../core/logging/app_logger.dart';
import '../../../core/result/result.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../../../domain/entities/organization.dart';
import '../../domain/entities/authenticated_user.dart';
import '../../domain/entities/authentication_session.dart';
import '../../domain/repositories/authentication_repository.dart';
import '../datasources/authentication_remote_data_source.dart';
import '../models/login_request_model.dart';
import '../models/session_model.dart';

/// AuthenticationRepositoryImpl: অথেনটিকেশন রিপোজিটরির চূড়ান্ত বাস্তবায়ন
///
/// এটি সিকিউর স্টোরেজ, মাল্টি-রিকোয়েস্ট রিফ্রেশ লক এবং OrganizationContext সিঙ্ক্রোনাইজেশন নিশ্চিত করে।
class AuthenticationRepositoryImpl implements AuthenticationRepository {
  final AuthenticationRemoteDataSource _remoteDataSource;
  final SecureStorageService _secureStorage;

  final StreamController<AuthenticationSession?> _sessionController =
      StreamController<AuthenticationSession?>.broadcast();

  AuthenticationSession? _cachedSession;

  // কনকারেন্ট রিফ্রেশ স্টর্ম প্রতিরোধের জন্য সেন্ট্রাল রিফ্রেশ লক
  Completer<AuthenticationSession>? _refreshCompleter;

  AuthenticationRepositoryImpl({
    required AuthenticationRemoteDataSource remoteDataSource,
    SecureStorageService? secureStorage,
  })  : _remoteDataSource = remoteDataSource,
        _secureStorage = secureStorage ?? SecureStorageService();

  @override
  Stream<AuthenticationSession?> get sessionStream => _sessionController.stream;

  @override
  AuthenticationSession? get currentSession => _cachedSession;

  @override
  Future<Result<AuthenticationSession>> login({
    required String identifier,
    required String password,
    bool rememberMe = true,
    AuthenticationMethod method = AuthenticationMethod.password,
  }) async {
    try {
      AppLogger.info('Login attempt started for identifier: ${identifier.split('@').first}***');

      final request = LoginRequestModel(
        identifier: identifier,
        password: password,
        rememberMe: rememberMe,
        method: method,
      );

      final response = await _remoteDataSource.login(request);
      final session = response.toEntity(method: method);

      // অ্যাকাউন্ট নিষ্ক্রিয় থাকলে অনুমোদন দেওয়া যাবে না
      if (!session.user.isActive) {
        return const Result.failure(
          AuthFailure(message: 'এই ব্যবহারকারী অ্যাকাউন্টটি বর্তমানে সক্রিয় নয়।'),
        );
      }

      // ১. টোকেন ও সেশন সিকিউর স্টোরেজে সংরক্ষণ (পাসওয়ার্ড সংরক্ষণ সম্পূর্ণ নিষিদ্ধ)
      await _persistSession(session, rememberMe: rememberMe);

      // ২. মেমোরি স্টেট ও স্ট্রিম আপডেট
      _cachedSession = session;
      _sessionController.add(session);

      // ৩. OrganizationContext সিঙ্ক্রোনাইজেশন
      await _syncOrganizationContext(session);

      AppLogger.info('Login successful for user: ${session.user.id}, org: ${session.organizationId}');
      return Result.success(session);
    } on UnauthorizedException {
      return const Result.failure(
        AuthFailure(message: 'ইমেইল/মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।'),
      );
    } on ValidationException catch (e) {
      return Result.failure(
        ValidationFailure(
          message: e.message.isNotEmpty
              ? e.message
              : 'ইমেইল অথবা পাসওয়ার্ডের ফরম্যাটে ভুল রয়েছে।',
          errors: e.errors,
        ),
      );
    } on NetworkException {
      return const Result.failure(
        NetworkFailure(message: 'ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।'),
      );
    } on ServerException {
      return const Result.failure(
        ServerFailure(message: 'সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।'),
      );
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      AppLogger.error('Unexpected login failure: $e');
      return Result.failure(GeneralFailure(message: 'লগইন করার সময় অপ্রত্যাশিত ত্রুটি ঘটেছে।'));
    }
  }

  @override
  Future<Result<void>> logout() async {
    AppLogger.info('Logout initiated');
    try {
      final refresh = _cachedSession?.refreshToken;
      await _remoteDataSource.logout(refreshToken: refresh);
    } catch (e) {
      AppLogger.warning('Remote logout failed (proceeding with local session cleanup): $e');
    } finally {
      await _clearLocalSession();
    }
    return Result.success(null);
  }

  @override
  Future<Result<AuthenticationSession>> restoreSession() async {
    try {
      AppLogger.info('Attempting to restore session from secure storage');

      final accessToken = await _secureStorage.getAuthToken();
      final refreshToken = await _secureStorage.getRefreshToken();

      if (accessToken == null || refreshToken == null) {
        AppLogger.info('No stored session credentials found');
        return const Result.failure(AuthFailure(message: 'কোনো সংরক্ষিত সেশন পাওয়া যায়নি।'));
      }

      final accessExpiresAt = await _secureStorage.getAccessTokenExpiresAt() ??
          DateTime.now().add(const Duration(minutes: 15));
      final refreshExpiresAt = await _secureStorage.getRefreshTokenExpiresAt() ??
          DateTime.now().add(const Duration(days: 30));

      // যদি রিফ্রেশ টোকেনও মেয়াদোত্তীর্ণ হয়ে যায়, তবে সেশন অবৈধ
      final now = DateTime.now();
      if (now.isAfter(refreshExpiresAt)) {
        AppLogger.warning('Stored refresh token has expired. Clearing session.');
        await _clearLocalSession();
        return const Result.failure(
          AuthFailure(message: 'আপনার সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।'),
        );
      }

      // যদি অ্যাক্সেস টোকেন মেয়াদোত্তীর্ণ হয় কিন্তু রিফ্রেশ টোকেন বৈধ থাকে -> অটো রিফ্রেশ
      if (now.isAfter(accessExpiresAt.subtract(const Duration(seconds: 30)))) {
        AppLogger.info('Access token expired. Refreshing token during session restoration...');
        return refreshSession();
      }

      // সংরক্ষিত ইউজার মেটাডাটা পার্স করা
      final userJsonStr = await _secureStorage.getSessionUserJson();
      AuthenticatedUser user;
      if (userJsonStr != null && userJsonStr.isNotEmpty) {
        try {
          final jsonMap = jsonDecode(userJsonStr) as Map<String, dynamic>;
          final model = SessionModel.fromJson(jsonMap);
          user = model.toEntity().user;
        } catch (_) {
          user = await _fetchFallbackUser(accessToken);
        }
      } else {
        user = await _fetchFallbackUser(accessToken);
      }

      final orgId = await _secureStorage.getCurrentOrganizationId() ?? user.organizationId;

      final session = AuthenticationSession(
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenExpiresAt: accessExpiresAt,
        refreshTokenExpiresAt: refreshExpiresAt,
        user: user,
        organizationId: orgId,
        authenticatedAt: DateTime.now(),
      );

      _cachedSession = session;
      _sessionController.add(session);
      await _syncOrganizationContext(session);

      AppLogger.info('Session restored successfully for user: ${user.id}');
      return Result.success(session);
    } catch (e) {
      AppLogger.error('Failed to restore session: $e');
      await _clearLocalSession();
      return const Result.failure(
        AuthFailure(message: 'সেশন পুনরুদ্ধার ব্যর্থ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।'),
      );
    }
  }

  @override
  Future<Result<AuthenticationSession>> refreshSession() async {
    // রিফ্রেশ স্টর্ম প্রটেকশন: যদি ইতোমধ্যে একটি রিফ্রেশ প্রসেস রানিং থাকে, সেটির ফলাফল শেয়ার করা হবে
    if (_refreshCompleter != null) {
      AppLogger.debug('Refresh in progress. Waiting for active refresh future...');
      try {
        final session = await _refreshCompleter!.future;
        return Result.success(session);
      } catch (e) {
        return const Result.failure(
          AuthFailure(message: 'আপনার সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।'),
        );
      }
    }

    _refreshCompleter = Completer<AuthenticationSession>();

    try {
      final currentRefresh = _cachedSession?.refreshToken ?? await _secureStorage.getRefreshToken();

      if (currentRefresh == null || currentRefresh.isEmpty) {
        throw const UnauthorizedException(message: 'কোনো রিফ্রেশ টোকেন পাওয়া যায়নি।');
      }

      AppLogger.info('Refreshing access token with backend...');
      final response = await _remoteDataSource.refreshToken(currentRefresh);

      final newSession = _cachedSession != null
          ? _cachedSession!.copyWith(
              accessToken: response.accessToken,
              refreshToken: response.refreshToken.isNotEmpty ? response.refreshToken : currentRefresh,
              accessTokenExpiresAt: response.accessTokenExpiresAt,
              refreshTokenExpiresAt: response.refreshTokenExpiresAt,
            )
          : response.toEntity();

      // সিকিউর স্টোরেজে নতুন ক্রেডেনশিয়াল আপডেট
      await _persistSession(newSession, rememberMe: true);

      _cachedSession = newSession;
      _sessionController.add(newSession);
      await _syncOrganizationContext(newSession);

      _refreshCompleter!.complete(newSession);
      return Result.success(newSession);
    } catch (e) {
      AppLogger.error('Token refresh failed: $e');
      if (_refreshCompleter != null && !_refreshCompleter!.isCompleted) {
        _refreshCompleter!.completeError(e);
      }
      await _clearLocalSession();
      return const Result.failure(
        AuthFailure(message: 'আপনার সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।'),
      );
    } finally {
      _refreshCompleter = null;
    }
  }

  @override
  Future<Result<AuthenticatedUser>> getCurrentUser() async {
    if (_cachedSession != null) {
      return Result.success(_cachedSession!.user);
    }
    try {
      final user = await _remoteDataSource.getMe();
      return Result.success(user);
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      return Result.failure(GeneralFailure(message: e.toString()));
    }
  }

  // --- হেল্পার মেথডসমূহ ---

  Future<void> _persistSession(AuthenticationSession session, {required bool rememberMe}) async {
    final sessionModel = SessionModel.fromEntity(session);
    final userJson = jsonEncode(sessionModel.toJson());

    await _secureStorage.saveSession(
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      accessTokenExpiresAt: session.accessTokenExpiresAt,
      refreshTokenExpiresAt: session.refreshTokenExpiresAt,
      organizationId: session.organizationId,
      userJson: userJson,
    );
  }

  Future<void> _syncOrganizationContext(AuthenticationSession session) async {
    try {
      final orgContext = OrganizationContext.instance;

      // যদি বর্তমানে অর্গানাইজেশন কনটেক্সটে বিদ্যমান সমিতিটি এই ইউজারের সমিতির সাথে মিলে
      if (orgContext.currentOrganizationId == session.organizationId &&
          orgContext.currentOrganization != null) {
        return;
      }

      // নতুন সমিতি অবজেক্ট তৈরি বা সিঙ্ক
      final org = Organization(
        id: session.organizationId,
        organizationCode: 'ORG-${session.organizationId.substring(0, 4).toUpperCase()}',
        name: session.user.organizationName,
        shortName: session.user.organizationName,
        organizationType: OrganizationType.society,
        description: 'সদস্য সমিতি (স্বয়ংক্রিয়ভাবে অথেনটিকেটেড সেশন থেকে সিঙ্ক করা হয়েছে)',
        status: OrganizationStatus.active,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      );

      await orgContext.setOrganization(org);
      AppLogger.info('OrganizationContext synchronized with user organization: ${session.organizationId}');
    } catch (e) {
      AppLogger.error('Failed to sync OrganizationContext: $e');
    }
  }

  Future<void> _clearLocalSession() async {
    _cachedSession = null;
    await _secureStorage.clearSession();
    try {
      await OrganizationContext.instance.clearOrganization();
    } catch (_) {}
    _sessionController.add(null);
    AppLogger.info('Local session and organization context cleared');
  }

  Future<AuthenticatedUser> _fetchFallbackUser(String accessToken) async {
    try {
      return await _remoteDataSource.getMe();
    } catch (_) {
      // যদি অফলাইনে থাকে, প্রাথমিক ফলব্যাক ইউজার তথ্য
      return AuthenticatedUser(
        id: 'user_fallback',
        userCode: 'USR-001',
        name: 'সদস্য ব্যবহারকারী',
        email: 'user@tijarah.org',
        organizationId: DemoOrganizationConfig.demoOrgId,
        organizationName: DemoOrganizationConfig.demoOrgName,
        isActive: true,
        createdAt: DateTime(2024, 1, 1),
        updatedAt: DateTime(2024, 1, 1),
      );
    }
  }

  void dispose() {
    _sessionController.close();
  }
}
