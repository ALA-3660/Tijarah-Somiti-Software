"""
Core Permissions for TSS (Tijarah Samity Software).
Provides tenant-aware permission classes and role-based access control foundations.
"""
from rest_framework import permissions


class IsTenantAuthorized(permissions.BasePermission):
    """
    Enforces that the incoming request must have a valid Organization Context
    and that the authenticated user belongs to that organization.
    """
    message = 'প্রদত্ত প্রতিষ্ঠানে ব্যবহারকারীর প্রবেশাধিকার অনুমোদিত নয়।'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        org_id = getattr(request, 'organization_id', None)
        if not org_id:
            # When an organization context is required by the view
            return getattr(view, 'tenant_optional', False)

        # Future Phase: Check user's organization membership in database
        return True


class HasPermissionCode(permissions.BasePermission):
    """
    Permission check based on granular dot-notation permission codes
    (e.g., 'income.create', 'income.approve', 'account.view').
    """
    def __init__(self, required_permission=None):
        self.required_permission = required_permission

    def __call__(self):
        return self

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Superuser always has full bypass permission
        if getattr(request.user, 'is_superuser', False):
            return True

        req_perm = getattr(view, 'required_permission', self.required_permission)
        if not req_perm:
            return True

        # Future Phase: Resolve user permissions from RBAC tables
        return True
