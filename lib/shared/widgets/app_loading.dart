import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppLoadingType: লোডিং ডিসপ্লে স্টাইল
enum AppLoadingType {
  fullPage,
  section,
  inline,
  list,
}

/// AppLoading: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড লোডিং উইজেট
class AppLoading extends StatelessWidget {
  final String? message;
  final AppLoadingType type;
  final double size;
  final Color? color;

  const AppLoading({
    super.key,
    this.message = 'তথ্য লোড হচ্ছে...',
    this.type = AppLoadingType.section,
    this.size = 36.0,
    this.color,
  });

  const AppLoading.fullPage({
    super.key,
    this.message = 'অনুগ্রহ করে অপেক্ষা করুন...',
    this.size = 44.0,
    this.color,
  }) : type = AppLoadingType.fullPage;

  const AppLoading.inline({
    super.key,
    this.message,
    this.size = 18.0,
    this.color,
  }) : type = AppLoadingType.inline;

  const AppLoading.list({
    super.key,
    this.message = 'তালিকা প্রস্তুত হচ্ছে...',
    this.size = 28.0,
    this.color,
  }) : type = AppLoadingType.list;

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? AppColors.primary;

    if (type == AppLoadingType.inline) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(effectiveColor),
            ),
          ),
          if (message != null) ...[
            const SizedBox(width: AppSpacing.sm),
            Text(
              message!,
              style: TextStyle(
                fontFamily: AppTypography.fontBody,
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ],
      );
    }

    final content = Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: CircularProgressIndicator(
            strokeWidth: 3,
            valueColor: AlwaysStoppedAnimation<Color>(effectiveColor),
          ),
        ),
        if (message != null) ...[
          const SizedBox(height: AppSpacing.md),
          Text(
            message!,
            style: const TextStyle(
              fontFamily: AppTypography.fontBody,
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ],
    );

    if (type == AppLoadingType.fullPage) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: Center(child: content),
      );
    }

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: content,
      ),
    );
  }
}

/// AppSkeleton: লেআউট শিফট ছাড়া কন্টেন্ট লোডিং স্কেলিটন
class AppSkeleton extends StatefulWidget {
  final double? width;
  final double height;
  final BorderRadius? borderRadius;

  const AppSkeleton({
    super.key,
    this.width,
    required this.height,
    this.borderRadius,
  });

  const AppSkeleton.circle({
    super.key,
    required double size,
  })  : width = size,
        height = size,
        borderRadius = const BorderRadius.all(Radius.circular(100));

  @override
  State<AppSkeleton> createState() => _AppSkeletonState();
}

class _AppSkeletonState extends State<AppSkeleton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.3, end: 0.8).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            color: AppColors.neutral200.withOpacity(_animation.value),
            borderRadius: widget.borderRadius ?? AppRadius.radiusMd,
          ),
        );
      },
    );
  }
}

/// AppSkeletonCard: লিস্ট বা টেবিল আইটেমের জন্য কার্ড স্কেলিটন
class AppSkeletonCard extends StatelessWidget {
  const AppSkeletonCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        children: [
          const AppSkeleton.circle(size: 40),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                AppSkeleton(height: 14, width: 140),
                SizedBox(height: 8),
                AppSkeleton(height: 10, width: 200),
              ],
            ),
          ),
          const AppSkeleton(height: 20, width: 60),
        ],
      ),
    );
  }
}
