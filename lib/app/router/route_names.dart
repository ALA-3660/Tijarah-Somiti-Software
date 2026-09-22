/// RouteNames: তিজারাহ সমিতি সফটওয়্যারের সকল রুটের সেন্ট্রালাইজড কনস্ট্যান্ট তালিকা
///
/// রাউটের নাম কোডের বিভিন্ন জায়গায় স্ট্রিং হিসেবে ছড়িয়ে না রেখে
/// এক জায়গায় কনস্ট্যান্ট হিসেবে রাখা হয়েছে যাতে টাইপো বা ভুল না হয়।
class RouteNames {
  RouteNames._();

  // Root & Foundation Shell
  static const String initial = '/';
  static const String shell = '/shell';
  static const String login = '/login';
  static const String forgotPassword = '/forgot-password';

  // ১. ড্যাশবোর্ড (Standalone)
  static const String dashboard = '/dashboard';

  // ২. সংগঠন, ব্যবহারকারী ও নিরাপত্তা
  static const String orgSecurity = '/organization-security';
  static const String orgInfo = '/organization-security/info';
  static const String orgUsers = '/organization-security/users';
  static const String orgRoles = '/organization-security/roles';
  static const String orgLoginSecurity = '/organization-security/login-security';
  static const String orgSessions = '/organization-security/sessions';
  static const String orgLogs = '/organization-security/logs';
  static const String orgSecurityAudit = '/organization-security/security-audit';

  // ৩. সদস্য ব্যবস্থাপনা
  static const String members = '/members';
  static const String memberList = '/members/list';
  static const String memberNew = '/members/new';
  static const String memberProfile = '/members/profile';
  static const String memberApplications = '/members/applications';
  static const String memberAccounts = '/members/accounts';
  static const String memberShares = '/members/shares';
  static const String memberInstallments = '/members/installments';
  static const String memberActivities = '/members/activities';
  static const String memberReports = '/members/reports';

  // ৪. মাস্টার ডাটা ও খাত ব্যবস্থাপনা
  static const String masterData = '/master-data';
  static const String masterIncomeHeads = '/master-data/income-heads';
  static const String masterExpenseHeads = '/master-data/expense-heads';
  static const String masterFunds = '/master-data/funds';
  static const String masterAccounts = '/master-data/accounts';
  static const String masterMemberTypes = '/master-data/member-types';
  static const String masterBusinessTypes = '/master-data/business-types';
  static const String masterProducts = '/master-data/products-services';
  static const String masterGeneralSetup = '/master-data/general-setup';
  static const String masterReports = '/master-data/reports';

  // ৫. অর্থ ও হিসাব (3 Dimensions: Head, Fund, Account)
  static const String finance = '/finance';
  static const String financeIncome = '/finance/income';
  static const String financeExpense = '/finance/expense';
  static const String financeTransfer = '/finance/transfer';
  static const String financeFunds = '/finance/funds';
  static const String financeAccounts = '/finance/accounts';
  static const String financeCollectors = '/finance/collectors';
  static const String financeCash = '/finance/cash';
  static const String financeBank = '/finance/bank';
  static const String financeLedger = '/finance/ledger';
  static const String financeBudget = '/finance/budget';
  static const String financeReports = '/finance/reports';

  // ৬. শেয়ার ও প্রকল্প
  static const String sharesProjects = '/shares-projects';
  static const String projectList = '/shares-projects/projects';
  static const String projectParticipation = '/shares-projects/participation';
  static const String shareList = '/shares-projects/shares';
  static const String shareAllocation = '/shares-projects/allocation';
  static const String shareInstallments = '/shares-projects/installments';
  static const String sharePayments = '/shares-projects/payments';
  static const String shareCertificates = '/shares-projects/certificates';
  static const String projectCompletion = '/shares-projects/completion';
  static const String shareReports = '/shares-projects/reports';

