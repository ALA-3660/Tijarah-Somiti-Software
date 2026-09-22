import '../../core/result/result.dart';
import '../entities/organization.dart';
import '../repositories/organization_repository.dart';

/// GetCurrentOrganizationUseCase: বর্তমান সক্রিয় সমিতি উদ্ধার করার ইউস কেস
class GetCurrentOrganizationUseCase {
  final OrganizationRepository _repository;

  GetCurrentOrganizationUseCase(this._repository);

  Future<Result<Organization?>> call() async {
    return await _repository.getCurrentOrganization();
  }
}
