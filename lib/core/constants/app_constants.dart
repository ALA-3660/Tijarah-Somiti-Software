/// AppConstants: অ্যাপ্লিকেশনের সাধারণ কনস্ট্যান্ট ভ্যালু
class AppConstants {
  AppConstants._();

  // Storage Keys
  static const String keyAuthToken = 'auth_token';
  static const String keyRefreshToken = 'refresh_token';
  static const String keyCurrentOrganizationId = 'current_organization_id';
  static const String keyUserPreferences = 'user_preferences';

  // Header Keys (Django REST API Multi-tenancy ও Authentication)
  static const String headerAuthorization = 'Authorization';
  static const String headerOrganizationId = 'X-Organization-Id'; // মাল্টি-টেন্যান্ট ডেটা আইসোলেশন
  static const String headerContentType = 'Content-Type';
  static const String headerAccept = 'Accept';

  // Default values
  static const String contentTypeJson = 'application/json';
}
