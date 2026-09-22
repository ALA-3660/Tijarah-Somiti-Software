import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import 'app_button.dart';

/// AppErrorState: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড এরর স্টেট উইজেট
///
/// ব্যবহারকারী-বান্ধব বাংলা বার্তা প্রদর্শন করে এবং টেকনিক্যাল এরর গোপন রাখে।
class AppErrorState extends StatelessWidget {
  final String title;
  final String message;
  final VoidCallback? onRetry;
  final String retryText;
  final String? technicalCode;
  final IconData icon;

  const AppErrorState({
    super.key,
    this.title = 'তথ্য লোড করা সম্ভব হয়নি',
    this.message = 'একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে। দয়া করে পুনরায় চেষ্টা করুন।',
    this.onRetry,
    this.retryText = 'আবার চেষ্টা করুন',
    this.technicalCode,
    this.icon = Icons.error_outline_rounded,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl, vertical: AppSpacing.xxl),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 360),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppColors.error.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Icon(
                  icon,
                  color: AppColors.error,
                  size: 32,
                ),
              ),

              const SizedBox(height: AppSpacing.lg),

              Text(
                title,
                style: const TextStyle(
                  fontFamily: AppTypography.fontHeading,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: AppSpacing.xs + 2),

              Text(
                message,
                style: const TextStyle(
                  fontFamily: AppTypography.fontBody,
                  fontSize: 13,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),

              if (technicalCode != null) ...[
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'রেফারেন্স কোড: $technicalCode',
                  style: const TextStyle(
                    fontFamily: AppTypography.fontMono,
                    fontSize: 10,
                    color: AppColors.textTertiary,
                  ),
                ),
              ],

              if (onRetry != null) ...[
                const SizedBox(height: AppSpacing.lg),
                AppButton.outline(
                  label: retryText,
                  onPressed: onRetry,
                  icon: Icons.refresh,
                  size: AppButtonSize.sm,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Backwards compatibility alias
class AppError extends StatelessWidget {
  final String title;
  final String message;
  final VoidCallback? onRetry;
  final String? retryText;

  const AppError({
    super.key,
    this.title = 'সমস্যা দেখা দিয়েছে',
    required this.message,
    this.onRetry,
    this.retryText,
  });

  @override
  Widget build(BuildContext context) {
    return AppErrorState(
      title: title,
      message: message,
      onRetry: onRetry,
      retryText: retryText ?? 'পুনরায় চেষ্টা করুন',
    );
  }
}
