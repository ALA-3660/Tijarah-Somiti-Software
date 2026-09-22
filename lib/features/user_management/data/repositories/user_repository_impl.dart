import 'dart:async';
import '../../../../core/authorization/authorization_service.dart';
import '../../../../core/authorization/permission_catalog.dart';
import '../../../../domain/entities/managed_user.dart';
import '../../../../domain/entities/role.dart';
import '../../../../domain/entities/user_status.dart';
import '../entities/user_audits.dart';
import '../../domain/repositories/user_repository.dart';
import '../../../security_audit/data/repositories/security_audit_repository_impl.dart';
import '../../../security_audit/domain/entities/security_audit_record.dart';
import '../../../security_audit/domain/entities/security_event.dart';

/// UserRepositoryImpl: ব্যবহারকারী ব্যবস্থাপনা রিপোজিটরি বাস্তবায়ন
///
/// **নিরাপত্তা ও আর্কিটেকচার নীতি:**
/// ১. Multi-tenant Isolation: প্রতিটি অর্গানাইজেশনের ডেটা সম্পূর্ণ পৃথক।
/// ২. Self Privilege Escalation Protection: নিজের ভূমিকা নিজে পরিবর্তন নিষিদ্ধ।
/// ৩. Destructive Delete নিষিদ্ধ: শুধুমাত্র লাইফসাইকেল ট্রানজিশন প্রযোজ্য।
/// ৪. Immutable User ID ও User Code।
/// ৫. Audit-ready ট্র্যাকিং।
class UserRepositoryImpl implements UserRepository {
  // মেমোরি স্টোরেজ: অর্গানাইজেশন-আইসোলেটেড ইউজার তালিকা
  final Map<String, List<ManagedUser>> _orgUsers = {};

  // অডিট লগ স্টোরেজ: অর্গানাইজেশন-আইসোলেটেড
  final Map<String, List<UserRoleAuditRecord>> _orgRoleAudits = {};
  final Map<String, List<UserStatusAuditRecord>> _orgStatusAudits = {};

  UserRepositoryImpl() {
    _seedDefaultOrganization();
  }

