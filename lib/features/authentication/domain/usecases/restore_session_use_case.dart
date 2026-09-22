import '../../../core/result/result.dart';
import '../entities/authentication_session.dart';
import '../repositories/authentication_repository.dart';

/// RestoreSessionUseCase: অ্যাপ চালুর সময় পূর্ববর্তী বৈধ সেশন পুনরুদ্ধার
///
/// সিকিউর স্টোরেজ থেকে ক্রেডেনশিয়াল চেক করা হয় এবং টোকেনের মেয়াদ
/// শেষ হয়ে থাকলে রিফ্রেশ টোকেন দিয়ে নতুন অ্যাক্সেস টোকেন আনা হয়।
class RestoreSessionUseCase {
  final AuthenticationRepository _repository;

  RestoreSessionUseCase(this._repository);

  Future<Result<AuthenticationSession>> call() {
    return _repository.restoreSession();
  }
}
