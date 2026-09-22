import 'app_exception.dart';

/// Failure: ডোমেইন ও প্রেজেন্টেশন লেয়ারের জন্য নিরাপদ এরর অবজেক্ট
///
/// UI-তে সরাসরি কাঁচা এক্সেপশন না দেখিয়ে Failure মেসেজ ব্যবহার করা হয়।
abstract class Failure {
  final String message;
  final String? code;

  const Failure({required this.message, this.code});

  @override
  String toString() => '$runtimeType: $message';
}

/// নেটওয়ার্ক ফেইলিউর
class NetworkFailure extends Failure {
  const NetworkFailure({
    super.message = 'ইন্টারনেট সংযোগ পাওয়া যায়নি। সংযোগটি পরীক্ষা করুন।',
    super.code = 'NETWORK_ERROR',
  });
}

/// সার্ভার ফেইলিউর
class ServerFailure extends Failure {
  const ServerFailure({
    super.message = 'সার্ভার থেকে সঠিক সাড়া পাওয়া যায়নি।',
    super.code = 'SERVER_ERROR',
  });
}

/// অথেন্টিকেশন ফেইলিউর
class AuthFailure extends Failure {
  const AuthFailure({
    super.message = 'লগইন ব্যর্থ হয়েছে অথবা সেশনের মেয়াদ শেষ।',
    super.code = 'AUTH_ERROR',
  });
}

/// পারমিশন ফেইলিউর
class PermissionFailure extends Failure {
  const PermissionFailure({
    super.message = 'এই অ্যাকশনটি সম্পন্ন করার প্রয়োজনীয় অধিকার নেই।',
    super.code = 'PERMISSION_DENIED',
  });
}

/// ভ্যালিডেশন ফেইলিউর
class ValidationFailure extends Failure {
  final Map<String, dynamic>? errors;

  const ValidationFailure({
    super.message = 'দয়া করে ফর্মের তথ্যগুলো যাচাই করে আবার জমা দিন।',
    this.errors,
    super.code = 'VALIDATION_ERROR',
  });
}

/// সাধারণ বা অপ্রত্যাশিত ফেইলিউর
class GeneralFailure extends Failure {
  const GeneralFailure({
    super.message = 'একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে।',
    super.code = 'GENERAL_ERROR',
  });
}

/// AppException থেকে Failure-এ রূপান্তরকারী হেল্পার মেথড
Failure mapExceptionToFailure(AppException exception) {
  if (exception is NetworkException || exception is TimeoutException) {
    return NetworkFailure(message: exception.message);
  } else if (exception is UnauthorizedException) {
    return AuthFailure(message: exception.message);
  } else if (exception is ForbiddenException) {
    return PermissionFailure(message: exception.message);
  } else if (exception is ValidationException) {
    return ValidationFailure(message: exception.message, errors: exception.errors);
  } else if (exception is ServerException) {
    return ServerFailure(message: exception.message);
  }
  return GeneralFailure(message: exception.message);
}
