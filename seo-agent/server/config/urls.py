from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
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
