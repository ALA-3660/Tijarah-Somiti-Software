import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';
import '../logging/app_logger.dart';

/// SecureStorageService: এনক্রিপ্টেড সিকিউর স্টোরেজ অ্যাবস্ট্রাকশন
///
/// Android Keystore / iOS Keychain ব্যবহার করে সংবেদনশীল তথ্য
/// (যেমন: JWT অ্যাক্সেস টোকেন, রিফ্রেশ টোকেন, সক্রিয় প্রতিষ্ঠান আইডি) নিরাপদে রাখে।
class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService({FlutterSecureStorage? storage})
      : _storage = storage ??
            const FlutterSecureStorage(
              aOptions: AndroidOptions(
                encryptedSharedPreferences: true,
              ),
            );

  /// অথেনটিকেশন টোকেন সংরক্ষণ
  Future<void> saveAuthToken(String token) async {
    try {
      await _storage.write(key: AppConstants.keyAuthToken, value: token);
    } catch (e) {
      AppLogger.error('Failed to save auth token securely', e);
    }
  }

  /// সংরক্ষিত অথেনটিকেশন টোকেন উদ্ধার
  Future<String?> getAuthToken() async {
    try {
      return await _storage.read(key: AppConstants.keyAuthToken);
    } catch (e) {
      AppLogger.error('Failed to read auth token securely', e);
      return null;
    }
  }

  /// রিফ্রেশ টোকেন সংরক্ষণ
  Future<void> saveRefreshToken(String token) async {
    try {
      await _storage.write(key: AppConstants.keyRefreshToken, value: token);
    } catch (e) {
      AppLogger.error('Failed to save refresh token securely', e);
    }
  }

  /// রিফ্রেশ টোকেন উদ্ধার
  Future<String?> getRefreshToken() async {
    try {
      return await _storage.read(key: AppConstants.keyRefreshToken);
    } catch (e) {
      AppLogger.error('Failed to read refresh token securely', e);
      return null;
    }
  }

  /// বর্তমান সক্রিয় প্রতিষ্ঠানের আইডি সংরক্ষণ (মাল্টি-টেন্যান্ট কনটেক্সট)
  Future<void> saveCurrentOrganizationId(String organizationId) async {
    try {
      await _storage.write(
        key: AppConstants.keyCurrentOrganizationId,
        value: organizationId,
      );
    } catch (e) {
      AppLogger.error('Failed to save organization ID securely', e);
    }
  }

  /// বর্তমান সক্রিয় প্রতিষ্ঠানের আইডি উদ্ধার
  Future<String?> getCurrentOrganizationId() async {
    try {
      return await _storage.read(key: AppConstants.keyCurrentOrganizationId);
    } catch (e) {
      AppLogger.error('Failed to read organization ID securely', e);
      return null;
    }
  }

  /// সম্পূর্ণ সেশন মেটাডাটা সিকিউরলি সংরক্ষণ করা
  Future<void> saveSession({
    required String accessToken,
    required String refreshToken,
    DateTime? accessTokenExpiresAt,
    DateTime? refreshTokenExpiresAt,
    String? organizationId,
    String? userJson,
  }) async {
    try {
      await _storage.write(key: AppConstants.keyAuthToken, value: accessToken);
      await _storage.write(key: AppConstants.keyRefreshToken, value: refreshToken);
      if (accessTokenExpiresAt != null) {
        await _storage.write(
          key: AppConstants.keyAccessTokenExpiresAt,
          value: accessTokenExpiresAt.toIso8601String(),
        );
      }
      if (refreshTokenExpiresAt != null) {
        await _storage.write(
          key: AppConstants.keyRefreshTokenExpiresAt,
          value: refreshTokenExpiresAt.toIso8601String(),
        );
      }
      if (organizationId != null && organizationId.isNotEmpty) {
        await _storage.write(key: AppConstants.keyCurrentOrganizationId, value: organizationId);
      }
      if (userJson != null && userJson.isNotEmpty) {
        await _storage.write(key: AppConstants.keySessionUser, value: userJson);
      }
      AppLogger.info('Authentication session saved securely');
    } catch (e) {
      AppLogger.error('Failed to save session securely', e);
    }
  }

  /// অ্যাক্সেস টোকেন মেয়াদোত্তীর্ণ হওয়ার তারিখ
  Future<DateTime?> getAccessTokenExpiresAt() async {
    try {
      final str = await _storage.read(key: AppConstants.keyAccessTokenExpiresAt);
      if (str == null || str.isEmpty) return null;
      return DateTime.tryParse(str);
    } catch (e) {
      AppLogger.error('Failed to parse access token expiry', e);
      return null;
    }
  }

  /// রিফ্রেশ টোকেন মেয়াদোত্তীর্ণ হওয়ার তারিখ
  Future<DateTime?> getRefreshTokenExpiresAt() async {
    try {
      final str = await _storage.read(key: AppConstants.keyRefreshTokenExpiresAt);
      if (str == null || str.isEmpty) return null;
      return DateTime.tryParse(str);
    } catch (e) {
      AppLogger.error('Failed to parse refresh token expiry', e);
      return null;
    }
  }

  /// সেশন ব্যবহারকারী JSON মেটাডাটা
  Future<String?> getSessionUserJson() async {
    try {
      return await _storage.read(key: AppConstants.keySessionUser);
    } catch (e) {
      AppLogger.error('Failed to read session user JSON', e);
      return null;
    }
  }

  /// লগআউট বা সেশন রিসেট (সকল সংবেদনশীল ক্রেডেনশিয়াল মুছে ফেলা)
  Future<void> clearSession() async {
    try {
      await _storage.delete(key: AppConstants.keyAuthToken);
      await _storage.delete(key: AppConstants.keyRefreshToken);
      await _storage.delete(key: AppConstants.keyAccessTokenExpiresAt);
      await _storage.delete(key: AppConstants.keyRefreshTokenExpiresAt);
      await _storage.delete(key: AppConstants.keyCurrentOrganizationId);
      await _storage.delete(key: AppConstants.keySessionUser);
      AppLogger.info('Secure session cleared successfully');
    } catch (e) {
      AppLogger.error('Failed to clear secure session', e);
    }
  }

  /// কাস্টম কি-ভ্যালু পড়া ও লেখা
  Future<void> write(String key, String value) async => _storage.write(key: key, value: value);
  Future<String?> read(String key) async => _storage.read(key: key);
  Future<void> delete(String key) async => _storage.delete(key: key);
}
