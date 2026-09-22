import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_radius.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/authorization/permission_keys.dart';
import '../../../../core/authorization/route_permission_guard.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../domain/entities/security_audit_record.dart';
import '../../domain/entities/security_event.dart';
import '../controllers/security_audit_controller.dart';
import '../widgets/security_audit_detail_panel.dart';

/// SecurityAuditScreen: কেন্দ্রীভূত নিরাপত্তা অডিট ও ইভেন্ট লগ স্ক্রিন
class SecurityAuditScreen extends StatefulWidget {
  const SecurityAuditScreen({super.key});

  @override
  State<SecurityAuditScreen> createState() => _SecurityAuditScreenState();
}

class _SecurityAuditScreenState extends State<SecurityAuditScreen> {
  late final SecurityAuditController _controller;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _controller = SecurityAuditController();
    _controller.loadAudits();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RoutePermissionGuard(
      requiredPermission: PermissionKeys.auditLogView,
      child: Scaffold(
        backgroundColor: AppColors.backgroundLight,
        body: AnimatedBuilder(
          animation: _controller,
          builder: (context, _) {
            return LayoutBuilder(
              builder: (context, constraints) {
                final isDesktop = constraints.maxWidth >= 960;

                return Column(
                  children: [
                    // ১. হেডার
                    _buildHeader(context),

                    // ২. ফিল্টার বার
                    _buildFilterBar(context),

                    // ৩. প্রধান কন্টেন্ট (মাস্টার-ডিটেইল বা সিঙ্গেল কলাম)
                    Expanded(
                      child: _controller.state.when(
                        initial: () => const Center(child: CircularProgressIndicator()),
                        loading: () => const Center(child: CircularProgressIndicator()),
                        error: (msg) => _buildErrorState(msg),
                        empty: () => _buildEmptyState(),
                        success: (records) {
                          if (isDesktop) {
                            return _buildDesktopMasterDetail(records);
                          } else {
                            return _buildMobileCardList(records);
                          }
                        },
                      ),
                    ),
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppColors.borderLight)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.primaryContainer,
              borderRadius: AppRadius.radiusMd,
            ),
            child: const Icon(
              Icons.history_edu_outlined,
              color: AppColors.primary,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'নিরাপত্তা অডিট ও ইভেন্ট লগ',
                  style: AppTypography.heading2(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimaryLight,
                  ),
                ),
                Text(
                  'লগইন, ভূমিকা পরিবর্তন, অ্যাক্সেস নিয়ন্ত্রণ ও অপরিবর্তনীয় অডিট ট্রেইল',
                  style: AppTypography.caption(color: AppColors.textSecondaryLight),
                ),
              ],
            ),
          ),
          // রিফ্রেশ বাটন
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'রিলোড করুন',
            onPressed: () => _controller.loadAudits(forceRefresh: true),
          ),
          const SizedBox(width: 8),
          // এক্সপোর্ট
          AppButton(
            label: 'এক্সপোর্ট',
            icon: Icons.file_download_outlined,
            variant: AppButtonVariant.outline,
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('অডিট লগ এক্সপোর্ট প্রস্তুত করা হচ্ছে...'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFilterBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppColors.borderLight)),
      ),
      child: Wrap(
        spacing: 12,
        runSpacing: 10,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          // সার্চ ফিল্ড
          SizedBox(
            width: 260,
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'অনুসন্ধান (নাম, অ্যাকশন, কারণ)...',
                prefixIcon: const Icon(Icons.search, size: 20),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                border: OutlineInputBorder(
                  borderRadius: AppRadius.radiusMd,
                  borderSide: BorderSide(color: AppColors.borderLight),
                ),
                isDense: true,
              ),
              onChanged: (val) => _controller.setSearchQuery(val),
            ),
          ),

