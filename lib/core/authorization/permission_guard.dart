import 'package:flutter/material.dart';
import '../../shared/widgets/app_permission_state.dart';
import 'authorization_service.dart';

/// PermissionGuardMode: পারমিশন ঘাটতি হলে উপস্থাপনের ধরণ
enum PermissionGuardMode {
  /// সম্পূর্ণ লুকিয়ে ফেলা (Default for buttons/actions)
  hide,

  /// ডিজেবল করা (অস্বচ্ছ ও ক্লিকযোগ্য নয়)
  disable,

  /// অ্যাক্সেস ডিনাইড স্ক্রিন/কার্ড প্রদর্শন (Default for page/card level)
  accessDenied,

  /// কাস্টম ফলব্যাক উইজেট প্রদর্শন
  customFallback,
}

/// PermissionGuard: রিইউজেবল ডেকোরেটর উইজেট
///
/// নির্দিষ্ট পারমিশন থাকলে চাইল্ড উইজেট প্রদর্শন করে; অন্যথায় নির্ধারিত মোড অনুযায়ী
/// অ্যাকশন লুকানো, ডিজেবল বা 'প্রবেশাধিকার নেই' স্টেট প্রদর্শন করে।
///
/// ব্যবহার:
/// ```dart
/// PermissionGuard(
///   permission: PermissionKeys.financeTransactionApprove,
///   child: AppButton(text: 'অনুমোদন করুন', onPressed: ...),
/// )
/// ```
class PermissionGuard extends StatelessWidget {
  final String? permission;
  final List<String>? permissions;
  final bool requireAll;
  final Widget child;
  final PermissionGuardMode mode;
  final Widget? fallback;
  final String? customDeniedMessage;
  final String? tooltipWhenDisabled;

  const PermissionGuard({
    super.key,
    this.permission,
    this.permissions,
    this.requireAll = false,
    required this.child,
    this.mode = PermissionGuardMode.hide,
    this.fallback,
    this.customDeniedMessage,
    this.tooltipWhenDisabled,
  }) : assert(
          permission != null || (permissions != null && permissions.length > 0),
          'Either permission or non-empty permissions must be provided.',
        );

  /// পেজ বা ভিউ লেভেল গার্ড (প্রবেশাধিকার না থাকলে অ্যাক্সেস ডিনাইড স্ক্রিন দেখায়)
  factory PermissionGuard.page({
    Key? key,
    required String permission,
    required Widget child,
    VoidCallback? onBack,
    String? customDeniedMessage,
  }) {
    return PermissionGuard(
      key: key,
      permission: permission,
      mode: PermissionGuardMode.accessDenied,
      customDeniedMessage: customDeniedMessage,
      fallback: AppPermissionState(
        requiredRoleOrPermission: permission,
        message: customDeniedMessage ??
            'এই মডিউলটি ব্যবহারের জন্য আপনার অ্যাকাউন্টের প্রয়োজনীয় অনুমতি নেই। আপনার সংস্থার প্রশাসকের সাথে যোগাযোগ করুন।',
        onBack: onBack,
      ),
      child: child,
    );
  }

  /// বাটন বা অ্যাকশন লেভেল গার্ড (অনুমতি না থাকলে ডিজেবল ও অনুজ্জ্বল থাকে)
  factory PermissionGuard.disabled({
    Key? key,
    required String permission,
    required Widget child,
    String? tooltip,
  }) {
    return PermissionGuard(
      key: key,
      permission: permission,
      mode: PermissionGuardMode.disable,
      tooltipWhenDisabled: tooltip ?? 'আপনার এই কাজটি সম্পাদনের অনুমতি নেই।',
      child: child,
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: AuthorizationService.instance,
      builder: (context, _) {
        final authService = AuthorizationService.instance;
        bool hasAccess = false;

        if (permission != null) {
          hasAccess = authService.can(permission!);
        } else if (permissions != null) {
          hasAccess = requireAll
              ? authService.canAll(permissions!)
              : authService.canAny(permissions!);
        }

        if (hasAccess) {
          return child;
        }

        // অনুমতি না থাকলে মোড অনুযায়ী হ্যান্ডলিং
        switch (mode) {
          case PermissionGuardMode.hide:
            return fallback ?? const SizedBox.shrink();

          case PermissionGuardMode.disable:
            final disabledChild = Opacity(
              opacity: 0.45,
              child: IgnorePointer(
                ignoring: true,
                child: child,
              ),
            );
            if (tooltipWhenDisabled != null) {
              return Tooltip(
                message: tooltipWhenDisabled!,
                child: disabledChild,
              );
            }
            return disabledChild;

          case PermissionGuardMode.accessDenied:
            return fallback ??
                AppPermissionState(
                  requiredRoleOrPermission: permission ?? permissions?.join(', '),
                  message: customDeniedMessage ??
                      'এই মডিউলটি ব্যবহারের জন্য আপনার অ্যাকাউন্টের প্রয়োজনীয় অনুমতি নেই। আপনার সংস্থার প্রশাসকের সাথে যোগাযোগ করুন।',
                );

          case PermissionGuardMode.customFallback:
            return fallback ?? const SizedBox.shrink();
        }
      },
    );
  }
}
