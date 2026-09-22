/// PermissionKeys: সেন্ট্রালাইজড মেশিন-রিডেবল পারমিশন কী কনস্ট্যান্ট
///
/// ফরম্যাট: `<resource>.<action>` অথবা `<module>.<resource>.<action>`
/// এই কী-গুলো অপরিবর্তনীয় (Immutable) এবং কখনো বাংলা টেক্সটের ওপর নির্ভর করে না।
class PermissionKeys {
  PermissionKeys._();

  // ১. সংগঠন (Organization)
  static const String organizationView = 'organization.view';
  static const String organizationEdit = 'organization.edit';
  static const String organizationStatusChange = 'organization.status_change';

  // ২. ব্যবহারকারী ও নিরাপত্তা (User & Security)
  static const String userView = 'user.view';
  static const String userManage = 'user.manage';
  static const String roleView = 'role.view';
  static const String roleManage = 'role.manage';
  static const String permissionView = 'permission.view';
  static const String permissionManage = 'permission.manage';
  static const String auditLogView = 'security.audit_log.view';
  static const String sessionView = 'security.session.view';
  static const String sessionTerminate = 'security.session.terminate';

  // ৩. সদস্য (Member)
  static const String memberView = 'member.view';
  static const String memberCreate = 'member.create';
  static const String memberEdit = 'member.edit';
  static const String memberStatusChange = 'member.status.change';
  static const String memberExport = 'member.export';
  static const String memberPrint = 'member.print';
  static const String memberManage = 'member.manage';

  // ৪. অর্থ ও হিসাব (Finance — Segregation of Duties)
  static const String financeTransactionView = 'finance.transaction.view';
  static const String financeTransactionCreate = 'finance.transaction.create';
  static const String financeTransactionEdit = 'finance.transaction.edit';
  static const String financeTransactionSubmit = 'finance.transaction.submit';
  static const String financeTransactionApprove = 'finance.transaction.approve';
  static const String financeTransactionReject = 'finance.transaction.reject';
  static const String financeTransactionReverse = 'finance.transaction.reverse';
  static const String financeAccountView = 'finance.account.view';
  static const String financeAccountManage = 'finance.account.manage';
  static const String financeFundView = 'finance.fund.view';
  static const String financeFundManage = 'finance.fund.manage';

  // ৫. শেয়ার ও প্রকল্প (Share & Project)
  static const String shareView = 'share.view';
  static const String shareManage = 'share.manage';
  static const String projectView = 'project.view';
  static const String projectManage = 'project.manage';

  // ৬. হালাল ব্যবসা (Halal Business)
  static const String businessView = 'business.view';
  static const String businessManage = 'business.manage';

  // ৭. জমি, সম্পত্তি ও সম্পদ (Asset)
  static const String assetView = 'asset.view';
  static const String assetManage = 'asset.manage';

  // ৮. কমিটি, সভা ও পরিচালনা (Governance)
  static const String governanceView = 'governance.view';
  static const String governanceManage = 'governance.manage';

  // ৯. রিপোর্ট (Reports)
  static const String reportView = 'report.view';
  static const String reportExport = 'report.export';
  static const String reportPrint = 'report.print';
  static const String reportDownload = 'report.download';

  // ১০. ডকুমেন্ট (Documents)
  static const String documentView = 'document.view';
  static const String documentManage = 'document.manage';
  static const String documentDownload = 'document.download';
}
