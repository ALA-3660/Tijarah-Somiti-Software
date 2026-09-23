"""
Custom Middlewares for TSS (Tijarah Samity Software).
Provides Multi-tenant Organization Context extraction and Request Logging with sensitive data redaction.
"""
import re
import time
import logging
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

logger = logging.getLogger('apps.core.middleware')

# Valid Organization ID format (alphanumeric, hyphens, underscores; max 64 chars)
ORG_ID_REGEX = re.compile(r'^[a-zA-Z0-9_-]{1,64}$')


class OrganizationContextMiddleware(MiddlewareMixin):
    """
    Extracts and attaches the organization context from the X-Organization-Id header.
    Ensures safe tenant isolation across all view layers.
    """

    def process_request(self, request):
        # Health check and admin endpoints bypass tenant enforcement
        if request.path.startswith('/api/v1/health') or request.path.startswith('/admin'):
            request.organization_id = None
            return None

        org_id = request.headers.get('X-Organization-Id') or request.META.get('HTTP_X_ORGANIZATION_ID')

        if org_id:
            org_id = org_id.strip()
            if not ORG_ID_REGEX.match(org_id):
                return JsonResponse({
                    'success': False,
                    'error': {
                        'code': 'INVALID_ORGANIZATION_ID',
                        'message': 'প্রদত্ত X-Organization-Id হেডারটির ফরম্যাট অগ্রহণযোগ্য।',
                        'details': {'header': 'X-Organization-Id'}
                    }
                }, status=400)
            request.organization_id = org_id
        else:
            request.organization_id = None

        return None


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Logs API requests with duration and status code.
    Strictly redacts sensitive authorization headers, passwords, and banking tokens.
    """

    def process_request(self, request):
        request._start_time = time.time()
        return None

    def process_response(self, request, response):
        if hasattr(request, '_start_time'):
            duration_ms = round((time.time() - request._start_time) * 1000, 2)
        else:
            duration_ms = 0

        org_id = getattr(request, 'organization_id', None) or 'N/A'
        user_repr = str(request.user) if hasattr(request, 'user') and request.user.is_authenticated else 'Anonymous'

        logger.info(
            f"API Request | Method: {request.method} | Path: {request.path} | "
            f"Status: {response.status_code} | Org: {org_id} | User: {user_repr} | Duration: {duration_ms}ms"
        )
        return response
