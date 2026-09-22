import 'dart:async';
import '../../domain/entities/member.dart';
import '../../domain/entities/member_audit_record.dart';
import '../../domain/entities/member_status.dart';
import '../../domain/repositories/member_repository.dart';
import '../../../security_audit/data/repositories/security_audit_repository_impl.dart';
import '../../../security_audit/domain/entities/security_audit_record.dart';
import '../../../security_audit/domain/entities/security_event.dart';

/// MemberRepositoryImpl: সদস্য ব্যবস্থাপনা রিপোজিটরি বাস্তবায়ন
///
/// **আর্কিটেকচার ও নিরাপত্তা নীতি:**
/// ১. Multi-tenant Isolation: প্রতিটি অর্গানাইজেশনের সদস্য ডাটা সম্পূর্ণ আলাদা।
/// ২. Member ≠ User: সদস্যদের স্বাধীন ডোমেইন পরিচয় ও আইসোলেশন।
/// ৩. Immutable Member Code ও ID: স্বয়ংক্রিয়ভাবে জেনারেটেড ও অপরিবর্তনীয়।
/// ৪. Hard Delete Prohibited: স্থায়ীভাবে মুছে ফেলা নিষিদ্ধ, শুধুমাত্র লাইফসাইকেল ট্রানজিশন সমর্থিত।
/// ৫. সেন্ট্রালাইজড সিকিউরিটি অডিট ইন্টিগ্রেশন।
class MemberRepositoryImpl implements MemberRepository {
  static MemberRepositoryImpl? _instance;
  static MemberRepositoryImpl get instance => _instance ??= MemberRepositoryImpl();

  // মেমোরি স্টোরেজ: অর্গানাইজেশনভিত্তিক সদস্য তালিকা
  final Map<String, List<Member>> _orgMembers = {};

  // স্ট্যাটাস অডিট লগ: অর্গানাইজেশনভিত্তিক
  final Map<String, List<MemberStatusAuditRecord>> _orgStatusAudits = {};

  MemberRepositoryImpl() {
    _seedDefaultOrganization();
  }

