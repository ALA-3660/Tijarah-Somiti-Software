import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';

/// AppFormValidation: সেন্ট্রালাইজড বাংলা ভ্যালিডেশন প্রেজেন্টেশন ও মেসেজ হেল্পার
class AppFormValidation {
  AppFormValidation._();

  // স্ট্যান্ডার্ড বাংলা ভ্যালিডেশন মেসেজ
  static const String requiredMessage = 'এই ঘরটি পূরণ করা আবশ্যক।';
  static const String invalidPhoneMessage = 'সঠিক মোবাইল নম্বর (যেমন: ০১৭১২-৩৪৫৬৭৮) প্রদান করুন।';
  static const String invalidEmailMessage = 'সঠিক ইমেইল ঠিকানা প্রদান করুন।';
  static const String invalidNumberMessage = 'সঠিক সংখ্যা বা পরিমাণ লিখুন।';
  static const String invalidDateMessage = 'সঠিক তারিখ প্রদান করুন।';
  static const String invalidNidMessage = 'সঠিক জাতীয় পরিচয়পত্র নম্বর প্রদান করুন।';
  static const String positiveAmountRequired = 'পরিমাণ অবশ্যই শূন্যের চেয়ে বেশি হতে হবে।';

  /// রিকোয়ার্ড ফিল্ড ভ্যালিডেটর
  static String? required(String? value, [String? customMessage]) {
    if (value == null || value.trim().isEmpty) {
      return customMessage ?? requiredMessage;
    }
    return null;
  }

  /// ফোন নম্বর ভ্যালিডেটর
  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return requiredMessage;
    }
    final clean = value.replaceAll(RegExp(r'[\s\-]'), '');
    final regex = RegExp(r'^(?:\+88|88)?01[3-9]\d{8}$');
    if (!regex.hasMatch(clean)) {
      return invalidPhoneMessage;
    }
    return null;
  }

  /// ইমেইল ভ্যালিডেটর
  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) return null; // Optional
    final regex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!regex.hasMatch(value.trim())) {
      return invalidEmailMessage;
    }
    return null;
  }

  /// ঐচ্ছিক ফোন নম্বর ভ্যালিডেটর (ফাঁকা থাকলে ত্রুটি নেই, দিলে সঠিক ফরম্যাট আবশ্যক)
  static String? optionalPhone(String? value) {
    if (value == null || value.trim().isEmpty) return null;
    return phone(value);
  }

  /// অর্গানাইজেশন / সমিতি নাম ভ্যালিডেটর
  static String? organizationName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'সংগঠনের পূর্ণ নাম আবশ্যক।';
    }
    final normalized = value.trim().replaceAll(RegExp(r'\s+'), ' ');
    if (normalized.length < 3) {
      return 'সংগঠনের নাম নূন্যতম ৩ অক্ষরের হতে হবে।';
    }
    return null;
  }

  /// অর্গানাইজেশন কোড ভ্যালিডেটর
  static String? organizationCode(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'সংগঠনের অনন্য কোড প্রদান করা আবশ্যক।';
    }
    final clean = value.trim();
    if (clean.length < 3) {
      return 'কোড নূন্যতম ৩ অক্ষরের হতে হবে (যেমন: KOS-001)।';
    }
    final regex = RegExp(r'^[A-Za-z0-9\-_]+$');
    if (!regex.hasMatch(clean)) {
      return 'কোডে শুধুমাত্র ইংরেজি অক্ষর, সংখ্যা, হাইফেন (-) বা আন্ডারস্কোর (_) ব্যবহার করুন।';
    }
    return null;
  }

  /// বিবরণ ভ্যালিডেটর (দৈর্ঘ্য সীমা)
  static String? description(String? value, [int maxChars = 500]) {
    if (value == null || value.trim().isEmpty) return null;
    if (value.trim().length > maxChars) {
      return 'বিবরণ সর্বোচ্চ $maxChars অক্ষরের মধ্যে হতে হবে।';
    }
    return null;
  }

  /// ধনাত্মক সংখ্যা/টাকা ভ্যালিডেটর
  static String? positiveNumber(String? value) {
    if (value == null || value.trim().isEmpty) {
      return requiredMessage;
    }
    // বাংলা ডিজিটকে ইংরেজি ডিজিটে রূপান্তর
    final normalized = _convertBengaliToEnglishDigits(value.trim());
    final numValue = double.tryParse(normalized);
    if (numValue == null) {
      return invalidNumberMessage;
    }
    if (numValue <= 0) {
      return positiveAmountRequired;
    }
    return null;
  }

  /// নূন্যতম মান যাচাই
  static String? min(String? value, double minValue, [String? customMessage]) {
    if (value == null || value.trim().isEmpty) return requiredMessage;
    final normalized = _convertBengaliToEnglishDigits(value.trim());
    final numValue = double.tryParse(normalized);
    if (numValue == null) return invalidNumberMessage;
    if (numValue < minValue) {
      return customMessage ?? 'নূন্যতম পরিমাণ $minValue হতে হবে।';
    }
    return null;
  }

  /// সর্বোচ্চ মান যাচাই
  static String? max(String? value, double maxValue, [String? customMessage]) {
    if (value == null || value.trim().isEmpty) return null;
    final normalized = _convertBengaliToEnglishDigits(value.trim());
    final numValue = double.tryParse(normalized);
    if (numValue == null) return invalidNumberMessage;
    if (numValue > maxValue) {
      return customMessage ?? 'সর্বোচ্চ সীমা $maxValue অতিক্রম করা যাবে না।';
    }
    return null;
  }

  static String _convertBengaliToEnglishDigits(String input) {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    String result = input;
    for (int i = 0; i < 10; i++) {
      result = result.replaceAll(bengaliDigits[i], i.toString());
    }
    return result;
  }
}

/// AppValidationErrorSummary: ফর্মের একাধিক এরর দেখানোর সারসংক্ষেপ কার্ড
class AppValidationErrorSummary extends StatelessWidget {
  final List<String> errors;
  final VoidCallback? onDismiss;

  const AppValidationErrorSummary({
    super.key,
    required this.errors,
    this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    if (errors.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.error.withOpacity(0.06),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.error.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.error_outline, size: 18, color: AppColors.error),
              const SizedBox(width: AppSpacing.xs),
              const Text(
                'দয়া করে নিচের তথ্যগুলো সংশোধন করুন:',
                style: TextStyle(
                  fontFamily: AppTypography.fontHeading,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.error,
                ),
              ),
              const Spacer(),
              if (onDismiss != null)
                IconButton(
                  icon: const Icon(Icons.close, size: 16, color: AppColors.error),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  onPressed: onDismiss,
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          ...errors.map(
            (err) => Padding(
              padding: const EdgeInsets.only(left: 22.0, top: 2.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('• ', style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold)),
                  Expanded(
                    child: Text(
                      err,
                      style: const TextStyle(
                        fontFamily: AppTypography.fontBody,
                        fontSize: 12,
                        color: AppColors.error,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
