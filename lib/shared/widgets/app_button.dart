import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_spacing.dart';

/// AppButtonVariant: বাটনের বিভিন্ন রূপ
enum AppButtonVariant {
  primary,
  secondary,
  outline,
  text,
  destructive,
  success,
}

/// AppButtonSize: বাটনের সাইজ
enum AppButtonSize {
  sm,
  md,
  lg,
}

/// AppButton: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড রিইউজেবল বাটন
///
/// সকল প্রকার অ্যাকশন বাটন হ্যান্ডল করে।
/// - মিনিমাম টাচ টার্গেট: ৪৮ × ৪৮ dp
/// - ফন্ট: Baloo Da 2 (AppTypography.fontNumeric)
/// - লোডিং অবস্থায় ডুপ্লিকেট ট্যাপ প্রতিরোধ
class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;
  final Widget? customIcon;
  final String? tooltip;
  final String? semanticLabel;

  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.customIcon,
    this.tooltip,
    this.semanticLabel,
  });

  /// সুবিধাজনক ফ্যাক্টরি কনস্ট্রাক্টর
  const AppButton.primary({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = AppButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.customIcon,
    this.tooltip,
    this.semanticLabel,
  }) : variant = AppButtonVariant.primary;

  const AppButton.secondary({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = AppButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.customIcon,
    this.tooltip,
    this.semanticLabel,
  }) : variant = AppButtonVariant.secondary;

  const AppButton.outline({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = AppButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.customIcon,
    this.tooltip,
    this.semanticLabel,
  }) : variant = AppButtonVariant.outline;

  const AppButton.text({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = AppButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.customIcon,
    this.tooltip,
    this.semanticLabel,
  }) : variant = AppButtonVariant.text;

  const AppButton.destructive({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = AppButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.customIcon,
    this.tooltip,
    this.semanticLabel,
  }) : variant = AppButtonVariant.destructive;

  const AppButton.success({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = AppButtonSize.md,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.customIcon,
    this.tooltip,
    this.semanticLabel,
  }) : variant = AppButtonVariant.success;

  double get _height {
    switch (size) {
      case AppButtonSize.sm:
        return 48.0; // Minimum 48dp for accessibility
      case AppButtonSize.md:
        return AppDimensions.buttonHeight; // 48dp
      case AppButtonSize.lg:
        return AppDimensions.buttonHeightLg; // 52dp
    }
  }

  double get _fontSize {
    switch (size) {
      case AppButtonSize.sm:
        return 13.0;
      case AppButtonSize.md:
        return 15.0;
      case AppButtonSize.lg:
        return 16.0;
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget buttonWidget;

    switch (variant) {
      case AppButtonVariant.primary:
        buttonWidget = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            disabledBackgroundColor: AppColors.primary.withOpacity(0.5),
            shape: AppRadius.shapeMd(),
            elevation: 0,
            minimumSize: Size(isFullWidth ? double.infinity : 64, _height),
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
          ),
          child: _buildContent(Colors.white),
        );
        break;

      case AppButtonVariant.secondary:
        buttonWidget = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.secondary,
            foregroundColor: Colors.white,
            disabledBackgroundColor: AppColors.secondary.withOpacity(0.5),
            shape: AppRadius.shapeMd(),
            elevation: 0,
            minimumSize: Size(isFullWidth ? double.infinity : 64, _height),
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
          ),
          child: _buildContent(Colors.white),
        );
        break;

      case AppButtonVariant.outline:
        buttonWidget = OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.primary,
            disabledForegroundColor: AppColors.textSecondary.withOpacity(0.5),
            side: const BorderSide(color: AppColors.primary, width: 1.5),
            shape: AppRadius.shapeMd(),
            minimumSize: Size(isFullWidth ? double.infinity : 64, _height),
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
          ),
          child: _buildContent(AppColors.primary),
        );
        break;

      case AppButtonVariant.text:
        buttonWidget = TextButton(
          onPressed: isLoading ? null : onPressed,
          style: TextButton.styleFrom(
            foregroundColor: AppColors.primary,
            disabledForegroundColor: AppColors.textSecondary.withOpacity(0.5),
            shape: AppRadius.shapeMd(),
            minimumSize: Size(isFullWidth ? double.infinity : 64, _height),
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
          ),
          child: _buildContent(AppColors.primary),
        );
        break;

      case AppButtonVariant.destructive:
        buttonWidget = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.error,
            foregroundColor: Colors.white,
            disabledBackgroundColor: AppColors.error.withOpacity(0.5),
            shape: AppRadius.shapeMd(),
            elevation: 0,
            minimumSize: Size(isFullWidth ? double.infinity : 64, _height),
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
          ),
          child: _buildContent(Colors.white),
        );
        break;

      case AppButtonVariant.success:
        buttonWidget = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.success,
            foregroundColor: Colors.white,
            disabledBackgroundColor: AppColors.success.withOpacity(0.5),
            shape: AppRadius.shapeMd(),
            elevation: 0,
            minimumSize: Size(isFullWidth ? double.infinity : 64, _height),
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
          ),
          child: _buildContent(Colors.white),
        );
        break;
    }

    if (tooltip != null && tooltip!.isNotEmpty) {
      buttonWidget = Tooltip(
        message: tooltip!,
        child: buttonWidget,
      );
    }

    if (semanticLabel != null && semanticLabel!.isNotEmpty) {
      buttonWidget = Semantics(
        label: semanticLabel,
        button: true,
        child: buttonWidget,
      );
    }

    if (isFullWidth) {
      return SizedBox(
        width: double.infinity,
        height: _height,
        child: buttonWidget,
      );
    }

    return SizedBox(
      height: _height,
      child: buttonWidget,
    );
  }

  Widget _buildContent(Color textColor) {
    if (isLoading) {
      return SizedBox(
        height: 20,
        width: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(textColor),
        ),
      );
    }

    return Row(
      mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (customIcon != null) ...[
          customIcon!,
          const SizedBox(width: AppSpacing.sm),
        ] else if (icon != null) ...[
          Icon(icon, size: AppDimensions.iconSm),
          const SizedBox(width: AppSpacing.sm),
        ],
        Text(
          label,
          style: TextStyle(
            fontFamily: AppTypography.fontNumeric,
            fontSize: _fontSize,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

/// Backwards compatibility wrappers
class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double height;

  const PrimaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height = AppDimensions.buttonHeightLg,
  });

  @override
  Widget build(BuildContext context) {
    return AppButton.primary(
      label: text,
      onPressed: onPressed,
      isLoading: isLoading,
      icon: icon,
      isFullWidth: width == double.infinity || width == null,
    );
  }
}

class SecondaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double height;

  const SecondaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height = AppDimensions.buttonHeightLg,
  });

  @override
  Widget build(BuildContext context) {
    return AppButton.outline(
      label: text,
      onPressed: onPressed,
      isLoading: isLoading,
      icon: icon,
      isFullWidth: width == double.infinity || width == null,
    );
  }
}

class AmberButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final double? width;

  const AmberButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return AppButton.secondary(
      label: text,
      onPressed: onPressed,
      isLoading: isLoading,
      icon: icon,
      isFullWidth: width == double.infinity || width == null,
    );
  }
}
