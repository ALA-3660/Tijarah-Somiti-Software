import 'package:flutter/material.dart';
import '../../app/config/app_config.dart';
import '../../app/router/navigation_registry.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';

/// AppNavigationSidebar: স্তর ১ — Main Sidebar (Parent Modules Only)
///
/// এই সাইডবারে শুধুমাত্র ১৩টি মূল প্যারেন্ট মডিউল তালিকা প্রদর্শিত হবে।
/// কোনো সাব-মডিউল বা বিস্তারিত ফিচার এখানে দেখানো হবে না।
class AppNavigationSidebar extends StatelessWidget {
  final NavigationItem selectedModule;
  final ValueChanged<NavigationItem> onModuleSelected;
  final bool isCollapsed;
  final VoidCallback? onToggleCollapse;

  const AppNavigationSidebar({
    super.key,
    required this.selectedModule,
    required this.onModuleSelected,
    this.isCollapsed = false,
    this.onToggleCollapse,
  });

  @override
  Widget build(BuildContext context) {
    final modules = NavigationRegistry.mainModules;

    return Container(
      width: isCollapsed ? 72 : 260,
      decoration: BoxDecoration(
        color: AppColors.surfaceLight,
        border: const Border(
          right: BorderSide(color: AppColors.borderLight, width: 1),
        ),
      ),
      child: Column(
        children: [
          // ব্র্যান্ডিং ও হেডার
          _buildHeader(context),

          const Divider(height: 1, color: AppColors.borderLight),

          // ১৩টি মেইন প্যারেন্ট মডিউল তালিকা
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
              itemCount: modules.length,
              separatorBuilder: (_, __) => const SizedBox(height: 2),
              itemBuilder: (context, index) {
                final module = modules[index];
                final isSelected = module.id == selectedModule.id;

                return _buildModuleItem(context, module, isSelected);
              },
            ),
          ),

          // ফুটার ও কলাপ্স বাটন
          const Divider(height: 1, color: AppColors.borderLight),
          _buildFooter(context),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      alignment: Alignment.centerLeft,
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: AppRadius.radiusMd,
            ),
            child: const Icon(
              Icons.account_balance,
              color: Colors.white,
              size: 22,
            ),
          ),
          if (!isCollapsed) ...[
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppConfig.instance.appName,
                    style: AppTypography.heading4(
                      color: AppColors.textPrimaryLight,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    'মেইন মেনু (স্তর ১)',
                    style: AppTypography.caption(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildModuleItem(
    BuildContext context,
    NavigationItem module,
    bool isSelected,
  ) {
    return Tooltip(
      message: isCollapsed ? module.title : '',
      child: Material(
        color: isSelected ? AppColors.primaryContainer : Colors.transparent,
        borderRadius: AppRadius.radiusMd,
        child: InkWell(
          onTap: () => onModuleSelected(module),
          borderRadius: AppRadius.radiusMd,
          child: Container(
            constraints: const BoxConstraints(minHeight: 48),
            padding: EdgeInsets.symmetric(
              horizontal: isCollapsed ? 12 : 12,
              vertical: 8,
            ),
            child: Row(
              children: [
                Icon(
                  module.icon,
                  size: 22,
                  color: isSelected ? AppColors.primary : AppColors.textSecondaryLight,
                ),
                if (!isCollapsed) ...[
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      module.title,
                      style: AppTypography.body(
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.textPrimaryLight,
                        fontWeight:
                            isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (module.isStandalone)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.secondaryContainer,
                        borderRadius: AppRadius.radiusSm,
                      ),
                      child: Text(
                        'একক',
                        style: AppTypography.numeric(
                          color: AppColors.secondary,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    )
                  else
                    Icon(
                      Icons.chevron_right_rounded,
                      size: 18,
                      color: isSelected
                          ? AppColors.primary
                          : AppColors.textTertiaryLight,
                    ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    return Container(
      height: 48,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Row(
        mainAxisAlignment:
            isCollapsed ? MainAxisAlignment.center : MainAxisAlignment.spaceBetween,
        children: [
          if (!isCollapsed)
            Text(
              'ভার্সন ১.০.০',
              style: AppTypography.numeric(
                color: AppColors.textTertiaryLight,
                fontSize: 11,
              ),
            ),
          if (onToggleCollapse != null)
            IconButton(
              icon: Icon(
                isCollapsed
                    ? Icons.keyboard_double_arrow_right_rounded
                    : Icons.keyboard_double_arrow_left_rounded,
                size: 20,
                color: AppColors.textSecondaryLight,
              ),
              onPressed: onToggleCollapse,
              tooltip: isCollapsed ? 'প্রসারিত করুন' : 'সংকুচিত করুন',
            ),
        ],
      ),
    );
  }
}
