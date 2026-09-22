/// NetworkInfo: ইন্টারনেট সংযোগের অবস্থা যাচাই করার অ্যাবস্ট্রাকশন
abstract class NetworkInfo {
  Future<bool> get isConnected;
}

/// সাধারণ ইমপ্লিমেন্টেশন
class NetworkInfoImpl implements NetworkInfo {
  @override
  Future<bool> get isConnected async {
    // মোবাইল ডিভাইসে সংযোগ পরীক্ষা করা
    return true;
  }
}
