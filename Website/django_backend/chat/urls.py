from django.urls import path , include
from .views import display_all_users 

urlpatterns = [
	path('Users', display_all_users, name='Users'),
]
