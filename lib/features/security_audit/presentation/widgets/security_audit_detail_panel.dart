import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_radius.dart';
import '../../../../app/theme/app_typography.dart';
import '../../domain/entities/security_audit_record.dart';
import '../../domain/entities/security_event.dart';

/// SecurityAuditDetailPanel: নির্বাচিত অডিট রেকর্ডের পূর্ণাঙ্গ মাস্টার-ডিটেইল ভিউ
class SecurityAuditDetailPanel extends StatelessWidget {
  final SecurityAuditRecord? record;
  final VoidCallback? onClose;

  const SecurityAuditDetailPanel({
    super.key,
    required this.record,
    this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    if (record == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.touch_app_outlined,
              size: 48,
              color: AppColors.textSecondaryLight.withOpacity(0.4),
            ),
            const SizedBox(height: 12),
            Text(
              'তালিকা থেকে যেকোনো একটি অডিট রেকর্ড নির্বাচন করুন',
              style: AppTypography.body(color: AppColors.textSecondaryLight),
            ),
          ],
        ),
      );
    }

    final item = record!;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // প্যানেল হেডার
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariantLight.withOpacity(0.5),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(AppRadius.lg)),
              border: Border(bottom: BorderSide(color: AppColors.borderLight)),
            ),
            child: Row(
              children: [
                _buildResultBadge(item.result),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.eventType.banglaName,
                        style: AppTypography.subheading(
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimaryLight,
                        ),
                      ),
                      Text(
                        'রেকর্ড আইডি: ${item.id} • ${item.eventType.category.banglaName}',
                        style: AppTypography.caption(color: AppColors.textSecondaryLight),
                      ),
                    ],
                  ),
                ),
                if (onClose != null)
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: onClose,
                    tooltip: 'বন্ধ করুন',
                  ),
              ],
            ),
          ),

          // বিস্তারিত কন্টেন্ট
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ১. মৌলিক তথ্য কার্ড
                  _buildSectionHeader(Icons.info_outline, 'কার্যক্রম ও সময়কাল'),
                  const SizedBox(height: 10),
                  _buildDetailRow('কার্যক্রম (Action)', item.action),
                  _buildDetailRow('সময়কাল (Timestamp)', _formatDate(item.timestamp)),
                  if (item.reason != null && item.reason!.isNotEmpty)
                    _buildDetailRow('কারণ / বিবরণ (Reason)', item.reason!),

                  const Divider(height: 32),

                  // ২. সম্পাদনকারী (Actor)
                  _buildSectionHeader(Icons.person_outline, 'সম্পাদনকারী (Actor)'),
                  const SizedBox(height: 10),
                  _buildDetailRow('নাম (Actor Name)', item.actorName),
                  _buildDetailRow('ব্যবহারকারী আইডি', item.actorUserId),
                  _buildDetailRow('আইপি অ্যাড্রেস', item.ipAddress != null ? SecurityAuditRecord.maskIp(item.ipAddress) : 'N/A'),
                  _buildDetailRow('ডিভাইস / মাধ্যম', item.deviceReference ?? 'ওয়েব / অজানা ডিভাইস'),

                  const Divider(height: 32),

                  // ৩. লক্ষ্যবস্তু (Target)
                  _buildSectionHeader(Icons.adjust_outlined, 'লক্ষ্যবস্তু (Target Entity)'),
                  const SizedBox(height: 10),
                  _buildDetailRow('লক্ষ্যের ধরন', item.targetType),
                  if (item.targetName != null)
                    _buildDetailRow('নাম / রেফারেন্স', item.targetName!),
                  if (item.targetId != null)
                    _buildDetailRow('লক্ষ্য আইডি', item.targetId!),

                  // ৪. স্টেট ট্রানজিশন / ডিফারেন্স (State Changes)
                  if (item.previousState != null || item.newState != null) ...[
                    const Divider(height: 32),
                    _buildSectionHeader(Icons.change_circle_outlined, 'অবস্থা পরিবর্তন (State Diff)'),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.backgroundLight,
                        borderRadius: AppRadius.radiusMd,
                        border: Border.all(color: AppColors.borderLight),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (item.previousState != null) ...[
                            Text(
                              'পূর্ববর্তী অবস্থা (Previous State):',
                              style: AppTypography.caption(fontWeight: FontWeight.bold, color: Colors.orange.shade800),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              item.previousState.toString(),
                              style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                            ),
                            const SizedBox(height: 10),
                          ],
                          if (item.newState != null) ...[
                            Text(
                              'নতুন অবস্থা (New State):',
                              style: AppTypography.caption(fontWeight: FontWeight.bold, color: Colors.green.shade800),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              item.newState.toString(),
                              style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],

                  const Divider(height: 32),

                  // ৫. অপরিবর্তনীয় নিরাপত্তা গ্যারান্টি নোটিস
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primaryContainer.withOpacity(0.5),
                      borderRadius: AppRadius.radiusMd,
                      border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(
                          Icons.verified_user_outlined,
                          size: 18,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'অপরিবর্তনীয় অডিট রেকর্ড: কোনো ব্যবহারকারী বা অ্যাডমিন এই রেকর্ড পরিবর্তন বা স্থায়ীভাবে মুছে ফেলতে পারবে না।',
                            style: AppTypography.caption(color: AppColors.primary),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(IconData icon, String title) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.primary),
        const SizedBox(width: 8),
        Text(
          title,
          style: AppTypography.body(fontWeight: FontWeight.bold, color: AppColors.textPrimaryLight),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(
              label,
              style: AppTypography.caption(color: AppColors.textSecondaryLight),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: AppTypography.body(color: AppColors.textPrimaryLight),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResultBadge(SecurityEventResult result) {
    Color bg;
    Color fg;
    IconData icon;

    switch (result) {
      case SecurityEventResult.success:
        bg = Colors.green.shade50;
        fg = Colors.green.shade800;
        icon = Icons.check_circle_outline;
        break;
      case SecurityEventResult.failed:
        bg = Colors.red.shade50;
        fg = Colors.red.shade800;
        icon = Icons.error_outline;
        break;
      case SecurityEventResult.blocked:
        bg = Colors.amber.shade50;
        fg = Colors.amber.shade900;
        icon = Icons.block;
        break;
      case SecurityEventResult.denied:
        bg = Colors.purple.shade50;
        fg = Colors.purple.shade800;
        icon = Icons.lock_outline;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: AppRadius.radiusFull,
        border: Border.all(color: fg.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: fg),
          const SizedBox(width: 4),
          Text(
            result.banglaName,
            style: AppTypography.caption(color: fg, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime dt) {
    return '${dt.year}-${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')} '
        '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }
}
