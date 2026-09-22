import 'member_status.dart';

/// Member: তিজারাহ সমিতি সফটওয়্যারের সদস্য ডোমেইন এন্টিটি
///
/// **আর্কিটেকচার নীতি:**
/// ১. Member ≠ User: সদস্য মানেই সফটওয়্যার ইউজার নয়। এটি স্বতন্ত্র সত্তা।
/// ২. Immutable Fields: id, organizationId, memberCode, createdAt অপরিবর্তনীয়।
/// ৩. Financial Separation: এই পর্যায়ে কোনো শেয়ার, চাঁদা বা আর্থিক খতিয়ান যুক্ত করা হয়নি।
class Member {
  /// স্থায়ী অপরিবর্তনীয় সদস্য আইডি (UUID)
  final String id;

  /// সংশ্লিষ্ট প্রতিষ্ঠানের আইডি (টেন্যান্ট আইসোলেশন)
  final String organizationId;

  /// অনন্য ও স্থায়ী হিউম্যান-রিডেবল মেম্বার কোড (যেমন: MEM-000001)
  final String memberCode;

  /// পূর্ণ নাম (বাংলায় বা ইংরেজিতে)
  final String fullName;

  /// ছবি বা ডকুমেন্টের রেফারেন্স URL
  final String? photoUrl;

  /// মোবাইল নম্বর (বাংলাদেশ প্রমিত ফরম্যাট: 01XXXXXXXXX)
  final String mobile;

  /// ঐচ্ছিক ইমেইল ঠিকানা
  final String? email;

  /// জন্মতারিখ
  final DateTime? dateOfBirth;

  /// লিঙ্গ ('male' | 'female' | 'other')
  final String? gender;

  /// পেশা বা কর্মক্ষেত্র
  final String? occupation;

  /// পিতা বা স্বামীর নাম
  final String? fatherOrSpouseName;

  /// মাতার নাম
  final String? motherName;

  /// জাতীয় পরিচয়পত্র নম্বর (NID / Smart Card)
  final String? nid;

  /// বর্তমান ঠিকানা
  final String? currentAddress;

  /// স্থায়ী ঠিকানা
  final String? permanentAddress;

  /// বর্তমান ও স্থায়ী ঠিকানা একই কি না
  final bool isSameAddress;

  /// পূর্ণ ঠিকানা (legacy compatibility)
  final String? address;

  /// সদস্যপদ লাইফসাইকেল স্ট্যাটাস
  final MemberStatus status;

  /// সদস্যভুক্তির তারিখ
  final DateTime joinedAt;

  /// ডাটা এন্ট্রি তৈরির তারিখ ও সময়
  final DateTime createdAt;

  /// সর্বশেষ তথ্য হালনাগাদের তারিখ ও সময়
  final DateTime updatedAt;

  /// প্রস্তুতকারী কর্মকর্তার আইডি/রেফারেন্স
  final String? createdBy;

  /// হালনাগাদকারী কর্মকর্তার আইডি/রেফারেন্স
  final String? updatedBy;

  /// অতিরিক্ত নোট বা মন্তব্য
  final String? notes;

  /// ঐচ্ছিক ইউজার লিঙ্ক (Future-ready: সফটওয়্যার এক্সেস থাকলে সংশ্লিষ্ট User ID)
  final String? userId;

  const Member({
    required this.id,
    required this.organizationId,
    required this.memberCode,
    required this.fullName,
    this.photoUrl,
    required this.mobile,
    this.email,
    this.dateOfBirth,
    this.gender,
    this.occupation,
    this.fatherOrSpouseName,
    this.motherName,
    this.nid,
    this.currentAddress,
    this.permanentAddress,
    this.isSameAddress = false,
    this.address,
    required this.status,
    required this.joinedAt,
    required this.createdAt,
    required this.updatedAt,
    this.createdBy,
    this.updatedBy,
    this.notes,
    this.userId,
  });

