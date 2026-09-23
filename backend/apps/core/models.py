"""
Core Abstract Models for TSS (Tijarah Samity Software).
Provides standardized primary keys, timestamps, audit tracking, and tenant isolation foundations.
"""
import uuid
from django.db import models


class BaseUUIDModel(models.Model):
    """Abstract model providing a UUID primary key."""
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="ইউনিক আইডেন্টিফায়ার (UUID)"
    )

    class Meta:
        abstract = True


class TimeStampedModel(models.Model):
    """Abstract model providing automatic creation and update timestamps."""
    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        help_text="তৈরির সময় (UTC)"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        editable=False,
        help_text="সর্বশেষ হালনাগাদের সময় (UTC)"
    )

    class Meta:
        abstract = True


class OrganizationScopedModel(models.Model):
    """
    Abstract model enforcing multi-tenant isolation.
    Every financial and domain entity must inherit from this model.
    """
    organization_id = models.CharField(
        max_length=64,
        db_index=True,
        help_text="সমিতি / সংগঠনের ইউনিক আইডি (Tenant Identifier)"
    )

    class Meta:
        abstract = True


class AuditableModel(models.Model):
    """
    Abstract model capturing actor audit metadata for compliance and security audit trails.
    """
    created_by = models.CharField(
        max_length=64,
        null=True,
        blank=True,
        help_text="তৈরি কারী ব্যবহারকারীর আইডি"
    )
    updated_by = models.CharField(
        max_length=64,
        null=True,
        blank=True,
        help_text="সর্বশেষ পরিবর্তনকারী ব্যবহারকারীর আইডি"
    )

    class Meta:
        abstract = True


class TSSBaseEntity(BaseUUIDModel, TimeStampedModel, OrganizationScopedModel, AuditableModel):
    """
    Comprehensive base entity combining UUID, timestamps, tenant scoping, and actor audit trail.
    All TSS domain entities in future phases will inherit from this base.
    """
    class Meta:
        abstract = True
