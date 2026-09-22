import 'package:flutter/material.dart';
import 'config/app_config.dart';
import 'router/app_router.dart';
import 'router/route_names.dart';
import 'theme/app_theme.dart';

/// TijarahApp: মূল অ্যাপ্লিকেশন উইজেট
///
/// এটি Flutter MaterialApp-কে র‌্যাপ করে এবং কেন্দ্রীয় থিম,
/// রুট কনফিগারেশন এবং অ্যাপ টাইটেল সেট করে।
class TijarahApp extends StatelessWidget {
  const TijarahApp({super.key});

  @override
  Widget build(BuildContext context) {
    final config = AppConfig.instance;

    return MaterialApp(
      title: config.appName,
      debugShowCheckedModeBanner: config.isDebugMode,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      navigatorKey: AppRouter.navigatorKey,
      initialRoute: RouteNames.initial,
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}
