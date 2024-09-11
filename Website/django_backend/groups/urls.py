# your_app/urls.py

from django.urls import path
from .views import check_user_joined

urlpatterns = [
    path('check_user_joined', check_user_joined, name='check_user_joined'),
]
