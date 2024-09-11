from django.db import models
from django.contrib.auth.models import AbstractUser
from Dashboard_home.models import Friends
#chat_id hwa id kytkwn bin token dyal joj dyal users n9d n3rf bih prv_chat w blocked chat wbzaf dyal lhwayej ex {{min(sender_id, receiver_id)}_{max(sender_id, receiver_id)}'}
from Dashboard_home.models import User

# fl cunsemers mli user ysyft user akhor msg nsave lhad luser m3amen hdar (lyouser lakhor) w fltocken dyal user lkhor nsave lih wla nzid lih tht token dyalo m3amn hdr db hta hwa 
# dik unread_messages mli nsyft lchi wahd wnbghi nupditi 3ndo dak unread_messages wdyalo 3ndi ana nrdo  l 0
class UserInteraction(models.Model):
    userID = models.CharField(max_length=255,  blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
    interaction_time = models.DateTimeField(null=True)
    unread_messages = models.IntegerField(default=0)
    friends = models.ForeignKey(Friends, on_delete=models.SET_NULL, blank=True, null=True)
    typing = models.BooleanField( default=False)
    def __str__(self):
        return f"token_talked_with_{self.user.username} _at_ {self.interaction_time}"
    #just mname ky3ni bli token li chat had chat hdar m3a had user 


class Channels(models.Model):
    name = models.CharField(max_length=255, unique=True)
    members = models.ManyToManyField(User, related_name='channels')

    def __str__(self):
        return self.name   



class P_Message(models.Model):    
    chat_id = models.CharField(max_length=300, blank=True, null=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_p_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_p_messages')
    content = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='private_messages/', blank=True, null=True)
    image = models.ImageField(upload_to='private_messages/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    imoji = models.CharField(max_length=30, blank=True, null=True)
    vu = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}"


class C_Message(models.Model): 
    channel = models.TextField(blank=True, null=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_c_messages')
    content = models.TextField()
    viewed_by = models.ManyToManyField(User, related_name='viewed_c_messages', blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} -> Channel"


class G_Message(models.Model):
   
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_g_messages')
    content = models.TextField()
    image = models.ImageField(upload_to='group_messages/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.sender.username} -> Group"
    
