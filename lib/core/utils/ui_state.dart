import '../errors/failure.dart';

/// UiState: সব মডিউল ও স্ক্রিনের জন্য স্ট্যান্ডার্ড স্টেট প্যাটার্ন
///
/// এটি Initial, Loading, Success, Empty, Error এবং Submitting
/// স্টেটগুলোকে একটি পরিষ্কার এবং নিরাপদ উপায়ে পরিচালনা করে।
enum UiStatus {
  initial,
  loading,
  success,
  empty,
  error,
  submitting,
}

class UiState<T> {
  final UiStatus status;
  final T? data;
  final Failure? failure;
  final String? message;

  const UiState({
    required this.status,
    this.data,
    this.failure,
    this.message,
  });

  factory UiState.initial() => const UiState(status: UiStatus.initial);

  factory UiState.loading([String? message]) => UiState(
        status: UiStatus.loading,
        message: message ?? 'লোড হচ্ছে...',
      );

  factory UiState.submitting([String? message]) => UiState(
        status: UiStatus.submitting,
        message: message ?? 'তথ্য প্রক্রিয়াকরণ হচ্ছে...',
      );

  factory UiState.success(T data, [String? message]) => UiState(
        status: UiStatus.success,
        data: data,
        message: message,
      );

  factory UiState.empty([String? message]) => UiState(
        status: UiStatus.empty,
        message: message ?? 'কোনো তথ্য পাওয়া যায়নি।',
      );

  factory UiState.error(Failure failure) => UiState(
        status: UiStatus.error,
        failure: failure,
        message: failure.message,
      );

  bool get isInitial => status == UiStatus.initial;
  bool get isLoading => status == UiStatus.loading;
  bool get isSubmitting => status == UiStatus.submitting;
  bool get isSuccess => status == UiStatus.success;
  bool get isEmpty => status == UiStatus.empty;
  bool get isError => status == UiStatus.error;

  /// উইজেট বিল্ডার সহায়ক মেথড
  R when<R>({
    required R Function() onInitial,
    required R Function(String? message) onLoading,
    required R Function(T data) onSuccess,
    required R Function(String message) onEmpty,
    required R Function(Failure failure) onError,
    R Function(String? message)? onSubmitting,
  }) {
    switch (status) {
      case UiStatus.initial:
        return onInitial();
      case UiStatus.loading:
        return onLoading(message);
      case UiStatus.submitting:
        return (onSubmitting ?? onLoading)(message);
      case UiStatus.success:
        return onSuccess(data as T);
      case UiStatus.empty:
        return onEmpty(message ?? 'কোনো তথ্য পাওয়া যায়নি।');
      case UiStatus.error:
        return onError(failure ?? GeneralFailure(message: message ?? 'ত্রুটি'));
    }
  }
}
