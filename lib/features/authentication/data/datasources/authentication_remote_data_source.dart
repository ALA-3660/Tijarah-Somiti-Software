import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/api_client.dart';
import '../../domain/entities/authenticated_user.dart';
import '../models/authentication_response_model.dart';
import '../models/login_request_model.dart';

/// AuthenticationRemoteDataSource: রিমোট অথেনটিকেশন ডাটা সোর্স ইন্টারফেস
abstract class AuthenticationRemoteDataSource {
  Future<AuthenticationResponseModel> login(LoginRequestModel request);
  Future<AuthenticationResponseModel> refreshToken(String refreshToken);
  Future<void> logout({String? refreshToken});
  Future<AuthenticatedUser> getMe();
}

/// AuthenticationRemoteDataSourceImpl: ApiClient ব্যবহার করে রিমোট এপিআই কল
class AuthenticationRemoteDataSourceImpl implements AuthenticationRemoteDataSource {
  final ApiClient _apiClient;

  AuthenticationRemoteDataSourceImpl(this._apiClient);

  @override
  Future<AuthenticationResponseModel> login(LoginRequestModel request) async {
    final response = await _apiClient.post(
      ApiEndpoints.login,
      body: request.toJson(),
    );
    return AuthenticationResponseModel.fromJson(response as Map<String, dynamic>);
  }

  @override
  Future<AuthenticationResponseModel> refreshToken(String refreshToken) async {
    final response = await _apiClient.post(
      ApiEndpoints.refreshToken,
      body: {'refresh': refreshToken},
    );
    return AuthenticationResponseModel.fromJson(response as Map<String, dynamic>);
  }

  @override
  Future<void> logout({String? refreshToken}) async {
    try {
      await _apiClient.post(
        ApiEndpoints.logout,
        body: refreshToken != null ? {'refresh': refreshToken} : null,
      );
    } catch (_) {
      // নেটওয়ার্কের কারণে সার্ভার কল ফেইল করলেও লোকাল লগআউট বাধাগ্রস্ত হবে না
    }
  }

  @override
  Future<AuthenticatedUser> getMe() async {
    final response = await _apiClient.get(ApiEndpoints.me);
    final json = response as Map<String, dynamic>;
    final org = json['organization'] as Map<String, dynamic>? ?? {};

    return AuthenticatedUser(
      id: (json['id'] ?? '').toString(),
      userCode: (json['user_code'] ?? json['code'] ?? 'USR-001').toString(),
      name: (json['name'] ?? json['full_name'] ?? 'ব্যবহারকারী').toString(),
      email: (json['email'] ?? '').toString(),
      phone: json['phone']?.toString(),
      organizationId: (json['organization_id'] ?? org['id'] ?? '').toString(),
      organizationName: (json['organization_name'] ?? org['name'] ?? 'তিজারাহ সমিতি').toString(),
      isActive: json['is_active'] as bool? ?? true,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }
}
