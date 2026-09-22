import '../../../../domain/entities/permission.dart';
import '../repositories/role_permission_repository.dart';

class GetPermissionsUseCase {
  final RolePermissionRepository repository;

  const GetPermissionsUseCase(this.repository);

  Future<List<Permission>> call() {
    return repository.getAllPermissions();
  }
}
