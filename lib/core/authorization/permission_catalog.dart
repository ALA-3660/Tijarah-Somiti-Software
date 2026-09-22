import '../../domain/entities/permission.dart';
import '../../domain/entities/role.dart';
import 'action_catalog.dart';
import 'permission_keys.dart';
import 'resource_catalog.dart';

/// PermissionCatalog: কেন্দ্রীভূত পারমিশন রেজিস্ট্রি ও ক্যাটালগ
///
/// তিজারাহ সমিতি সফটওয়্যারের সকল ভেরিফাইড পারমিশন, ক্যাটাগরি গ্রুপিং
/// এবং সিস্টেম রোলসমূহের ডিফল্ট পারমিশন ম্যাপিং এখানে সংজ্ঞায়িত।
class PermissionCatalog {
  PermissionCatalog._();

  /// সার্বিক পারমিশন তালিকা
  static const List<Permission> allPermissions = [
    // ১. সংগঠন (Organization)
    Permission(
      id: 'perm_org_view',
      key: PermissionKeys.organizationView,
      name: 'সংগঠনের তথ্য দেখুন',
      description: 'সমিতির মৌলিক পরিচিতি, ঠিকানা ও প্রোফাইল দেখার অনুমতি',
      module: AppModule.organization,
      resource: AppResource.organization,
      action: AppAction.view,
      categoryBangla: 'সংগঠন',
    ),
    Permission(
      id: 'perm_org_edit',
      key: PermissionKeys.organizationEdit,
      name: 'সংগঠনের তথ্য সম্পাদনা',
      description: 'সমিতির নাম, ফোন, ঠিকানা ও প্রোফাইল সংশোধনের অনুমতি',
      module: AppModule.organization,
      resource: AppResource.organization,
      action: AppAction.edit,
      categoryBangla: 'সংগঠন',
    ),
    Permission(
      id: 'perm_org_status',
      key: PermissionKeys.organizationStatusChange,
      name: 'সংগঠনের স্ট্যাটাস পরিবর্তন',
      description: 'সমিতি সক্রিয়, স্থগিত বা আর্কাইভ করার প্রশাসনিক অনুমতি',
      module: AppModule.organization,
      resource: AppResource.organization,
      action: AppAction.manage,
      categoryBangla: 'সংগঠন',
    ),

    // ২. ব্যবহারকারী ও নিরাপত্তা (User & Security)
    Permission(
      id: 'perm_user_view',
      key: PermissionKeys.userView,
      name: 'ব্যবহারকারী তালিকা দেখুন',
      description: 'সমিতির কর্মকর্তা ও ইউজার অ্যাকাউন্ট দেখার অনুমতি',
      module: AppModule.userSecurity,
      resource: AppResource.user,
      action: AppAction.view,
      categoryBangla: 'ব্যবহারকারী ও নিরাপত্তা',
    ),
    Permission(
      id: 'perm_user_manage',
      key: PermissionKeys.userManage,
      name: 'ব্যবহারকারী পরিচালনা',
      description: 'নতুন ইউজার তৈরি, তথ্য পরিবর্তন ও নিষ্ক্রিয় করার অনুমতি',
      module: AppModule.userSecurity,
      resource: AppResource.user,
      action: AppAction.manage,
      categoryBangla: 'ব্যবহারকারী ও নিরাপত্তা',
    ),
    Permission(
      id: 'perm_role_view',
      key: PermissionKeys.roleView,
      name: 'ভূমিকা (Role) দেখুন',
      description: 'বিদ্যমান ভূমিকা ও পারমিশন ম্যাট্রিক্স দেখার অনুমতি',
      module: AppModule.userSecurity,
      resource: AppResource.role,
      action: AppAction.view,
      categoryBangla: 'ব্যবহারকারী ও নিরাপত্তা',
    ),
    Permission(
      id: 'perm_role_manage',
      key: PermissionKeys.roleManage,
      name: 'ভূমিকা পরিচালনা',
      description: 'কাস্টম রোল তৈরি ও পারমিশন বরাদ্দের প্রশাসনিক অনুমতি',
      module: AppModule.userSecurity,
      resource: AppResource.role,
      action: AppAction.manage,
      categoryBangla: 'ব্যবহারকারী ও নিরাপত্তা',
    ),
    Permission(
      id: 'perm_perm_view',
      key: PermissionKeys.permissionView,
      name: 'অনুমতি (Permission) দেখুন',
      description: 'সিস্টেমের সকল পারমিশন ক্যাটালগ পরিদর্শনের অনুমতি',
      module: AppModule.userSecurity,
      resource: AppResource.permission,
      action: AppAction.view,
      categoryBangla: 'ব্যবহারকারী ও নিরাপত্তা',
    ),
    Permission(
      id: 'perm_perm_manage',
      key: PermissionKeys.permissionManage,
      name: 'অনুমতি কনফিগারেশন',
      description: 'সিস্টেম পারমিশন পলিসি কনফিগার করার অনুমতি',
      module: AppModule.userSecurity,
      resource: AppResource.permission,
      action: AppAction.configure,
      categoryBangla: 'ব্যবহারকারী ও নিরাপত্তা',
    ),
    Permission(
      id: 'perm_audit_view',
      key: PermissionKeys.auditLogView,
      name: 'নিরাপত্তা অডিট লগ দেখুন',
      description: 'লগইন, ভূমিকা পরিবর্তন ও নিরাপত্তা ইভেন্ট লগ দেখার অনুমতি',
      module: AppModule.userSecurity,
      resource: AppResource.securityAudit,
      action: AppAction.view,
      categoryBangla: 'ব্যবহারকারী ও নিরাপত্তা',
    ),
    Permission(
      id: 'perm_session_view',
      key: PermissionKeys.sessionView,
      name: 'সক্রিয় সেশন দেখুন',
      description: 'ব্যবহারকারীদের সক্রিয় লগইন সেশন ও ডিভাইস পরিদর্শনের অনুমতি',
      module: AppModule.userSecurity,
      resource: AppResource.session,
      action: AppAction.view,
      categoryBangla: 'ব্যবহারকারী ও নিরাপত্তা',
    ),
    Permission(
      id: 'perm_session_terminate',
      key: PermissionKeys.sessionTerminate,
      name: 'সেশন সমাপ্তকরণ',
      description: 'সন্দেহভাজন বা অপ্রয়োজনীয় সেশন জোরপূর্বক সমাপ্ত করার প্রশাসনিক অনুমতি',
      module: AppModule.userSecurity,
      resource: AppResource.session,
      action: AppAction.terminate,
      categoryBangla: 'ব্যবহারকারী ও নিরাপত্তা',
    ),

    // ৩. সদস্য (Member)
    Permission(
      id: 'perm_mem_view',
      key: PermissionKeys.memberView,
      name: 'সদস্য তালিকা ও তথ্য দেখুন',
      description: 'সদস্যদের প্রোফাইল ও সাধারণ তথ্য দেখার অনুমতি',
      module: AppModule.member,
      resource: AppResource.member,
      action: AppAction.view,
      categoryBangla: 'সদস্য',
    ),
    Permission(
      id: 'perm_mem_create',
      key: PermissionKeys.memberCreate,
      name: 'নতুন সদস্য নিবন্ধন',
      description: 'নতুন সদস্য আবেদন ফরম পূরণ ও এন্ট্রি করার অনুমতি',
      module: AppModule.member,
      resource: AppResource.member,
      action: AppAction.create,
      categoryBangla: 'সদস্য',
    ),
    Permission(
      id: 'perm_mem_edit',
      key: PermissionKeys.memberEdit,
      name: 'সদস্য তথ্য সংশোধন',
      description: 'সদস্যের তথ্য, ঠিকানা বা ব্যক্তিগত তথ্য সংশোধনের অনুমতি',
      module: AppModule.member,
      resource: AppResource.member,
      action: AppAction.edit,
      categoryBangla: 'সদস্য',
    ),
    Permission(
      id: 'perm_mem_status_change',
      key: PermissionKeys.memberStatusChange,
      name: 'সদস্য স্ট্যাটাস পরিবর্তন',
      description: 'সদস্য সক্রিয়, নিষ্ক্রিয়, স্থগিত বা আর্কাইভ করার প্রশাসনিক অনুমতি',
      module: AppModule.member,
      resource: AppResource.member,
      action: AppAction.manage,
      categoryBangla: 'সদস্য',
    ),
    Permission(
      id: 'perm_mem_export',
      key: PermissionKeys.memberExport,
      name: 'সদস্য তালিকা এক্সপোর্ট',
      description: 'সদস্য তালিকা এক্সেল বা সিএসভি ফরম্যাটে রপ্তানি করার অনুমতি',
      module: AppModule.member,
      resource: AppResource.member,
      action: AppAction.export,
      categoryBangla: 'সদস্য',
    ),
    Permission(
      id: 'perm_mem_print',
      key: PermissionKeys.memberPrint,
      name: 'সদস্য প্রোফাইল ও তালিকা প্রিন্ট',
      description: 'সদস্য প্রোফাইল ও তথ্য মুদ্রণের অনুমতি',
      module: AppModule.member,
      resource: AppResource.member,
      action: AppAction.print,
      categoryBangla: 'সদস্য',
    ),
    Permission(
      id: 'perm_mem_manage',
      key: PermissionKeys.memberManage,
      name: 'সদস্যপদ সার্বিক পরিচালনা',
      description: 'সদস্যপদ অনুমোদন, বাতিল বা স্থিতি পরিবর্তনের প্রশাসনিক অনুমতি',
      module: AppModule.member,
      resource: AppResource.member,
      action: AppAction.manage,
      categoryBangla: 'সদস্য',
    ),

    // ৪. অর্থ ও হিসাব (Finance — Segregation of Duties)
    Permission(
      id: 'perm_fin_tx_view',
      key: PermissionKeys.financeTransactionView,
      name: 'আর্থিক লেনদেন দেখুন',
      description: 'আয়, ব্যয় ও স্থানান্তরের খতিয়ান পরিদর্শনের অনুমতি',
      module: AppModule.finance,
      resource: AppResource.transaction,
      action: AppAction.view,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_tx_create',
      key: PermissionKeys.financeTransactionCreate,
      name: 'নতুন আর্থিক লেনদেন তৈরি',
      description: 'আয়, ব্যয় বা স্থানান্তরের প্রাথমিক ভাউচার তৈরি করার অনুমতি',
      module: AppModule.finance,
      resource: AppResource.transaction,
      action: AppAction.create,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_tx_edit',
      key: PermissionKeys.financeTransactionEdit,
      name: 'লেনদেন ড্রাফট সংশোধন',
      description: 'অনুমোদনের পূর্বে অনিষ্পন্ন লেনদেনের ড্রাফট সংশোধন করার অনুমতি',
      module: AppModule.finance,
      resource: AppResource.transaction,
      action: AppAction.edit,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_tx_submit',
      key: PermissionKeys.financeTransactionSubmit,
      name: 'লেনদেন অনুমোদনের জন্য দাখিল',
      description: 'যাচাই শেষে কোষাধ্যক্ষ/উর্ধ্বতনের নিকট অনুমোদনের জন্য দাখিল',
      module: AppModule.finance,
      resource: AppResource.transaction,
      action: AppAction.submit,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_tx_approve',
      key: PermissionKeys.financeTransactionApprove,
      name: 'আর্থিক লেনদেন অনুমোদন',
      description: 'দাখিলকৃত ভাউচার চূড়ান্তভাবে পাস/অনুমোদনের ক্ষমতা (তৈরিকৃত ভাউচার ব্যতিরেকে)',
      module: AppModule.finance,
      resource: AppResource.transaction,
      action: AppAction.approve,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_tx_reject',
      key: PermissionKeys.financeTransactionReject,
      name: 'লেনদেন প্রত্যাখ্যান',
      description: 'ত্রুটিযুক্ত ভাউচার কারণে উল্লেখপূর্বক বাতিলের অনুমতি',
      module: AppModule.finance,
      resource: AppResource.transaction,
      action: AppAction.reject,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_tx_reverse',
      key: PermissionKeys.financeTransactionReverse,
      name: 'অনুমোদিত লেনদেন রিভার্স/সংশোধন',
      description: 'ভুল অনুমোদিত এন্ট্রির বিপরীত অডিট এন্ট্রি প্রদান (কোনো স্থায়ী ডিলিট নয়)',
      module: AppModule.finance,
      resource: AppResource.transaction,
      action: AppAction.reverse,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_acc_view',
      key: PermissionKeys.financeAccountView,
      name: 'হিসাব/অ্যাকাউন্ট দেখুন',
      description: 'ক্যাশ ও ব্যাংক হিসাবের স্থিতি দেখার অনুমতি',
      module: AppModule.finance,
      resource: AppResource.account,
      action: AppAction.view,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_acc_manage',
      key: PermissionKeys.financeAccountManage,
      name: 'হিসাব পরিচালনা',
      description: 'নতুন ব্যাংক বা ক্যাশ অ্যাকাউন্ট যুক্ত ও কনফিগারেশনের অনুমতি',
      module: AppModule.finance,
      resource: AppResource.account,
      action: AppAction.manage,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_fund_view',
      key: PermissionKeys.financeFundView,
      name: 'তহবিল (Fund) দেখুন',
      description: 'সাধারণ, কল্যাণ ও প্রকল্প তহবিলের স্থিতি দেখার অনুমতি',
      module: AppModule.finance,
      resource: AppResource.fund,
      action: AppAction.view,
      categoryBangla: 'অর্থ ও হিসাব',
    ),
    Permission(
      id: 'perm_fin_fund_manage',
      key: PermissionKeys.financeFundManage,
      name: 'তহবিল পরিচালনা',
      description: 'তহবিল তৈরি, বরাদ্দ ও বণ্টন পলিসি কনফিগারেশন',
      module: AppModule.finance,
      resource: AppResource.fund,
      action: AppAction.manage,
      categoryBangla: 'অর্থ ও হিসাব',
    ),

    // ৫. শেয়ার ও প্রকল্প (Share & Project)
    Permission(
      id: 'perm_share_view',
      key: PermissionKeys.shareView,
      name: 'শেয়ার তথ্য দেখুন',
      description: 'শেয়ার সংখ্যা, মূল্য ও মালিকানা তালিকা দেখার অনুমতি',
      module: AppModule.shareProject,
      resource: AppResource.share,
      action: AppAction.view,
      categoryBangla: 'শেয়ার ও প্রকল্প',
    ),
    Permission(
      id: 'perm_share_manage',
      key: PermissionKeys.shareManage,
      name: 'শেয়ার পরিচালনা',
      description: 'শেয়ার ইস্যু, হস্তান্তর ও লভ্যাংশ প্রক্রিয়াকরণের অনুমতি',
      module: AppModule.shareProject,
      resource: AppResource.share,
      action: AppAction.manage,
      categoryBangla: 'শেয়ার ও প্রকল্প',
    ),
    Permission(
      id: 'perm_proj_view',
      key: PermissionKeys.projectView,
      name: 'উন্নয়ন প্রকল্প দেখুন',
      description: 'সমিতির চলমান ও প্রস্তাবিত প্রকল্পের অগ্রগতি দেখার অনুমতি',
      module: AppModule.shareProject,
      resource: AppResource.project,
      action: AppAction.view,
      categoryBangla: 'শেয়ার ও প্রকল্প',
    ),
    Permission(
      id: 'perm_proj_manage',
      key: PermissionKeys.projectManage,
      name: 'প্রকল্প পরিচালনা',
      description: 'নতুন প্রকল্প গ্রহণ ও বিনিয়োগ বাজেট কনফিগারেশনের অনুমতি',
      module: AppModule.shareProject,
      resource: AppResource.project,
      action: AppAction.manage,
      categoryBangla: 'শেয়ার ও প্রকল্প',
    ),

    // ৬. হালাল ব্যবসা (Halal Business)
    Permission(
      id: 'perm_biz_view',
      key: PermissionKeys.businessView,
      name: 'হালাল ব্যবসা দেখুন',
      description: 'বাণিজ্যিক উদ্যোগ, ক্রয়-বিক্রয় ও স্টক পরিদর্শনের অনুমতি',
      module: AppModule.business,
      resource: AppResource.business,
      action: AppAction.view,
      categoryBangla: 'হালাল ব্যবসা',
    ),
    Permission(
      id: 'perm_biz_manage',
      key: PermissionKeys.businessManage,
      name: 'হালাল ব্যবসা পরিচালনা',
      description: 'ব্যবসা বিনিয়োগ ও লাভ-ক্ষতি বণ্টন পরিচালনার অনুমতি',
      module: AppModule.business,
      resource: AppResource.business,
      action: AppAction.manage,
      categoryBangla: 'হালাল ব্যবসা',
    ),

    // ৭. জমি, সম্পত্তি ও সম্পদ (Asset)
    Permission(
      id: 'perm_asset_view',
      key: PermissionKeys.assetView,
      name: 'সম্পদ রেজিস্টার দেখুন',
      description: 'সমিতির জমি, অফিস সরঞ্জাম ও স্থায়ী সম্পদ পরিদর্শনের অনুমতি',
      module: AppModule.asset,
      resource: AppResource.asset,
      action: AppAction.view,
      categoryBangla: 'জমি, সম্পত্তি ও সম্পদ',
    ),
    Permission(
      id: 'perm_asset_manage',
      key: PermissionKeys.assetManage,
      name: 'সম্পদ পরিচালনা',
      description: 'সম্পদ ক্রয়, অবচয় ও দলিল সংরক্ষণের অনুমতি',
      module: AppModule.asset,
      resource: AppResource.asset,
      action: AppAction.manage,
      categoryBangla: 'জমি, সম্পত্তি ও সম্পদ',
    ),

    // ৮. কমিটি, সভা ও পরিচালনা (Governance)
    Permission(
      id: 'perm_gov_view',
      key: PermissionKeys.governanceView,
      name: 'কমিটি ও সভার বিবরণ দেখুন',
      description: 'কার্যনির্বাহী পরিষদ, নোটিশ ও এজেন্ডা দেখার অনুমতি',
      module: AppModule.governance,
      resource: AppResource.governance,
      action: AppAction.view,
      categoryBangla: 'কমিটি, সভা ও পরিচালনা',
    ),
    Permission(
      id: 'perm_gov_manage',
      key: PermissionKeys.governanceManage,
      name: 'পরিচালনা পরিষদ ব্যবস্থাপনা',
      description: 'সভা আহ্বান, রেজুলেশন স্বাক্ষর ও কার্যবিবরণী সংরক্ষণের অনুমতি',
      module: AppModule.governance,
      resource: AppResource.governance,
      action: AppAction.manage,
      categoryBangla: 'কমিটি, সভা ও পরিচালনা',
    ),

    // ৯. রিপোর্ট (Reports)
    Permission(
      id: 'perm_rep_view',
      key: PermissionKeys.reportView,
      name: 'রিপোর্ট দেখুন',
      description: 'আর্থিক বিবরণী, সদস্য রিপোর্ট ও ড্যাশবোর্ড পরিসংখ্যান দেখার অনুমতি',
      module: AppModule.report,
      resource: AppResource.report,
      action: AppAction.view,
      categoryBangla: 'রিপোর্ট',
    ),
    Permission(
      id: 'perm_rep_export',
      key: PermissionKeys.reportExport,
      name: 'রিপোর্ট এক্সপোর্ট',
      description: 'এক্সেল বা সিএসভি আকারে রিপোর্ট এক্সপোর্ট করার অনুমতি',
      module: AppModule.report,
      resource: AppResource.report,
      action: AppAction.export,
      categoryBangla: 'রিপোর্ট',
    ),
    Permission(
      id: 'perm_rep_print',
      key: PermissionKeys.reportPrint,
      name: 'রিপোর্ট প্রিন্ট',
      description: 'মুদ্রণযোগ্য ফরম্যাটে রিপোর্ট বের করার অনুমতি',
      module: AppModule.report,
      resource: AppResource.report,
      action: AppAction.print,
      categoryBangla: 'রিপোর্ট',
    ),
    Permission(
      id: 'perm_rep_download',
      key: PermissionKeys.reportDownload,
      name: 'রিপোর্ট পিডিএফ ডাউনলোড',
      description: 'পিডিএফ অডিট রিপোর্ট ডাউনলোড করার অনুমতি',
      module: AppModule.report,
      resource: AppResource.report,
      action: AppAction.download,
      categoryBangla: 'রিপোর্ট',
    ),

    // ১০. ডকুমেন্ট (Documents)
    Permission(
      id: 'perm_doc_view',
      key: PermissionKeys.documentView,
      name: 'ডকুমেন্ট দেখুন',
      description: 'সমিতির নথি, ভাউচার কপি ও নোটিশ দেখার অনুমতি',
      module: AppModule.document,
      resource: AppResource.document,
      action: AppAction.view,
      categoryBangla: 'ডকুমেন্ট',
    ),
    Permission(
      id: 'perm_doc_manage',
      key: PermissionKeys.documentManage,
      name: 'ডকুমেন্ট আপলোড ও ব্যবস্থাপনা',
      description: 'নথিপত্র স্ক্যান আপলোড ও ক্যাটাগরি করার অনুমতি',
      module: AppModule.document,
      resource: AppResource.document,
      action: AppAction.manage,
      categoryBangla: 'ডকুমেন্ট',
    ),
    Permission(
      id: 'perm_doc_download',
      key: PermissionKeys.documentDownload,
      name: 'ডকুমেন্ট ডাউনলোড',
      description: 'সংরক্ষিত মূল দলিল বা ভাউচার ডাউনলোড করার অনুমতি',
      module: AppModule.document,
      resource: AppResource.document,
      action: AppAction.download,
      categoryBangla: 'ডকুমেন্ট',
    ),
  ];

