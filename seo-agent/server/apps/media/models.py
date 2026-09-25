import uuid
from django.db import models
from apps.sites.models import Site

def media_upload_path(instance, filename):
    site_slug = instance.site.slug if instance.site else 'global'
    return f"uploads/{site_slug}/{uuid.uuid4().hex[:8]}_{filename}"

class Media(models.Model):
    class StorageProvider(models.TextChoices):
        LOCAL = 'local', 'Local Storage'
        S3 = 's3', 'Amazon S3'
        R2 = 'r2', 'Cloudflare R2'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='media', null=True, blank=True)
    file = models.FileField(upload_to=media_upload_path, blank=True, null=True)
    url = models.URLField(max_length=1000, blank=True, help_text="Direct URL if stored on CDN / S3 / R2")
    filename = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=100, blank=True, default='')
    file_size = models.PositiveIntegerField(default=0, help_text="Size in bytes")
    alt_text = models.CharField(max_length=255, blank=True, default='')
    storage_provider = models.CharField(
        max_length=20,
        choices=StorageProvider.choices,
        default=StorageProvider.LOCAL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if self.file and not self.url:
            self.url = self.file.url if hasattr(self.file, 'url') else ''
            if not self.filename:
                self.filename = self.file.name
            if not self.file_size and hasattr(self.file, 'size'):
                self.file_size = self.file.size
        super().save(*args, **kwargs)

    def __str__(self):
        return self.filename or str(self.id)
