import '../../../../core/authorization/authorization_service.dart';

class ValidateSelfApprovalUseCase {
  final AuthorizationService authorizationService;

  const ValidateSelfApprovalUseCase([AuthorizationService? service])
      : authorizationService = service ?? AuthorizationService.instance;

  SelfApprovalPolicyResult call({
    required String creatorUserId,
    required String approverUserId,
  }) {
    return authorizationService.checkSelfApprovalPolicy(
      creatorUserId: creatorUserId,
      approverUserId: approverUserId,
    );
  }
}
