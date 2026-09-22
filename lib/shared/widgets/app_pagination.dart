import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';
import '../../core/utils/number_formatter.dart';

/// AppPagination: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড পেজিনেশন উইজেট
class AppPagination extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final int totalItems;
  final int pageSize;
  final ValueChanged<int> onPageChanged;
  final ValueChanged<int>? onPageSizeChanged;
  final List<int> pageSizeOptions;
  final bool isLoading;

  const AppPagination({
    super.key,
    required this.currentPage,
    required this.totalPages,
    required this.totalItems,
    this.pageSize = 10,
    required this.onPageChanged,
    this.onPageSizeChanged,
    this.pageSizeOptions = const [10, 25, 50, 100],
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final curPageBn = NumberFormatter.toBengaliNumber(currentPage);
    final totPageBn = NumberFormatter.toBengaliNumber(totalPages > 0 ? totalPages : 1);
    final totItemsBn = NumberFormatter.toBengaliNumber(totalItems);

    final canGoPrev = currentPage > 1 && !isLoading;
    final canGoNext = currentPage < totalPages && !isLoading;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Total Items Summary
        Text(
          'মোট $totItemsBn টি রেকর্ডের মধ্যে পৃষ্ঠা $curPageBn / $totPageBn',
          style: const TextStyle(
            fontFamily: AppTypography.fontNumeric,
            fontSize: 12,
            color: AppColors.textSecondary,
          ),
        ),

        // Navigation Buttons
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Previous Page Button
            OutlinedButton(
              onPressed: canGoPrev ? () => onPageChanged(currentPage - 1) : null,
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                minimumSize: const Size(48, 36),
                shape: AppRadius.shapeMd(),
                side: BorderSide(
                  color: canGoPrev ? AppColors.borderLight : AppColors.neutral200,
                ),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.chevron_left, size: 16),
                  SizedBox(width: 2),
                  Text(
                    'পূর্ববর্তী',
                    style: TextStyle(fontFamily: AppTypography.fontNumeric, fontSize: 11),
                  ),
                ],
              ),
            ),

            const SizedBox(width: AppSpacing.xs),

            // Next Page Button
            OutlinedButton(
              onPressed: canGoNext ? () => onPageChanged(currentPage + 1) : null,
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                minimumSize: const Size(48, 36),
                shape: AppRadius.shapeMd(),
                side: BorderSide(
                  color: canGoNext ? AppColors.borderLight : AppColors.neutral200,
                ),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'পরবর্তী',
                    style: TextStyle(fontFamily: AppTypography.fontNumeric, fontSize: 11),
                  ),
                  SizedBox(width: 2),
                  Icon(Icons.chevron_right, size: 16),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}
