import '../../core/result/result.dart';
import '../entities/organization.dart';

/// OrganizationRepository: সমিতির ডেটা অ্যাক্সেসের ডোমেইন ইন্টারফেস
///
/// ডোমেইন লেয়ার বাস্তবায়নের (HTTP বা ডাটাবেজ) উপর নির্ভরশীল নয়,
/// এটি শুধুমাত্র কন্ট্রাক্ট নির্ধারণ করে।
abstract class OrganizationRepository {
  /// বর্তমান সক্রিয় সমিতি পাওয়ার মেথড
  Future<Result<Organization?>> getCurrentOrganization();

  /// ব্যবহারকারীর অন্তর্ভুক্ত সব সমিতির তালিকা পাওয়ার মেথড
  Future<Result<List<Organization>>> getUserOrganizations();

  /// সক্রিয় সমিতি পরিবর্তন করার মেথড (মাল্টি-টেন্যান্ট সুইচ)
  Future<Result<void>> switchOrganization(String organizationId);

  /// নির্দিষ্ট সমিতির বিবরণ পাওয়ার মেথড
  Future<Result<Organization>> getOrganizationById(String id);

  /// সমিতির প্রোফাইল আপডেট করার মেথড
  Future<Result<Organization>> updateOrganization(Organization organization);

  /// সমিতির সক্রিয় অবস্থা পরিবর্তন করার মেথড (যেমন: সক্রিয়, নিষ্ক্রিয়, স্থগিত, আর্কাইভ)
  Future<Result<Organization>> updateOrganizationStatus(
    String id,
    OrganizationStatus status,
  );
}
