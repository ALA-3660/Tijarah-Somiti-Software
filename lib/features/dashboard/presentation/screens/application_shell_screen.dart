import 'package:flutter/material.dart';
import '../../../../app/config/app_config.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../shared/layouts/app_scaffold.dart';
import '../../../../shared/widgets/app_card.dart';

/// ApplicationShellScreen: অ্যাপ্লিকেশন শেল (Foundation Shell)
///
/// প্রম্পট ১.১-এর উদ্দেশ্য অনুযায়ী এটি একটি সিম্পল অথচ শক্তিশালী শেল।
/// এটি অর্গানাইজেশন কনটেক্সট, এনভায়রনমেন্ট স্ট্যাটাস এবং ভবিষ্যতের
/// মডিউল ও নেভিগেশন যুক্ত করার জন্য প্রস্তুত ফ্রেম হিসেবে কাজ করে।
class ApplicationShellScreen extends StatefulWidget {
  const ApplicationShellScreen({super.key});

  @override
  State<ApplicationShellScreen> createState() => _ApplicationShellScreenState();
}

class _ApplicationShellScreenState extends State<ApplicationShellScreen> {
  // সক্রিয় অর্গানাইজেশন আইডি বা নাম (প্রাথমিক স্টেট)
  String _currentOrgName = 'আল-ফালাহ বহুমুখী সমবায় সমিতি';
  bool _isOrgActive = true;

  @override
  Widget build(BuildContext context) {
    final config = AppConfig.instance;

    return AppScaffold(
      title: config.appName,
      showBackButton: false,
      actions: [
        // Environment Badge (Dev / Staging / Prod)
        Padding(
          padding: const EdgeInsets.only(right: 12),
          child: Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.4)),
              ),
              child: Text(
                config.environment.name.toUpperCase(),
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ),
        ),
      ],
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ১. অর্গানাইজেশন কনটেক্সট হেডার কার্ড (Multi-tenancy Context)
            AppCard(
              backgroundColor: AppColors.primaryContainer.withOpacity(0.35),
              border: const BorderSide(color: AppColors.primaryLight, width: 1),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      Icons.account_balance,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'সক্রিয় সমিতি কনটেক্সট (Active Organization)',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primaryDark,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _currentOrgName,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimaryLight,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _isOrgActive
                          ? AppColors.success.withOpacity(0.15)
                          : AppColors.warning.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      _isOrgActive ? 'সক্রিয়' : 'অপেক্ষমাণ',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _isOrgActive ? AppColors.success : AppColors.secondary,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ২. আর্কিটেকচার স্টেটাস কার্ড (Foundation & Readiness)
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.verified, color: AppColors.primary, size: 20),
                      const SizedBox(width: 8),
                      const Text(
                        'আর্কিটেকচার ভিত্তি ও প্রস্তুতি',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimaryLight,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildStatusRow('প্রজেক্ট আর্কিটেকচার', 'Clean Layered Architecture (Active)'),
                  _buildStatusRow('ডেটাবেজ ও ব্যাকএন্ড ফ্রেমওয়ার্ক', 'Future Django REST + PostgreSQL Ready'),
                  _buildStatusRow('মাল্টি-টেন্যান্ট আইসোলেশন', 'X-Organization-Id Header Enforced'),
                  _buildStatusRow('আর্থিক নীতি (Rule 21)', 'Head ≠ Fund ≠ Account Abstraction Ready'),
                  _buildStatusRow('অডিট মেটাডেটা (Rule 22)', 'Created / Updated / Approved Trail Ready'),
                  _buildStatusRow('বর্তমান ধাপ', 'Prompt 1.1 — Foundation Complete'),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ৩. ইসলামি আর্থিক নীতি নির্দেশিকা (Head != Fund != Account)
            AppCard(
              backgroundColor: Colors.white,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'ইসলামি সমিতি পরিচালনার ৩টি মাত্রা (রুল ২১)',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryDark,
                    ),
                  ),
                  const SizedBox(height: 10),
                  _buildRulePill('খাত (Head)', 'টাকা কেন এসেছে বা কেন খরচ হয়েছে (e.g. ভর্তি ফি, অফিস ভাড়া)'),
                  const SizedBox(height: 6),
                  _buildRulePill('তহবিল (Fund)', 'টাকা কোন উদ্দেশ্য বা ফান্ডের অন্তর্গত (e.g. কল্যাণ তহবিল, সাধারণ তহবিল)'),
                  const SizedBox(height: 6),
                  _buildRulePill('হিসাব (Account)', 'টাকা বর্তমানে কোথায় জমা আছে (e.g. ক্যাশ ইন হ্যান্ড, ব্যাংক হিসাব)'),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // পরবর্তী প্রম্পট সম্পর্কিত তথ্য
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.amber.shade200),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.info_outline, color: Colors.amber.shade800, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'নির্দেশনা অনুযায়ী ফুল সাইডবার, মেম্বার বা ফিন্যান্স মডিউল এই প্রম্পটে তৈরি করা হয়নি। এগুলো পরবর্তী ধাপে (Prompt 1.2+) যুক্ত হবে।',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: Colors.amber.shade900,
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondaryLight),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.primary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRulePill(String title, String desc) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 90,
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: AppColors.primaryContainer,
            borderRadius: BorderRadius.circular(4),
          ),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: AppColors.primaryDark,
            ),
            textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            desc,
            style: const TextStyle(fontSize: 12, color: AppColors.textPrimaryLight),
          ),
        ),
      ],
    );
  }
}
