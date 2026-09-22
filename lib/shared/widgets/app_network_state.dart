import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import 'app_button.dart';

/// AppNetworkStatus: নেটওয়ার্ক ও সংযোগ স্ট্যাটাস
enum AppNetworkStatus {
  online,
  offline,
  connecting,
  timeout,
  serverError,
  unauthorized,
  forbidden,
}

/// AppNetworkStateWidget: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড নেটওয়ার্ক স্টেট ভিউ
class AppNetworkStateWidget extends StatelessWidget {
  final AppNetworkStatus status;
  final VoidCallback? onRetry;
  final VoidCallback? onLogin;
  final VoidCallback? onBack;

  const AppNetworkStateWidget({
    super.key,
    required this.status,
    this.onRetry,
    this.onLogin,
    this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    if (status == AppNetworkStatus.online) {
      return const SizedBox.shrink();
    }

    String title;
    String message;
    IconData icon;
    Color iconColor;

    switch (status) {
      case AppNetworkStatus.offline:
        title = 'ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না';
        message = 'আপনার মোবাইল ডাটা বা ওয়াইফাই সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।';
        icon = Icons.wifi_off_rounded;
        iconColor = AppColors.secondary;
        break;

      case AppNetworkStatus.connecting:
        title = 'সার্ভারে সংযোগ স্থাপন করা হচ্ছে...';
        message = 'অনুগ্রহ করে অপেক্ষা করুন, সার্ভারের সাথে ডাটা সিঙ্ক হচ্ছে।';
        icon = Icons.cloud_sync_rounded;
        iconColor = AppColors.primary;
        break;

      case AppNetworkStatus.timeout:
        title = 'সংযোগের সময়সীমা শেষ হয়েছে';
        message = 'সার্ভার সাড়া দিতে বেশি সময় নিচ্ছে। আপনার নেটওয়ার্ক চেক করে আবার চেষ্টা করুন।';
        icon = Icons.timer_off_outlined;
        iconColor = AppColors.warning;
        break;

      case AppNetworkStatus.serverError:
        title = 'সার্ভার সাময়িক সমস্যার সম্মুখীন';
        message = 'আমাদের সেন্ট্রাল সার্ভারে সমস্যা হচ্ছে। কারিগরি দল এটি সমাধানে কাজ করছে।';
        icon = Icons.cloud_off_rounded;
        iconColor = AppColors.error;
        break;

      case AppNetworkStatus.unauthorized:
        title = 'লগইন সেশনের মেয়াদ শেষ';
        message = 'আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে অনুগ্রহ করে পুনরায় লগইন করুন।';
        icon = Icons.lock_clock_outlined;
        iconColor = AppColors.primary;
        break;

      case AppNetworkStatus.forbidden:
        title = 'অ্যাক্সেসের অনুমতি নেই';
        message = 'এই অংশটি ব্যবহারের জন্য আপনার ব্যবহারকারী রোলের প্রয়োজনীয় পারমিশন নেই।';
        icon = Icons.no_accounts_outlined;
        iconColor = AppColors.error;
        break;

      case AppNetworkStatus.online:
        return const SizedBox.shrink();
    }

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl, vertical: AppSpacing.xxl),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 380),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 68,
                height: 68,
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Icon(icon, color: iconColor, size: 34),
              ),

              const SizedBox(height: AppSpacing.lg),

              Text(
                title,
                style: const TextStyle(
                  fontFamily: AppTypography.fontHeading,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: AppSpacing.xs + 2),

              Text(
                message,
                style: const TextStyle(
                  fontFamily: AppTypography.fontBody,
                  fontSize: 13,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: AppSpacing.lg),

              if (status == AppNetworkStatus.unauthorized && onLogin != null)
                AppButton.primary(
                  label: 'পুনরায় লগইন করুন',
                  onPressed: onLogin,
                  icon: Icons.login,
                  size: AppButtonSize.sm,
                )
              else if (status == AppNetworkStatus.forbidden && onBack != null)
                AppButton.outline(
                  label: 'পূর্বের পৃষ্ঠায় ফিরুন',
                  onPressed: onBack,
                  icon: Icons.arrow_back,
                  size: AppButtonSize.sm,
                )
              else if (onRetry != null)
                AppButton.primary(
                  label: 'আবার চেষ্টা করুন',
                  onPressed: onRetry,
                  icon: Icons.refresh,
                  size: AppButtonSize.sm,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