  /// কী (Key) দিয়ে পারমিশন অনুসন্ধান
  static Permission? getPermission(String key) {
    for (final perm in allPermissions) {
      if (perm.key == key) return perm;
    }
    return null;
  }

  /// সকল পারমিশন ক্যাটাগরি তালিকা (বাংলা)
  static List<String> get categories {
    return [
      'সংগঠন',
      'ব্যবহারকারী ও নিরাপত্তা',
      'সদস্য',
      'অর্থ ও হিসাব',
      'শেয়ার ও প্রকল্প',
      'হালাল ব্যবসা',
      'জমি, সম্পত্তি ও সম্পদ',
      'কমিটি, সভা ও পরিচালনা',
      'রিপোর্ট',
      'ডকুমেন্ট',
    ];
  }

  /// নির্দিষ্ট ক্যাটাগরির পারমিশনসমূহ
  static List<Permission> getPermissionsByCategory(String category) {
    return allPermissions.where((p) => p.categoryBangla == category).toList();
  }

  /// নির্দিষ্ট মডিউলের পারমিশনসমূহ
  static List<Permission> getPermissionsByModule(AppModule module) {
    return allPermissions.where((p) => p.module == module).toList();
  }

  /// সিস্টেম রোলসমূহের প্রমিত ও নিরাপদ ডিফল্ট পারমিশন ম্যাপিং
  ///
  /// নীতি:
  /// - Member: শুধুমাত্র স্বীয় অ্যাকাউন্ট ও সাধারণ সারাংশ ভিউ।
  /// - Collector: আদায় এন্ট্রি ও দাখিল (কোনো অনুমোদন বা রিভার্সাল নেই)।
  /// - Accountant: আর্থিক ভাউচার তৈরি ও দাখিল (কোনো অনুমোদন বা রিভার্সাল নেই)।
  /// - Treasurer: আর্থিক হিসাব, তহবিল ও ভাউচার অনুমোদন (তৈরি ব্যতিরেকে)।
  /// - Auditor: শুধুমাত্র ভিউ ও অডিট রিপোর্ট এক্সপোর্ট (কোনো এডিট/ডিলিট/অনুমোদন নেই)।
  /// - Secretary: প্রশাসনিক বিষয়াদি, সদস্য ও শাসন পরিচালনা।
  /// - Super Admin: পূর্ণ সিস্টেম প্রশাসন।
  static List<String> getDefaultRolePermissions(String roleKey) {
    switch (roleKey) {
      case SystemRoleKey.superAdmin:
        // সর্বমোট প্রশাসনিক ও নিরাপত্তা পারমিশন
        return allPermissions.map((p) => p.key).toList();

      case SystemRoleKey.secretary:
        return [
          PermissionKeys.organizationView,
          PermissionKeys.organizationEdit,
          PermissionKeys.userView,
          PermissionKeys.roleView,
          PermissionKeys.memberView,
          PermissionKeys.memberCreate,
          PermissionKeys.memberEdit,
          PermissionKeys.memberStatusChange,
          PermissionKeys.memberExport,
          PermissionKeys.memberPrint,
          PermissionKeys.memberManage,
          PermissionKeys.shareView,
          PermissionKeys.projectView,
          PermissionKeys.projectManage,
          PermissionKeys.businessView,
          PermissionKeys.assetView,
          PermissionKeys.governanceView,
          PermissionKeys.governanceManage,
          PermissionKeys.reportView,
          PermissionKeys.reportExport,
          PermissionKeys.reportPrint,
          PermissionKeys.documentView,
          PermissionKeys.documentManage,
          PermissionKeys.documentDownload,
        ];

      case SystemRoleKey.treasurer:
        // কোষাধ্যক্ষ: অর্থ ও হিসাব অনুমোদন এবং পরিচালনা (কোনো রিভার্সাল ছাড়া, যা আলাদা অডিট পলিসি দ্বারা নিয়ন্ত্রিত)
        return [
          PermissionKeys.organizationView,
          PermissionKeys.memberView,
          PermissionKeys.financeTransactionView,
          PermissionKeys.financeTransactionApprove,
          PermissionKeys.financeTransactionReject,
          PermissionKeys.financeAccountView,
          PermissionKeys.financeAccountManage,
          PermissionKeys.financeFundView,
          PermissionKeys.financeFundManage,
          PermissionKeys.shareView,
          PermissionKeys.projectView,
          PermissionKeys.businessView,
          PermissionKeys.assetView,
          PermissionKeys.reportView,
          PermissionKeys.reportExport,
          PermissionKeys.reportPrint,
          PermissionKeys.reportDownload,
          PermissionKeys.documentView,
          PermissionKeys.documentDownload,
        ];

      case SystemRoleKey.accountant:
        // হিসাবরক্ষক: ভাউচার তৈরি ও দাখিল (অনুমোদন বা রিভার্সাল ক্ষমতা সম্পূর্ণ নিষিদ্ধ)
        return [
          PermissionKeys.organizationView,
          PermissionKeys.memberView,
          PermissionKeys.financeTransactionView,
          PermissionKeys.financeTransactionCreate,
          PermissionKeys.financeTransactionEdit,
          PermissionKeys.financeTransactionSubmit,
          PermissionKeys.financeAccountView,
          PermissionKeys.financeFundView,
          PermissionKeys.shareView,
          PermissionKeys.reportView,
          PermissionKeys.reportExport,
          PermissionKeys.reportPrint,
          PermissionKeys.documentView,
          PermissionKeys.documentDownload,
        ];

      case SystemRoleKey.collector:
        // আদায়কারী: শুধুমাত্র আদায় এন্ট্রি ও দাখিল (কোনো অনুমোদন বা নীতি নির্ধারণ নেই)
        return [
          PermissionKeys.organizationView,
          PermissionKeys.memberView,
          PermissionKeys.financeTransactionView,
          PermissionKeys.financeTransactionCreate,
          PermissionKeys.financeTransactionSubmit,
          PermissionKeys.reportView,
          PermissionKeys.reportPrint,
          PermissionKeys.documentView,
        ];

      case SystemRoleKey.auditor:
        // নিরীক্ষক: ১০০% রিড-অনলি অডিট ও রিপোর্ট অ্যাক্সেস (কোনো ডাটা পরিবর্তন নিষিদ্ধ)
        return [
          PermissionKeys.organizationView,
          PermissionKeys.userView,
          PermissionKeys.roleView,
          PermissionKeys.auditLogView,
          PermissionKeys.memberView,
          PermissionKeys.financeTransactionView,
          PermissionKeys.financeAccountView,
          PermissionKeys.financeFundView,
          PermissionKeys.shareView,
          PermissionKeys.projectView,
          PermissionKeys.businessView,
          PermissionKeys.assetView,
          PermissionKeys.governanceView,
          PermissionKeys.reportView,
          PermissionKeys.reportExport,
          PermissionKeys.reportPrint,
          PermissionKeys.reportDownload,
          PermissionKeys.documentView,
          PermissionKeys.documentDownload,
        ];

      case SystemRoleKey.member:
        // সাধারণ সদস্য: স্বীয় তথ্য ও সাধারণ নোটিশ
        return [
          PermissionKeys.organizationView,
          PermissionKeys.memberView,
          PermissionKeys.shareView,
          PermissionKeys.reportView,
          PermissionKeys.documentView,
        ];

      default:
        return const [];
    }
  }

