import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_dialog.dart';
import '../../../../shared/widgets/app_dropdown.dart';
import '../../../../shared/widgets/app_text_field.dart';
import '../../domain/entities/member.dart';
import '../controllers/member_controller.dart';

/// EditMemberDialog: সদস্য তথ্য সংশোধন ডায়ালগ
class EditMemberDialog extends StatefulWidget {
  final Member member;
  final String organizationId;
  final String actorUserId;
  final String actorName;
  final MemberController controller;

  const EditMemberDialog({
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
      builder: (context) => EditMemberDialog(
        member: member,
        organizationId: organizationId,
        actorUserId: actorUserId,
        actorName: actorName,
        controller: controller,
      ),
    );
  }

  @override
  State<EditMemberDialog> createState() => _EditMemberDialogState();
}

class _EditMemberDialogState extends State<EditMemberDialog> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _mobileController;
  late final TextEditingController _emailController;
  late final TextEditingController _occupationController;
  late final TextEditingController _fatherSpouseController;
  late final TextEditingController _motherController;
  late final TextEditingController _nidController;
  late final TextEditingController _addressController;
  late final TextEditingController _notesController;

  late String _selectedGender;
  late DateTime? _selectedDob;
  bool _isSubmitting = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    final m = widget.member;
    _nameController = TextEditingController(text: m.fullName);
    _mobileController = TextEditingController(text: m.mobile);
    _emailController = TextEditingController(text: m.email ?? '');
    _occupationController = TextEditingController(text: m.occupation ?? '');
    _fatherSpouseController = TextEditingController(text: m.fatherOrSpouseName ?? '');
    _motherController = TextEditingController(text: m.motherName ?? '');
    _nidController = TextEditingController(text: m.nid ?? '');
    _addressController = TextEditingController(text: m.address ?? '');
    _notesController = TextEditingController(text: m.notes ?? '');
    _selectedGender = m.gender ?? 'male';
    _selectedDob = m.dateOfBirth;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _mobileController.dispose();
    _emailController.dispose();
    _occupationController.dispose();
    _fatherSpouseController.dispose();
    _motherController.dispose();
    _nidController.dispose();
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    final success = await widget.controller.updateMember(
      organizationId: widget.organizationId,
      memberId: widget.member.id,
      fullName: _nameController.text.trim(),
      mobile: _mobileController.text.trim(),
      email: _emailController.text.trim().isNotEmpty ? _emailController.text.trim() : null,
      dateOfBirth: _selectedDob,
      gender: _selectedGender,
      occupation: _occupationController.text.trim().isNotEmpty ? _occupationController.text.trim() : null,
      fatherOrSpouseName: _fatherSpouseController.text.trim().isNotEmpty ? _fatherSpouseController.text.trim() : null,
      motherName: _motherController.text.trim().isNotEmpty ? _motherController.text.trim() : null,
      nid: _nidController.text.trim().isNotEmpty ? _nidController.text.trim() : null,
      address: _addressController.text.trim().isNotEmpty ? _addressController.text.trim() : null,
      notes: _notesController.text.trim().isNotEmpty ? _notesController.text.trim() : null,
      actorUserId: widget.actorUserId,
      actorName: widget.actorName,
    );

    if (mounted) {
      if (success) {
        Navigator.of(context).pop();
      } else {
        setState(() {
          _isSubmitting = false;
          _errorMessage = widget.controller.errorMessage ?? 'তথ্য সংশোধনে ব্যর্থতা দেখা দিয়েছে';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppDialog(
      title: 'সদস্য তথ্য সংশোধন',
      subtitle: 'সদস্য কোড: ${widget.member.memberCode} (অপরিবর্তনীয়)',
      maxWidth: 680,
      content: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
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

              // মেম্বার কোড ডিসপ্লে (Immutable Indicator)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariantLight,
                  borderRadius: AppRadius.radiusMd,
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.lock_outline_rounded, size: 18, color: AppColors.textSecondaryLight),
                    const SizedBox(width: 8),
                    Text(
                      'স্থায়ী মেম্বার কোড: ',
                      style: AppTypography.caption(color: AppColors.textSecondaryLight),
                    ),
                    Text(
                      widget.member.memberCode,
                      style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              Text(
                '১. ব্যক্তিগত পরিচিতি',
                style: AppTypography.titleMedium(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              AppTextField(
                label: 'সদস্যের পূর্ণ নাম *',
                controller: _nameController,
                prefixIcon: const Icon(Icons.person_outline_rounded),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'পূর্ণ নাম আবশ্যক';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: AppDropdown<String>(
                      label: 'লিঙ্গ *',
                      value: _selectedGender,
                      items: const [
                        DropdownMenuItem(value: 'male', child: Text('পুরুষ')),
                        DropdownMenuItem(value: 'female', child: Text('মহিলা')),
                        DropdownMenuItem(value: 'other', child: Text('অন্যান্য')),
                      ],
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedGender = val);
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppTextField(
                      label: 'পেশা / কর্মক্ষেত্র',
                      controller: _occupationController,
                      prefixIcon: const Icon(Icons.work_outline_rounded),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: AppTextField(
                      label: 'পিতা / স্বামীর নাম',
                      controller: _fatherSpouseController,
                      prefixIcon: const Icon(Icons.family_restroom_outlined),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppTextField(
                      label: 'মাতার নাম',
                      controller: _motherController,
                      prefixIcon: const Icon(Icons.person_pin_outlined),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              AppTextField(
                label: 'জাতীয় পরিচয়পত্র নম্বর (NID)',
                controller: _nidController,
                prefixIcon: const Icon(Icons.credit_card_outlined),
              ),

              const SizedBox(height: 20),
              Text(
                '২. যোগাযোগ ও ঠিকানা',
                style: AppTypography.titleMedium(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: AppTextField(
                      label: 'মোবাইল নম্বর *',
                      controller: _mobileController,
                      keyboardType: TextInputType.phone,
                      prefixIcon: const Icon(Icons.phone_android_rounded),
                      validator: (val) {
                        if (val == null || val.trim().isEmpty) {
                          return 'মোবাইল নম্বর আবশ্যক';
                        }
                        final clean = val.trim();
                        if (!RegExp(r'^(?:\+8801|01)[3-9]\d{8}$').hasMatch(clean)) {
                          return 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন';
                        }
                        return null;
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppTextField(
                      label: 'ইমেইল ঠিকানা (ঐচ্ছিক)',
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      prefixIcon: const Icon(Icons.email_outlined),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              AppTextField(
                label: 'বর্তমান ও স্থায়ী ঠিকানা',
                controller: _addressController,
                maxLines: 2,
                prefixIcon: const Icon(Icons.location_on_outlined),
              ),
              const SizedBox(height: 12),
              AppTextField(
                label: 'অতিরিক্ত নোট বা মন্তব্য',
                controller: _notesController,
                maxLines: 2,
                prefixIcon: const Icon(Icons.notes_rounded),
              ),
            ],
          ),
        ),
      ),
      actions: [
        AppButton(
          text: 'বাতিল',
          variant: AppButtonVariant.outlined,
          onPressed: _isSubmitting ? null : () => Navigator.of(context).pop(),
        ),
        AppButton(
          text: _isSubmitting ? 'আপডেট হচ্ছে...' : 'হালনাগাদ সংরক্ষণ করুন',
          variant: AppButtonVariant.primary,
          isLoading: _isSubmitting,
          icon: Icons.save_outlined,
          onPressed: _isSubmitting ? null : _submitForm,
        ),
      ],
    );
  }
}
