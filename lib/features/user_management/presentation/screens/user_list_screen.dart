import 'package:flutter/material.dart';
import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/authorization/authorization_service.dart';
import '../../../../core/authorization/permission_catalog.dart';
import '../../../../core/authorization/permission_guard.dart';
import '../../../../core/authorization/permission_keys.dart';
import '../../../../core/authorization/route_permission_guard.dart';
import '../../../../core/state/ui_state.dart';
import '../../../../domain/entities/managed_user.dart';
import '../../../../domain/entities/role.dart';
import '../../../../domain/entities/user_status.dart';
import '../../../../features/organization/domain/services/organization_context.dart';
import '../../../../shared/widgets/app_badge.dart';
import '../../../../shared/widgets/app_breadcrumbs.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/app_confirm_action.dart';
import '../../../../shared/widgets/app_dialog.dart';
import '../../../../shared/widgets/app_dropdown.dart';
import '../../../../shared/widgets/app_empty_state.dart';
import '../../../../shared/widgets/app_error.dart';
import '../../../../shared/widgets/app_loading.dart';
import '../../../../shared/widgets/app_search_field.dart';
import '../../../../shared/widgets/app_section_header.dart';
import '../../../../shared/widgets/app_snackbar.dart';
import '../../../../shared/widgets/app_text_field.dart';
import '../../data/repositories/user_repository_impl.dart';
import '../../domain/usecases/user_use_cases.dart';
import '../controllers/user_controller.dart';

/// UserListScreen: ব্যবহারকারী ব্যবস্থাপনা ও ভূমিকা অর্পণ স্ক্রিন
///
/// রুট: `RouteNames.orgUsers` (`/organization-security/users`)
///
/// **আর্কিটেকচারাল নীতি:**
/// ১. User Management ≠ Member Management
/// ২. User → Role → Permission
/// ৩. Multi-tenant Organization Isolation
/// ৪. Privilege Escalation Protection
class UserListScreen extends StatefulWidget {
  const UserListScreen({super.key});

  @override
  State<UserListScreen> createState() => _UserListScreenState();
}

class _UserListScreenState extends State<UserListScreen> {
  late final UserRepositoryImpl _repository;
  late final UserController _controller;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _repository = UserRepositoryImpl();
    _controller = UserController(
      getUsersUseCase: GetUsersUseCase(_repository),
      getUserByIdUseCase: GetUserByIdUseCase(_repository),
      createUserUseCase: CreateUserUseCase(_repository),
      updateUserUseCase: UpdateUserUseCase(_repository),
      changeUserStatusUseCase: ChangeUserStatusUseCase(_repository),
      assignUserRoleUseCase: AssignUserRoleUseCase(_repository),
      removeUserRoleUseCase: RemoveUserRoleUseCase(_repository),
    );

    _loadInitialData();

