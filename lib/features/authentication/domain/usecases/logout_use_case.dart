import '../../../core/result/result.dart';
import '../repositories/authentication_repository.dart';

/// LogoutUseCase: ব্যবহারকারীকে নিরাপদে লগআউট করানো
///
/// এটি প্রথমে রিমোট সার্ভারকে অবহিত করার চেষ্টা করে এবং সফল বা ব্যর্থ
/// যাই হোক না কেন, লোকাল সিকিউর স্টোরেজ ও মেমোরি সেশন সম্পূর্ণরূপে ক্লিয়ার করে।
class LogoutUseCase {
  final AuthenticationRepository _repository;

  LogoutUseCase(this._repository);

  Future<Result<void>> call() {
    return _repository.logout();
  }
}
