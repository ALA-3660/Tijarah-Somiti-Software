/// SystemRoleKey: স্থির ও মেশিন-রিডেবল সিস্টেম রোল আইডেন্টিফায়ার
class SystemRoleKey {
  SystemRoleKey._();

  static const String superAdmin = 'super_admin';
  static const String secretary = 'secretary';
  static const String treasurer = 'treasurer';
  static const String collector = 'collector';
  static const String accountant = 'accountant';
  static const String auditor = 'auditor';
  static const String member = 'member';

  static const List<String> all = [
    superAdmin,
    secretary,
    treasurer,
    collector,
    accountant,
    auditor,
    member,
  ];

  static bool isSystemRole(String key) => all.contains(key);

  static String getBanglaName(String key) {
    switch (key) {
      case superAdmin:
        return 'সুপার অ্যাডমিন';
      case secretary:
        return 'সম্পাদক';
      case treasurer:
        return 'কোষাধ্যক্ষ';
      case collector:
        return 'আদায়কারী';
      case accountant:
        return 'হিসাবরক্ষক';
      case auditor:
        return 'নিরীক্ষক';
      case member:
        return 'সদস্য';
      default:
        return key;
    }
  }
}

/// Role: ভূমিকা বা রোল ডোমেইন এন্টিটি
///
/// ব্যবহারকারীর অ্যাক্সেস ও দায়িত্বের গ্রুপিং।
/// রোল সরাসরি সিকিউরিটি রুল নয়; রোলের সাথে যুক্ত পারমিশনই মূল সিকিউরিটি পলিসি।
class Role {
  final String id;
  final String organizationId;
  final String key;
  final String name;
  final String description;
  final bool isSystemRole;
  final bool isActive;
  final List<String> permissionKeys;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? createdBy;
  final String? updatedBy;

  const Role({
    required this.id,
    required this.organizationId,
    required this.key,
    required this.name,
    required this.description,
    this.isSystemRole = false,
    this.isActive = true,
    this.permissionKeys = const [],
    required this.createdAt,
    required this.updatedAt,
    this.createdBy,
    this.updatedBy,
  });

  bool hasPermission(String permissionKey) => permissionKeys.contains(permissionKey);

  Role copyWith({
    String? id,
    String? organizationId,
    String? key,
    String? name,
    String? description,
    bool? isSystemRole,
    bool? isActive,
    List<String>? permissionKeys,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? createdBy,
    String? updatedBy,
  }) {
    return Role(
      id: id ?? this.id,
      organizationId: organizationId ?? this.organizationId,
      key: key ?? this.key,
      name: name ?? this.name,
      description: description ?? this.description,
      isSystemRole: isSystemRole ?? this.isSystemRole,
      isActive: isActive ?? this.isActive,
      permissionKeys: permissionKeys ?? this.permissionKeys,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_id': organizationId,
      'key': key,
      'name': name,
      'description': description,
      'is_system_role': isSystemRole,
      'is_active': isActive,
      'permission_keys': permissionKeys,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'created_by': createdBy,
      'updated_by': updatedBy,
    };
  }

  factory Role.fromJson(Map<String, dynamic> json) {
    return Role(
      id: json['id'] as String? ?? '',
      organizationId: json['organization_id'] as String? ?? '',
      key: json['key'] as String? ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      isSystemRole: json['is_system_role'] as bool? ?? false,
      isActive: json['is_active'] as bool? ?? true,
      permissionKeys: (json['permission_keys'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
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

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Role &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          organizationId == other.organizationId;

  @override
  int get hashCode => Object.hash(id, organizationId);
}
