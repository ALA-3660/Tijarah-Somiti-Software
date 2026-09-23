"""
Audit Models for TSS (Tijarah Samity Software).
Provides immutable event recording for security, access governance, and sensitive data access.
"""
from django.db import models
from apps.core.models import BaseUUIDModel, TimeStampedModel, OrganizationScopedModel


class BaseAuditEvent(BaseUUIDModel, TimeStampedModel, OrganizationScopedModel):
    """
    Immutable audit event record foundation.
    Stores governance and security occurrences with IP and actor metadata.
    """
    actor_user_id = models.CharField(
        max_length=64,
        db_index=True,
        help_text="কর্মকাণ্ড সম্পাদনকারী ব্যবহারকারীর আইডি"
    )
    action = models.CharField(
        max_length=64,
        db_index=True,
        help_text="সম্পাদিত কাজের ধরন (e.g. LOGIN, LOGOUT, ACCOUNT_SENSITIVE_REVEALED)"
    )
    entity_type = models.CharField(
        max_length=64,
        null=True,
        blank=True,
        help_text="সম্পর্কিত এনটিটির নাম"
    )
    entity_id = models.CharField(
        max_length=64,
        null=True,
        blank=True,
        help_text="সম্পর্কিত এনটিটির আইডি"
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="ক্লায়েন্ট আইপি অ্যাড্রেস"
    )
    user_agent = models.TextField(
        null=True,
        blank=True,
        help_text="ব্রাউজার / ক্লায়েন্ট ইউজার এজেন্ট"
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="অতিরিক্ত অডিট বিবরণী (JSON)"
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization_id', 'created_at']),
            models.Index(fields=['actor_user_id', 'created_at']),
        ]

    def __str__(self):
        return f"[{self.created_at}] {self.actor_user_id} - {self.action}"
