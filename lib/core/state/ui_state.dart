import 'package:flutter/foundation.dart';
import '../errors/failures.dart';

/// UiState: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড অ্যাপ্লিকেশন স্টেট মডেল
///
/// Sealed class প্যাটার্ন অনুসরণ করে প্রতিটি ভিউ ও ফিচারের জন্য
/// একটি ধারাবাহিক এবং টাইপ-সেফ স্টেট আর্কিটেকচার প্রদান করে।
@immutable
abstract class UiState<T> {
  const UiState();

  /// প্যাটার্ন ম্যাচিং হেল্পার
  R when<R>({
    required R Function() initial,
    required R Function(String? message, double? progress) loading,
    required R Function(T data) success,
    required R Function(String title, String? message) empty,
    required R Function(String userMessage, Failure? failure, VoidCallback? onRetry) error,
    required R Function(String message, VoidCallback? onRetry) offline,
    required R Function(String message) unauthorized,
    required R Function(String message) forbidden,
  }) {
    if (this is UiInitial<T>) {
      return initial();
    } else if (this is UiLoading<T>) {
      final s = this as UiLoading<T>;
      return loading(s.message, s.progress);
    } else if (this is UiSuccess<T>) {
      return success((this as UiSuccess<T>).data);
    } else if (this is UiEmpty<T>) {
      final s = this as UiEmpty<T>;
      return empty(s.title, s.message);
    } else if (this is UiError<T>) {
      final s = this as UiError<T>;
      return error(s.userMessage, s.failure, s.onRetry);
    } else if (this is UiOffline<T>) {
      final s = this as UiOffline<T>;
      return offline(s.message, s.onRetry);
    } else if (this is UiUnauthorized<T>) {
      return unauthorized((this as UiUnauthorized<T>).message);
    } else if (this is UiForbidden<T>) {
      return forbidden((this as UiForbidden<T>).message);
    }
    throw StateError('Unknown UiState: $this');
  }

  /// Optional pattern matching
  R maybeWhen<R>({
    R Function()? initial,
    R Function(String? message, double? progress)? loading,
    R Function(T data)? success,
    R Function(String title, String? message)? empty,
    R Function(String userMessage, Failure? failure, VoidCallback? onRetry)? error,
    R Function(String message, VoidCallback? onRetry)? offline,
    R Function(String message)? unauthorized,
    R Function(String message)? forbidden,
    required R Function() orElse,
  }) {
    if (this is UiInitial<T> && initial != null) return initial();
    if (this is UiLoading<T> && loading != null) {
      final s = this as UiLoading<T>;
      return loading(s.message, s.progress);
    }
    if (this is UiSuccess<T> && success != null) return success((this as UiSuccess<T>).data);
    if (this is UiEmpty<T> && empty != null) {
      final s = this as UiEmpty<T>;
      return empty(s.title, s.message);
    }
    if (this is UiError<T> && error != null) {
      final s = this as UiError<T>;
      return error(s.userMessage, s.failure, s.onRetry);
    }
    if (this is UiOffline<T> && offline != null) {
      final s = this as UiOffline<T>;
      return offline(s.message, s.onRetry);
    }
    if (this is UiUnauthorized<T> && unauthorized != null) {
      return unauthorized((this as UiUnauthorized<T>).message);
    }
    if (this is UiForbidden<T> && forbidden != null) {
      return forbidden((this as UiForbidden<T>).message);
    }
    return orElse();
  }

  bool get isInitial => this is UiInitial<T>;
  bool get isLoading => this is UiLoading<T>;
  bool get isSuccess => this is UiSuccess<T>;
  bool get isEmpty => this is UiEmpty<T>;
  bool get isError => this is UiError<T>;
  bool get isOffline => this is UiOffline<T>;
  bool get isUnauthorized => this is UiUnauthorized<T>;
  bool get isForbidden => this is UiForbidden<T>;

  T? get dataOrNull => this is UiSuccess<T> ? (this as UiSuccess<T>).data : null;
}

/// ১. Initial State: প্রাথমিক লোড না হওয়া অবস্থা
class UiInitial<T> extends UiState<T> {
  const UiInitial();
}

/// ২. Loading State: প্রসেসিং বা ফেচিং চলমান অবস্থা
class UiLoading<T> extends UiState<T> {
  final String? message;
  final double? progress;

  const UiLoading({this.message, this.progress});
}

/// ৩. Success State: সফলভাবে ডাটা প্রাপ্তি
class UiSuccess<T> extends UiState<T> {
  final T data;

  const UiSuccess(this.data);
}

/// ৪. Empty State: সফল ফেচ কিন্তু তালিকায় কোনো রেকর্ড নেই
class UiEmpty<T> extends UiState<T> {
  final String title;
  final String? message;

  const UiEmpty({
    this.title = 'কোনো তথ্য পাওয়া যায়নি',
    this.message = 'এই তালিকায় বর্তমানে কোনো তথ্য বা রেকর্ড নেই।',
  });
}

/// ৫. Error State: যেকোনো সিস্টেম বা নেটওয়ার্ক এরর (ইউজার-ফ্রেন্ডলি বাংলা বার্তা)
class UiError<T> extends UiState<T> {
  final String userMessage;
  final Failure? failure;
  final VoidCallback? onRetry;

  const UiError({
    this.userMessage = 'তথ্য লোড করা সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।',
    this.failure,
    this.onRetry,
  });
}

/// ৬. Offline State: ইন্টারনেট সংযোগ বিচ্ছিন্ন
class UiOffline<T> extends UiState<T> {
  final String message;
  final VoidCallback? onRetry;

  const UiOffline({
    this.message = 'ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না। আপনার ডাটা বা ওয়াইফাই সংযোগ পরীক্ষা করুন।',
    this.onRetry,
  });
}

/// ৭. Unauthorized State: সেশন মেয়াদোত্তীর্ণ বা লগইন প্রয়োজন
class UiUnauthorized<T> extends UiState<T> {
  final String message;

  const UiUnauthorized({
    this.message = 'আপনার লগইন সেশনের মেয়াদ শেষ হয়েছে। দয়া করে পুনরায় লগইন করুন।',
  });
}

/// ৮. Forbidden / Permission Restricted State: ফিচারে অ্যাক্সেস অনুমতি নেই
class UiForbidden<T> extends UiState<T> {
  final String message;

  const UiForbidden({
    this.message = 'এই অংশটি ব্যবহারের জন্য আপনার অ্যাকাউন্টের প্রয়োজনীয় অনুমতি নেই।',
  });
}
