import 'package:flutter/material.dart';
import '../../../../app/router/route_names.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_typography.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/app_form_validation.dart';
import '../../../../shared/widgets/app_text_field.dart';
import '../controllers/authentication_controller.dart';

/// LoginScreen: তিজারাহ সমিতি সফটওয়্যারের আধুনিক ও নিরাপদ বাংলা লগইন স্ক্রিন
///
/// এটি ইমেইল বা বাংলাদেশি মোবাইল নম্বর এবং পাসওয়ার্ড দ্বারা সুরক্ষিত সেশন তৈরি করে।
class LoginScreen extends StatefulWidget {
  final String? redirectRoute;

  const LoginScreen({
    super.key,
    this.redirectRoute,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _identifierController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  final AuthenticationController _authController = AuthenticationController.instance;

  bool _obscurePassword = true;
  bool _rememberMe = true;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _authController.addListener(_onAuthStateChanged);
  }

  @override
  void dispose() {
    _authController.removeListener(_onAuthStateChanged);
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onAuthStateChanged() {
    if (!mounted) return;
    if (_authController.isAuthenticated) {
      final destination = widget.redirectRoute ?? RouteNames.dashboard;
      Navigator.of(context).pushReplacementNamed(destination);
    }
  }

  Future<void> _handleLogin() async {
    // আগের কোনো এরর থাকলে ক্লিয়ার করা
    _authController.clearError();

    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isSubmitting = true);

    final success = await _authController.login(
      identifier: _identifierController.text.trim(),
      password: _passwordController.text,
      rememberMe: _rememberMe,
    );

    if (mounted) {
      setState(() => _isSubmitting = false);
      if (success) {
        final destination = widget.redirectRoute ?? RouteNames.dashboard;
        Navigator.of(context).pushReplacementNamed(destination);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 992;
    final isTablet = MediaQuery.of(context).size.width >= 600 && !isDesktop;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.lg,
            ),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 460),
              child: AnimatedBuilder(
                animation: _authController,
                builder: (context, _) {
                  return Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // ১. ব্র্যান্ডিং ও হেডার
                        _buildBrandingHeader(),
                        const SizedBox(height: AppSpacing.lg),

                        // ২. সেশন এক্সপায়ার অথবা এরর ব্যানার
                        if (_authController.isSessionExpired) ...[
                          _buildNoticeBanner(
                            icon: Icons.timer_off_outlined,
                            title: 'সেশন শেষ হয়েছে',
                            message: 'আপনার সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।',
                            color: AppColors.warning,
                          ),
                          const SizedBox(height: AppSpacing.md),
                        ] else if (_authController.status == AuthenticationStatus.offline) ...[
                          _buildNoticeBanner(
                            icon: Icons.wifi_off_outlined,
                            title: 'অফলাইন অবস্থা',
                            message: _authController.errorMessage ??
                                'ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
                            color: AppColors.info,
                          ),
                          const SizedBox(height: AppSpacing.md),
                        ] else if (_authController.status == AuthenticationStatus.error &&
                            _authController.errorMessage != null) ...[
                          _buildNoticeBanner(
                            icon: Icons.error_outline,
                            title: 'লগইন ব্যর্থ হয়েছে',
                            message: _authController.errorMessage!,
                            color: AppColors.error,
                          ),
                          const SizedBox(height: AppSpacing.md),
                        ],

                        // ৩. লগইন কার্ড
                        AppCard(
                          padding: const EdgeInsets.all(AppSpacing.lg),
                          elevation: 1,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'প্রবেশ করুন',
                                style: AppTypography.titleLarge.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'আপনার নিবন্ধিত ইমেইল বা মোবাইল নম্বর দিন',
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.lg),

                              // ইমেইল / মোবাইল ফিল্ড
                              AppTextField(
                                controller: _identifierController,
                                labelText: 'ইমেইল অথবা মোবাইল নম্বর',
                                hintText: 'যেমন: 01812345678 বা user@example.com',
                                prefixIcon: const Icon(Icons.person_outline, size: 20),
                                keyboardType: TextInputType.emailAddress,
                                textInputAction: TextInputAction.next,
                                validator: (value) {
                                  if (value == null || value.trim().isEmpty) {
                                    return 'ইমেইল অথবা মোবাইল নম্বর দিন।';
                                  }
                                  final val = value.trim();
                                  if (val.contains('@')) {
                                    return AppFormValidation.email(val);
                                  } else {
                                    // মোবাইল নম্বর হিসেবে ভ্যালিডেট
                                    return AppFormValidation.bangladeshPhone(val);
                                  }
                                },
                              ),
                              const SizedBox(height: AppSpacing.md),

                              // পাসওয়ার্ড ফিল্ড
                              AppTextField(
                                controller: _passwordController,
                                labelText: 'পাসওয়ার্ড',
                                hintText: 'আপনার গোপনীয় পাসওয়ার্ড লিখুন',
                                prefixIcon: const Icon(Icons.lock_outline, size: 20),
                                obscureText: _obscurePassword,
                                textInputAction: TextInputAction.done,
                                onSubmitted: (_) => _handleLogin(),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_outlined
                                        : Icons.visibility_off_outlined,
                                    size: 20,
                                    color: AppColors.textSecondary,
                                  ),
                                  tooltip: _obscurePassword
                                      ? 'পাসওয়ার্ড প্রদর্শন করুন'
                                      : 'পাসওয়ার্ড লুকান',
                                  onPressed: () {
                                    setState(() => _obscurePassword = !_obscurePassword);
                                  },
                                ),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'পাসওয়ার্ড দিন।';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: AppSpacing.sm),

                              // রিমেম্বার মি চেকবক্স
                              Row(
                                children: [
                                  SizedBox(
                                    height: 32,
                                    width: 32,
                                    child: Checkbox(
                                      value: _rememberMe,
                                      activeColor: AppColors.primary,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      onChanged: (val) {
                                        setState(() => _rememberMe = val ?? true);
                                      },
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  GestureDetector(
                                    onTap: () {
                                      setState(() => _rememberMe = !_rememberMe);
                                    },
                                    child: Text(
                                      'এই ডিভাইসে লগইন রাখা হবে',
                                      style: AppTypography.bodySmall.copyWith(
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: AppSpacing.lg),

                              // লগইন অ্যাকশন বাটন
                              SizedBox(
                                width: double.infinity,
                                height: 48,
                                child: AppButton(
                                  text: 'লগইন করুন',
                                  icon: Icons.login_rounded,
                                  isLoading: _isSubmitting || _authController.isLoading,
                                  onPressed: _isSubmitting ? null : _handleLogin,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // ৪. ফুটার সিকিউরিটি নোট
                        const SizedBox(height: AppSpacing.lg),
                        _buildFooterSecurityNote(),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBrandingHeader() {
    return Column(
      children: [
        // অ্যাপ আইকন ও ব্যাজ
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: AppColors.primary.withValues(alpha: 0.2),
              width: 1.5,
            ),
          ),
          child: const Center(
            child: Icon(
              Icons.account_balance,
              color: AppColors.primary,
              size: 28,
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'তিজারাহ সমিতি সফটওয়্যার',
          style: AppTypography.headlineSmall.copyWith(
            fontWeight: FontWeight.bold,
            color: AppColors.primary,
            letterSpacing: 0.2,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),
        Text(
          'ইসলামি মূল্যবোধে সমিতি পরিচালনা ও হালাল ব্যবসার আধুনিক ব্যবস্থাপনা',
          style: AppTypography.bodySmall.copyWith(
            color: AppColors.textSecondary,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildNoticeBanner({
    required IconData icon,
    required String title,
    required String message,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm + 2,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: color.withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTypography.labelLarge.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  message,
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooterSecurityNote() {
    return Center(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.shield_outlined,
            size: 14,
            color: AppColors.textSecondary,
          ),
          const SizedBox(width: 6),
          Text(
            'নিরাপদ এনক্রিপ্টেড সেশন ও টেন্যান্ট আইসোলেশন দ্বারা সংরক্ষিত',
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
