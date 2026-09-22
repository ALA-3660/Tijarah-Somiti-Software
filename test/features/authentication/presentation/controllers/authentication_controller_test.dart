import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/features/authentication/presentation/controllers/authentication_controller.dart';
import '../../domain/usecases/authentication_usecases_test.dart';

void main() {
  group('AuthenticationController State Machine Test', () {
    late FakeAuthenticationRepository repository;
    late AuthenticationController controller;

    setUp(() {
      repository = FakeAuthenticationRepository();
      controller = AuthenticationController.withRepository(repository);
    });

    test('Initial state is initial or unauthenticated', () {
      expect(controller.status, AuthenticationStatus.initial);
      expect(controller.isAuthenticated, false);
      expect(controller.currentUser, null);
    });

    test('Login transition to authenticated on success', () async {
      final success = await controller.login(
        identifier: '01812345678',
        password: 'ValidPassword123#',
      );

      expect(success, true);
      expect(controller.status, AuthenticationStatus.authenticated);
      expect(controller.isAuthenticated, true);
      expect(controller.currentUser?.name, 'মাওলানা আব্দুল্লাহ');
      expect(controller.currentSession?.organizationId, 'demo-org-khurushkul');
    });

    test('Login transition to error state on invalid password', () async {
      final success = await controller.login(
        identifier: '01812345678',
        password: 'InvalidPassword',
      );

      expect(success, false);
      expect(controller.status, AuthenticationStatus.error);
      expect(controller.isAuthenticated, false);
      expect(controller.errorMessage, 'ইমেইল/মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।');
    });

    test('Logout transitions to unauthenticated', () async {
      await controller.login(
        identifier: '01812345678',
        password: 'ValidPassword123#',
      );
      expect(controller.isAuthenticated, true);

      await controller.logout();
      expect(controller.status, AuthenticationStatus.unauthenticated);
      expect(controller.isAuthenticated, false);
      expect(controller.currentSession, null);
    });

    test('Failed refresh transitions to sessionExpired state', () async {
      await controller.login(
        identifier: '01812345678',
        password: 'ValidPassword123#',
      );

      repository.shouldFail = true;
      final refreshSuccess = await controller.refreshToken();

      expect(refreshSuccess, false);
      expect(controller.status, AuthenticationStatus.sessionExpired);
      expect(controller.isSessionExpired, true);
      expect(controller.errorMessage, 'আপনার সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।');
    });
  });
}
