/// AuthenticatedUser: অথেনটিকেটেড ব্যবহারকারীর ডোমেইন এন্টিটি
///
/// এটি কেবল ব্যবহারকারীর পরিচিতি ('আমি কে?') প্রকাশ করে।
/// কোনো Role বা Permission ভিত্তিক Authorization সিদ্ধান্ত এই মডেলে নেওয়া যাবে না।
class AuthenticatedUser {
  final String id;
  final String userCode;
  final String name;
  final String email;
  final String? phone;
  final String organizationId;
  final String organizationName;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Map<String, dynamic>? metadata;

  const AuthenticatedUser({
    required this.id,
    required this.userCode,
    required this.name,
    required this.email,
    this.phone,
    required this.organizationId,
    required this.organizationName,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
    this.metadata,
  });

  AuthenticatedUser copyWith({
    String? id,
    String? userCode,
    String? name,
    String? email,
    String? phone,
    String? organizationId,
    String? organizationName,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
    Map<String, dynamic>? metadata,
  }) {
    return AuthenticatedUser(
      id: id ?? this.id,
      userCode: userCode ?? this.userCode,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      organizationId: organizationId ?? this.organizationId,
      organizationName: organizationName ?? this.organizationName,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      metadata: metadata ?? this.metadata,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthenticatedUser &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userCode == other.userCode &&
          organizationId == other.organizationId;

  @override
  int get hashCode => id.hashCode ^ userCode.hashCode ^ organizationId.hashCode;

  @override
  String toString() {
    return 'AuthenticatedUser(id: $id, code: $userCode, name: $name, org: $organizationName, active: $isActive)';
  }
}