  /// ডেমো অর্গানাইজেশনের নমুনা সদস্য ডেটা (নমুনা হিসেবে ব্যবহৃত)
  void _seedDefaultOrganization() {
    const defaultOrgId = 'demo_org_khurushkul';

    _orgMembers[defaultOrgId] = [
      Member(
        id: 'mem_001_khurushkul',
        organizationId: defaultOrgId,
        memberCode: 'MEM-000001',
        fullName: 'মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
        mobile: '01812000001',
        email: 'ibrahim.khalil@example.com',
        dateOfBirth: DateTime(1985, 3, 15),
        gender: 'male',
        occupation: 'মাদ্রাসা শিক্ষক ও খতিব',
        fatherOrSpouseName: 'হাফেজ আহমদ উল্লাহ',
        motherName: 'মরিয়ম খাতুন',
        nid: '19851234567890123',
        currentAddress: 'খুরুশকুল বাজার, কক্সবাজার সদর, কক্সবাজার',
        permanentAddress: 'খুরুশকুল বাজার, কক্সবাজার সদর, কক্সবাজার',
        isSameAddress: true,
        address: 'খুরুশকুল বাজার, কক্সবাজার সদর, কক্সবাজার',
        status: MemberStatus.active,
        joinedAt: DateTime(2023, 1, 1),
        createdAt: DateTime(2023, 1, 1, 10, 0),
        updatedAt: DateTime(2023, 1, 1, 10, 0),
        createdBy: 'system_bootstrap',
        updatedBy: 'system_bootstrap',
        notes: 'প্রতিষ্ঠাতা সদস্য ও নিয়মিত সক্রিয় সদস্য',
      ),
      Member(
        id: 'mem_002_khurushkul',
        organizationId: defaultOrgId,
        memberCode: 'MEM-000002',
        fullName: 'কারী ফজলুল করিম',
        mobile: '01812000002',
        email: 'fazlul.karim@example.com',
        dateOfBirth: DateTime(1988, 7, 22),
        gender: 'male',
        occupation: 'ব্যবসায়ী ও খামার পরিচালক',
        fatherOrSpouseName: 'মৌলভী নূরুল ইসলাম',
        motherName: 'ফাতেমা বেগম',
        nid: '19881234567890456',
        currentAddress: 'মনু পাড়া, খুরুশকুল, কক্সবাজার',
        permanentAddress: 'মনু পাড়া, খুরুশকুল, কক্সবাজার',
        isSameAddress: true,
        address: 'মনু পাড়া, খুরুশকুল, কক্সবাজার',
        status: MemberStatus.active,
        joinedAt: DateTime(2023, 2, 10),
        createdAt: DateTime(2023, 2, 10, 11, 30),
        updatedAt: DateTime(2023, 2, 10, 11, 30),
        createdBy: 'system_bootstrap',
        updatedBy: 'system_bootstrap',
        notes: 'আর্থিক পরামর্শক কমিটির সদস্য',
      ),
      Member(
        id: 'mem_003_khurushkul',
        organizationId: defaultOrgId,
        memberCode: 'MEM-000003',
        fullName: 'হাফেজ মুহাম্মদ শোয়াইব',
        mobile: '01812000003',
        email: 'shoaib.qari@example.com',
        dateOfBirth: DateTime(1992, 11, 5),
        gender: 'male',
        occupation: 'হিসাব কর্মকর্তা',
        fatherOrSpouseName: 'আলী আহমদ চৌধুরী',
        motherName: 'আয়েশা সিদ্দিকা',
        nid: '19921234567890789',
        currentAddress: 'তেতৈয়া, খুরুশকুল, কক্সবাজার সদর',
        permanentAddress: 'তেতৈয়া, খুরুশকুল, কক্সবাজার সদর',
        isSameAddress: true,
        address: 'তেতৈয়া, খুরুশকুল, কক্সবাজার সদর',
        status: MemberStatus.active,
        joinedAt: DateTime(2023, 3, 15),
        createdAt: DateTime(2023, 3, 15, 9, 15),
        updatedAt: DateTime(2023, 3, 15, 9, 15),
        createdBy: 'system_bootstrap',
        updatedBy: 'system_bootstrap',
        notes: 'হিসাব শাখায় কর্মরত',
      ),
      Member(
        id: 'mem_004_khurushkul',
        organizationId: defaultOrgId,
        memberCode: 'MEM-000004',
        fullName: 'মাওলানা সিরাজুল ইসলাম',
        mobile: '01812000004',
        email: 'sirajul.islam@example.com',
        dateOfBirth: DateTime(1978, 5, 12),
        gender: 'male',
        occupation: 'ইমাম ও শিক্ষক',
        fatherOrSpouseName: 'মরহুম আব্দুল গফুর',
        motherName: 'খায়রুন্নেসা',
        nid: '19781234567890111',
        currentAddress: 'পূর্ব খুরুশকুল, কক্সবাজার',
        permanentAddress: 'পূর্ব খুরুশকুল, কক্সবাজার',
        isSameAddress: true,
        address: 'পূর্ব খুরুশকুল, কক্সবাজার',
        status: MemberStatus.inactive,
        joinedAt: DateTime(2023, 5, 1),
        createdAt: DateTime(2023, 5, 1, 14, 0),
        updatedAt: DateTime(2024, 1, 10, 10, 0),
        createdBy: 'system_bootstrap',
        updatedBy: 'system_bootstrap',
        notes: 'অধ্যয়নের জন্য সাময়িক অনুপস্থিত',
      ),
      Member(
        id: 'mem_005_khurushkul',
        organizationId: defaultOrgId,
        memberCode: 'MEM-000005',
        fullName: 'মুহাম্মদ তারেক জামিল',
        mobile: '01812000005',
        email: 'tariq.jamil@example.com',
        dateOfBirth: DateTime(1995, 9, 18),
        gender: 'male',
        occupation: 'আইটি উদ্যোক্তা',
        fatherOrSpouseName: 'ডা. রফিক আহমদ',
        motherName: 'হাসিনা বেগম',
        nid: '19951234567890222',
        currentAddress: 'ঝিলংজা, কক্সবাজার সদর',
        permanentAddress: 'মনু পাড়া, খুরুশকুল, কক্সবাজার',
        isSameAddress: false,
        address: 'ঝিলংজা, কক্সবাজার সদর',
        status: MemberStatus.suspended,
        joinedAt: DateTime(2023, 6, 20),
        createdAt: DateTime(2023, 6, 20, 16, 20),
        updatedAt: DateTime(2024, 2, 1, 12, 0),
        createdBy: 'system_bootstrap',
        updatedBy: 'system_bootstrap',
        notes: 'নিয়ম লঙ্ঘনের তদন্তের কারণে স্থগিত',
      ),
      Member(
        id: 'mem_006_khurushkul',
        organizationId: defaultOrgId,
        memberCode: 'MEM-000006',
        fullName: 'মরহুম আলহাজ্ব আবুল কাশেম',
        mobile: '01812000006',
        email: null,
        dateOfBirth: DateTime(1960, 1, 10),
        gender: 'male',
        occupation: 'অবসরপ্রাপ্ত সরকারি কর্মকর্তা',
        fatherOrSpouseName: 'মরহুম মৌলভী জালাল আহমদ',
        motherName: 'আমেনা খাতুন',
        nid: '19601234567890333',
        currentAddress: 'মধ্যম খুরুশকুল, কক্সবাজার',
        permanentAddress: 'মধ্যম খুরুশকুল, কক্সবাজার',
        isSameAddress: true,
        address: 'মধ্যম খুরুশকুল, কক্সবাজার',
        status: MemberStatus.archived,
        joinedAt: DateTime(2023, 1, 1),
        createdAt: DateTime(2023, 1, 1, 10, 0),
        updatedAt: DateTime(2024, 3, 1, 15, 0),
        createdBy: 'system_bootstrap',
        updatedBy: 'system_bootstrap',
        notes: 'ইন্তেকাল করায় সদস্যপদ সংরক্ষিতভাবে আর্কাইভ করা হয়েছে',
      ),
    ];

    _orgStatusAudits[defaultOrgId] = [
      MemberStatusAuditRecord(
        id: 'aud_status_004',
        organizationId: defaultOrgId,
        memberId: 'mem_004_khurushkul',
        memberCode: 'MEM-000004',
        previousStatus: MemberStatus.active,
        newStatus: MemberStatus.inactive,
        reason: 'উচ্চতর শিক্ষার জন্য অন্য জেলায় অবস্থান করায় আবেদনক্রমে সাময়িক নিষ্ক্রিয়',
        changedByUserId: 'usr_002_secretary',
        changedByName: 'মাস্টার শামসুল হুদা',
        timestamp: DateTime(2024, 1, 10, 10, 0),
      ),
      MemberStatusAuditRecord(
        id: 'aud_status_005',
        organizationId: defaultOrgId,
        memberId: 'mem_005_khurushkul',
        memberCode: 'MEM-000005',
        previousStatus: MemberStatus.active,
        newStatus: MemberStatus.suspended,
        reason: 'কার্যনির্বাহী সভার সিদ্ধান্ত অনুযায়ী শৃঙ্খলাভঙ্গের অভিযোগে স্থগিত',
        changedByUserId: 'usr_001_super_admin',
        changedByName: 'মাওলানা আব্দুল্লাহ',
        timestamp: DateTime(2024, 2, 1, 12, 0),
      ),
      MemberStatusAuditRecord(
        id: 'aud_status_006',
        organizationId: defaultOrgId,
        memberId: 'mem_006_khurushkul',
        memberCode: 'MEM-000006',
        previousStatus: MemberStatus.active,
        newStatus: MemberStatus.archived,
        reason: 'সদস্যের ইন্তেকালের পর উত্তরাধিকারীদের হিসাব নিষ্পত্তির জন্য আর্কাইভ',
        changedByUserId: 'usr_001_super_admin',
        changedByName: 'মাওলানা আব্দুল্লাহ',
        timestamp: DateTime(2024, 3, 1, 15, 0),
      ),
    ];
  }

