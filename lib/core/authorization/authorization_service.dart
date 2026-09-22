import 'package:flutter/foundation.dart';
import '../../domain/entities/role.dart';
import '../context/organization_context.dart';
import '../logging/app_logger.dart';
import 'permission_catalog.dart';
import 'permission_keys.dart';

/// SelfApprovalPolicyResult: স্বীয় লেনদেন অনুমোদন যাচাইয়ের ফলাফল
class SelfApprovalPolicyResult {
  final bool isAllowed;
  final String message;
  final String? code;

  const SelfApprovalPolicyResult({
    required this.isAllowed,
    required this.message,
    this.code,
  });

  static const SelfApprovalPolicyResult allowed = SelfApprovalPolicyResult(
    isAllowed: true,
    message: 'অনুমোদন যাচাই সফল হয়েছে।',
  );

  static const SelfApprovalPolicyResult blockedSelfApproval = SelfApprovalPolicyResult(
    isAllowed: false,
    message: 'আর্থিক নীতি ও শরিয়াহ অডিট বিধান অনুযায়ী লেনদেন তৈরিকারী নিজেই তা অনুমোদন করতে পারবেন না।',
    code: 'SELF_APPROVAL_FORBIDDEN',
  );
}

/// AuthorizationService: সেন্ট্রালাইজড অথরাইজেশন সার্ভিস
///
/// **মূল নীতি:**
/// 1. User -> Role -> Permissions -> Module/Resource -> Action
/// 2. Role-এর নাম কোনো সিকিউরিটি রুল নয়; রোলের সাথে যুক্ত Permission-ই মূল ভিত্তি।
/// 3. ফ্রন্টএন্ড পারমিশন চেক কোনো সিকিউরিটি বাউন্ডারি নয়; এটি শুধুমাত্র UX অপটিমাইজেশন।
/// 4. ব্যাকএন্ড API হলো চূড়ান্ত সিকিউরিটি অথরিটি।
class AuthorizationService extends ChangeNotifier {
  static final AuthorizationService instance = AuthorizationService._internal();

  AuthorizationService._internal();

  String? _cachedOrganizationId;
  String? _currentUserId;
  final Set<String> _cachedPermissions = <String>{};
  final List<Role> _cachedRoles = <Role>[];
  bool _isInitialized = false;

  /// বর্তমান ব্যবহারকারীর সক্রিয় পারমিশন সেট
  Set<String> get permissions => Set.unmodifiable(_cachedPermissions);

  /// বর্তমান ব্যবহারকারীর সক্রিয় ভূমিকা (Roles)
  List<Role> get roles => List.unmodifiable(_cachedRoles);

  /// ইনিশিয়ালাইজেশন সম্পন্ন কিনা
  bool get isInitialized => _isInitialized;

  /// অথরাইজেশন স্টেট প্রারম্ভিকীকরণ
  ///
  /// ইউজার লগইন বা সেশন রিস্টোর হওয়ার পর এই মেথড কল করা হয়।
  Future<void> initialize({
    required String userId,
    required String organizationId,
    List<Role>? assignedRoles,
    List<String>? directPermissions,
  }) async {
    _currentUserId = userId;
    _cachedOrganizationId = organizationId;
    _cachedRoles.clear();
    _cachedPermissions.clear();

    if (assignedRoles != null && assignedRoles.isNotEmpty) {
      // অর্গানাইজেশন বাউন্ডারি চেক (টেন্যান্ট আইসোলেশন)
      final validRoles = assignedRoles.where((r) => r.organizationId == organizationId).toList();
      _cachedRoles.addAll(validRoles);

      for (final role in validRoles) {
        if (role.isActive) {
          _cachedPermissions.addAll(role.permissionKeys);
        }
      }
    }

    if (directPermissions != null) {
      _cachedPermissions.addAll(directPermissions);
    }

    _isInitialized = true;
    AppLogger.info(
      'AuthorizationService initialized for user: $userId (Org: $organizationId, '
      'Roles: ${_cachedRoles.length}, Permissions: ${_cachedPermissions.length})',
    );
    notifyListeners();
  }

  /// নির্দিষ্ট পারমিশন ব্যবহারকারীর আছে কিনা যাচাই
  ///
  /// এটিই পুরো অ্যাপের সেন্ট্রাল পারমিশন ডিসিশন পয়েন্ট।
  /// উদাহরণ: `can('finance.transaction.create')`
  bool can(String permissionKey) {
    _ensureOrganizationContextSync();
    if (!_isInitialized) return false;
    return _cachedPermissions.contains(permissionKey);
  }

  /// প্রদত্ত পারমিশনগুলোর যেকোনো একটি আছে কিনা
  bool canAny(List<String> permissionKeys) {
    _ensureOrganizationContextSync();
    if (!_isInitialized || permissionKeys.isEmpty) return false;
    return permissionKeys.any((key) => _cachedPermissions.contains(key));
  }

