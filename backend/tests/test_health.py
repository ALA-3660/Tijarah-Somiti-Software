"""
TEST-B1-03, TEST-B1-04: Health Check Endpoint Tests.
"""
from django.test import TestCase, Client
from django.urls import reverse


class HealthEndpointTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_b1_03_health_endpoint_returns_200(self):
        """TEST-B1-03: Verify GET /api/v1/health/ returns HTTP 200."""
        response = self.client.get('/api/v1/health/')
        self.assertEqual(response.status_code, 200)

    def test_b1_04_health_response_structure(self):
        """TEST-B1-04: Verify health response has required fields and Bengali status message."""
        response = self.client.get('/api/v1/health/')
        data = response.json()
        self.assertTrue(data.get('success'))
        self.assertEqual(data.get('status'), 'healthy')
        self.assertIn('সচল আছে', data.get('message', ''))
        self.assertEqual(data.get('version'), 'v1')
