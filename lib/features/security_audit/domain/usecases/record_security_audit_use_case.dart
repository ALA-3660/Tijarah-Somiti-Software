import '../entities/security_audit_record.dart';
import '../repositories/security_audit_repository.dart';

class RecordSecurityAuditUseCase {
  final SecurityAuditRepository _repository;

  const RecordSecurityAuditUseCase(this._repository);

  Future<SecurityAuditRecord> call(SecurityAuditRecord record) {
    return _repository.recordAudit(record);
  }
}
