import 'package:flutter_test/flutter_test.dart';
import '../../../../lib/features/member_management/domain/entities/member.dart';
import '../../../../lib/features/member_management/domain/entities/member_status.dart';

void main() {
  group('Prompt 3.1 — Member Domain Entity & Status Model Tests', () {
    test('1. Member entity instantiation and immutability attributes', () {
      final now = DateTime.now();
      final member = Member(
        id: 'mem_123',
        organizationId: 'org_test_01',
        memberCode: 'MEM-000001',
        fullName: 'কারী মাওলানা নুরুল হক',
        mobile: '01812345678',
        email: 'nurul@test.org',
        dateOfBirth: DateTime(1990, 5, 20),
        gender: 'male',
        occupation: 'শিক্ষক',
        status: MemberStatus.active,
        joinedAt: now,
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin_usr',
        updatedBy: 'admin_usr',
      );

      expect(member.id, 'mem_123');
      expect(member.organizationId, 'org_test_01');
      expect(member.memberCode, 'MEM-000001');
      expect(member.fullName, 'কারী মাওলানা নুরুল হক');
      expect(member.genderBangla, 'পুরুষ');
      expect(member.ageYears, isNotNull);
      expect(member.status.isActive, isTrue);
      expect(member.status.isSuspended, isFalse);
    });

    test('2. Member copyWith preserves immutable identifiers', () {
      final now = DateTime.now();
      final original = Member(
        id: 'mem_immutable_id',
        organizationId: 'org_immutable',
        memberCode: 'MEM-000099',
        fullName: 'মুহাম্মদ আব্দুল মান্নান',
        mobile: '01711122233',
        status: MemberStatus.active,
        joinedAt: now,
        createdAt: now,
        updatedAt: now,
      );

      final updated = original.copyWith(
        fullName: 'মুহাম্মদ আব্দুল মান্নান চৌধুরী',
        status: MemberStatus.inactive,
        notes: 'সাময়িক ছুটি',
      );

      // Verify immutable attributes are preserved
      expect(updated.id, original.id);
      expect(updated.organizationId, original.organizationId);
      expect(updated.memberCode, original.memberCode);
      expect(updated.createdAt, original.createdAt);

      // Verify mutable attributes are updated
      expect(updated.fullName, 'মুহাম্মদ আব্দুল মান্নান চৌধুরী');
      expect(updated.status, MemberStatus.inactive);
      expect(updated.notes, 'সাময়িক ছুটি');
    });

    test('3. MemberStatus enum mappings and helper checks', () {
      expect(MemberStatus.fromKey('active'), MemberStatus.active);
      expect(MemberStatus.fromKey('inactive'), MemberStatus.inactive);
      expect(MemberStatus.fromKey('suspended'), MemberStatus.suspended);
      expect(MemberStatus.fromKey('archived'), MemberStatus.archived);
      expect(MemberStatus.fromKey('invalid_key'), MemberStatus.active); // Default fallback

      expect(MemberStatus.active.banglaName, 'সক্রিয়');
      expect(MemberStatus.inactive.banglaName, 'নিষ্ক্রিয়');
      expect(MemberStatus.suspended.banglaName, 'স্থগিত');
      expect(MemberStatus.archived.banglaName, 'আর্কাইভকৃত');
    });

    test('4. JSON Serialization and Deserialization', () {
      final now = DateTime.now();
      final member = Member(
        id: 'mem_json_test',
        organizationId: 'org_json',
        memberCode: 'MEM-000077',
        fullName: 'হাফেজ শোয়েব',
        mobile: '01911223344',
        email: 'shoeb@example.com',
        status: MemberStatus.active,
        joinedAt: now,
        createdAt: now,
        updatedAt: now,
      );

      final json = member.toJson();
      expect(json['id'], 'mem_json_test');
      expect(json['member_code'], 'MEM-000077');
      expect(json['status'], 'active');

      final fromJson = Member.fromJson(json);
      expect(fromJson.id, member.id);
      expect(fromJson.memberCode, member.memberCode);
      expect(fromJson.fullName, member.fullName);
      expect(fromJson.status, MemberStatus.active);
    });
  });
}