  void _seedDefaultOrganization() {
    const defaultOrgId = 'demo_org_khurushkul';
    final systemRoles = PermissionCatalog.createDefaultSystemRoles(defaultOrgId);
    final rolesMap = {for (var r in systemRoles) r.key: r};

    _orgUsers[defaultOrgId] = [
      ManagedUser(
        id: 'usr_001_super_admin',
        organizationId: defaultOrgId,
        userCode: 'USR-000001',
        fullName: 'মাওলানা আব্দুল্লাহ',
        mobile: '01711000001',
        email: 'abdullah@tijarah.org',
        status: UserStatus.active,
        roles: [rolesMap[SystemRoleKey.superAdmin]!],
        createdAt: DateTime(2025, 1, 1, 10, 0),
        updatedAt: DateTime(2025, 1, 1, 10, 0),
        createdBy: 'system_bootstrap',
        updatedBy: 'system_bootstrap',
      ),
      ManagedUser(
        id: 'usr_002_secretary',
        organizationId: defaultOrgId,
        userCode: 'USR-000002',
        fullName: 'মাস্টার শামসুল হুদা',
        mobile: '01711000002',
        email: 'shamsul@tijarah.org',
        status: UserStatus.active,
        roles: [rolesMap[SystemRoleKey.secretary]!],
        createdAt: DateTime(2025, 1, 2, 11, 0),
        updatedAt: DateTime(2025, 1, 2, 11, 0),
        createdBy: 'usr_001_super_admin',
        updatedBy: 'usr_001_super_admin',
      ),
      ManagedUser(
        id: 'usr_003_treasurer',
        organizationId: defaultOrgId,
        userCode: 'USR-000003',
        fullName: 'হাফেজ মুহাম্মদ ইলিয়াস',
        mobile: '01711000003',
        email: 'elias@tijarah.org',
        status: UserStatus.active,
        roles: [rolesMap[SystemRoleKey.treasurer]!],
        createdAt: DateTime(2025, 1, 3, 12, 0),
        updatedAt: DateTime(2025, 1, 3, 12, 0),
        createdBy: 'usr_001_super_admin',
        updatedBy: 'usr_001_super_admin',
      ),
      ManagedUser(
        id: 'usr_004_accountant',
        organizationId: defaultOrgId,
        userCode: 'USR-000004',
        fullName: 'মুফতি নাসির উদ্দিন',
        mobile: '01711000004',
        email: 'nasir@tijarah.org',
        status: UserStatus.active,
        roles: [rolesMap[SystemRoleKey.accountant]!],
        createdAt: DateTime(2025, 1, 4, 14, 0),
        updatedAt: DateTime(2025, 1, 4, 14, 0),
        createdBy: 'usr_001_super_admin',
        updatedBy: 'usr_001_super_admin',
      ),
      ManagedUser(
        id: 'usr_005_collector',
        organizationId: defaultOrgId,
        userCode: 'USR-000005',
        fullName: 'ক্বারী আব্দুর রহমান',
        mobile: '01711000005',
        email: 'rahman@tijarah.org',
        status: UserStatus.active,
        roles: [rolesMap[SystemRoleKey.collector]!],
        createdAt: DateTime(2025, 1, 5, 9, 30),
        updatedAt: DateTime(2025, 1, 5, 9, 30),
        createdBy: 'usr_001_super_admin',
        updatedBy: 'usr_001_super_admin',
      ),
      ManagedUser(
        id: 'usr_006_auditor',
        organizationId: defaultOrgId,
        userCode: 'USR-000006',
        fullName: 'মাওলানা নুরুল ইসলাম',
        mobile: '01711000006',
        email: 'nurul@tijarah.org',
        status: UserStatus.active,
        roles: [rolesMap[SystemRoleKey.auditor]!],
        createdAt: DateTime(2025, 1, 6, 16, 0),
        updatedAt: DateTime(2025, 1, 6, 16, 0),
        createdBy: 'usr_001_super_admin',
        updatedBy: 'usr_001_super_admin',
      ),
      ManagedUser(
        id: 'usr_007_member',
        organizationId: defaultOrgId,
        userCode: 'USR-000007',
        fullName: 'ভাই তারেক আজিজ',
        mobile: '01711000007',
        email: 'tareq@tijarah.org',
        status: UserStatus.active,
        roles: [rolesMap[SystemRoleKey.member]!],
        createdAt: DateTime(2025, 1, 7, 10, 0),
        updatedAt: DateTime(2025, 1, 7, 10, 0),
        createdBy: 'usr_002_secretary',
        updatedBy: 'usr_002_secretary',
      ),
    ];
  }

  List<ManagedUser> _getUsersForOrg(String organizationId) {
    if (!_orgUsers.containsKey(organizationId)) {
      if (organizationId == 'demo_org_khurushkul') {
        _seedDefaultOrganization();
      } else {
        _orgUsers[organizationId] = [];
      }
    }
    return _orgUsers[organizationId]!;
  }

  @override
  Future<List<ManagedUser>> getUsers({
    required String organizationId,
    String? searchQuery,
    UserStatus? statusFilter,
    String? roleFilter,
  }) async {
    final users = _getUsersForOrg(organizationId);

    return users.where((u) {
      if (statusFilter != null && u.status != statusFilter) {
        return false;
      }

      if (roleFilter != null && roleFilter.isNotEmpty) {
        if (!u.roles.any((r) => r.key == roleFilter)) {
          return false;
        }
      }

      if (searchQuery != null && searchQuery.trim().isNotEmpty) {
        final query = searchQuery.trim().toLowerCase();
        final matchesName = u.fullName.toLowerCase().contains(query);
        final matchesCode = u.userCode.toLowerCase().contains(query);
        final matchesMobile = u.mobile.contains(query);
        final matchesEmail = u.email.toLowerCase().contains(query);

        if (!matchesName && !matchesCode && !matchesMobile && !matchesEmail) {
          return false;
        }
      }

      return true;
    }).toList();
  }

