/// Financial Dimensions: ইসলামি সমিতি পরিচালনার ত্রি-মাত্রিক আর্থিক নীতি
///
/// আর্কিটেকচার রুল ২১:
/// [Head] ≠ [Fund] ≠ [Account]
///
/// ১. Head (খাত): টাকা কেন এসেছে বা কেন খরচ হয়েছে (e.g. ভর্তি ফি, অফিস ভাড়া, স্টেশনারি)
/// ২. Fund (তহবিল): টাকা কোন উদ্দেশ্য বা ফান্ডের অন্তর্ভুক্ত (e.g. প্রশাসনিক তহবিল, সাধারণ তহবিল, শেয়ার তহবিল, প্রকল্প তহবিল)
/// ৩. Account (হিসাব): টাকা বর্তমানে বস্তুগতভাবে কোথায় জমা আছে (e.g. ক্যাশ ইন হ্যান্ড, ইসলামী ব্যাংক হিসাব, বিকাশ মার্চেন্ট)
///
/// প্রতিটি আয়-ব্যয় ট্রানজেকশনে এই তিনটি মাত্রা স্বাধীন ও স্পষ্ট থাকতে হবে।
enum FinancialDimensionType {
  head,
  fund,
  account,
}

/// Head: আয় বা ব্যয়ের খাত
class TransactionHead {
  final String id;
  final String name;
  final String code;
  final bool isIncome; // true = আয় খাত, false = ব্যয় খাত
  final String? description;

  const TransactionHead({
    required this.id,
    required this.name,
    required this.code,
    required this.isIncome,
    this.description,
  });
}

/// Fund: সমিতির তহবিল বা ফান্ড (Administrative, General, Share, Project, Custom)
class FinancialFund {
  final String id;
  final String name;
  final String code;
  final String? objective; // ফান্ডের উদ্দেশ্য (e.g. প্রশাসনিক, সাধারণ, শেয়ার, প্রকল্প)
  final bool isRestricted;

  const FinancialFund({
    required this.id,
    required this.name,
    required this.code,
    this.objective,
    this.isRestricted = false,
  });
}

/// Account: ব্যাংক বা ক্যাশ অ্যাকাউন্ট
class FinancialAccount {
  final String id;
  final String accountTitle;
  final String accountNumber;
  final String accountType; // Cash, Islami Bank, MFS
  final String? institutionName;

  const FinancialAccount({
    required this.id,
    required this.accountTitle,
    required this.accountNumber,
    required this.accountType,
    this.institutionName,
  });
}
