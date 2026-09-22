import 'package:flutter/material.dart';
import '../../app/config/app_config.dart';
import '../../app/theme/app_colors.dart';

/// AppScaffold: অ্যাপ্লিকেশনের সমন্বিত লেআউট ফ্রেম
///
/// এটি স্ক্রিনের হেডার, স্ট্যাটাস বার, ব্যাকগ্রাউন্ড কালার
/// এবং কমন অ্যাকশন বারকে এক নিয়মে পরিচালনা করে।
class AppScaffold extends StatelessWidget {
  final String title;
  final Widget body;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final Widget? bottomNavigationBar;
  final bool showBackButton;
  final Widget? organizationBadge;

  const AppScaffold({
    super.key,
    required this.title,
    required this.body,
    this.actions,
    this.floatingActionButton,
    this.bottomNavigationBar,
    this.showBackButton = true,
    this.organizationBadge,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            if (organizationBadge != null)
              organizationBadge!
            else
              Text(
                AppConfig.instance.productPositioning,
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.white.withOpacity(0.85),
                  fontWeight: FontWeight.w400,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
          ],
        ),
        actions: actions,
        automaticallyImplyLeading: showBackButton,
      ),
      body: SafeArea(child: body),
      floatingActionButton: floatingActionButton,
      bottomNavigationBar: bottomNavigationBar,
    );
  }
}
