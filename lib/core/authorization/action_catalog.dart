/// AppAction: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড অ্যাকশন ক্যাটালগ
///
/// প্রতিটি পারমিশনের শেষাংশ একটি অ্যাকশন নির্দেশ করে (যেমন: `finance.transaction.create`)।
/// অ্যাকশন কখনো বাংলা টেক্সটের ওপর নির্ভর করে না; এটি একটি নির্দিষ্ট মেশিন-রিডেবল স্ট্রিং।
enum AppAction {
  view('view', 'দেখুন', 'তথ্য ও তালিকা প্রদর্শন'),
  create('create', 'তৈরি', 'নতুন রেকর্ড তৈরি'),
  edit('edit', 'সম্পাদনা', 'বিদ্যমান রেকর্ড সংশোধন'),
  delete('delete', 'মুছে ফেলা', 'রেকর্ড মুছে ফেলা (নন-ফাইন্যান্সিয়াল)'),
  approve('approve', 'অনুমোদন', 'দাখিলকৃত এন্ট্রি বা আবেদন অনুমোদন'),
  reject('reject', 'প্রত্যাখ্যান', 'দাখিলকৃত আবেদন বা এন্ট্রি বাতিল/প্রত্যাখ্যান'),
  reverse('reverse', 'রিভার্স/সংশোধন', 'অনুমোদিত লেনদেনের শরিয়াহসম্মত বিপরীত এন্ট্রি'),
  cancel('cancel', 'বাতিল', 'চলমান কার্যক্রম বা ড্রাফট বাতিল'),
  submit('submit', 'দাখিল', 'পর্যালোচনার জন্য ঊর্ধ্বতন কর্তৃপক্ষের নিকট দাখিল'),
  export('export', 'এক্সপোর্ট', 'এক্সেল বা সিএসভি আকারে ডেটা ডাউনলোড'),
  print('print', 'প্রিন্ট', 'মুদ্রণযোগ্য রসিদ বা রিপোর্ট প্রস্তুত'),
  download('download', 'ডাউনলোড', 'পিডিএফ বা ফাইল ডাউনলোড'),
  manage('manage', 'পরিচালনা', 'পূর্ণ প্রশাসনিক নিয়ন্ত্রণ ও ব্যবস্থাপনা'),
  configure('configure', 'কনফিগার', 'সিস্টেম বা মডিউল সেটিংস কনফিগার'),
  terminate('terminate', 'সমাপ্ত', 'সেশন বা কার্যক্রম সমাপ্তকরণ');

  final String key;
  final String banglaName;
  final String description;

  const AppAction(this.key, this.banglaName, this.description);

  static AppAction? fromKey(String key) {
    for (final action in AppAction.values) {
      if (action.key == key) return action;
    }
    return null;
  }
}