  /// প্রদত্ত সকল পারমিশন ব্যবহারকারীর আছে কিনা
  bool canAll(List<String> permissionKeys) {
    _ensureOrganizationContextSync();
    if (!_isInitialized || permissionKeys.isEmpty) return false;
    return permissionKeys.every((key) => _cachedPermissions.contains(key));
  }

  /// ব্যবহারকারীর কোনো নির্দিষ্ট ভূমিকা আছে কিনা (শুধুমাত্র ইনফরমেশনাল / হেল্পার হিসেবে)
  ///
  /// সতর্কবার্তা: সিকিউরিটি ডিসিশনের জন্য `hasRole` ব্যবহার নিষিদ্ধ; সবসময় `can()` ব্যবহার করুন।
  bool hasRole(String roleKey) {
    _ensureOrganizationContextSync();
    return _cachedRoles.any((r) => r.key == roleKey && r.isActive);
  }

  /// আর্থিক লেনদেনের স্বীয় অনুমোদন প্রতিরোধ নীতি যাচাই
  ///
  /// Segregation of Duties: Creator cannot approve own submitted financial transaction.
  SelfApprovalPolicyResult checkSelfApprovalPolicy({
    required String creatorUserId,
    required String approverUserId,
  }) {
    if (creatorUserId.isNotEmpty &&
        approverUserId.isNotEmpty &&
        creatorUserId == approverUserId) {
      return SelfApprovalPolicyResult.blockedSelfApproval;
    }
    return SelfApprovalPolicyResult.allowed;
  }

  /// আর্থিক লেনদেন অনুমোদনের সামগ্রিক যাচাই
  ///
  /// ১. ইউজারের অনুমোদন পারমিশন (`finance.transaction.approve`) আছে কিনা
  /// ২. তৈরিকারী এবং অনুমোদনকারী একই ব্যক্তি কিনা (স্বীয় অনুমোদন ব্লক)
  bool canApproveTransaction({
    required String creatorUserId,
    String? currentUserId,
  }) {
    // ১. পারমিশন চেক
    if (!can(PermissionKeys.financeTransactionApprove)) {
      return false;
    }

    // ২. স্বীয় অনুমোদন নীতি চেক
    final effectiveUserId = currentUserId ?? _currentUserId;
    if (effectiveUserId != null && effectiveUserId == creatorUserId) {
      AppLogger.warning(
        'Self-approval blocked for user $effectiveUserId on transaction created by $creatorUserId',
      );
      return false;
    }

    return true;
  }

  /// অথরাইজেশন ক্যাশ সম্পূর্ণ ক্লিয়ার করা (লগআউটের সময় কলযোগ্য)
  void clearCache() {
    _currentUserId = null;
    _cachedOrganizationId = null;
    _cachedPermissions.clear();
    _cachedRoles.clear();
    _isInitialized = false;
    AppLogger.info('AuthorizationService cache cleared.');
    notifyListeners();
  }

  /// পারমিশন ও রোল রিফ্রেশ করা
  Future<void> refreshAuthorization({
    List<Role>? updatedRoles,
    List<String>? updatedPermissions,
  }) async {
    final activeOrgId = OrganizationContext.instance.currentOrganizationId;
    if (activeOrgId == null || _currentUserId == null) {
      clearCache();
      return;
    }

    _cachedOrganizationId = activeOrgId;
    _cachedRoles.clear();
    _cachedPermissions.clear();

    if (updatedRoles != null) {
      final validRoles = updatedRoles.where((r) => r.organizationId == activeOrgId).toList();
      _cachedRoles.addAll(validRoles);
      for (final r in validRoles) {
        if (r.isActive) {
          _cachedPermissions.addAll(r.permissionKeys);
        }
      }
    }

    if (updatedPermissions != null) {
      _cachedPermissions.addAll(updatedPermissions);
    }

    AppLogger.info('AuthorizationService refreshed. Permissions: ${_cachedPermissions.length}');
    notifyListeners();
  }

  /// অর্গানাইজেশন কনটেক্সটের সাথে আইসোলেশন ও ক্যাশ সিঙ্ক যাচাই
  void _ensureOrganizationContextSync() {
    final activeOrgId = OrganizationContext.instance.currentOrganizationId;
    if (activeOrgId != null &&
        _cachedOrganizationId != null &&
        activeOrgId != _cachedOrganizationId) {
      AppLogger.warning(
        'Organization context changed from $_cachedOrganizationId to $activeOrgId. Invalidating authorization cache.',
      );
      clearCache();
    }
  }

  /// টেস্ট ও ডেমো রোল সেটআপ করার হেল্পার
  void setupDemoRole(String roleKey, {String? customUserId}) {
    final orgId = OrganizationContext.instance.currentOrganizationId ?? 'demo_org_khurushkul';
    final defaultRoles = PermissionCatalog.createDefaultSystemRoles(organizationId: orgId);
    final targetRole = defaultRoles.firstWhere(
      (r) => r.key == roleKey,
      orElse: () => defaultRoles.first,
    );

    initialize(
      userId: customUserId ?? 'user_$roleKey',
      organizationId: orgId,
      assignedRoles: [targetRole],
    );
  }
}
