/// UserStatus: ব্যবহারকারী অ্যাকাউন্টের লাইফসাইকেল স্ট্যাটাস
enum UserStatus {
  /// সক্রিয় (সিস্টেমে লগইন এবং সকল অনুমোদিত কার্যক্রম করতে পারেন)
  active,

  /// নিষ্ক্রিয় (সাময়িকভাবে লগইন বা কার্যক্রম বন্ধ)
  inactive,

  /// স্থগিত (প্রশাসনিক বা শরিয়াহ অডিট প্রয়োজনে অ্যাকাউন্ট স্থগিত)
  suspended,

  /// আর্কাইভ (অ্যাকাউন্ট সংরক্ষিত কিন্তু স্থায়ীভাবে অকার্যকর)
  archived;

  /// বাংলা প্রদর্শন নাম
  String get banglaName {
    switch (this) {
      case UserStatus.active:
        return 'সক্রিয়';
      case UserStatus.inactive:
        return 'নিষ্ক্রিয়';
      case UserStatus.suspended:
        return 'স্থগিত';
      case UserStatus.archived:
        return 'আর্কাইভ';
    }
  }

  /// সিস্টেমে সক্রিয় কার্যক্রম বা লগইন অনুমোদিত কিনা
  bool get isOperational => this == UserStatus.active;

  /// স্ট্যাটাস কোড থেকে পার্সিং
  static UserStatus fromString(String value) {
    switch (value.toLowerCase()) {
      case 'active':
        return UserStatus.active;
      case 'inactive':
        return UserStatus.inactive;
      case 'suspended':
        return UserStatus.suspended;
      case 'archived':
        return UserStatus.archived;
      default:
        return UserStatus.inactive;
    }
  }
}
