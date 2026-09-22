import 'package:flutter/material.dart';
import '../../core/utils/number_formatter.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';

/// AppNumberDisplay: বাংলা সংখ্যার জন্য সেন্ট্রালাইজড রিইউজেবল ডিসপ্লে
class AppNumberDisplay extends StatelessWidget {
  final num value;
  final TextStyle? style;
  final bool isPercentage;
  final bool isCompact;
  final int decimalPlaces;
  final Color? color;
  final double? fontSize;
  final FontWeight? fontWeight;

  const AppNumberDisplay({
    super.key,
    required this.value,
    this.style,
    this.isPercentage = false,
    this.isCompact = false,
    this.decimalPlaces = 0,
    this.color,
    this.fontSize,
    this.fontWeight,
  });

  @override
  Widget build(BuildContext context) {
    String formatted;
    if (isPercentage) {
      formatted = NumberFormatter.toBengaliPercentage(value, decimalPlaces: decimalPlaces);
    } else if (isCompact) {
      formatted = NumberFormatter.toBengaliCompact(value);
    } else {
      formatted = NumberFormatter.toBengaliNumber(value);
    }

    final effectiveStyle = (style ??
            const TextStyle(
              fontFamily: AppTypography.fontNumeric,
              fontSize: 14,
              color: AppColors.textPrimary,
            ))
        .copyWith(
      color: color,
      fontSize: fontSize,
      fontWeight: fontWeight,
    );

    return Text(
      formatted,
      style: effectiveStyle,
    );
  }
}
