import '../../core/result/result.dart';
import '../entities/organization.dart';
import '../repositories/organization_repository.dart';

/// UpdateOrganizationStatusUseCase: সমিতির স্ট্যাটাস (যেমন: সক্রিয়, স্থগিত, আর্কাইভ) পরিবর্তনের ইউজ-কেস
class UpdateOrganizationStatusUseCase {
  final OrganizationRepository _repository;

  UpdateOrganizationStatusUseCase(this._repository);

  Future<Result<Organization>> call(String id, OrganizationStatus status) async {
    return await _repository.updateOrganizationStatus(id, status);
  }
}
