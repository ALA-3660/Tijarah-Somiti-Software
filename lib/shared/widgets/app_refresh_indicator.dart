import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';

/// AppRefreshView: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড পুল-টু-রিফ্রেশ র‍্যাপার
class AppRefreshView extends StatelessWidget {
  final Future<void> Function() onRefresh;
  final Widget child;

  const AppRefreshView({
    super.key,
    required this.onRefresh,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      color: AppColors.primary,
      backgroundColor: Colors.white,
      strokeWidth: 2.5,
      child: child,
    );
  }
}
