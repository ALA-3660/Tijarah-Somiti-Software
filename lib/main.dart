import 'package:flutter/material.dart';
import 'app/app.dart';
import 'app/config/app_config.dart';
import 'core/context/organization_context.dart';
import 'core/logging/app_logger.dart';

/// main: তিজারাহ সমিতি সফটওয়্যারের প্রধান এন্ট্রি পয়েন্ট
///
/// এটি ফ্রেমওয়ার্ক ইনিশিয়ালাইজ করে, সেন্ট্রাল কনফিগারেশন সেট করে
/// এবং মূল অ্যাপ্লিকেশন `TijarahApp` চালু করে।
void main() async {
  // ১. Flutter Engine ও উইজেট বাইন্ডিং নিশ্চিতকরণ
  WidgetsFlutterBinding.ensureInitialized();

  // ২. কেন্দ্রীয় কনফিগারেশন লোড (ডিফল্ট: Development পরিবেশ)
  // ভবিষ্যতে কমান্ড লাইন ফ্লেভার বা ডট-এনভ দিয়ে স্ট্রিং পরিবর্তনযোগ্য
  final config = AppConfig.development();
  AppConfig.initialize(config);

  // ৩. সেন্ট্রালাইজড অর্গানাইজেশন কনটেক্সট ইনিশিয়ালাইজেশন
  await OrganizationContext.instance.initialize();

  AppLogger.info('Starting ${config.appName} in ${config.environmentDisplayName}');

  // ৪. অ্যাপ্লিকেশন এক্সিকিউশন
  runApp(const TijarahApp());
}
