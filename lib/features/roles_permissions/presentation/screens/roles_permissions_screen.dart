import 'package:flutter/material.dart';
import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/authorization/authorization_service.dart';
import '../../../../core/authorization/permission_catalog.dart';
import '../../../../core/authorization/permission_guard.dart';
import '../../../../core/authorization/permission_keys.dart';
import '../../../../core/state/ui_state.dart';
import '../../../../domain/entities/permission.dart';
import '../../../../domain/entities/role.dart';
import '../../../../shared/widgets/app_badge.dart';
import '../../../../shared/widgets/app_breadcrumbs.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/app_empty_state.dart';
import '../../../../shared/widgets/app_error.dart';
import '../../../../shared/widgets/app_loading.dart';
import '../../../../shared/widgets/app_section_header.dart';
import '../../../../shared/widgets/app_snackbar.dart';
import '../../data/repositories/role_permission_repository_impl.dart';
import '../controllers/roles_permissions_controller.dart';

/// RolesPermissionsScreen: ভূমিকা ও পারমিশন ব্যবস্থাপনা স্ক্রিন
///
/// রুট: `RouteNames.orgRoles` (`/organization-security/roles`)
/// অর্গানাইজেশনের ভূমিকা তালিকা, পারমিশন ম্যাট্রিক্স এবং আর্থিক নীতিসমূহ প্রদর্শন করে।
class RolesPermissionsScreen extends StatefulWidget {
  const RolesPermissionsScreen({super.key});

  @override
  State<RolesPermissionsScreen> createState() => _RolesPermissionsScreenState();
}

class _RolesPermissionsScreenState extends State<RolesPermissionsScreen> {
  late final RolesPermissionsController _controller;

  @override
  void initState() {
    super.initState();
    _controller = RolesPermissionsController(
      repository: RolePermissionRepositoryImpl(),
    );
    _controller.loadRolesAndPermissions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, _) {
            final state = _controller.state;

            if (state is UiLoading) {
              return const AppLoading(message: 'ভূমিকা ও অনুমতি লোড হচ্ছে...');
            }

            if (state is UiError) {
              return AppError(
                message: state.userMessage,
                onRetry: _controller.loadRolesAndPermissions,
              );
            }

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
                      const BreadcrumbItem(title: 'ভূমিকা ও অনুমতি', route: RouteNames.orgRoles, isCurrent: true),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.md),

