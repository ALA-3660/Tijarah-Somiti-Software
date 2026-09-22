import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_radius.dart';
import '../../../../core/state/ui_state.dart';
import '../../../../shared/widgets/widgets.dart';

/// ComponentShowcaseScreen: Prompt 1.4 রিইউজেবল UI কম্পোনেন্ট ও স্টেট গ্যালারি
///
/// ডেভেলপমেন্ট ও QA ভেরিফিকেশনের জন্য সকল কম্পোনেন্ট ও স্টেট ইন্টার‍্যাক্টিভভাবে উপস্থাপন করে।
class ComponentShowcaseScreen extends StatefulWidget {
  const ComponentShowcaseScreen({super.key});

  @override
  State<ComponentShowcaseScreen> createState() => _ComponentShowcaseScreenState();
}

class _ComponentShowcaseScreenState extends State<ComponentShowcaseScreen> {
  // Form & Input States
  final _textController = TextEditingController(text: 'আল-ফালাহ সমবায় সমিতি');
  final _amountController = TextEditingController(text: '৫০০০');
  String? _selectedDropdownValue = 'general';
  DateTime? _selectedDate = DateTime.now();
  DateTimeRange? _selectedDateRange;
  String _searchQuery = '';
  
  // Filter States
  late List<AppFilterChipItem> _filters;
  
  // Pagination State
  int _currentPage = 1;
  final int _totalPages = 5;
  final int _totalItems = 48;

  // Attachment State
  List<AppAttachmentItem> _attachments = [
    const AppAttachmentItem(id: '1', name: 'resolution_march_2026.pdf', sizeString: '১.২ মেগাবাইট'),
    const AppAttachmentItem(id: '2', name: 'trade_license_scan.jpg', sizeString: '৮৫০ কিলোবাইট'),
  ];

  // Active UiState Demo
  UiState<String> _currentDemoState = const UiState.success('সফলভাবে তথ্য লোড হয়েছে');

  @override
  void initState() {
    super.initState();
    _filters = [
      const AppFilterChipItem(id: 'all', label: 'সকল', isSelected: true),
      const AppFilterChipItem(id: 'active', label: 'সক্রিয়', count: '১২'),
      const AppFilterChipItem(id: 'pending', label: 'অপেক্ষমাণ', count: '৩'),
      const AppFilterChipItem(id: 'approved', label: 'অনুমোদিত', count: '২৫'),
    ];
  }

