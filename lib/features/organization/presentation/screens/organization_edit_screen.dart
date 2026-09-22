import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_radius.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../core/context/organization_context.dart';
import '../../../../domain/entities/organization.dart';
import '../../../../shared/widgets/app_breadcrumbs.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/app_confirm_action.dart';
import '../../../../shared/widgets/app_dropdown.dart';
import '../../../../shared/widgets/app_form_validation.dart';
import '../../../../shared/widgets/app_text_field.dart';

/// OrganizationEditScreen: সমিতির তথ্য সম্পাদনা করার স্ক্রিন
///
/// Immutable Fields:
/// - Organization ID (স্থায়ী সিস্টেম আইডেন্টিফায়ার)
/// - Organization Code (অনন্য ও ব্যাকএন্ড-নিয়ন্ত্রিত)
///
/// Editable Fields:
/// - Name, Short Name, Type, Phone, Email, Address, Description, Logo
class OrganizationEditScreen extends StatefulWidget {
  final Organization organization;
  final VoidCallback onCancel;
  final ValueChanged<Organization> onSaved;

  const OrganizationEditScreen({
    super.key,
    required this.organization,
    required this.onCancel,
    required this.onSaved,
  });

  @override
  State<OrganizationEditScreen> createState() => _OrganizationEditScreenState();
}

