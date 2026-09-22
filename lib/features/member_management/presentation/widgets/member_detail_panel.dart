import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/authorization/permission_guard.dart';
import '../../../../core/authorization/permission_keys.dart';
import '../../../../shared/widgets/app_badge.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/app_empty_state.dart';
import '../../domain/entities/member.dart';
import '../../domain/entities/member_status.dart';
import '../controllers/member_controller.dart';
import 'edit_member_dialog.dart';
import 'member_status_change_dialog.dart';

/// MemberDetailPanel: নির্বাচিত সদস্যের বিস্তারিত তথ্য ও হিস্ট্রি প্যানেল
class MemberDetailPanel extends StatefulWidget {
  final Member? member;
  final String organizationId;
  final String actorUserId;
  final String actorName;
  final MemberController controller;

  const MemberDetailPanel({
    super.key,
    required this.member,
    required this.organizationId,
    required this.actorUserId,
    required this.actorName,
    required this.controller,
  });

  @override
  State<MemberDetailPanel> createState() => _MemberDetailPanelState();
}

class _MemberDetailPanelState extends State<MemberDetailPanel> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final member = widget.member;
    if (member == null) {
      return const AppCard(
        child: Center(
          child: AppEmptyState(
            title: 'কোনো সদস্য নির্বাচিত নেই',
            message: 'বাম পাশের তালিকা থেকে বিস্তারিত দেখতে যেকোনো সদস্য নির্বাচন করুন',
            icon: Icons.person_search_outlined,
          ),
        ),
      );
    }

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // হেডার: ছবি, নাম, কোড, স্ট্যাটাস ও কুইক অ্যাকশনস
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 34,
                backgroundColor: AppColors.primaryContainer,
                child: Text(
                  member.fullName.isNotEmpty ? member.fullName.characters.first : 'স',
                  style: const TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            member.fullName,
                            style: AppTypography.heading3(
                              color: AppColors.textPrimaryLight,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
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
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceVariantLight,
                            borderRadius: AppRadius.radiusSm,
                            border: Border.all(color: AppColors.borderLight),
                          ),
                          child: Text(
                            member.memberCode,
                            style: const TextStyle(
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                              color: AppColors.primary,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'যোগদান: ${_formatDate(member.joinedAt)}',
                          style: AppTypography.caption(color: AppColors.textSecondaryLight),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // অ্যাকশন বাটনসমূহ (Protected by Permissions)
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  PermissionGuard(
                    permission: PermissionKeys.memberEdit,
                    mode: PermissionGuardMode.disable,
                    child: AppButton(
                      text: 'তথ্য সংশোধন',
                      icon: Icons.edit_outlined,
                      size: AppButtonSize.small,
                      variant: AppButtonVariant.outlined,
                      onPressed: () {
                        EditMemberDialog.show(
                          context,
                          member: member,
                          organizationId: widget.organizationId,
                          actorUserId: widget.actorUserId,
                          actorName: widget.actorName,
                          controller: widget.controller,
                        );
                      },
                    ),
                  ),
                  PermissionGuard(
                    permission: PermissionKeys.memberStatusChange,
                    mode: PermissionGuardMode.disable,
                    child: AppButton(
                      text: 'স্ট্যাটাস পরিবর্তন',
                      icon: Icons.sync_alt_rounded,
                      size: AppButtonSize.small,
                      variant: AppButtonVariant.primary,
                      onPressed: () {
                        MemberStatusChangeDialog.show(
                          context,
                          member: member,
                          organizationId: widget.organizationId,
                          actorUserId: widget.actorUserId,
                          actorName: widget.actorName,
                          controller: widget.controller,
                        );
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 16),
          const Divider(height: 1),
          const SizedBox(height: 8),

          // ট্যাব বার
          TabBar(
            controller: _tabController,
            isScrollable: true,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textSecondaryLight,
            indicatorColor: AppColors.primary,
            labelStyle: AppTypography.body(fontWeight: FontWeight.bold),
            unselectedLabelStyle: AppTypography.body(),
            tabs: const [
              Tab(icon: Icon(Icons.badge_outlined, size: 18), text: 'মৌলিক তথ্য'),
              Tab(icon: Icon(Icons.contact_mail_outlined, size: 18), text: 'যোগাযোগ ও ঠিকানা'),
              Tab(icon: Icon(Icons.history_edu_outlined, size: 18), text: 'অডিট ও ইতিহাস'),
            ],
          ),

          const SizedBox(height: 16),

          // ট্যাব কনটেন্ট
          SizedBox(
            height: 380,
            child: TabBarView(
              controller: _tabController,
              children: [
                // ট্যাব ১: মৌলিক তথ্য
                _buildBasicInfoTab(member),

                // ট্যাব ২: যোগাযোগ ও ঠিকানা
                _buildContactTab(member),

                // ট্যাব ৩: অডিট ও ইতিহাস
                _buildAuditHistoryTab(member),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBasicInfoTab(Member member) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoGrid([
            _InfoItem('লিঙ্গ', member.genderBangla, Icons.wc_outlined),
            _InfoItem('পেশা', member.occupation ?? 'উল্লেখ নেই', Icons.work_outline_rounded),
            _InfoItem(
              'জন্মতারিখ ও বয়স',
              member.dateOfBirth != null
                  ? '${_formatDate(member.dateOfBirth!)} (${member.ageYears ?? 0} বছর)'
                  : 'উল্লেখ নেই',
              Icons.cake_outlined,
            ),
            _InfoItem('জাতীয় পরিচয়পত্র (NID)', member.nid ?? 'উল্লেখ নেই', Icons.credit_card_outlined),
            _InfoItem('পিতা / স্বামীর নাম', member.fatherOrSpouseName ?? 'উল্লেখ নেই', Icons.family_restroom_outlined),
            _InfoItem('মাতার নাম', member.motherName ?? 'উল্লেখ নেই', Icons.person_pin_outlined),
            _InfoItem('যোগদানের তারিখ', _formatDate(member.joinedAt), Icons.event_available_outlined),
            _InfoItem('সদস্যপদ অবস্থা', member.status.banglaName, Icons.verified_outlined),
          ]),
          if (member.notes != null && member.notes!.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text(
              'বিশেষ নোট:',
              style: AppTypography.caption(
                color: AppColors.textSecondaryLight,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surfaceVariantLight,
                borderRadius: AppRadius.radiusMd,
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Text(
                member.notes!,
                style: AppTypography.body(),
              ),
            ),
          ],
          const SizedBox(height: 16),
          // সেপারেশন অব ডিউটিজ ও ফিন্যান্সিয়াল নোটিশ
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primaryContainer.withOpacity(0.4),
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.primary.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                const Icon(Icons.shield_outlined, color: AppColors.primary, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'আর্থিক নিরাপত্তা নীতি: সদস্যের শেয়ার, সঞ্চয়, কিস্তি ও লেনদেন সংক্রান্ত খতিয়ান পরবর্তী নির্ধারিত ফেজে সংযোজিত হবে।',
                    style: AppTypography.caption(color: AppColors.primaryDark),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactTab(Member member) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoGrid([
            _InfoItem('মোবাইল নম্বর', member.mobile, Icons.phone_android_rounded),
            _InfoItem('ইমেইল ঠিকানা', member.email ?? 'প্রদান করা হয়নি', Icons.email_outlined),
          ]),
          const SizedBox(height: 16),
          Text(
            'বর্তমান ও স্থায়ী ঠিকানা:',
            style: AppTypography.caption(
              color: AppColors.textSecondaryLight,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariantLight,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.location_on_outlined, color: AppColors.textSecondaryLight, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    member.address ?? 'ঠিকানা এন্ট্রি করা হয়নি',
                    style: AppTypography.body(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAuditHistoryTab(Member member) {
    final audits = widget.controller.memberStatusAudits;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // মেটাডাটা
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariantLight,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('তৈরির তারিখ', style: AppTypography.caption(color: AppColors.textSecondaryLight)),
                    Text(_formatDateTime(member.createdAt), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('সর্বশেষ হালনাগাদ', style: AppTypography.caption(color: AppColors.textSecondaryLight)),
                    Text(_formatDateTime(member.updatedAt), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('স্থায়ী মেম্বার আইডি', style: AppTypography.caption(color: AppColors.textSecondaryLight)),
                    Text(member.id, style: const TextStyle(fontFamily: 'monospace', fontSize: 11)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          Text(
            'স্ট্যাটাস পরিবর্তন ইতিহাস (Status Audit Trail)',
            style: AppTypography.titleSmall(
              color: AppColors.primary,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),

          if (audits.isEmpty)
            Container(
              padding: const EdgeInsets.all(20),
              alignment: Alignment.center,
              child: Text(
                'কোনো স্ট্যাটাস পরিবর্তনের ইতিহাস নেই (প্রাথমিক সক্রিয় অবস্থায় রয়েছে)',
                style: AppTypography.caption(color: AppColors.textSecondaryLight),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: audits.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final audit = audits[index];
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: AppRadius.radiusMd,
                    border: Border.all(color: AppColors.borderLight),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              AppBadge(
                                text: audit.previousStatus.banglaName,
                                variant: AppBadgeVariant.neutral,
                              ),
                              const SizedBox(width: 6),
                              const Icon(Icons.arrow_forward_rounded, size: 14, color: AppColors.textSecondaryLight),
                              const SizedBox(width: 6),
                              AppBadge(
                                text: audit.newStatus.banglaName,
                                variant: audit.newStatus.isActive
                                    ? AppBadgeVariant.success
                                    : AppBadgeVariant.error,
                              ),
                            ],
                          ),
                          Text(
                            _formatDateTime(audit.timestamp),
                            style: AppTypography.caption(color: AppColors.textSecondaryLight),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'কারণ: ${audit.reason}',
                        style: AppTypography.bodySmall(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'সম্পাদনকারী: ${audit.changedByName} (${audit.changedByUserId})',
                        style: AppTypography.caption(color: AppColors.textSecondaryLight),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildInfoGrid(List<_InfoItem> items) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 500 ? 2 : 1;
        return Wrap(
          spacing: 12,
          runSpacing: 12,
          children: items.map((item) {
            return SizedBox(
              width: crossAxisCount == 2
                  ? (constraints.maxWidth - 12) / 2
                  : constraints.maxWidth,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariantLight.withOpacity(0.5),
                  borderRadius: AppRadius.radiusMd,
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Row(
                  children: [
                    Icon(item.icon, size: 20, color: AppColors.primary),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.label,
                            style: AppTypography.caption(color: AppColors.textSecondaryLight),
                          ),
                          Text(
                            item.value,
                            style: AppTypography.body(fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        );
      },
    );
  }

  String _formatDate(DateTime dt) {
    return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}';
  }

  String _formatDateTime(DateTime dt) {
    return '${_formatDate(dt)} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }
}

class _InfoItem {
  final String label;
  final String value;
  final IconData icon;
  _InfoItem(this.label, this.value, this.icon);
}
