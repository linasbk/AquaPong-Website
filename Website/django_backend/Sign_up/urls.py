from django.urls import path
from . import views
urlpatterns = [
    path('signup', views.Sign_up),
    path('signin', views.Sign_in),
    path('token/refresh', views.refresh_token_view, name='refresh_token'),
    path('signout', views.Sign_out),
    path('check-auth', views.check_auth),
    path('callback', views.callback),
    path('set-password', views.set_password),
    path('generate-otp', views.generateOTP),
    path('verify-otp', views.verifyOTP),
    path('disable-otp', views.disableOTP),
    path('delete-user', views.delete_user),
    path('change-password', views.changePassword),
]
