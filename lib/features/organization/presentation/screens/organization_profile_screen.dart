import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_radius.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/context/organization_context.dart';
import '../../../../core/demo/demo_organization_config.dart';
import '../../../../core/state/ui_state.dart';
import '../../../../core/utils/app_date_formatter.dart';
import '../../../../domain/entities/organization.dart';
import '../../../../shared/widgets/app_breadcrumbs.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/app_confirm_action.dart';
import '../../../../shared/widgets/app_empty_state.dart';
import '../../../../shared/widgets/app_error_state.dart';
import '../../../../shared/widgets/app_loading.dart';
import '../../../../shared/widgets/app_snackbar.dart';
import '../../../../shared/widgets/app_status_badge.dart';
import 'organization_edit_screen.dart';

/// OrganizationProfileScreen: সমিতির মৌলিক পরিচিতি ও প্রোফাইল ডিসপ্লে
///
/// এখানে কোনো আর্থিক বা ব্যালেন্স ডেটা প্রদর্শিত হবে না (Strict Scope Protection)।
/// শুধুমাত্র প্রতিষ্ঠানের প্রশাসনিক তথ্য, যোগাযোগের ঠিকানা এবং মেটাডাটা দেখা যাবে।
class OrganizationProfileScreen extends StatefulWidget {
  final VoidCallback? onNavigateToEdit;

  const OrganizationProfileScreen({
    super.key,
    this.onNavigateToEdit,
  });

  @override
  State<OrganizationProfileScreen> createState() => _OrganizationProfileScreenState();
}

class _OrganizationProfileScreenState extends State<OrganizationProfileScreen> {
  late UiState<Organization> _uiState;
  bool _isEditMode = false;

  @override
  void initState() {
    super.initState();
    _loadOrganizationData();
  }

  void _loadOrganizationData() {
    setState(() {
      _uiState = const UiLoading<Organization>(message: 'সংগঠনের তথ্য লোড হচ্ছে...');
    });

    // গ্লোবাল অর্গানাইজেশন কনটেক্সট থেকে তথ্য নেওয়া
    Future.microtask(() async {
      try {
        final contextInst = OrganizationContext.instance;
        if (!contextInst.isInitialized) {
          await contextInst.initialize();
        }

        final org = contextInst.currentOrganization;
        if (org == null) {
          if (mounted) {
            setState(() {
              _uiState = const UiEmpty<Organization>(
                title: 'কোনো সক্রিয় সমিতি পাওয়া যায়নি',
                message: 'বর্তমান সেশনে কোনো সক্রিয় সমিতি নির্ধারিত নেই।',
              );
            });
          }
          return;
        }

        if (mounted) {
          setState(() {
            _uiState = UiSuccess<Organization>(org);
          });
        }
      } catch (e) {
        if (mounted) {
          setState(() {
            _uiState = UiError<Organization>(
              userMessage: 'সংগঠনের তথ্য লোড করতে সমস্যা হয়েছে।',
              onRetry: _loadOrganizationData,
            );
          });
        }
      }
    });
  }

