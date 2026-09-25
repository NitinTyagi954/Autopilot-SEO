from rest_framework import serializers
from .models import Site

class SiteSerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = Site
        fields = ['id', 'name', 'slug', 'domain', 'description', 'posts_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'posts_count']

    def get_posts_count(self, obj):
        return obj.posts.count() if hasattr(obj, 'posts') else 0
