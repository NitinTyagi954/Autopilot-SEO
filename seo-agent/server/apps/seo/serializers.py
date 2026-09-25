from rest_framework import serializers
from .models import PostSEO

class PostSEOSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSEO
        fields = [
            'id', 'post', 'focus_keyword', 'seo_title', 'meta_description',
            'canonical_url', 'robots_index', 'robots_follow',
            'og_title', 'og_description', 'og_image',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
