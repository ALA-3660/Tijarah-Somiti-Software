/// SecurityEventCategory: নিরাপত্তা ইভেন্টের শ্রেণিবিন্যাস
enum SecurityEventCategory {
  authentication('AUTHENTICATION', 'অথেনটিকেশন'),
  authorization('AUTHORIZATION', 'অথরাইজেশন'),
  roleSecurity('ROLE_SECURITY', 'ভূমিকা ও পারমিশন'),
  userSecurity('USER_SECURITY', 'ইউজার নিরাপত্তা'),
  session('SESSION', 'সেশন ও ডিভাইস'),
  member('MEMBER', 'সদস্য ব্যবস্থাপনা');

  final String key;
  final String banglaName;
  const SecurityEventCategory(this.key, this.banglaName);
}

/// SecurityEventType: কেন্দ্রীভূত অপরিবর্তনীয় নিরাপত্তা ইভেন্ট ক্যাটালগ
enum SecurityEventType {
  // ১. অথেনটিকেশন (Authentication)
  loginSuccess('LOGIN_SUCCESS', 'সফল লগইন', SecurityEventCategory.authentication),
  loginFailed('LOGIN_FAILED', 'ব্যর্থ লগইন', SecurityEventCategory.authentication),
  logout('LOGOUT', 'লগআউট', SecurityEventCategory.authentication),
  sessionExpired('SESSION_EXPIRED', 'সেশনের মেয়াদ উত্তীর্ণ', SecurityEventCategory.authentication),
  tokenRefresh('TOKEN_REFRESH', 'টোকেন নবায়ন', SecurityEventCategory.authentication),
  tokenRefreshFailed('TOKEN_REFRESH_FAILED', 'টোকেন নবায়ন ব্যর্থ', SecurityEventCategory.authentication),

  // ২. অথরাইজেশন (Authorization)
  accessDenied('ACCESS_DENIED', 'অ্যাক্সেস অস্বীকৃত (৪০৩)', SecurityEventCategory.authorization),
  routeAccessDenied('ROUTE_ACCESS_DENIED', 'রুট অ্যাক্সেস অস্বীকৃত', SecurityEventCategory.authorization),
  permissionDenied('PERMISSION_DENIED', 'অনুমতি অস্বীকৃত', SecurityEventCategory.authorization),

  // ৩. ভূমিকা ও পারমিশন (Role/Security)
  roleAssigned('ROLE_ASSIGNED', 'ভূমিকা অর্পণ', SecurityEventCategory.roleSecurity),
  roleRemoved('ROLE_REMOVED', 'ভূমিকা প্রত্যাহার', SecurityEventCategory.roleSecurity),
  privilegeEscalationBlocked('PRIVILEGE_ESCALATION_BLOCKED', 'প্রিভিলেজ বৃদ্ধি অবরুদ্ধ', SecurityEventCategory.roleSecurity),

  // ৪. ইউজার নিরাপত্তা (User Security)
  userSuspended('USER_SUSPENDED', 'ব্যবহারকারী স্থগিত', SecurityEventCategory.userSecurity),
  userActivated('USER_ACTIVATED', 'ব্যবহারকারী সক্রিয়', SecurityEventCategory.userSecurity),
  userArchived('USER_ARCHIVED', 'ব্যবহারকারী আর্কাইভ', SecurityEventCategory.userSecurity),
  userStatusChanged('USER_STATUS_CHANGED', 'স্ট্যাটাস পরিবর্তিত', SecurityEventCategory.userSecurity),

  // ৫. সেশন (Session)
  sessionCreated('SESSION_CREATED', 'সেশন তৈরি', SecurityEventCategory.session),
  sessionTerminated('SESSION_TERMINATED', 'সেশন সমাপ্ত', SecurityEventCategory.session),
  sessionTerminationFailed('SESSION_TERMINATION_FAILED', 'সেশন সমাপ্ত ব্যর্থ', SecurityEventCategory.session),

  // ৬. সদস্য ব্যবস্থাপনা (Member Security & Lifecycle)
  memberCreated('MEMBER_CREATED', 'সদস্য নিবন্ধন', SecurityEventCategory.member),
  memberUpdated('MEMBER_UPDATED', 'সদস্য তথ্য আপডেট', SecurityEventCategory.member),
  memberStatusChanged('MEMBER_STATUS_CHANGED', 'সদস্য স্ট্যাটাস পরিবর্তন', SecurityEventCategory.member);

  final String key;
  final String banglaName;
  final SecurityEventCategory category;

  const SecurityEventType(this.key, this.banglaName, this.category);

  static SecurityEventType fromKey(String? key) {
    if (key == null) return SecurityEventType.accessDenied;
    for (final type in SecurityEventType.values) {
      if (type.key == key) return type;
    }
    return SecurityEventType.accessDenied;
  }
}

/// SecurityEventResult: নিরাপত্তা ইভেন্টের প্রমিত ফলাফল
enum SecurityEventResult {
  success('SUCCESS', 'সফল'),
  failed('FAILED', 'ব্যর্থ'),
  blocked('BLOCKED', 'অবরুদ্ধ'),
  denied('DENIED', 'প্রত্যাখ্যাত');

  final String key;
  final String banglaName;

  const SecurityEventResult(this.key, this.banglaName);

  static SecurityEventResult fromKey(String? key) {
    if (key == null) return SecurityEventResult.failed;
    for (final result in SecurityEventResult.values) {
      if (result.key == key) return result;
    }
    return SecurityEventResult.failed;
  }
}
