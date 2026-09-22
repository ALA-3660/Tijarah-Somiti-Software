import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppBottomSheet: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড বটম-শিট কম্পোনেন্ট
class AppBottomSheet extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget content;
  final Widget? footer;
  final bool showCloseButton;
  final bool isDismissible;

  const AppBottomSheet({
    super.key,
    required this.title,
    this.subtitle,
    required this.content,
    this.footer,
    this.showCloseButton = true,
    this.isDismissible = true,
  });

  static Future<T?> show<T>({
    required BuildContext context,
    required String title,
    String? subtitle,
    required Widget content,
    Widget? footer,
    bool isScrollControlled = true,
    bool isDismissible = true,
  }) {
    return showModalBottomSheet<T>(
      context: context,
      isScrollControlled: isScrollControlled,
      isDismissible: isDismissible,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AppBottomSheet(
        title: title,
        subtitle: subtitle,
        content: content,
        footer: footer,
        isDismissible: isDismissible,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(AppRadius.xl),
          topRight: Radius.circular(AppRadius.xl),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 10, bottom: 6),
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.neutral300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.xs),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontFamily: AppTypography.fontHeading,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      if (subtitle != null) ...[
                        const SizedBox(height: 2),
                        Text(
                          subtitle!,
                          style: const TextStyle(
                            fontFamily: AppTypography.fontBody,
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                if (showCloseButton)
                  IconButton(
                    icon: const Icon(Icons.close, size: 20, color: AppColors.textSecondary),
                    onPressed: () => Navigator.of(context).pop(),
                    tooltip: 'বন্ধ করুন',
                  ),
              ],
            ),
          ),

          const Divider(height: 1, color: AppColors.borderLight),

          // Scrollable Content
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: content,
            ),
          ),

          // Optional Footer
          if (footer != null) ...[
            const Divider(height: 1, color: AppColors.borderLight),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: footer!,
            ),
          ],
        ],
      ),
    );
  }
}
