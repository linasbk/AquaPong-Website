# routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/notifications/', consumers.notificationConsumer.as_asgi()),
]
# (`ws://10.11.12.3:8080/ws/profile-image${userID}/`)