  void _onStatusChangeRequested(Organization org, OrganizationStatus newStatus) async {
    final confirmed = await AppConfirmAction.show(
      context: context,
      title: 'সমিতির স্ট্যাটাস পরিবর্তন নিশ্চিত করুন',
      message:
          'আপনি কি "${org.name}"-এর স্ট্যাটাস "${newStatus.labelBn}" করতে চান? এই পরিবর্তন সমিতির সামগ্রিক কার্যক্রম ও অ্যাক্সেসকে প্রভাবিত করবে।',
      confirmLabel: 'হ্যাঁ, পরিবর্তন করুন',
      cancelLabel: 'বাতিল',
      isDestructive: newStatus == OrganizationStatus.suspended ||
          newStatus == OrganizationStatus.archived,
    );

    if (confirmed == true) {
      await OrganizationContext.instance.updateStatus(newStatus);
      final updatedOrg = OrganizationContext.instance.currentOrganization;
      if (updatedOrg != null && mounted) {
        setState(() {
          _uiState = UiSuccess<Organization>(updatedOrg);
        });
        AppSnackbar.success(
          context,
          'সমিতির স্ট্যাটাস সফলভাবে "${newStatus.labelBn}" করা হয়েছে।',
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isEditMode && _uiState.isSuccess) {
      return OrganizationEditScreen(
        organization: (_uiState as UiSuccess<Organization>).data,
        onCancel: () {
          setState(() {
            _isEditMode = false;
          });
        },
        onSaved: (updated) {
          setState(() {
            _uiState = UiSuccess<Organization>(updated);
            _isEditMode = false;
          });
          AppSnackbar.success(context, 'সংগঠনের তথ্য সফলভাবে সংরক্ষিত হয়েছে।');
        },
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.lg,
        vertical: AppSpacing.md,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ব্রেডক্রাম্বস
          const AppBreadcrumbs(
            items: [
              BreadcrumbItem(title: 'হোম', route: '/dashboard'),
              BreadcrumbItem(title: 'সংগঠন ও নিরাপত্তা', route: '/organization-security'),
              BreadcrumbItem(title: 'সংগঠনের তথ্য'),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // UiState হ্যান্ডলিং
          _uiState.when(
            initial: () => const AppLoading(message: 'প্রস্তুত হচ্ছে...'),
            loading: (message, progress) => AppLoading(message: message),
            empty: (title, message) => AppEmptyState(
              title: title,
              message: message,
              actionLabel: 'পুনরায় চেষ্টা করুন',
              onAction: _loadOrganizationData,
            ),
            error: (userMessage, failure, onRetry) => AppErrorState(
              userMessage: userMessage,
              onRetry: onRetry,
            ),
            offline: (message, onRetry) => AppErrorState(
              title: 'অফলাইন অবস্থা',
              userMessage: message,
              onRetry: onRetry,
            ),
            unauthorized: (message) => AppErrorState(
              title: 'অননুমোদিত অ্যাক্সেস',
              userMessage: message,
            ),
            forbidden: (message) => AppErrorState(
              title: 'অ্যাক্সেস সংরক্ষিত',
              userMessage: message,
            ),
            success: (org) => _buildProfileContent(context, org),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileContent(BuildContext context, Organization org) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;
    final isTablet = screenWidth >= 768 && screenWidth < 1024;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ডেমো অর্গানাইজেশন ডিসক্লেইমার ব্যানার (যদি প্রযোজ্য হয়)
        if (OrganizationContext.instance.isDemo)
          _buildDemoNoticeCard(context),

        // মূল হেডার ও অ্যাকশন বার
        _buildHeaderCard(context, org, isMobile),
        const SizedBox(height: AppSpacing.lg),

        // মূল প্রোফাইল বডি (রেসপনসিভ ২-কলাম বা ১-কলাম লেআউট)
        if (isMobile) ...[
          _buildPrimaryDetailsCard(org),
          const SizedBox(height: AppSpacing.md),
          _buildContactInfoCard(org),
          const SizedBox(height: AppSpacing.md),
          _buildSystemMetaCard(org),
        ] else ...[
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: isTablet ? 6 : 7,
                child: Column(
                  children: [
                    _buildPrimaryDetailsCard(org),
                    const SizedBox(height: AppSpacing.md),
                    _buildContactInfoCard(org),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                flex: isTablet ? 4 : 5,
                child: Column(
                  children: [
                    _buildStatusManagementCard(org),
                    const SizedBox(height: AppSpacing.md),
                    _buildSystemMetaCard(org),
                  ],
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }

  /// ডেমো নোটিশ কার্ড
  Widget _buildDemoNoticeCard(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.secondaryContainer.withOpacity(0.5),
        borderRadius: AppRadius.radiusMd,
        border: Border.all(color: AppColors.secondary.withOpacity(0.4)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.science_outlined, color: AppColors.secondary, size: 22),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      DemoOrganizationConfig.demoBadgeText,
                      style: AppTypography.caption(
                        color: AppColors.secondary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.secondary,
                        borderRadius: AppRadius.radiusSm,
                      ),
                      child: const Text(
                        'নমুনা সমিতি',
                        style: TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  DemoOrganizationConfig.demoDisclaimerNotice,
                  style: AppTypography.bodySmall(color: AppColors.textSecondaryLight),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// হেডার কার্ড
  Widget _buildHeaderCard(BuildContext context, Organization org, bool isMobile) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // লোগো বা প্রতীক
              _buildLogoAvatar(org),
              const SizedBox(width: AppSpacing.md),

              // নাম ও কোড
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            org.name,
                            style: AppTypography.heading1(
                              color: AppColors.textPrimaryLight,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        if (!isMobile) ...[
                          _buildStatusBadge(org.status),
                        ],
                      ],
                    ),
                    const SizedBox(height: 4),
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        if (org.shortName.isNotEmpty)
                          Text(
                            org.shortName,
                            style: AppTypography.body(
                              color: AppColors.textSecondaryLight,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceVariantLight,
                            borderRadius: AppRadius.radiusSm,
                            border: Border.all(color: AppColors.borderLight),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.tag, size: 12, color: AppColors.textSecondaryLight),
                              const SizedBox(width: 4),
                              Text(
                                org.organizationCode,
                                style: const TextStyle(
                                  fontFamily: AppTypography.fontTechnical,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimaryLight,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primaryContainer.withOpacity(0.5),
                            borderRadius: AppRadius.radiusSm,
                          ),
                          child: Text(
                            org.typeLabel,
                            style: AppTypography.caption(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                    if (isMobile) ...[
                      const SizedBox(height: 8),
                      _buildStatusBadge(org.status),
                    ],
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          const Divider(color: AppColors.borderLight, height: 1),
          const SizedBox(height: AppSpacing.sm),

          // অ্যাকশন বাটনসমূহ
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'সংগঠন আইডি: ${org.id}',
                style: const TextStyle(
                  fontFamily: AppTypography.fontTechnical,
                  fontSize: 11,
                  color: AppColors.textSecondaryLight,
                ),
              ),
              Row(
                children: [
                  AppButton.outline(
                    label: 'রিফ্রেশ',
                    icon: Icons.refresh,
                    size: AppButtonSize.small,
                    onPressed: _loadOrganizationData,
                  ),
                  const SizedBox(width: 8),
                  AppButton.primary(
                    label: 'সম্পাদনা করুন',
                    icon: Icons.edit_outlined,
                    size: AppButtonSize.small,
                    onPressed: () {
                      if (widget.onNavigateToEdit != null) {
                        widget.onNavigateToEdit!();
                      } else {
                        setState(() {
                          _isEditMode = true;
                        });
                      }
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// লোগো অ্যাভাটার
  Widget _buildLogoAvatar(Organization org) {
    return Container(
      width: 64,
      height: 64,
      decoration: BoxDecoration(
        color: AppColors.primaryContainer,
        borderRadius: AppRadius.radiusMd,
        border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 1.5),
      ),
      child: Center(
        child: org.logo != null && org.logo!.isNotEmpty
            ? ClipRRect(
                borderRadius: AppRadius.radiusMd,
                child: Image.network(
                  org.logo!,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => const Icon(
                    Icons.business,
                    color: AppColors.primary,
                    size: 32,
                  ),
                ),
              )
            : const Icon(
                Icons.apartment_outlined,
                color: AppColors.primary,
                size: 32,
              ),
      ),
    );
  }

  /// স্ট্যাটাস ব্যাজ
  Widget _buildStatusBadge(OrganizationStatus status) {
    BadgeStatus badgeStatus;
    switch (status) {
      case OrganizationStatus.active:
        badgeStatus = BadgeStatus.active;
        break;
      case OrganizationStatus.inactive:
        badgeStatus = BadgeStatus.inactive;
        break;
      case OrganizationStatus.suspended:
        badgeStatus = BadgeStatus.warning;
        break;
      case OrganizationStatus.archived:
        badgeStatus = BadgeStatus.pending;
        break;
    }
    return AppStatusBadge(
      status: badgeStatus,
      customLabel: status.labelBn,
      size: BadgeSize.medium,
    );
  }

  /// প্রাথমিক বিবরণ কার্ড
  Widget _buildPrimaryDetailsCard(Organization org) {
    return AppCard(
      title: 'মৌলিক বিবরণ ও পরিচিতি',
      leadingIcon: Icons.info_outline,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildKeyValueRow('সংগঠনের পূর্ণ নাম', org.name),
          _buildKeyValueRow('সংক্ষিপ্ত নাম', org.shortName.isNotEmpty ? org.shortName : 'প্রযোজ্য নয়'),
          _buildKeyValueRow('অনন্য কোড', org.organizationCode, isTechnical: true),
          _buildKeyValueRow('সংগঠনের ধরন', org.typeLabel),
          const SizedBox(height: 8),
          const Text(
            'সংক্ষিপ্ত বিবরণ ও লক্ষ্য:',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondaryLight,
            ),
          ),
          const SizedBox(height: 4),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariantLight.withOpacity(0.5),
              borderRadius: AppRadius.radiusSm,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Text(
              org.description != null && org.description!.isNotEmpty
                  ? org.description!
                  : 'কোনো বিবরণ যোগ করা হয়নি।',
              style: AppTypography.body(
                color: org.description != null && org.description!.isNotEmpty
                    ? AppColors.textPrimaryLight
                    : AppColors.textSecondaryLight,
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// যোগাযোগের তথ্য কার্ড
  Widget _buildContactInfoCard(Organization org) {
    return AppCard(
      title: 'যোগাযোগ ও দাপ্তরিক ঠিকানা',
      leadingIcon: Icons.contact_mail_outlined,
      child: Column(
        children: [
          _buildKeyValueRow('মোবাইল / ফোন নম্বর', org.phone ?? 'প্রযোজ্য নয়', icon: Icons.phone_outlined),
          _buildKeyValueRow('অফিসিয়াল ইমেইল', org.email ?? 'প্রযোজ্য নয়', icon: Icons.email_outlined),
          _buildKeyValueRow(
            'দাপ্তরিক ঠিকানা',
            org.address ?? 'ঠিকানা লিপিবদ্ধ করা হয়নি',
            icon: Icons.location_on_outlined,
          ),
        ],
      ),
    );
  }

  /// স্ট্যাটাস পরিচালনা ও সফট-আর্কাইভ কার্ড
  Widget _buildStatusManagementCard(Organization org) {
    return AppCard(
      title: 'অবস্থা ও সংরক্ষণ (Lifecycle)',
      leadingIcon: Icons.shield_outlined,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'বর্তমান অবস্থা:',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              ),
              _buildStatusBadge(org.status),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'সফট ডিলিট নীতি: তথ্য স্থায়ীভাবে মুছে ফেলা নিষিদ্ধ। প্রয়োজনে প্রতিষ্ঠানকে নিষ্ক্রিয়, স্থগিত অথবা আর্কাইভে স্থানান্তর করা যাবে।',
            style: AppTypography.caption(color: AppColors.textSecondaryLight),
          ),
          const SizedBox(height: 12),
          const Divider(color: AppColors.borderLight, height: 1),
          const SizedBox(height: 12),

          // স্ট্যাটাস সুইচিং অ্যাকশন
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              if (org.status != OrganizationStatus.active)
                AppButton.outline(
                  label: 'সক্রিয় করুন',
                  size: AppButtonSize.small,
                  onPressed: () => _onStatusChangeRequested(org, OrganizationStatus.active),
                ),
              if (org.status != OrganizationStatus.inactive)
                AppButton.outline(
                  label: 'নিষ্ক্রিয় করুন',
                  size: AppButtonSize.small,
                  onPressed: () => _onStatusChangeRequested(org, OrganizationStatus.inactive),
                ),
              if (org.status != OrganizationStatus.suspended)
                AppButton.outline(
                  label: 'স্থগিত করুন',
                  size: AppButtonSize.small,
                  onPressed: () => _onStatusChangeRequested(org, OrganizationStatus.suspended),
                ),
              if (org.status != OrganizationStatus.archived)
                AppButton.outline(
                  label: 'আর্কাইভ করুন',
                  size: AppButtonSize.small,
                  onPressed: () => _onStatusChangeRequested(org, OrganizationStatus.archived),
                ),
            ],
          ),
        ],
      ),
    );
  }

  /// সিস্টেম অডিট ও মেটাডাটা কার্ড
  Widget _buildSystemMetaCard(Organization org) {
    return AppCard(
      title: 'সিস্টেম অডিট ও সময়কাল',
      leadingIcon: Icons.history_outlined,
      child: Column(
        children: [
          _buildKeyValueRow('সিস্টেম আইডি', org.id, isTechnical: true),
          _buildKeyValueRow('তৈরির তারিখ', AppDateFormatter.formatDateTimeBn(org.createdAt)),
          _buildKeyValueRow('সর্বশেষ হালনাগাদ', AppDateFormatter.formatDateTimeBn(org.updatedAt)),
          _buildKeyValueRow('তৈরি করেছেন', org.createdBy ?? 'অজ্ঞাত / সিস্টেম সিড'),
          _buildKeyValueRow('হালনাগাদ করেছেন', org.updatedBy ?? 'অজ্ঞাত / সিস্টেম সিড'),
        ],
      ),
    );
  }

  Widget _buildKeyValueRow(
    String key,
    String value, {
    IconData? icon,
    bool isTechnical = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 16, color: AppColors.textSecondaryLight),
            const SizedBox(width: 6),
          ],
          SizedBox(
            width: 130,
            child: Text(
              key,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondaryLight,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: isTechnical
                  ? const TextStyle(
                      fontFamily: AppTypography.fontTechnical,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimaryLight,
                    )
                  : const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textPrimaryLight,
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
