import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_radius.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/authorization/permission_guard.dart';
import '../../../../core/authorization/permission_keys.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../domain/entities/security_session.dart';

/// SessionCard: একক সেশন উপস্থাপনা ও নিয়ন্ত্রণ কার্ড
class SessionCard extends StatelessWidget {
  final SecuritySession session;
  final Function(String sessionId, String reason)? onTerminate;
  final bool isCurrent;

  const SessionCard({
    super.key,
    required this.session,
    this.onTerminate,
    this.isCurrent = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(
          color: isCurrent
              ? AppColors.primary.withOpacity(0.5)
              : session.isActive
                  ? AppColors.borderLight
                  : AppColors.borderLight.withOpacity(0.5),
          width: isCurrent ? 1.5 : 1.0,
        ),
        boxShadow: isCurrent
            ? [
                BoxShadow(
                  color: AppColors.primary.withOpacity(0.06),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ১. হেডার: স্ট্যাটাস ও আইডি
            Row(
              children: [
                _buildStatusIndicator(session.status),
                const SizedBox(width: 8),
                Text(
                  session.maskedSessionId,
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: AppColors.textPrimaryLight,
                  ),
                ),
                if (isCurrent) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.primaryContainer,
                      borderRadius: AppRadius.radiusSm,
                    ),
                    child: Text(
                      'বর্তমান সেশন',
                      style: AppTypography.caption(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
                const Spacer(),
                _buildStatusBadge(session.status),
              ],
            ),

            const SizedBox(height: 12),

            // ২. ব্যবহারকারীর নাম ও ভূমিকা
            Row(
              children: [
                CircleAvatar(
                  radius: 14,
                  backgroundColor: AppColors.surfaceVariantLight,
                  child: Text(
                    session.userName.isNotEmpty ? session.userName.substring(0, 1) : 'U',
                    style: AppTypography.caption(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        session.userName,
                        style: AppTypography.body(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'ভূমিকা: ${session.userRoleName}',
                        style: AppTypography.caption(color: AppColors.textSecondaryLight),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const Divider(height: 20),

            // ৩. ডিভাইস ও অবস্থান তথ্য
            _buildMetaRow(
              Icons.devices_outlined,
              session.deviceReference ?? 'ওয়েব ব্রাউজার',
            ),
            const SizedBox(height: 6),
            _buildMetaRow(
              Icons.wifi_outlined,
              'আইপি: ${session.maskedIp}',
            ),
            if (session.lastKnownLocationReference != null) ...[
              const SizedBox(height: 6),
              _buildMetaRow(
                Icons.location_on_outlined,
                session.lastKnownLocationReference!,
              ),
            ],

            const SizedBox(height: 10),

            // ৪. সময়কাল
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'লগইন: ${_formatTime(session.createdAt)}',
                  style: AppTypography.caption(color: AppColors.textSecondaryLight),
                ),
                Text(
                  'সর্বশেষ সক্রিয়: ${_formatTime(session.lastActivityAt)}',
                  style: AppTypography.caption(color: AppColors.textSecondaryLight),
                ),
              ],
            ),

            // সমাপ্তির কারণ (যদি থাকে)
            if (session.isTerminated && session.terminationReason != null) ...[
              const SizedBox(height: 8),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: AppRadius.radiusSm,
                ),
                child: Text(
                  'সমাপ্তির কারণ: ${session.terminationReason}',
                  style: AppTypography.caption(color: Colors.red.shade900),
                ),
              ),
            ],

            // ৫. অ্যাকশন বোতাম (যদি সক্রিয় থাকে)
            if (session.isActive && !isCurrent) ...[
              const SizedBox(height: 12),
              PermissionGuard(
                permission: PermissionKeys.sessionTerminate,
                fallback: const SizedBox.shrink(),
                child: SizedBox(
                  width: double.infinity,
                  child: AppButton(
                    label: 'সেশন সমাপ্ত করুন',
                    icon: Icons.power_settings_new_outlined,
                    variant: AppButtonVariant.outline,
                    onPressed: () => _confirmTermination(context),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _confirmTermination(BuildContext context) {
    final reasonController = TextEditingController();
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.warning_amber_rounded, color: Colors.red),
            const SizedBox(width: 8),
            Text(
              'সেশন সমাপ্তি নিশ্চিতকরণ',
              style: AppTypography.heading3(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'আপনি কি নিশ্চিত যে আপনি ${session.userName}-এর এই ডিভাইস সেশনটি দূরবর্তীভাবে সমাপ্ত করতে চান?',
                style: AppTypography.body(),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: reasonController,
                decoration: const InputDecoration(
                  labelText: 'সমাপ্ত করার সুনির্দিষ্ট কারণ *',
                  hintText: 'যেমন: সন্দেহজনক কার্যক্রম, ডিভাইস পরিবর্তন ইত্যাদি',
                  border: OutlineInputBorder(),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'সেশন সমাপ্তির কারণ উল্লেখ করা বাধ্যতামূলক।';
                  }
                  if (val.trim().length < 5) {
                    return 'কমপক্ষে ৫ অক্ষরে কারণ লিখুন।';
                  }
                  return null;
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('বাতিল'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              if (formKey.currentState?.validate() == true) {
                final reason = reasonController.text.trim();
                Navigator.pop(ctx);
                onTerminate?.call(session.sessionId, reason);
              }
            },
            child: const Text('সমাপ্ত করুন'),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusIndicator(SecuritySessionStatus status) {
    Color color;
    switch (status) {
      case SecuritySessionStatus.active:
        color = Colors.green;
        break;
      case SecuritySessionStatus.expired:
        color = Colors.amber;
        break;
      case SecuritySessionStatus.terminated:
        color = Colors.red;
        break;
    }

    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
    );
  }

  Widget _buildStatusBadge(SecuritySessionStatus status) {
    Color bg;
    Color fg;
    switch (status) {
      case SecuritySessionStatus.active:
        bg = Colors.green.shade50;
        fg = Colors.green.shade800;
        break;
      case SecuritySessionStatus.expired:
        bg = Colors.amber.shade50;
        fg = Colors.amber.shade900;
        break;
      case SecuritySessionStatus.terminated:
        bg = Colors.red.shade50;
        fg = Colors.red.shade800;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: AppRadius.radiusFull,
        border: Border.all(color: fg.withOpacity(0.3)),
      ),
      child: Text(
        status.banglaName,
        style: AppTypography.caption(color: fg, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildMetaRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.textSecondaryLight),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            style: AppTypography.caption(color: AppColors.textSecondaryLight),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  String _formatTime(DateTime dt) {
    return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')} (${dt.day}/${dt.month})';
  }
}
