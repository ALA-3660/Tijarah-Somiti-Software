import '../errors/failure.dart';

/// Result: মেথড আউটপুটকে নিরাপদভাবে মোড়ানোর জন্য টাইপ-সেফ ক্লাস
///
/// এটি ডোমেইন এবং রিপোজিটরি লেয়ারে ব্যবহৃত হয় যাতে কোনো আনহ্যান্ডল্ড এক্সেপশন
/// অ্যাপ ক্র্যাশ না করে। ফলাফল হয় Success অথবা Failure।
class Result<T> {
  final T? _data;
  final Failure? _failure;

  const Result._({T? data, Failure? failure})
      : _data = data,
        _failure = failure;

  /// সফল ফলাফলের জন্য ফ্যাক্টরি
  factory Result.success(T data) => Result._(data: data);

  /// ব্যর্থ ফলাফলের জন্য ফ্যাক্টরি
  factory Result.failure(Failure failure) => Result._(failure: failure);

  /// এটি কি সফল?
  bool get isSuccess => _failure == null;

  /// এটি কি ব্যর্থ?
  bool get isFailure => _failure != null;

  /// সফল হলে ডেটা প্রদান করবে
  T get data {
    if (isFailure) {
      throw StateError('Cannot get data from a failed Result: $_failure');
    }
    return _data as T;
  }

  /// ডেটা পাওয়া গেলে তা প্রদান করবে, ব্যর্থ হলে null
  T? get dataOrNull => _data;

  /// ব্যর্থ হলে Failure প্রদান করবে
  Failure get failure {
    if (isSuccess) {
      throw StateError('Cannot get failure from a successful Result');
    }
    return _failure!;
  }

  /// Failure পাওয়া গেলে তা প্রদান করবে, সফল হলে null
  Failure? get failureOrNull => _failure;

  /// প্যাটার্ন ম্যাচিং স্টাইলে ফলাফল হ্যান্ডল করার মেথড
  R when<R>({
    required R Function(T data) onSuccess,
    required R Function(Failure failure) onFailure,
  }) {
    if (isSuccess) {
      return onSuccess(data);
    } else {
      return onFailure(failure);
    }
  }

  @override
  String toString() {
    if (isSuccess) {
      return 'Result.success($data)';
    } else {
      return 'Result.failure($failure)';
    }
  }
}
