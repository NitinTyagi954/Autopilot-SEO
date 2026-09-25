from rest_framework import views, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.posts.models import Post
from .models import PostSEO
from .serializers import PostSEOSerializer

class PostSEOView(views.APIView):
    """
    Retrieve or update the SEO configuration for a specific post.
    Accessed at /api/v1/posts/{post_id}/seo/
    """
    def get(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        seo, created = PostSEO.objects.get_or_create(post=post)
        serializer = PostSEOSerializer(seo)
        return Response(serializer.data)

    def put(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        seo, created = PostSEO.objects.get_or_create(post=post)
        data = request.data.copy()
        data['post'] = post.id
        serializer = PostSEOSerializer(seo, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, post_id):
        return self.put(request, post_id)
