import 'package:flutter/foundation.dart';
import '../../../../core/state/ui_state.dart';
import '../../domain/entities/member.dart';
import '../../domain/entities/member_audit_record.dart';
import '../../domain/entities/member_status.dart';
import '../../domain/usecases/change_member_status_usecase.dart';
import '../../domain/usecases/create_member_usecase.dart';
import '../../domain/usecases/get_member_by_id_usecase.dart';
import '../../domain/usecases/get_members_usecase.dart';
import '../../domain/usecases/update_member_usecase.dart';
import '../../data/repositories/member_repository_impl.dart';

/// MemberController: সদস্য ব্যবস্থাপনা স্টেট কন্ট্রোলার
class MemberController extends ChangeNotifier {
  final GetMembersUseCase getMembersUseCase;
  final GetMemberByIdUseCase getMemberByIdUseCase;
  final CreateMemberUseCase createMemberUseCase;
  final UpdateMemberUseCase updateUserCase;
  final ChangeMemberStatusUseCase changeMemberStatusUseCase;

  MemberController({
    required this.getMembersUseCase,
    required this.getMemberByIdUseCase,
    required this.createMemberUseCase,
    required this.updateUserCase,
    required this.changeMemberStatusUseCase,
  });

  static MemberController? _instance;
  static MemberController get instance {
    if (_instance == null) {
      final repo = MemberRepositoryImpl.instance;
      _instance = MemberController(
        getMembersUseCase: GetMembersUseCase(repo),
        getMemberByIdUseCase: GetMemberByIdUseCase(repo),
        createMemberUseCase: CreateMemberUseCase(repo),
        updateUserCase: UpdateMemberUseCase(repo),
        changeMemberStatusUseCase: ChangeMemberStatusUseCase(repo),
      );
    }
    return _instance!;
  }

  UiState<List<Member>> _membersState = const UiInitial();
  UiState<List<Member>> get membersState => _membersState;

  List<Member> _allMembers = [];
  List<Member> get allMembers => _allMembers;

  Member? _selectedMember;
  Member? get selectedMember => _selectedMember;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  MemberStatus? _selectedStatusFilter;
  MemberStatus? get selectedStatusFilter => _selectedStatusFilter;

  List<MemberStatusAuditRecord> _memberStatusAudits = [];
  List<MemberStatusAuditRecord> get memberStatusAudits => _memberStatusAudits;

  Map<MemberStatus, int> _statusCounts = {
    MemberStatus.active: 0,
    MemberStatus.inactive: 0,
    MemberStatus.suspended: 0,
    MemberStatus.archived: 0,
  };
  Map<MemberStatus, int> get statusCounts => _statusCounts;

  bool _isActionLoading = false;
  bool get isActionLoading => _isActionLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  String? _successMessage;
  String? get successMessage => _successMessage;

  void clearMessages() {
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();
  }

  /// সদস্য তালিকা লোড করা
  Future<void> loadMembers({
    required String organizationId,
    bool showLoading = true,
  }) async {
    if (showLoading) {
      _membersState = const UiLoading();
      notifyListeners();
    }

    try {
      final members = await getMembersUseCase.execute(
        organizationId: organizationId,
        status: _selectedStatusFilter,
        searchQuery: _searchQuery,
      );

      _allMembers = members;
      _statusCounts = await MemberRepositoryImpl.instance.getMemberCountByStatus(
        organizationId: organizationId,
      );

      if (members.isEmpty) {
        _membersState = const UiEmpty(
          message: 'কোনো সদস্য পাওয়া যায়নি',
        );
      } else {
        _membersState = UiSuccess(members);
        // যদি পূর্বে কোনো সদস্য নির্বাচিত না থাকে বা বর্তমান তালিকায় না থাকে, তবে প্রথমজনকে সিলেক্ট করুন
        if (_selectedMember == null || !members.any((m) => m.id == _selectedMember!.id)) {
          selectMember(members.first, organizationId);
        } else {
          // নির্বাচিত সদস্যের সর্বশেষ তথ্য রিফ্রেশ
          final updated = members.firstWhere((m) => m.id == _selectedMember!.id);
          _selectedMember = updated;
        }
      }
      notifyListeners();
    } catch (e) {
      _membersState = UiError(
        message: 'সদস্য তালিকা লোড করতে সমস্যা হয়েছে: $e',
      );
      notifyListeners();
    }
  }

