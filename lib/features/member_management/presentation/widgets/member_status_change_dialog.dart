import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/widgets/app_badge.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_dialog.dart';
import '../../../../shared/widgets/app_dropdown.dart';
import '../../../../shared/widgets/app_text_field.dart';
import '../../domain/entities/member.dart';
import '../../domain/entities/member_status.dart';
import '../controllers/member_controller.dart';

/// MemberStatusChangeDialog: সদস্যের লাইফসাইকেল স্ট্যাটাস পরিবর্তনের ডায়ালগ
class MemberStatusChangeDialog extends StatefulWidget {
  final Member member;
  final String organizationId;
  final String actorUserId;
  final String actorName;
  final MemberController controller;

  const MemberStatusChangeDialog({
    super.key,
    required this.member,
    required this.organizationId,
    required this.actorUserId,
    required this.actorName,
    required this.controller,
  });

  static Future<void> show(
    BuildContext context, {
    required Member member,
    required String organizationId,
    required String actorUserId,
    required String actorName,
    required MemberController controller,
  }) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => MemberStatusChangeDialog(
        member: member,
        organizationId: organizationId,
        actorUserId: actorUserId,
        actorName: actorName,
        controller: controller,
      ),
    );
  }

  @override
  State<MemberStatusChangeDialog> createState() => _MemberStatusChangeDialogState();
}

class _MemberStatusChangeDialogState extends State<MemberStatusChangeDialog> {
  final _formKey = GlobalKey<FormState>();
  final _reasonController = TextEditingController();
  late MemberStatus _selectedStatus;
  bool _isSubmitting = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    // পরবর্তী স্ট্যাটাস ডিফল্ট হিসেবে নির্বাচন
    _selectedStatus = widget.member.status == MemberStatus.active
        ? MemberStatus.inactive
        : MemberStatus.active;
  }

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  Future<void> _submitStatusChange() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    final success = await widget.controller.changeMemberStatus(
      organizationId: widget.organizationId,
      memberId: widget.member.id,
      newStatus: _selectedStatus,
      reason: _reasonController.text.trim(),
      actorUserId: widget.actorUserId,
      actorName: widget.actorName,
    );

    if (mounted) {
      if (success) {
        Navigator.of(context).pop();
      } else {
        setState(() {
          _isSubmitting = false;
          _errorMessage = widget.controller.errorMessage ?? 'স্ট্যাটাস পরিবর্তনে ব্যর্থতা';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppDialog(
      title: 'সদস্যপদ স্ট্যাটাস পরিবর্তন',
      subtitle: '${widget.member.fullName} (${widget.member.memberCode})',
      maxWidth: 520,
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_errorMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.error.withOpacity(0.08),
                  borderRadius: AppRadius.radiusMd,
                  border: Border.all(color: AppColors.error.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline_rounded, color: AppColors.error, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _errorMessage!,
                        style: AppTypography.bodySmall(color: AppColors.error),
                      ),
                    ),
                  ],
                ),
              ),

            // বর্তমান অবস্থা কার্ড
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surfaceVariantLight,
                borderRadius: AppRadius.radiusMd,
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'বর্তমান অবস্থা:',
                    style: AppTypography.body(fontWeight: FontWeight.w600),
                  ),
                  AppBadge(
                    text: widget.member.status.banglaName,
                    variant: widget.member.status.isActive
                        ? AppBadgeVariant.success
                        : (widget.member.status.isSuspended
                            ? AppBadgeVariant.error
                            : AppBadgeVariant.warning),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // নতুন স্ট্যাটাস নির্বাচন
            AppDropdown<MemberStatus>(
              label: 'নতুন স্ট্যাটাস নির্ধারণ করুন *',
              value: _selectedStatus,
              items: MemberStatus.values
                  .where((s) => s != widget.member.status)
                  .map((s) => DropdownMenuItem(
                        value: s,
                        child: Text(s.banglaName),
                      ))
                  .toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedStatus = val);
              },
            ),
            const SizedBox(height: 16),

            // কারণ উল্লেখ (বাধ্যতামূলক)
            AppTextField(
              label: 'স্ট্যাটাস পরিবর্তনের সুনির্দিষ্ট কারণ *',
              hintText: 'প্রশাসনিক সিদ্ধান্ত, স্থান পরিবর্তন বা সভার রেফারেন্স উল্লেখ করুন...',
              controller: _reasonController,
              maxLines: 3,
              prefixIcon: const Icon(Icons.rate_review_outlined),
              validator: (val) {
                if (val == null || val.trim().isEmpty) {
                  return 'কারণ উল্লেখ করা বাধ্যতামূলক (অডিট ট্রেইলের জন্য আবশ্যক)';
                }
                if (val.trim().length < 5) {
                  return 'অন্তত ৫ অক্ষরের সুনির্দিষ্ট কারণ লিখুন';
                }
                return null;
              },
            ),

            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.info.withOpacity(0.06),
                borderRadius: AppRadius.radiusSm,
                border: Border.all(color: AppColors.info.withOpacity(0.2)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.info_outline_rounded, size: 18, color: AppColors.info),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'এই পরিবর্তনের একটি স্থায়ী ও অপরিবর্তনীয় অডিট রেকর্ড সংরক্ষিত হবে এবং সংশ্লিষ্ট কর্মকর্তার আইডেন্টিটি নথিভুক্ত থাকবে।',
                      style: AppTypography.caption(color: AppColors.textSecondaryLight),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      actions: [
        AppButton(
          text: 'বাতিল',
          variant: AppButtonVariant.outlined,
          onPressed: _isSubmitting ? null : () => Navigator.of(context).pop(),
        ),
        AppButton(
          text: _isSubmitting ? 'পরিবর্তন হচ্ছে...' : 'স্ট্যাটাস নিশ্চিত করুন',
          variant: _selectedStatus == MemberStatus.suspended
              ? AppButtonVariant.error
              : AppButtonVariant.primary,
          isLoading: _isSubmitting,
          icon: Icons.check_circle_outline_rounded,
          onPressed: _isSubmitting ? null : _submitStatusChange,
        ),
      ],
    );
  }
}
