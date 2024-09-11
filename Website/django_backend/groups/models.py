from django.db import models
from Dashboard_home.models import User




class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=100)
    users = models.ManyToManyField(User, blank=True)
    status = models.CharField(max_length=10)
    admin = models.ForeignKey(User, related_name='admin_group', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.name

