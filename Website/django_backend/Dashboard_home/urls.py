
from django.urls import path
from . import views

urlpatterns = [
    path('leaderboard', views.Lead_board, name='leaderboard'),  # Corrected URL pattern
    path('getimage',views.get_image_profil),
    path('search/<str:username>',views.search),    
    path('Statistic/<str:username>',views.Statistic),
    path('update_image',views.update_image),
    path('update_fullname',views.update_fullname),
    path('update_username',views.update_username),
    #profiiiiiiiile
    path('group_info/<str:username>',views.group_info),
    path('user_info/<str:username>',views.user_info),
    path('MatchHistorySolo/<str:username>',views.MatchHistorySolo),
    path('History_tournaments/<str:username>',views.History_tournaments),
    path('set_selected_map',views.set_selected_map),
]