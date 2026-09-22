import 'membership_application_status.dart';

/// VerificationChecklistItem: আবেদন যাচাই চেকলিস্ট আইটেম
class VerificationChecklistItem {
  final String id;
  final String title;
  final bool isVerified;
  final String? verifiedBy;
  final DateTime? verifiedAt;
  final String? note;

  const VerificationChecklistItem({
    required this.id,
    required this.title,
    this.isVerified = false,
    this.verifiedBy,
    this.verifiedAt,
    this.note,
  });

  VerificationChecklistItem copyWith({
    bool? isVerified,
    String? verifiedBy,
    DateTime? verifiedAt,
    String? note,
  }) {
    return VerificationChecklistItem(
      id: id,
      title: title,
      isVerified: isVerified ?? this.isVerified,
      verifiedBy: verifiedBy ?? this.verifiedBy,
      verifiedAt: verifiedAt ?? this.verifiedAt,
      note: note ?? this.note,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'is_verified': isVerified,
      'verified_by': verifiedBy,
      'verified_at': verifiedAt?.toIso8601String(),
      'note': note,
    };
  }

  factory VerificationChecklistItem.fromJson(Map<String, dynamic> json) {
    return VerificationChecklistItem(
      id: json['id'] as String,
      title: json['title'] as String,
      isVerified: json['is_verified'] as bool? ?? false,
      verifiedBy: json['verified_by'] as String?,
      verifiedAt: json['verified_at'] != null ? DateTime.parse(json['verified_at'] as String) : null,
      note: json['note'] as String?,
    );
  }
}

/// ApplicationTimelineEvent: আবেদন লাইফসাইকেলের ঐতিহাসিক ইভেন্ট
class ApplicationTimelineEvent {
  final String id;
  final String applicationId;
  final String event;
  final String actorName;
  final String? actorId;
  final DateTime timestamp;
  final String? note;
  final String? previousStatus;
  final String? newStatus;

  const ApplicationTimelineEvent({
    required this.id,
    required this.applicationId,
    required this.event,
    required this.actorName,
    this.actorId,
    required this.timestamp,
    this.note,
    this.previousStatus,
    this.newStatus,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'application_id': applicationId,
      'event': event,
      'actor_name': actorName,
      'actor_id': actorId,
      'timestamp': timestamp.toIso8601String(),
      'note': note,
      'previous_status': previousStatus,
      'new_status': newStatus,
    };
  }

  factory ApplicationTimelineEvent.fromJson(Map<String, dynamic> json) {
    return ApplicationTimelineEvent(
      id: json['id'] as String,
      applicationId: json['application_id'] as String,
      event: json['event'] as String,
      actorName: json['actor_name'] as String,
      actorId: json['actor_id'] as String?,
      timestamp: DateTime.parse(json['timestamp'] as String),
      note: json['note'] as String?,
      previousStatus: json['previous_status'] as String?,
      newStatus: json['new_status'] as String?,
    );
  }
}

/// MembershipApplication: সদস্যপদ আবেদন ডোমেইন এন্টিটি
///
/// **আর্কিটেকচার নীতি:**
/// ১. Application ≠ Member: আবেদন মানেই সদস্য নয়।
/// ২. No Financial Effect: আবেদন যাচাই বা অমীমাংসিত অবস্থায় কোনো শেয়ার, চাঁদা বা লেজার প্রভাবিত করে না।
/// ৩. Multi-tenant Scoped: প্রতিটি কোড ও আইডি প্রতিষ্ঠান অনুযায়ী আইসোলেটেড।
class MembershipApplication {
  final String id;
  final String organizationId;
  final String applicationCode;
  final String applicantFullName;
  final String mobile;
  final String? email;
  final DateTime? dateOfBirth;
  final String? gender;
  final String? occupation;
  final String? fatherOrSpouseName;
  final String? motherName;
  final String? currentAddress;
  final String? permanentAddress;
  final bool isSameAddress;
  final String? nid;
  final String? photoReference;
  final String? notes;
  final MembershipApplicationStatus applicationStatus;
  final DateTime? submittedAt;
  final DateTime? verifiedAt;
  final DateTime? decidedAt;
  final String? verifiedBy;
  final String? decidedBy;
  final String? decisionReason;
  final String? correctionReason;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? createdBy;
  final String? updatedBy;
  final String? approvedMemberId;
  final List<VerificationChecklistItem> checklist;
  final List<ApplicationTimelineEvent> timeline;

