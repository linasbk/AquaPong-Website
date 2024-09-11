from rest_framework import serializers
from Dashboard_home.models import User
from .models import  UserInteraction,P_Message, G_Message, C_Message
from Dashboard_home.models import Friends


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        exclude = ['password', 'otp_base32', 'otp_auth_url']

class friendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friends 
        fields = '__all__'

class UserInteractionSerializer(serializers.ModelSerializer):
    user = UsersSerializer() 
    friends = friendsSerializer()
    class Meta:
        model = UserInteraction
        fields = '__all__'

class Serialser_P_Message(serializers.ModelSerializer):
    sender = UsersSerializer()  
    receiver = UsersSerializer()  

    class Meta:
        model = P_Message
        fields = '__all__'

class Serialser_G_Message(serializers.ModelSerializer):
    sender = UsersSerializer()   

    class Meta:
        model =     G_Message
        fields = '__all__'




class Serialser_C_Message(serializers.ModelSerializer):
    sender = UsersSerializer()   
    viewed_by = UsersSerializer(many=True)
    class Meta:
        model =     C_Message
        fields = '__all__'