  @override
  Future<ManagedUser?> getUserById({
    required String organizationId,
    required String userId,
  }) async {
    final users = _getUsersForOrg(organizationId);
    try {
      return users.firstWhere((u) => u.id == userId);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<ManagedUser> createUser({
    required String organizationId,
    required String fullName,
    required String mobile,
    required String email,
    required List<String> initialRoleKeys,
    required String actorUserId,
    required String actorName,
  }) async {
    // ১. ফিল্ড ভ্যালিডেশন
    final cleanName = fullName.trim();
    if (cleanName.isEmpty || cleanName.length < 3) {
      throw Exception('ব্যবহারকারীর পূর্ণ নাম কমপক্ষে ৩ অক্ষরের হতে হবে।');
    }

    final cleanMobile = mobile.trim();
    final mobileReg = RegExp(r'^(?:\+88|88)?01[3-9]\d{8}$');
    if (!mobileReg.hasMatch(cleanMobile)) {
      throw Exception('সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।');
    }

    final cleanEmail = email.trim().toLowerCase();
    final emailReg = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailReg.hasMatch(cleanEmail)) {
      throw Exception('সঠিক ইমেইল ঠিকানা প্রদান করুন (যেমন: user@example.com)।');
    }

    final users = _getUsersForOrg(organizationId);

    // ২. ডুপ্লিকেট মোবাইল ও ইমেইল চেক (একই অর্গানাইজেশনের মধ্যে)
    for (final existing in users) {
      if (existing.mobile == cleanMobile) {
        throw Exception('এই মোবাইল নম্বরটি ইতোমধ্যে এই সমিতিতে নিবন্ধিত রয়েছে।');
      }
      if (existing.email.toLowerCase() == cleanEmail) {
        throw Exception('এই ইমেইল ঠিকানাটি ইতোমধ্যে এই সমিতিতে নিবন্ধিত রয়েছে।');
      }
    }

    // ৩. রোল ম্যাপিং
    final availableRoles = PermissionCatalog.createDefaultSystemRoles(organizationId);
    final selectedRoles = <Role>[];
    for (final key in initialRoleKeys) {
      final role = availableRoles.firstWhere(
        (r) => r.key == key,
        orElse: () => throw Exception('অকার্যকর ভূমিকা কোড: $key'),
      );
      selectedRoles.add(role);
    }

    // ৪. ডায়নামিক ইউজার কোড জেনারেশন
    final count = users.length + 1;
    final userCode = 'USR-${count.toString().padLeft(6, '0')}';
    final newId = 'usr_${DateTime.now().millisecondsSinceEpoch}_$count';

    final newUser = ManagedUser(
      id: newId,
      organizationId: organizationId,
      userCode: userCode,
      fullName: cleanName,
      mobile: cleanMobile,
      email: cleanEmail,
      status: UserStatus.active,
      roles: selectedRoles.isEmpty
          ? [availableRoles.firstWhere((r) => r.key == SystemRoleKey.member)]
          : selectedRoles,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      createdBy: actorUserId,
      updatedBy: actorUserId,
    );

    users.add(newUser);

    // অডিট রেকর্ড তৈরি
    for (final role in newUser.roles) {
      _recordRoleAudit(
        organizationId: organizationId,
        actorUserId: actorUserId,
        actorName: actorName,
        targetUserId: newUser.id,
        targetUserName: newUser.fullName,
        role: role,
        action: UserRoleAuditAction.roleAssigned,
        reason: 'নতুন অ্যাকাউন্ট তৈরির সময় প্রাথমিক ভূমিকা অর্পণ',
      );
    }

    return newUser;
  }

  @override
  Future<ManagedUser> updateUser({
    required String organizationId,
    required String userId,
    required String fullName,
    required String mobile,
    required String email,
    String? profilePhoto,
    required String actorUserId,
    required String actorName,
  }) async {
    final users = _getUsersForOrg(organizationId);
    final index = users.indexWhere((u) => u.id == userId);
    if (index == -1) {
      throw Exception('ব্যবহারকারী পাওয়া যায়নি।');
    }

    final current = users[index];

    final cleanName = fullName.trim();
    if (cleanName.isEmpty || cleanName.length < 3) {
      throw Exception('ব্যবহারকারীর পূর্ণ নাম কমপক্ষে ৩ অক্ষরের হতে হবে।');
    }

    final cleanMobile = mobile.trim();
    final mobileReg = RegExp(r'^(?:\+88|88)?01[3-9]\d{8}$');
    if (!mobileReg.hasMatch(cleanMobile)) {
      throw Exception('সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন।');
    }

    final cleanEmail = email.trim().toLowerCase();
    final emailReg = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailReg.hasMatch(cleanEmail)) {
      throw Exception('সঠিক ইমেইল ঠিকানা প্রদান করুন।');
    }

    // ডুপ্লিকেট মোবাইল/ইমেইল চেক (অন্য ব্যবহারকারীর সাথে)
    for (final other in users) {
      if (other.id != userId) {
        if (other.mobile == cleanMobile) {
          throw Exception('এই মোবাইল নম্বরটি অন্য একজন ব্যবহারকারী ব্যবহার করছেন।');
        }
        if (other.email.toLowerCase() == cleanEmail) {
          throw Exception('এই ইমেইল ঠিকানাটি অন্য একজন ব্যবহারকারী ব্যবহার করছেন।');
        }
      }
    }

    final updated = current.copyWith(
      fullName: cleanName,
      mobile: cleanMobile,
      email: cleanEmail,
      profilePhoto: profilePhoto ?? current.profilePhoto,
      updatedAt: DateTime.now(),
      updatedBy: actorUserId,
    );

    users[index] = updated;
    return updated;
  }

