import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppTextField: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড রিইউজেবল টেক্সট ইনপুট
///
/// ফর্ম ইনপুট, পাসওয়ার্ড, সার্চ, সংখ্যা ও কারেন্সি ইনপুটের জন্য
/// বাংলা-ফার্স্ট টাইপোগ্রাফি ও অ্যাক্সেসিবিলিটি নিশ্চিত করে।
class AppTextField extends StatefulWidget {
  final String? label;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final TextEditingController? controller;
  final String? initialValue;
  final bool isPassword;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final Widget? prefix;
  final Widget? prefixIcon;
  final Widget? suffix;
  final Widget? suffixIcon;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onTap;
  final bool readOnly;
  final bool enabled;
  final bool isRequired;
  final bool isNumeric;
  final bool isCurrency;
  final bool isSearch;
  final int maxLines;
  final int minLines;
  final FocusNode? focusNode;
  final String? semanticLabel;

  const AppTextField({
    super.key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.controller,
    this.initialValue,
    this.isPassword = false,
    this.keyboardType,
    this.validator,
    this.prefix,
    this.prefixIcon,
    this.suffix,
    this.suffixIcon,
    this.onChanged,
    this.onSubmitted,
    this.onTap,
    this.readOnly = false,
    this.enabled = true,
    this.isRequired = false,
    this.isNumeric = false,
    this.isCurrency = false,
    this.isSearch = false,
    this.maxLines = 1,
    this.minLines = 1,
    this.focusNode,
    this.semanticLabel,
  });

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  late bool _obscureText;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.isPassword;
  }

  @override
  Widget build(BuildContext context) {
    TextInputType effectiveKeyboardType;
    if (widget.keyboardType != null) {
      effectiveKeyboardType = widget.keyboardType!;
    } else if (widget.isNumeric || widget.isCurrency) {
      effectiveKeyboardType = TextInputType.number;
    } else if (widget.maxLines > 1) {
      effectiveKeyboardType = TextInputType.multiline;
    } else {
      effectiveKeyboardType = TextInputType.text;
    }

    String effectiveFontFamily = (widget.isNumeric || widget.isCurrency)
        ? AppTypography.fontNumeric
        : AppTypography.fontBody;

    Widget? effectiveSuffixIcon = widget.suffixIcon;
    if (widget.isPassword) {
      effectiveSuffixIcon = IconButton(
        icon: Icon(
          _obscureText ? Icons.visibility_off : Icons.visibility,
          color: AppColors.textSecondary,
          size: 20,
        ),
        onPressed: () {
          setState(() {
            _obscureText = !_obscureText;
          });
        },
        tooltip: _obscureText ? 'পাসওয়ার্ড প্রদর্শন করুন' : 'পাসওয়ার্ড লুকান',
      );
    }

    Widget? effectivePrefix = widget.prefix;
    if (widget.isCurrency && effectivePrefix == null) {
      effectivePrefix = const Padding(
        padding: EdgeInsets.only(right: 6.0),
        child: Text(
          '৳',
          style: TextStyle(
            fontFamily: AppTypography.fontNumeric,
            fontWeight: FontWeight.bold,
            fontSize: 16,
            color: AppColors.primary,
          ),
        ),
      );
    }

    Widget? effectivePrefixIcon = widget.prefixIcon;
    if (widget.isSearch && effectivePrefixIcon == null) {
      effectivePrefixIcon = const Icon(Icons.search, size: 20, color: AppColors.textSecondary);
    }

    return Semantics(
      label: widget.semanticLabel ?? widget.label ?? widget.hintText,
      textField: true,
      enabled: widget.enabled,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.label != null) ...[
            Row(
              children: [
                Text(
                  widget.label!,
                  style: const TextStyle(
                    fontFamily: AppTypography.fontBody,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                if (widget.isRequired)
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
          TextFormField(
            controller: widget.controller,
            initialValue: widget.initialValue,
            focusNode: widget.focusNode,
            obscureText: _obscureText,
            keyboardType: effectiveKeyboardType,
            validator: widget.validator,
            onChanged: widget.onChanged,
            onFieldSubmitted: widget.onSubmitted,
            onTap: widget.onTap,
            readOnly: widget.readOnly,
            enabled: widget.enabled,
            maxLines: widget.isPassword ? 1 : widget.maxLines,
            minLines: widget.isPassword ? 1 : widget.minLines,
            style: TextStyle(
              fontFamily: effectiveFontFamily,
              fontSize: 14,
              color: widget.enabled ? AppColors.textPrimary : AppColors.textTertiary,
            ),
            decoration: InputDecoration(
              hintText: widget.hintText,
              hintStyle: const TextStyle(
                fontFamily: AppTypography.fontBody,
                fontSize: 13,
                color: AppColors.textTertiary,
              ),
              helperText: widget.helperText,
              helperStyle: const TextStyle(
                fontFamily: AppTypography.fontBody,
                fontSize: 11,
                color: AppColors.textSecondary,
              ),
              errorText: widget.errorText,
              errorStyle: const TextStyle(
                fontFamily: AppTypography.fontBody,
                fontSize: 11,
                color: AppColors.error,
              ),
              prefix: effectivePrefix,
              prefixIcon: effectivePrefixIcon,
              suffix: widget.suffix,
              suffixIcon: effectiveSuffixIcon,
              filled: true,
              fillColor: widget.enabled ? Colors.white : AppColors.neutral50,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.sm + 2,
              ),
              border: OutlineInputBorder(
                borderRadius: AppRadius.radiusMd,
                borderSide: const BorderSide(color: AppColors.borderLight),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: AppRadius.radiusMd,
                borderSide: const BorderSide(color: AppColors.borderLight),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: AppRadius.radiusMd,
                borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: AppRadius.radiusMd,
                borderSide: const BorderSide(color: AppColors.error),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: AppRadius.radiusMd,
                borderSide: const BorderSide(color: AppColors.error, width: 1.5),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
