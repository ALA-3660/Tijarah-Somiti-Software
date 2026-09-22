import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_dialog.dart';
import '../../../../shared/widgets/app_dropdown.dart';
import '../../../../shared/widgets/app_text_field.dart';
import '../controllers/member_controller.dart';

/// CreateMemberDialog: নতুন সদস্য নিবন্ধন ফর্ম ডায়ালগ
class CreateMemberDialog extends StatefulWidget {
  final String organizationId;
  final String actorUserId;
  final String actorName;
  final MemberController controller;

  const CreateMemberDialog({
    super.key,
    required this.organizationId,
    required this.actorUserId,
    required this.actorName,
    required this.controller,
  });

  static Future<void> show(
    BuildContext context, {
    required String organizationId,
    required String actorUserId,
    required String actorName,
    required MemberController controller,
  }) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => CreateMemberDialog(
        organizationId: organizationId,
        actorUserId: actorUserId,
        actorName: actorName,
        controller: controller,
      ),
    );
  }

  @override
  State<CreateMemberDialog> createState() => _CreateMemberDialogState();
}

class _CreateMemberDialogState extends State<CreateMemberDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _mobileController = TextEditingController();
  final _emailController = TextEditingController();
  final _occupationController = TextEditingController();
  final _fatherSpouseController = TextEditingController();
  final _motherController = TextEditingController();
  final _nidController = TextEditingController();
  final _addressController = TextEditingController();
  final _notesController = TextEditingController();

  String _selectedGender = 'male';
  DateTime? _selectedDob;
  DateTime _joinedDate = DateTime.now();
  bool _isSubmitting = false;
  String? _errorMessage;

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

    final success = await widget.controller.createMember(
      organizationId: widget.organizationId,
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
      joinedAt: _joinedDate,
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
          _errorMessage = widget.controller.errorMessage ?? 'সদস্য তৈরিতে ব্যর্থতা দেখা দিয়েছে';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppDialog(
      title: 'নতুন সদস্য নিবন্ধন',
      subtitle: 'সমিতির নতুন সদস্যের প্রাথমিক পরিচিতি ও যোগাযোগের তথ্য এন্ট্রি করুন',
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

              // সেকশন ১: পরিচিতি
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
                hintText: 'যেমন: মাওলানা মুহাম্মদ ইব্রাহীম খলিল',
                controller: _nameController,
                prefixIcon: const Icon(Icons.person_outline_rounded),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'পূর্ণ নাম প্রদান করা আবশ্যক';
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
                      hintText: 'যেমন: শিক্ষক / ব্যবসায়ী',
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
                      hintText: 'পিতা বা স্বামীর পূর্ণ নাম',
                      controller: _fatherSpouseController,
                      prefixIcon: const Icon(Icons.family_restroom_outlined),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppTextField(
                      label: 'মাতার নাম',
                      hintText: 'মাতার পূর্ণ নাম',
                      controller: _motherController,
                      prefixIcon: const Icon(Icons.person_pin_outlined),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              AppTextField(
                label: 'জাতীয় পরিচয়পত্র নম্বর (NID / Smart Card)',
                hintText: '১০, ১৩ বা ১৭ ডিজিটের এনআইডি নম্বর',
                controller: _nidController,
                prefixIcon: const Icon(Icons.credit_card_outlined),
              ),

              const SizedBox(height: 20),
              // সেকশন ২: যোগাযোগ ও ঠিকানা
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
                      hintText: '01XXXXXXXXX',
                      controller: _mobileController,
                      keyboardType: TextInputType.phone,
                      prefixIcon: const Icon(Icons.phone_android_rounded),
                      validator: (val) {
                        if (val == null || val.trim().isEmpty) {
                          return 'মোবাইল নম্বর প্রদান আবশ্যক';
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
                      hintText: 'name@example.com',
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
                hintText: 'গ্রাম/মহল্লা, ডাকঘর, থানা ও জেলা',
                controller: _addressController,
                maxLines: 2,
                prefixIcon: const Icon(Icons.location_on_outlined),
              ),
              const SizedBox(height: 12),
              AppTextField(
                label: 'অতিরিক্ত নোট বা মন্তব্য',
                hintText: 'সদস্যপদ সংক্রান্ত কোনো বিশেষ মন্তব্য...',
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
          text: _isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন',
          variant: AppButtonVariant.primary,
          isLoading: _isSubmitting,
          icon: Icons.check_circle_outline_rounded,
          onPressed: _isSubmitting ? null : _submitForm,
        ),
      ],
    );
  }
}
