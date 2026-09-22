import '../entities/member.dart';
import '../repositories/member_repository.dart';

/// GetMemberByIdUseCase: একক সদস্যের তথ্য সংগ্রহের ইউজ কেস
class GetMemberByIdUseCase {
  final MemberRepository repository;

  const GetMemberByIdUseCase(this.repository);

  Future<Member?> execute({
    required String organizationId,
    required String memberId,
  }) {
    return repository.getMemberById(
      organizationId: organizationId,
      memberId: memberId,
    );
  }
}
