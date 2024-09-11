from django.urls import path

def get_websocket_urlpatterns():
    from chat.consumers import Private_ws_update, Private_ws_get, Channel_ws, Global_ws, get_Users_ws, update_or_create_user_interaction
    from Dashboard_home.consumers import ProfileImageConsumer
    from notification.consumers import notificationConsumer
    from playground.consumers import MatchConsumer, gameLunch, GameScore, privateGame
    from groups.consumers import create_or_add_to_groups_ws
    from playground.consumers import Tournament
    return [
        path('matchmaking/', MatchConsumer.as_asgi()),
        path('GameScore/', GameScore.as_asgi()),
        path("MultiAqua/",Tournament.as_asgi()),
        path('privateGame/', privateGame.as_asgi()),
        path('gameLunch/<str:game>/', gameLunch.as_asgi()),
        path('private_update/', Private_ws_update.as_asgi()),
        path('private_get/', Private_ws_get.as_asgi()),
        path('channel_chat/', Channel_ws.as_asgi()),
        path('global_chat/', Global_ws.as_asgi()),
        path('UserI/', get_Users_ws.as_asgi()),
        path('create_or_add_to_groups/', create_or_add_to_groups_ws.as_asgi()),
        path('u_or_c/', update_or_create_user_interaction.as_asgi()),
        path('ws/profile-image/', ProfileImageConsumer.as_asgi()),
        path('ws/notifications/', notificationConsumer.as_asgi()),
    ]

websocket_urlpatterns = get_websocket_urlpatterns()