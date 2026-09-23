"""
TEST-B1-08: Organization Context Middleware Tests.
"""
from django.test import TestCase, RequestFactory
from apps.core.middleware import OrganizationContextMiddleware
from django.http import HttpResponse


class OrganizationMiddlewareTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = OrganizationContextMiddleware(lambda req: HttpResponse("OK"))

    def test_b1_08_valid_organization_header(self):
        """TEST-B1-08: Valid organization header is attached to request."""
        request = self.factory.get('/api/v1/some-endpoint/', HTTP_X_ORGANIZATION_ID='org-demo-001')
        response = self.middleware(request)
        self.assertEqual(request.organization_id, 'org-demo-001')
        self.assertEqual(response.status_code, 200)

    def test_b1_08_invalid_organization_header_rejected(self):
        """TEST-B1-08: Malformed/injected organization header is rejected with 400."""
        request = self.factory.get('/api/v1/some-endpoint/', HTTP_X_ORGANIZATION_ID='invalid<script>alert(1)</script>')
        response = self.middleware(request)
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertEqual(data['error']['code'], 'INVALID_ORGANIZATION_ID')
