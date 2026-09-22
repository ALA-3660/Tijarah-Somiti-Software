import '../../core/result/result.dart';
import '../entities/organization.dart';
import '../repositories/organization_repository.dart';

/// UpdateOrganizationUseCase: সমিতির তথ্য হালনাগাদ করার ডোমেইন ইউজ-কেস
class UpdateOrganizationUseCase {
  final OrganizationRepository _repository;

  UpdateOrganizationUseCase(this._repository);

  Future<Result<Organization>> call(Organization organization) async {
    return await _repository.updateOrganization(organization);
  }
}
