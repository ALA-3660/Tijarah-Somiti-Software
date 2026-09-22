import '../entities/security_audit_record.dart';
import '../entities/security_event.dart';
import '../repositories/security_audit_repository.dart';

class GetSecurityAuditLogsParams {
  final String organizationId;
  final SecurityEventType? eventType;
  final SecurityEventResult? result;
  final DateTime? startDate;
  final DateTime? endDate;
  final String? searchQuery;
  final String? actorUserId;

  const GetSecurityAuditLogsParams({
    required this.organizationId,
    this.eventType,
    this.result,
    this.startDate,
    this.endDate,
    this.searchQuery,
    this.actorUserId,
  });
}

class GetSecurityAuditLogsUseCase {
  final SecurityAuditRepository _repository;

  const GetSecurityAuditLogsUseCase(this._repository);

  Future<List<SecurityAuditRecord>> call(GetSecurityAuditLogsParams params) {
    return _repository.getAuditLogs(
      organizationId: params.organizationId,
      eventType: params.eventType,
      result: params.result,
      startDate: params.startDate,
      endDate: params.endDate,
      searchQuery: params.searchQuery,
      actorUserId: params.actorUserId,
    );
  }
}
