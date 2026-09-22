import '../domain/entities/membership_application.dart';
import '../domain/entities/membership_application_status.dart';
import '../domain/repositories/membership_application_repository.dart';
import '../../security/domain/repositories/security_audit_repository.dart';

class MembershipApplicationRepositoryImpl implements MembershipApplicationRepository {
  final SecurityAuditRepository? _auditRepo;

  /// ইন-মেমোরি স্টোরেজ (Key: organizationId)
  final Map<String, List<MembershipApplication>> _applicationsByOrg = {};

  MembershipApplicationRepositoryImpl({SecurityAuditRepository? auditRepo})
      : _auditRepo = auditRepo {
    _seedInitialApplications();
  }

  void _seedInitialApplications() {
    const demoOrgId = 'demo-org-khurushkul';

    final demoApps = [
      MembershipApplication(
        id: 'app-seed-001',
        organizationId: demoOrgId,
        applicationCode: 'APP-000001',
        applicantFullName: 'মাওলানা আব্দুল হক চৌধুরী',
        mobile: '01812999001',
        email: 'abdul.haq@khurushkul.org',
        dateOfBirth: DateTime(1989, 4, 12),
        gender: 'male',
        occupation: 'মাদ্রাসা শিক্ষক',
        fatherOrSpouseName: 'মরহুম নুরুল ইসলাম চৌধুরী',
        motherName: 'ফাতেমা বেগম',
        currentAddress: 'দক্ষিণ খুরুশকুল, কক্সবাজার সদর',
        permanentAddress: 'দক্ষিণ খুরুশকুল, কক্সবাজার সদর',
        isSameAddress: true,
        nid: '19891234567890123',
        photoReference: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        notes: 'স্থানীয় ওলামা পরিষদের সুপারিশপ্রাপ্ত আবেদন।',
        applicationStatus: MembershipApplicationStatus.underReview,
        submittedAt: DateTime.now().subtract(const Duration(days: 3)),
        verifiedAt: DateTime.now().subtract(const Duration(days: 1)),
        verifiedBy: 'usr-admin-01',
        createdAt: DateTime.now().subtract(const Duration(days: 4)),
        updatedAt: DateTime.now().subtract(const Duration(days: 1)),
        createdBy: 'usr-officer-01',
        checklist: [
          VerificationChecklistItem(id: 'chk-1', title: 'পরিচয় তথ্য যাচাই', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: DateTime.now().subtract(const Duration(days: 1))),
          VerificationChecklistItem(id: 'chk-2', title: 'মোবাইল নম্বর যাচাই', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: DateTime.now().subtract(const Duration(days: 1))),
          VerificationChecklistItem(id: 'chk-3', title: 'ঠিকানা সরেজমিন যাচাই', isVerified: false, note: 'স্থানীয় মসজিদ কমিটির নিশ্চিতকরণ চলমান'),
          VerificationChecklistItem(id: 'chk-4', title: 'পারিবারিক তথ্য যাচাই', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: DateTime.now().subtract(const Duration(days: 1))),
          VerificationChecklistItem(id: 'chk-5', title: 'জাতীয় পরিচয়পত্র (NID) সত্যতা যাচাই', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: DateTime.now().subtract(const Duration(days: 1))),
          VerificationChecklistItem(id: 'chk-6', title: 'ছবি ও সাক্ষর সঠিকতা', isVerified: true, verifiedBy: 'অফিসার জাকির', verifiedAt: DateTime.now().subtract(const Duration(days: 1))),
        ],
        timeline: [
          ApplicationTimelineEvent(id: 'evt-1', applicationId: 'app-seed-001', event: 'MEMBERSHIP_APPLICATION_CREATED', actorName: 'ফিল্ড অফিসার জাকির', actorId: 'usr-officer-01', timestamp: DateTime.now().subtract(const Duration(days: 4)), note: 'প্রাথমিক খসড়া তৈরি হয়েছে'),
          ApplicationTimelineEvent(id: 'evt-2', applicationId: 'app-seed-001', event: 'MEMBERSHIP_APPLICATION_SUBMITTED', actorName: 'মাওলানা আব্দুল হক চৌধুরী', actorId: 'applicant', timestamp: DateTime.now().subtract(const Duration(days: 3)), previousStatus: 'draft', newStatus: 'submitted', note: 'আবেদন আনুষ্ঠানিকভাবে জমা দেওয়া হয়েছে'),
          ApplicationTimelineEvent(id: 'evt-3', applicationId: 'app-seed-001', event: 'MEMBERSHIP_APPLICATION_REVIEW_STARTED', actorName: 'যাচাইকারী কর্মকর্তা মোর্শেদ', actorId: 'usr-admin-01', timestamp: DateTime.now().subtract(const Duration(days: 1)), previousStatus: 'submitted', newStatus: 'under_review', note: 'কাগজপত্র নিরীক্ষা শুরু হয়েছে'),
        ],
      ),
      MembershipApplication(
        id: 'app-seed-002',
        organizationId: demoOrgId,
        applicationCode: 'APP-000002',
        applicantFullName: 'ক্বারী মোহাম্মদ হাবিবুর রহমান',
        mobile: '01812999002',
        email: 'habib.qari@gmail.com',
        dateOfBirth: DateTime(1994, 8, 20),
        gender: 'male',
        occupation: 'ইমাম ও খতীব',
        fatherOrSpouseName: 'আহমদ উল্লাহ',
        motherName: 'মরিয়ম খাতুন',
        currentAddress: 'ঘোনারপাড়া, কক্সবাজার',
        permanentAddress: 'দক্ষিণ খুরুশকুল, কক্সবাজার সদর',
        isSameAddress: false,
        nid: '19942233445566778',
        notes: 'আবেদনের স্থায়ী ঠিকানার ডকুমেন্টে ত্রুটি থাকায় সংশোধন চাওয়া হয়েছিল।',
        applicationStatus: MembershipApplicationStatus.correctionRequired,
        submittedAt: DateTime.now().subtract(const Duration(days: 5)),
        createdAt: DateTime.now().subtract(const Duration(days: 6)),
        updatedAt: DateTime.now().subtract(const Duration(days: 2)),
        createdBy: 'usr-officer-01',
        correctionReason: 'স্থায়ী ঠিকানার ইউনিয়ন পরিষদ প্রত্যয়নপত্র বা ইউটিলিটি বিলের কপি সংযুক্ত করতে হবে।',
        checklist: [
          VerificationChecklistItem(id: 'chk-1', title: 'পরিচয় তথ্য যাচাই', isVerified: true),
          VerificationChecklistItem(id: 'chk-2', title: 'মোবাইল নম্বর যাচাই', isVerified: true),
          VerificationChecklistItem(id: 'chk-3', title: 'ঠিকানা সরেজমিন যাচাই', isVerified: false, note: 'স্থায়ী ঠিকানার প্রত্যয়ন অসম্পূর্ণ'),
          VerificationChecklistItem(id: 'chk-4', title: 'পারিবারিক তথ্য যাচাই', isVerified: true),
          VerificationChecklistItem(id: 'chk-5', title: 'জাতীয় পরিচয়পত্র (NID) সত্যতা যাচাই', isVerified: true),
          VerificationChecklistItem(id: 'chk-6', title: 'ছবি ও সাক্ষর সঠিকতা', isVerified: true),
        ],
        timeline: [
          ApplicationTimelineEvent(id: 'evt-4', applicationId: 'app-seed-002', event: 'MEMBERSHIP_APPLICATION_CREATED', actorName: 'ফিল্ড অফিসার জাকির', actorId: 'usr-officer-01', timestamp: DateTime.now().subtract(const Duration(days: 6))),
          ApplicationTimelineEvent(id: 'evt-5', applicationId: 'app-seed-002', event: 'MEMBERSHIP_APPLICATION_SUBMITTED', actorName: 'ক্বারী হাবিবুর রহমান', actorId: 'applicant', timestamp: DateTime.now().subtract(const Duration(days: 5)), previousStatus: 'draft', newStatus: 'submitted'),
          ApplicationTimelineEvent(id: 'evt-6', applicationId: 'app-seed-002', event: 'MEMBERSHIP_APPLICATION_CORRECTION_REQUIRED', actorName: 'যাচাইকারী কর্মকর্তা মোর্শেদ', actorId: 'usr-admin-01', timestamp: DateTime.now().subtract(const Duration(days: 2)), previousStatus: 'under_review', newStatus: 'correction_required', note: 'স্থায়ী ঠিকানার প্রমাণাদি চাওয়া হয়েছে'),
        ],
      ),
      MembershipApplication(
        id: 'app-seed-003',
        organizationId: demoOrgId,
        applicationCode: 'APP-000003',
        applicantFullName: 'হাফেজ মোশাররফ হোসেন',
        mobile: '01812999003',
        dateOfBirth: DateTime(1996, 11, 5),
        gender: 'male',
        occupation: 'হাফেজ ও শিক্ষক',
        currentAddress: 'পৌরসভা এলাকা, কক্সবাজার',
        applicationStatus: MembershipApplicationStatus.draft,
        createdAt: DateTime.now().subtract(const Duration(hours: 12)),
        updatedAt: DateTime.now().subtract(const Duration(hours: 12)),
        createdBy: 'usr-officer-02',
        checklist: [],
        timeline: [
          ApplicationTimelineEvent(id: 'evt-7', applicationId: 'app-seed-003', event: 'MEMBERSHIP_APPLICATION_CREATED', actorName: 'ডাটা এন্ট্রি অপারেটর', actorId: 'usr-officer-02', timestamp: DateTime.now().subtract(const Duration(hours: 12)), note: 'প্রাথমিক আবেদন খসড়া সংরক্ষিত'),
        ],
      ),
    ];

    _applicationsByOrg[demoOrgId] = demoApps;
  }

