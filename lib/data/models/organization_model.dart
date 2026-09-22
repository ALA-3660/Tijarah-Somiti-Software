import '../../domain/entities/organization.dart';

/// OrganizationModel: Django REST API রেসপন্স থেকে তৈরি DTO মডেল
///
/// এটি ডোমেইন Entity `Organization`-কে এক্সটেন্ড করে এবং
/// JSON serialization / deserialization পরিচালনা করে।
class OrganizationModel extends Organization {
  const OrganizationModel({
    required super.id,
    required super.organizationCode,
    required super.name,
    required super.shortName,
    super.organizationType,
    super.description,
    super.logo,
    super.address,
    super.phone,
    super.email,
    required super.status,
    required super.createdAt,
    required super.updatedAt,
    super.createdBy,
    super.updatedBy,
  });

  factory OrganizationModel.fromJson(Map<String, dynamic> json) {
    return OrganizationModel(
      id: json['id']?.toString() ?? '',
      organizationCode: json['organization_code']?.toString() ??
          json['organizationCode']?.toString() ??
          json['code']?.toString() ??
          '',
      name: json['name']?.toString() ?? '',
      shortName: json['short_name']?.toString() ?? json['shortName']?.toString() ?? '',
      organizationType: _parseType(json['organization_type']?.toString() ?? json['type']?.toString()),
      description: json['description']?.toString(),
      logo: json['logo']?.toString(),
      address: json['address']?.toString(),
      phone: json['phone']?.toString(),
      email: json['email']?.toString(),
      status: _parseStatus(json['status']?.toString()),
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      createdBy: json['created_by']?.toString() ?? json['createdBy']?.toString(),
      updatedBy: json['updated_by']?.toString() ?? json['updatedBy']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_code': organizationCode,
      'name': name,
      'short_name': shortName,
      'organization_type': organizationType.name,
      'description': description,
      'logo': logo,
      'address': address,
      'phone': phone,
      'email': email,
      'status': status.name,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'created_by': createdBy,
      'updated_by': updatedBy,
    };
  }

  static OrganizationStatus _parseStatus(String? status) {
    switch (status?.toLowerCase()) {
      case 'active':
        return OrganizationStatus.active;
      case 'suspended':
        return OrganizationStatus.suspended;
      case 'archived':
        return OrganizationStatus.archived;
      case 'inactive':
      default:
        return OrganizationStatus.inactive;
    }
  }

  static OrganizationType _parseType(String? type) {
    switch (type?.toLowerCase()) {
      case 'business':
        return OrganizationType.business;
      case 'social':
        return OrganizationType.social;
      case 'other':
        return OrganizationType.other;
      case 'society':
      default:
        return OrganizationType.society;
    }
  }

  factory OrganizationModel.fromEntity(Organization entity) {
    return OrganizationModel(
      id: entity.id,
      organizationCode: entity.organizationCode,
      name: entity.name,
      shortName: entity.shortName,
      organizationType: entity.organizationType,
      description: entity.description,
      logo: entity.logo,
      address: entity.address,
      phone: entity.phone,
      email: entity.email,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    );
  }
}
