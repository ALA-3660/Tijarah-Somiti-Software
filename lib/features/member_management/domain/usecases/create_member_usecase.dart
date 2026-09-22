import '../entities/member.dart';
import '../repositories/member_repository.dart';

/// CreateMemberUseCase: নতুন সদস্য নিবন্ধনের ইউজ কেস
class CreateMemberUseCase {
  final MemberRepository repository;

  const CreateMemberUseCase(this.repository);

  Future<Member> execute({
    required String organizationId,
    required String fullName,
    required String mobile,
    String? email,
    DateTime? dateOfBirth,
    String? gender,
    String? occupation,
    String? fatherOrSpouseName,
    String? motherName,
    String? nid,
    String? address,
    DateTime? joinedAt,
    String? photoUrl,
    String? notes,
    required String actorUserId,
    required String actorName,
  }) {
    return repository.createMember(
      organizationId: organizationId,
      fullName: fullName,
      mobile: mobile,
      email: email,
      dateOfBirth: dateOfBirth,
      gender: gender,
      occupation: occupation,
      fatherOrSpouseName: fatherOrSpouseName,
      motherName: motherName,
      nid: nid,
      address: address,
      joinedAt: joinedAt,
      photoUrl: photoUrl,
      notes: notes,
      actorUserId: actorUserId,
      actorName: actorName,
    );
  }
}
