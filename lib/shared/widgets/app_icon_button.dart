import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_dimensions.dart';

/// AppIconButtonVariant: আইকন বাটনের ধরন
enum AppIconButtonVariant {
  standard,
  primary,
  secondary,
  tonal,
  destructive,
}

/// AppIconButton: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড রিইউজেবল আইকন বাটন
///
/// - মিনিমাম ৪৮ × ৪৮ dp টাচ টার্গেট নিশ্চিত করে (Accessibility)
/// - টুলটিপ এবং সেমান্টিক লেবেল বাধ্যতামূলক সাপোর্ট
/// - লোডিং ইন্ডিকেটর এবং ডিজেবল্ড স্টেট সাপোর্ট
class AppIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final String tooltip;
  final String? semanticLabel;
  final AppIconButtonVariant variant;
  final bool isLoading;
  final bool isCompact;
  final Color? color;
  final Color? backgroundColor;

  const AppIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
    required this.tooltip,
    this.semanticLabel,
    this.variant = AppIconButtonVariant.standard,
    this.isLoading = false,
    this.isCompact = false,
    this.color,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    Color iconColor;
    Color? bgColor = backgroundColor;

    switch (variant) {
      case AppIconButtonVariant.standard:
        iconColor = color ?? AppColors.textPrimary;
        break;
      case AppIconButtonVariant.primary:
        iconColor = Colors.white;
        bgColor = bgColor ?? AppColors.primary;
        break;
      case AppIconButtonVariant.secondary:
        iconColor = Colors.white;
        bgColor = bgColor ?? AppColors.secondary;
        break;
      case AppIconButtonVariant.tonal:
        iconColor = color ?? AppColors.primary;
        bgColor = bgColor ?? AppColors.primary.withOpacity(0.1);
        break;
      case AppIconButtonVariant.destructive:
        iconColor = Colors.white;
        bgColor = bgColor ?? AppColors.error;
        break;
    }

    final effectiveSemanticLabel = semanticLabel ?? tooltip;

    Widget button = InkWell(
      onTap: isLoading ? null : onPressed,
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: Container(
        width: isCompact ? 48.0 : 48.0,
        height: isCompact ? 48.0 : 48.0,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: onPressed == null ? (bgColor?.withOpacity(0.4) ?? Colors.transparent) : bgColor,
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(iconColor),
                ),
              )
            : Icon(
                icon,
                size: isCompact ? 20 : AppDimensions.iconMd,
                color: onPressed == null ? AppColors.textTertiary : iconColor,
              ),
      ),
    );

    return Semantics(
      label: effectiveSemanticLabel,
      button: true,
      enabled: onPressed != null && !isLoading,
      child: Tooltip(
        message: tooltip,
        child: button,
      ),
    );
  }
}
