import 'package:flutter/material.dart';
import '../../app/router/navigation_registry.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';

/// AppSubSidebar: স্তর ২ — Internal Left Sub-sidebar
///
/// কোনো মেইন মডিউল নির্বাচন করলে তার অধীনস্থ সাব-মডিউল ও রুটসমূহ
/// এই প্যানেলে প্রদর্শিত হয়।
class AppSubSidebar extends StatelessWidget {
  final NavigationItem parentModule;
  final String currentRoute;
  final ValueChanged<NavigationItem> onSubRouteSelected;
  final VoidCallback? onCloseSubSidebar;

  const AppSubSidebar({
    super.key,
    required this.parentModule,
    required this.currentRoute,
    required this.onSubRouteSelected,
    this.onCloseSubSidebar,
  });

  @override
  Widget build(BuildContext context) {
    final children = parentModule.children;

    return Container(
      width: 240,
      decoration: BoxDecoration(
        color: AppColors.surfaceVariantLight,
        border: const Border(
          right: BorderSide(color: AppColors.borderLight, width: 1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // প্যারেন্ট মডিউল টাইটেল হেডার
          _buildSubHeader(context),

          const Divider(height: 1, color: AppColors.borderLight),

          // সাব-মডিউল রুট আইটেমসমূহ
          Expanded(
            child: children.isEmpty
                ? _buildEmptyChildrenState(context)
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(
                      vertical: 8,
                      horizontal: 8,
                    ),
                    itemCount: children.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 2),
                    itemBuilder: (context, index) {
                      final child = children[index];
                      final isSelected = child.route == currentRoute;

                      return _buildSubItem(context, child, isSelected);
                    },
                  ),
          ),

          // সাব-সাইডবার ফুটনোটে মডিউল ক্যাটাগরি পরিচিতি
          _buildFooter(context),
        ],
      ),
    );
  }

  Widget _buildSubHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                parentModule.icon,
                size: 20,
                color: AppColors.primary,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  parentModule.title,
                  style: AppTypography.heading4(
                    color: AppColors.textPrimaryLight,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (onCloseSubSidebar != null)
                IconButton(
                  icon: const Icon(Icons.close, size: 18),
                  onPressed: onCloseSubSidebar,
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
                ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            parentModule.description ?? 'উপ-মেনু তালিকা (স্তর ২)',
            style: AppTypography.caption(
              color: AppColors.textSecondaryLight,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubItem(
    BuildContext context,
    NavigationItem item,
    bool isSelected,
  ) {
    return Material(
      color: isSelected ? Colors.white : Colors.transparent,
      borderRadius: AppRadius.radiusMd,
      elevation: isSelected ? 1 : 0,
      shadowColor: Colors.black12,
      child: InkWell(
        onTap: () => onSubRouteSelected(item),
        borderRadius: AppRadius.radiusMd,
        child: Container(
          constraints: const BoxConstraints(minHeight: 44),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          decoration: BoxDecoration(
            borderRadius: AppRadius.radiusMd,
            border: isSelected
                ? Border.all(color: AppColors.primary.withOpacity(0.3), width: 1)
                : null,
          ),
          child: Row(
            children: [
              Icon(
                item.icon,
                size: 18,
                color: isSelected ? AppColors.primary : AppColors.textSecondaryLight,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  item.title,
                  style: AppTypography.body(
                    color: isSelected
                        ? AppColors.primary
                        : AppColors.textPrimaryLight,
                    fontWeight:
                        isSelected ? FontWeight.bold : FontWeight.normal,
                    fontSize: 13,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (isSelected)
                Container(
                  width: 6,
                  height: 6,
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyChildrenState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.check_circle_outline,
              size: 32,
              color: AppColors.primary.withOpacity(0.6),
            ),
            const SizedBox(height: 8),
            Text(
              'একক ড্যাশবোর্ড স্ক্রিন',
              style: AppTypography.heading4(
                color: AppColors.textSecondaryLight,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'এই মডিউলের কোনো অতিরিক্ত সাব-মেনু নেই।',
              textAlign: TextAlign.center,
              style: AppTypography.caption(
                color: AppColors.textTertiaryLight,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: const BoxDecoration(
        border: Border(
          top: BorderSide(color: AppColors.borderLight, width: 1),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.account_tree_outlined,
            size: 14,
            color: AppColors.textTertiaryLight,
          ),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              'মোট ${parentModule.children.length}টি সাব-রুট',
              style: AppTypography.numeric(
                color: AppColors.textTertiaryLight,
                fontSize: 11,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
