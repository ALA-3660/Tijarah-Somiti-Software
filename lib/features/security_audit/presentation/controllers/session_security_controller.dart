import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../core/presentation/ui_state.dart';
import '../../../organization/presentation/controllers/organization_context.dart';
import '../../data/repositories/session_security_repository_impl.dart';
import '../../domain/entities/security_session.dart';
import '../../domain/repositories/session_security_repository.dart';
import '../../domain/usecases/get_security_sessions_use_case.dart';
import '../../domain/usecases/terminate_session_use_case.dart';

/// SessionSecurityController: সেশন নিরাপত্তা স্ক্রিনের স্টেট কন্ট্রোলার
class SessionSecurityController extends ChangeNotifier {
  final SessionSecurityRepository _repository;
  final GetSecuritySessionsUseCase _getSessionsUseCase;
  final TerminateSessionUseCase _terminateSessionUseCase;

  UiState<List<SecuritySession>> _state = const UiState.initial();
  UiState<List<SecuritySession>> get state => _state;

  SecuritySession? _currentSession;
  SecuritySession? get currentSession => _currentSession;

  StreamSubscription<List<SecuritySession>>? _sessionSubscription;

  SessionSecurityController({
    SessionSecurityRepository? repository,
  })  : _repository = repository ?? SessionSecurityRepositoryImpl.instance,
        _getSessionsUseCase = GetSecuritySessionsUseCase(
          repository ?? SessionSecurityRepositoryImpl.instance,
        ),
        _terminateSessionUseCase = TerminateSessionUseCase(
          repository ?? SessionSecurityRepositoryImpl.instance,
        ) {
    _initStream();
  }

  void _initStream() {
    _sessionSubscription = _repository.sessionStream.listen((sessions) {
      final currentOrgId = OrganizationContext.instance.currentOrganizationId;
      final orgSessions = sessions.where((s) => s.organizationId == currentOrgId).toList();
      _state = UiState.success(List.unmodifiable(orgSessions));
      _updateCurrentSession(orgSessions);
      notifyListeners();
    });
  }

  /// সেশন লোড
  Future<void> loadSessions() async {
    _state = const UiState.loading();
    notifyListeners();

    try {
      final orgId = OrganizationContext.instance.currentOrganizationId;
      final sessions = await _getSessionsUseCase(orgId);

      if (sessions.isEmpty) {
        _state = const UiState.empty();
        _currentSession = null;
      } else {
        _state = UiState.success(List.unmodifiable(sessions));
        _updateCurrentSession(sessions);
      }
      notifyListeners();
    } catch (e) {
      _state = UiState.error('সেশন তালিকা লোড করতে সমস্যা হয়েছে: ${e.toString()}');
      notifyListeners();
    }
  }

  void _updateCurrentSession(List<SecuritySession> sessions) {
    try {
      _currentSession = sessions.firstWhere((s) => s.isCurrent && s.isActive);
    } catch (_) {
      // যদি কারেন্ট ফ্ল্যাগ না থাকে, তবে প্রথম সক্রিয় সেশনকে কারেন্ট ধরা হবে
      try {
        _currentSession = sessions.firstWhere((s) => s.isActive);
      } catch (_) {
        _currentSession = null;
      }
    }
  }

  /// সেশন সমাপ্তকরণ
  Future<bool> terminateSession({
    required String sessionId,
    required String actorUserId,
    required String reason,
  }) async {
    try {
      final orgId = OrganizationContext.instance.currentOrganizationId;
      await _terminateSessionUseCase(
        organizationId: orgId,
        sessionId: sessionId,
        actorUserId: actorUserId,
        reason: reason,
      );
      // রিলোড সেশন তালিকা
      await loadSessions();
      return true;
    } catch (e) {
      return false;
    }
  }

  @override
  void dispose() {
    _sessionSubscription?.cancel();
    super.dispose();
  }
}