  /// সিস্টেম রোলসমূহের প্রমিত ইনস্ট্যান্স তৈরি
  static List<Role> createDefaultSystemRoles({required String organizationId}) {
    final now = DateTime.now();
    return SystemRoleKey.all.map((key) {
      final permissions = getDefaultRolePermissions(key);
      return Role(
        id: 'sys_role_${key}_$organizationId',
        organizationId: organizationId,
        key: key,
        name: SystemRoleKey.getBanglaName(key),
        description: _getRoleDescription(key),
        isSystemRole: true,
        isActive: true,
        permissionKeys: permissions,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system_bootstrap',
      );
    }).toList();
  }

  static String _getRoleDescription(String key) {
    switch (key) {
      case SystemRoleKey.superAdmin:
        return 'সমিতির সর্বময় প্রশাসনিক নিয়ন্ত্রণ ও নিরাপত্তা ব্যবস্থাপনা';
      case SystemRoleKey.secretary:
        return 'সাধারণ পরিচালনা, সদস্য প্রশাসন ও কার্যনির্বাহী কমিটির দায়িত্ব';
      case SystemRoleKey.treasurer:
        return 'আর্থিক হিসাব, তহবিল নিয়ন্ত্রণ ও লেনদেন অনুমোদন কর্তৃপক্ষ';
      case SystemRoleKey.accountant:
        return 'আর্থিক ভাউচার প্রস্তুত, হিসাবভুক্তকরণ ও অনুমোদনের জন্য দাখিলকারী';
      case SystemRoleKey.collector:
        return 'সদস্যদের থেকে চাঁদা, সঞ্চয় ও কিস্তি সংগ্রহকারী ফিল্ড প্রতিনিধি';
      case SystemRoleKey.auditor:
        return 'অভ্যন্তরীণ ও আর্থিক হিসাব নিরীক্ষক (রিড-অনলি অ্যাক্সেস)';
      case SystemRoleKey.member:
        return 'সমিতির সাধারণ সদস্যপদ ও স্বীয় হিসাব তথ্য পরিদর্শক';
      default:
        return 'কাস্টম সাংগঠনিক ভূমিকা';
    }
  }
}
