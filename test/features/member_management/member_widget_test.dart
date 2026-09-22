import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/core/authorization/authorization_service.dart';
import '../../../../lib/features/member_management/presentation/screens/member_list_screen.dart';
import '../../../../lib/features/organization/domain/services/organization_context.dart';

void main() {
  group('Prompt 3.1 — Member Management UI Widget Tests', () {
    setUp(() {
      OrganizationContext.instance.setDemoOrganization('demo_org_khurushkul');
      AuthorizationService.instance.overrideForTesting(
        userId: 'usr_super_admin',
        userName: 'মাওলানা আব্দুল্লাহ',
        roleKeys: ['super_admin'],
        permissions: ['*'],
      );
    });

    testWidgets('1. MemberListScreen renders header, statistics, search bar and list', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: MemberListScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Header verification
      expect(find.text('সদস্য ব্যবস্থাপনা (Member Directory)'), findsOneWidget);
      expect(find.text('মোট সদস্য: '), findsOneWidget);
      expect(find.text('সক্রিয়: '), findsOneWidget);

      // Search & action buttons
      expect(find.byType(TextField), findsWidgets);
      expect(find.text('নতুন সদস্য নিবন্ধন'), findsOneWidget);

      // Seeded members are displayed
      expect(find.text('মাওলানা মুহাম্মদ ইব্রাহীম খলিল'), findsOneWidget);
      expect(find.text('MEM-000001'), findsWidgets);
    });
  });
}
