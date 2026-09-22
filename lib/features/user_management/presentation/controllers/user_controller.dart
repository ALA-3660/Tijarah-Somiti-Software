import 'package:flutter/foundation.dart';
import '../../../../core/state/ui_state.dart';
import '../../../../domain/entities/managed_user.dart';
import '../../../../domain/entities/user_status.dart';
import '../../domain/entities/user_audits.dart';
import '../../domain/usecases/user_use_cases.dart';

/// UserController: ব্যবহারকারী ব্যবস্থাপনা স্টেট কন্ট্রোলার
class UserController extends ChangeNotifier {
  final GetUsersUseCase getUsersUseCase;
  final GetUserByIdUseCase getUserByIdUseCase;
  final CreateUserUseCase createUserUseCase;
  final UpdateUserUseCase updateUserUseCase;
  final ChangeUserStatusUseCase changeUserStatusUseCase;
  final AssignUserRoleUseCase assignUserRoleUseCase;
  final RemoveUserRoleUseCase removeUserRoleUseCase;

  UserController({
    required this.getUsersUseCase,
    required this.getUserByIdUseCase,
    required this.createUserUseCase,
    required this.updateUserUseCase,
    required this.changeUserStatusUseCase,
    required this.assignUserRoleUseCase,
    required this.removeUserRoleUseCase,
  });

  UiState<List<ManagedUser>> _usersState = const UiInitial();
  UiState<List<ManagedUser>> get usersState => _usersState;

  List<ManagedUser> _allUsers = [];
  List<ManagedUser> get allUsers => _allUsers;

  ManagedUser? _selectedUser;
  ManagedUser? get selectedUser => _selectedUser;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  UserStatus? _selectedStatusFilter;
  UserStatus? get selectedStatusFilter => _selectedStatusFilter;

  String? _selectedRoleFilter;
  String? get selectedRoleFilter => _selectedRoleFilter;

  List<UserRoleAuditRecord> _userRoleAudits = [];
  List<UserRoleAuditRecord> get userRoleAudits => _userRoleAudits;

  List<UserStatusAuditRecord> _userStatusAudits = [];
  List<UserStatusAuditRecord> get userStatusAudits => _userStatusAudits;

  bool _isActionLoading = false;
  bool get isActionLoading => _isActionLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  String? _successMessage;
  String? get successMessage => _successMessage;

  /// ব্যবহারকারী তালিকা লোড করা
  Future<void> loadUsers({
    required String organizationId,
    bool showLoading = true,
  }) async {
    if (showLoading) {
      _usersState = const UiLoading();
      notifyListeners();
    }

    try {
      final users = await getUsersUseCase.execute(
        organizationId: organizationId,
        searchQuery: _searchQuery,
        statusFilter: _selectedStatusFilter,
        roleFilter: _selectedRoleFilter,
      );

      _allUsers = users;
      if (users.isEmpty) {
        _usersState = const UiEmpty(message: 'কোনো ব্যবহারকারী পাওয়া যায়নি।');
      } else {
        _usersState = UiSuccess(users);
        // যদি পূর্বে কোনো ইউজার সিলেক্টেড থাকে, তার ডেটা রিফ্রেশ করা
        if (_selectedUser != null) {
          final index = users.indexWhere((u) => u.id == _selectedUser!.id);
          if (index != -1) {
            _selectedUser = users[index];
          }
        }
      }
      _errorMessage = null;
    } catch (e) {
      _usersState = UiError(message: e.toString());
      _errorMessage = e.toString();
    } finally {
      notifyListeners();
    }
  }

  /// নির্দিষ্ট ব্যবহারকারী নির্বাচন
  void selectUser(ManagedUser? user) {
    _selectedUser = user;
    notifyListeners();
  }

  /// সার্চ কুয়েরি পরিবর্তন
  void setSearchQuery(String query, {required String organizationId}) {
    _searchQuery = query;
    loadUsers(organizationId: organizationId, showLoading: false);
  }

  /// স্ট্যাটাস ফিল্টার পরিবর্তন
  void setStatusFilter(UserStatus? status, {required String organizationId}) {
    _selectedStatusFilter = status;
    loadUsers(organizationId: organizationId, showLoading: false);
  }

  /// রোল ফিল্টার পরিবর্তন
  void setRoleFilter(String? roleKey, {required String organizationId}) {
    _selectedRoleFilter = roleKey;
    loadUsers(organizationId: organizationId, showLoading: false);
  }

