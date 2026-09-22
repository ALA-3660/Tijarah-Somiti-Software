import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import 'app_button.dart';

/// AppEmptyState: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড এম্পটি স্টেট উইজেট
class AppEmptyState extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final String? primaryActionLabel;
  final VoidCallback? onPrimaryAction;
  final String? secondaryActionLabel;
  final VoidCallback? onSecondaryAction;
  final Widget? customGraphic;

  const AppEmptyState({
    super.key,
    this.title = 'কোনো তথ্য পাওয়া যায়নি',
    this.description = 'এই তালিকায় বর্তমানে কোনো তথ্য বা রেকর্ড নেই।',
    this.icon = Icons.inbox_outlined,
    this.primaryActionLabel,
    this.onPrimaryAction,
    this.secondaryActionLabel,
    this.onSecondaryAction,
    this.customGraphic,
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
              if (customGraphic != null)
                customGraphic!
              else
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.08),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Icon(
                    icon,
                    color: AppColors.primary,
                    size: 36,
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
                description,
                style: const TextStyle(
                  fontFamily: AppTypography.fontBody,
                  fontSize: 13,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),

              if (primaryActionLabel != null && onPrimaryAction != null) ...[
                const SizedBox(height: AppSpacing.lg),
                AppButton.primary(
                  label: primaryActionLabel!,
                  onPressed: onPrimaryAction,
                  icon: Icons.add,
                  size: AppButtonSize.sm,
                ),
              ],

              if (secondaryActionLabel != null && onSecondaryAction != null) ...[
                const SizedBox(height: AppSpacing.xs),
                AppButton.text(
                  label: secondaryActionLabel!,
                  onPressed: onSecondaryAction,
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
