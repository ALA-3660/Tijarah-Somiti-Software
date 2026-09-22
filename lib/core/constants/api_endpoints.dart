/// ApiEndpoints: Django REST API-এর সব এন্ডপয়েন্টের তালিকা
///
/// প্রতিটি এন্ডপয়েন্ট সেন্ট্রাল কনফিগারেশনের উপর নির্ভরশীল।
/// কোনো এন্ডপয়েন্ট কোডের মাঝে হার্ডকোড করা হবে না।
class ApiEndpoints {
  ApiEndpoints._();

  // Authentication
  static const String login = '/auth/token/';
  static const String refreshToken = '/auth/token/refresh/';
  static const String logout = '/auth/logout/';
  static const String userProfile = '/auth/profile/';

  // Organizations (সমিতি / প্রতিষ্ঠান)
  static const String organizations = '/organizations/';
  static String organizationDetails(String id) => '/organizations/$id/';
  static String organizationMembership(String id) => '/organizations/$id/memberships/';

  // Future Modules (পরবর্তী ফেজের এন্ডপয়েন্ট আর্কিটেকচার)
  static const String members = '/members/';
  static const String accounts = '/finance/accounts/';
  static const String funds = '/finance/funds/';
  static const String transactionHeads = '/finance/heads/';
  static const String transactions = '/finance/transactions/';
}
