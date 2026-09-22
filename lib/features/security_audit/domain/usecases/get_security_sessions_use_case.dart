import '../entities/security_session.dart';
import '../repositories/session_security_repository.dart';

class GetSecuritySessionsUseCase {
  final SessionSecurityRepository _repository;

  const GetSecuritySessionsUseCase(this._repository);

  Future<List<SecuritySession>> call(String organizationId) {
    return _repository.getSessions(organizationId);
  }

  Future<SecuritySession?> getCurrentSession(String organizationId, String userId) {
    return _repository.getCurrentSession(organizationId, userId);
  }
}
