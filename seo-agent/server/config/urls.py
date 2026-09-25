from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.http import JsonResponse

def api_root_view(request):
    return JsonResponse({
        "status": "healthy",
        "service": "Autopilot SEO API Engine",
        "version": "v1",
        "endpoints": {
            "api_v1": "/api/v1/",
            "sites": "/api/v1/sites/",
            "posts": "/api/v1/posts/",
            "categories": "/api/v1/categories/",
            "tags": "/api/v1/tags/",
            "media": "/api/v1/media/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', api_root_view, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/v1/', include([
        path('sites/', include('apps.sites.urls')),
        path('posts/', include('apps.posts.urls')),
        path('', include('apps.taxonomy.urls')),
        path('media/', include('apps.media.urls')),
        path('posts/<uuid:post_id>/seo/', include('apps.seo.urls')),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
