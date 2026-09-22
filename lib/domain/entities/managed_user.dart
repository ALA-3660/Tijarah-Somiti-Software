import 'role.dart';
import 'user_status.dart';

/// ManagedUser: অ্যাপ্লিকেশন ব্যবহারকারীর সম্পূর্ণ ম্যানেজমেন্ট ডোমেইন এন্টিটি
///
/// **সতর্কতা ও বাউন্ডারি:**
/// এটি শুধুমাত্র অ্যাপ্লিকেশনের লগইন অ্যাকাউন্ট, আইডেন্টিটি, অর্গানাইজেশন ইউজারশিপ এবং
/// রোল ম্যানেজমেন্টের জন্য ব্যবহৃত হয়। এটি 'Member Management' নয়।
class ManagedUser {
  /// স্থায়ী অপরিবর্তনীয় ইউজার আইডি (UUID)
  final String id;

  /// বর্তমান অর্গানাইজেশনের আইডি (টেন্যান্ট বাউন্ডারি)
  final String organizationId;

  /// অনন্য ও স্থায়ী হিউম্যান-রিডেবল ইউজার কোড (যেমন: USR-000001)
  final String userCode;

  /// পূর্ণ নাম
  final String fullName;

  /// মোবাইল নম্বর (বাংলাদেশ ফরম্যাট: 01XXXXXXXXX)
  final String mobile;

  /// ইমেইল ঠিকানা
  final String email;

  /// প্রোফাইল ছবির রেফারেন্স বা URL
  final String? profilePhoto;

  /// অ্যাকাউন্টের বর্তমান লাইফসাইকেল স্ট্যাটাস
  final UserStatus status;

  /// অর্গানাইজেশনের অধীনে অর্পিত ভূমিকাগুলোর তালিকা (Multiple Roles Supported)
  final List<Role> roles;

  /// অ্যাকাউন্ট তৈরির তারিখ ও সময়
  final DateTime createdAt;

  /// সর্বশেষ তথ্য হালনাগাদের তারিখ ও সময়
  final DateTime updatedAt;

  /// প্রস্তুতকারী ইউজারের আইডি
  final String? createdBy;

  /// সর্বশেষ হালনাগাদকারী ইউজারের আইডি
  final String? updatedBy;

  const ManagedUser({
    required this.id,
    required this.organizationId,
    required this.userCode,
    required this.fullName,
    required this.mobile,
    required this.email,
    this.profilePhoto,
    required this.status,
    required this.roles,
    required this.createdAt,
    required this.updatedAt,
    this.createdBy,
    this.updatedBy,
  });

  /// কার্যকর ভূমিকার বাংলা নামের তালিকা
  List<String> get roleNames => roles.map((r) => r.name).toList();

  /// কার্যকর ভূমিকাগুলোর মেশিন-কী তালিকা
  List<String> get roleKeys => roles.map((r) => r.key).toList();

  /// নির্দিষ্ট কোনো ভূমিকা অর্পিত আছে কিনা
  bool hasRole(String roleKey) => roles.any((r) => r.key == roleKey && r.isActive);

  /// ব্যবহারকারীর সকল ভূমিকার যৌথ (Union) পারমিশন সেট
  Set<String> get effectivePermissions {
    final permissions = <String>{};
    for (final role in roles) {
      if (role.isActive) {
        permissions.addAll(role.permissionKeys);
      }
    }
    return permissions;
  }

  /// নির্দিষ্ট পারমিশন আছে কিনা
  bool hasPermission(String permissionKey) => effectivePermissions.contains(permissionKey);

  ManagedUser copyWith({
    String? fullName,
    String? mobile,
    String? email,
    String? profilePhoto,
    UserStatus? status,
    List<Role>? roles,
    DateTime? updatedAt,
    String? updatedBy,
  }) {
    return ManagedUser(
      id: id,
      organizationId: organizationId,
      userCode: userCode,
      fullName: fullName ?? this.fullName,
      mobile: mobile ?? this.mobile,
      email: email ?? this.email,
      profilePhoto: profilePhoto ?? this.profilePhoto,
      status: status ?? this.status,
      roles: roles ?? this.roles,
      createdAt: createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      createdBy: createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_id': organizationId,
      'user_code': userCode,
      'full_name': fullName,
      'mobile': mobile,
      'email': email,
      'profile_photo': profilePhoto,
      'status': status.name,
      'roles': roles.map((r) => r.toJson()).toList(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'created_by': createdBy,
      'updated_by': updatedBy,
    };
  }

  factory ManagedUser.fromJson(Map<String, dynamic> json) {
    return ManagedUser(
      id: json['id'] as String? ?? '',
      organizationId: json['organization_id'] as String? ?? '',
      userCode: json['user_code'] as String? ?? '',
      fullName: json['full_name'] as String? ?? '',
      mobile: json['mobile'] as String? ?? '',
      email: json['email'] as String? ?? '',
      profilePhoto: json['profile_photo'] as String?,
      status: UserStatus.fromString(json['status'] as String? ?? 'active'),
      roles: (json['roles'] as List<dynamic>? ?? [])
          .map((r) => Role.fromJson(r as Map<String, dynamic>))
          .toList(),
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      createdBy: json['created_by'] as String?,
      updatedBy: json['updated_by'] as String?,
    );
  }
}