  const MembershipApplication({
    required this.id,
    required this.organizationId,
    required this.applicationCode,
    required this.applicantFullName,
    required this.mobile,
    this.email,
    this.dateOfBirth,
    this.gender,
    this.occupation,
    this.fatherOrSpouseName,
    this.motherName,
    this.currentAddress,
    this.permanentAddress,
    this.isSameAddress = false,
    this.nid,
    this.photoReference,
    this.notes,
    required this.applicationStatus,
    this.submittedAt,
    this.verifiedAt,
    this.decidedAt,
    this.verifiedBy,
    this.decidedBy,
    this.decisionReason,
    this.correctionReason,
    required this.createdAt,
    required this.updatedAt,
    this.createdBy,
    this.updatedBy,
    this.approvedMemberId,
    this.checklist = const [],
    this.timeline = const [],
  });

  /// মাস্কড NID (যেমন: '********1234')
  String get maskedNid {
    if (nid == null || nid!.trim().isEmpty) return 'তথ্য নেই';
    final trimmed = nid!.trim();
    if (trimmed.length <= 4) return '****';
    final visiblePart = trimmed.substring(trimmed.length - 4);
    final maskedLength = trimmed.length - 4;
    return '${'*' * maskedLength}$visiblePart';
  }

  /// বয়স গণনা (বছর)
  int? get ageYears {
    if (dateOfBirth == null) return null;
    final now = DateTime.now();
    int age = now.year - dateOfBirth!.year;
    if (now.month < dateOfBirth!.month ||
        (now.month == dateOfBirth!.month && now.day < dateOfBirth!.day)) {
      age--;
    }
    return age > 0 ? age : null;
  }

  /// বয়স বাংলা টেক্সট ডিসপ্লে
  String get ageDisplayBangla {
    final age = ageYears;
    if (age == null) return 'তথ্য নেই';
    const enToBn = {'0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'};
    final bnAge = age.toString().split('').map((c) => enToBn[c] ?? c).join('');
    return '$bnAge বছর';
  }

