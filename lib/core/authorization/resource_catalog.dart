/// AppModule: তিজারাহ সমিতি সফটওয়্যারের শীর্ষস্থানীয় মডিউলসমূহ
enum AppModule {
  organization('organization', 'সংগঠন', 'সমিতির পরিচিতি ও প্রোফাইল'),
  userSecurity('user_security', 'ব্যবহারকারী ও নিরাপত্তা', 'ইউজার, ভূমিকা ও অনুমতি ব্যবস্থাপনা'),
  member('member', 'সদস্য ব্যবস্থাপনা', 'সদস্য তালিকা, আবেদন ও সদস্যপদ'),
  finance('finance', 'অর্থ ও হিসাব', 'আয়, ব্যয়, ফান্ড ও হিসাব ব্যবস্থাপনা'),
  shareProject('share_project', 'শেয়ার ও প্রকল্প', 'শেয়ার হিসাব ও উন্নয়ন প্রকল্প'),
  business('business', 'হালাল ব্যবসা', 'হালাল বাণিজ্যিক উদ্যোগ ও লাভ-ক্ষতি বণ্টন'),
  asset('asset', 'জমি, সম্পত্তি ও সম্পদ', 'স্থাবর ও অস্থাবর সম্পদ তালিকা'),
  governance('governance', 'কমিটি, সভা ও পরিচালনা', 'কার্যনির্বাহী কমিটি, নোটিশ ও রেজুলেশন'),
  report('report', 'রিপোর্ট', 'সার্বিক পরিসংখ্যান ও শরিয়াহ অডিট রিপোর্ট'),
  document('document', 'ডকুমেন্ট', 'দলিলপত্র, সংযুক্তি ও ফাইল সংরক্ষণ');

  final String key;
  final String banglaName;
  final String description;

  const AppModule(this.key, this.banglaName, this.description);
}

/// AppResource: নির্দিষ্ট রিসোর্স ক্যাটালগ
enum AppResource {
  organization('organization', AppModule.organization, 'সংগঠন'),
  user('user', AppModule.userSecurity, 'ব্যবহারকারী'),
  role('role', AppModule.userSecurity, 'ভূমিকা (Role)'),
  permission('permission', AppModule.userSecurity, 'অনুমতি (Permission)'),
  securityAudit('security_audit', AppModule.userSecurity, 'নিরাপত্তা অডিট'),
  session('session', AppModule.userSecurity, 'সেশন'),
  member('member', AppModule.member, 'সদস্য'),
  transaction('transaction', AppModule.finance, 'আর্থিক লেনদেন'),
  account('account', AppModule.finance, 'হিসাব (Account)'),
  fund('fund', AppModule.finance, 'তহবিল (Fund)'),
  share('share', AppModule.shareProject, 'শেয়ার'),
  project('project', AppModule.shareProject, 'প্রকল্প'),
  business('business', AppModule.business, 'ব্যবসা'),
  asset('asset', AppModule.asset, 'সম্পদ'),
  governance('governance', AppModule.governance, 'পরিচালনা পরিষদ'),
  report('report', AppModule.report, 'রিপোর্ট'),
  document('document', AppModule.document, 'ডকুমেন্ট');

  final String key;
  final AppModule module;
  final String banglaName;

  const AppResource(this.key, this.module, this.banglaName);
}
