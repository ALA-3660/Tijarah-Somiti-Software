import '../../../core/errors/app_exception.dart';
import '../../../core/errors/failure.dart';
import '../../../core/result/result.dart';
import '../../domain/entities/organization.dart';
import '../../domain/repositories/organization_repository.dart';
import '../datasources/local/organization_local_datasource.dart';
import '../datasources/remote/organization_remote_datasource.dart';
import '../models/organization_model.dart';

/// OrganizationRepositoryImpl: OrganizationRepository-এর বাস্তবায়ন
///
/// এটি Remote ও Local DataSource-এর মধ্যে সমন্বয় করে এবং
/// কোনো এক্সেপশন দেখা দিলে তা ডোমেইন Failure-এ রূপান্তর করে Result অবজেক্ট ফেরত দেয়।
class OrganizationRepositoryImpl implements OrganizationRepository {
  final OrganizationRemoteDataSource _remoteDataSource;
  final OrganizationLocalDataSource _localDataSource;

  OrganizationRepositoryImpl({
    required OrganizationRemoteDataSource remoteDataSource,
    required OrganizationLocalDataSource localDataSource,
  })  : _remoteDataSource = remoteDataSource,
        _localDataSource = localDataSource;

  @override
  Future<Result<Organization?>> getCurrentOrganization() async {
    try {
      // ১. প্রথমে লোকাল ক্যাশ থেকে সক্রিয় সমিতি দেখার চেষ্টা করা
      final cached = await _localDataSource.getCachedActiveOrganization();
      if (cached != null) {
        return Result.success(cached);
      }

      // ২. সংরক্ষিত আইডি থাকলে রিমোট থেকে আনা
      final activeId = await _localDataSource.getActiveOrganizationId();
      if (activeId != null && activeId.isNotEmpty) {
        final remote = await _remoteDataSource.getOrganizationById(activeId);
        await _localDataSource.cacheActiveOrganization(remote);
        return Result.success(remote);
      }

      return Result.success(null);
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      return Result.failure(GeneralFailure(message: e.toString()));
    }
  }

  @override
  Future<Result<List<Organization>>> getUserOrganizations() async {
    try {
      final remoteList = await _remoteDataSource.getOrganizations();
      return Result.success(remoteList);
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      return Result.failure(GeneralFailure(message: e.toString()));
    }
  }

  @override
  Future<Result<void>> switchOrganization(String organizationId) async {
    try {
      // সক্রিয় সমিতি আইডি লোকাল সিকিউর স্টোরেজে সেট করা
      await _localDataSource.setActiveOrganizationId(organizationId);
      final org = await _remoteDataSource.getOrganizationById(organizationId);
      await _localDataSource.cacheActiveOrganization(org);
      return Result.success(null);
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      return Result.failure(GeneralFailure(message: e.toString()));
    }
  }

  @override
  Future<Result<Organization>> getOrganizationById(String id) async {
    try {
      final org = await _remoteDataSource.getOrganizationById(id);
      return Result.success(org);
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      return Result.failure(GeneralFailure(message: e.toString()));
    }
  }

  @override
  Future<Result<Organization>> updateOrganization(Organization organization) async {
    try {
      final model = OrganizationModel.fromEntity(organization);
      final updated = await _remoteDataSource.updateOrganization(model);
      
      // সক্রিয় সমিতি আপডেট হলে লোকাল ক্যাশ রিফ্রেশ
      final currentActiveId = await _localDataSource.getActiveOrganizationId();
      if (currentActiveId == updated.id) {
        await _localDataSource.cacheActiveOrganization(updated);
      }
      return Result.success(updated);
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      return Result.failure(GeneralFailure(message: e.toString()));
    }
  }

  @override
  Future<Result<Organization>> updateOrganizationStatus(
    String id,
    OrganizationStatus status,
  ) async {
    try {
      final updated = await _remoteDataSource.updateOrganizationStatus(id, status.name);
      final currentActiveId = await _localDataSource.getActiveOrganizationId();
      if (currentActiveId == updated.id) {
        await _localDataSource.cacheActiveOrganization(updated);
      }
      return Result.success(updated);
    } on AppException catch (e) {
      return Result.failure(mapExceptionToFailure(e));
    } catch (e) {
      return Result.failure(GeneralFailure(message: e.toString()));
    }
  }
}