  @override
  Future<ManagedUser> changeUserStatus({
    required String organizationId,
    required String userId,
    required UserStatus newStatus,
    required String actorUserId,
    required String actorName,
    String? reason,
  }) async {
    final users = _getUsersForOrg(organizationId);
    final index = users.indexWhere((u) => u.id == userId);
    if (index == -1) {
      throw Exception('ব্যবহারকারী পাওয়া যায়নি।');
    }

    final current = users[index];
    if (current.status == newStatus) {
      return current;
    }

    // সেলফ-সাসপেনশন বা সেলফ-আর্কাইভ সতর্কতা চেক
    if (actorUserId == userId && (newStatus == UserStatus.suspended || newStatus == UserStatus.archived)) {
      SecurityAuditRepositoryImpl.instance.recordAudit(
        SecurityAuditRecord(
          id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
          organizationId: organizationId,
          actorUserId: actorUserId,
          actorName: actorName,
          eventType: SecurityEventType.privilegeEscalationBlocked,
          action: 'অননুমোদিত সেলফ-সাসপেনশনের চেষ্টা',
          targetType: 'user',
          targetId: userId,
          targetName: current.fullName,
          timestamp: DateTime.now(),
          reason: 'ব্যবহারকারী নিজের অ্যাকাউন্ট নিজে স্থগিত বা আর্কাইভ করতে পারবেন না।',
          result: SecurityEventResult.blocked,
        ),
      );
      throw Exception('নিরাপত্তা নীতি: ব্যবহারকারী নিজের অ্যাকাউন্ট নিজে স্থগিত বা আর্কাইভ করতে পারবেন না।');
    }

    final previousStatus = current.status;
    final updated = current.copyWith(
      status: newStatus,
      updatedAt: DateTime.now(),
      updatedBy: actorUserId,
    );

    users[index] = updated;

    // অডিট ট্রেইল তৈরি
    _recordStatusAudit(
      organizationId: organizationId,
      actorUserId: actorUserId,
      actorName: actorName,
      targetUserId: current.id,
      targetUserName: current.fullName,
      previousStatus: previousStatus,
      newStatus: newStatus,
      reason: reason ?? 'স্ট্যাটাস পরিবর্তন',
    );

    final secEventType = newStatus == UserStatus.suspended
        ? SecurityEventType.userSuspended
        : newStatus == UserStatus.active
            ? SecurityEventType.userActivated
            : newStatus == UserStatus.archived
                ? SecurityEventType.userArchived
                : SecurityEventType.userStatusChanged;

    SecurityAuditRepositoryImpl.instance.recordAudit(
      SecurityAuditRecord(
        id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
        organizationId: organizationId,
        actorUserId: actorUserId,
        actorName: actorName,
        eventType: secEventType,
        action: 'ব্যবহারকারীর স্ট্যাটাস পরিবর্তন: ${previousStatus.banglaName} -> ${newStatus.banglaName}',
        targetType: 'user',
        targetId: current.id,
        targetName: current.fullName,
        timestamp: DateTime.now(),
        previousState: {'status': previousStatus.name},
        newState: {'status': newStatus.name},
        reason: reason ?? 'স্ট্যাটাস পরিবর্তন',
        result: SecurityEventResult.success,
      ),
    );

    return updated;
  }

