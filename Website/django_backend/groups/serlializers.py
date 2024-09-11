from rest_framework import serializers
from chat.models import UserInteraction,P_Message, G_Message, C_Message
from .models import Group
from chat.serlializers import UsersSerializer
from Dashboard_home.models import User

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'icon',  'status' ]


class Groupmambersserializer(serializers.ModelSerializer):
    users = UsersSerializer(many=True, read_only=True)
    admin = UsersSerializer(read_only=True)
    class Meta:
        model = Group
        fields = ['id','admin','users','name','icon','status' ]


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

    class Meta:
        model =     C_Message
        fields = '__all__'