  String _generateNextCode(String organizationId) {
    final list = _applicationsByOrg[organizationId] ?? [];
    final nextNumber = list.length + 1;
    final paddedNumber = nextNumber.toString().padLeft(6, '0');
    return 'APP-$paddedNumber';
  }

  @override
  Future<List<MembershipApplication>> getApplications({
    required String organizationId,
    MembershipApplicationStatus? status,
    String? searchQuery,
  }) async {
    final apps = _applicationsByOrg[organizationId] ?? [];
    return apps.where((app) {
      if (status != null && app.applicationStatus != status) {
        return false;
      }
      if (searchQuery != null && searchQuery.trim().isNotEmpty) {
        final q = searchQuery.toLowerCase().trim();
        final matchName = app.applicantFullName.toLowerCase().contains(q);
        final matchCode = app.applicationCode.toLowerCase().contains(q);
        final matchMobile = app.mobile.contains(q);
        return matchName || matchCode || matchMobile;
      }
      return true;
    }).toList();
  }

  @override
  Future<MembershipApplication?> getApplicationById({
    required String organizationId,
    required String applicationId,
  }) async {
    final apps = _applicationsByOrg[organizationId] ?? [];
    try {
      return apps.firstWhere((a) => a.id == applicationId);
    } catch (_) {
      return null;
    }
  }

