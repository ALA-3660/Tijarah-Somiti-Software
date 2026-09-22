import { DartFileItem } from '../types';

export const FLUTTER_FILES: DartFileItem[] = [
  {
    path: 'lib/app/theme/app_typography.dart',
    name: 'app_typography.dart',
    layer: 'Theme',
    summary: 'সেন্ট্রাল টাইপোগ্রাফি আর্কিটেকচার। Hind Siliguri (হেডিংস), Baloo Da 2 (টাকা/বাটন), Tiro Bangla (বডি)।',
    code: `import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTypography {
  AppTypography._();

  static const String fontHeading = 'Hind Siliguri';
  static const String fontNumeric = 'Baloo Da 2';
  static const String fontBody = 'Tiro Bangla';
  static const String fontCode = 'JetBrains Mono';

  static TextTheme get lightTextTheme {
    return const TextTheme(
      displayLarge: TextStyle(
        fontFamily: fontHeading,
        fontSize: 32,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimaryLight,
      ),
      headlineLarge: TextStyle(
        fontFamily: fontHeading,
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimaryLight,
      ),
      bodyLarge: TextStyle(
        fontFamily: fontBody,
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: AppColors.textPrimaryLight,
      ),
      labelLarge: TextStyle(
        fontFamily: fontNumeric,
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimaryLight,
      ),
    );
  }

  static const TextStyle currencyHero = TextStyle(
    fontFamily: fontNumeric,
    fontSize: 32,
    fontWeight: FontWeight.w800,
    color: AppColors.primary,
  );
}`
  },
  {
    path: 'lib/app/theme/app_colors.dart',
    name: 'app_colors.dart',
    layer: 'Theme',
    summary: 'সেন্ট্রাল কালার প্যালেট। পান্না সবুজ (#0F5132), সোনালী অ্যাম্বার (#B45309), স্ট্যাটাস ও শরিয়াহ ওয়ার্কফ্লো টোকেন।',
    code: `import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary Brand Colors (পান্না সবুজ)
  static const Color primary = Color(0xFF0F5132);
  static const Color primaryDark = Color(0xFF0A3622);
  static const Color primaryLight = Color(0xFF198754);
  static const Color primaryContainer = Color(0xFFD1E7DD);

  // Secondary (হালাল সোনালী অ্যাম্বার)
  static const Color secondary = Color(0xFFB45309);
  static const Color secondaryContainer = Color(0xFFFEF3C7);

  // Status
  static const Color success = Color(0xFF198754);
  static const Color warning = Color(0xFFD97706);
  static const Color error = Color(0xFFDC3545);
  static const Color info = Color(0xFF0284C7);

  // Society Funds & Shariah Workflow UI Indicators
  static const Color shariahWorkflow = Color(0xFF0F5132);
  static const Color shariahReviewRequired = Color(0xFFB45309);
  static const Color adminFund = Color(0xFF0284C7);
  static const Color generalFund = Color(0xFF0F5132);
  static const Color shareFund = Color(0xFF0D9488);
  static const Color projectFund = Color(0xFFD97706);
  static const Color customFund = Color(0xFF6366F1);
}`
  },
  {
    path: 'lib/core/utils/bengali_number_formatter.dart',
    name: 'bengali_number_formatter.dart',
    layer: 'Core',
    summary: 'ইংরেজি সংখ্যাকে খাঁটি বাংলা সংখ্যা (০-৯) এবং দক্ষিণ এশীয় কমা ফরম্যাটে রূপান্তর।',
    code: `class BengaliNumberFormatter {
  BengaliNumberFormatter._();

  static const Map<String, String> _bengaliDigits = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯', '.': '.',
  };

  static String toBengali(dynamic input) {
    if (input == null) return '০';
    final str = input.toString();
    final buffer = StringBuffer();
    for (int i = 0; i < str.length; i++) {
      final char = str[i];
      buffer.write(_bengaliDigits[char] ?? char);
    }
    return buffer.toString();
  }

  static String formatWithCommas(num number, {int decimalPlaces = 0}) {
    // লখ / কোটি ফরম্যাটিং লজিক
    ...
  }
}`
  },
  {
    path: 'lib/core/utils/currency_formatter.dart',
    name: 'currency_formatter.dart',
    layer: 'Core',
    summary: 'টাকার অংক ফরম্যাট (৳ ১,২৫,০০০.০০ / ৳ ১.২৫ কোটি) ও প্রতীক ব্যবস্থাপনা।',
    code: `import 'bengali_number_formatter.dart';

class CurrencyFormatter {
  CurrencyFormatter._();

  static const String takaSymbol = '৳';

  static String format(num amount, {bool showDecimal = false, bool showSign = false}) {
    final formattedNum = BengaliNumberFormatter.formatWithCommas(
      amount.abs(),
      decimalPlaces: showDecimal ? 2 : 0,
    );
    if (amount < 0) return '-$takaSymbol $formattedNum';
    return '$takaSymbol $formattedNum';
  }

  static String formatCompact(num amount) {
    // কোটি ও লক্ষ অনুযায়ী সংক্ষিপ্ত রূপ
    ...
  }
}`
  },
  {
    path: 'lib/app/theme/app_theme.dart',
    name: 'app_theme.dart',
    layer: 'Theme',
    summary: 'Material 3 কনফিগারেশন। বাটন, টেক্সটফিল্ড, কার্ড ও ডায়ালগের স্ট্যান্ডার্ড থিম।',
    code: `import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';
import 'app_radius.dart';
import 'app_spacing.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: AppColors.primary,
      scaffoldBackgroundColor: AppColors.backgroundLight,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: AppColors.surfaceLight,
      ),
      textTheme: AppTypography.lightTextTheme,
      cardTheme: CardTheme(
        shape: AppRadius.shapeLg(
          side: const BorderSide(color: AppColors.borderLight),
        ),
      ),
    );
  }
}`
  },
  {
    path: 'lib/app/theme/app_spacing.dart',
    name: 'app_spacing.dart',
    layer: 'Theme',
    summary: '৪ ও ৮ পিক্সেল গ্রিড স্পেসিং টোকেন ও EdgeInsets শর্টকাট।',
    code: `import 'package:flutter/material.dart';

class AppSpacing {
  AppSpacing._();

  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double xxl = 24.0;
  static const double xxxl = 32.0;

  static const EdgeInsets screenPadding = EdgeInsets.symmetric(horizontal: lg, vertical: lg);
  static const EdgeInsets cardPadding = EdgeInsets.all(lg);
}`
  },
  {
    path: 'lib/app/theme/app_radius.dart',
    name: 'app_radius.dart',
    layer: 'Theme',
    summary: 'অ্যান্টি-স্লপ গাণিতিক বর্ডার রেডিয়াস টোকেন (Inner = Outer - Padding)।',
    code: `import 'package:flutter/material.dart';

class AppRadius {
  AppRadius._();

  static const double sm = 6.0;
  static const double md = 8.0;
  static const double lg = 12.0;
  static const double xl = 16.0;
  static const double full = 999.0;

  static const BorderRadius radiusSm = BorderRadius.all(Radius.circular(sm));
  static const BorderRadius radiusMd = BorderRadius.all(Radius.circular(md));
  static const BorderRadius radiusLg = BorderRadius.all(Radius.circular(lg));
}`
  },
  {
    path: 'lib/shared/widgets/app_button.dart',
    name: 'app_button.dart',
    layer: 'Shared',
    summary: 'প্রাইমারি, সেকেন্ডারি ও অ্যাম্বার বাটন উপাদান।',
    code: `import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_radius.dart';

class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;

  const PrimaryButton({super.key, required this.text, required this.onPressed, this.isLoading = false});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          shape: AppRadius.shapeMd(),
        ),
        child: Text(text, style: const TextStyle(fontFamily: AppTypography.fontNumeric)),
      ),
    );
  }
}`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    layer: 'Root',
    summary: 'মূল Flutter এন্ট্রি পয়েন্ট। সেন্ট্রাল কনফিগারেশন ইনিশিয়ালাইজ ও অ্যাপ রান করে।',
    code: `import 'package:flutter/material.dart';
import 'app/app.dart';
import 'app/config/app_config.dart';
import 'core/logging/app_logger.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final config = AppConfig.development();
  AppConfig.initialize(config);
  AppLogger.info('Starting \${config.appName} in \${config.environmentDisplayName}');
  runApp(const TijarahApp());
}`
  },
  {
    path: 'lib/core/network/api_client.dart',
    name: 'api_client.dart',
    layer: 'Core',
    summary: 'HTTP নেটওয়ার্ক ক্লায়েন্ট। স্বয়ংক্রিয় X-Organization-Id ও JWT Bearer হেডার ইনজেকশন।',
    code: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../storage/secure_storage.dart';
import '../errors/app_exception.dart';

class ApiClient {
  final String baseUrl;
  final SecureStorage secureStorage;

  ApiClient({required this.baseUrl, required this.secureStorage});

  Future<Map<String, String>> _buildHeaders() async {
    final token = await secureStorage.getAccessToken();
    final currentOrg = await secureStorage.getCurrentOrganization();

    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer \$token',
      if (currentOrg != null) 'X-Organization-Id': currentOrg.id,
    };
  }
}`
  },
  {
    path: 'lib/domain/entities/financial_dimension.dart',
    name: 'financial_dimension.dart',
    layer: 'Domain',
    summary: 'রুল ২১ (Head ≠ Fund ≠ Account) মডেলিং। ইসলামি অ্যাকাউন্টিং স্বাধীনতা নিশ্চিতকারী।',
    code: `class FinancialHead {
  final String id;
  final String name;
  final HeadCategory category; // income, expense, asset, liability, equity
}

class FinancialFund {
  final String id;
  final String name;
  final FundType type; // administrative, general, share, project, custom
}

class FinancialAccount {
  final String id;
  final String name;
  final AccountType type; // cash, bank_current, bank_savings, mobile_money
}
`
  },
  {
    path: 'lib/core/demo/demo_organization_config.dart',
    name: 'demo_organization_config.dart',
    layer: 'Core',
    summary: 'ডেমো অর্গানাইজেশন কনফিগারেশন (খুরুশকুল ওলামা সমিতি)। শুধুমাত্র UI, থিম ও টাইপোগ্রাফি পরীক্ষার জন্য সংরক্ষিত।',
    code: `import '../../app/config/app_config.dart';
import '../../app/config/environment.dart';

class DemoOrganizationConfig {
  DemoOrganizationConfig._();

  static const String demoOrgName = 'খুরুশকুল ওলামা সমিতি';
  static const String demoOrgShortName = 'খুরুশকুল সমিতি';
  static const String demoOrgId = 'demo-org-khurushkul-001';
  static const String demoOrgCode = 'DEMO-KHU-001';
  static const String demoStatus = 'DEMO / SAMPLE DATA';
  static const String demoBadgeText = 'DEMO ORGANIZATION';

  static const String productPositioning =
      'তিজারাহ সমিতি সফটওয়্যার\\nইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা';

  static const bool allowInProduction = false;

  static bool isDemoAllowed(Environment env) {
    return env != Environment.production;
  }

  static Map<String, dynamic> getDemoOrganizationContext() {
    final currentEnv = AppConfig.instance.environment;
    if (currentEnv == Environment.production) {
      throw StateError(
        'SECURITY VIOLATION: Demo organization is strictly forbidden in Production environment.',
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
    };
  }
}
`
  },
  {
    path: 'lib/app/router/navigation_registry.dart',
    name: 'navigation_registry.dart',
    layer: 'App',
    summary: 'সেন্ট্রালাইজড নেভিগেশন রেজিস্ট্রি। ১৩টি প্যারেন্ট মডিউল, ৯০+ চাইল্ড রুট, ব্রেডক্রাম্ব ও আইকন ম্যাপিং।',
    code: `import 'package:flutter/material.dart';
import 'route_names.dart';

class NavigationItem {
  final String id;
  final String title;
  final String? englishTitle;
  final IconData icon;
  final String route;
  final List<NavigationItem> children;
  final String? permissionKey;
  final bool isVisible;
  final int sortOrder;
  final String? description;
  final bool isStandalone;
}

class NavigationRegistry {
  static const List<NavigationItem> mainModules = [
    // ১. ড্যাশবোর্ড (Standalone)
    NavigationItem(id: 'dashboard', title: 'ড্যাশবোর্ড', route: RouteNames.dashboard, sortOrder: 1, isStandalone: true),
    // ২. সংগঠন, ব্যবহারকারী ও নিরাপত্তা (৬ সাব-রুট)
    NavigationItem(id: 'organization_security', title: 'সংগঠন, ব্যবহারকারী ও নিরাপত্তা', route: RouteNames.orgSecurity, sortOrder: 2, children: [...]),
    // ৩. সদস্য ব্যবস্থাপনা (৯ সাব-রুট)
    NavigationItem(id: 'members', title: 'সদস্য ব্যবস্থাপনা', route: RouteNames.members, sortOrder: 3, children: [...]),
    // ৪. মাস্টার ডাটা ও খাত ব্যবস্থাপনা (৯ সাব-রুট)
    NavigationItem(id: 'master_data', title: 'মাস্টার ডাটা ও খাত ব্যবস্থাপনা', route: RouteNames.masterData, sortOrder: 4, children: [...]),
    // ৫. অর্থ ও হিসাব (১১ সাব-রুট: ৩টি আলাদা ডাইমেনশন - Head, Fund, Account)
    NavigationItem(id: 'finance', title: 'অর্থ ও হিসাব', route: RouteNames.finance, sortOrder: 5, children: [...]),
    // ৬. শেয়ার ও প্রকল্প (৯ সাব-রুট)
    NavigationItem(id: 'shares_projects', title: 'শেয়ার ও প্রকল্প', route: RouteNames.sharesProjects, sortOrder: 6, children: [...]),
    // ৭. হালাল ব্যবসা (১২ সাব-রুট: সুদমুক্ত নির্ধারিত লাভ মডেল)
    NavigationItem(id: 'halal_business', title: 'হালাল ব্যবসা', route: RouteNames.halalBusiness, sortOrder: 7, children: [...]),
    // ৮. জমি, সম্পত্তি ও সম্পদ (৯ সাব-রুট)
    NavigationItem(id: 'assets', title: 'জমি, সম্পত্তি ও সম্পদ', route: RouteNames.assets, sortOrder: 8, children: [...]),
    // ৯. কমিটি, সভা ও পরিচালনা (১১ সাব-রুট)
    NavigationItem(id: 'governance', title: 'কমিটি, সভা ও পরিচালনা', route: RouteNames.governance, sortOrder: 9, children: [...]),
    // ১০. ডকুমেন্ট ও Google Drive (৭ সাব-রুট)
    NavigationItem(id: 'documents', title: 'ডকুমেন্ট ও Google Drive', route: RouteNames.documents, sortOrder: 10, children: [...]),
    // ১১. রিপোর্ট ও বিশ্লেষণ (১০ সাব-রুট)
    NavigationItem(id: 'reports', title: 'রিপোর্ট ও বিশ্লেষণ', route: RouteNames.reports, sortOrder: 11, children: [...]),
    // ১২. প্রশাসন ও সেটিংস (৯ সাব-রুট)
    NavigationItem(id: 'administration', title: 'প্রশাসন ও সেটিংস', route: RouteNames.administration, sortOrder: 12, children: [...]),
    // ১৩. সহায়িকা (৮ সাব-রুট: শরিয়াহ নীতিমালা শুধুমাত্র তথ্যবহুল গাইড)
    NavigationItem(id: 'help_guide', title: 'সহায়িকা', route: RouteNames.helpGuide, sortOrder: 13, children: [...]),
  ];
}`
  },
  {
    path: 'lib/app/router/route_names.dart',
    name: 'route_names.dart',
    layer: 'App',
    summary: 'সেন্ট্রালাইজড রুট কনস্ট্যান্ট ডিরেক্টরি। টাইপোমুক্ত ও স্কেলেবল রাউটিং।',
    code: `class RouteNames {
  static const String dashboard = '/dashboard';
  static const String orgSecurity = '/organization-security';
  static const String members = '/members';
  static const String masterData = '/master-data';
  static const String finance = '/finance';
  static const String sharesProjects = '/shares-projects';
  static const String halalBusiness = '/halal-business';
  static const String assets = '/assets';
  static const String governance = '/governance';
  static const String documents = '/documents';
  static const String reports = '/reports';
  static const String administration = '/administration';
  static const String helpGuide = '/help-guide';
}`
  },
  {
    path: 'lib/shared/layouts/app_navigation_shell.dart',
    name: 'app_navigation_shell.dart',
    layer: 'Shared',
    summary: '২-স্তর সমন্বিত নেভিগেশন শেল ও রেসপনসিভ লেআউট (Desktop Dual-Sidebar + Mobile Drawer)।',
    code: `class AppNavigationShell extends StatefulWidget {
  // স্তর ১ (Main Sidebar) + স্তর ২ (Sub-sidebar) + কনটেন্ট ক্যানভাস
  // ব্রেডক্রাম্ব, অর্গানাইজেশন কনটেক্সট ব্যাজ এবং রেসপনসিভ ড্রয়ার হ্যান্ডলার।
}`
  },
  {
    path: 'docs/navigation.md',
    name: 'navigation.md',
    layer: 'Root',
    summary: 'নেভিগেশন ও সাইডবার আর্কিটেকচার স্ট্যান্ডার্ড ডকুমেন্টেশন।',
    code: `# তিজারাহ সমিতি সফটওয়্যার — নেভিগেশন ও সাইডবার আর্কিটেকচার
- স্তর ১: Main Sidebar (১৩টি প্রধান মডিউল)
- স্তর ২: Internal Sub-sidebar (৯০+ চাইল্ড রুট)
- রেসপনসিভ ও ব্রেডক্রাম্ব নেভিগেশন রুলস`
  }
];