                  // সেকশন হেডার
                  AppSectionHeader(
                    title: 'ভূমিকা ও অনুমতি ব্যবস্থাপনা (Roles & Permissions)',
                    subtitle: 'প্রতিষ্ঠানভিত্তিক দায়িত্ব বণ্টন, পারমিশন ম্যাট্রিক্স ও আর্থিক নীতিসমূহ',
                    trailing: PermissionGuard(
                      permission: PermissionKeys.roleManage,
                      child: AppButton(
                        text: 'অনুমতি রিফ্রেশ',
                        icon: Icons.refresh,
                        variant: AppButtonVariant.outline,
                        onPressed: () => _controller.loadRolesAndPermissions(),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // আর্থিক দায়িত্ব বণ্টন নীতি সতর্কবার্তা (Segregation of Duties Banner)
                  _buildFinancialSegregationBanner(),
                  const SizedBox(height: AppSpacing.xl),

                  // মূল লেআউট: বামে রোল তালিকা, ডানে পারমিশন ম্যাট্রিক্স
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final isDesktop = constraints.maxWidth >= 900;
                      if (isDesktop) {
                        return Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // বামের কলাম: রোল নির্বাচন
                            SizedBox(
                              width: 320,
                              child: _buildRolesListCard(),
                            ),
                            const SizedBox(width: AppSpacing.xl),
                            // ডানের কলাম: পারমিশন ম্যাট্রিক্স
                            Expanded(
                              child: _buildPermissionsMatrixCard(),
                            ),
                          ],
                        );
                      } else {
                        return Column(
                          children: [
                            _buildRolesListCard(),
                            const SizedBox(height: AppSpacing.xl),
                            _buildPermissionsMatrixCard(),
                          ],
                        );
                      }
                    },
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  /// আর্থিক দায়িত্ব বণ্টন ও স্বীয় অনুমোদন নীতি ব্যানার
  Widget _buildFinancialSegregationBanner() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFBBF7D0)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.xs),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.verified_user_outlined, color: AppColors.primary, size: 22),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'আর্থিক নিরাপত্তা ও দায়িত্ব পৃথকীকরণ নীতি (Segregation of Duties)',
                  style: TextStyle(
                    fontFamily: AppTypography.fontHeading,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF166534),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '১. তৈরি (Create) ≠ অনুমোদন (Approve) ≠ রিভার্স (Reverse)।\n'
                  '২. স্বীয় অনুমোদন সম্পূর্ণ নিষিদ্ধ: লেনদেন তৈরিকারী কর্মকর্তা নিজের ভাউচার নিজে অনুমোদন করতে পারবেন না।\n'
                  '৩. রিভার্সাল ≠ ডিলিট: অডিট ট্রেইলের স্বচ্ছতার জন্য কোনো আর্থিক লেনদেন স্থায়ীভাবে মুছে ফেলা যায় না।',
                  style: TextStyle(
                    fontFamily: AppTypography.fontBody,
                    fontSize: 13,
                    color: const Color(0xFF14532D),
                    height: 1.45,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// বাম কলাম: রোলের তালিকা
  Widget _buildRolesListCard() {
    return AppCard(
      title: 'সিস্টেম ও কাস্টম ভূমিকা (${_controller.roles.length})',
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _controller.roles.length,
        separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.border),
        itemBuilder: (context, index) {
          final role = _controller.roles[index];
          final isSelected = _controller.selectedRole?.id == role.id;

          return InkWell(
            onTap: () => _controller.selectRole(role),
            borderRadius: BorderRadius.circular(8),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm + 2),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary.withOpacity(0.06) : Colors.transparent,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: isSelected ? AppColors.primary.withOpacity(0.4) : Colors.transparent,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              role.name,
                              style: TextStyle(
                                fontFamily: AppTypography.fontHeading,
                                fontSize: 14,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                                color: isSelected ? AppColors.primary : AppColors.textPrimary,
                              ),
                            ),
                            const SizedBox(width: AppSpacing.xs),
                            if (role.isSystemRole)
                              const AppBadge(text: 'সিস্টেম', variant: AppBadgeVariant.neutral),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          role.description,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontFamily: AppTypography.fontBody,
                            fontSize: 11,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Text(
                      '${role.permissionKeys.length}',
                      style: const TextStyle(
                        fontFamily: AppTypography.fontMono,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  /// ডান কলাম: পারমিশন ম্যাট্রিক্স কার্ড
  Widget _buildPermissionsMatrixCard() {
    final selectedRole = _controller.selectedRole;
    if (selectedRole == null) {
      return const AppEmptyState(
        title: 'কোনো ভূমিকা নির্বাচিত নেই',
        message: 'বাম পাশের তালিকা থেকে একটি ভূমিকা নির্বাচন করুন।',
      );
    }

    final categories = ['সকল', ...PermissionCatalog.categories];
    final perms = _controller.filteredPermissions;

    return AppCard(
      title: '${selectedRole.name} — অনুমতি ম্যাট্রিক্স',
      subtitle: selectedRole.description,
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.primary.withOpacity(0.3)),
        ),
        child: Text(
          'বরাদ্দকৃত অনুমতি: ${selectedRole.permissionKeys.length} / ${_controller.allPermissions.length}',
          style: const TextStyle(
            fontFamily: AppTypography.fontBody,
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: AppColors.primary,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ক্যাটাগরি ফিল্টার চিপস
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: categories.map((cat) {
                final isSelected = _controller.selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: AppSpacing.xs),
                  child: FilterChip(
                    label: Text(
                      cat,
                      style: TextStyle(
                        fontFamily: AppTypography.fontBody,
                        fontSize: 12,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        color: isSelected ? Colors.white : AppColors.textPrimary,
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: AppColors.primary,
                    backgroundColor: AppColors.surface,
                    checkmarkColor: Colors.white,
                    onSelected: (_) => _controller.setCategory(cat),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          const Divider(height: 1, color: AppColors.border),
          const SizedBox(height: AppSpacing.md),

          // পারমিশন তালিকা
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: perms.length,
            separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.border),
            itemBuilder: (context, index) {
              final perm = perms[index];
              final isAssigned = selectedRole.hasPermission(perm.key);

              return CheckboxListTile(
                value: isAssigned,
                activeColor: AppColors.primary,
                contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 2),
                title: Row(
                  children: [
                    Text(
                      perm.name,
                      style: const TextStyle(
                        fontFamily: AppTypography.fontHeading,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.xs),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Text(
                        perm.action.banglaName,
                        style: const TextStyle(
                          fontFamily: AppTypography.fontBody,
                          fontSize: 11,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 2),
                    Text(
                      perm.description,
                      style: TextStyle(
                        fontFamily: AppTypography.fontBody,
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      perm.key,
                      style: const TextStyle(
                        fontFamily: AppTypography.fontMono,
                        fontSize: 11,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                  ],
                ),
                onChanged: (bool? newValue) async {
                  final success = await _controller.togglePermissionForSelectedRole(
                    perm.key,
                    'current_admin_user',
                  );
                  if (mounted) {
                    if (success) {
                      AppSnackbar.show(
                        context,
                        message: 'অনুমতি সফলভাবে হালনাগাদ করা হয়েছে।',
                        type: AppSnackbarType.success,
                      );
                    } else {
                      AppSnackbar.show(
                        context,
                        message: 'অনুমতি পরিবর্তন ব্যর্থ হয়েছে।',
                        type: AppSnackbarType.error,
                      );
                    }
                  }
                },
              );
            },
          ),
        ],
      ),
    );
  }
}
