from django.urls import path 
from . import views 

urlpatterns =[
    path('change_user_status',views.change_user_status),
    path('accept_game_req/<int:friendID>',views.accept_game_req),
    path('add_friend/<int:friendID>',views.add_friend),
    path('invite_prv_game/<int:friendID>',views.invite_prv_game),
    path('invite_prv_game/<int:friendID>',views.invite_prv_game),
    path('remove_friend/<int:friendID>',views.remove_frined),
    path('accpter_friend_invitaion/<int:friendID>/<str:a>',views.accpter_friend),
    path('refuse_friend/<int:friendID>/<str:a>',views.refus_friend),
    path('blocker_friend/<int:friendID>',views.block_friend),
    path('deblocker_friend/<int:friendID>',views.deblocker_friend),
    path('show_block/<int:friendID>',views.show_block),
    path('statistical',views.get_statistical_solo),   
    path('statistical',views.get_statistical_solo),   
] 