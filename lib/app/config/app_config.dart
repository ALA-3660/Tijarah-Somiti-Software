import '../../core/demo/demo_organization_config.dart';
import '../../domain/entities/organization.dart';
import 'environment.dart';

/// AppConfig: কেন্দ্রীয় অ্যাপ্লিকেশন কনফিগারেশন
///
/// এই ক্লাসটি অ্যাপের নাম, ভার্সন, API Base URL এবং Environment
/// এক জায়গায় নিয়ন্ত্রণ করে। কোনো মান কোডের ভিতরে হার্ডকোড করা হবে না।
class AppConfig {
  final String appName;
  final String productPositioning;
  final String appVersion;
  final Environment environment;
  final String apiBaseUrl;
  final bool isDebugMode;
  final Duration connectTimeout;
  final Duration receiveTimeout;

  static AppConfig? _instance;

  AppConfig._internal({
    required this.appName,
    required this.productPositioning,
    required this.appVersion,
    required this.environment,
    required this.apiBaseUrl,
    required this.isDebugMode,
    required this.connectTimeout,
    required this.receiveTimeout,
  });

  /// বর্তমান সক্রিয় কনফিগারেশন অ্যাক্সেস করার মেথড
  static AppConfig get instance {
    if (_instance == null) {
      // ডিফল্ট হিসেবে Development কনফিগারেশন সেট করা থাকে
      _instance = AppConfig.development();
    }
    return _instance!;
  }

  /// সেন্ট্রাল ইনিশিয়ালাইজেশন
  static void initialize(AppConfig config) {
    _instance = config;
  }

  /// Development Environment (লোকাল ডেভেলপমেন্ট ও টেস্টিং)
  factory AppConfig.development() {
    return AppConfig._internal(
      appName: 'তিজারাহ সমিতি সফটওয়্যার',
      productPositioning: 'ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা',
      appVersion: '1.0.0-dev',
      environment: Environment.development,
      apiBaseUrl: 'http://10.0.2.2:8000/api/v1', // Android Emulator localhost
      isDebugMode: true,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
    );
  }

  /// Staging Environment (QA ও ক্লায়েন্ট রিভিউ)
  factory AppConfig.staging() {
    return AppConfig._internal(
      appName: 'তিজারাহ সমিতি সফটওয়্যার (Staging)',
      productPositioning: 'ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা',
      appVersion: '1.0.0-rc',
      environment: Environment.staging,
      apiBaseUrl: 'https://staging-api.tijarahsamity.com/api/v1',
      isDebugMode: true,
      connectTimeout: const Duration(seconds: 20),
      receiveTimeout: const Duration(seconds: 20),
    );
  }

  /// Production Environment (বাস্তব সমিতি ও ব্যবহারকারীদের জন্য)
  factory AppConfig.production() {
    return AppConfig._internal(
      appName: 'তিজারাহ সমিতি সফটওয়্যার',
      productPositioning: 'ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা',
      appVersion: '1.0.0',
      environment: Environment.production,
      apiBaseUrl: 'https://api.tijarahsamity.com/api/v1',
      isDebugMode: false,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    );
  }

  /// Environment নাম বাংলায় দেখার সুবিধার্থে
  String get environmentDisplayName {
    switch (environment) {
      case Environment.development:
        return 'ডেভেলপমেন্ট (Dev)';
      case Environment.staging:
        return 'স্টেজিং (Staging)';
      case Environment.production:
        return 'প্রোডাকশন (Live)';
    }
  }

  /// ডেভেলপমেন্ট ও ডেমো টেস্টের জন্য ডিফল্ট ডেমো অর্গানাইজেশন
  Organization get defaultDemoOrganization => Organization(
        id: DemoOrganizationConfig.demoOrgId,
        organizationCode: DemoOrganizationConfig.demoOrgCode,
        name: DemoOrganizationConfig.demoOrgName,
        shortName: DemoOrganizationConfig.demoOrgShortName,
        organizationType: OrganizationType.society,
        status: OrganizationStatus.active,
        createdAt: DateTime(2024, 1, 1),
        updatedAt: DateTime(2024, 1, 1),
      );
}
