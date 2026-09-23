"""
URL configuration for TSS (Tijarah Samity Software).
Provides versioned API routing under /api/v1/.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Administration Interface
    path('admin/', admin.site.urls),

    # TSS Core API Endpoints (Health & Diagnostic)
    path('api/v1/', include('apps.core.urls')),

    # Modular Future Apps Routing Foundation
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/organizations/', include('apps.organizations.urls')),
]
