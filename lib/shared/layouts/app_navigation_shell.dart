import 'package:flutter/material.dart';
import '../../app/config/app_config.dart';
import '../../app/router/navigation_registry.dart';
import '../../app/router/route_names.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_typography.dart';
import '../../features/dashboard/presentation/screens/component_showcase_screen.dart';
import '../../features/organization/presentation/screens/organization_profile_screen.dart';
import '../../features/roles_permissions/presentation/screens/roles_permissions_screen.dart';
import '../../features/user_management/presentation/screens/user_list_screen.dart';
import '../../features/security_audit/presentation/screens/security_audit_screen.dart';
import '../../features/security_audit/presentation/screens/session_security_screen.dart';
import '../../features/member_management/presentation/screens/member_list_screen.dart';
import '../../features/authentication/presentation/controllers/authentication_controller.dart';
import '../../core/context/organization_context.dart';
import '../widgets/app_breadcrumbs.dart';
import '../widgets/app_navigation_sidebar.dart';
import '../widgets/app_sub_sidebar.dart';

/// AppNavigationShell: সমন্বিত ২-স্তর নেভিগেশন ও শেল লেআউট
///
/// বড় স্ক্রিনে (Desktop/Web/Tablet) পাশাপাশি ২ স্তরের সাইডবার:
/// [স্তর ১: Main Sidebar] + [স্তর ২: Internal Sub-sidebar] + [মেইন কনটেন্ট এরিয়া]
///
/// মোবাইল স্ক্রিনে রেসপনসিভ ড্রয়ার ও দ্রুত উপ-মেনু সুইচিং সাপোর্ট করে।
class AppNavigationShell extends StatefulWidget {
  final Widget? content;
  final String? initialRoute;

  const AppNavigationShell({
    super.key,
    this.content,
    this.initialRoute,
  });

  @override
  State<AppNavigationShell> createState() => _AppNavigationShellState();
}

class _AppNavigationShellState extends State<AppNavigationShell> {
  late NavigationItem _selectedModule;
  late String _currentRoute;
  bool _isMainSidebarCollapsed = false;
  bool _showSubSidebar = true;

  @override
  void initState() {
    super.initState();
    _currentRoute = widget.initialRoute ?? RouteNames.dashboard;
    _selectedModule = NavigationRegistry.findParentModuleByRoute(_currentRoute) ??
        NavigationRegistry.mainModules.first;
  }

  void _onSelectMainModule(NavigationItem module) {
    setState(() {
      _selectedModule = module;
      _showSubSidebar = true;
      if (module.isStandalone || module.children.isEmpty) {
        _currentRoute = module.route;
      } else {
        // প্রথম চাইল্ড রুটে সিলেক্ট হবে
        _currentRoute = module.children.first.route;
      }
    });
  }

  void _onSelectSubRoute(NavigationItem subItem) {
    setState(() {
      _currentRoute = subItem.route;
    });
  }

