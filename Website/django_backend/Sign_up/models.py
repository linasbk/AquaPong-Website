from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
import random
import string



class User(AbstractUser):
    userID = models.BigAutoField( primary_key=True, unique=True)
    firstlogin = models.BooleanField(default=True)
    intralogin = models.CharField(max_length=50, default='None')
    fullName = models.CharField(max_length=100)
    gender = models.BooleanField(null=True, blank=True)
    status = models.CharField(max_length=10, default='offline')
    password = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    otp_enabled = models.BooleanField(default=False)
    otp_verified = models.BooleanField(default=False)
    otp_base32 = models.CharField(max_length=255, null=True, blank=True)
    otp_auth_url = models.CharField(max_length=255, null=True, blank=True)
    qr_code = models.ImageField(upload_to='static/qr_codes/',  blank=True, null=True)
    
