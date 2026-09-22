import '../entities/member.dart';
import '../entities/member_status.dart';
import '../repositories/member_repository.dart';

/// GetMembersUseCase: সদস্য তালিকা সংগ্রহের ইউজ কেস
class GetMembersUseCase {
  final MemberRepository repository;

  const GetMembersUseCase(this.repository);

  Future<List<Member>> execute({
    required String organizationId,
    MemberStatus? status,
    String? searchQuery,
    int page = 1,
    int limit = 50,
  }) {
    return repository.getMembers(
      organizationId: organizationId,
      status: status,
      searchQuery: searchQuery,
      page: page,
      limit: limit,
    );
  }
}
