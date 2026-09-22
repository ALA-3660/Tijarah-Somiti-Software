import '../../../../core/authorization/authorization_service.dart';

class CheckPermissionUseCase {
  final AuthorizationService authorizationService;

  const CheckPermissionUseCase([AuthorizationService? service])
      : authorizationService = service ?? AuthorizationService.instance;

  bool call(String permissionKey) {
    return authorizationService.can(permissionKey);
  }

  bool any(List<String> permissionKeys) {
    return authorizationService.canAny(permissionKeys);
  }

  bool all(List<String> permissionKeys) {
    return authorizationService.canAll(permissionKeys);
  }
}