  void _onSelectBreadcrumbRoute(String route) {
    final parent = NavigationRegistry.findParentModuleByRoute(route);
    if (parent != null) {
      setState(() {
        _selectedModule = parent;
        _currentRoute = route;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 1024;
    final isTablet = MediaQuery.of(context).size.width >= 768 && !isDesktop;

    final breadcrumbs = NavigationRegistry.getBreadcrumbs(_currentRoute);
    final currentItem = NavigationRegistry.findItemByRoute(_currentRoute);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      // মোবাইল অ্যাপ বার
      appBar: !isDesktop
          ? AppBar(
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    _selectedModule.title,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '${AppConfig.instance.appName} • ${AppConfig.instance.defaultDemoOrganization.name}',
                    style: const TextStyle(fontSize: 11, color: Colors.white70),
                  ),
                ],
              ),
              actions: [
                if (_selectedModule.children.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.menu_open_rounded),
                    tooltip: 'উপ-মেনু তালিকা',
                    onPressed: () => _openMobileSubMenuDrawer(context),
                  ),
              ],
            )
          : null,
      // মোবাইল ড্রয়ার
      drawer: !isDesktop ? _buildMobileDrawer(context) : null,
      body: SafeArea(
        child: Row(
          children: [
            // স্তর ১: মেইন সাইডবার (Desktop/Tablet)
            if (isDesktop || isTablet)
              AppNavigationSidebar(
                selectedModule: _selectedModule,
                isCollapsed: _isMainSidebarCollapsed || isTablet,
                onModuleSelected: _onSelectMainModule,
                onToggleCollapse: () {
                  setState(() {
                    _isMainSidebarCollapsed = !_isMainSidebarCollapsed;
                  });
                },
              ),

            // স্তর ২: সাব-সাইডবার (Desktop)
            if (isDesktop && _showSubSidebar && _selectedModule.children.isNotEmpty)
              AppSubSidebar(
                parentModule: _selectedModule,
                currentRoute: _currentRoute,
                onSubRouteSelected: _onSelectSubRoute,
                onCloseSubSidebar: () {
                  setState(() {
                    _showSubSidebar = false;
                  });
                },
              ),

            // মেইন কনটেন্ট ক্যানভাস
            Expanded(
              child: Column(
                children: [
                  // টপ কন্টেক্সট বার (ব্রেডক্রাম্ব, ডেমো অর্গানাইজেশন ব্যাজ ও ইউজার স্টেটাস)
                  _buildTopContextBar(context, breadcrumbs),

                  const Divider(height: 1, color: AppColors.borderLight),

                  // স্ক্রিন বডি কনটেন্ট
                  Expanded(
                    child: widget.content ?? _buildDefaultRouteContent(currentItem),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopContextBar(
    BuildContext context,
    List<BreadcrumbItem> breadcrumbs,
  ) {
    return Container(
      height: 52,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      color: Colors.white,
      child: Row(
        children: [
          // সাব-সাইডবার রি-ওপেন বাটন (যদি হাইড থাকে)
          if (MediaQuery.of(context).size.width >= 1024 &&
              !_showSubSidebar &&
              _selectedModule.children.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: IconButton(
                icon: const Icon(Icons.dock_outlined, size: 20),
                tooltip: 'উপ-মেনু খুলুন',
                onPressed: () => setState(() => _showSubSidebar = true),
              ),
            ),

          // ব্রেডক্রাম্ব পাথ
          Expanded(
            child: AppBreadcrumbs(
              items: breadcrumbs,
              onRouteSelected: _onSelectBreadcrumbRoute,
            ),
          ),

          // অর্গানাইজেশন কনটেক্সট ব্যাজ ও নেভিগেশন
          AnimatedBuilder(
            animation: OrganizationContext.instance,
            builder: (context, _) {
              final orgContext = OrganizationContext.instance;
              final orgName = orgContext.currentOrganizationName;
              final isDemo = orgContext.isDemo;

              return InkWell(
                borderRadius: BorderRadius.circular(AppRadius.full),
                onTap: () {
                  _onSelectBreadcrumbRoute(RouteNames.orgInfo);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primaryContainer,
                    borderRadius: AppRadius.radiusFull,
                    border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.business_outlined,
                        size: 14,
                        color: AppColors.primary,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        orgName,
                        style: AppTypography.caption(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (isDemo) ...[
                        const SizedBox(width: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                          decoration: BoxDecoration(
                            color: AppColors.secondary,
                            borderRadius: AppRadius.radiusSm,
                          ),
                          child: Text(
                            'DEMO',
                            style: AppTypography.numeric(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(width: 8),
          // অথেনটিকেটেড ইউজার ও লগআউট বাটন
          AnimatedBuilder(
            animation: AuthenticationController.instance,
            builder: (context, _) {
              final authController = AuthenticationController.instance;
              final user = authController.currentUser;
              final userName = user?.name ?? 'অ্যাডমিন ইউজার';

              return Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceVariantLight,
                      borderRadius: AppRadius.radiusFull,
                      border: Border.all(color: AppColors.borderLight),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const CircleAvatar(
                          radius: 10,
                          backgroundColor: AppColors.primary,
                          child: Icon(Icons.person, size: 12, color: Colors.white),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          userName,
                          style: AppTypography.caption(
                            color: AppColors.textPrimaryLight,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 4),
                  IconButton(
                    icon: const Icon(Icons.logout_rounded, size: 18, color: AppColors.error),
                    tooltip: 'লগআউট করুন',
                    onPressed: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          title: const Text('লগআউট নিশ্চিতকরণ'),
                          content: const Text('আপনি কি নিশ্চিত যে বর্তমান সেশন থেকে লগআউট করতে চান?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.of(ctx).pop(false),
                              child: const Text('বাতিল'),
                            ),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
                              onPressed: () => Navigator.of(ctx).pop(true),
                              child: const Text('লগআউট', style: TextStyle(color: Colors.white)),
                            ),
                          ],
                        ),
                      );
                      if (confirm == true) {
                        await authController.logout();
                        if (context.mounted) {
                          Navigator.of(context).pushReplacementNamed(RouteNames.login);
                        }
                      }
                    },
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDefaultRouteContent(NavigationItem? currentItem) {
    if (_currentRoute == RouteNames.dashboard || _selectedModule.id == 'dashboard') {
      return const ComponentShowcaseScreen();
    }

    if (_currentRoute == RouteNames.orgInfo ||
        _currentRoute == RouteNames.orgSecurity ||
        _currentRoute == '/organization-security/organization-info') {
      return const OrganizationProfileScreen();
    }

    if (_currentRoute == RouteNames.orgRoles) {
      return const RolesPermissionsScreen();
    }

    if (_currentRoute == RouteNames.orgUsers) {
      return const UserListScreen();
    }

    if (_currentRoute == RouteNames.orgLogs || _currentRoute == RouteNames.orgSecurityAudit) {
      return const SecurityAuditScreen();
    }

    if (_currentRoute == RouteNames.orgSessions) {
      return const SessionSecurityScreen();
    }

    if (_currentRoute == RouteNames.members ||
        _currentRoute == RouteNames.memberList ||
        _currentRoute == RouteNames.memberNew ||
        _currentRoute == RouteNames.memberProfile ||
        _selectedModule.id == 'members' ||
        _currentRoute.startsWith('/members')) {
      return const MemberListScreen();
    }

    final title = currentItem?.title ?? _selectedModule.title;
    final description = currentItem?.description ?? _selectedModule.description;
    final route = currentItem?.route ?? _currentRoute;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // রুট হেডার কার্ড
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusLg,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.primaryContainer,
                    borderRadius: AppRadius.radiusMd,
                  ),
                  child: Icon(
                    currentItem?.icon ?? _selectedModule.icon,
                    size: 28,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            title,
                            style: AppTypography.heading2(
                              color: AppColors.textPrimaryLight,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceVariantLight,
                              borderRadius: AppRadius.radiusSm,
                              border: Border.all(color: AppColors.borderLight),
                            ),
                            child: Text(
                              route,
                              style: const TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 11,
                                color: AppColors.textSecondaryLight,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        description ?? 'পরবর্তী ফেজে এই মডিউলের বিস্তারিত বিজনেস ওয়ার্কফ্লো যুক্ত হবে।',
                        style: AppTypography.body(
                          color: AppColors.textSecondaryLight,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // নেভিগেশন স্টেট আর্কিটেকচার ভিউয়ার কার্ড
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusLg,
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.account_tree_outlined, color: AppColors.primary, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'Navigation State & Context',
                      style: AppTypography.heading4(
                        color: AppColors.textPrimaryLight,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                _buildInfoRow('Parent Module (স্তর ১)', _selectedModule.title),
                _buildInfoRow('English Tag', _selectedModule.englishTitle ?? 'N/A'),
                _buildInfoRow('Child Route (স্তর ২)', title),
                _buildInfoRow('Current Active Route', _currentRoute),
                _buildInfoRow('Total Sub-modules in Family', '${_selectedModule.children.length} টি'),
                _buildInfoRow(
                  'Permission State',
                  'Active (Default Allowed) • [Role Matrix Placeholder Ready]',
                ),
                _buildInfoRow(
                  'Scope Compliance',
                  '✅ No hard-coded business calculation • Pure generic funds & informational Shariah workflow',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 220,
            child: Text(
              label,
              style: AppTypography.caption(
                color: AppColors.textSecondaryLight,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: AppTypography.body(
                color: AppColors.textPrimaryLight,
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMobileDrawer(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(color: AppColors.primary),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  AppConfig.instance.appName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                AnimatedBuilder(
                  animation: OrganizationContext.instance,
                  builder: (context, _) => Text(
                    OrganizationContext.instance.currentOrganizationName,
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                for (final module in NavigationRegistry.mainModules)
                  ListTile(
                    leading: Icon(
                      module.icon,
                      color: module.id == _selectedModule.id
                          ? AppColors.primary
                          : AppColors.textSecondaryLight,
                    ),
                    title: Text(
                      module.title,
                      style: TextStyle(
                        color: module.id == _selectedModule.id
                            ? AppColors.primary
                            : AppColors.textPrimaryLight,
                        fontWeight: module.id == _selectedModule.id
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                    trailing: module.hasChildren
                        ? const Icon(Icons.chevron_right, size: 18)
                        : null,
                    selected: module.id == _selectedModule.id,
                    onTap: () {
                      Navigator.pop(context);
                      _onSelectMainModule(module);
                    },
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _openMobileSubMenuDrawer(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Text(
                  '${_selectedModule.title} — উপ-মেনু',
                  style: AppTypography.heading4(
                    color: AppColors.textPrimaryLight,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const Divider(),
              Expanded(
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: _selectedModule.children.length,
                  itemBuilder: (context, index) {
                    final child = _selectedModule.children[index];
                    final isSelected = child.route == _currentRoute;

                    return ListTile(
                      leading: Icon(
                        child.icon,
                        color: isSelected ? AppColors.primary : null,
                      ),
                      title: Text(
                        child.title,
                        style: TextStyle(
                          color: isSelected ? AppColors.primary : null,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                      trailing: isSelected
                          ? const Icon(Icons.check, color: AppColors.primary)
                          : null,
                      onTap: () {
                        Navigator.pop(context);
                        _onSelectSubRoute(child);
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
