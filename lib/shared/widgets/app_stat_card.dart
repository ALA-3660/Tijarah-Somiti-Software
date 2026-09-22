import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';
import 'app_loading.dart';

/// AppStatCard: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড স্ট্যাটিস্টিক / সামারি কার্ড
///
/// ড্যাশবোর্ড ও রিপোর্টের বিভিন্ন ম্যাট্রিক্স উপস্থাপনের জন্য ব্যবহৃত হয়।
class AppStatCard extends StatelessWidget {
  final String title;
  final String value;
  final String? unit;
  final IconData icon;
  final Color? accentColor;
  final String? trendLabel;
  final bool isTrendPositive;
  final bool isLoading;
  final bool isDemo;
  final VoidCallback? onTap;

  const AppStatCard({
    super.key,
    required this.title,
    required this.value,
    this.unit,
    required this.icon,
    this.accentColor,
    this.trendLabel,
    this.isTrendPositive = true,
    this.isLoading = false,
    this.isDemo = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveAccent = accentColor ?? AppColors.primary;

    final content = Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderLight),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header Row with Icon and Title
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: effectiveAccent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: Icon(icon, size: 20, color: effectiveAccent),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontFamily: AppTypography.fontHeading,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (isDemo)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryContainer,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text(
                    'DEMO',
                    style: TextStyle(
                      fontFamily: AppTypography.fontMono,
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      color: AppColors.secondaryDark,
                    ),
                  ),
                ),
            ],
          ),

          const SizedBox(height: AppSpacing.md),

          // Value Display
          if (isLoading)
            const AppSkeleton(height: 24, width: 100)
          else
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(
                  value,
                  style: TextStyle(
                    fontFamily: AppTypography.fontNumeric,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: effectiveAccent,
                  ),
                ),
                if (unit != null) ...[
                  const SizedBox(width: 4),
                  Text(
                    unit!,
                    style: const TextStyle(
                      fontFamily: AppTypography.fontBody,
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ],
            ),

          // Trend Row if provided
          if (trendLabel != null && !isLoading) ...[
            const SizedBox(height: AppSpacing.xs),
            Row(
              children: [
                Icon(
                  isTrendPositive ? Icons.trending_up : Icons.trending_down,
                  size: 14,
                  color: isTrendPositive ? AppColors.success : AppColors.error,
                ),
                const SizedBox(width: 4),
                Text(
                  trendLabel!,
                  style: TextStyle(
                    fontFamily: AppTypography.fontNumeric,
                    fontSize: 11,
                    color: isTrendPositive ? AppColors.success : AppColors.error,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );

    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: AppRadius.radiusLg,
          child: content,
        ),
      );
    }

    return content;
  }
}
