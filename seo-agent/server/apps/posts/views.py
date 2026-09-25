from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Post
from .serializers import PostListSerializer, PostDetailSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().select_related('site', 'category', 'featured_image').prefetch_related('tags')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'slug', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return PostDetailSerializer
        return PostListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        site_id = self.request.query_params.get('site')
        status_param = self.request.query_params.get('status')
        slug_param = self.request.query_params.get('slug')

        if site_id:
            qs = qs.filter(site_id=site_id)
        if status_param:
            qs = qs.filter(status=status_param)
        if slug_param:
            qs = qs.filter(slug=slug_param)
        return qs

    @action(detail=False, methods=['get'], url_path='public/(?P<slug>[^/.]+)')
    def public_post(self, request, slug=None):
        """
        Public endpoint for rendering single published post by slug.
        Filters strictly by status=PUBLISHED. Returns 404 otherwise.
        """
        site_param = request.query_params.get('site')
        qs = Post.objects.filter(slug=slug, status=Post.Status.PUBLISHED)
        if site_param:
            qs = qs.filter(site__slug=site_param) | qs.filter(site_id=site_param)
        
        post = qs.select_related('site', 'category', 'featured_image', 'seo').prefetch_related('tags').first()
        if not post:
            return Response({'detail': 'Published post not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PostDetailSerializer(post, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='public')
    def public_posts_list(self, request):
        """
        Public endpoint for listing published posts.
        """
        site_param = request.query_params.get('site')
        qs = Post.objects.filter(status=Post.Status.PUBLISHED)
        if site_param:
            qs = qs.filter(site__slug=site_param) | qs.filter(site_id=site_param)
        
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = PostListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = PostListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)
