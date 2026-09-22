import '../entities/membership_application.dart';
import '../entities/membership_application_status.dart';

abstract class MembershipApplicationRepository {
  Future<List<MembershipApplication>> getApplications({
    required String organizationId,
    MembershipApplicationStatus? status,
    String? searchQuery,
  });

  Future<MembershipApplication?> getApplicationById({
    required String organizationId,
    required String applicationId,
  });

  Future<MembershipApplication> createDraftApplication({
    required String organizationId,
    required String applicantFullName,
    required String mobile,
    String? email,
    DateTime? dateOfBirth,
    String? gender,
    String? occupation,
    String? fatherOrSpouseName,
    String? motherName,
    String? currentAddress,
    String? permanentAddress,
    bool isSameAddress = false,
    String? nid,
    String? photoReference,
    String? notes,
    required String createdBy,
  });

  Future<MembershipApplication> updateApplication({
    required String organizationId,
    required String applicationId,
    required String updatedBy,
    String? applicantFullName,
    String? mobile,
    String? email,
    DateTime? dateOfBirth,
    String? gender,
    String? occupation,
    String? fatherOrSpouseName,
    String? motherName,
    String? currentAddress,
    String? permanentAddress,
    bool? isSameAddress,
    String? nid,
    String? photoReference,
    String? notes,
  });

  Future<MembershipApplication> submitApplication({
    required String organizationId,
    required String applicationId,
    required String submittedBy,
  });

  Future<MembershipApplication> startReview({
    required String organizationId,
    required String applicationId,
    required String reviewerId,
    required String reviewerName,
  });

  Future<MembershipApplication> updateChecklist({
    required String organizationId,
    required String applicationId,
    required List<VerificationChecklistItem> checklist,
    required String updatedBy,
  });

  Future<MembershipApplication> requestCorrection({
    required String organizationId,
    required String applicationId,
    required String reviewerId,
    required String reviewerName,
    required String correctionReason,
  });

  Future<MembershipApplication> resubmitApplication({
    required String organizationId,
    required String applicationId,
    required String submittedBy,
    String? note,
  });

  Future<MembershipApplication> approveApplication({
    required String organizationId,
    required String applicationId,
    required String approverId,
    required String approverName,
    required String decisionReason,
  });

  Future<MembershipApplication> rejectApplication({
    required String organizationId,
    required String applicationId,
    required String rejecterId,
    required String rejecterName,
    required String rejectionReason,
  });

  Future<MembershipApplication> withdrawApplication({
    required String organizationId,
    required String applicationId,
    required String requesterId,
    required String withdrawalReason,
  });

  /// চেক করে একই সংস্থায় সক্রিয় ডুপ্লিকেট আবেদন বা বিদ্যমান সদস্য আছে কি না
  Future<Map<String, dynamic>> checkDuplicates({
    required String organizationId,
    required String mobile,
    String? nid,
    String? fullName,
    DateTime? dateOfBirth,
  });
}
