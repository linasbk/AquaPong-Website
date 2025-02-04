import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_backend.settings")

django_asgi_app = get_asgi_application()

def get_channelsmiddleware():
    from django_backend.routing import websocket_urlpatterns
    return URLRouter(websocket_urlpatterns)

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": get_channelsmiddleware(),
    }
)