import '../../../../domain/entities/role.dart';
import '../repositories/role_permission_repository.dart';

class GetRolesUseCase {
  final RolePermissionRepository repository;

  const GetRolesUseCase(this.repository);

  Future<List<Role>> call({required String organizationId}) {
    return repository.getRoles(organizationId: organizationId);
  }
}
