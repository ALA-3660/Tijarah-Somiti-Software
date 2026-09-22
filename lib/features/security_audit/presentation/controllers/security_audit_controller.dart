import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../core/presentation/ui_state.dart';
import '../../../organization/presentation/controllers/organization_context.dart';
import '../../data/repositories/security_audit_repository_impl.dart';
import '../../domain/entities/security_audit_record.dart';
import '../../domain/entities/security_event.dart';
import '../../domain/repositories/security_audit_repository.dart';
import '../../domain/usecases/get_security_audit_logs_use_case.dart';

/// SecurityAuditController: নিরাপত্তা অডিট স্ক্রিনের সেন্ট্রালাইজড স্টেট কন্ট্রোলার
class SecurityAuditController extends ChangeNotifier {
  final SecurityAuditRepository _repository;
  final GetSecurityAuditLogsUseCase _getAuditLogsUseCase;

  UiState<List<SecurityAuditRecord>> _state = const UiState.initial();
  UiState<List<SecurityAuditRecord>> get state => _state;

  List<SecurityAuditRecord> _allLoadedRecords = [];
  SecurityAuditRecord? _selectedRecord;
  SecurityAuditRecord? get selectedRecord => _selectedRecord;

  // ফিল্টার অবস্থা
  SecurityEventType? _filterEventType;
  SecurityEventType? get filterEventType => _filterEventType;

  SecurityEventResult? _filterResult;
  SecurityEventResult? get filterResult => _filterResult;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  DateTime? _filterStartDate;
  DateTime? get filterStartDate => _filterStartDate;

  DateTime? _filterEndDate;
  DateTime? get filterEndDate => _filterEndDate;

  StreamSubscription<SecurityAuditRecord>? _auditSubscription;

  SecurityAuditController({
    SecurityAuditRepository? repository,
  })  : _repository = repository ?? SecurityAuditRepositoryImpl.instance,
        _getAuditLogsUseCase = GetSecurityAuditLogsUseCase(
          repository ?? SecurityAuditRepositoryImpl.instance,
        ) {
    _initStream();
  }

  void _initStream() {
    _auditSubscription = _repository.auditStream.listen((newRecord) {
      final currentOrgId = OrganizationContext.instance.currentOrganizationId;
      if (newRecord.organizationId == currentOrgId) {
        // নতুন অডিট রিয়েল-টাইমে তালিকার শুরুতে যোগ হবে
        _allLoadedRecords.insert(0, newRecord);
        _applyFiltersAndEmit();
      }
    });
  }

  /// অডিট ডেটা লোড
  Future<void> loadAudits({bool forceRefresh = false}) async {
    _state = const UiState.loading();
    notifyListeners();

    try {
      final orgId = OrganizationContext.instance.currentOrganizationId;
      final records = await _getAuditLogsUseCase(
        GetSecurityAuditLogsParams(
          organizationId: orgId,
          eventType: _filterEventType,
          result: _filterResult,
          startDate: _filterStartDate,
          endDate: _filterEndDate,
          searchQuery: _searchQuery.isNotEmpty ? _searchQuery : null,
        ),
      );

      _allLoadedRecords = List.from(records);

      if (_allLoadedRecords.isEmpty) {
        _state = const UiState.empty();
        _selectedRecord = null;
      } else {
        _state = UiState.success(List.unmodifiable(_allLoadedRecords));
        // প্রথম রেকর্ডটি স্বয়ংক্রিয়ভাবে নির্বাচিত
        _selectedRecord = _allLoadedRecords.first;
      }
      notifyListeners();
    } catch (e) {
      _state = UiState.error('অডিট লগ লোড করতে সমস্যা হয়েছে: ${e.toString()}');
      _selectedRecord = null;
      notifyListeners();
    }
  }

  /// বিস্তারিত দেখার জন্য রেকর্ড নির্বাচন
  void selectRecord(SecurityAuditRecord? record) {
    _selectedRecord = record;
    notifyListeners();
  }

  /// ইভেন্ট টাইপ ফিল্টার নির্ধারণ
  void setEventTypeFilter(SecurityEventType? type) {
    _filterEventType = type;
    loadAudits();
  }

  /// রেজাল্ট ফিল্টার নির্ধারণ
  void setResultFilter(SecurityEventResult? result) {
    _filterResult = result;
    loadAudits();
  }

  /// সার্চ কুয়েরি পরিবর্তন
  void setSearchQuery(String query) {
    _searchQuery = query;
    loadAudits();
  }

  /// তারিখ রেঞ্জ ফিল্টার
  void setDateRange(DateTime? start, DateTime? end) {
    _filterStartDate = start;
    _filterEndDate = end;
    loadAudits();
  }

  /// সকল ফিল্টার রিসেট
  void resetFilters() {
    _filterEventType = null;
    _filterResult = null;
    _searchQuery = '';
    _filterStartDate = null;
    _filterEndDate = null;
    loadAudits();
  }

  void _applyFiltersAndEmit() {
    // লাইভ আপডেটের পর স্টেট রিফ্রেশ
    _state = UiState.success(List.unmodifiable(_allLoadedRecords));
    notifyListeners();
  }

  @override
  void dispose() {
    _auditSubscription?.cancel();
    super.dispose();
  }
}
