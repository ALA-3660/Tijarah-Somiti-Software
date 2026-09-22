import '../entities/security_session.dart';
import '../repositories/session_security_repository.dart';

class TerminateSessionUseCase {
  final SessionSecurityRepository _repository;

  const TerminateSessionUseCase(this._repository);

  Future<SecuritySession> call({
    required String organizationId,
    required String sessionId,
    required String actorUserId,
    required String reason,
  }) {
    return _repository.terminateSession(
      organizationId: organizationId,
      sessionId: sessionId,
      actorUserId: actorUserId,
      reason: reason,
    );
  }
}
