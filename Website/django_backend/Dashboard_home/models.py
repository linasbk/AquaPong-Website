from django.db import models
from Sign_up.models import User



class Leaderbord(models.Model):
    leaderbordID = models.AutoField(primary_key=True)
    score = models.IntegerField(default=0)
    lose = models.IntegerField(default=0)  # Set default value for lose
    match = models.IntegerField(default=0)
    win = models.IntegerField(default=0)  # Set default value for win
    userID = models.ForeignKey(User, on_delete=models.CASCADE)  # Remove unique=True
    level= models.IntegerField(default=0)
    goldaqua = models.IntegerField(default=0)  
    darkaqua = models.IntegerField(default=0) 
    aqua  = models.IntegerField(default=0) 
    mainLvl = models.IntegerField(default=0)
    maxlvl = models.IntegerField(default=100)
    

    class Meta:
        verbose_name_plural = "Leaderbord"
        constraints = [
            models.UniqueConstraint(fields=['userID'], name='unique_userID')
        ]

class Friends(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_friends')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_of')
    status = models.BooleanField(default=False)
    blocked_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifidddcations_received', null=True, blank=True)
    class Meta:
       verbose_name_plural = "Friends"


class selected_map(models.Model):
    selected_map = models.CharField(max_length=100)
    class Meta:
       verbose_name_plural = "selected_map"



class Cleans(models.Model):
    type = models.CharField(max_length=100) 
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, through='Memberships', related_name='groups_membership')

class Memberships(models.Model):
    person = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Cleans, on_delete=models.CASCADE)
    date_joined = models.DateField()