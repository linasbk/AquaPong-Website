from django.contrib import admin
from .models import  Channels ,P_Message, G_Message, C_Message,UserInteraction
# Register your models here.
from Dashboard_home.models import User

admin.site.register(Channels)
admin.site.register(P_Message)
admin.site.register(C_Message)
admin.site.register(G_Message)
admin.site.register(UserInteraction)