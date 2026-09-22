import 'dart:convert';
import '../../../core/constants/app_constants.dart';
import '../../../core/storage/local_storage_service.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../../models/organization_model.dart';

/// OrganizationLocalDataSource: স্থানীয় স্টোরেজে সক্রিয় সমিতি ক্যাশ করা
abstract class OrganizationLocalDataSource {
  Future<void> cacheActiveOrganization(OrganizationModel organization);
  Future<OrganizationModel?> getCachedActiveOrganization();
  Future<String?> getActiveOrganizationId();
  Future<void> setActiveOrganizationId(String id);
  Future<void> clearActiveOrganization();
}

class OrganizationLocalDataSourceImpl implements OrganizationLocalDataSource {
  final LocalStorageService _localStorage;
  final SecureStorageService _secureStorage;
  static const String _cachedOrgKey = 'cached_active_organization';

  OrganizationLocalDataSourceImpl({
    LocalStorageService? localStorage,
    SecureStorageService? secureStorage,
  })  : _localStorage = localStorage ?? LocalStorageService(),
        _secureStorage = secureStorage ?? SecureStorageService();

  @override
  Future<void> cacheActiveOrganization(OrganizationModel organization) async {
    final jsonStr = jsonEncode(organization.toJson());
    await _localStorage.setString(_cachedOrgKey, jsonStr);
    await _secureStorage.saveCurrentOrganizationId(organization.id);
  }

  @override
  Future<OrganizationModel?> getCachedActiveOrganization() async {
    final jsonStr = await _localStorage.getString(_cachedOrgKey);
    if (jsonStr == null || jsonStr.isEmpty) return null;
    try {
      final map = jsonDecode(jsonStr) as Map<String, dynamic>;
      return OrganizationModel.fromJson(map);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<String?> getActiveOrganizationId() async {
    return await _secureStorage.getCurrentOrganizationId();
  }

  @override
  Future<void> setActiveOrganizationId(String id) async {
    await _secureStorage.saveCurrentOrganizationId(id);
  }

  @override
  Future<void> clearActiveOrganization() async {
    await _localStorage.remove(_cachedOrgKey);
    await _secureStorage.delete(AppConstants.keyCurrentOrganizationId);
  }
}
