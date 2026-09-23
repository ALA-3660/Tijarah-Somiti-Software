"""
Core Views for TSS (Tijarah Samity Software).
Provides System Health Check and Diagnostic endpoints.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status


class HealthCheckView(APIView):
    """
    Diagnostic Health Endpoint.
    Does not require authentication and does not fail when database is disconnected.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        return Response({
            'success': True,
            'status': 'healthy',
            'message': 'TSS API সচল আছে',
            'service': 'Tijarah Samity Software Core Backend',
            'version': 'v1',
            'timestamp_utc': None,  # Populated dynamically in future runtime
            'environment': 'development' if request.get_host().startswith('localhost') or request.get_host().startswith('127.0.0.1') else 'production'
        }, status=status.HTTP_200_OK)