  @override
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
  }) async {
    final code = _generateNextCode(organizationId);
    final id = 'app-${DateTime.now().millisecondsSinceEpoch}';

    final defaultChecklist = [
      const VerificationChecklistItem(id: 'chk-1', title: 'পরিচয় তথ্য যাচাই'),
      const VerificationChecklistItem(id: 'chk-2', title: 'মোবাইল নম্বর যাচাই'),
      const VerificationChecklistItem(id: 'chk-3', title: 'ঠিকানা সরেজমিন যাচাই'),
      const VerificationChecklistItem(id: 'chk-4', title: 'পারিবারিক তথ্য যাচাই'),
      const VerificationChecklistItem(id: 'chk-5', title: 'জাতীয় পরিচয়পত্র (NID) সত্যতা যাচাই'),
      const VerificationChecklistItem(id: 'chk-6', title: 'ছবি ও সাক্ষর সঠিকতা'),
    ];

    final newApp = MembershipApplication(
      id: id,
      organizationId: organizationId,
      applicationCode: code,
      applicantFullName: applicantFullName,
      mobile: mobile,
      email: email,
      dateOfBirth: dateOfBirth,
      gender: gender,
      occupation: occupation,
      fatherOrSpouseName: fatherOrSpouseName,
      motherName: motherName,
      currentAddress: currentAddress,
      permanentAddress: permanentAddress,
      isSameAddress: isSameAddress,
      nid: nid,
      photoReference: photoReference,
      notes: notes,
      applicationStatus: MembershipApplicationStatus.draft,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      createdBy: createdBy,
      checklist: defaultChecklist,
      timeline: [
        ApplicationTimelineEvent(
          id: 'evt-${DateTime.now().millisecondsSinceEpoch}',
          applicationId: id,
          event: 'MEMBERSHIP_APPLICATION_CREATED',
          actorName: createdBy,
          actorId: createdBy,
          timestamp: DateTime.now(),
          note: 'সদস্যপদ আবেদন খসড়া তৈরি হয়েছে',
        ),
      ],
    );

    _applicationsByOrg.putIfAbsent(organizationId, () => []).add(newApp);

    _auditRepo?.logSecurityEvent(
      organizationId: organizationId,
      userId: createdBy,
      action: 'MEMBERSHIP_APPLICATION_CREATED',
      resource: 'MembershipApplication',
      status: 'success',
      metadata: {'application_id': id, 'application_code': code},
    );

    return newApp;
  }

  @override
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
  }) async {
    final list = _applicationsByOrg[organizationId] ?? [];
    final index = list.indexWhere((a) => a.id == applicationId);
    if (index == -1) {
      throw Exception('আবেদনটি পাওয়া যায়নি');
    }
    final existing = list[index];

    // টার্মিনাল স্টেট এডিট ব্লক
    if (existing.applicationStatus == MembershipApplicationStatus.approved ||
        existing.applicationStatus == MembershipApplicationStatus.rejected ||
        existing.applicationStatus == MembershipApplicationStatus.withdrawn) {
      throw Exception('অনুমোদিত বা বাতিলকৃত আবেদন সংশোধন করা সম্ভব নয়');
    }

    final updated = existing.copyWith(
      applicantFullName: applicantFullName,
      mobile: mobile,
      email: email,
      dateOfBirth: dateOfBirth,
      gender: gender,
      occupation: occupation,
      fatherOrSpouseName: fatherOrSpouseName,
      motherName: motherName,
      currentAddress: currentAddress,
      permanentAddress: permanentAddress,
      isSameAddress: isSameAddress,
      nid: nid,
      photoReference: photoReference,
      notes: notes,
      updatedBy: updatedBy,
      updatedAt: DateTime.now(),
    );

    list[index] = updated;
    return updated;
  }

  @override
  Future<MembershipApplication> submitApplication({
    required String organizationId,
    required String applicationId,
    required String submittedBy,
  }) async {
    final list = _applicationsByOrg[organizationId] ?? [];
    final index = list.indexWhere((a) => a.id == applicationId);
    if (index == -1) throw Exception('আবেদনটি পাওয়া যায়নি');
    final existing = list[index];

    if (!existing.applicationStatus.canTransitionTo(MembershipApplicationStatus.submitted)) {
      throw Exception('এই অবস্থা থেকে আবেদন জমা দেওয়া সম্ভব নয়');
    }

    // ফিল্ড ভ্যালিডেশন
    if (existing.applicantFullName.trim().isEmpty) {
      throw Exception('আবেদনকারীর পূর্ণ নাম আবশ্যক');
    }
    if (existing.mobile.trim().isEmpty) {
      throw Exception('মোবাইল নম্বর আবশ্যক');
    }

    final timeline = List<ApplicationTimelineEvent>.from(existing.timeline)
      ..add(ApplicationTimelineEvent(
        id: 'evt-${DateTime.now().millisecondsSinceEpoch}',
        applicationId: existing.id,
        event: 'MEMBERSHIP_APPLICATION_SUBMITTED',
        actorName: submittedBy,
        actorId: submittedBy,
        timestamp: DateTime.now(),
        previousStatus: existing.applicationStatus.key,
        newStatus: MembershipApplicationStatus.submitted.key,
        note: 'আবেদন আনুষ্ঠানিকভাবে জমা দেওয়া হয়েছে',
      ));

    final updated = existing.copyWith(
      applicationStatus: MembershipApplicationStatus.submitted,
      submittedAt: DateTime.now(),
      updatedAt: DateTime.now(),
      updatedBy: submittedBy,
      timeline: timeline,
    );

    list[index] = updated;

    _auditRepo?.logSecurityEvent(
      organizationId: organizationId,
      userId: submittedBy,
      action: 'MEMBERSHIP_APPLICATION_SUBMITTED',
      resource: 'MembershipApplication',
      status: 'success',
      metadata: {'application_id': existing.id, 'application_code': existing.applicationCode},
    );

    return updated;
  }

  @override
  Future<MembershipApplication> startReview({
    required String organizationId,
    required String applicationId,
    required String reviewerId,
    required String reviewerName,
  }) async {
    final list = _applicationsByOrg[organizationId] ?? [];
    final index = list.indexWhere((a) => a.id == applicationId);
    if (index == -1) throw Exception('আবেদনটি পাওয়া যায়নি');
    final existing = list[index];

    if (!existing.applicationStatus.canTransitionTo(MembershipApplicationStatus.underReview)) {
      throw Exception('এই আবেদন পর্যালোচনায় নেওয়া সম্ভব নয়');
    }

    final timeline = List<ApplicationTimelineEvent>.from(existing.timeline)
      ..add(ApplicationTimelineEvent(
        id: 'evt-${DateTime.now().millisecondsSinceEpoch}',
        applicationId: existing.id,
        event: 'MEMBERSHIP_APPLICATION_REVIEW_STARTED',
        actorName: reviewerName,
        actorId: reviewerId,
        timestamp: DateTime.now(),
        previousStatus: existing.applicationStatus.key,
        newStatus: MembershipApplicationStatus.underReview.key,
        note: 'যাচাই কার্যক্রম শুরু হয়েছে',
      ));

    final updated = existing.copyWith(
      applicationStatus: MembershipApplicationStatus.underReview,
      verifiedBy: reviewerId,
      verifiedAt: DateTime.now(),
      updatedAt: DateTime.now(),
      updatedBy: reviewerId,
      timeline: timeline,
    );

    list[index] = updated;
    return updated;
  }

  @override
  Future<MembershipApplication> updateChecklist({
    required String organizationId,
    required String applicationId,
    required List<VerificationChecklistItem> checklist,
    required String updatedBy,
  }) async {
    final list = _applicationsByOrg[organizationId] ?? [];
    final index = list.indexWhere((a) => a.id == applicationId);
    if (index == -1) throw Exception('আবেদনটি পাওয়া যায়নি');
    final existing = list[index];

    final updated = existing.copyWith(
      checklist: checklist,
      updatedAt: DateTime.now(),
      updatedBy: updatedBy,
    );

    list[index] = updated;
    return updated;
  }

  @override
  Future<MembershipApplication> requestCorrection({
    required String organizationId,
    required String applicationId,
    required String reviewerId,
    required String reviewerName,
    required String correctionReason,
  }) async {
    if (correctionReason.trim().isEmpty) {
      throw Exception('সংশোধনের সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক');
    }

    final list = _applicationsByOrg[organizationId] ?? [];
    final index = list.indexWhere((a) => a.id == applicationId);
    if (index == -1) throw Exception('আবেদনটি পাওয়া যায়নি');
    final existing = list[index];

    if (!existing.applicationStatus.canTransitionTo(MembershipApplicationStatus.correctionRequired)) {
      throw Exception('এই অবস্থায় সংশোধন চাওয়া সম্ভব নয়');
    }

    final timeline = List<ApplicationTimelineEvent>.from(existing.timeline)
      ..add(ApplicationTimelineEvent(
        id: 'evt-${DateTime.now().millisecondsSinceEpoch}',
        applicationId: existing.id,
        event: 'MEMBERSHIP_APPLICATION_CORRECTION_REQUIRED',
        actorName: reviewerName,
        actorId: reviewerId,
        timestamp: DateTime.now(),
        previousStatus: existing.applicationStatus.key,
        newStatus: MembershipApplicationStatus.correctionRequired.key,
        note: correctionReason,
      ));

    final updated = existing.copyWith(
      applicationStatus: MembershipApplicationStatus.correctionRequired,
      correctionReason: correctionReason,
      updatedAt: DateTime.now(),
      updatedBy: reviewerId,
      timeline: timeline,
    );

    list[index] = updated;

    _auditRepo?.logSecurityEvent(
      organizationId: organizationId,
      userId: reviewerId,
      action: 'MEMBERSHIP_APPLICATION_CORRECTION_REQUIRED',
      resource: 'MembershipApplication',
      status: 'success',
      metadata: {'application_id': existing.id, 'reason': correctionReason},
    );

    return updated;
  }

  @override
  Future<MembershipApplication> resubmitApplication({
    required String organizationId,
    required String applicationId,
    required String submittedBy,
    String? note,
  }) async {
    final list = _applicationsByOrg[organizationId] ?? [];
    final index = list.indexWhere((a) => a.id == applicationId);
    if (index == -1) throw Exception('আবেদনটি পাওয়া যায়নি');
    final existing = list[index];

    if (!existing.applicationStatus.canTransitionTo(MembershipApplicationStatus.resubmitted)) {
      throw Exception('এই অবস্থায় আবেদন পুনঃজমা দেওয়া সম্ভব নয়');
    }

    final timeline = List<ApplicationTimelineEvent>.from(existing.timeline)
      ..add(ApplicationTimelineEvent(
        id: 'evt-${DateTime.now().millisecondsSinceEpoch}',
        applicationId: existing.id,
        event: 'MEMBERSHIP_APPLICATION_RESUBMITTED',
        actorName: submittedBy,
        actorId: submittedBy,
        timestamp: DateTime.now(),
        previousStatus: existing.applicationStatus.key,
        newStatus: MembershipApplicationStatus.resubmitted.key,
        note: note ?? 'সংশোধিত তথ্যসহ পুনরায় জমা দেওয়া হয়েছে',
      ));

    final updated = existing.copyWith(
      applicationStatus: MembershipApplicationStatus.resubmitted,
      updatedAt: DateTime.now(),
      updatedBy: submittedBy,
      timeline: timeline,
    );

    list[index] = updated;
    return updated;
  }

  @override
  Future<MembershipApplication> approveApplication({
    required String organizationId,
    required String applicationId,
    required String approverId,
    required String approverName,
    required String decisionReason,
  }) async {
    final list = _applicationsByOrg[organizationId] ?? [];
    final index = list.indexWhere((a) => a.id == applicationId);
    if (index == -1) throw Exception('আবেদনটি পাওয়া যায়নি');
    final existing = list[index];

    // Concurrency & duplicate approval check
    if (existing.applicationStatus == MembershipApplicationStatus.approved) {
      throw Exception('আবেদনটি ইতোমধ্যে অনুমোদিত হয়েছে');
    }

    if (!existing.applicationStatus.canTransitionTo(MembershipApplicationStatus.approved)) {
      throw Exception('এই অবস্থা থেকে আবেদন অনুমোদন করা সম্ভব নয়');
    }

    // Separation of Duties: Creator cannot approve their own application
    if (existing.createdBy != null && existing.createdBy == approverId) {
      throw Exception('নিরাপত্তা নীতি: আবেদনকারী বা তৈরিকারী কর্মকর্তা নিজের তৈরিকৃত আবেদন নিজে অনুমোদন করতে পারেন না');
    }

    final newMemberId = 'mem-${DateTime.now().millisecondsSinceEpoch}';

    final timeline = List<ApplicationTimelineEvent>.from(existing.timeline)
      ..add(ApplicationTimelineEvent(
        id: 'evt-${DateTime.now().millisecondsSinceEpoch}',
        applicationId: existing.id,
        event: 'MEMBERSHIP_APPLICATION_APPROVED',
        actorName: approverName,
        actorId: approverId,
        timestamp: DateTime.now(),
        previousStatus: existing.applicationStatus.key,
        newStatus: MembershipApplicationStatus.approved.key,
        note: decisionReason.isNotEmpty ? decisionReason : 'সদস্যপদ আবেদন অনুমোদিত ও সদস্য রেকর্ড তৈরি হয়েছে',
      ))
      ..add(ApplicationTimelineEvent(
        id: 'evt-mem-${DateTime.now().millisecondsSinceEpoch}',
        applicationId: existing.id,
        event: 'MEMBER_CREATED_FROM_APPLICATION',
        actorName: approverName,
        actorId: approverId,
        timestamp: DateTime.now(),
        note: 'নতুন সদস্য কোড বরাদ্দ সম্পন্ন',
      ));

    final updated = existing.copyWith(
      applicationStatus: MembershipApplicationStatus.approved,
      decidedAt: DateTime.now(),
      decidedBy: approverId,
      decisionReason: decisionReason,
      approvedMemberId: newMemberId,
      updatedAt: DateTime.now(),
      updatedBy: approverId,
      timeline: timeline,
    );

    list[index] = updated;

    _auditRepo?.logSecurityEvent(
      organizationId: organizationId,
      userId: approverId,
      action: 'MEMBERSHIP_APPLICATION_APPROVED',
      resource: 'MembershipApplication',
      status: 'success',
      metadata: {'application_id': existing.id, 'approved_member_id': newMemberId},
    );

    return updated;
  }

  @override
  Future<MembershipApplication> rejectApplication({
    required String organizationId,
    required String applicationId,
    required String rejecterId,
    required String rejecterName,
    required String rejectionReason,
  }) async {
    if (rejectionReason.trim().isEmpty) {
      throw Exception('প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক');
    }

    final list = _applicationsByOrg[organizationId] ?? [];
    final index = list.indexWhere((a) => a.id == applicationId);
    if (index == -1) throw Exception('আবেদনটি পাওয়া যায়নি');
    final existing = list[index];

    if (!existing.applicationStatus.canTransitionTo(MembershipApplicationStatus.rejected)) {
      throw Exception('এই অবস্থায় আবেদন প্রত্যাখ্যান করা সম্ভব নয়');
    }

    final timeline = List<ApplicationTimelineEvent>.from(existing.timeline)
      ..add(ApplicationTimelineEvent(
        id: 'evt-${DateTime.now().millisecondsSinceEpoch}',
        applicationId: existing.id,
        event: 'MEMBERSHIP_APPLICATION_REJECTED',
        actorName: rejecterName,
        actorId: rejecterId,
        timestamp: DateTime.now(),
        previousStatus: existing.applicationStatus.key,
        newStatus: MembershipApplicationStatus.rejected.key,
        note: rejectionReason,
      ));

    final updated = existing.copyWith(
      applicationStatus: MembershipApplicationStatus.rejected,
      decidedAt: DateTime.now(),
      decidedBy: rejecterId,
      decisionReason: rejectionReason,
      updatedAt: DateTime.now(),
      updatedBy: rejecterId,
      timeline: timeline,
    );

    list[index] = updated;

    _auditRepo?.logSecurityEvent(
      organizationId: organizationId,
      userId: rejecterId,
      action: 'MEMBERSHIP_APPLICATION_REJECTED',
      resource: 'MembershipApplication',
      status: 'success',
      metadata: {'application_id': existing.id, 'reason': rejectionReason},
    );

    return updated;
  }

  @override
  Future<MembershipApplication> withdrawApplication({
    required String organizationId,
    required String applicationId,
    required String requesterId,
    required String withdrawalReason,
  }) async {
    final list = _applicationsByOrg[organizationId] ?? [];
    final index = list.indexWhere((a) => a.id == applicationId);
    if (index == -1) throw Exception('আবেদনটি পাওয়া যায়নি');
    final existing = list[index];

    if (!existing.applicationStatus.canTransitionTo(MembershipApplicationStatus.withdrawn)) {
      throw Exception('বর্তমান স্ট্যাটাস থেকে আবেদন প্রত্যাহার করা সম্ভব নয়');
    }

    final timeline = List<ApplicationTimelineEvent>.from(existing.timeline)
      ..add(ApplicationTimelineEvent(
        id: 'evt-${DateTime.now().millisecondsSinceEpoch}',
        applicationId: existing.id,
        event: 'MEMBERSHIP_APPLICATION_WITHDRAWN',
        actorName: requesterId,
        actorId: requesterId,
        timestamp: DateTime.now(),
        previousStatus: existing.applicationStatus.key,
        newStatus: MembershipApplicationStatus.withdrawn.key,
        note: withdrawalReason.isNotEmpty ? withdrawalReason : 'আবেদন প্রত্যাহার করা হয়েছে',
      ));

    final updated = existing.copyWith(
      applicationStatus: MembershipApplicationStatus.withdrawn,
      decidedAt: DateTime.now(),
      decidedBy: requesterId,
      decisionReason: withdrawalReason,
      updatedAt: DateTime.now(),
      updatedBy: requesterId,
      timeline: timeline,
    );

    list[index] = updated;

    _auditRepo?.logSecurityEvent(
      organizationId: organizationId,
      userId: requesterId,
      action: 'MEMBERSHIP_APPLICATION_WITHDRAWN',
      resource: 'MembershipApplication',
      status: 'success',
      metadata: {'application_id': existing.id, 'reason': withdrawalReason},
    );

    return updated;
  }

  @override
  Future<Map<String, dynamic>> checkDuplicates({
    required String organizationId,
    required String mobile,
    String? nid,
    String? fullName,
    DateTime? dateOfBirth,
  }) async {
    final apps = _applicationsByOrg[organizationId] ?? [];

    // Check active duplicate applications
    MembershipApplication? duplicateApp;
    for (final app in apps) {
      if (app.applicationStatus.isActive) {
        if (app.mobile == mobile) {
          duplicateApp = app;
          break;
        }
        if (nid != null && nid.isNotEmpty && app.nid != null && app.nid == nid) {
          duplicateApp = app;
          break;
        }
      }
    }

    return {
      'has_duplicate_active_application': duplicateApp != null,
      'duplicate_application_code': duplicateApp?.applicationCode,
      'duplicate_application_status': duplicateApp?.applicationStatus.banglaLabel,
    };
  }
}