  @override
  Future<ManagedUser> assignRoleToUser({
    required String organizationId,
    required String userId,
    required String roleKey,
    required String actorUserId,
    required String actorName,
    String? reason,
  }) async {
    // ১. সেলফ-প্রিভিলেজ এস্কেলেশন সুরক্ষা: ব্যবহারকারী নিজের ভূমিকা নিজে যুক্ত করতে পারবেন না
    if (actorUserId == userId) {
      SecurityAuditRepositoryImpl.instance.recordAudit(
        SecurityAuditRecord(
          id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
          organizationId: organizationId,
          actorUserId: actorUserId,
          actorName: actorName,
          eventType: SecurityEventType.privilegeEscalationBlocked,
          action: 'অননুমোদিত সেলফ-রোল বৃদ্ধির চেষ্টা',
          targetType: 'role',
          targetId: roleKey,
          targetName: 'ভূমিকা: $roleKey',
          timestamp: DateTime.now(),
          reason: 'ব্যবহারকারী নিজের অ্যাকাউন্টে নিজে কোনো ভূমিকা যুক্ত বা পরিবর্তন করতে পারবেন না।',
          result: SecurityEventResult.blocked,
        ),
      );
      throw Exception('নিরাপত্তা নীতি (Privilege Escalation Protection): ব্যবহারকারী নিজের অ্যাকাউন্টে নিজে কোনো ভূমিকা যুক্ত বা পরিবর্তন করতে পারবেন না।');
    }

    final users = _getUsersForOrg(organizationId);
    final index = users.indexWhere((u) => u.id == userId);
    if (index == -1) {
      throw Exception('ব্যবহারকারী পাওয়া যায়নি।');
    }

    final current = users[index];
    if (current.roles.any((r) => r.key == roleKey)) {
      throw Exception('ব্যবহারকারীর নিকট এই ভূমিকাটি ইতোমধ্যেই অর্পিত রয়েছে।');
    }

    final availableRoles = PermissionCatalog.createDefaultSystemRoles(organizationId);
    final roleToAssign = availableRoles.firstWhere(
      (r) => r.key == roleKey,
      orElse: () => throw Exception('ভূমিকা পাওয়া যায়নি: $roleKey'),
    );

    final updatedRoles = List<Role>.from(current.roles)..add(roleToAssign);
    final updated = current.copyWith(
      roles: updatedRoles,
      updatedAt: DateTime.now(),
      updatedBy: actorUserId,
    );

    users[index] = updated;

    // অডিট রেকর্ড
    _recordRoleAudit(
      organizationId: organizationId,
      actorUserId: actorUserId,
      actorName: actorName,
      targetUserId: current.id,
      targetUserName: current.fullName,
      role: roleToAssign,
      action: UserRoleAuditAction.roleAssigned,
      reason: reason ?? 'প্রশাসনিক ভূমিকা অর্পণ',
    );

    SecurityAuditRepositoryImpl.instance.recordAudit(
      SecurityAuditRecord(
        id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
        organizationId: organizationId,
        actorUserId: actorUserId,
        actorName: actorName,
        eventType: SecurityEventType.roleAssigned,
        action: 'ভূমিকা অর্পণ (${roleToAssign.banglaName})',
        targetType: 'user',
        targetId: current.id,
        targetName: current.fullName,
        timestamp: DateTime.now(),
        previousState: {'roles': current.roles.map((r) => r.key).toList()},
        newState: {'roles': updatedRoles.map((r) => r.key).toList()},
        reason: reason ?? 'প্রশাসনিক ভূমিকা অর্পণ',
        result: SecurityEventResult.success,
      ),
    );

    // ক্যাশ ইনভ্যালিডেশন
    AuthorizationService.instance.clearCache();

    return updated;
  }

