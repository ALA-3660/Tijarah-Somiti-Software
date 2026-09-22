import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';
import 'app_empty_state.dart';
import 'app_loading.dart';
import 'app_error.dart';

/// AppTableColumn: টেবিল কলামের ডেফিনিশন
class AppTableColumn<T> {
  final String title;
  final Widget Function(T item) cellBuilder;
  final double? width;
  final bool isNumeric;
  final bool isSortable;
  final String? sortKey;

  const AppTableColumn({
    required this.title,
    required this.cellBuilder,
    this.width,
    this.isNumeric = false,
    this.isSortable = false,
    this.sortKey,
  });
}

/// AppDataTable: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড রেসপনসিভ ডাটা টেবিল
///
/// বড় স্ক্রিনে স্ট্যান্ডার্ড টেবিল এবং মোবাইলে অ্যাডাপ্টিভ কার্ড ভিউ প্রদর্শন করে।
class AppDataTable<T> extends StatelessWidget {
  final List<AppTableColumn<T>> columns;
  final List<T> items;
  final bool isLoading;
  final String? errorMessage;
  final VoidCallback? onRetry;
  final String emptyTitle;
  final String emptyMessage;
  final Widget Function(T item)? mobileCardBuilder;
  final ValueChanged<T>? onItemTap;
  final Widget? pagination;

  const AppDataTable({
    super.key,
    required this.columns,
    required this.items,
    this.isLoading = false,
    this.errorMessage,
    this.onRetry,
    this.emptyTitle = 'কোনো তথ্য নেই',
    this.emptyMessage = 'এই তালিকায় প্রদর্শনের মতো কোনো রেকর্ড পাওয়া যায়নি।',
    this.mobileCardBuilder,
    this.onItemTap,
    this.pagination,
  });

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Padding(
        padding: EdgeInsets.all(AppSpacing.xxl),
        child: AppLoading.list(),
      );
    }

    if (errorMessage != null) {
      return AppErrorState(
        message: errorMessage!,
        onRetry: onRetry,
      );
    }

    if (items.isEmpty) {
      return AppEmptyState(
        title: emptyTitle,
        description: emptyMessage,
      );
    }

    final isMobile = MediaQuery.of(context).size.width < 768;

    if (isMobile && mobileCardBuilder != null) {
      return Column(
        children: [
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: items.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
            itemBuilder: (context, index) {
              final item = items[index];
              return InkWell(
                onTap: onItemTap != null ? () => onItemTap!(item) : null,
                borderRadius: AppRadius.radiusMd,
                child: mobileCardBuilder!(item),
              );
            },
          ),
          if (pagination != null) ...[
            const SizedBox(height: AppSpacing.md),
            pagination!,
          ],
        ],
      );
    }

    // Desktop/Tablet Full Table
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingRowColor: WidgetStateProperty.all(AppColors.neutral50),
              headingTextStyle: const TextStyle(
                fontFamily: AppTypography.fontHeading,
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
              dataTextStyle: const TextStyle(
                fontFamily: AppTypography.fontBody,
                fontSize: 13,
                color: AppColors.textPrimary,
              ),
              columnSpacing: AppSpacing.lg,
              horizontalMargin: AppSpacing.lg,
              columns: columns.map((col) {
                return DataColumn(
                  label: Text(col.title),
                  numeric: col.isNumeric,
                );
              }).toList(),
              rows: items.map((item) {
                return DataRow(
                  onSelectChanged: onItemTap != null ? (_) => onItemTap!(item) : null,
                  cells: columns.map((col) {
                    return DataCell(col.cellBuilder(item));
                  }).toList(),
                );
              }).toList(),
            ),
          ),
          if (pagination != null) ...[
            const Divider(height: 1, color: AppColors.borderLight),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: pagination!,
            ),
          ],
        ],
      ),
    );
  }
}
