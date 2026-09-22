import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_elevation.dart';
import '../../app/theme/app_typography.dart';

/// AppCard: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড কার্ড উইজেট
///
/// সাধারণ কন্টেইনার, হেডার-ফুটার সম্বলিত কার্ড, সিলেক্টেবল কার্ড
/// এবং এক্সপ্যান্ডেবল কার্ড সাপোর্ট করে।
class AppCard extends StatefulWidget {
  final Widget? child;
  final String? title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final Widget? footer;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final BorderSide? border;
  final BorderRadius? borderRadius;
  final bool hasShadow;
  final bool isSelected;
  final bool isDisabled;
  final bool isExpandable;
  final bool initiallyExpanded;
  final Widget? expandedContent;

  const AppCard({
    super.key,
    this.child,
    this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.footer,
    this.padding,
    this.onTap,
    this.backgroundColor,
    this.border,
    this.borderRadius,
    this.hasShadow = false,
    this.isSelected = false,
    this.isDisabled = false,
    this.isExpandable = false,
    this.initiallyExpanded = false,
    this.expandedContent,
  });

  @override
  State<AppCard> createState() => _AppCardState();
}

class _AppCardState extends State<AppCard> {
  late bool _isExpanded;

  @override
  void initState() {
    super.initState();
    _isExpanded = widget.initiallyExpanded;
  }

  void _toggleExpand() {
    setState(() {
      _isExpanded = !_isExpanded;
    });
  }

  @override
  Widget build(BuildContext context) {
    final effectiveRadius = widget.borderRadius ?? AppRadius.radiusLg;

    Color bgColor = widget.backgroundColor ?? AppColors.surfaceLight;
    if (widget.isSelected) {
      bgColor = AppColors.primary.withOpacity(0.04);
    }
    if (widget.isDisabled) {
      bgColor = AppColors.neutral50;
    }

    BorderSide effectiveBorder = widget.border ??
        BorderSide(
          color: widget.isSelected ? AppColors.primary : AppColors.borderLight,
          width: widget.isSelected ? 1.5 : 1.0,
        );

    Widget innerContent;

    if (widget.title != null || widget.leading != null || widget.trailing != null) {
      innerContent = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header Row
          Row(
            children: [
              if (widget.leading != null) ...[
                widget.leading!,
                const SizedBox(width: AppSpacing.sm),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (widget.title != null)
                      Text(
                        widget.title!,
                        style: TextStyle(
                          fontFamily: AppTypography.fontHeading,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: widget.isDisabled ? AppColors.textTertiary : AppColors.textPrimary,
                        ),
                      ),
                    if (widget.subtitle != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        widget.subtitle!,
                        style: TextStyle(
                          fontFamily: AppTypography.fontBody,
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (widget.trailing != null) ...[
                const SizedBox(width: AppSpacing.sm),
                widget.trailing!,
              ],
              if (widget.isExpandable) ...[
                const SizedBox(width: AppSpacing.xs),
                IconButton(
                  icon: Icon(
                    _isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                    size: 20,
                    color: AppColors.textSecondary,
                  ),
                  onPressed: _toggleExpand,
                  tooltip: _isExpanded ? 'সংক্ষেপ করুন' : 'বিস্তারিত দেখুন',
                ),
              ],
            ],
          ),

          // Main Body Child
          if (widget.child != null) ...[
            const SizedBox(height: AppSpacing.sm),
            widget.child!,
          ],

          // Expandable content
          if (widget.isExpandable && _isExpanded && widget.expandedContent != null) ...[
            const Divider(height: AppSpacing.lg, color: AppColors.borderLight),
            widget.expandedContent!,
          ],

          // Footer
          if (widget.footer != null) ...[
            const Divider(height: AppSpacing.lg, color: AppColors.borderLight),
            widget.footer!,
          ],
        ],
      );
    } else {
      innerContent = widget.child ?? const SizedBox.shrink();
    }

    final cardContainer = Container(
      padding: widget.padding ?? AppSpacing.cardPadding,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: effectiveRadius,
        border: Border.fromBorderSide(effectiveBorder),
        boxShadow: widget.hasShadow ? AppElevation.shadowSm : null,
      ),
      child: innerContent,
    );

    if (widget.onTap != null && !widget.isDisabled) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: widget.onTap,
          borderRadius: effectiveRadius,
          child: cardContainer,
        ),
      );
    }

    return cardContainer;
  }
}
