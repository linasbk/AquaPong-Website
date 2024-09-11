
from django.contrib import admin
from django.urls import path, include
import chat
from django.conf import settings
from django.conf.urls.static import static 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('chat/', include('chat.urls')),
    path('Sign_up/',include('Sign_up.urls')),
    path('Dashboard_home/',include('Dashboard_home.urls')),
    path('notification/',include('notification.urls')),
    path('groups/',include('groups.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
