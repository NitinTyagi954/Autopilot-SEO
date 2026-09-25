from django.urls import path
from .views import PostSEOView

urlpatterns = [
    path('', PostSEOView.as_view(), name='post-seo'),
]
