import 'package:flutter/material.dart';
import '../../core/utils/currency_formatter.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';

enum CurrencyDisplaySize {
  hero,
  large,
  medium,
  small,
}

/// AppCurrencyDisplay: টাকার অংক মানানসই টাইপোগ্রাফি ও চিহ্নের সাথে প্রদর্শনের উইজেট
class AppCurrencyDisplay extends StatelessWidget {
  final num amount;
  final CurrencyDisplaySize size;
  final Color? color;
  final bool showDecimal;
  final bool showSign;
  final String? label;

  const AppCurrencyDisplay({
    super.key,
    required this.amount,
    this.size = CurrencyDisplaySize.medium,
    this.color,
    this.showDecimal = false,
    this.showSign = false,
    this.label,
  });

  @override
  Widget build(BuildContext context) {
    final formattedString = CurrencyFormatter.format(
      amount,
      showDecimal: showDecimal,
      showSign: showSign,
    );

    TextStyle style;
    switch (size) {
      case CurrencyDisplaySize.hero:
        style = AppTypography.currencyHero;
        break;
      case CurrencyDisplaySize.large:
        style = AppTypography.currencyLarge;
        break;
      case CurrencyDisplaySize.medium:
        style = AppTypography.currencyMedium;
        break;
      case CurrencyDisplaySize.small:
        style = AppTypography.currencySmall;
        break;
    }

    if (color != null) {
      style = style.copyWith(color: color);
    } else if (showSign) {
      if (amount > 0) {
        style = style.copyWith(color: AppColors.success);
      } else if (amount < 0) {
        style = style.copyWith(color: AppColors.error);
      }
    }

    if (label != null) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label!,
            style: const TextStyle(
              fontFamily: AppTypography.fontBody,
              fontSize: 12,
              color: AppColors.textSecondaryLight,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(formattedString, style: style),
        ],
      );
    }

    return Text(formattedString, style: style);
  }
}