class _OrganizationEditScreenState extends State<OrganizationEditScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _nameController;
  late TextEditingController _shortNameController;
  late TextEditingController _phoneController;
  late TextEditingController _emailController;
  late TextEditingController _addressController;
  late TextEditingController _descriptionController;
  late TextEditingController _logoUrlController;

  late OrganizationType _selectedType;
  late OrganizationStatus _selectedStatus;
  bool _isSaving = false;
  List<String> _validationErrors = [];

  @override
  void initState() {
    super.initState();
    final org = widget.organization;
    _nameController = TextEditingController(text: org.name);
    _shortNameController = TextEditingController(text: org.shortName);
    _phoneController = TextEditingController(text: org.phone ?? '');
    _emailController = TextEditingController(text: org.email ?? '');
    _addressController = TextEditingController(text: org.address ?? '');
    _descriptionController = TextEditingController(text: org.description ?? '');
    _logoUrlController = TextEditingController(text: org.logo ?? '');
    _selectedType = org.organizationType;
    _selectedStatus = org.status;
  }

  @override
  void dispose() {
    _nameController.dispose;
    _shortNameController.dispose;
    _phoneController.dispose;
    _emailController.dispose;
    _addressController.dispose;
    _descriptionController.dispose;
    _logoUrlController.dispose;
    super.dispose();
  }

  void _validateAndSave() async {
    final List<String> errors = [];

    final nameErr = AppFormValidation.organizationName(_nameController.text);
    if (nameErr != null) errors.add(nameErr);

    final phoneErr = AppFormValidation.optionalPhone(_phoneController.text);
    if (phoneErr != null) errors.add(phoneErr);

    final emailErr = AppFormValidation.email(_emailController.text);
    if (emailErr != null) errors.add(emailErr);

    final descErr = AppFormValidation.description(_descriptionController.text);
    if (descErr != null) errors.add(descErr);

    setState(() {
      _validationErrors = errors;
    });

    if (errors.isNotEmpty || !_formKey.currentState!.validate()) {
      return;
    }

    // নিশ্চিতকরণ ডায়ালগ
    final confirmed = await AppConfirmAction.show(
      context: context,
      title: 'পরিবর্তন সংরক্ষণ করুন',
      message: 'আপনি কি সংগঠনের হালনাগাদকৃত তথ্য সংরক্ষণ করতে চান?',
      confirmLabel: 'সংরক্ষণ করুন',
      cancelLabel: 'বাতিল',
    );

    if (confirmed != true) return;

    setState(() {
      _isSaving = true;
    });

    try {
      final normalizedName = _nameController.text.trim().replaceAll(RegExp(r'\s+'), ' ');
      final updated = widget.organization.copyWith(
        name: normalizedName,
        shortName: _shortNameController.text.trim(),
        organizationType: _selectedType,
        status: _selectedStatus,
        phone: _phoneController.text.trim().isEmpty ? null : _phoneController.text.trim(),
        email: _emailController.text.trim().isEmpty ? null : _emailController.text.trim(),
        address: _addressController.text.trim().isEmpty ? null : _addressController.text.trim(),
        description:
            _descriptionController.text.trim().isEmpty ? null : _descriptionController.text.trim(),
        logo: _logoUrlController.text.trim().isEmpty ? null : _logoUrlController.text.trim(),
        updatedAt: DateTime.now(),
        updatedBy: 'Authorized Admin',
      );

      // সেন্ট্রালাইজড অর্গানাইজেশন কনটেক্সট আপডেট
      await OrganizationContext.instance.setOrganization(updated);

      if (mounted) {
        widget.onSaved(updated);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _validationErrors = ['তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে: $e'];
          _isSaving = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.lg,
        vertical: AppSpacing.md,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ব্রেডক্রাম্বস
            AppBreadcrumbs(
              items: [
                const BreadcrumbItem(title: 'হোম', route: '/dashboard'),
                const BreadcrumbItem(title: 'সংগঠন ও নিরাপত্তা', route: '/organization-security'),
                BreadcrumbItem(title: 'সংগঠনের তথ্য', onTap: widget.onCancel),
                const BreadcrumbItem(title: 'সম্পাদনা'),
              ],
            ),
            const SizedBox(height: AppSpacing.md),

            // ফর্ম হেডার
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'সংগঠনের তথ্য সম্পাদনা',
                      style: AppTypography.heading1(
                        color: AppColors.textPrimaryLight,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'সমিতির নাম, যোগাযোগের ঠিকানা ও প্রাতিষ্ঠানিক বিবরণ হালনাগাদ করুন।',
                      style: AppTypography.bodySmall(color: AppColors.textSecondaryLight),
                    ),
                  ],
                ),
                Row(
                  children: [
                    AppButton.outline(
                      label: 'বাতিল',
                      icon: Icons.close,
                      size: AppButtonSize.small,
                      onPressed: widget.onCancel,
                    ),
                    const SizedBox(width: 8),
                    AppButton.primary(
                      label: _isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন',
                      icon: Icons.save_outlined,
                      size: AppButtonSize.small,
                      isLoading: _isSaving,
                      onPressed: _isSaving ? null : _validateAndSave,
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),

            // ভ্যালিডেশন এরর সারাংশ (যদি থাকে)
            if (_validationErrors.isNotEmpty)
              AppValidationErrorSummary(
                errors: _validationErrors,
                onDismiss: () => setState(() => _validationErrors = []),
              ),

            // ১. অপরিবর্তনীয় সিস্টেম আইডেন্টিফায়ার কার্ড (Immutable System IDs)
            _buildImmutableIdentifiersCard(),
            const SizedBox(height: AppSpacing.md),

            // ২. মৌলিক তথ্য ও বিবরণ কার্ড
            _buildBasicInfoCard(isMobile),
            const SizedBox(height: AppSpacing.md),

            // ৩. লোগো ও ব্র্যান্ডিং কার্ড
            _buildBrandingCard(),
            const SizedBox(height: AppSpacing.md),

            // ৪. যোগাযোগ ও ঠিকানা কার্ড
            _buildContactCard(isMobile),
            const SizedBox(height: AppSpacing.lg),

            // নিচের অ্যাকশন বাটনসমূহ
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                AppButton.outline(
                  label: 'বাতিল করুন',
                  size: AppButtonSize.medium,
                  onPressed: widget.onCancel,
                ),
                const SizedBox(width: 12),
                AppButton.primary(
                  label: 'তথ্য সংরক্ষণ করুন',
                  icon: Icons.check,
                  size: AppButtonSize.medium,
                  isLoading: _isSaving,
                  onPressed: _isSaving ? null : _validateAndSave,
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.xl),
          ],
        ),
      ),
    );
  }

  /// অপরিবর্তনীয় সিস্টেম আইডেন্টিফায়ার কার্ড
  Widget _buildImmutableIdentifiersCard() {
    return AppCard(
      title: 'সিস্টেম আইডেন্টিফায়ার (অপরিবর্তনীয়)',
      leadingIcon: Icons.lock_outline,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariantLight.withOpacity(0.5),
              borderRadius: AppRadius.radiusSm,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline, size: 18, color: AppColors.textSecondaryLight),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'সংগঠন আইডি ও অনন্য কোড সিস্টেম নিরাপত্তার স্বার্থে অপরিবর্তনীয়। এগুলো পরিবর্তন করা যাবে না।',
                    style: AppTypography.caption(color: AppColors.textSecondaryLight),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: AppTextField(
                  label: 'সংগঠন আইডি (Immutable ID)',
                  initialValue: widget.organization.id,
                  enabled: false,
                  prefixIcon: const Icon(Icons.fingerprint, size: 20),
                  helperText: 'সিস্টেম-জেনারেটেড স্থায়ী আইডেন্টিফায়ার',
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: AppTextField(
                  label: 'সংগঠন কোড (Unique Code)',
                  initialValue: widget.organization.organizationCode,
                  enabled: false,
                  prefixIcon: const Icon(Icons.qr_code, size: 20),
                  helperText: 'ব্যাকএন্ড-নিয়ন্ত্রিত অনন্য রেফারেন্স কোড',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// মৌলিক তথ্য কার্ড
  Widget _buildBasicInfoCard(bool isMobile) {
    return AppCard(
      title: 'মৌলিক বিবরণ ও প্রাতিষ্ঠানিক ধরন',
      leadingIcon: Icons.apartment_outlined,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppTextField(
            controller: _nameController,
            label: 'সংগঠনের পূর্ণ নাম *',
            hintText: 'যেমন: খুরুশকুল ওলামা সমিতি',
            prefixIcon: const Icon(Icons.domain, size: 20),
            validator: AppFormValidation.organizationName,
          ),
          const SizedBox(height: AppSpacing.md),
          if (isMobile) ...[
            AppTextField(
              controller: _shortNameController,
              label: 'সংক্ষিপ্ত নাম',
              hintText: 'যেমন: খুরুশকুল সমিতি',
              prefixIcon: const Icon(Icons.short_text, size: 20),
            ),
            const SizedBox(height: AppSpacing.md),
            _buildTypeDropdown(),
            const SizedBox(height: AppSpacing.md),
            _buildStatusDropdown(),
          ] else ...[
            Row(
              children: [
                Expanded(
                  child: AppTextField(
                    controller: _shortNameController,
                    label: 'সংক্ষিপ্ত নাম',
                    hintText: 'যেমন: খুরুশকুল সমিতি',
                    prefixIcon: const Icon(Icons.short_text, size: 20),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(child: _buildTypeDropdown()),
                const SizedBox(width: AppSpacing.md),
                Expanded(child: _buildStatusDropdown()),
              ],
            ),
          ],
          const SizedBox(height: AppSpacing.md),
          AppTextField(
            controller: _descriptionController,
            label: 'সংক্ষিপ্ত বিবরণ ও লক্ষ্য',
            hintText: 'সমিতির মূল লক্ষ্য ও উদ্দেশ্য সংক্ষেপে লিখুন...',
            maxLines: 3,
            validator: (v) => AppFormValidation.description(v, 500),
            helperText: 'সর্বোচ্চ ৫০০ অক্ষর',
          ),
        ],
      ),
    );
  }

  Widget _buildTypeDropdown() {
    return AppDropdown<OrganizationType>(
      label: 'সংগঠনের ধরন *',
      value: _selectedType,
      items: OrganizationType.values.map((type) {
        return DropdownMenuItem(
          value: type,
          child: Text(type.labelBn),
        );
      }).toList(),
      onChanged: (val) {
        if (val != null) {
          setState(() {
            _selectedType = val;
          });
        }
      },
    );
  }

  Widget _buildStatusDropdown() {
    return AppDropdown<OrganizationStatus>(
      label: 'বর্তমান অবস্থা *',
      value: _selectedStatus,
      items: OrganizationStatus.values.map((status) {
        return DropdownMenuItem(
          value: status,
          child: Text(status.labelBn),
        );
      }).toList(),
      onChanged: (val) {
        if (val != null) {
          setState(() {
            _selectedStatus = val;
          });
        }
      },
    );
  }

  /// লোগো ও ব্র্যান্ডিং ফাউন্ডেশন
  Widget _buildBrandingCard() {
    return AppCard(
      title: 'লোগো ও ব্র্যান্ডিং (Branding Foundation)',
      leadingIcon: Icons.image_outlined,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer,
                  borderRadius: AppRadius.radiusMd,
                  border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                ),
                child: _logoUrlController.text.trim().isNotEmpty
                    ? ClipRRect(
                        borderRadius: AppRadius.radiusMd,
                        child: Image.network(
                          _logoUrlController.text.trim(),
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.broken_image_outlined,
                            color: AppColors.textSecondaryLight,
                            size: 32,
                          ),
                        ),
                      )
                    : const Icon(
                        Icons.account_balance_outlined,
                        color: AppColors.primary,
                        size: 36,
                      ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AppTextField(
                      controller: _logoUrlController,
                      label: 'লোগো ইমেজ রেফারেন্স / URL',
                      hintText: 'https://example.com/logo.png',
                      prefixIcon: const Icon(Icons.link, size: 20),
                      onChanged: (_) => setState(() {}),
                      helperText: 'ভবিষ্যতের ক্লাউড স্টোরেজ বা ড্রাইভ রেফারেন্স যুক্ত করার সুযোগ থাকবে।',
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        if (_logoUrlController.text.isNotEmpty)
                          TextButton.icon(
                            icon: const Icon(Icons.delete_outline, size: 16, color: AppColors.error),
                            label: const Text(
                              'লোগো অপসারণ',
                              style: TextStyle(fontSize: 12, color: AppColors.error),
                            ),
                            onPressed: () {
                              setState(() {
                                _logoUrlController.clear();
                              });
                            },
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// যোগাযোগ ও ঠিকানা কার্ড
  Widget _buildContactCard(bool isMobile) {
    return AppCard(
      title: 'যোগাযোগ ও দাপ্তরিক ঠিকানা',
      leadingIcon: Icons.contact_mail_outlined,
      child: Column(
        children: [
          if (isMobile) ...[
            AppTextField(
              controller: _phoneController,
              label: 'অফিসিয়াল মোবাইল / ফোন নম্বর',
              hintText: '০১৭১২-৩৪৫৬৭৮',
              prefixIcon: const Icon(Icons.phone, size: 20),
              validator: AppFormValidation.optionalPhone,
            ),
            const SizedBox(height: AppSpacing.md),
            AppTextField(
              controller: _emailController,
              label: 'অফিসিয়াল ইমেইল ঠিকানা',
              hintText: 'info@samity.org',
              prefixIcon: const Icon(Icons.email, size: 20),
              validator: AppFormValidation.email,
            ),
          ] else ...[
            Row(
              children: [
                Expanded(
                  child: AppTextField(
                    controller: _phoneController,
                    label: 'অফিসিয়াল মোবাইল / ফোন নম্বর',
                    hintText: '০১৭১২-৩৪৫৬৭৮',
                    prefixIcon: const Icon(Icons.phone, size: 20),
                    validator: AppFormValidation.optionalPhone,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: AppTextField(
                    controller: _emailController,
                    label: 'অফিসিয়াল ইমেইল ঠিকানা',
                    hintText: 'info@samity.org',
                    prefixIcon: const Icon(Icons.email, size: 20),
                    validator: AppFormValidation.email,
                  ),
                ),
              ],
            ),
          ],
          const SizedBox(height: AppSpacing.md),
          AppTextField(
            controller: _addressController,
            label: 'দাপ্তরিক ঠিকানা',
            hintText: 'রোড/গ্রাম, ডাকঘর, উপজেলা, জেলা...',
            prefixIcon: const Icon(Icons.location_on_outlined, size: 20),
            maxLines: 2,
          ),
        ],
      ),
    );
  }
}
