/// AppException: অ্যাপ্লিকেশন স্তরের এক্সেপশন বেস ক্লাস
abstract class AppException implements Exception {
  final String message;
  final String? technicalDetails;
  final int? statusCode;

  const AppException({
    required this.message,
    this.technicalDetails,
    this.statusCode,
  });

  @override
  String toString() => '$runtimeType: $message (${technicalDetails ?? ""})';
}

/// নেটওয়ার্ক সংক্রান্ত এক্সেপশন (ইন্টারনেট না থাকা)
class NetworkException extends AppException {
  const NetworkException({
    super.message = 'ইন্টারনেট সংযোগ পাওয়া যায়নি। দয়া করে নেটওয়ার্ক চেক করুন।',
    super.technicalDetails,
  });
}

/// রিকোয়েস্ট টাইমআউট এক্সেপশন
class TimeoutException extends AppException {
  const TimeoutException({
    super.message = 'সার্ভারে সাড়া পেতে দেরি হচ্ছে। আবার চেষ্টা করুন।',
    super.technicalDetails,
  });
}

/// API অথোরাইজেশন এক্সেপশন (401 Unauthorized)
class UnauthorizedException extends AppException {
  const UnauthorizedException({
    super.message = 'আপনার লগইন সেশনের মেয়াদ শেষ হয়েছে। দয়া করে পুনরায় লগইন করুন।',
    super.technicalDetails,
    super.statusCode = 401,
  });
}

/// পারমিশন সংক্রান্ত এক্সেপশন (403 Forbidden)
class ForbiddenException extends AppException {
  const ForbiddenException({
    super.message = 'এই কাজের অনুমতি আপনার অ্যাকাউন্টে নেই।',
    super.technicalDetails,
    super.statusCode = 403,
  });
}

/// ডেটা পাওয়া যায়নি (404 Not Found)
class NotFoundException extends AppException {
  const NotFoundException({
    super.message = 'অনুরোধকৃত তথ্যটি সার্ভারে খুঁজে পাওয়া যায়নি।',
    super.technicalDetails,
    super.statusCode = 404,
  });
}

/// ইনপুট ভ্যালিডেশন সংক্রান্ত এক্সেপশন (400/422 Bad Request)
class ValidationException extends AppException {
  final Map<String, dynamic>? errors;

  const ValidationException({
    super.message = 'প্রদত্ত তথ্যে কিছু ভুল রয়েছে। দয়া করে সংশোধন করুন।',
    this.errors,
    super.technicalDetails,
    super.statusCode = 400,
  });
}

/// সার্ভার সাইড ইন্টারনাল এরর (500 Internal Server Error)
class ServerException extends AppException {
  const ServerException({
    super.message = 'সার্ভারে সাময়িক ত্রুটি দেখা দিয়েছে। কিছুক্ষণ পর চেষ্টা করুন।',
    super.technicalDetails,
    super.statusCode = 500,
  });
}

/// ডেটা পার্সিং বা ফরম্যাটিং এক্সেপশন
class ParsingException extends AppException {
  const ParsingException({
    super.message = 'সার্ভার থেকে প্রাপ্ত তথ্য প্রসেস করতে ব্যর্থ হয়েছে।',
    super.technicalDetails,
  });
}
