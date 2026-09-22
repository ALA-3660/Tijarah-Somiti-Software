import '../../core/authorization/action_catalog.dart';
import '../../core/authorization/resource_catalog.dart';

/// Permission: পারমিশন ডোমেইন এন্টিটি
///
/// নির্দিষ্ট রিসোর্স/মডিউলের নির্দিষ্ট অ্যাকশন করার অনুমতি নির্দেশ করে।
/// পারমিশন কী অপরিবর্তনীয় এবং মেশিন-রিডেবল।
class Permission {
  final String id;
  final String key;
  final String name;
  final String description;
  final AppModule module;
  final AppResource resource;
  final AppAction action;
  final String categoryBangla;
  final bool isSystemPermission;
  final bool isActive;

  const Permission({
    required this.id,
    required this.key,
    required this.name,
    required this.description,
    required this.module,
    required this.resource,
    required this.action,
    required this.categoryBangla,
    this.isSystemPermission = true,
    this.isActive = true,
  });

  Permission copyWith({
    String? id,
    String? key,
    String? name,
    String? description,
    AppModule? module,
    AppResource? resource,
    AppAction? action,
    String? categoryBangla,
    bool? isSystemPermission,
    bool? isActive,
  }) {
    return Permission(
      id: id ?? this.id,
      key: key ?? this.key,
      name: name ?? this.name,
      description: description ?? this.description,
      module: module ?? this.module,
      resource: resource ?? this.resource,
      action: action ?? this.action,
      categoryBangla: categoryBangla ?? this.categoryBangla,
      isSystemPermission: isSystemPermission ?? this.isSystemPermission,
      isActive: isActive ?? this.isActive,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'key': key,
      'name': name,
      'description': description,
      'module': module.key,
      'resource': resource.key,
      'action': action.key,
      'category_bangla': categoryBangla,
      'is_system_permission': isSystemPermission,
      'is_active': isActive,
    };
  }

  factory Permission.fromJson(Map<String, dynamic> json) {
    final moduleKey = json['module'] as String? ?? 'organization';
    final resKey = json['resource'] as String? ?? 'organization';
    final actKey = json['action'] as String? ?? 'view';

    final module = AppModule.values.firstWhere(
      (m) => m.key == moduleKey,
      orElse: () => AppModule.organization,
    );

    final resource = AppResource.values.firstWhere(
      (r) => r.key == resKey,
      orElse: () => AppResource.organization,
    );

    final action = AppAction.fromKey(actKey) ?? AppAction.view;

    return Permission(
      id: json['id'] as String? ?? '',
      key: json['key'] as String? ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      module: module,
      resource: resource,
      action: action,
      categoryBangla: json['category_bangla'] as String? ?? module.banglaName,
      isSystemPermission: json['is_system_permission'] as bool? ?? true,
      isActive: json['is_active'] as bool? ?? true,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Permission && runtimeType == other.runtimeType && key == other.key;

  @override
  int get hashCode => key.hashCode;
}
