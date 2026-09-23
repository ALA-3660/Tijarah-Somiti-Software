"""
Development settings for TSS (Tijarah Samity Software).
Used for local development, test execution, and API debugging.
"""
import os
from .base import *

DEBUG = True

SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-tss-dev-secret-key-do-not-use-in-production'
)

ALLOWED_HOSTS = ['*']

# In local development without PostgreSQL daemon, fallback to SQLite is provided for unit tests,
# while PostgreSQL remains the authoritative production target.
if os.environ.get('USE_SQLITE_DEV_FALLBACK', 'False').lower() in ('true', '1'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'dev_db.sqlite3',
        }
    }

# Disable strict CSRF for development API testing if needed
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

# Enable browsable API in development
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer',
    'rest_framework.renderers.BrowsableAPIRenderer',
]
