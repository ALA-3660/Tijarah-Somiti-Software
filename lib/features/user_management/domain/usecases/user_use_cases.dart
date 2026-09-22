import '../../../../domain/entities/managed_user.dart';
import '../../../../domain/entities/user_status.dart';
import '../entities/user_audits.dart';
import '../repositories/user_repository.dart';

/// ব্যবহারকারী তালিকা প্রাপ্তির ইউজ কেস
class GetUsersUseCase {
  final UserRepository repository;
  const GetUsersUseCase(this.repository);

  Future<List<ManagedUser>> execute({
    required String organizationId,
    String? searchQuery,
    UserStatus? statusFilter,
    String? roleFilter,
  }) {
    return repository.getUsers(
      organizationId: organizationId,
      searchQuery: searchQuery,
      statusFilter: statusFilter,
      roleFilter: roleFilter,
    );
  }
}

/// একক ব্যবহারকারীর তথ্য প্রাপ্তির ইউজ কেস
class GetUserByIdUseCase {
  final UserRepository repository;
  const GetUserByIdUseCase(this.repository);

  Future<ManagedUser?> execute({
    required String organizationId,
    required String userId,
  }) {
    return repository.getUserById(
      organizationId: organizationId,
      userId: userId,
    );
  }
}

/// নতুন ব্যবহারকারী অ্যাকাউন্ট তৈরির ইউজ কেস
class CreateUserUseCase {
  final UserRepository repository;
  const CreateUserUseCase(this.repository);

  Future<ManagedUser> execute({
    required String organizationId,
    required String fullName,
    required String mobile,
    required String email,
    required List<String> initialRoleKeys,
    required String actorUserId,
    required String actorName,
  }) {
    return repository.createUser(
      organizationId: organizationId,
      fullName: fullName,
      mobile: mobile,
      email: email,
      initialRoleKeys: initialRoleKeys,
      actorUserId: actorUserId,
      actorName: actorName,
    );
  }
}

/// ব্যবহারকারীর তথ্য হালনাগাদের ইউজ কেস
class UpdateUserUseCase {
  final UserRepository repository;
  const UpdateUserUseCase(this.repository);

  Future<ManagedUser> execute({
    required String organizationId,
    required String userId,
    required String fullName,
    required String mobile,
    required String email,
    String? profilePhoto,
    required String actorUserId,
    required String actorName,
  }) {
    return repository.updateUser(
      organizationId: organizationId,
      userId: userId,
      fullName: fullName,
      mobile: mobile,
      email: email,
      profilePhoto: profilePhoto,
      actorUserId: actorUserId,
      actorName: actorName,
    );
  }
}

/// ব্যবহারকারীর অ্যাকাউন্ট লাইফসাইকেল স্ট্যাটাস পরিবর্তনের ইউজ কেস
class ChangeUserStatusUseCase {
  final UserRepository repository;
  const ChangeUserStatusUseCase(this.repository);

  Future<ManagedUser> execute({
    required String organizationId,
    required String userId,
    required UserStatus newStatus,
    required String actorUserId,
    required String actorName,
    String? reason,
  }) {
    return repository.changeUserStatus(
      organizationId: organizationId,
      userId: userId,
      newStatus: newStatus,
      actorUserId: actorUserId,
      actorName: actorName,
      reason: reason,
    );
  }
}

/// ব্যবহারকারীকে ভূমিকা অর্পণের ইউজ কেস
class AssignUserRoleUseCase {
  final UserRepository repository;
  const AssignUserRoleUseCase(this.repository);

  Future<ManagedUser> execute({
    required String organizationId,
    required String userId,
    required String roleKey,
    required String actorUserId,
    required String actorName,
    String? reason,
  }) {
    return repository.assignRoleToUser(
      organizationId: organizationId,
      userId: userId,
      roleKey: roleKey,
      actorUserId: actorUserId,
      actorName: actorName,
      reason: reason,
    );
  }
}

/// ব্যবহারকারীর ভূমিকা প্রত্যাহারের ইউজ কেস
class RemoveUserRoleUseCase {
  final UserRepository repository;
  const RemoveUserRoleUseCase(this.repository);

  Future<ManagedUser> execute({
    required String organizationId,
    required String userId,
    required String roleKey,
    required String actorUserId,
    required String actorName,
    String? reason,
  }) {
    return repository.removeRoleFromUser(
      organizationId: organizationId,
      userId: userId,
      roleKey: roleKey,
      actorUserId: actorUserId,
      actorName: actorName,
      reason: reason,
    );
  }
}