  /// নতুন মেম্বার কোড জেনারেশন (e.g., MEM-000007)
  String _generateNextMemberCode(String organizationId) {
    final list = _orgMembers[organizationId] ?? [];
    int maxNumber = 0;
    for (final m in list) {
      final code = m.memberCode;
      if (code.startsWith('MEM-')) {
        final numPart = int.tryParse(code.replaceFirst('MEM-', ''));
        if (numPart != null && numPart > maxNumber) {
          maxNumber = numPart;
        }
      }
    }
    final nextNum = maxNumber + 1;
    return 'MEM-${nextNum.toString().padLeft(6, '0')}';
  }

  @override
  Future<List<Member>> getMembers({
    required String organizationId,
    MemberStatus? status,
    String? searchQuery,
    int page = 1,
    int limit = 50,
  }) async {
    final list = _orgMembers[organizationId] ?? [];
    var filtered = list.toList();

    if (status != null) {
      filtered = filtered.where((m) => m.status == status).toList();
    }

    if (searchQuery != null && searchQuery.trim().isNotEmpty) {
      final query = searchQuery.trim().toLowerCase();
      filtered = filtered.where((m) {
        return m.fullName.toLowerCase().contains(query) ||
            m.memberCode.toLowerCase().contains(query) ||
            m.mobile.contains(query) ||
            (m.nid != null && m.nid!.contains(query)) ||
            (m.occupation != null && m.occupation!.toLowerCase().contains(query));
      }).toList();
    }

    // সাজানো: নতুন সদস্য বা মেম্বার কোড ক্রমানুসারে
    filtered.sort((a, b) => a.memberCode.compareTo(b.memberCode));

    final startIndex = (page - 1) * limit;
    if (startIndex >= filtered.length) {
      return [];
    }
    final endIndex = (startIndex + limit) > filtered.length
        ? filtered.length
        : (startIndex + limit);

    return filtered.sublist(startIndex, endIndex);
  }