  @override
  void dispose() {
    _textController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  void _onFilterTap(AppFilterChipItem item) {
    setState(() {
      _filters = _filters.map((f) {
        if (f.id == item.id) {
          return AppFilterChipItem(
            id: f.id,
            label: f.label,
            count: f.count,
            icon: f.icon,
            isSelected: !f.isSelected,
          );
        }
        return f;
      }).toList();
    });
  }

  void _onClearAllFilters() {
    setState(() {
      _filters = _filters.map((f) {
        return AppFilterChipItem(
          id: f.id,
          label: f.label,
          count: f.count,
          icon: f.icon,
          isSelected: f.id == 'all',
        );
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Card
          Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusLg,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.primaryContainer,
                    borderRadius: AppRadius.radiusMd,
                  ),
                  child: const Icon(Icons.widgets_outlined, size: 28, color: AppColors.primary),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Prompt 1.4: Reusable UI Components & Application States',
                        style: TextStyle(
                          fontFamily: AppTypography.fontHeading,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড বাংলা-ফার্স্ট UI কম্পোনেন্ট ও স্টেট আর্কিটেকচার।',
                        style: TextStyle(
                          fontFamily: AppTypography.fontBody,
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'PROMPT 1.4 ACTIVE',
                    style: TextStyle(
                      fontFamily: AppTypography.fontMono,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppColors.success,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 1. Buttons & Icon Buttons
          _buildSection(
            title: '১. বাটন ও অ্যাকশন কন্ট্রোলস (Buttons & Action Controls)',
            subtitle: 'সবগুলো ভ্যারিয়েন্ট, সাইজ, লোডিং স্টেট ও অ্যাক্সেসিবিলিটি (৪৮×৪৮ dp)',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: AppSpacing.md,
                  runSpacing: AppSpacing.sm,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    AppButton.primary(
                      label: 'প্রাইমারি বাটন',
                      icon: Icons.check,
                      onPressed: () {},
                    ),
                    AppButton.secondary(
                      label: 'সেকেন্ডারি বাটন',
                      onPressed: () {},
                    ),
                    AppButton.outline(
                      label: 'আউটলাইন বাটন',
                      icon: Icons.file_download_outlined,
                      onPressed: () {},
                    ),
                    AppButton.text(
                      label: 'টেক্সট বাটন',
                      onPressed: () {},
                    ),
                    AppButton.destructive(
                      label: 'মুছে ফেলুন',
                      icon: Icons.delete_outline,
                      onPressed: () {},
                    ),
                    AppButton.success(
                      label: 'অনুমোদন করুন',
                      icon: Icons.done_all,
                      onPressed: () {},
                    ),
                    const AppButton.primary(
                      label: 'লোড হচ্ছে...',
                      isLoading: true,
                      onPressed: null,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                const Text(
                  'আইকন বাটনসমূহ (Icon Buttons):',
                  style: TextStyle(fontFamily: AppTypography.fontHeading, fontSize: 13, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: AppSpacing.xs),
                Wrap(
                  spacing: AppSpacing.sm,
                  children: [
                    AppIconButton(
                      icon: Icons.edit_outlined,
                      tooltip: 'সম্পাদনা করুন',
                      onPressed: () {},
                      variant: AppIconButtonVariant.primary,
                    ),
                    AppIconButton(
                      icon: Icons.print_outlined,
                      tooltip: 'প্রিন্ট করুন',
                      onPressed: () {},
                      variant: AppIconButtonVariant.secondary,
                    ),
                    AppIconButton(
                      icon: Icons.delete_outline,
                      tooltip: 'মুছুন',
                      onPressed: () {},
                      variant: AppIconButtonVariant.destructive,
                    ),
                    AppIconButton(
                      icon: Icons.share_outlined,
                      tooltip: 'শেয়ার করুন',
                      onPressed: () {},
                      variant: AppIconButtonVariant.outline,
                    ),
                    AppIconButton(
                      icon: Icons.info_outline,
                      tooltip: 'তথ্য',
                      onPressed: () {},
                      variant: AppIconButtonVariant.ghost,
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 2. Form Inputs, Dropdowns & Date Pickers
          _buildSection(
            title: '২. ফর্ম ইনপুট, ড্রপডাউন ও তারিখ চয়ন (Form Inputs & Pickers)',
            subtitle: 'বাংলা ভ্যালিডেশন মেসেজ, পাসওয়ার্ড টগল, সংখ্যা ও তারিখ রেঞ্জ সমর্থন',
            child: LayoutBuilder(
              builder: (context, constraints) {
                final isWide = constraints.maxWidth >= 700;
                return Column(
                  children: [
                    if (isWide)
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: AppTextField(
                              label: 'সমিতির নাম',
                              isRequired: true,
                              controller: _textController,
                              hintText: 'নাম লিখুন',
                              prefixIcon: const Icon(Icons.apartment, size: 18),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: AppTextField.currency(
                              label: 'জমার পরিমাণ (টাকা)',
                              isRequired: true,
                              controller: _amountController,
                              hintText: '০.০০',
                            ),
                          ),
                        ],
                      )
                    else ...[
                      AppTextField(
                        label: 'সমিতির নাম',
                        isRequired: true,
                        controller: _textController,
                        hintText: 'নাম লিখুন',
                        prefixIcon: const Icon(Icons.apartment, size: 18),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      AppTextField.currency(
                        label: 'জমার পরিমাণ (টাকা)',
                        isRequired: true,
                        controller: _amountController,
                        hintText: '০.০০',
                      ),
                    ],

                    const SizedBox(height: AppSpacing.md),

                    if (isWide)
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: AppDropdown<String>(
                              label: 'তহবিল নির্বাচন (Fund Selection)',
                              isRequired: true,
                              hint: 'তহবিল বেছে নিন',
                              value: _selectedDropdownValue,
                              items: const [
                                AppDropdownItem(value: 'general', label: 'সাধারণ তহবিল', subtitle: 'General Operating Fund'),
                                AppDropdownItem(value: 'welfare', label: 'কল্যাণ তহবিল', subtitle: 'Member Welfare Fund'),
                                AppDropdownItem(value: 'share', label: 'শেয়ার মূলধন তহবিল', subtitle: 'Capital Share Fund'),
                                AppDropdownItem(value: 'project', label: 'প্রকল্প তহবিল', subtitle: 'Project Investment Fund'),
                              ],
                              onChanged: (val) => setState(() => _selectedDropdownValue = val),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: AppDatePicker(
                              label: 'লেনদেনের তারিখ',
                              isRequired: true,
                              selectedDate: _selectedDate,
                              onDateSelected: (date) => setState(() => _selectedDate = date),
                            ),
                          ),
                        ],
                      )
                    else ...[
                      AppDropdown<String>(
                        label: 'তহবিল নির্বাচন (Fund Selection)',
                        isRequired: true,
                        hint: 'তহবিল বেছে নিন',
                        value: _selectedDropdownValue,
                        items: const [
                          AppDropdownItem(value: 'general', label: 'সাধারণ তহবিল', subtitle: 'General Operating Fund'),
                          AppDropdownItem(value: 'welfare', label: 'কল্যাণ তহবিল', subtitle: 'Member Welfare Fund'),
                          AppDropdownItem(value: 'share', label: 'শেয়ার মূলধন তহবিল', subtitle: 'Capital Share Fund'),
                          AppDropdownItem(value: 'project', label: 'প্রকল্প তহবিল', subtitle: 'Project Investment Fund'),
                        ],
                        onChanged: (val) => setState(() => _selectedDropdownValue = val),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      AppDatePicker(
                        label: 'লেনদেনের তারিখ',
                        isRequired: true,
                        selectedDate: _selectedDate,
                        onDateSelected: (date) => setState(() => _selectedDate = date),
                      ),
                    ],

                    const SizedBox(height: AppSpacing.md),

                    AppDateRangePicker(
                      selectedRange: _selectedDateRange,
                      onRangeSelected: (range) => setState(() => _selectedDateRange = range),
                    ),
                  ],
                );
              },
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 3. Search & Filter Bar
          _buildSection(
            title: '৩. সার্চ ও ফিল্টার বার (Search & Filter Bar)',
            subtitle: 'ডিব্যউন্সড সার্চ, ফিল্টার চিপস ও অ্যাক্টিভ ফিল্টার রিসেট ব্যবস্থা',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppSearchField(
                  hint: 'সদস্য নাম, কোড বা মোবাইল নম্বর দিয়ে খুঁজুন...',
                  onSearch: (q) => setState(() => _searchQuery = q),
                ),
                if (_searchQuery.isNotEmpty) ...[
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    'অনুসন্ধান করা হচ্ছে: "$_searchQuery"',
                    style: const TextStyle(fontFamily: AppTypography.fontBody, fontSize: 12, color: AppColors.primary),
                  ),
                ],
                const SizedBox(height: AppSpacing.md),
                AppFilterBar(
                  filters: _filters,
                  onFilterSelected: _onFilterTap,
                  onClearAll: _onClearAllFilters,
                  activeFilterSummary: 'ফিল্টারকৃত তথ্য দেখানো হচ্ছে',
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 4. Badges & Shariah Status Badges
          _buildSection(
            title: '৪. স্ট্যাটাস ব্যাজ ও শরিয়াহ ব্যাজ (Status & Shariah Badges)',
            subtitle: 'জেনেরিক সিস্টেম স্ট্যাটাস এবং শরিয়াহ নির্দেশিকা টোকেন',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('সিস্টেম স্ট্যাটাস ব্যাজসমূহ (System Status):', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: AppSpacing.xs),
                const Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.xs,
                  children: [
                    AppStatusBadge(status: AppGenericStatus.active),
                    AppStatusBadge(status: AppGenericStatus.pending),
                    AppStatusBadge(status: AppGenericStatus.approved),
                    AppStatusBadge(status: AppGenericStatus.rejected),
                    AppStatusBadge(status: AppGenericStatus.draft),
                    AppStatusBadge(status: AppGenericStatus.completed),
                    AppStatusBadge(status: AppGenericStatus.cancelled),
                    AppStatusBadge(status: AppGenericStatus.requiresReview),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                const Text('শরিয়াহ গাইডেন্স ব্যাজসমূহ (Informational Only):', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: AppSpacing.xs),
                const Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.xs,
                  children: [
                    AppShariahBadge(status: AppShariahStatus.shariahCompliant),
                    AppShariahBadge(status: AppShariahStatus.underReview),
                    AppShariahBadge(status: AppShariahStatus.guidanceRequired),
                    AppShariahBadge(status: AppShariahStatus.documentationPending),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 5. Currency & Number Display
          _buildSection(
            title: '৫. টাকা ও সংখ্যা প্রদর্শন (Currency & Number Formatting)',
            subtitle: 'দক্ষিণ এশীয় কমা বিভাজন, বাংলা সংখ্যা ও বিভিন্ন স্কেল',
            child: Wrap(
              spacing: AppSpacing.xl,
              runSpacing: AppSpacing.md,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                const AppCurrencyDisplay(
                  amount: 1250000,
                  size: CurrencyDisplaySize.large,
                  label: 'মোট শেয়ার মূলধন',
                ),
                const AppCurrencyDisplay(
                  amount: 45000,
                  size: CurrencyDisplaySize.medium,
                  label: 'চলতি মাসের আদায়',
                ),
                const AppCurrencyDisplay(
                  amount: 7500,
                  size: CurrencyDisplaySize.small,
                  label: 'অফিস ব্যয়',
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('শতাংশ ও কাউন্টার:', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 4),
                    Row(
                      children: const [
                        AppNumberDisplay(value: 85.5, isPercentage: true, decimalPlaces: 1, fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primary),
                        SizedBox(width: AppSpacing.md),
                        AppNumberDisplay(value: 12500, isCompact: true, fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.secondary),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 6. Interactive Dialogs, BottomSheet, Snackbars & Confirm Action
          _buildSection(
            title: '৬. ডায়ালগ, বটম শিট, টোস্ট ও নিশ্চিতকরণ কার্ড (Feedback & Modals)',
            subtitle: 'ইউজার ফিডব্যাক, মাল্টি-টাইপ ডায়ালগ ও আর্থিক কার্যক্রমে স্পষ্ট কনফার্মেশন',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: [
                    AppButton.outline(
                      label: 'সফলতা টোস্ট',
                      icon: Icons.check_circle_outline,
                      onPressed: () => AppSnackbar.showSuccess(context, message: 'সদস্যের তথ্য সফলভাবে সংরক্ষিত হয়েছে।'),
                    ),
                    AppButton.outline(
                      label: 'এরর টোস্ট',
                      icon: Icons.error_outline,
                      onPressed: () => AppSnackbar.showError(context, message: 'নেটওয়ার্ক সমস্যার কারণে লেনদেন সম্পন্ন হয়নি।'),
                    ),
                    AppButton.outline(
                      label: 'সতর্কতা টোস্ট',
                      icon: Icons.warning_amber_rounded,
                      onPressed: () => AppSnackbar.showWarning(context, message: 'দয়া করে ইনপুট তথ্য পুনরায় যাচাই করুন।'),
                    ),
                    AppButton.outline(
                      label: 'তথ্য ডায়ালগ',
                      icon: Icons.info_outline,
                      onPressed: () => AppDialog.showInfo(
                        context,
                        title: 'শরিয়াহ নীতিমালা সহায়িকা',
                        message: 'এই সফটওয়্যারটি ইসলামি সমবায় নীতি অনুসারে খাঁদ, তহবিল ও হিসাবের স্পষ্ট বিভাজন বজায় রাখে।',
                      ),
                    ),
                    AppButton.outline(
                      label: 'কনফার্মেশন ডায়ালগ',
                      icon: Icons.help_outline,
                      onPressed: () async {
                        final confirmed = await AppDialog.showConfirmation(
                          context,
                          title: 'ভাউচার অনুমোদন নিশ্চিতকরণ',
                          message: 'আপনি কি এই জমা ভাউচারটি চূড়ান্তভাবে অনুমোদন করতে চান?',
                        );
                        if (confirmed == true && context.mounted) {
                          AppSnackbar.showSuccess(context, message: 'ভাউচারটি অনুমোদিত হয়েছে।');
                        }
                      },
                    ),
                    AppButton.outline(
                      label: 'বটম শিট খুলুন',
                      icon: Icons.vertical_align_top,
                      onPressed: () {
                        AppBottomSheet.show(
                          context: context,
                          title: 'দ্রুত লেনদেন বিবরণী',
                          subtitle: 'আল-ফালাহ সমবায় সমিতি',
                          content: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text('এটি একটি মোবাইল-বান্ধব বটম শিট লেআউট। এখানে যেকোনো ফর্ম বা ফিল্টার স্থাপন করা যাবে।'),
                              SizedBox(height: 12),
                              AppStatusBadge(status: AppGenericStatus.active),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),

                const SizedBox(height: AppSpacing.lg),

                // Inline Confirm Action Card Preview
                AppConfirmAction(
                  title: 'শেয়ার বরাদ্দ চূড়ান্তকরণ (Final Share Allocation)',
                  warningMessage: 'শেয়ার বরাদ্দ সম্পন্ন হলে তা জেনারেল লেজারে পোস্ট হবে এবং স্বয়ংক্রিয়ভাবে সার্টিফিকেট প্রস্তুত হবে।',
                  details: 'সদস্য কোড: TM-0104 • মোট শেয়ার: ৫০ টি • মোট মূল্য: ৫০,০০০ টাকা',
                  onConfirm: () {
                    AppSnackbar.showSuccess(context, message: 'শেয়ার বরাদ্দ নিশ্চিত করা হয়েছে।');
                  },
                  onCancel: () {},
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 7. Stat Cards & Responsive Data Table
          _buildSection(
            title: '৭. স্ট্যাট কার্ড ও রেসপনসিভ ডাটা টেবিল (Stat Cards & Data Table)',
            subtitle: 'ড্যাশবোর্ড ম্যাট্রিক্স ও রেসপনসিভ টেবিল (মোবাইলে স্বয়ংক্রিয় কার্ড মোড)',
            child: Column(
              children: [
                LayoutBuilder(
                  builder: (context, constraints) {
                    final isWide = constraints.maxWidth >= 800;
                    return isWide
                        ? Row(
                            children: [
                              Expanded(
                                child: AppStatCard(
                                  title: 'মোট সদস্য',
                                  value: '১২৮',
                                  unit: 'জন',
                                  icon: Icons.group,
                                  accentColor: AppColors.primary,
                                  trendLabel: '+৮ জন এই মাসে',
                                  isDemo: true,
                                ),
                              ),
                              const SizedBox(width: AppSpacing.md),
                              Expanded(
                                child: AppStatCard(
                                  title: 'মোট শেয়ার তহবিল',
                                  value: '১২,৫০,০০০',
                                  unit: 'টাকা',
                                  icon: Icons.pie_chart,
                                  accentColor: AppColors.secondary,
                                  trendLabel: '+৫.২% প্রবৃদ্ধি',
                                  isDemo: true,
                                ),
                              ),
                              const SizedBox(width: AppSpacing.md),
                              Expanded(
                                child: AppStatCard(
                                  title: 'চলতি প্রকল্প সংখ্যা',
                                  value: '৪',
                                  unit: 'টি',
                                  icon: Icons.workspaces_outlined,
                                  accentColor: AppColors.info,
                                  isDemo: true,
                                ),
                              ),
                            ],
                          )
                        : Column(
                            children: [
                              AppStatCard(
                                title: 'মোট সদস্য',
                                value: '১২৮',
                                unit: 'জন',
                                icon: Icons.group,
                                accentColor: AppColors.primary,
                                trendLabel: '+৮ জন এই মাসে',
                                isDemo: true,
                              ),
                              const SizedBox(height: AppSpacing.sm),
                              AppStatCard(
                                title: 'মোট শেয়ার তহবিল',
                                value: '১২,৫০,০০০',
                                unit: 'টাকা',
                                icon: Icons.pie_chart,
                                accentColor: AppColors.secondary,
                                trendLabel: '+৫.২% প্রবৃদ্ধি',
                                isDemo: true,
                              ),
                            ],
                          );
                  },
                ),

                const SizedBox(height: AppSpacing.lg),

                // Responsive Data Table
                AppDataTable<Map<String, String>>(
                  columns: [
                    AppTableColumn(
                      title: 'কোড',
                      cellBuilder: (item) => Text(
                        item['code']!,
                        style: const TextStyle(fontFamily: AppTypography.fontMono, fontWeight: FontWeight.bold),
                      ),
                    ),
                    AppTableColumn(
                      title: 'সদস্যের নাম',
                      cellBuilder: (item) => Text(item['name']!),
                    ),
                    AppTableColumn(
                      title: 'মোবাইল নম্বর',
                      cellBuilder: (item) => Text(item['phone']!),
                    ),
                    AppTableColumn(
                      title: 'শেয়ার সংখ্যা',
                      isNumeric: true,
                      cellBuilder: (item) => Text(
                        item['shares']!,
                        style: const TextStyle(fontFamily: AppTypography.fontNumeric, fontWeight: FontWeight.w600),
                      ),
                    ),
                    AppTableColumn(
                      title: 'স্ট্যাটাস',
                      cellBuilder: (item) => const AppStatusBadge(status: AppGenericStatus.active),
                    ),
                  ],
                  items: const [
                    {'code': 'TM-001', 'name': 'আব্দুর রহমান', 'phone': '০১৭১২-৩৪৫৬৭৮', 'shares': '১০'},
                    {'code': 'TM-002', 'name': 'মাহমুদুল হাসান', 'phone': '০১৮২৩-৪৫৬৭৮৯', 'shares': '২৫'},
                    {'code': 'TM-003', 'name': 'মুহাম্মদ ইব্রাহীম', 'phone': '০১৯৩৪-৫৬৭৮৯০', 'shares': '১৫'},
                  ],
                  mobileCardBuilder: (item) => AppListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppColors.primaryContainer,
                      child: Text(item['name']!.substring(0, 1), style: const TextStyle(color: AppColors.primaryDark)),
                    ),
                    title: item['name']!,
                    subtitle: '${item['code']} • ${item['phone']}',
                    trailing: Text(
                      '${item['shares']} টি শেয়ার',
                      style: const TextStyle(fontFamily: AppTypography.fontNumeric, fontWeight: FontWeight.bold),
                    ),
                  ),
                  pagination: AppPagination(
                    currentPage: _currentPage,
                    totalPages: _totalPages,
                    totalItems: _totalItems,
                    onPageChanged: (page) => setState(() => _currentPage = page),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 8. Attachment Picker & List Tiles
          _buildSection(
            title: '৮. ফাইল সংযুক্তি ও লিস্ট ভিউ (Attachments & List Tiles)',
            subtitle: 'ডকুমেন্ট আপলোড ফ্রেম ও টাচ-টার্গেট মানসম্পন্ন লিস্ট আইটেম',
            child: Column(
              children: [
                AppAttachmentPicker(
                  attachments: _attachments,
                  onPickFile: () {
                    setState(() {
                      _attachments = [
                        ..._attachments,
                        AppAttachmentItem(
                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                          name: 'sample_doc_${_attachments.length + 1}.pdf',
                          sizeString: '১.৫ মেগাবাইট',
                        ),
                      ];
                    });
                  },
                  onRemove: (item) {
                    setState(() {
                      _attachments = _attachments.where((a) => a.id != item.id).toList();
                    });
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 9. Application States (UiState, Skeleton, Empty, Error, Network, Permission)
          _buildSection(
            title: '৯. অ্যাপ্লিকেশন স্টেট মডেল (Standard Application States)',
            subtitle: 'UiState প্যাটার্ন: Loading, Skeleton, Empty, Error, Network Offline & Permission Restricted',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.xs,
                  children: [
                    AppButton.outline(
                      label: 'লোডিং স্টেট',
                      size: AppButtonSize.sm,
                      onPressed: () => setState(() => _currentDemoState = const UiState.loading()),
                    ),
                    AppButton.outline(
                      label: 'এম্পটি স্টেট',
                      size: AppButtonSize.sm,
                      onPressed: () => setState(() => const UiState.empty()),
                    ),
                    AppButton.outline(
                      label: 'এরর স্টেট',
                      size: AppButtonSize.sm,
                      onPressed: () => setState(() => const UiState.error('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।')),
                    ),
                    AppButton.outline(
                      label: 'অফলাইন স্টেট',
                      size: AppButtonSize.sm,
                      onPressed: () => setState(() => const UiState.offline()),
                    ),
                    AppButton.outline(
                      label: 'অনুমতি নেই স্টেট',
                      size: AppButtonSize.sm,
                      onPressed: () => setState(() => const UiState.forbidden()),
                    ),
                    AppButton.outline(
                      label: 'সাকসেস স্টেট',
                      size: AppButtonSize.sm,
                      onPressed: () => setState(() => const UiState.success('সফলভাবে লোড হয়েছে')),
                    ),
                  ],
                ),

                const SizedBox(height: AppSpacing.lg),

                // State Container Preview
                Container(
                  width: double.infinity,
                  constraints: const BoxConstraints(minHeight: 220),
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.neutral50,
                    borderRadius: AppRadius.radiusLg,
                    border: Border.all(color: AppColors.borderLight),
                  ),
                  child: _currentDemoState.when(
                    initial: () => const Center(child: Text('স্টেট বাটন নির্বাচন করুন')),
                    loading: (msg) => AppLoading(message: msg ?? 'তথ্য লোড হচ্ছে...'),
                    success: (data) => Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 44),
                        const SizedBox(height: 8),
                        Text(
                          data,
                          style: const TextStyle(
                            fontFamily: AppTypography.fontHeading,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const AppSkeletonCard(),
                      ],
                    ),
                    empty: (msg) => AppEmptyState(
                      title: 'কোনো তথ্য পাওয়া যায়নি',
                      description: msg ?? 'এই তালিকায় বর্তমানে কোনো সক্রিয় রেকর্ড নেই।',
                      primaryActionLabel: '+ নতুন সদস্য যুক্ত করুন',
                      onPrimaryAction: () {},
                    ),
                    error: (msg, code) => AppErrorState(
                      message: msg,
                      technicalCode: code ?? 'ERR_500_NET',
                      onRetry: () => setState(() => _currentDemoState = const UiState.success('পুনরায় লোড সম্পন্ন হয়েছে')),
                    ),
                    offline: (msg) => AppNetworkStateWidget(
                      status: AppNetworkStatus.offline,
                      onRetry: () => setState(() => _currentDemoState = const UiState.success('অনলাইনে সংযুক্ত হয়েছে')),
                    ),
                    unauthorized: (msg) => const AppNetworkStateWidget(status: AppNetworkStatus.unauthorized),
                    forbidden: (msg) => const AppPermissionState(requiredRoleOrPermission: 'ROLE_FINANCE_APPROVER'),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // 10. Cards, Section Headers & Breadcrumbs
          _buildSection(
            title: '১০. কার্ড, সেকশন হেডার ও ব্রেডক্রাম্বস (Cards, Headers & Breadcrumbs)',
            subtitle: 'AppCard (সাধারণ, সিলেক্টেবল, এক্সপ্যান্ডেবল), AppSectionHeader ও AppBreadcrumbs',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // AppBreadcrumbs
                const Text('ব্রেডক্রাম্বস নেভিগেশন (AppBreadcrumbs):', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: AppSpacing.xs),
                Container(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: AppColors.neutral50,
                    borderRadius: AppRadius.radiusMd,
                    border: Border.all(color: AppColors.borderLight),
                  ),
                  child: AppBreadcrumbs(
                    items: const [
                      BreadcrumbItem(label: 'হোম', route: '/dashboard'),
                      BreadcrumbItem(label: 'সদস্য ব্যবস্থাপনা', route: '/members'),
                      BreadcrumbItem(label: 'সদস্য প্রোফাইল (TM-0104)'),
                    ],
                    onNavigate: (route) {
                      AppSnackbar.showInfo(context, message: 'নেভিগেশন রুট: $route');
                    },
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

                // AppSectionHeader
                const Text('সেকশন হেডার (AppSectionHeader):', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: AppSpacing.xs),
                AppSectionHeader(
                  title: 'চলতি লেনদেন তালিকা',
                  subtitle: 'সর্বশেষ ১০টি লেনদেনের সারসংক্ষেপ',
                  icon: Icons.receipt_long_outlined,
                  action: AppButton.outline(
                    label: 'নতুন সংযোজন',
                    size: AppButtonSize.sm,
                    icon: Icons.add,
                    onPressed: () {},
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

                // AppCard Variants
                const Text('কার্ড ভ্যারিয়েন্টসমূহ (AppCard):', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: AppSpacing.xs),
                LayoutBuilder(
                  builder: (context, constraints) {
                    final isWide = constraints.maxWidth >= 700;
                    return isWide
                        ? Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: AppCard(
                                  title: 'স্ট্যান্ডার্ড কার্ড',
                                  subtitle: 'সাবটাইটেল ও লিডিং আইকন সম্বলিত',
                                  leading: const Icon(Icons.account_balance, color: AppColors.primary),
                                  trailing: const AppStatusBadge(status: AppGenericStatus.active),
                                  child: const Text('এটি একটি স্ট্যান্ডার্ড অ্যাপ কার্ড কন্টেইনার।'),
                                ),
                              ),
                              const SizedBox(width: AppSpacing.md),
                              Expanded(
                                child: AppCard(
                                  title: 'এক্সপ্যান্ডেবল কার্ড',
                                  subtitle: 'ক্লিক করে বিস্তারিত দেখুন',
                                  isExpandable: true,
                                  child: const Text('সাধারণ বিবরণ এখানে দেখা যাচ্ছে।'),
                                  expandedContent: const Text(
                                    'এটি এক্সপ্যান্ডেবল বিস্তারিত অংশ যা টগল ক্লিকে দৃশ্যমান হয়।',
                                    style: TextStyle(color: AppColors.primary, fontSize: 13),
                                  ),
                                ),
                              ),
                            ],
                          )
                        : Column(
                            children: [
                              AppCard(
                                title: 'স্ট্যান্ডার্ড কার্ড',
                                subtitle: 'সাবটাইটেল ও লিডিং আইকন সম্বলিত',
                                leading: const Icon(Icons.account_balance, color: AppColors.primary),
                                trailing: const AppStatusBadge(status: AppGenericStatus.active),
                                child: const Text('এটি একটি স্ট্যান্ডার্ড অ্যাপ কার্ড কন্টেইনার।'),
                              ),
                              const SizedBox(height: AppSpacing.md),
                              AppCard(
                                title: 'এক্সপ্যান্ডেবল কার্ড',
                                subtitle: 'ক্লিক করে বিস্তারিত দেখুন',
                                isExpandable: true,
                                child: const Text('সাধারণ বিবরণ এখানে দেখা যাচ্ছে।'),
                                expandedContent: const Text(
                                  'এটি এক্সপ্যান্ডেবল বিস্তারিত অংশ যা টগল ক্লিকে দৃশ্যমান হয়।',
                                  style: TextStyle(color: AppColors.primary, fontSize: 13),
                                ),
                              ),
                            ],
                          );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xxl),
        ],
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required String subtitle,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontFamily: AppTypography.fontHeading,
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.primaryDark,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: const TextStyle(
              fontFamily: AppTypography.fontBody,
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          const Divider(height: 1, color: AppColors.borderLight),
          const SizedBox(height: AppSpacing.md),
          child,
        ],
      ),
    );
  }
}
