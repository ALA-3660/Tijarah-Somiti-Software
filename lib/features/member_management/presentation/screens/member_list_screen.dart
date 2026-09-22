import 'package:flutter/material.dart';
import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/authorization/authorization_service.dart';
import '../../../../core/authorization/permission_guard.dart';
import '../../../../core/authorization/permission_keys.dart';
import '../../../../core/authorization/route_permission_guard.dart';
import '../../../../core/state/ui_state.dart';
import '../../../../features/organization/domain/services/organization_context.dart';
import '../../../../shared/widgets/app_badge.dart';
import '../../../../shared/widgets/app_breadcrumbs.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/app_dropdown.dart';
import '../../../../shared/widgets/app_empty_state.dart';
import '../../../../shared/widgets/app_error.dart';
import '../../../../shared/widgets/app_loading.dart';
import '../../../../shared/widgets/app_search_field.dart';
import '../../../../shared/widgets/app_snackbar.dart';
import '../../domain/entities/member.dart';
import '../../domain/entities/member_status.dart';
import '../controllers/member_controller.dart';
import '../widgets/create_member_dialog.dart';
import '../widgets/member_detail_panel.dart';

/// MemberListScreen: সদস্য ব্যবস্থাপনা ও তালিকা স্ক্রিন
///
/// **আর্কিটেকচার নীতি:**
/// ১. Member ≠ User আইসোলেশন
/// ২. RBAC Permission Guard (member.view, member.create, member.edit, member.status_change)
/// ৩. Multi-tenant Scoped Data
class MemberListScreen extends StatefulWidget {
  const MemberListScreen({super.key});

  @override
  State<MemberListScreen> createState() => _MemberListScreenState();
}

class _MemberListScreenState extends State<MemberListScreen> {
  late final MemberController _controller;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _controller = MemberController.instance;
    _controller.addListener(_onControllerUpdated);
    OrganizationContext.instance.addListener(_onOrganizationChanged);

