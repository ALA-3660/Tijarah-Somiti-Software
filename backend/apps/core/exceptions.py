"""
Centralized Exception Handling for TSS (Tijarah Samity Software).
Provides standardized machine-readable error payloads and Bengali-first diagnostic messages.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import (
    APIException,
    ValidationError,
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
    NotFound,
    MethodNotAllowed,
    Throttled,
)


class BaseTSSException(APIException):
    """Base application exception for TSS."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'APPLICATION_ERROR'
    default_message = 'একটি ত্রুটি ঘটেছে।'

    def __init__(self, message=None, code=None, details=None):
        self.message = message or self.default_message
        self.code = code or self.default_code
        self.details = details or {}
        super().__init__(detail=self.message, code=self.code)


class TenantRequiredException(BaseTSSException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'ORGANIZATION_HEADER_REQUIRED'
    default_message = 'অনুরোধটিতে X-Organization-Id হেডার প্রদান করা বাধ্যতামূলক।'


class CrossTenantAccessException(BaseTSSException):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = 'CROSS_TENANT_ACCESS_FORBIDDEN'
    default_message = 'অন্য সংগঠনের তথ্যে প্রবেশাধিকার নিষিদ্ধ।'


class SeparationOfDutiesException(BaseTSSException):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = 'SEPARATION_OF_DUTIES_VIOLATION'
    default_message = 'লেনদেন প্রস্তুতকারী নিজে তার তৈরিকৃত লেনদেন অনুমোদন করতে পারবেন না।'


class ImmutableEntityException(BaseTSSException):
    status_code = status.HTTP_405_METHOD_NOT_ALLOWED
    default_code = 'APPROVED_ENTITY_IMMUTABLE'
    default_message = 'অনুমোদিত আর্থিক রেকর্ড কোনোভাবেই পরিবর্তন বা মুছে ফেলা যাবে না।'


def custom_exception_handler(exc, context):
    """
    Centralized exception handler conforming to TSS API Specification.
    Transforms DRF standard exceptions into uniform structured JSON.
    """
    # Call REST framework's default exception handler first to get the standard error response
    response = exception_handler(exc, context)

    if response is not None:
        error_code = 'API_ERROR'
        error_message = 'অনুরোধটি সম্পন্ন করা সম্ভব হয়নি।'
        details = {}

        if isinstance(exc, ValidationError):
            error_code = 'VALIDATION_ERROR'
            error_message = 'প্রদত্ত ইনপুটে ত্রুটি রয়েছে।'
            details = response.data
        elif isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
            error_code = 'AUTHENTICATION_REQUIRED'
            error_message = 'এই সেবা ব্যবহারের জন্য উপযুক্ত প্রমাণীকরণ (Authentication) প্রয়োজন।'
            details = {'auth_header': 'Bearer token required'}
        elif isinstance(exc, PermissionDenied):
            error_code = 'PERMISSION_DENIED'
            error_message = 'আপনার এই অপারেশনে অনুমতি নেই।'
            details = response.data if isinstance(response.data, dict) else {'detail': str(response.data)}
        elif isinstance(exc, NotFound):
            error_code = 'RESOURCE_NOT_FOUND'
            error_message = 'অনুরোধকৃত রিসোর্সটি খুঁজে পাওয়া যায়নি।'
        elif isinstance(exc, MethodNotAllowed):
            error_code = 'METHOD_NOT_ALLOWED'
            error_message = 'অনুরোধকৃত HTTP Method এই এন্ডপয়েন্টে অনুমোদিত নয়।'
        elif isinstance(exc, Throttled):
            error_code = 'RATE_LIMIT_EXCEEDED'
            error_message = 'অনুরোধের সীমা অতিক্রম করেছে। কিছুক্ষণ পর পুনরায় চেষ্টা করুন।'
        elif isinstance(exc, BaseTSSException):
            error_code = exc.code
            error_message = exc.message
            details = exc.details

        # Wrap in uniform JSON schema
        formatted_data = {
            'success': False,
            'error': {
                'code': error_code,
                'message': error_message,
                'details': details if details else response.data
            }
        }
        response.data = formatted_data
        return response

    return None
