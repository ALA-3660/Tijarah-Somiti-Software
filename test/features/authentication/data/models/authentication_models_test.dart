import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/features/authentication/data/models/authentication_response_model.dart';
import '../../../../lib/features/authentication/data/models/login_request_model.dart';
import '../../../../lib/features/authentication/data/models/session_model.dart';
import '../../../../lib/features/authentication/domain/entities/authentication_session.dart';

void main() {
  group('Authentication Models Serialization Test', () {
    test('LoginRequestModel toJson serializes accurately', () {
      const model = LoginRequestModel(
        identifier: '01812345678',
        password: 'Password123#',
        rememberMe: true,
        method: AuthenticationMethod.password,
      );

      final json = model.toJson();

      expect(json['identifier'], '01812345678');
      expect(json['password'], 'Password123#');
      expect(json['remember_me'], true);
      expect(json['method'], 'password');
    });

    test('AuthenticationResponseModel fromJson parses backend response', () {
      final json = {
        'access': 'access_token_123',
        'refresh': 'refresh_token_456',
        'access_expires_at': '2026-09-22T10:15:00.000Z',
        'refresh_expires_at': '2026-10-22T10:00:00.000Z',
        'user': {
          'id': 'usr-001',
          'user_code': 'ADM-001',
          'name': 'মাওলানা আব্দুল্লাহ',
          'email': 'admin@khurushkul-samity.org',
          'phone': '01812345678',
          'organization_id': 'demo-org-khurushkul',
          'organization_name': 'খুরুশকুল ওলামা সমিতি',
          'is_active': true,
          'created_at': '2024-01-01T00:00:00.000Z',
          'updated_at': '2026-09-22T00:00:00.000Z',
        },
      };

      final response = AuthenticationResponseModel.fromJson(json);

      expect(response.accessToken, 'access_token_123');
      expect(response.refreshToken, 'refresh_token_456');
      expect(response.user.id, 'usr-001');
      expect(response.user.name, 'মাওলানা আব্দুল্লাহ');
      expect(response.user.organizationId, 'demo-org-khurushkul');
      expect(response.user.isActive, true);
    });

    test('SessionModel conversion to domain AuthenticationSession', () {
      final json = {
        'access': 'access_token_abc',
        'refresh': 'refresh_token_xyz',
        'access_expires_at': '2026-09-22T10:15:00.000Z',
        'refresh_expires_at': '2026-10-22T10:00:00.000Z',
        'user': {
          'id': 'usr-002',
          'user_code': 'USR-002',
          'name': 'মুহাম্মদ ইমরান',
          'email': 'user@khurushkul-samity.org',
          'organization_id': 'demo-org-khurushkul',
          'organization_name': 'খুরুশকুল ওলামা সমিতি',
          'is_active': true,
          'created_at': '2024-01-01T00:00:00.000Z',
          'updated_at': '2026-09-22T00:00:00.000Z',
        },
      };

      final sessionModel = SessionModel.fromJson(json);
      final entity = sessionModel.toEntity();

      expect(entity.accessToken, 'access_token_abc');
      expect(entity.refreshToken, 'refresh_token_xyz');
      expect(entity.user.id, 'usr-002');
      expect(entity.organizationId, 'demo-org-khurushkul');
    });
  });
}
