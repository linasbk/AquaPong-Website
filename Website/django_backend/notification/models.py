from django.db import models
from Sign_up.models import User
# Create your models here.
class notification(models.Model):
    userID = models.ForeignKey(User , on_delete=models.CASCADE ,related_name='notifications_received')
    notificationUserID = models.ForeignKey(User , on_delete=models.CASCADE,related_name='notifications_sent')
    message = models.CharField(max_length=100)
    display = models.IntegerField(default=0)
    chek_view  = models.IntegerField(default=0)