import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../../domain/entities/organization.dart';
import '../../data/models/organization_model.dart';
import '../constants/app_constants.dart';
import '../demo/demo_organization_config.dart';
import '../logging/app_logger.dart';
import '../storage/local_storage_service.dart';
import '../storage/secure_storage_service.dart';

/// OrganizationContext: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড অর্গানাইজেশন কনটেক্সট
///
/// এটি পুরো অ্যাপের টপ-লেভেল টেন্যান্ট বা বিজনেস বাউন্ডারি পরিচালনা করে।
/// প্রতিটি API রিকোয়েস্টে `X-Organization-Id` হেডার এবং লোকাল সেশনের ডেটা
/// আইসোলেশন নিশ্চিত করার জন্য এই ক্লাস authoritative গ্লোবাল কনটেক্সট প্রদান করে।
class OrganizationContext extends ChangeNotifier {
  static final OrganizationContext instance = OrganizationContext._internal();

  OrganizationContext._internal();

  Organization? _currentOrganization;
  bool _isInitialized = false;

  final SecureStorageService _secureStorage = SecureStorageService();
  final LocalStorageService _localStorage = LocalStorageService();
  static const String _cachedOrgKey = 'cached_active_organization';

  /// বর্তমান সক্রিয় সমিতি
  Organization? get currentOrganization => _currentOrganization;

  /// ইনিশিয়ালাইজেশন সম্পন্ন কিনা
  bool get isInitialized => _isInitialized;

  /// বর্তমান অর্গানাইজেশন আইডি
  String? get currentOrganizationId => _currentOrganization?.id;

  /// বর্তমান অর্গানাইজেশন কোড (যেমন: KOS-001)
  String get currentOrganizationCode => _currentOrganization?.organizationCode ?? '';

  /// বর্তমান অর্গানাইজেশনের পূর্ণ নাম
  String get currentOrganizationName =>
      _currentOrganization?.name ?? DemoOrganizationConfig.demoOrgName;

  /// বর্তমান অর্গানাইজেশনের সংক্ষিপ্ত নাম
  String get currentOrganizationShortName =>
      _currentOrganization?.shortName ?? DemoOrganizationConfig.demoOrgShortName;

  /// বর্তমান সক্রিয় অবস্থা
  OrganizationStatus get currentOrganizationStatus =>
      _currentOrganization?.status ?? OrganizationStatus.active;

  /// এটি কি ডেমো অর্গানাইজেশন
  bool get isDemo {
    if (_currentOrganization == null) return true;
    return DemoOrganizationConfig.isDemo(_currentOrganization!.id);
  }

  /// কোনো বৈধ সক্রিয় সমিতি বিদ্যমান কিনা
  bool get hasActiveOrganization => _currentOrganization != null;

  /// অর্গানাইজেশন কনটেক্সট প্রারম্ভিকীকরণ
  Future<void> initialize({Organization? defaultOrg}) async {
    if (_isInitialized && _currentOrganization != null) return;

    try {
      // ১. লোকাল ক্যাশ থেকে অর্গানাইজেশন রিড করার চেষ্টা
      final cachedJson = await _localStorage.getString(_cachedOrgKey);
      if (cachedJson != null && cachedJson.isNotEmpty) {
        try {
          final map = jsonDecode(cachedJson) as Map<String, dynamic>;
          _currentOrganization = OrganizationModel.fromJson(map);
          _isInitialized = true;
          notifyListeners();
          return;
        } catch (e) {
          AppLogger.warning('Corrupted cached organization: $e');
        }
      }

      // ২. ডিফল্ট বা ডেমো ইনিশিয়ালাইজেশন (UI testing / Demo fallback)
      if (defaultOrg != null) {
        _currentOrganization = defaultOrg;
      } else {
        _currentOrganization = _createDemoFallbackOrganization();
      }

      // সিকিউর স্টোরেজে আইডি সিঙ্ক করা (API Client-এর X-Organization-Id-এর জন্য)
      if (_currentOrganization != null) {
        await _secureStorage.saveCurrentOrganizationId(_currentOrganization!.id);
      }

      _isInitialized = true;
      notifyListeners();
    } catch (e) {
      AppLogger.error('Failed to initialize OrganizationContext: $e');
      _currentOrganization = _createDemoFallbackOrganization();
      _isInitialized = true;
      notifyListeners();
    }
  }

  /// বর্তমান অর্গানাইজেশন আপডেট / সেট করা
  Future<void> setOrganization(Organization org) async {
    _currentOrganization = org;

    try {
      final model = OrganizationModel.fromEntity(org);
      final jsonStr = jsonEncode(model.toJson());
      await _localStorage.setString(_cachedOrgKey, jsonStr);
      await _secureStorage.saveCurrentOrganizationId(org.id);
      AppLogger.info('OrganizationContext updated: ${org.id} (${org.name})');
    } catch (e) {
      AppLogger.error('Failed to persist organization context: $e');
    }

    notifyListeners();
  }

  /// স্ট্যাটাস পরিবর্তন করা (সক্রিয় / স্থগিত / আর্কাইভ)
  Future<void> updateStatus(OrganizationStatus status) async {
    if (_currentOrganization == null) return;
    final updated = _currentOrganization!.copyWith(status: status, updatedAt: DateTime.now());
    await setOrganization(updated);
  }

  /// বর্তমান অর্গানাইজেশন ক্লিয়ার করা (যেমন: লগআউটের সময়)
  Future<void> clearOrganization() async {
    _currentOrganization = null;
    await _localStorage.remove(_cachedOrgKey);
    await _secureStorage.delete(AppConstants.keyCurrentOrganizationId);
    _isInitialized = false;
    notifyListeners();
  }

  /// ডেমো ফলব্যাক অর্গানাইজেশন তৈরি
  static Organization _createDemoFallbackOrganization() {
    return Organization(
      id: DemoOrganizationConfig.demoOrgId,
      organizationCode: DemoOrganizationConfig.demoOrgCode,
      name: DemoOrganizationConfig.demoOrgName,
      shortName: DemoOrganizationConfig.demoOrgShortName,
      organizationType: OrganizationType.society,
      description:
          'তিজারাহ সমিতি সফটওয়্যার — ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা (ডেমো প্রতিষ্ঠান)',
      status: OrganizationStatus.active,
      createdAt: DateTime(2024, 1, 1),
      updatedAt: DateTime(2024, 1, 1),
      phone: '01812-345678',
      email: 'demo@khurushkul-samity.org',
      address: 'খুরুশকুল, কক্সবাজার সদর, কক্সবাজার',
      createdBy: 'System Seed',
      updatedBy: 'System Seed',
    );
  }
}
