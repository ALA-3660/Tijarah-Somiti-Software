import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/api_client.dart';
import '../../models/user_model.dart';

/// AuthRemoteDataSource: রিমোট অথেনটিকেশন এপিআই
abstract class AuthRemoteDataSource {
  Future<UserModel> getUserProfile();
  Future<String> refreshToken(String refreshToken);
  Future<void> logout();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient _apiClient;

  AuthRemoteDataSourceImpl(this._apiClient);

  @override
  Future<UserModel> getUserProfile() async {
    final response = await _apiClient.get(ApiEndpoints.userProfile);
    return UserModel.fromJson(response as Map<String, dynamic>);
  }

  @override
  Future<String> refreshToken(String refreshToken) async {
    final response = await _apiClient.post(
      ApiEndpoints.refreshToken,
      body: {'refresh': refreshToken},
    );
    return response['access'] as String;
  }

  @override
  Future<void> logout() async {
    await _apiClient.post(ApiEndpoints.logout);
  }
}
