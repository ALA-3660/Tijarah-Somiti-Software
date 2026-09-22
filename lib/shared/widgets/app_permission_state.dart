import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import 'app_button.dart';

/// AppPermissionState: পারমিশন সীমাবদ্ধ স্টেট উইজেট
class AppPermissionState extends StatelessWidget {
  final String title;
  final String message;
  final String? requiredRoleOrPermission;
  final VoidCallback? onBack;

  const AppPermissionState({
    super.key,
    this.title = 'অনুমতি নেই (Access Restricted)',
    this.message = 'এই অংশটি ব্যবহারের জন্য আপনার অ্যাকাউন্টের প্রয়োজনীয় অনুমতি নেই। কোনো সহায়তার প্রয়োজন হলে অ্যাডমিনের সাথে যোগাযোগ করুন।',
    this.requiredRoleOrPermission,
    this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl, vertical: AppSpacing.xxl),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 380),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 68,
                height: 68,
                decoration: BoxDecoration(
                  color: AppColors.error.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: const Icon(
                  Icons.lock_person_outlined,
                  color: AppColors.error,
                  size: 34,
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

              if (requiredRoleOrPermission != null) ...[
                const SizedBox(height: AppSpacing.md),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.neutral100,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'প্রয়োজনীয় পারমিশন: $requiredRoleOrPermission',
                    style: const TextStyle(
                      fontFamily: AppTypography.fontMono,
                      fontSize: 11,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ],

              if (onBack != null) ...[
                const SizedBox(height: AppSpacing.lg),
                AppButton.outline(
                  label: 'পূর্ববর্তী মেন্যুতে ফিরুন',
                  onPressed: onBack,
                  icon: Icons.arrow_back,
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
