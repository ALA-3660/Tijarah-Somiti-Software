import 'dart:developer' as developer;
import '../config/app_config.dart';

/// AppLogger: কেন্দ্রীয় লগার ইউটিলিটি
///
/// সিকিউরিটি রুল: কোনো পাসওয়ার্ড, টোকেন বা সংবেদনশীল ডেটা
/// কনসোলে প্রিন্ট করা যাবে না। প্রোডাকশন মোডে অপ্রয়োজনীয় লগ বন্ধ থাকে।
class AppLogger {
  AppLogger._();

  static void debug(String message) {
    if (AppConfig.instance.isDebugMode) {
      developer.log('[DEBUG] $message', name: 'TijarahApp');
    }
  }

  static void info(String message) {
    developer.log('[INFO] $message', name: 'TijarahApp');
  }

  static void warning(String message) {
    developer.log('[WARN] $message', name: 'TijarahApp');
  }

  static void error(String message, [dynamic error, StackTrace? stackTrace]) {
    developer.log(
      '[ERROR] $message',
      name: 'TijarahApp',
      error: error,
      stackTrace: stackTrace,
    );
  }
}