          // ইভেন্ট ক্যাটাগরি / টাইপ ড্রপডাউন
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<SecurityEventType?>(
                value: _controller.filterEventType,
                hint: const Text('সকল ইভেন্ট টাইপ'),
                items: [
                  const DropdownMenuItem(
                    value: null,
                    child: Text('সকল ইভেন্ট টাইপ'),
                  ),
                  ...SecurityEventType.values.map((type) {
                    return DropdownMenuItem(
                      value: type,
                      child: Text(type.banglaName),
                    );
                  }),
                ],
                onChanged: (val) => _controller.setEventTypeFilter(val),
              ),
            ),
          ),

          // ফলাফল ড্রপডাউন (Result)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<SecurityEventResult?>(
                value: _controller.filterResult,
                hint: const Text('সকল ফলাফল'),
                items: [
                  const DropdownMenuItem(
                    value: null,
                    child: Text('সকল ফলাফল'),
                  ),
                  ...SecurityEventResult.values.map((res) {
                    return DropdownMenuItem(
                      value: res,
                      child: Text(res.banglaName),
                    );
                  }),
                ],
                onChanged: (val) => _controller.setResultFilter(val),
              ),
            ),
          ),

          // ফিল্টার রিসেট বাটন
          TextButton.icon(
            icon: const Icon(Icons.clear_all, size: 18),
            label: const Text('ফিল্টার মুছুন'),
            onPressed: () {
              _searchController.clear();
              _controller.resetFilters();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDesktopMasterDetail(List<SecurityAuditRecord> records) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // বাম দিক: মাস্টার তালিকা টেবিল
          Expanded(
            flex: 6,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: AppRadius.radiusLg,
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Column(
                children: [
                  // টেবিল হেডার
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceVariantLight.withOpacity(0.5),
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(AppRadius.lg)),
                      border: Border(bottom: BorderSide(color: AppColors.borderLight)),
                    ),
                    child: Row(
                      children: [
                        const SizedBox(width: 85, child: Text('ফলাফল', style: TextStyle(fontWeight: FontWeight.bold))),
                        const SizedBox(width: 140, child: Text('ইভেন্ট', style: TextStyle(fontWeight: FontWeight.bold))),
                        const SizedBox(width: 130, child: Text('সম্পাদনকারী', style: TextStyle(fontWeight: FontWeight.bold))),
                        const Expanded(child: Text('বিবরণ / লক্ষ্য', style: TextStyle(fontWeight: FontWeight.bold))),
                        const SizedBox(width: 120, child: Text('সময়কাল', style: TextStyle(fontWeight: FontWeight.bold))),
                      ],
                    ),
                  ),

                  // রো তালিকা
                  Expanded(
                    child: ListView.separated(
                      itemCount: records.length,
                      separatorBuilder: (_, __) => Divider(height: 1, color: AppColors.borderLight),
                      itemBuilder: (context, index) {
                        final record = records[index];
                        final isSelected = _controller.selectedRecord?.id == record.id;

                        return InkWell(
                          onTap: () => _controller.selectRecord(record),
                          child: Container(
                            color: isSelected ? AppColors.primaryContainer.withOpacity(0.3) : null,
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            child: Row(
                              children: [
                                SizedBox(width: 85, child: _buildResultBadge(record.result)),
                                SizedBox(
                                  width: 140,
                                  child: Text(
                                    record.eventType.banglaName,
                                    style: AppTypography.body(fontWeight: FontWeight.w600),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                SizedBox(
                                  width: 130,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        record.actorName,
                                        style: AppTypography.body(fontWeight: FontWeight.bold),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Text(
                                        record.actorUserId,
                                        style: AppTypography.caption(color: AppColors.textSecondaryLight),
                                      ),
                                    ],
                                  ),
                                ),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        record.action,
                                        style: AppTypography.body(),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      if (record.targetName != null)
                                        Text(
                                          'লক্ষ্য: ${record.targetName}',
                                          style: AppTypography.caption(color: AppColors.textSecondaryLight),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                    ],
                                  ),
                                ),
                                SizedBox(
                                  width: 120,
                                  child: Text(
                                    _formatTime(record.timestamp),
                                    style: AppTypography.caption(color: AppColors.textSecondaryLight),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(width: 20),

          // ডান দিক: নির্বাচিত রেকর্ডের পূর্ণাঙ্গ মাস্টার-ডিটেইল প্যানেল
          Expanded(
            flex: 4,
            child: SecurityAuditDetailPanel(
              record: _controller.selectedRecord,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMobileCardList(List<SecurityAuditRecord> records) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: records.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final record = records[index];

        return Card(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: AppRadius.radiusMd,
            side: BorderSide(color: AppColors.borderLight),
          ),
          child: InkWell(
            borderRadius: AppRadius.radiusMd,
            onTap: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
                builder: (_) => Container(
                  height: MediaQuery.of(context).size.height * 0.85,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.lg)),
                  ),
                  child: SecurityAuditDetailPanel(
                    record: record,
                    onClose: () => Navigator.pop(context),
                  ),
                ),
              );
            },
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      _buildResultBadge(record.result),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          record.eventType.banglaName,
                          style: AppTypography.body(fontWeight: FontWeight.bold),
                        ),
                      ),
                      Text(
                        _formatTime(record.timestamp),
                        style: AppTypography.caption(color: AppColors.textSecondaryLight),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    record.action,
                    style: AppTypography.body(),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'কর্তা: ${record.actorName}',
                        style: AppTypography.caption(color: AppColors.textSecondaryLight),
                      ),
                      const Icon(Icons.chevron_right, size: 18, color: AppColors.textSecondaryLight),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildResultBadge(SecurityEventResult result) {
    Color bg;
    Color fg;

    switch (result) {
      case SecurityEventResult.success:
        bg = Colors.green.shade50;
        fg = Colors.green.shade800;
        break;
      case SecurityEventResult.failed:
        bg = Colors.red.shade50;
        fg = Colors.red.shade800;
        break;
      case SecurityEventResult.blocked:
        bg = Colors.amber.shade50;
        fg = Colors.amber.shade900;
        break;
      case SecurityEventResult.denied:
        bg = Colors.purple.shade50;
        fg = Colors.purple.shade800;
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
        result.banglaName,
        style: TextStyle(color: fg, fontWeight: FontWeight.bold, fontSize: 11),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off_outlined, size: 54, color: AppColors.textSecondaryLight.withOpacity(0.4)),
          const SizedBox(height: 16),
          Text(
            'কোনো নিরাপত্তা অডিট রেকর্ড পাওয়া যায়নি',
            style: AppTypography.subheading(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'প্রদত্ত ফিল্টারের সাথে মিলে এমন কোনো ডেটা নেই।',
            style: AppTypography.body(color: AppColors.textSecondaryLight),
          ),
          const SizedBox(height: 16),
          AppButton(
            label: 'ফিল্টার রিসেট করুন',
            variant: AppButtonVariant.outline,
            onPressed: () {
              _searchController.clear();
              _controller.resetFilters();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(String msg) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 54, color: Colors.red),
          const SizedBox(height: 16),
          Text('ত্রুটি ঘটেছে', style: AppTypography.subheading(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(msg, style: AppTypography.body(color: AppColors.textSecondaryLight)),
          const SizedBox(height: 16),
          AppButton(
            label: 'পুনরায় চেষ্টা করুন',
            onPressed: () => _controller.loadAudits(),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime dt) {
    return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')} (${dt.day}/${dt.month})';
  }
}
