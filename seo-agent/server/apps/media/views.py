from rest_framework import viewsets, filters
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Media
from .serializers import MediaSerializer

class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['filename', 'alt_text']
    ordering_fields = ['created_at', 'filename', 'file_size']

    def get_queryset(self):
        qs = super().get_queryset()
        site_id = self.request.query_params.get('site')
        if site_id:
            qs = qs.filter(site_id=site_id)
        return qs

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES.get('file')
        if uploaded_file:
            serializer.save(
                filename=uploaded_file.name,
                mime_type=uploaded_file.content_type,
                file_size=uploaded_file.size
            )
        else:
            serializer.save()