  /// নতুন ব্যবহারকারী তৈরি
  Future<bool> createUser({
    required String organizationId,
    required String fullName,
    required String mobile,
    required String email,
    required List<String> initialRoleKeys,
    required String actorUserId,
    required String actorName,
  }) async {
    _isActionLoading = true;
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();

    try {
      final newUser = await createUserUseCase.execute(
        organizationId: organizationId,
        fullName: fullName,
        mobile: mobile,
        email: email,
        initialRoleKeys: initialRoleKeys,
        actorUserId: actorUserId,
        actorName: actorName,
      );

      _successMessage = '${newUser.fullName}-এর অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।';
      await loadUsers(organizationId: organizationId, showLoading: false);
      _selectedUser = newUser;
      _isActionLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isActionLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// ব্যবহারকারীর তথ্য হালনাগাদ
  Future<bool> updateUser({
    required String organizationId,
    required String userId,
    required String fullName,
    required String mobile,
    required String email,
    String? profilePhoto,
    required String actorUserId,
    required String actorName,
  }) async {
    _isActionLoading = true;
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();

    try {
      final updated = await updateUserUseCase.execute(
        organizationId: organizationId,
        userId: userId,
        fullName: fullName,
        mobile: mobile,
        email: email,
        profilePhoto: profilePhoto,
        actorUserId: actorUserId,
        actorName: actorName,
      );

      _successMessage = 'তথ্য সফলভাবে হালনাগাদ করা হয়েছে।';
      _selectedUser = updated;
      await loadUsers(organizationId: organizationId, showLoading: false);
      _isActionLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isActionLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// ব্যবহারকারীর স্ট্যাটাস পরিবর্তন
  Future<bool> changeStatus({
    required String organizationId,
    required String userId,
    required UserStatus newStatus,
    required String actorUserId,
    required String actorName,
    String? reason,
  }) async {
    _isActionLoading = true;
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();

    try {
      final updated = await changeUserStatusUseCase.execute(
        organizationId: organizationId,
        userId: userId,
        newStatus: newStatus,
        actorUserId: actorUserId,
        actorName: actorName,
        reason: reason,
      );

      _successMessage = 'অ্যাকাউন্টের স্ট্যাটাস পরিবর্তন করে "${newStatus.banglaName}" করা হয়েছে।';
      _selectedUser = updated;
      await loadUsers(organizationId: organizationId, showLoading: false);
      _isActionLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isActionLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// ব্যবহারকারীকে ভূমিকা অর্পণ
  Future<bool> assignRole({
    required String organizationId,
    required String userId,
    required String roleKey,
    required String actorUserId,
    required String actorName,
    String? reason,
  }) async {
    _isActionLoading = true;
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();

    try {
      final updated = await assignUserRoleUseCase.execute(
        organizationId: organizationId,
        userId: userId,
        roleKey: roleKey,
        actorUserId: actorUserId,
        actorName: actorName,
        reason: reason,
      );

      _successMessage = 'ভূমিকা সফলভাবে অর্পণ করা হয়েছে।';
      _selectedUser = updated;
      await loadUsers(organizationId: organizationId, showLoading: false);
      _isActionLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isActionLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// ব্যবহারকারীর ভূমিকা প্রত্যাহার
  Future<bool> removeRole({
    required String organizationId,
    required String userId,
    required String roleKey,
    required String actorUserId,
    required String actorName,
    String? reason,
  }) async {
    _isActionLoading = true;
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();

    try {
      final updated = await removeUserRoleUseCase.execute(
        organizationId: organizationId,
        userId: userId,
        roleKey: roleKey,
        actorUserId: actorUserId,
        actorName: actorName,
        reason: reason,
      );

      _successMessage = 'ভূমিকা প্রত্যাহার সম্পন্ন হয়েছে।';
      _selectedUser = updated;
      await loadUsers(organizationId: organizationId, showLoading: false);
      _isActionLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isActionLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// বার্তা পরিষ্কার করা
  void clearMessages() {
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();
  }

  /// অর্গানাইজেশন পরিবর্তন বা লগআউটের সময় ডেটা পরিষ্কার
  void reset() {
    _usersState = const UiInitial();
    _allUsers = [];
    _selectedUser = null;
    _searchQuery = '';
    _selectedStatusFilter = null;
    _selectedRoleFilter = null;
    _userRoleAudits = [];
    _userStatusAudits = [];
    _errorMessage = null;
    _successMessage = null;
    notifyListeners();
  }
}
