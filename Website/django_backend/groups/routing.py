
from chat.consumers import Private_ws_update, Private_ws_get, Channel_ws, Global_ws, get_Users_ws, update_or_create_user_interaction
from django.urls import path

websocket_urlpatterns = [
    
    path('private_update/', Private_ws_update.as_asgi()),

    path('private_get/', Private_ws_get.as_asgi()),

    path('channel_chat/', Channel_ws.as_asgi()),

    path('global_chat/', Global_ws.as_asgi()),

    path('UserI/', get_Users_ws.as_asgi()),

    path('u_or_c/', update_or_create_user_interaction.as_asgi()),

]