  @override
  Future<ManagedUser> removeRoleFromUser({
    required String organizationId,
    required String userId,
    required String roleKey,
    required String actorUserId,
    required String actorName,
    String? reason,
  }) async {
    // ১. সেলফ-রিমুভাল সুরক্ষা
    if (actorUserId == userId) {
      throw Exception('নিরাপত্তা নীতি: ব্যবহারকারী নিজের ভূমিকা নিজে প্রত্যাহার করতে পারবেন না।');
    }

    final users = _getUsersForOrg(organizationId);
    final index = users.indexWhere((u) => u.id == userId);
    if (index == -1) {
      throw Exception('ব্যবহারকারী পাওয়া যায়নি।');
    }

    final current = users[index];
    final roleIndex = current.roles.indexWhere((r) => r.key == roleKey);
    if (roleIndex == -1) {
      throw Exception('ব্যবহারকারীর নিকট এই ভূমিকাটি অর্পিত নেই।');
    }

    // সুপার অ্যাডমিন সুরক্ষা: অন্তত একজন সক্রিয় সুপার অ্যাডমিন থাকতে হবে
    if (roleKey == SystemRoleKey.superAdmin) {
      final superAdmins = users.where(
        (u) => u.status == UserStatus.active && u.roles.any((r) => r.key == SystemRoleKey.superAdmin),
      ).toList();
      if (superAdmins.length <= 1 && superAdmins.any((u) => u.id == userId)) {
        throw Exception('সিস্টেম সুরক্ষা: প্রতিষ্ঠানে অন্তত একজন সক্রিয় সুপার অ্যাডমিন থাকা আবশ্যক। এটি প্রত্যাহার করা যাবে না।');
      }
    }

    final removedRole = current.roles[roleIndex];
    final updatedRoles = List<Role>.from(current.roles)..removeAt(roleIndex);

    // অন্তত একটি ভূমিকা থাকতে হবে (অন্যথায় ডিফল্ট member রোল যুক্ত হবে)
    if (updatedRoles.isEmpty) {
      final availableRoles = PermissionCatalog.createDefaultSystemRoles(organizationId);
      final memberRole = availableRoles.firstWhere((r) => r.key == SystemRoleKey.member);
      updatedRoles.add(memberRole);
    }

    final updated = current.copyWith(
      roles: updatedRoles,
      updatedAt: DateTime.now(),
      updatedBy: actorUserId,
    );

    users[index] = updated;

    // অডিট রেকর্ড
    _recordRoleAudit(
      organizationId: organizationId,
      actorUserId: actorUserId,
      actorName: actorName,
      targetUserId: current.id,
      targetUserName: current.fullName,
      role: removedRole,
      action: UserRoleAuditAction.roleRemoved,
      reason: reason ?? 'প্রশাসনিক ভূমিকা প্রত্যাহার',
    );

    SecurityAuditRepositoryImpl.instance.recordAudit(
      SecurityAuditRecord(
        id: 'SEC-AUD-${DateTime.now().millisecondsSinceEpoch}',
        organizationId: organizationId,
        actorUserId: actorUserId,
        actorName: actorName,
        eventType: SecurityEventType.roleRemoved,
        action: 'ভূমিকা প্রত্যাহার (${removedRole.banglaName})',
        targetType: 'user',
        targetId: current.id,
        targetName: current.fullName,
        timestamp: DateTime.now(),
        previousState: {'roles': current.roles.map((r) => r.key).toList()},
        newState: {'roles': updatedRoles.map((r) => r.key).toList()},
        reason: reason ?? 'প্রশাসনিক ভূমিকা প্রত্যাহার',
        result: SecurityEventResult.success,
      ),
    );

    // ক্যাশ ইনভ্যালিডেশন
    AuthorizationService.instance.clearCache();

    return updated;
  }