  /// বাংলা লিঙ্গ রূপান্তর
  String get genderBangla {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'পুরুষ';
      case 'female':
        return 'মহিলা';
      case 'other':
        return 'অন্যান্য';
      default:
        return gender ?? 'অনির্ধারিত';
    }
  }

  /// বয়স গণনা (বছর)
  int? get ageYears {
    if (dateOfBirth == null) return null;
    final now = DateTime.now();
    int age = now.year - dateOfBirth!.year;
    if (now.month < dateOfBirth!.month ||
        (now.month == dateOfBirth!.month && now.day < dateOfBirth!.day)) {
      age--;
    }
    return age > 0 ? age : null;
  }

  /// বয়স বাংলা টেক্সট ডিসপ্লে (যেমন: '৩৫ বছর' অথবা 'তথ্য নেই')
  String get ageDisplayBangla {
    final age = ageYears;
    if (age == null) return 'তথ্য নেই';
    const enToBn = {'0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'};
    final bnAge = age.toString().split('').map((c) => enToBn[c] ?? c).join('');
    return '$bnAge বছর';
  }

  /// মাস্কড NID (যেমন: '********1234')
  String get maskedNid {
    if (nid == null || nid!.trim().isEmpty) return 'তথ্য নেই';
    final trimmed = nid!.trim();
    if (trimmed.length <= 4) return '****';
    final visiblePart = trimmed.substring(trimmed.length - 4);
    final maskedLength = trimmed.length - 4;
    return '${'*' * maskedLength}$visiblePart';
  }

  /// প্রোফাইল সমাপ্তির শতকরা স্কোর (0 to 100)
  int get profileCompletenessScore {
    int total = 0;
    // Basic Identity: fullName, memberCode, gender, dateOfBirth, occupation, photo (30 pts)
    if (fullName.isNotEmpty) total += 5;
    if (gender != null && gender!.isNotEmpty) total += 5;
    if (dateOfBirth != null) total += 5;
    if (occupation != null && occupation!.isNotEmpty) total += 5;
    if (photoUrl != null && photoUrl!.isNotEmpty) total += 10;

    // Contact: mobile, email (20 pts)
    if (mobile.isNotEmpty) total += 15;
    if (email != null && email!.isNotEmpty) total += 5;

    // Address: currentAddress, permanentAddress (20 pts)
    if ((currentAddress != null && currentAddress!.isNotEmpty) || (address != null && address!.isNotEmpty)) total += 10;
    if ((permanentAddress != null && permanentAddress!.isNotEmpty) || isSameAddress) total += 10;

    // Family: fatherOrSpouseName, motherName (15 pts)
    if (fatherOrSpouseName != null && fatherOrSpouseName!.isNotEmpty) total += 10;
    if (motherName != null && motherName!.isNotEmpty) total += 5;

    // Identification: NID (15 pts)
    if (nid != null && nid!.isNotEmpty) total += 15;

    return total.clamp(0, 100);
  }

  /// প্রোফাইল ফটো ইনিশিয়ালস
  String get photoFallbackInitials {
    final parts = fullName.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return 'স';
    if (parts.length == 1) return parts.first.substring(0, 1);
    return '${parts.first.substring(0, 1)}${parts.last.substring(0, 1)}';
  }

  /// কার্যকর বর্তমান ঠিকানা
  String get effectiveCurrentAddress {
    if (currentAddress != null && currentAddress!.trim().isNotEmpty) {
      return currentAddress!.trim();
    }
    return address?.trim() ?? 'তথ্য নেই';
  }

  /// কার্যকর স্থায়ী ঠিকানা
  String get effectivePermanentAddress {
    if (isSameAddress) {
      return effectiveCurrentAddress;
    }
    if (permanentAddress != null && permanentAddress!.trim().isNotEmpty) {
      return permanentAddress!.trim();
    }
    return 'তথ্য নেই';
  }

  /// অপরিবর্তনীয় ফিল্ড সুরক্ষিত রেখে কপি মেথড
  Member copyWith({
    String? fullName,
    String? photoUrl,
    String? mobile,
    String? email,
    DateTime? dateOfBirth,
    String? gender,
    String? occupation,
    String? fatherOrSpouseName,
    String? motherName,
    String? nid,
    String? currentAddress,
    String? permanentAddress,
    bool? isSameAddress,
    String? address,
    MemberStatus? status,
    DateTime? joinedAt,
    DateTime? updatedAt,
    String? updatedBy,
    String? notes,
    String? userId,
  }) {
    return Member(
      id: id, // Immutable
      organizationId: organizationId, // Immutable
      memberCode: memberCode, // Immutable
      fullName: fullName ?? this.fullName,
      photoUrl: photoUrl ?? this.photoUrl,
      mobile: mobile ?? this.mobile,
      email: email ?? this.email,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      gender: gender ?? this.gender,
      occupation: occupation ?? this.occupation,
      fatherOrSpouseName: fatherOrSpouseName ?? this.fatherOrSpouseName,
      motherName: motherName ?? this.motherName,
      nid: nid ?? this.nid,
      currentAddress: currentAddress ?? this.currentAddress,
      permanentAddress: permanentAddress ?? this.permanentAddress,
      isSameAddress: isSameAddress ?? this.isSameAddress,
      address: address ?? this.address,
      status: status ?? this.status,
      joinedAt: joinedAt ?? this.joinedAt,
      createdAt: createdAt, // Immutable
      updatedAt: updatedAt ?? DateTime.now(),
      createdBy: createdBy, // Immutable
      updatedBy: updatedBy ?? this.updatedBy,
      notes: notes ?? this.notes,
      userId: userId ?? this.userId,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organization_id': organizationId,
      'member_code': memberCode,
      'full_name': fullName,
      'photo_url': photoUrl,
      'mobile': mobile,
      'email': email,
      'date_of_birth': dateOfBirth?.toIso8601String(),
      'gender': gender,
      'occupation': occupation,
      'father_or_spouse_name': fatherOrSpouseName,
      'mother_name': motherName,
      'nid': nid,
      'current_address': currentAddress,
      'permanent_address': permanentAddress,
      'is_same_address': isSameAddress,
      'address': address,
      'status': status.key,
      'joined_at': joinedAt.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'created_by': createdBy,
      'updated_by': updatedBy,
      'notes': notes,
      'user_id': userId,
    };
  }

  factory Member.fromJson(Map<String, dynamic> json) {
    return Member(
      id: json['id'] as String,
      organizationId: json['organization_id'] as String,
      memberCode: json['member_code'] as String,
      fullName: json['full_name'] as String,
      photoUrl: json['photo_url'] as String?,
      mobile: json['mobile'] as String,
      email: json['email'] as String?,
      dateOfBirth: json['date_of_birth'] != null
          ? DateTime.parse(json['date_of_birth'] as String)
          : null,
      gender: json['gender'] as String?,
      occupation: json['occupation'] as String?,
      fatherOrSpouseName: json['father_or_spouse_name'] as String?,
      motherName: json['mother_name'] as String?,
      nid: json['nid'] as String?,
      currentAddress: json['current_address'] as String?,
      permanentAddress: json['permanent_address'] as String?,
      isSameAddress: json['is_same_address'] as bool? ?? false,
      address: json['address'] as String?,
      status: MemberStatus.fromKey(json['status'] as String?),
      joinedAt: json['joined_at'] != null
          ? DateTime.parse(json['joined_at'] as String)
          : DateTime.now(),
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'] as String)
          : DateTime.now(),
      createdBy: json['created_by'] as String?,
      updatedBy: json['updated_by'] as String?,
      notes: json['notes'] as String?,
      userId: json['user_id'] as String?,
    );
  }
}
