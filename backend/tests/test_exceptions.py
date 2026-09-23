"""
TEST-B1-05: Exception Handler Tests.
"""
from django.test import TestCase
from rest_framework.exceptions import NotAuthenticated, PermissionDenied
from apps.core.exceptions import custom_exception_handler


class ExceptionHandlerTest(TestCase):
    def test_b1_05_unauthenticated_returns_401_structure(self):
        """TEST-B1-05: Unauthenticated exception format returns 401 standard error payload."""
        exc = NotAuthenticated()
        response = custom_exception_handler(exc, {})
        self.assertIsNotNone(response)
        self.assertEqual(response.status_code, 401)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error']['code'], 'AUTHENTICATION_REQUIRED')

    def test_permission_denied_returns_403_structure(self):
        """Verify PermissionDenied exception format returns 403 standard error payload."""
        exc = PermissionDenied()
        response = custom_exception_handler(exc, {})
        self.assertIsNotNone(response)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error']['code'], 'PERMISSION_DENIED')
