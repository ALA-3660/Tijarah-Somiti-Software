import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppDropdownItem: ড্রপডাউনের সাধারণ আইটেম মডেল
class AppDropdownItem<T> {
  final T value;
  final String label;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;

  const AppDropdownItem({
    required this.value,
    required this.label,
    this.subtitle,
    this.leading,
    this.trailing,
  });
}

/// AppDropdown: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড ড্রপডাউন সিলেক্টর
///
/// সাধারণ ড্রপডাউন এবং বড় তালিকার জন্য ফিল্টারিং/সার্চ ড্রপডাউন সাপোর্ট করে।
class AppDropdown<T> extends StatelessWidget {
  final String? label;
  final String hint;
  final T? value;
  final List<AppDropdownItem<T>> items;
  final ValueChanged<T?>? onChanged;
  final String? errorText;
  final String? helperText;
  final bool isRequired;
  final bool isEnabled;
  final bool isLoading;
  final bool isClearable;
  final VoidCallback? onClear;
  final Widget? prefixIcon;

  const AppDropdown({
    super.key,
    this.label,
    required this.hint,
    required this.value,
    required this.items,
    required this.onChanged,
    this.errorText,
    this.helperText,
    this.isRequired = false,
    this.isEnabled = true,
    this.isLoading = false,
    this.isClearable = false,
    this.onClear,
    this.prefixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Row(
            children: [
              Text(
                label!,
                style: const TextStyle(
                  fontFamily: AppTypography.fontBody,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              if (isRequired)
                const Text(
                  ' *',
                  style: TextStyle(
                    color: AppColors.error,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
        ],

        Container(
          decoration: BoxDecoration(
            color: isEnabled ? Colors.white : AppColors.neutral50,
            borderRadius: AppRadius.radiusMd,
            border: Border.all(
              color: errorText != null
                  ? AppColors.error
                  : isEnabled
                      ? AppColors.borderLight
                      : AppColors.neutral200,
            ),
          ),
          child: isLoading
              ? const Padding(
                  padding: EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 14),
                  child: Row(
                    children: [
                      SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                      ),
                      SizedBox(width: AppSpacing.sm),
                      Text(
                        'লোড হচ্ছে...',
                        style: TextStyle(fontFamily: AppTypography.fontBody, fontSize: 13, color: AppColors.textTertiary),
                      ),
                    ],
                  ),
                )
              : DropdownButtonHideUnderline(
                  child: DropdownButton<T>(
                    value: value,
                    isExpanded: true,
                    hint: Row(
                      children: [
                        if (prefixIcon != null) ...[
                          prefixIcon!,
                          const SizedBox(width: AppSpacing.xs),
                        ],
                        Text(
                          hint,
                          style: const TextStyle(
                            fontFamily: AppTypography.fontBody,
                            fontSize: 13,
                            color: AppColors.textTertiary,
                          ),
                        ),
                      ],
                    ),
                    icon: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (isClearable && value != null && onClear != null)
                          IconButton(
                            icon: const Icon(Icons.clear, size: 16, color: AppColors.textSecondary),
                            onPressed: onClear,
                            tooltip: 'নির্বাচন বাতিল করুন',
                            constraints: const BoxConstraints(),
                            padding: const EdgeInsets.only(right: 6),
                          ),
                        const Icon(Icons.arrow_drop_down, color: AppColors.textSecondary),
                      ],
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                    items: items.map((item) {
                      return DropdownMenuItem<T>(
                        value: item.value,
                        child: Row(
                          children: [
                            if (item.leading != null) ...[
                              item.leading!,
                              const SizedBox(width: AppSpacing.xs),
                            ],
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    item.label,
                                    style: const TextStyle(
                                      fontFamily: AppTypography.fontBody,
                                      fontSize: 13,
                                      color: AppColors.textPrimary,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  if (item.subtitle != null)
                                    Text(
                                      item.subtitle!,
                                      style: const TextStyle(
                                        fontFamily: AppTypography.fontBody,
                                        fontSize: 11,
                                        color: AppColors.textSecondary,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                            if (item.trailing != null) item.trailing!,
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: isEnabled ? onChanged : null,
                  ),
                ),
        ),

        if (errorText != null) ...[
          const SizedBox(height: 4),
          Text(
            errorText!,
            style: const TextStyle(
              fontFamily: AppTypography.fontBody,
              fontSize: 11,
              color: AppColors.error,
            ),
          ),
        ] else if (helperText != null) ...[
          const SizedBox(height: 4),
          Text(
            helperText!,
            style: const TextStyle(
              fontFamily: AppTypography.fontBody,
              fontSize: 11,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ],
    );
  }
}
