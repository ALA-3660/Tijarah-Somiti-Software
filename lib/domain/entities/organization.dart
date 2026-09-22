/// OrganizationStatus: সমিতির সক্রিয় অবস্থা
enum OrganizationStatus {
  active,
  inactive,
  suspended,
  archived;

  String get labelBn {
    switch (this) {
      case OrganizationStatus.active:
        return 'সক্রিয়';
      case OrganizationStatus.inactive:
        return 'নিষ্ক্রিয়';
      case OrganizationStatus.suspended:
        return 'স্থগিত';
      case OrganizationStatus.archived:
        return 'আর্কাইভ';
    }
  }
}

/// OrganizationType: সমিতির বা প্রতিষ্ঠানের ধরন
enum OrganizationType {
  society,
  business,
  social,
  other;

  String get labelBn {
    switch (this) {
      case OrganizationType.society:
        return 'সমিতি / সমবায় সমিতি';
      case OrganizationType.business:
        return 'ব্যবসায়িক প্রতিষ্ঠান';
      case OrganizationType.social:
        return 'সামাজিক প্রতিষ্ঠান';
      case OrganizationType.other:
        return 'অন্যান্য';
    }
  }
}

/// Organization: সমিতি বা প্রতিষ্ঠানের ডোমেইন এন্টিটি
///
/// এটি মাল্টি-টেন্যান্সির মূল ভিত্তি। ভবিষ্যতের প্রতিটি ব্যবসায়িক রেকর্ড
/// (সদস্য, হিসাব, ফান্ড, লেনদেন, শেয়ার ইত্যাদি) একটি নির্দিষ্ট অর্গানাইজেশনের
/// অধীনে ডেটা আইসোলেশনে সংরক্ষিত হবে।
class Organization {
  final String id;
  final String organizationCode;
  final String name;
  final String shortName;
  final OrganizationType organizationType;
  final String? description;
  final String? logo;
  final String? address;
  final String? phone;
  final String? email;
  final OrganizationStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? createdBy;
  final String? updatedBy;

  const Organization({
    required this.id,
    required this.organizationCode,
    required this.name,
    required this.shortName,
    this.organizationType = OrganizationType.society,
    this.description,
    this.logo,
    this.address,
    this.phone,
    this.email,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    this.createdBy,
    this.updatedBy,
  });

  bool get isActive => status == OrganizationStatus.active;
  bool get isArchived => status == OrganizationStatus.archived;
  String get statusLabel => status.labelBn;
  String get typeLabel => organizationType.labelBn;

  Organization copyWith({
    String? id,
    String? organizationCode,
    String? name,
    String? shortName,
    OrganizationType? organizationType,
    String? description,
    String? logo,
    String? address,
    String? phone,
    String? email,
    OrganizationStatus? status,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? createdBy,
    String? updatedBy,
  }) {
    return Organization(
      id: id ?? this.id,
      organizationCode: organizationCode ?? this.organizationCode,
      name: name ?? this.name,
      shortName: shortName ?? this.shortName,
      organizationType: organizationType ?? this.organizationType,
      description: description ?? this.description,
      logo: logo ?? this.logo,
      address: address ?? this.address,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Organization && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() =>
      'Organization(id: $id, code: $organizationCode, name: $name, status: $status)';
}
