import 'package:flutter/material.dart';
import '../../features/authentication/presentation/screens/login_screen.dart';
import 'navigation_registry.dart';
import 'route_names.dart';
import '../../shared/layouts/app_navigation_shell.dart';

/// AppRouter: সেন্ট্রালাইজড নেভিগেশন কন্ট্রোলার
///
/// সব স্ক্রিন ট্রানজিশন এবং রুট হ্যান্ডলিং এই ক্লাসের মাধ্যমে পরিচালিত হয়।
class AppRouter {
  AppRouter._();

  /// গ্লোবাল নেভিগেটর কি (Context ছাড়া নেভিগেশন বা ডায়ালগের জন্য)
  static final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  /// রুট জেনারেটর মেথড
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    final routeName = settings.name ?? RouteNames.initial;

    if (routeName == RouteNames.initial ||
        routeName == RouteNames.shell ||
        routeName == RouteNames.dashboard) {
      return MaterialPageRoute(
        settings: settings,
        builder: (_) => const AppNavigationShell(initialRoute: RouteNames.dashboard),
      );
    }

    if (routeName == RouteNames.login) {
      return MaterialPageRoute(
        settings: settings,
        builder: (_) => const LoginScreen(),
      );
    }

    // নেভিগেশন রেজিস্ট্রিতে রেজিস্ট্রিকৃত যেকোনো রুট
    final matchedItem = NavigationRegistry.findItemByRoute(routeName);
    if (matchedItem != null) {
      return MaterialPageRoute(
        settings: settings,
        builder: (_) => AppNavigationShell(initialRoute: routeName),
      );
    }

    // রুট পাওয়া না গেলে স্ট্যান্ডার্ড বাংলা 404 হ্যান্ডলার
    return MaterialPageRoute(
      settings: settings,
      builder: (_) => Scaffold(
        appBar: AppBar(title: const Text('ত্রুটি - রুট পাওয়া যায়নি')),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 12),
              Text(
                'রুট "$routeName" পাওয়া যায়নি।',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: () => pushReplacementNamed(RouteNames.dashboard),
                child: const Text('ড্যাশবোর্ডে ফিরে যান'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// নেভিগেশন সহায়ক মেথডসমূহ
  static BuildContext? get currentContext => navigatorKey.currentContext;

  static Future<T?> pushNamed<T extends Object?>(String routeName, {Object? arguments}) {
    return navigatorKey.currentState!.pushNamed<T>(routeName, arguments: arguments);
  }

  static Future<T?> pushReplacementNamed<T extends Object?, TO extends Object?>(
    String routeName, {
    TO? result,
    Object? arguments,
  }) {
    return navigatorKey.currentState!.pushReplacementNamed<T, TO>(
      routeName,
      result: result,
      arguments: arguments,
    );
  }

  static void pop<T extends Object?>([T? result]) {
    return navigatorKey.currentState!.pop<T>(result);
  }
}

