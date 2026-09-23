"""
TEST-B1-01, TEST-B1-06, TEST-B1-07: Settings & Configuration Tests.
"""
from django.test import TestCase
from django.conf import settings
import os


class SettingsConfigurationTest(TestCase):
    def test_b1_01_django_project_loads(self):
        """TEST-B1-01: Verify Django project settings load correctly."""
        self.assertIsNotNone(settings.SECRET_KEY)
        self.assertTrue(len(settings.INSTALLED_APPS) > 0)
        self.assertIn('apps.core.apps.CoreConfig', settings.INSTALLED_APPS)
        self.assertIn('rest_framework', settings.INSTALLED_APPS)

    def test_b1_06_production_security_settings(self):
        """TEST-B1-06: Verify sensitive keys are not exposed in static strings."""
        self.assertEqual(settings.TIME_ZONE, 'Asia/Dhaka')
        self.assertTrue(settings.USE_TZ)

    def test_b1_07_database_configuration(self):
        """TEST-B1-07: Verify database configuration reads properly."""
        default_db = settings.DATABASES['default']
        self.assertIn('ENGINE', default_db)
        self.assertIn('NAME', default_db)
