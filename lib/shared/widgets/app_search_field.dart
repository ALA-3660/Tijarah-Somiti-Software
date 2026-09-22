import 'dart:async';
import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppSearchField: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড সার্চ বার
///
/// ডিব্যউন্স (Debounce), লোডিং ইনডিকেটর এবং তাৎক্ষণিক ক্লিয়ার বাটন সাপোর্ট করে।
class AppSearchField extends StatefulWidget {
  final String hint;
  final ValueChanged<String> onSearch;
  final VoidCallback? onClear;
  final Duration debounceDuration;
  final bool isLoading;
  final String? initialValue;
  final String? semanticLabel;

  const AppSearchField({
    super.key,
    this.hint = 'নাম, কোড বা মোবাইল নম্বর দিয়ে খুঁজুন...',
    required this.onSearch,
    this.onClear,
    this.debounceDuration = const Duration(milliseconds: 350),
    this.isLoading = false,
    this.initialValue,
    this.semanticLabel,
  });

  @override
  State<AppSearchField> createState() => _AppSearchFieldState();
}

class _AppSearchFieldState extends State<AppSearchField> {
  late final TextEditingController _controller;
  Timer? _debounceTimer;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _onChanged(String value) {
    setState(() {}); // For clear button visibility
    _debounceTimer?.cancel();
    _debounceTimer = Timer(widget.debounceDuration, () {
      widget.onSearch(value);
    });
  }

  void _clear() {
    _controller.clear();
    setState(() {});
    _debounceTimer?.cancel();
    widget.onSearch('');
    widget.onClear?.call();
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: widget.semanticLabel ?? widget.hint,
      searchField: true,
      child: Container(
        height: 48,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: AppRadius.radiusMd,
          border: Border.all(color: AppColors.borderLight),
        ),
        child: Row(
          children: [
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: AppSpacing.sm + 2),
              child: Icon(Icons.search, size: 20, color: AppColors.primary),
            ),
            Expanded(
              child: TextField(
                controller: _controller,
                onChanged: _onChanged,
                style: const TextStyle(
                  fontFamily: AppTypography.fontBody,
                  fontSize: 13,
                  color: AppColors.textPrimary,
                ),
                decoration: InputDecoration(
                  hintText: widget.hint,
                  hintStyle: const TextStyle(
                    fontFamily: AppTypography.fontBody,
                    fontSize: 13,
                    color: AppColors.textTertiary,
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  isDense: true,
                ),
              ),
            ),
            if (widget.isLoading)
              const Padding(
                padding: EdgeInsets.only(right: AppSpacing.sm + 2),
                child: SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                ),
              )
            else if (_controller.text.isNotEmpty)
              IconButton(
                icon: const Icon(Icons.clear, size: 18, color: AppColors.textSecondary),
                onPressed: _clear,
                tooltip: 'অনুসন্ধান মুছুন',
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xs),
              ),
          ],
        ),
      ),
    );
  }
}
