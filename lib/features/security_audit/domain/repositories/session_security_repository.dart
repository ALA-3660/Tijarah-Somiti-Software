import '../entities/security_session.dart';

/// SessionSecurityRepository: সেশন নিরাপত্তা রিপোজিটরি ইন্টারফেস
abstract class SessionSecurityRepository {
  /// নির্দিষ্ট প্রতিষ্ঠানের সকল সেশন তালিকা
  Future<List<SecuritySession>> getSessions(String organizationId);

  /// ব্যবহারকারীর বর্তমান সেশন সারাংশ
  Future<SecuritySession?> getCurrentSession(String organizationId, String userId);

  /// নির্দিষ্ট সেশন সমাপ্তকরণ (প্রশাসনিক ক্ষমতা)
  Future<SecuritySession> terminateSession({
    required String organizationId,
    required String sessionId,
    required String actorUserId,
    required String reason,
  });

  /// সেশন পরিবর্তন স্ট্রিম
  Stream<List<SecuritySession>> get sessionStream;
}
