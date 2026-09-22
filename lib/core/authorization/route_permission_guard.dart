import 'package:flutter/material.dart';
import '../../app/router/route_names.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';
import '../../shared/widgets/app_button.dart';
import 'authorization_service.dart';
import 'permission_keys.dart';

/// RoutePermissionGuard: রুট-লেভেল অ্যাক্সেস কন্ট্রোল ও গার্ড
///
/// নির্দিষ্ট রুটে প্রবেশের পূর্বে পারমিশন নিশ্চিত করে। অনুমতি না থাকলে
/// কোনো সংবেদনশীল ডেটা রেন্ডার না করে সরাসরি অ্যাক্সেস ডিনাইড প্রদান করে।
class RoutePermissionGuard {
  RoutePermissionGuard._();

  /// রুট এবং প্রয়োজনীয় পারমিশনের সেন্ট্রালাইজড ম্যাপিং
  static final Map<String, String> _routePermissionMap = {
    // সংগঠন ও নিরাপত্তা
    RouteNames.orgSecurity: PermissionKeys.organizationView,
    RouteNames.orgInfo: PermissionKeys.organizationView,
    RouteNames.orgUsers: PermissionKeys.userView,
    RouteNames.orgRoles: PermissionKeys.roleManage,
    RouteNames.orgLoginSecurity: PermissionKeys.permissionManage,
    RouteNames.orgSessions: PermissionKeys.userView,
    RouteNames.orgLogs: PermissionKeys.permissionView,

    // সদস্য
    RouteNames.members: PermissionKeys.memberView,
    RouteNames.memberList: PermissionKeys.memberView,
    RouteNames.memberNew: PermissionKeys.memberCreate,
    RouteNames.memberProfile: PermissionKeys.memberView,
    RouteNames.memberApplications: PermissionKeys.memberManage,
    RouteNames.memberAccounts: PermissionKeys.memberView,
    RouteNames.memberShares: PermissionKeys.shareView,
    RouteNames.memberInstallments: PermissionKeys.memberView,
    RouteNames.memberActivities: PermissionKeys.memberView,
    RouteNames.memberReports: PermissionKeys.reportView,

    // অর্থ ও হিসাব
    RouteNames.finance: PermissionKeys.financeTransactionView,
    RouteNames.financeIncome: PermissionKeys.financeTransactionCreate,
    RouteNames.financeExpense: PermissionKeys.financeTransactionCreate,
    RouteNames.financeTransfer: PermissionKeys.financeTransactionCreate,
    RouteNames.financeFunds: PermissionKeys.financeFundView,
    RouteNames.financeAccounts: PermissionKeys.financeAccountView,
    RouteNames.financeCash: PermissionKeys.financeAccountView,
    RouteNames.financeBank: PermissionKeys.financeAccountView,
    RouteNames.financeLedger: PermissionKeys.financeTransactionView,
  };

  /// নির্দিষ্ট রুটের প্রয়োজনীয় পারমিশন কী
  static String? getRequiredPermission(String route) {
    return _routePermissionMap[route];
  }

  /// ব্যবহারকারীর এই রুটে প্রবেশের অধিকার আছে কিনা
  static bool canAccessRoute(String route) {
    final requiredPerm = getRequiredPermission(route);
    if (requiredPerm == null) {
      // পাবলিক বা আন-রেস্ট্রিক্টেড রুট (যেমন: ড্যাশবোর্ড)
      return true;
    }
    return AuthorizationService.instance.can(requiredPerm);
  }

  /// রুট গার্ড উইজেট র‍্যাপার
  static Widget protect({
    required String route,
    required Widget child,
    VoidCallback? onBackToDashboard,
  }) {
    final requiredPerm = getRequiredPermission(route);
    if (requiredPerm == null) {
      return child;
    }

    final hasAccess = AuthorizationService.instance.can(requiredPerm);
    if (hasAccess) {
      return child;
    }

    return AccessDeniedScreen(
      route: route,
      requiredPermission: requiredPerm,
      onBackToDashboard: onBackToDashboard,
    );
  }
}

/// AccessDeniedScreen: ৪০৩ ফরবিডেন এর জন্য পূর্ণাঙ্গ স্ট্যান্ডার্ড স্ক্রিন
class AccessDeniedScreen extends StatelessWidget {
  final String route;
  final String requiredPermission;
  final VoidCallback? onBackToDashboard;

  const AccessDeniedScreen({
    super.key,
    required this.route,
    required this.requiredPermission,
    this.onBackToDashboard,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xxl),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.xxl),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppColors.error.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: const Icon(
                      Icons.shield_outlined,
                      color: AppColors.error,
                      size: 38,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  const Text(
                    'প্রবেশাধিকার সংরক্ষিত (403 Forbidden)',
                    style: TextStyle(
                      fontFamily: AppTypography.fontHeading,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'আপনার বর্তমান ভূমিকা বা অ্যাকাউন্টের এই অংশে প্রবেশের অনুমতি নেই।\nএটি একটি সুরক্ষিত মডিউল।',
                    style: TextStyle(
                      fontFamily: AppTypography.fontBody,
                      fontSize: 14,
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'অনুরোধকৃত পথ: $route',
                          style: const TextStyle(
                            fontFamily: AppTypography.fontMono,
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'প্রয়োজনীয় অনুমতি: $requiredPermission',
                          style: const TextStyle(
                            fontFamily: AppTypography.fontMono,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AppButton(
                        text: 'ড্যাশবোর্ডে ফিরে যান',
                        icon: Icons.dashboard_outlined,
                        onPressed: onBackToDashboard ??
                            () {
                              Navigator.of(context).maybePop();
                            },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
