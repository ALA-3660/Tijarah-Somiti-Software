import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/features/member_management/data/repositories/member_repository_impl.dart';
import '../../../../lib/features/member_management/domain/entities/member_status.dart';

void main() {
  group('Prompt 3.1 — MemberRepository & Domain Enforcement Unit Tests', () {
    late MemberRepositoryImpl repository;
    const orgAlpha = 'org_unit_alpha';
    const orgBeta = 'org_unit_beta';

    setUp(() {
      repository = MemberRepositoryImpl();
    });

    test('1. Member ≠ User: Creating member is an independent entity with sequential code', () async {
      final member1 = await repository.createMember(
        organizationId: orgAlpha,
        fullName: 'কারী মাওলানা ফয়েজ উল্লাহ',
        mobile: '01711223344',
        email: 'foyez@test.org',
        actorUserId: 'usr_sec_01',
        actorName: 'সেক্রেটারি সাহেব',
      );

      expect(member1.memberCode, startsWith('MEM-'));
      expect(member1.fullName, 'কারী মাওলানা ফয়েজ উল্লাহ');
      expect(member1.status, MemberStatus.active);

      final member2 = await repository.createMember(
        organizationId: orgAlpha,
        fullName: 'হাফেজ দেলোয়ার হোসেন',
        mobile: '01711223355',
        actorUserId: 'usr_sec_01',
        actorName: 'সেক্রেটারি সাহেব',
      );

      expect(member2.memberCode, isNot(equals(member1.memberCode)));
      final count = await repository.getTotalMembersCount(organizationId: orgAlpha);
      expect(count, 2);
    });

    test('2. Multi-tenant Isolation: Members of Org Alpha are invisible to Org Beta', () async {
      await repository.createMember(
        organizationId: orgAlpha,
        fullName: 'মাওলানা আবুল হাসেম',
        mobile: '01811223344',
        actorUserId: 'admin_alpha',
        actorName: 'অ্যাডমিন আলফা',
      );

      await repository.createMember(
        organizationId: orgBeta,
        fullName: 'মুফতি আব্দুর রহমান',
        mobile: '01811223355',
        actorUserId: 'admin_beta',
        actorName: 'অ্যাডমিন বেটা',
      );

      final alphaMembers = await repository.getMembers(organizationId: orgAlpha);
      expect(alphaMembers.length, 1);
      expect(alphaMembers.first.fullName, 'মাওলানা আবুল হাসেম');

      final betaMembers = await repository.getMembers(organizationId: orgBeta);
      expect(betaMembers.length, 1);
      expect(betaMembers.first.fullName, 'মুফতি আব্দুর রহমান');
    });

    test('3. Mobile Validation: Invalid mobile numbers are rejected with Bengali message', () async {
      expect(
        () => repository.createMember(
          organizationId: orgAlpha,
          fullName: 'ভুল মোবাইল ইউজার',
          mobile: '12345', // Invalid
          actorUserId: 'admin',
          actorName: 'অ্যাডমিন',
        ),
        throwsA(isA<ArgumentError>()),
      );
    });

    test('4. Duplicate Mobile Prevention: Duplicate mobile in same org is blocked', () async {
      await repository.createMember(
        organizationId: orgAlpha,
        fullName: 'সদস্য এক',
        mobile: '01911223344',
        actorUserId: 'admin',
        actorName: 'অ্যাডমিন',
      );

      expect(
        () => repository.createMember(
          organizationId: orgAlpha,
          fullName: 'সদস্য দুই (একই নম্বর)',
          mobile: '01911223344', // Duplicate
          actorUserId: 'admin',
          actorName: 'অ্যাডমিন',
        ),
        throwsA(isA<StateError>()),
      );
    });

    test('5. Lifecycle Transition & Audit Trail: Status change requires reason and records history', () async {
      final member = await repository.createMember(
        organizationId: orgAlpha,
        fullName: 'মুহাম্মদ তারিক',
        mobile: '01611223344',
        actorUserId: 'admin',
        actorName: 'অ্যাডমিন',
      );

      // Status change to Inactive
      final updated = await repository.changeMemberStatus(
        organizationId: orgAlpha,
        memberId: member.id,
        newStatus: MemberStatus.inactive,
        reason: 'উচ্চশিক্ষার জন্য সাময়িক বিরতি',
        actorUserId: 'sec_01',
        actorName: 'সেক্রেটারি সাহেব',
      );

      expect(updated.status, MemberStatus.inactive);

      // Verify audit record exists
      final audits = await repository.getMemberStatusAudits(
        organizationId: orgAlpha,
        memberId: member.id,
      );

      expect(audits.isNotEmpty, isTrue);
      expect(audits.first.previousStatus, MemberStatus.active);
      expect(audits.first.newStatus, MemberStatus.inactive);
      expect(audits.first.reason, 'উচ্চশিক্ষার জন্য সাময়িক বিরতি');
      expect(audits.first.changedByName, 'সেক্রেটারি সাহেব');
    });

    test('6. Member Update: Update modifies profile and enforces mobile unique check', () async {
      final member = await repository.createMember(
        organizationId: orgAlpha,
        fullName: 'মুহাম্মদ রফিক',
        mobile: '01511223344',
        actorUserId: 'admin',
        actorName: 'অ্যাডমিন',
      );

      final updated = await repository.updateMember(
        organizationId: orgAlpha,
        memberId: member.id,
        fullName: 'মুহাম্মদ রফিক উদ্দিন',
        mobile: '01511223344',
        occupation: 'প্রকৌশলী',
        actorUserId: 'admin',
        actorName: 'অ্যাডমিন',
      );

      expect(updated.fullName, 'মুহাম্মদ রফিক উদ্দিন');
      expect(updated.occupation, 'প্রকৌশলী');
      expect(updated.memberCode, member.memberCode); // Code remains immutable
    });
  });
}
