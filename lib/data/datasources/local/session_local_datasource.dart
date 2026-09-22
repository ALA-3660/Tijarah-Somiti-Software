import '../../../core/storage/secure_storage_service.dart';

/// SessionLocalDataSource: সেশন ও টোকেন স্থানীয় সিকিউর স্টোরেজে সংরক্ষণ
abstract class SessionLocalDataSource {
  Future<String?> getAuthToken();
  Future<void> saveAuthToken(String token);
  Future<String?> getRefreshToken();
  Future<void> saveRefreshToken(String token);
  Future<void> clearSession();
}

class SessionLocalDataSourceImpl implements SessionLocalDataSource {
  final SecureStorageService _secureStorage;

  SessionLocalDataSourceImpl({SecureStorageService? secureStorage})
      : _secureStorage = secureStorage ?? SecureStorageService();

  @override
  Future<String?> getAuthToken() => _secureStorage.getAuthToken();

  @override
  Future<void> saveAuthToken(String token) => _secureStorage.saveAuthToken(token);

  @override
  Future<String?> getRefreshToken() => _secureStorage.getRefreshToken();

  @override
  Future<void> saveRefreshToken(String token) => _secureStorage.saveRefreshToken(token);

  @override
  Future<void> clearSession() => _secureStorage.clearSession();
}
