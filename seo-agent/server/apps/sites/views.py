from rest_framework import viewsets, filters
from .models import Site
from .serializers import SiteSerializer

class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug', 'domain']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
