import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/api_client.dart';
import '../../models/organization_model.dart';

/// OrganizationRemoteDataSource: রিমোট Django REST API-এর সাথে যোগাযোগকারী
abstract class OrganizationRemoteDataSource {
  Future<List<OrganizationModel>> getOrganizations();
  Future<OrganizationModel> getOrganizationById(String id);
  Future<OrganizationModel> updateOrganization(OrganizationModel organization);
  Future<OrganizationModel> updateOrganizationStatus(String id, String status);
}

class OrganizationRemoteDataSourceImpl implements OrganizationRemoteDataSource {
  final ApiClient _apiClient;

  OrganizationRemoteDataSourceImpl(this._apiClient);

  @override
  Future<List<OrganizationModel>> getOrganizations() async {
    final response = await _apiClient.get(ApiEndpoints.organizations);
    if (response is List) {
      return response
          .map((item) => OrganizationModel.fromJson(item as Map<String, dynamic>))
          .toList();
    } else if (response is Map<String, dynamic> && response.containsKey('results')) {
      // Django REST Framework Pagination
      final results = response['results'] as List<dynamic>;
      return results
          .map((item) => OrganizationModel.fromJson(item as Map<String, dynamic>))
          .toList();
    }
    return [];
  }

  @override
  Future<OrganizationModel> getOrganizationById(String id) async {
    final response = await _apiClient.get(ApiEndpoints.organizationDetails(id));
    return OrganizationModel.fromJson(response as Map<String, dynamic>);
  }

  @override
  Future<OrganizationModel> updateOrganization(OrganizationModel organization) async {
    final response = await _apiClient.patch(
      ApiEndpoints.organizationDetails(organization.id),
      data: organization.toJson(),
    );
    return OrganizationModel.fromJson(response as Map<String, dynamic>);
  }

  @override
  Future<OrganizationModel> updateOrganizationStatus(String id, String status) async {
    final response = await _apiClient.patch(
      ApiEndpoints.organizationDetails(id),
      data: {'status': status},
    );
    return OrganizationModel.fromJson(response as Map<String, dynamic>);
  }
}
