from rest_framework import serializers
from .models import Post
from apps.taxonomy.serializers import CategorySerializer, TagSerializer
from apps.media.serializers import MediaSerializer
from apps.taxonomy.models import Category, Tag
from apps.media.models import Media

class PostListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    featured_image = MediaSerializer(read_only=True)
    site_name = serializers.CharField(source='site.name', read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'site', 'site_name', 'title', 'slug', 'excerpt',
            'status', 'author', 'featured_image', 'category', 'tags',
            'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PostDetailSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    featured_image_detail = MediaSerializer(source='featured_image', read_only=True)
    site_name = serializers.CharField(source='site.name', read_only=True)
    seo = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'site', 'site_name', 'title', 'slug', 'content', 'content_html',
            'excerpt', 'status', 'author', 'featured_image', 'featured_image_detail',
            'category', 'category_detail', 'tags', 'tags_detail', 'seo',
            'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_seo(self, obj):
        if hasattr(obj, 'seo'):
            from apps.seo.serializers import PostSEOSerializer
            return PostSEOSerializer(obj.seo).data
        return None
