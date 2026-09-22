import '../../app/config/app_config.dart';
import '../../app/config/environment.dart';

/// Demo Organization Configuration — UI TESTING ONLY
///
/// এই কনফিগারেশনটি শুধুমাত্র Design System, Typography, Theme এবং Application Shell
/// পরীক্ষার জন্য ব্যবহৃত হয়।
///
/// **গুরুত্বপূর্ণ নিষেধাজ্ঞা ও নিরাপত্তা নীতিমালা:**
/// 1. 'খুরুশকুল ওলামা সমিতি'-কে কোনো বাস্তব Production Organization হিসেবে ব্যবহার করা যাবে না।
/// 2. কোনো বাস্তব সদস্য, মোবাইল নম্বর, আয়, ব্যয়, ফান্ড বা ব্যাংক ব্যালেন্স, শেয়ার বা সম্পদ
///    ডাটাবেজে যুক্ত করা যাবে না।
/// 3. UI পরীক্ষার জন্য প্রদর্শিত সকল সংখ্যা স্পষ্টভাবে 'DEMO / SAMPLE VALUE' হিসেবে চিহ্নিত হবে।
/// 4. Production Environment-এ ডেমো অর্গানাইজেশন স্বয়ংক্রিয়ভাবে নিষ্ক্রিয় ও ব্লকড থাকবে।
class DemoOrganizationConfig {
  DemoOrganizationConfig._();

  /// ডেমো অর্গানাইজেশনের অনুমোদিত নাম
  static const String demoOrgName = 'খুরুশকুল ওলামা সমিতি';
  static const String demoOrgShortName = 'খুরুশকুল সমিতি';
  static const String demoOrgId = 'demo-org-khurushkul-001';
  static const String demoOrgCode = 'DEMO-KHU-001';
  static const String demoStatus = 'DEMO / SAMPLE DATA';
  static const String demoBadgeText = 'DEMO ORGANIZATION';

  /// অ্যাপ পজিশনিং স্লোগান
  static const String productPositioning =
      'তিজারাহ সমিতি সফটওয়্যার\nইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা';

  /// প্রোডাকশন পরিবেশে ডেমো অর্গানাইজেশন সম্পূর্ণ নিষিদ্ধ
  static const bool allowInProduction = false;

  /// বর্তমান এনভায়রনমেন্টে ডেমো অর্গানাইজেশন সক্রিয় করা বৈধ কিনা
  static bool isDemoAllowed(Environment env) {
    if (env == Environment.production) {
      return false;
    }
    return true;
  }

  /// ডেমো অর্গানাইজেশন অবজেক্ট তৈরি
  static Map<String, dynamic> getDemoOrganizationContext() {
    final currentEnv = AppConfig.instance.environment;
    if (currentEnv == Environment.production) {
      throw StateError(
        'SECURITY VIOLATION: Demo organization ($demoOrgName) is strictly forbidden in Production environment.',
      );
    }

    return {
      'id': demoOrgId,
      'name': demoOrgName,
      'shortName': demoOrgShortName,
      'code': demoOrgCode,
      'status': 'demo',
      'isDemo': true,
      'demoBadgeText': demoBadgeText,
      'statusLabel': demoStatus,
      'tagline': productPositioning,
      'isProductionSafe': false,
    };
  }

  /// কোনো অর্গানাইজেশন আইডি ডেমো কিনা যাচাই
  static bool isDemo(String orgId) {
    return orgId == demoOrgId || orgId.startsWith('demo-');
  }

  /// ডেমো সতর্কবার্তা টেক্সট
  static const String demoDisclaimerNotice =
      'সতর্কতা: এটি একটি ডেমো অর্গানাইজেশন (খুরুশকুল ওলামা সমিতি)। এটি শুধুমাত্র UI, টাইপোগ্রাফি ও থিম পরীক্ষার জন্য সংরক্ষিত। এতে কোনো বাস্তব আর্থিক বা সদস্য ডেটা নেই।';
}
