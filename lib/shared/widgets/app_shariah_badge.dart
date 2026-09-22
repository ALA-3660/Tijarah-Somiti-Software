import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';

enum ShariahWorkflowStatus {
  workflowFollowed,
  underReview,
  reviewRequired,
  informationalGuideline,
}

/// AppShariahBadge: তথ্যবহুল শরিয়াহ ওয়ার্কফ্লো ও রিভিউ নির্দেশক ব্যাজ (Informational UI Indicator Only)
/// 
/// গুরুত্বপূর্ণ নীতিগত নোট:
/// এই ব্যাজটি কোনো ফতোয়া প্রদান করে না এবং সফটওয়্যার স্বয়ংক্রিয়ভাবে কোনো লেনদেনকে 'হালাল/হারাম' বিচার করে না।
/// এটি শুধুমাত্র প্রাতিষ্ঠানিক শরিয়াহ রিভিউ এবং স্ট্যান্ডার্ড প্রসিডিউর অনুসরণের তথ্য নির্দেশক।
class AppShariahBadge extends StatelessWidget {
  final ShariahWorkflowStatus status;
  final String? customLabel;

  const AppShariahBadge({
    super.key,
    this.status = ShariahWorkflowStatus.workflowFollowed,
    this.customLabel,
  });

  @override
  Widget build(BuildContext context) {
    String label;
    Color bgColor;
    Color textColor;
    IconData icon;

    switch (status) {
      case ShariahWorkflowStatus.workflowFollowed:
        label = customLabel ?? 'শরিয়াহ নীতিমালা অনুসরণকারী Workflow';
        bgColor = AppColors.primaryContainer;
        textColor = AppColors.primary;
        icon = Icons.verified_outlined;
        break;
      case ShariahWorkflowStatus.underReview:
        label = customLabel ?? 'শরিয়াহ নীতিমালা অনুযায়ী পর্যালোচনাধীন';
        bgColor = AppColors.secondaryContainer;
        textColor = AppColors.secondary;
        icon = Icons.pending_actions_outlined;
        break;
      case ShariahWorkflowStatus.reviewRequired:
        label = customLabel ?? 'শরিয়াহ Review Required';
        bgColor = AppColors.warningContainer;
        textColor = AppColors.warning;
        icon = Icons.assignment_late_outlined;
        break;
      case ShariahWorkflowStatus.informationalGuideline:
        label = customLabel ?? 'শরিয়াহ গাইডলাইন নির্দেশিত';
        bgColor = AppColors.infoContainer;
        textColor = AppColors.info;
        icon = Icons.info_outline;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: AppRadius.radiusSm,
        border: Border.all(color: textColor.withOpacity(0.25), width: 0.8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: textColor),
          const SizedBox(width: AppSpacing.xs),
          Text(
            label,
            style: TextStyle(
              fontFamily: AppTypography.fontNumeric,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}
