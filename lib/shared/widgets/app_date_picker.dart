import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppDatePicker: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড বাংলা তারিখ চয়নকারী
class AppDatePicker extends StatelessWidget {
  final String? label;
  final String hint;
  final DateTime? selectedDate;
  final ValueChanged<DateTime?> onDateSelected;
  final DateTime? firstDate;
  final DateTime? lastDate;
  final bool isRequired;
  final bool isEnabled;
  final bool isClearable;
  final String? errorText;

  const AppDatePicker({
    super.key,
    this.label,
    this.hint = 'তারিখ নির্বাচন করুন',
    required this.selectedDate,
    required this.onDateSelected,
    this.firstDate,
    this.lastDate,
    this.isRequired = false,
    this.isEnabled = true,
    this.isClearable = true,
    this.errorText,
  });

  String _formatBengaliDate(DateTime date) {
    const bengaliMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    final dayBn = _toBengaliDigits(date.day.toString().padLeft(2, '0'));
    final monthBn = bengaliMonths[date.month - 1];
    final yearBn = _toBengaliDigits(date.year.toString());
    return '$dayBn $monthBn $yearBn';
  }

  static String _toBengaliDigits(String input) {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    String result = input;
    for (int i = 0; i < 10; i++) {
      result = result.replaceAll(i.toString(), bengaliDigits[i]);
    }
    return result;
  }

  Future<void> _pickDate(BuildContext context) async {
    if (!isEnabled) return;

    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: firstDate ?? DateTime(2000),
      lastDate: lastDate ?? DateTime(2100),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primary,
              onPrimary: Colors.white,
              onSurface: AppColors.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      onDateSelected(picked);
    }
  }

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
                const Text(' *', style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
        ],

        InkWell(
          onTap: () => _pickDate(context),
          borderRadius: AppRadius.radiusMd,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 12),
            decoration: BoxDecoration(
              color: isEnabled ? Colors.white : AppColors.neutral50,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(
                color: errorText != null ? AppColors.error : AppColors.borderLight,
              ),
            ),
            child: Row(
              children: [
                const Icon(Icons.calendar_today_outlined, size: 18, color: AppColors.primary),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Text(
                    selectedDate != null ? _formatBengaliDate(selectedDate!) : hint,
                    style: TextStyle(
                      fontFamily: selectedDate != null ? AppTypography.fontNumeric : AppTypography.fontBody,
                      fontSize: 13,
                      color: selectedDate != null ? AppColors.textPrimary : AppColors.textTertiary,
                    ),
                  ),
                ),
                if (isClearable && selectedDate != null && isEnabled)
                  IconButton(
                    icon: const Icon(Icons.clear, size: 16, color: AppColors.textSecondary),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    onPressed: () => onDateSelected(null),
                    tooltip: 'তারিখ মুছে ফেলুন',
                  ),
              ],
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
        ],
      ],
    );
  }
}

/// AppDateRangePicker: তারিখ রেঞ্জ চয়নকারী ("তারিখ থেকে" - "তারিখ পর্যন্ত")
class AppDateRangePicker extends StatelessWidget {
  final DateTimeRange? selectedRange;
  final ValueChanged<DateTimeRange?> onRangeSelected;
  final String? label;
  final bool isRequired;
  final bool isEnabled;

  const AppDateRangePicker({
    super.key,
    this.label = 'তারিখের পরিসীমা (Date Range)',
    required this.selectedRange,
    required this.onRangeSelected,
    this.isRequired = false,
    this.isEnabled = true,
  });

  String _formatRange(DateTimeRange range) {
    final start = AppDatePicker._toBengaliDigits('${range.start.day}/${range.start.month}/${range.start.year}');
    final end = AppDatePicker._toBengaliDigits('${range.end.day}/${range.end.month}/${range.end.year}');
    return '$start হতে $end';
  }

  Future<void> _pickRange(BuildContext context) async {
    if (!isEnabled) return;

    final picked = await showDateRangePicker(
      context: context,
      initialDateRange: selectedRange,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primary,
              onPrimary: Colors.white,
              onSurface: AppColors.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      onRangeSelected(picked);
    }
  }

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
                const Text(' *', style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
        ],

        InkWell(
          onTap: () => _pickRange(context),
          borderRadius: AppRadius.radiusMd,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 12),
            decoration: BoxDecoration(
              color: isEnabled ? Colors.white : AppColors.neutral50,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Row(
              children: [
                const Icon(Icons.date_range, size: 18, color: AppColors.primary),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Text(
                    selectedRange != null ? _formatRange(selectedRange!) : 'তারিখ থেকে ... তারিখ পর্যন্ত',
                    style: TextStyle(
                      fontFamily: selectedRange != null ? AppTypography.fontNumeric : AppTypography.fontBody,
                      fontSize: 13,
                      color: selectedRange != null ? AppColors.textPrimary : AppColors.textTertiary,
                    ),
                  ),
                ),
                if (selectedRange != null && isEnabled)
                  IconButton(
                    icon: const Icon(Icons.clear, size: 16, color: AppColors.textSecondary),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    onPressed: () => onRangeSelected(null),
                    tooltip: 'ফিল্টার বাতিল করুন',
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