  @override
  Future<List<UserRoleAuditRecord>> getRoleAuditRecords({
    required String organizationId,
    String? targetUserId,
  }) async {
    final audits = _orgRoleAudits[organizationId] ?? [];
    if (targetUserId != null) {
      return audits.where((a) => a.targetUserId == targetUserId).toList();
    }
    return audits;
  }

  @override
  Future<List<UserStatusAuditRecord>> getStatusAuditRecords({
    required String organizationId,
    String? targetUserId,
  }) async {
    final audits = _orgStatusAudits[organizationId] ?? [];
    if (targetUserId != null) {
      return audits.where((a) => a.targetUserId == targetUserId).toList();
    }
    return audits;
  }

  void _recordRoleAudit({
    required String organizationId,
    required String actorUserId,
    required String actorName,
    required String targetUserId,
    required String targetUserName,
    required Role role,
    required String action,
    String? reason,
  }) {
    if (!_orgRoleAudits.containsKey(organizationId)) {
      _orgRoleAudits[organizationId] = [];
    }

    final record = UserRoleAuditRecord(
      id: 'audit_role_${DateTime.now().millisecondsSinceEpoch}_${_orgRoleAudits[organizationId]!.length + 1}',
      organizationId: organizationId,
      actorUserId: actorUserId,
      actorName: actorName,
      targetUserId: targetUserId,
      targetUserName: targetUserName,
      roleId: role.id,
      roleKey: role.key,
      roleName: role.name,
      action: action,
      reason: reason,
      timestamp: DateTime.now(),
    );

    _orgRoleAudits[organizationId]!.insert(0, record);
  }

  void _recordStatusAudit({
    required String organizationId,
    required String actorUserId,
    required String actorName,
    required String targetUserId,
    required String targetUserName,
    required UserStatus previousStatus,
    required UserStatus newStatus,
    String? reason,
  }) {
    if (!_orgStatusAudits.containsKey(organizationId)) {
      _orgStatusAudits[organizationId] = [];
    }

    final record = UserStatusAuditRecord(
      id: 'audit_status_${DateTime.now().millisecondsSinceEpoch}_${_orgStatusAudits[organizationId]!.length + 1}',
      organizationId: organizationId,
      actorUserId: actorUserId,
      actorName: actorName,
      targetUserId: targetUserId,
      targetUserName: targetUserName,
      previousStatus: previousStatus,
      newStatus: newStatus,
      reason: reason,
      timestamp: DateTime.now(),
    );

    _orgStatusAudits[organizationId]!.insert(0, record);
  }
}
