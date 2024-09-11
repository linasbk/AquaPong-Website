from rest_framework import serializers
from .models import User, notification

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = '__all__'

class notificationSerializer(serializers.ModelSerializer):
    userID = UsersSerializer()
    notificationUserID = UsersSerializer()  
    class Meta:
        model = notification
        fields = '__all__'
