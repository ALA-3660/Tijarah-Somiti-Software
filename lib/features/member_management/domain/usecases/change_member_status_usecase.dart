import '../entities/member.dart';
import '../entities/member_status.dart';
import '../repositories/member_repository.dart';

/// ChangeMemberStatusUseCase: সদস্য স্ট্যাটাস পরিবর্তনের ইউজ কেস
class ChangeMemberStatusUseCase {
  final MemberRepository repository;

  const ChangeMemberStatusUseCase(this.repository);

  Future<Member> execute({
    required String organizationId,
    required String memberId,
    required MemberStatus newStatus,
    required String reason,
    required String actorUserId,
    required String actorName,
  }) {
    return repository.changeMemberStatus(
      organizationId: organizationId,
      memberId: memberId,
      newStatus: newStatus,
      reason: reason,
      actorUserId: actorUserId,
      actorName: actorName,
    );
  }
}
