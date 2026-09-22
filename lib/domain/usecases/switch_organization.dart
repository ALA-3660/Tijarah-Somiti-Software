import '../../core/result/result.dart';
import '../repositories/organization_repository.dart';

/// SwitchOrganizationUseCase: সক্রিয় সমিতি পরিবর্তন করার ইউস কেস
///
/// এটি ব্যবহারকারী যখন একাধিক সমিতির সদস্য থাকে তখন এক সমিতি থেকে
/// অন্য সমিতিতে কনটেক্সট পরিবর্তন করতে ব্যবহৃত হয়।
class SwitchOrganizationUseCase {
  final OrganizationRepository _repository;

  SwitchOrganizationUseCase(this._repository);

  Future<Result<void>> call(String organizationId) async {
    return await _repository.switchOrganization(organizationId);
  }
}