  // ৭. হালাল ব্যবসা
  static const String halalBusiness = '/halal-business';
  static const String businessDashboard = '/halal-business/dashboard';
  static const String businessSuppliers = '/halal-business/suppliers';
  static const String businessPurchase = '/halal-business/purchase';
  static const String businessProducts = '/halal-business/products';
  static const String businessInventory = '/halal-business/inventory';
  static const String businessSales = '/halal-business/sales';
  static const String businessCustomers = '/halal-business/customers';
  static const String businessInstallmentSales = '/halal-business/installment-sales';
  static const String businessContracts = '/halal-business/sale-contracts';
  static const String businessCollections = '/halal-business/collections';
  static const String businessDues = '/halal-business/dues';
  static const String businessReports = '/halal-business/reports';

  // ৮. জমি, সম্পত্তি ও সম্পদ
  static const String assets = '/assets';
  static const String assetLand = '/assets/land';
  static const String assetBuildings = '/assets/buildings';
  static const String assetVehicles = '/assets/vehicles';
  static const String assetEquipment = '/assets/equipment';
  static const String assetFurniture = '/assets/furniture';
  static const String assetOther = '/assets/other';
  static const String assetTransfer = '/assets/transfer';
  static const String assetMaintenance = '/assets/maintenance';
  static const String assetReports = '/assets/reports';

  // ৯. কমিটি, সভা ও পরিচালনা
  static const String governance = '/governance';
  static const String governanceCommittees = '/governance/committees';
  static const String governanceRoles = '/governance/roles-responsibilities';
  static const String governanceMembers = '/governance/members';
  static const String governanceTenure = '/governance/tenure';
  static const String governanceMeetings = '/governance/meetings';
  static const String governanceAttendance = '/governance/attendance';
  static const String governanceAgendas = '/governance/agendas';
  static const String governanceResolutions = '/governance/resolutions';
  static const String governanceNotices = '/governance/notices';
  static const String governanceAttachments = '/governance/attachments';
  static const String governanceReports = '/governance/reports';

  // ১০. ডকুমেন্ট ও Google Drive
  static const String documents = '/documents';
  static const String docAll = '/documents/all';
  static const String docLocalUpload = '/documents/local-upload';
  static const String docGoogleDrive = '/documents/google-drive';
  static const String docTypes = '/documents/types';
  static const String docShared = '/documents/shared';
  static const String docSearch = '/documents/search';
  static const String docReports = '/documents/reports';

  // ১১. রিপোর্ট ও বিশ্লেষণ
  static const String reports = '/reports';
  static const String reportCenter = '/reports/center';
  static const String reportFinancial = '/reports/financial';
  static const String reportMembers = '/reports/members';
  static const String reportShares = '/reports/shares';
  static const String reportProjects = '/reports/projects';
  static const String reportBusiness = '/reports/business';
  static const String reportAssets = '/reports/assets';
  static const String reportGovernance = '/reports/governance';
  static const String reportDocuments = '/reports/documents';
  static const String reportCustom = '/reports/custom';

  // ১২. প্রশাসন ও সেটিংস
  static const String administration = '/administration';
  static const String adminAppSettings = '/administration/app-settings';
  static const String adminOrgSettings = '/administration/org-settings';
  static const String adminUserSettings = '/administration/user-settings';
  static const String adminPermissions = '/administration/permissions';
  static const String adminNotifications = '/administration/notifications';
  static const String adminBackup = '/administration/backup';
  static const String adminIntegrations = '/administration/integrations';
  static const String adminAudit = '/administration/audit';
  static const String adminSystemInfo = '/administration/system-info';

  // ১৩. সহায়িকা
  static const String helpGuide = '/help-guide';
  static const String helpGettingStarted = '/help-guide/getting-started';
  static const String helpUserManual = '/help-guide/user-manual';
  static const String helpFaq = '/help-guide/faq';
  static const String helpAccounting = '/help-guide/accounting-guide';
  static const String helpHalalBusiness = '/help-guide/halal-business-guide';
  static const String helpShariahPrinciples = '/help-guide/shariah-principles';
  static const String helpSupport = '/help-guide/support';
  static const String helpAbout = '/help-guide/about';
}
