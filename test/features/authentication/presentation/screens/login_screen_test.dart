import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/app/theme/app_theme.dart';
import '../../../../lib/features/authentication/presentation/screens/login_screen.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      theme: AppTheme.lightTheme,
      home: child,
    );
  }

  group('LoginScreen Widget Tests', () {
    testWidgets('Renders Bengali branding, form fields and login button', (tester) async {
      await tester.pumpWidget(buildTestableWidget(const LoginScreen()));
      await tester.pumpAndSettle();

      // ১. ব্র্যান্ডিং টেক্সট উপস্থিত
      expect(find.text('তিজারাহ সমিতি সফটওয়্যার'), findsOneWidget);
      expect(find.text('প্রবেশ করুন'), findsOneWidget);

      // ২. ইনপুট লেবেল উপস্থিত
      expect(find.text('ইমেইল অথবা মোবাইল নম্বর'), findsOneWidget);
      expect(find.text('পাসওয়ার্ড'), findsOneWidget);

      // ৩. লগইন বাটন ও সিকিউরিটি টেক্সট
      expect(find.text('লগইন করুন'), findsOneWidget);
      expect(find.text('এই ডিভাইসে লগইন রাখা হবে'), findsOneWidget);
    });

    testWidgets('Empty submission triggers Bengali validation errors', (tester) async {
      await tester.pumpWidget(buildTestableWidget(const LoginScreen()));
      await tester.pumpAndSettle();

      // খালি ফর্মে লগইন চাপ দেওয়া
      await tester.tap(find.text('লগইন করুন'));
      await tester.pumpAndSettle();

      // ভ্যালিডেশন এরর প্রদর্শিত হচ্ছে
      expect(find.text('ইমেইল অথবা মোবাইল নম্বর দিন।'), findsOneWidget);
      expect(find.text('পাসওয়ার্ড দিন।'), findsOneWidget);
    });

    testWidgets('Password visibility toggle toggles obscureText', (tester) async {
      await tester.pumpWidget(buildTestableWidget(const LoginScreen()));
      await tester.pumpAndSettle();

      // পাসওয়ার্ড ফিল্ডের টগল আইকন খোঁজা
      final toggleFinder = find.byTooltip('পাসওয়ার্ড প্রদর্শন করুন');
      expect(toggleFinder, findsOneWidget);

      // আইকনে ট্যাপ করা
      await tester.tap(toggleFinder);
      await tester.pumpAndSettle();

      // টগল পরিবর্তন হয়ে 'পাসওয়ার্ড লুকান' হয়েছে
      expect(find.byTooltip('পাসওয়ার্ড লুকান'), findsOneWidget);
    });
  });
}