  @override
  Future<Member?> getMemberById({
    required String organizationId,
    required String memberId,
  }) async {
    final list = _orgMembers[organizationId] ?? [];
    try {
      return list.firstWhere((m) => m.id == memberId);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<Member?> getMemberByCode({
    required String organizationId,
    required String memberCode,
  }) async {
    final list = _orgMembers[organizationId] ?? [];
    try {
      return list.firstWhere(
        (m) => m.memberCode.toLowerCase() == memberCode.trim().toLowerCase(),
      );
    } catch (_) {
      return null;
    }
  }

  @override
  Future<Member> createMember({
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
    String? currentAddress,
    String? permanentAddress,
    bool isSameAddress = false,
    String? address,
    DateTime? joinedAt,
    String? photoUrl,
    String? notes,
    required String actorUserId,
    required String actorName,
  }) async {
    if (fullName.trim().isEmpty) {
      throw ArgumentError('সদস্যের পূর্ণ নাম আবশ্যক');
    }

    final sanitizedMobile = mobile.trim();
    if (!RegExp(r'^(?:\+8801|01)[3-9]\d{8}$').hasMatch(sanitizedMobile)) {
      throw ArgumentError('সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 01711000000)');
    }

    final list = _orgMembers.putIfAbsent(organizationId, () => []);

    // ডুপ্লিকেট মোবাইল নম্বর চেক
    final existingMobile = list.any((m) => m.mobile == sanitizedMobile);
    if (existingMobile) {
      throw StateError('এই মোবাইল নম্বর দিয়ে এই প্রতিষ্ঠানে ইতোমধ্যে সদস্য বিদ্যমান');
    }

    final memberCode = _generateNextMemberCode(organizationId);
    final now = DateTime.now();
    final newId = 'mem_${now.millisecondsSinceEpoch}_${memberCode.toLowerCase()}';

    final effCurrentAddress = currentAddress?.trim().isNotEmpty == true 
        ? currentAddress!.trim() 
        : (address?.trim().isNotEmpty == true ? address!.trim() : null);
    final effPermanentAddress = isSameAddress 
        ? effCurrentAddress 
        : (permanentAddress?.trim().isNotEmpty == true ? permanentAddress!.trim() : null);

    final member = Member(
      id: newId,
      organizationId: organizationId,
      memberCode: memberCode,
      fullName: fullName.trim(),
      mobile: sanitizedMobile,
      email: email?.trim().isNotEmpty == true ? email!.trim() : null,
      dateOfBirth: dateOfBirth,
      gender: gender ?? 'male',
      occupation: occupation?.trim().isNotEmpty == true ? occupation!.trim() : null,
      fatherOrSpouseName: fatherOrSpouseName?.trim().isNotEmpty == true
          ? fatherOrSpouseName!.trim()
          : null,
      motherName: motherName?.trim().isNotEmpty == true ? motherName!.trim() : null,
      nid: nid?.trim().isNotEmpty == true ? nid!.trim() : null,
      currentAddress: effCurrentAddress,
      permanentAddress: effPermanentAddress,
      isSameAddress: isSameAddress,
      address: effCurrentAddress,
      photoUrl: photoUrl,
      status: MemberStatus.active,
      joinedAt: joinedAt ?? now,
      createdAt: now,
      updatedAt: now,
      createdBy: actorUserId,
      updatedBy: actorUserId,
      notes: notes?.trim().isNotEmpty == true ? notes!.trim() : null,
    );

    list.add(member);

    // সেন্ট্রাল সিকিউরিটি অডিট তৈরি (NID বা সংবেদনশীল ডাটা প্লেনটেক্সট রাখা নিষিদ্ধ)
    SecurityAuditRepositoryImpl.instance.recordAudit(
      organizationId: organizationId,
      actorUserId: actorUserId,
      actorName: actorName,
      eventType: SecurityEventType.memberCreated,
      action: 'সদস্য নিবন্ধন',
      targetType: 'Member',
      targetId: member.id,
      result: SecurityEventResult.success,
      reason: 'নতুন সদস্য নিবন্ধন সম্পন্ন',
      newState: 'Code: ${member.memberCode}, Name: ${member.fullName}, Mobile: ${member.mobile}',
    );

    return member;
  }

  @override
  Future<Member> updateMember({
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
    String? currentAddress,
    String? permanentAddress,
    bool isSameAddress = false,
    String? address,
    String? photoUrl,
    String? notes,
    required String actorUserId,
    required String actorName,
  }) async {
    final list = _orgMembers[organizationId] ?? [];
    final index = list.indexWhere((m) => m.id == memberId);
    if (index == -1) {
      throw StateError('সদস্য পাওয়া যায়নি (ID: $memberId)');
    }

    if (fullName.trim().isEmpty) {
      throw ArgumentError('সদস্যের পূর্ণ নাম আবশ্যক');
    }

    final sanitizedMobile = mobile.trim();
    if (!RegExp(r'^(?:\+8801|01)[3-9]\d{8}$').hasMatch(sanitizedMobile)) {
      throw ArgumentError('সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 01711000000)');
    }

    // অন্য কোনো সদস্যের একই মোবাইল নম্বর আছে কি না যাচাই
    final duplicateMobile = list.any(
      (m) => m.id != memberId && m.mobile == sanitizedMobile,
    );
    if (duplicateMobile) {
      throw StateError('অন্য একজন সদস্য ইতোমধ্যে এই মোবাইল নম্বরটি ব্যবহার করছেন');
    }

    final currentMember = list[index];
    final effCurrentAddress = currentAddress?.trim().isNotEmpty == true 
        ? currentAddress!.trim() 
        : (address?.trim().isNotEmpty == true ? address!.trim() : currentMember.currentAddress);
    final effPermanentAddress = isSameAddress 
        ? effCurrentAddress 
        : (permanentAddress?.trim().isNotEmpty == true ? permanentAddress!.trim() : currentMember.permanentAddress);

    final updated = currentMember.copyWith(
      fullName: fullName.trim(),
      mobile: sanitizedMobile,
      email: email?.trim().isNotEmpty == true ? email!.trim() : null,
      dateOfBirth: dateOfBirth,
      gender: gender ?? currentMember.gender,
      occupation: occupation?.trim().isNotEmpty == true ? occupation!.trim() : null,
      fatherOrSpouseName: fatherOrSpouseName?.trim().isNotEmpty == true
          ? fatherOrSpouseName!.trim()
          : null,
      motherName: motherName?.trim().isNotEmpty == true ? motherName!.trim() : null,
      nid: nid?.trim().isNotEmpty == true ? nid!.trim() : null,
      currentAddress: effCurrentAddress,
      permanentAddress: effPermanentAddress,
      isSameAddress: isSameAddress,
      address: effCurrentAddress,
      photoUrl: photoUrl ?? currentMember.photoUrl,
      notes: notes?.trim().isNotEmpty == true ? notes!.trim() : null,
      updatedAt: DateTime.now(),
      updatedBy: actorUserId,
    );

    list[index] = updated;

    // সেন্ট্রাল সিকিউরিটি অডিট (মাস্কড ও সংবেদনশীলতাহীন লগ)
    SecurityAuditRepositoryImpl.instance.recordAudit(
      organizationId: organizationId,
      actorUserId: actorUserId,
      actorName: actorName,
      eventType: SecurityEventType.memberUpdated,
      action: 'সদস্য তথ্য হালনাগাদ',
      targetType: 'Member',
      targetId: currentMember.id,
      result: SecurityEventResult.success,
      previousState: 'Name: ${currentMember.fullName}, Mobile: ${currentMember.mobile}',
      newState: 'Name: ${updated.fullName}, Mobile: ${updated.mobile}',
      reason: 'প্রোফাইল তথ্য সংশোধন',
    );

    return updated;
  }

  @override
  Future<Member> changeMemberStatus({
    required String organizationId,
    required String memberId,
    required MemberStatus newStatus,
    required String reason,
    required String actorUserId,
    required String actorName,
  }) async {
    if (reason.trim().isEmpty) {
      throw ArgumentError('স্ট্যাটাস পরিবর্তনের জন্য কারণ উল্লেখ করা আবশ্যক');
    }

    final list = _orgMembers[organizationId] ?? [];
    final index = list.indexWhere((m) => m.id == memberId);
    if (index == -1) {
      throw StateError('সদস্য পাওয়া যায়নি');
    }

    final currentMember = list[index];
    if (currentMember.status == newStatus) {
      return currentMember; // কোনো পরিবর্তন প্রয়োজন নেই
    }

    final previousStatus = currentMember.status;
    final now = DateTime.now();

    final updated = currentMember.copyWith(
      status: newStatus,
      updatedAt: now,
      updatedBy: actorUserId,
    );

    list[index] = updated;

    // ১. মেম্বার স্ট্যাটাস অডিট ট্রেইল সংরক্ষণ
    final auditList = _orgStatusAudits.putIfAbsent(organizationId, () => []);
    final statusAudit = MemberStatusAuditRecord(
      id: 'mem_aud_${now.millisecondsSinceEpoch}',
      organizationId: organizationId,
      memberId: memberId,
      memberCode: currentMember.memberCode,
      previousStatus: previousStatus,
      newStatus: newStatus,
      reason: reason.trim(),
      changedByUserId: actorUserId,
      changedByName: actorName,
      timestamp: now,
    );
    auditList.add(statusAudit);

    // ২. সেন্ট্রাল সিকিউরিটি অডিট ইভেন্ট তৈরি
    SecurityAuditRepositoryImpl.instance.recordAudit(
      organizationId: organizationId,
      actorUserId: actorUserId,
      actorName: actorName,
      eventType: SecurityEventType.memberStatusChanged,
      action: 'সদস্য স্ট্যাটাস পরিবর্তন',
      targetType: 'Member',
      targetId: currentMember.id,
      result: SecurityEventResult.success,
      previousState: previousStatus.banglaName,
      newState: newStatus.banglaName,
      reason: reason.trim(),
    );

    return updated;
  }

  @override
  Future<List<MemberStatusAuditRecord>> getMemberStatusAudits({
    required String organizationId,
    required String memberId,
  }) async {
    final list = _orgStatusAudits[organizationId] ?? [];
    return list.where((a) => a.memberId == memberId).toList()
      ..sort((a, b) => b.timestamp.compareTo(a.timestamp));
  }

  @override
  Future<int> getTotalMembersCount({
    required String organizationId,
  }) async {
    return (_orgMembers[organizationId] ?? []).length;
  }

  @override
  Future<Map<MemberStatus, int>> getMemberCountByStatus({
    required String organizationId,
  }) async {
    final list = _orgMembers[organizationId] ?? [];
    final map = <MemberStatus, int>{
      MemberStatus.active: 0,
      MemberStatus.inactive: 0,
      MemberStatus.suspended: 0,
      MemberStatus.archived: 0,
    };
    for (final m in list) {
      map[m.status] = (map[m.status] ?? 0) + 1;
    }
    return map;
  }
}