  MembershipApplication copyWith({
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
    MembershipApplicationStatus? applicationStatus,
    DateTime? submittedAt,
    DateTime? verifiedAt,
    DateTime? decidedAt,
    String? verifiedBy,
    String? decidedBy,
    String? decisionReason,
    String? correctionReason,
    DateTime? updatedAt,
    String? updatedBy,
    String? approvedMemberId,
    List<VerificationChecklistItem>? checklist,
    List<ApplicationTimelineEvent>? timeline,
  }) {
    return MembershipApplication(
      id: id, // Immutable
      organizationId: organizationId, // Immutable
      applicationCode: applicationCode, // Immutable
      applicantFullName: applicantFullName ?? this.applicantFullName,
      mobile: mobile ?? this.mobile,
      email: email ?? this.email,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      gender: gender ?? this.gender,
      occupation: occupation ?? this.occupation,
      fatherOrSpouseName: fatherOrSpouseName ?? this.fatherOrSpouseName,
      motherName: motherName ?? this.motherName,
      currentAddress: currentAddress ?? this.currentAddress,
      permanentAddress: permanentAddress ?? this.permanentAddress,
      isSameAddress: isSameAddress ?? this.isSameAddress,
      nid: nid ?? this.nid,
      photoReference: photoReference ?? this.photoReference,
      notes: notes ?? this.notes,
      applicationStatus: applicationStatus ?? this.applicationStatus,
      submittedAt: submittedAt ?? this.submittedAt,
      verifiedAt: verifiedAt ?? this.verifiedAt,
      decidedAt: decidedAt ?? this.decidedAt,
      verifiedBy: verifiedBy ?? this.verifiedBy,
      decidedBy: decidedBy ?? this.decidedBy,
      decisionReason: decisionReason ?? this.decisionReason,
      correctionReason: correctionReason ?? this.correctionReason,
      createdAt: createdAt, // Immutable
      updatedAt: updatedAt ?? DateTime.now(),
      createdBy: createdBy, // Immutable
      updatedBy: updatedBy ?? this.updatedBy,
      approvedMemberId: approvedMemberId ?? this.approvedMemberId,
      checklist: checklist ?? this.checklist,
      timeline: timeline ?? this.timeline,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_id': organizationId,
      'application_code': applicationCode,
      'applicant_full_name': applicantFullName,
      'mobile': mobile,
      'email': email,
      'date_of_birth': dateOfBirth?.toIso8601String(),
      'gender': gender,
      'occupation': occupation,
      'father_or_spouse_name': fatherOrSpouseName,
      'mother_name': motherName,
      'current_address': currentAddress,
      'permanent_address': permanentAddress,
      'is_same_address': isSameAddress,
      'nid': nid,
      'photo_reference': photoReference,
      'notes': notes,
      'application_status': applicationStatus.key,
      'submitted_at': submittedAt?.toIso8601String(),
      'verified_at': verifiedAt?.toIso8601String(),
      'decided_at': decidedAt?.toIso8601String(),
      'verified_by': verifiedBy,
      'decided_by': decidedBy,
      'decision_reason': decisionReason,
      'correction_reason': correctionReason,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'created_by': createdBy,
      'updated_by': updatedBy,
      'approved_member_id': approvedMemberId,
      'checklist': checklist.map((i) => i.toJson()).toList(),
      'timeline': timeline.map((e) => e.toJson()).toList(),
    };
  }

  factory MembershipApplication.fromJson(Map<String, dynamic> json) {
    return MembershipApplication(
      id: json['id'] as String,
      organizationId: json['organization_id'] as String,
      applicationCode: json['application_code'] as String,
      applicantFullName: json['applicant_full_name'] as String,
      mobile: json['mobile'] as String,
      email: json['email'] as String?,
      dateOfBirth: json['date_of_birth'] != null ? DateTime.parse(json['date_of_birth'] as String) : null,
      gender: json['gender'] as String?,
      occupation: json['occupation'] as String?,
      fatherOrSpouseName: json['father_or_spouse_name'] as String?,
      motherName: json['mother_name'] as String?,
      currentAddress: json['current_address'] as String?,
      permanentAddress: json['permanent_address'] as String?,
      isSameAddress: json['is_same_address'] as bool? ?? false,
      nid: json['nid'] as String?,
      photoReference: json['photo_reference'] as String?,
      notes: json['notes'] as String?,
      applicationStatus: MembershipApplicationStatus.fromKey(json['application_status'] as String?),
      submittedAt: json['submitted_at'] != null ? DateTime.parse(json['submitted_at'] as String) : null,
      verifiedAt: json['verified_at'] != null ? DateTime.parse(json['verified_at'] as String) : null,
      decidedAt: json['decided_at'] != null ? DateTime.parse(json['decided_at'] as String) : null,
      verifiedBy: json['verified_by'] as String?,
      decidedBy: json['decided_by'] as String?,
      decisionReason: json['decision_reason'] as String?,
      correctionReason: json['correction_reason'] as String?,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'] as String) : DateTime.now(),
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at'] as String) : DateTime.now(),
      createdBy: json['created_by'] as String?,
      updatedBy: json['updated_by'] as String?,
      approvedMemberId: json['approved_member_id'] as String?,
      checklist: (json['checklist'] as List<dynamic>?)
              ?.map((item) => VerificationChecklistItem.fromJson(item as Map<String, dynamic>))
              .toList() ??
          [],
      timeline: (json['timeline'] as List<dynamic>?)
              ?.map((item) => ApplicationTimelineEvent.fromJson(item as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}