    // অর্গানাইজেশন পরিবর্তন লিসেনার
    OrganizationContext.instance.addListener(_onOrganizationChanged);
  }

  void _onOrganizationChanged() {
    if (mounted) {
      _controller.reset();
      _loadInitialData();
    }
  }

  void _loadInitialData() {
    final orgId = OrganizationContext.instance.currentOrganizationId;
    _controller.loadUsers(organizationId: orgId);
  }

  @override
  void dispose() {
    OrganizationContext.instance.removeListener(_onOrganizationChanged);
    _searchController.dispose();
    _controller.dispose();
    super.dispose();
  }

  String get _currentOrgId => OrganizationContext.instance.currentOrganizationId;
  String get _actorUserId => AuthorizationService.instance.currentUserId ?? 'current_user';
  String get _actorName => AuthorizationService.instance.currentUserName ?? 'দায়িত্বপ্রাপ্ত কর্মকর্তা';

  @override
  Widget build(BuildContext context) {
    return RoutePermissionGuard(
      requiredPermission: PermissionKeys.userView,
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, _) {
              final state = _controller.usersState;

              if (state is UiLoading) {
                return const AppLoading(message: 'ব্যবহারকারী তালিকা লোড হচ্ছে...');
              }

              if (state is UiError) {
                return AppError(
                  message: state.userMessage,
                  onRetry: _loadInitialData,
                );
              }

              final isDesktop = MediaQuery.of(context).size.width >= 1024;
              final isTablet = MediaQuery.of(context).size.width >= 768 && MediaQuery.of(context).size.width < 1024;

              return SingleChildScrollView(
                padding: const EdgeInsets.all(AppSpacing.xl),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ব্রেডক্রাম্বস
                    AppBreadcrumbs(
                      items: [
                        BreadcrumbItem(title: 'ড্যাশবোর্ড', route: RouteNames.dashboard),
                        BreadcrumbItem(title: 'সংগঠন ও নিরাপত্তা', route: RouteNames.orgSecurity),
                        const BreadcrumbItem(title: 'ব্যবহারকারী ব্যবস্থাপনা', route: RouteNames.orgUsers, isCurrent: true),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),

                    // সেকশন হেডার
                    AppSectionHeader(
                      title: 'ব্যবহারকারী ও ভূমিকা ব্যবস্থাপনা (User Accounts & Roles)',
                      subtitle: 'সফটওয়্যার লগইন অ্যাকাউন্ট, লাইফসাইকেল ও দায়িত্বভিত্তিক ভূমিকা অর্পণ',
                      trailing: PermissionGuard(
                        permission: PermissionKeys.userManage,
                        child: AppButton(
                          text: 'নতুন ব্যবহারকারী',
                          icon: Icons.person_add_outlined,
                          onPressed: () => _showCreateUserDialog(context),
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.lg),

                    // সার্চ ও ফিল্টার বার
                    _buildSearchAndFilterBar(context),
                    const SizedBox(height: AppSpacing.lg),

                    // মূল লেআউট: ডেক্সটপে স্প্লিট/মাস্টার-ডিটেইল, মোবাইলে অ্যাডাপ্টিভ
                    if (isDesktop)
                      _buildDesktopLayout(context)
                    else if (isTablet)
                      _buildTabletLayout(context)
                    else
                      _buildMobileLayout(context),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  // --- সার্চ ও ফিল্টার বার ---
  Widget _buildSearchAndFilterBar(BuildContext context) {
    final availableRoles = PermissionCatalog.createDefaultSystemRoles(_currentOrgId);

    return AppCard(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Wrap(
          spacing: AppSpacing.md,
          runSpacing: AppSpacing.md,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            // সার্চ ইনপুট
            SizedBox(
              width: 280,
              child: AppSearchField(
                controller: _searchController,
                hintText: 'নাম, ইউজার কোড, মোবাইল...',
                onChanged: (val) {
                  _controller.setSearchQuery(val, organizationId: _currentOrgId);
                },
                onClear: () {
                  _searchController.clear();
                  _controller.setSearchQuery('', organizationId: _currentOrgId);
                },
              ),
            ),

            // স্ট্যাটাস ফিল্টার
            SizedBox(
              width: 160,
              child: AppDropdown<UserStatus?>(
                value: _controller.selectedStatusFilter,
                hint: 'সকল স্ট্যাটাস',
                items: [
                  const AppDropdownItem<UserStatus?>(
                    value: null,
                    label: 'সকল স্ট্যাটাস',
                  ),
                  for (final status in UserStatus.values)
                    AppDropdownItem<UserStatus?>(
                      value: status,
                      label: status.banglaName,
                    ),
                ],
                onChanged: (val) {
                  _controller.setStatusFilter(val, organizationId: _currentOrgId);
                },
              ),
            ),

            // রোল ফিল্টার
            SizedBox(
              width: 180,
              child: AppDropdown<String?>(
                value: _controller.selectedRoleFilter,
                hint: 'সকল ভূমিকা',
                items: [
                  const AppDropdownItem<String?>(
                    value: null,
                    label: 'সকল ভূমিকা',
                  ),
                  for (final role in availableRoles)
                    AppDropdownItem<String?>(
                      value: role.key,
                      label: role.name,
                    ),
                ],
                onChanged: (val) {
                  _controller.setRoleFilter(val, organizationId: _currentOrgId);
                },
              ),
            ),

            // রিসেট বাটন
            if (_searchController.text.isNotEmpty ||
                _controller.selectedStatusFilter != null ||
                _controller.selectedRoleFilter != null)
              AppButton(
                text: 'ফিল্টার মুছুন',
                variant: AppButtonVariant.ghost,
                icon: Icons.clear_all,
                onPressed: () {
                  _searchController.clear();
                  _controller.setSearchQuery('', organizationId: _currentOrgId);
                  _controller.setStatusFilter(null, organizationId: _currentOrgId);
                  _controller.setRoleFilter(null, organizationId: _currentOrgId);
                },
              ),
          ],
        ),
      ),
    );
  }

  // --- ডেক্সটপ স্প্লিট লেআউট ---
  Widget _buildDesktopLayout(BuildContext context) {
    final users = _controller.allUsers;

    if (users.isEmpty) {
      return const AppEmptyState(
        title: 'কোনো ব্যবহারকারী পাওয়া যায়নি',
        description: 'সার্চ ফিল্টার পরিবর্তন করুন অথবা নতুন ব্যবহারকারী অ্যাকাউন্ট তৈরি করুন।',
      );
    }

    final selected = _controller.selectedUser ?? users.first;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // বাম কলাম: ব্যবহারকারী তালিকা
        Expanded(
          flex: 6,
          child: AppCard(
            title: 'ব্যবহারকারী তালিকা (${users.length} জন)',
            child: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: users.length,
              separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.borderLight),
              itemBuilder: (context, index) {
                final user = users[index];
                final isSelected = selected.id == user.id;

                return ListTile(
                  selected: isSelected,
                  selectedTileColor: AppColors.primaryContainer.withOpacity(0.35),
                  contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 6),
                  leading: CircleAvatar(
                    backgroundColor: _getStatusColor(user.status).withOpacity(0.15),
                    child: Text(
                      user.fullName.isNotEmpty ? user.fullName[0] : 'U',
                      style: TextStyle(
                        color: _getStatusColor(user.status),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  title: Row(
                    children: [
                      Text(
                        user.fullName,
                        style: AppTypography.body(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceVariant,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          user.userCode,
                          style: AppTypography.caption(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Text(
                        '${user.mobile} • ${user.email}',
                        style: AppTypography.caption(color: AppColors.textSecondary),
                      ),
                      const SizedBox(height: 6),
                      Wrap(
                        spacing: 4,
                        runSpacing: 4,
                        children: [
                          for (final role in user.roles)
                            AppBadge(
                              label: role.name,
                              variant: role.isSystemRole ? AppBadgeVariant.primary : AppBadgeVariant.secondary,
                            ),
                        ],
                      ),
                    ],
                  ),
                  trailing: AppBadge(
                    label: user.status.banglaName,
                    variant: _getStatusBadgeVariant(user.status),
                  ),
                  onTap: () => _controller.selectUser(user),
                );
              },
            ),
          ),
        ),
        const SizedBox(width: AppSpacing.lg),

        // ডান কলাম: নির্বাচিত ব্যবহারকারীর বিস্তারিত ও ভূমিকা ব্যবস্থাপনা
        Expanded(
          flex: 6,
          child: _buildUserDetailPanel(context, selected),
        ),
      ],
    );
  }

  // --- ট্যাবলেট লেআউট ---
  Widget _buildTabletLayout(BuildContext context) {
    return _buildDesktopLayout(context);
  }

  // --- মোবাইল লেআউট ---
  Widget _buildMobileLayout(BuildContext context) {
    final users = _controller.allUsers;

    if (users.isEmpty) {
      return const AppEmptyState(
        title: 'কোনো ব্যবহারকারী পাওয়া যায়নি',
        description: 'সার্চ ফিল্টার পরিবর্তন করুন অথবা নতুন ব্যবহারকারী যোগ করুন।',
      );
    }

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: users.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, index) {
        final user = users[index];
        return AppCard(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user.fullName,
                            style: AppTypography.h4(),
                          ),
                          Text(
                            user.userCode,
                            style: AppTypography.caption(color: AppColors.primary, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    AppBadge(
                      label: user.status.banglaName,
                      variant: _getStatusBadgeVariant(user.status),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                Text('মোবাইল: ${user.mobile}', style: AppTypography.bodySmall()),
                Text('ইমেইল: ${user.email}', style: AppTypography.bodySmall()),
                const SizedBox(height: AppSpacing.sm),
                Wrap(
                  spacing: 4,
                  children: [
                    for (final role in user.roles)
                      AppBadge(label: role.name, variant: AppBadgeVariant.primary),
                  ],
                ),
                const Divider(height: AppSpacing.lg),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    AppButton(
                      text: 'বিস্তারিত ও ভূমিকা',
                      size: AppButtonSize.small,
                      variant: AppButtonVariant.outline,
                      onPressed: () {
                        _showUserDetailBottomSheet(context, user);
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // --- ব্যবহারকারীর বিস্তারিত ও ভূমিকা ব্যবস্থাপনা প্যানেল ---
  Widget _buildUserDetailPanel(BuildContext context, ManagedUser user) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // মৌলিক তথ্য কার্ড
        AppCard(
          title: 'ব্যবহারকারী পরিচিতি',
          subtitle: 'অ্যাকাউন্ট আইডেন্টিটি ও স্থিতি',
          trailing: PermissionGuard(
            permission: PermissionKeys.userManage,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AppButton(
                  text: 'সম্পাদনা',
                  size: AppButtonSize.small,
                  variant: AppButtonVariant.outline,
                  icon: Icons.edit_outlined,
                  onPressed: () => _showEditUserDialog(context, user),
                ),
                const SizedBox(width: 8),
                AppButton(
                  text: 'স্ট্যাটাস',
                  size: AppButtonSize.small,
                  variant: AppButtonVariant.ghost,
                  icon: Icons.swap_horiz,
                  onPressed: () => _showChangeStatusDialog(context, user),
                ),
              ],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow('ইউজার কোড (User Code)', user.userCode, isHighlight: true),
                const SizedBox(height: 10),
                _buildInfoRow('পূর্ণ নাম', user.fullName),
                const SizedBox(height: 10),
                _buildInfoRow('মোবাইল নম্বর', user.mobile),
                const SizedBox(height: 10),
                _buildInfoRow('ইমেইল ঠিকানা', user.email),
                const SizedBox(height: 10),
                _buildInfoRow('অ্যাকাউন্ট স্ট্যাটাস', user.status.banglaName, badgeVariant: _getStatusBadgeVariant(user.status)),
              ],
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.lg),

        // অর্পিত ভূমিকার তালিকা কার্ড
        AppCard(
          title: 'অর্পিত ভূমিকা (Assigned Roles)',
          subtitle: 'User → Role(s) → Permissions আর্কিটেকচার',
          trailing: PermissionGuard(
            permission: PermissionKeys.roleManage,
            child: AppButton(
              text: 'ভূমিকা যোগ করুন',
              size: AppButtonSize.small,
              icon: Icons.add_moderator_outlined,
              onPressed: () => _showAssignRoleDialog(context, user),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: user.roles.isEmpty
                ? const Text('কোনো ভূমিকা অর্পিত নেই।')
                : Column(
                    children: [
                      for (final role in user.roles)
                        Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.borderLight),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                role.isSystemRole ? Icons.shield_outlined : Icons.badge_outlined,
                                color: AppColors.primary,
                                size: 20,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          role.name,
                                          style: AppTypography.body(fontWeight: FontWeight.w600),
                                        ),
                                        const SizedBox(width: 6),
                                        if (role.isSystemRole)
                                          const AppBadge(
                                            label: 'System',
                                            variant: AppBadgeVariant.neutral,
                                          ),
                                      ],
                                    ),
                                    Text(
                                      'Key: ${role.key} • (${role.permissionKeys.length}টি অনুমতি)',
                                      style: AppTypography.caption(color: AppColors.textSecondary),
                                    ),
                                  ],
                                ),
                              ),
                              // ভূমিকা প্রত্যাহার বাটন
                              PermissionGuard(
                                permission: PermissionKeys.roleManage,
                                child: IconButton(
                                  icon: const Icon(Icons.remove_circle_outline, color: AppColors.error, size: 20),
                                  tooltip: 'ভূমিকা প্রত্যাহার করুন',
                                  onPressed: () => _confirmRemoveRole(context, user, role),
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
          ),
        ),
        const SizedBox(height: AppSpacing.lg),

        // অডিট তথ্য কার্ড
        AppCard(
          title: 'অডিট তথ্য (Audit Metadata)',
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow('তৈরির সময়', _formatDate(user.createdAt)),
                const SizedBox(height: 8),
                _buildInfoRow('প্রস্তুতকারী (Created By)', user.createdBy ?? 'অজানা'),
                const SizedBox(height: 8),
                _buildInfoRow('সর্বশেষ হালনাগাদ', _formatDate(user.updatedAt)),
                const SizedBox(height: 8),
                _buildInfoRow('হালনাগাদকারী (Updated By)', user.updatedBy ?? 'অজানা'),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // --- মোবাইল বটম শীট ---
  void _showUserDetailBottomSheet(BuildContext context, ManagedUser user) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) {
        return DraggableScrollableSheet(
          expand: false,
          initialChildSize: 0.85,
          maxChildSize: 0.95,
          minChildSize: 0.5,
          builder: (_, scrollController) {
            return SingleChildScrollView(
              controller: scrollController,
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: _buildUserDetailPanel(context, user),
            );
          },
        );
      },
    );
  }

  // --- ডায়ালগ: নতুন ব্যবহারকারী তৈরি ---
  void _showCreateUserDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final mobileCtrl = TextEditingController();
    final emailCtrl = TextEditingController();
    final selectedRoleKeys = <String>[SystemRoleKey.member];
    final availableRoles = PermissionCatalog.createDefaultSystemRoles(_currentOrgId);

    showDialog(
      context: context,
      builder: (dialogCtx) {
        return StatefulBuilder(
          builder: (ctx, setDialogState) {
            return AppDialog(
              title: 'নতুন ব্যবহারকারী তৈরি',
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AppTextField(
                      controller: nameCtrl,
                      label: 'পূর্ণ নাম',
                      hintText: 'যেমন: মাওলানা আব্দুল্লাহ',
                      isRequired: true,
                    ),
                    const SizedBox(height: AppSpacing.md),
                    AppTextField(
                      controller: mobileCtrl,
                      label: 'মোবাইল নম্বর',
                      hintText: '017XXXXXXXX',
                      keyboardType: TextInputType.phone,
                      isRequired: true,
                    ),
                    const SizedBox(height: AppSpacing.md),
                    AppTextField(
                      controller: emailCtrl,
                      label: 'ইমেইল ঠিকানা',
                      hintText: 'user@example.com',
                      keyboardType: TextInputType.emailAddress,
                      isRequired: true,
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Text(
                      'প্রাথমিক ভূমিকা (Initial Roles):',
                      style: AppTypography.bodySmall(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: [
                        for (final role in availableRoles)
                          FilterChip(
                            label: Text(role.name),
                            selected: selectedRoleKeys.contains(role.key),
                            onSelected: (selected) {
                              setDialogState(() {
                                if (selected) {
                                  selectedRoleKeys.add(role.key);
                                } else {
                                  if (selectedRoleKeys.length > 1) {
                                    selectedRoleKeys.remove(role.key);
                                  }
                                }
                              });
                            },
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              actions: [
                AppButton(
                  text: 'বাতিল',
                  variant: AppButtonVariant.ghost,
                  onPressed: () => Navigator.of(dialogCtx).pop(),
                ),
                AppButton(
                  text: 'অ্যাকাউন্ট তৈরি করুন',
                  isLoading: _controller.isActionLoading,
                  onPressed: () async {
                    final success = await _controller.createUser(
                      organizationId: _currentOrgId,
                      fullName: nameCtrl.text,
                      mobile: mobileCtrl.text,
                      email: emailCtrl.text,
                      initialRoleKeys: selectedRoleKeys,
                      actorUserId: _actorUserId,
                      actorName: _actorName,
                    );
                    if (success && mounted) {
                      Navigator.of(dialogCtx).pop();
                      AppSnackbar.success(context, message: _controller.successMessage ?? 'ব্যবহারকারী সফলভাবে তৈরি হয়েছে।');
                    } else if (mounted && _controller.errorMessage != null) {
                      AppSnackbar.error(context, message: _controller.errorMessage!);
                    }
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  // --- ডায়ালগ: তথ্য সম্পাদনা ---
  void _showEditUserDialog(BuildContext context, ManagedUser user) {
    final nameCtrl = TextEditingController(text: user.fullName);
    final mobileCtrl = TextEditingController(text: user.mobile);
    final emailCtrl = TextEditingController(text: user.email);

    showDialog(
      context: context,
      builder: (dialogCtx) {
        return AppDialog(
          title: 'ব্যবহারকারীর তথ্য সম্পাদনা',
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow('ইউজার কোড (অপরিবর্তনীয়)', user.userCode, isHighlight: true),
                const SizedBox(height: AppSpacing.md),
                AppTextField(
                  controller: nameCtrl,
                  label: 'পূর্ণ নাম',
                  isRequired: true,
                ),
                const SizedBox(height: AppSpacing.md),
                AppTextField(
                  controller: mobileCtrl,
                  label: 'মোবাইল নম্বর',
                  keyboardType: TextInputType.phone,
                  isRequired: true,
                ),
                const SizedBox(height: AppSpacing.md),
                AppTextField(
                  controller: emailCtrl,
                  label: 'ইমেইল ঠিকানা',
                  keyboardType: TextInputType.emailAddress,
                  isRequired: true,
                ),
              ],
            ),
          ),
          actions: [
            AppButton(
              text: 'বাতিল',
              variant: AppButtonVariant.ghost,
              onPressed: () => Navigator.of(dialogCtx).pop(),
            ),
            AppButton(
              text: 'সংরক্ষণ করুন',
              onPressed: () async {
                final success = await _controller.updateUser(
                  organizationId: _currentOrgId,
                  userId: user.id,
                  fullName: nameCtrl.text,
                  mobile: mobileCtrl.text,
                  email: emailCtrl.text,
                  actorUserId: _actorUserId,
                  actorName: _actorName,
                );
                if (success && mounted) {
                  Navigator.of(dialogCtx).pop();
                  AppSnackbar.success(context, message: 'তথ্য সফলভাবে হালনাগাদ করা হয়েছে।');
                } else if (mounted && _controller.errorMessage != null) {
                  AppSnackbar.error(context, message: _controller.errorMessage!);
                }
              },
            ),
          ],
        );
      },
    );
  }

  // --- ডায়ালগ: স্ট্যাটাস পরিবর্তন ---
  void _showChangeStatusDialog(BuildContext context, ManagedUser user) {
    UserStatus targetStatus = user.status;
    final reasonCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (dialogCtx) {
        return StatefulBuilder(
          builder: (ctx, setDialogState) {
            return AppDialog(
              title: 'অ্যাকাউন্ট স্ট্যাটাস পরিবর্তন',
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'বর্তমান স্ট্যাটাস: ${user.status.banglaName}',
                    style: AppTypography.body(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text('নতুন স্ট্যাটাস নির্বাচন করুন:', style: AppTypography.bodySmall()),
                  const SizedBox(height: 6),
                  AppDropdown<UserStatus>(
                    value: targetStatus,
                    items: [
                      for (final st in UserStatus.values)
                        AppDropdownItem(value: st, label: st.banglaName),
                    ],
                    onChanged: (val) {
                      if (val != null) {
                        setDialogState(() => targetStatus = val);
                      }
                    },
                  ),
                  const SizedBox(height: AppSpacing.md),
                  AppTextField(
                    controller: reasonCtrl,
                    label: 'পরিবর্তনের কারণ (বাধ্যতামূলক)',
                    hintText: 'যেমন: প্রশাসনিক সিদ্ধান্ত / সাময়িক ছুটি',
                    isRequired: true,
                  ),
                ],
              ),
              actions: [
                AppButton(
                  text: 'বাতিল',
                  variant: AppButtonVariant.ghost,
                  onPressed: () => Navigator.of(dialogCtx).pop(),
                ),
                AppButton(
                  text: 'স্ট্যাটাস প্রয়োগ করুন',
                  variant: targetStatus == UserStatus.suspended || targetStatus == UserStatus.archived
                      ? AppButtonVariant.danger
                      : AppButtonVariant.primary,
                  onPressed: () async {
                    if (reasonCtrl.text.trim().isEmpty) {
                      AppSnackbar.error(context, message: 'স্ট্যাটাস পরিবর্তনের কারণ উল্লেখ করা বাধ্যতামূলক।');
                      return;
                    }
                    final success = await _controller.changeStatus(
                      organizationId: _currentOrgId,
                      userId: user.id,
                      newStatus: targetStatus,
                      actorUserId: _actorUserId,
                      actorName: _actorName,
                      reason: reasonCtrl.text.trim(),
                    );
                    if (success && mounted) {
                      Navigator.of(dialogCtx).pop();
                      AppSnackbar.success(context, message: _controller.successMessage ?? 'স্ট্যাটাস হালনাগাদ হয়েছে।');
                    } else if (mounted && _controller.errorMessage != null) {
                      AppSnackbar.error(context, message: _controller.errorMessage!);
                    }
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  // --- ডায়ালগ: ভূমিকা অর্পণ (Assign Role) ---
  void _showAssignRoleDialog(BuildContext context, ManagedUser user) {
    final availableRoles = PermissionCatalog.createDefaultSystemRoles(_currentOrgId);
    final assignableRoles = availableRoles.where((r) => !user.roles.any((ur) => ur.key == r.key)).toList();

    if (assignableRoles.isEmpty) {
      AppSnackbar.info(context, message: 'এই ব্যবহারকারীর নিকট সকল সম্ভাব্য ভূমিকা ইতোমধ্যেই অর্পিত রয়েছে।');
      return;
    }

    String selectedRoleKey = assignableRoles.first.key;
    final reasonCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (dialogCtx) {
        return StatefulBuilder(
          builder: (ctx, setDialogState) {
            return AppDialog(
              title: 'নতুন ভূমিকা অর্পণ করুন',
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('ব্যবহারকারী: ${user.fullName} (${user.userCode})', style: AppTypography.body(fontWeight: FontWeight.bold)),
                  const SizedBox(height: AppSpacing.md),
                  Text('ভূমিকা নির্বাচন করুন:', style: AppTypography.bodySmall()),
                  const SizedBox(height: 6),
                  AppDropdown<String>(
                    value: selectedRoleKey,
                    items: [
                      for (final role in assignableRoles)
                        AppDropdownItem(value: role.key, label: '${role.name} (${role.key})'),
                    ],
                    onChanged: (val) {
                      if (val != null) {
                        setDialogState(() => selectedRoleKey = val);
                      }
                    },
                  ),
                  const SizedBox(height: AppSpacing.md),
                  AppTextField(
                    controller: reasonCtrl,
                    label: 'অর্পণের কারণ / রেফারেন্স',
                    hintText: 'যেমন: কার্যনির্বাহী কমিটির প্রস্তাবনা নং ০৩',
                  ),
                ],
              ),
              actions: [
                AppButton(
                  text: 'বাতিল',
                  variant: AppButtonVariant.ghost,
                  onPressed: () => Navigator.of(dialogCtx).pop(),
                ),
                AppButton(
                  text: 'ভূমিকা অর্পণ করুন',
                  onPressed: () async {
                    final success = await _controller.assignRole(
                      organizationId: _currentOrgId,
                      userId: user.id,
                      roleKey: selectedRoleKey,
                      actorUserId: _actorUserId,
                      actorName: _actorName,
                      reason: reasonCtrl.text.trim(),
                    );
                    if (success && mounted) {
                      Navigator.of(dialogCtx).pop();
                      AppSnackbar.success(context, message: 'ভূমিকা সফলভাবে অর্পণ করা হয়েছে।');
                    } else if (mounted && _controller.errorMessage != null) {
                      AppSnackbar.error(context, message: _controller.errorMessage!);
                    }
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  // --- কনফার্মেশন: ভূমিকা প্রত্যাহার ---
  void _confirmRemoveRole(BuildContext context, ManagedUser user, Role role) {
    AppConfirmAction.show(
      context: context,
      title: 'ভূমিকা প্রত্যাহার নিশ্চিতকরণ',
      message: 'আপনি কি নিশ্চিত যে "${user.fullName}"-এর থেকে "${role.name}" ভূমিকাটি প্রত্যাহার করতে চান?',
      confirmText: 'হ্যাঁ, প্রত্যাহার করুন',
      cancelText: 'বাতিল',
      isDestructive: true,
      onConfirm: () async {
        final success = await _controller.removeRole(
          organizationId: _currentOrgId,
          userId: user.id,
          roleKey: role.key,
          actorUserId: _actorUserId,
          actorName: _actorName,
          reason: 'প্রশাসনিক ভূমিকা প্রত্যাহার',
        );
        if (success && mounted) {
          AppSnackbar.success(context, message: 'ভূমিকা সফলভাবে প্রত্যাহার করা হয়েছে।');
        } else if (mounted && _controller.errorMessage != null) {
          AppSnackbar.error(context, message: _controller.errorMessage!);
        }
      },
    );
  }

  // --- হেল্পার উইজেট ও ফরম্যাটার ---
  Widget _buildInfoRow(String label, String value, {bool isHighlight = false, AppBadgeVariant? badgeVariant}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 170,
          child: Text(
            label,
            style: AppTypography.caption(color: AppColors.textSecondary, fontWeight: FontWeight.w600),
          ),
        ),
        Expanded(
          child: badgeVariant != null
              ? Align(
                  alignment: Alignment.centerLeft,
                  child: AppBadge(label: value, variant: badgeVariant),
                )
              : Text(
                  value,
                  style: isHighlight
                      ? AppTypography.body(fontWeight: FontWeight.bold, color: AppColors.primary)
                      : AppTypography.body(fontWeight: FontWeight.w500),
                ),
        ),
      ],
    );
  }

  AppBadgeVariant _getStatusBadgeVariant(UserStatus status) {
    switch (status) {
      case UserStatus.active:
        return AppBadgeVariant.success;
      case UserStatus.inactive:
        return AppBadgeVariant.neutral;
      case UserStatus.suspended:
        return AppBadgeVariant.warning;
      case UserStatus.archived:
        return AppBadgeVariant.danger;
    }
  }

  Color _getStatusColor(UserStatus status) {
    switch (status) {
      case UserStatus.active:
        return AppColors.success;
      case UserStatus.inactive:
        return AppColors.textSecondary;
      case UserStatus.suspended:
        return AppColors.warning;
      case UserStatus.archived:
        return AppColors.error;
    }
  }

  String _formatDate(DateTime dt) {
    return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }
}
