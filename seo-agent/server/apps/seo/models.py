import uuid
from django.db import models
from apps.posts.models import Post

class PostSEO(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='seo')
    focus_keyword = models.CharField(max_length=255, blank=True, default='')
    seo_title = models.CharField(max_length=255, blank=True, default='')
    meta_description = models.TextField(blank=True, default='')
    canonical_url = models.URLField(max_length=500, blank=True, default='')
    robots_index = models.BooleanField(default=True, help_text="Allow search engines to index this page")
    robots_follow = models.BooleanField(default=True, help_text="Allow search engines to follow links on this page")
    og_title = models.CharField(max_length=255, blank=True, default='')
    og_description = models.TextField(blank=True, default='')
    og_image = models.URLField(max_length=1000, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Post SEO Configuration'
        verbose_name_plural = 'Post SEO Configurations'

    def __str__(self):
        return f"SEO: {self.post.title}"