  /// নির্দিষ্ট সদস্য নির্বাচন করা এবং তার অডিট হিস্ট্রি লোড
  Future<void> selectMember(Member member, String organizationId) async {
    _selectedMember = member;
    notifyListeners();

    try {
      _memberStatusAudits = await MemberRepositoryImpl.instance.getMemberStatusAudits(
        organizationId: organizationId,
        memberId: member.id,
      );
      notifyListeners();
    } catch (_) {
      _memberStatusAudits = [];
      notifyListeners();
    }
  }

  /// সার্চ কুয়েরি পরিবর্তন
  void setSearchQuery(String query, String organizationId) {
    _searchQuery = query;
    loadMembers(organizationId: organizationId, showLoading: false);
  }

  /// স্ট্যাটাস ফিল্টার পরিবর্তন
  void setStatusFilter(MemberStatus? status, String organizationId) {
    _selectedStatusFilter = status;
    loadMembers(organizationId: organizationId, showLoading: false);
  }

  /// নতুন সদস্য তৈরি
  Future<bool> createMember({
    required String organizationId,
    required String fullName,
    required String mobile,
    String? email,
    DateTime? dateOfBirth,
    String? gender,
    String? occupation,
    String? fatherOrSpouseName,
    String? motherName,
    String? nid,
    String? address,
    DateTime? joinedAt,
    String? photoUrl,
    String? notes,
    required String actorUserId,
    required String actorName,
  }) async {
    _isActionLoading = true;
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();

    try {
      final newMember = await createMemberUseCase.execute(
        organizationId: organizationId,
        fullName: fullName,
        mobile: mobile,
        email: email,
        dateOfBirth: dateOfBirth,
        gender: gender,
        occupation: occupation,
        fatherOrSpouseName: fatherOrSpouseName,
        motherName: motherName,
        nid: nid,
        address: address,
        joinedAt: joinedAt,
        photoUrl: photoUrl,
        notes: notes,
        actorUserId: actorUserId,
        actorName: actorName,
      );

      _successMessage = 'সদস্য "${newMember.fullName}" (${newMember.memberCode}) সফলভাবে নিবন্ধিত হয়েছে';
      _isActionLoading = false;
      await loadMembers(organizationId: organizationId, showLoading: false);
      _selectedMember = newMember;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '').replaceAll('ArgumentError: ', '').replaceAll('StateError: ', '');
      _isActionLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// সদস্য তথ্য সংশোধন
  Future<bool> updateMember({
    required String organizationId,
    required String memberId,
    required String fullName,
    required String mobile,
    String? email,
    DateTime? dateOfBirth,
    String? gender,
    String? occupation,
    String? fatherOrSpouseName,
    String? motherName,
    String? nid,
    String? address,
    String? photoUrl,
    String? notes,
    required String actorUserId,
    required String actorName,
  }) async {
    _isActionLoading = true;
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();

    try {
      final updated = await updateUserCase.execute(
        organizationId: organizationId,
        memberId: memberId,
        fullName: fullName,
        mobile: mobile,
        email: email,
        dateOfBirth: dateOfBirth,
        gender: gender,
        occupation: occupation,
        fatherOrSpouseName: fatherOrSpouseName,
        motherName: motherName,
        nid: nid,
        address: address,
        photoUrl: photoUrl,
        notes: notes,
        actorUserId: actorUserId,
        actorName: actorName,
      );

      _successMessage = 'সদস্য "${updated.fullName}"-এর তথ্য সফলভাবে হালনাগাদ হয়েছে';
      _isActionLoading = false;
      _selectedMember = updated;
      await loadMembers(organizationId: organizationId, showLoading: false);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '').replaceAll('ArgumentError: ', '').replaceAll('StateError: ', '');
      _isActionLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// সদস্য স্ট্যাটাস পরিবর্তন
  Future<bool> changeMemberStatus({
    required String organizationId,
    required String memberId,
    required MemberStatus newStatus,
    required String reason,
    required String actorUserId,
    required String actorName,
  }) async {
    _isActionLoading = true;
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();

    try {
      final updated = await changeMemberStatusUseCase.execute(
        organizationId: organizationId,
        memberId: memberId,
        newStatus: newStatus,
        reason: reason,
        actorUserId: actorUserId,
        actorName: actorName,
      );

      _successMessage = 'সদস্য স্ট্যাটাস পরিবর্তিত হয়ে "${newStatus.banglaName}" হয়েছে';
      _isActionLoading = false;
      _selectedMember = updated;
      await loadMembers(organizationId: organizationId, showLoading: false);
      selectMember(updated, organizationId);
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '').replaceAll('ArgumentError: ', '').replaceAll('StateError: ', '');
      _isActionLoading = false;
      notifyListeners();
      return false;
    }
  }
}