    _loadData();
  }

  void _onControllerUpdated() {
    if (mounted) {
      if (_controller.errorMessage != null) {
        AppSnackbar.showError(context, _controller.errorMessage!);
        _controller.clearMessages();
      } else if (_controller.successMessage != null) {
        AppSnackbar.showSuccess(context, _controller.successMessage!);
        _controller.clearMessages();
      }
      setState(() {});
    }
  }

  void _onOrganizationChanged() {
    if (mounted) {
      _loadData();
    }
  }

  void _loadData() {
    final orgId = OrganizationContext.instance.currentOrganizationId;
    _controller.loadMembers(organizationId: orgId);
  }

  @override
  void dispose() {
    _controller.removeListener(_onControllerUpdated);
    OrganizationContext.instance.removeListener(_onOrganizationChanged);
    _searchController.dispose();
    super.dispose();
  }

  String get _currentOrgId => OrganizationContext.instance.currentOrganizationId;
  String get _actorUserId => AuthorizationService.instance.currentUserId ?? 'current_user';
  String get _actorName => AuthorizationService.instance.currentUserName ?? 'দায়িত্বপ্রাপ্ত কর্মকর্তা';

  @override
  Widget build(BuildContext context) {
    return RoutePermissionGuard(
      route: RouteNames.members,
      child: Scaffold(
        backgroundColor: AppColors.backgroundLight,
        body: SafeArea(
          child: Column(
            children: [
              // ব্রেডক্রাম্ব ও শীর্ষ বার
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  border: Border(bottom: BorderSide(color: AppColors.borderLight)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const AppBreadcrumbs(
                      items: [
                        BreadcrumbItem(label: 'ড্যাশবোর্ড', route: RouteNames.dashboard),
                        BreadcrumbItem(label: 'সদস্য ব্যবস্থাপনা', route: RouteNames.members),
                        BreadcrumbItem(label: 'সদস্য তালিকা'),
                      ],
                    ),
                    Text(
                      'প্রতিষ্ঠান: ${OrganizationContext.instance.currentOrganization?.name ?? "ডেমো সমবায়"}',
                      style: AppTypography.caption(color: AppColors.textSecondaryLight),
                    ),
                  ],
                ),
              ),

              // মূল কনটেন্ট এরিয়া
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // হেডার ও পরিসংখ্যান
                      _buildHeader(),
                      const SizedBox(height: 20),

                      // ফিল্টার ও অ্যাকশন বার
                      _buildFilterBar(),
                      const SizedBox(height: 20),

                      // মাস্টার-ডিটেইল ভিউ
                      _buildMainView(),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    final counts = _controller.statusCounts;
    final total = _controller.allMembers.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'সদস্য ব্যবস্থাপনা (Member Directory)',
                  style: AppTypography.heading2(
                    color: AppColors.textPrimaryLight,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'সমিতির সকল সদস্যের প্রাথমিক পরিচিতি, যোগাযোগ ও লাইফসাইকেল স্ট্যাটাস পরিচালনা',
                  style: AppTypography.body(color: AppColors.textSecondaryLight),
                ),
              ],
            ),
            PermissionGuard(
              permission: PermissionKeys.memberCreate,
              mode: PermissionGuardMode.hide,
              child: AppButton(
                text: 'নতুন সদস্য নিবন্ধন',
                icon: Icons.person_add_alt_1_rounded,
                variant: AppButtonVariant.primary,
                onPressed: () {
                  CreateMemberDialog.show(
                    context,
                    organizationId: _currentOrgId,
                    actorUserId: _actorUserId,
                    actorName: _actorName,
                    controller: _controller,
                  );
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // স্ট্যাটাস পরিসংখ্যান কার্ডস
        Row(
          children: [
            _buildStatChip('মোট সদস্য', '$total জন', AppColors.primary, AppColors.primaryContainer),
            const SizedBox(width: 12),
            _buildStatChip('সক্রিয়', '${counts[MemberStatus.active] ?? 0} জন', AppColors.success, AppColors.successContainer),
            const SizedBox(width: 12),
            _buildStatChip('নিষ্ক্রিয়', '${counts[MemberStatus.inactive] ?? 0} জন', AppColors.warning, AppColors.warningContainer),
            const SizedBox(width: 12),
            _buildStatChip('স্থগিত', '${counts[MemberStatus.suspended] ?? 0} জন', AppColors.error, AppColors.errorContainer),
            const SizedBox(width: 12),
            _buildStatChip('আর্কাইভকৃত', '${counts[MemberStatus.archived] ?? 0} জন', AppColors.textSecondaryLight, AppColors.surfaceVariantLight),
          ],
        ),
      ],
    );
  }

  Widget _buildStatChip(String label, String value, Color textColor, Color bgColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: AppRadius.radiusMd,
        border: Border.all(color: textColor.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '$label: ',
            style: AppTypography.caption(color: textColor, fontWeight: FontWeight.bold),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterBar() {
    return AppCard(
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: AppSearchField(
              controller: _searchController,
              hintText: 'সদস্যের নাম, কোড (MEM-XXXXXX), মোবাইল নম্বর বা NID দিয়ে খুঁজুন...',
              onChanged: (query) {
                _controller.setSearchQuery(query, _currentOrgId);
              },
              onClear: () {
                _searchController.clear();
                _controller.setSearchQuery('', _currentOrgId);
              },
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            flex: 2,
            child: AppDropdown<MemberStatus?>(
              label: 'স্ট্যাটাস ফিল্টার',
              value: _controller.selectedStatusFilter,
              items: [
                const DropdownMenuItem(
                  value: null,
                  child: Text('সকল সদস্য স্ট্যাটাস'),
                ),
                ...MemberStatus.values.map(
                  (s) => DropdownMenuItem(
                    value: s,
                    child: Text(s.banglaName),
                  ),
                ),
              ],
              onChanged: (val) {
                _controller.setStatusFilter(val, _currentOrgId);
              },
            ),
          ),
          const SizedBox(width: 12),
          AppButton(
            text: 'রিফ্রেশ',
            icon: Icons.refresh_rounded,
            variant: AppButtonVariant.outlined,
            onPressed: _loadData,
          ),
        ],
      ),
    );
  }

  Widget _buildMainView() {
    final state = _controller.membersState;

    if (state is UiLoading) {
      return const SizedBox(
        height: 400,
        child: Center(child: AppLoading(message: 'সদস্য তালিকা লোড হচ্ছে...')),
      );
    }

    if (state is UiError) {
      return SizedBox(
        height: 400,
        child: Center(
          child: AppError(
            message: state.message,
            onRetry: _loadData,
          ),
        ),
      );
    }

    if (state is UiEmpty || _controller.allMembers.isEmpty) {
      return SizedBox(
        height: 400,
        child: Center(
          child: AppEmptyState(
            title: 'কোনো সদস্য পাওয়া যায়নি',
            message: 'অনুসন্ধানের সাথে মিলে এমন কোনো সদস্যের রেকর্ড নেই',
            icon: Icons.person_off_outlined,
            action: PermissionGuard(
              permission: PermissionKeys.memberCreate,
              child: AppButton(
                text: 'নতুন সদস্য নিবন্ধন করুন',
                icon: Icons.add,
                onPressed: () {
                  CreateMemberDialog.show(
                    context,
                    organizationId: _currentOrgId,
                    actorUserId: _actorUserId,
                    actorName: _actorName,
                    controller: _controller,
                  );
                },
              ),
            ),
          ),
        ),
      );
    }

    final members = (state as UiSuccess<List<Member>>).data;

    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 960;

        if (isDesktop) {
          // Desktop Master-Detail Layout
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // বাম পাশের তালিকা
              Expanded(
                flex: 5,
                child: _buildMemberList(members),
              ),
              const SizedBox(width: 20),
              // ডান পাশের ডিটেইল প্যানেল
              Expanded(
                flex: 6,
                child: MemberDetailPanel(
                  member: _controller.selectedMember,
                  organizationId: _currentOrgId,
                  actorUserId: _actorUserId,
                  actorName: _actorName,
                  controller: _controller,
                ),
              ),
            ],
          );
        } else {
          // Mobile / Tablet View
          return Column(
            children: [
              _buildMemberList(members),
              if (_controller.selectedMember != null) ...[
                const SizedBox(height: 20),
                MemberDetailPanel(
                  member: _controller.selectedMember,
                  organizationId: _currentOrgId,
                  actorUserId: _actorUserId,
                  actorName: _actorName,
                  controller: _controller,
                ),
              ],
            ],
          );
        }
      },
    );
  }

  Widget _buildMemberList(List<Member> members) {
    return AppCard(
      padding: EdgeInsets.zero,
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: members.length,
        separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.borderLight),
        itemBuilder: (context, index) {
          final member = members[index];
          final isSelected = _controller.selectedMember?.id == member.id;

          return InkWell(
            onTap: () {
              _controller.selectMember(member, _currentOrgId);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              color: isSelected
                  ? AppColors.primaryContainer.withOpacity(0.35)
                  : Colors.transparent,
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: isSelected
                        ? AppColors.primary
                        : AppColors.surfaceVariantLight,
                    child: Text(
                      member.fullName.isNotEmpty ? member.fullName.characters.first : 'স',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : AppColors.primary,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                member.fullName,
                                style: AppTypography.body(
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceVariantLight,
                                borderRadius: AppRadius.radiusSm,
                              ),
                              child: Text(
                                member.memberCode,
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  fontFamily: 'monospace',
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Icon(Icons.phone_android_rounded, size: 13, color: AppColors.textSecondaryLight),
                            const SizedBox(width: 4),
                            Text(
                              member.mobile,
                              style: AppTypography.caption(color: AppColors.textSecondaryLight),
                            ),
                            if (member.occupation != null) ...[
                              const SizedBox(width: 8),
                              const Text('•', style: TextStyle(color: AppColors.textSecondaryLight, fontSize: 10)),
                              const SizedBox(width: 8),
                              Flexible(
                                child: Text(
                                  member.occupation!,
                                  style: AppTypography.caption(color: AppColors.textSecondaryLight),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  AppBadge(
                    text: member.status.banglaName,
                    variant: member.status.isActive
                        ? AppBadgeVariant.success
                        : (member.status.isSuspended
                            ? AppBadgeVariant.error
                            : AppBadgeVariant.warning),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
