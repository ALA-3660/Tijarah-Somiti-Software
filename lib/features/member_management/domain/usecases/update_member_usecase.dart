import '../entities/member.dart';
import '../repositories/member_repository.dart';

/// UpdateMemberUseCase: সদস্য তথ্য সংশোধনের ইউজ কেস
class UpdateMemberUseCase {
  final MemberRepository repository;

  const UpdateMemberUseCase(this.repository);

  Future<Member> execute({
    required String organizationId,
    required String memberId,
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
    String? photoUrl,
    String? notes,
    required String actorUserId,
    required String actorName,
  }) {
    return repository.updateMember(
      organizationId: organizationId,
      memberId: memberId,
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
      photoUrl: photoUrl,
      notes: notes,
      actorUserId: actorUserId,
      actorName: actorName,
    );
  }
}
