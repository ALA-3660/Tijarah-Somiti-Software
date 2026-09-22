import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_radius.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/authorization/permission_keys.dart';
import '../../../../core/authorization/route_permission_guard.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../domain/entities/security_session.dart';
import '../controllers/session_security_controller.dart';
import '../widgets/session_card.dart';

/// SessionSecurityScreen: সেশন ও ডিভাইস নিরাপত্তা স্ক্রিন
class SessionSecurityScreen extends StatefulWidget {
  const SessionSecurityScreen({super.key});

  @override
  State<SessionSecurityScreen> createState() => _SessionSecurityScreenState();
}

class _SessionSecurityScreenState extends State<SessionSecurityScreen> {
  late final SessionSecurityController _controller;
  int _selectedFilterIndex = 0; // 0: সকল, 1: শুধু সক্রিয়, 2: সমাপ্ত/মেয়াদোত্তীর্ণ

  @override
  void initState() {
    super.initState();
    _controller = SessionSecurityController();
    _controller.loadSessions();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RoutePermissionGuard(
      requiredPermission: PermissionKeys.sessionView,
      child: Scaffold(
        backgroundColor: AppColors.backgroundLight,
        body: AnimatedBuilder(
          animation: _controller,
          builder: (context, _) {
            return Column(
              children: [
                // ১. হেডার
                _buildHeader(context),

                // ২. মূল কনটেন্ট
                Expanded(
                  child: _controller.state.when(
                    initial: () => const Center(child: CircularProgressIndicator()),
                    loading: () => const Center(child: CircularProgressIndicator()),
                    error: (msg) => _buildErrorState(msg),
                    empty: () => _buildEmptyState(),
                    success: (sessions) => _buildSessionContent(sessions),
                  ),
                ),
              ],
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
              Icons.devices_outlined,
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
                  'সেশন ও ডিভাইস নিরাপত্তা',
                  style: AppTypography.heading2(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimaryLight,
                  ),
                ),
                Text(
                  'সক্রিয় ব্যবহারকারী সেশন পর্যবেক্ষণ ও দূরবর্তী সেশন সমাপ্তিকরণ',
                  style: AppTypography.caption(color: AppColors.textSecondaryLight),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'রিলোড করুন',
            onPressed: () => _controller.loadSessions(),
          ),
        ],
      ),
    );
  }

  Widget _buildSessionContent(List<SecuritySession> allSessions) {
    // ফিল্টার অনুযায়ী তালিকা
    final filteredSessions = allSessions.where((s) {
      if (_selectedFilterIndex == 1) return s.isActive;
      if (_selectedFilterIndex == 2) return !s.isActive;
      return true;
    }).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // বর্তমান সেশন হাইলাইট কার্ড
          if (_controller.currentSession != null) ...[
            Text(
              'আপনার বর্তমান সেশন (Current Device)',
              style: AppTypography.subheading(
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 12),
            SessionCard(
              session: _controller.currentSession!,
              isCurrent: true,
            ),
            const SizedBox(height: 32),
          ],

          // ফিল্টার ট্যাব ও সেকশন টাইটেল
          Row(
            children: [
              Expanded(
                child: Text(
                  'সংগঠনের সেশন তালিকা (${filteredSessions.length})',
                  style: AppTypography.subheading(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimaryLight,
                  ),
                ),
              ),
              _buildFilterChips(),
            ],
          ),

          const SizedBox(height: 16),

          // সেশন গ্রিড বা তালিকা
          LayoutBuilder(
            builder: (context, constraints) {
              final isWide = constraints.maxWidth >= 900;
              final crossAxisCount = isWide ? 3 : (constraints.maxWidth >= 600 ? 2 : 1);

              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: filteredSessions.length,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: crossAxisCount,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  mainAxisExtent: 310,
                ),
                itemBuilder: (context, index) {
                  final session = filteredSessions[index];
                  final isCurrent = session.sessionId == _controller.currentSession?.sessionId;

                  return SessionCard(
                    session: session,
                    isCurrent: isCurrent,
                    onTerminate: (sessionId, reason) async {
                      final success = await _controller.terminateSession(
                        sessionId: sessionId,
                        actorUserId: 'USR-000001',
                        reason: reason,
                      );

                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              success
                                  ? 'সেশন সফলভাবে সমাপ্ত করা হয়েছে এবং নিরাপত্তা অডিটে লিপিবদ্ধ হয়েছে।'
                                  : 'সেশন সমাপ্ত করতে ব্যর্থ হয়েছে।',
                            ),
                            backgroundColor: success ? Colors.green : Colors.red,
                          ),
                        );
                      }
                    },
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChips() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusMd,
        border: Border.all(color: AppColors.borderLight),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildFilterChip('সকল', 0),
          _buildFilterChip('সক্রিয়', 1),
          _buildFilterChip('মেয়াদোত্তীর্ণ/সমাপ্ত', 2),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, int index) {
    final isSelected = _selectedFilterIndex == index;
    return InkWell(
      onTap: () => setState(() => _selectedFilterIndex = index),
      borderRadius: AppRadius.radiusSm,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryContainer : Colors.transparent,
          borderRadius: AppRadius.radiusSm,
        ),
        child: Text(
          label,
          style: AppTypography.caption(
            color: isSelected ? AppColors.primary : AppColors.textSecondaryLight,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.devices_outlined, size: 54, color: AppColors.textSecondaryLight.withOpacity(0.4)),
          const SizedBox(height: 16),
          Text(
            'কোনো সেশন ডেটা পাওয়া যায়নি',
            style: AppTypography.subheading(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          AppButton(
            label: 'রিলোড করুন',
            onPressed: () => _controller.loadSessions(),
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
            onPressed: () => _controller.loadSessions(),
          ),
        ],
      ),
    );
  }
}
