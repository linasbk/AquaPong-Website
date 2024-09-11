import json 
from .models import  Group
from Dashboard_home.models import User
from .serlializers import UsersSerializer, GroupSerializer
from asgiref.sync import sync_to_async
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from django.shortcuts import get_object_or_404
from datetime import datetime
import os 
import random
import string
from notification.models import notification
from chat.serlializers import UsersSerializer
from django.http import JsonResponse
from .serlializers import GroupSerializer, Groupmambersserializer
from django.db.models import Q
channel_layer = get_channel_layer()


def get_all_users_in_group(group_name):
    try:
        group = Group.objects.get(name=group_name)
        serializer = Groupmambersserializer(group) 
        return json.dumps(serializer.data)
       
    except Group.DoesNotExist:
        return json.dumps({"error": "Group does not exist"})


def get_all_groups(filter_char=None):
    if filter_char:
        groups = Group.objects.filter(name__icontains=filter_char)
    else:
        groups = Group.objects.all()
    
    serializer = GroupSerializer(groups, many=True)
    return json.dumps(serializer.data)


class create_or_add_to_groups_ws(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.group_name = None

    def disconnect(self, close_code):
        if self.group_name:
            async_to_sync(self.channel_layer.group_discard)("groups_users_any_change", self.channel_name)

    def receive(self, text_data):
        data = json.loads(text_data)
        my_userID = data.get('my_userID')
        user_token=data.get('user_token')
        create_or_add_user = data.get('create_or_add')
        self.group_name = "groups_users_any_change"
        group_name = data.get('Group_name')
        status = data.get('status')
        icon = data.get('icon')
        search = data.get('search')
        me = User.objects.get(userID=my_userID)
#is_joined
        if   create_or_add_user == "get_all_users" :
                if group_name:
                    serialized_users = get_all_users_in_group(group_name)
                    self.send(serialized_users)
                elif Group.objects.filter(users=me).exists():
                    group =  Group.objects.get(users=me)
                    serialized_users = get_all_users_in_group(group.name)
                    self.send(serialized_users)

        elif my_userID and create_or_add_user == "get_groups" and not Group.objects.filter(users=me).exists():
             self.send(get_all_groups(search))
        if  my_userID and create_or_add_user == "create_group":
            async_to_sync(self.channel_layer.group_add)("groups_users_any_change", self.channel_name)

            try:
                if  Group.objects.filter(name=group_name).exists() or Group.objects.filter(users=me).exists():
                    self.send("the group already exists or user exits in another group")
                else:
                    group = Group.objects.create(
                    admin=me,
                    name=group_name,
                    icon=icon,
                    status=status
                    )
                    group.users.add(me)
                    group.save()
                    self.send("successfully created")
            except  Group.DoesNotExist :
                    print("More than one group found with that name")
            except Group.MultipleObjectsReturned:
                print("More than one group found with that name")
        elif  my_userID and create_or_add_user == "delete_group":
            try:
                group = Group.objects.get(admin=me)
                if group.users.count() == 1:
                    group.delete()
                    self.send("successfully deleted")
            except  Group.DoesNotExist :
                    print("error")
        elif  my_userID and create_or_add_user == "join_group":
            try:
                Groups = Group.objects.get(name=group_name)           
                if Group.objects.filter(users=me).exists():
                    self.send("this user exits in another group")
                elif  Groups.users.count() >= 10:
                    self.send("Maximum Number of Users is 10")
                elif Groups.status == "Private" :
                    if not notification.objects.filter(userID=me,  notificationUserID=Groups.admin, message='join_group').exists():
                        notification.objects.create(userID=me,  notificationUserID=Groups.admin, message='join_group')
                else :
                    Groups.users.add(me)
            except  Group.DoesNotExist :
                    print("error")
        elif  my_userID and create_or_add_user == "remove_user":
            try:            
                user = User.objects.get(userID=user_token)
                Groups = Group.objects.get(users=user,name=group_name)
                if Groups.admin == me:
                    Groups.users.remove(user)
                # self.send(f"{user.username} successfully deleted")
            except  Group.DoesNotExist :
                    print("error")
        elif  my_userID and create_or_add_user == "add_admin_user":
            try:            
                user = User.objects.get(userID=user_token)
                me = User.objects.get(userID=my_userID)
                Groups = Group.objects.get(users=user,name=group_name)
                if Groups.admin == me:
                    Groups.admin = user
                    Groups.save()
        
            except  Group.DoesNotExist :
                    print("error")
        elif  my_userID and create_or_add_user == "leave_clan":
            try:            
                me = User.objects.get(userID=my_userID)
                Groups = Group.objects.get(users=me,name=group_name)
                if not Group.objects.filter(admin=me,name=group_name).exists():
                    Groups.users.remove(me)
            except  Group.DoesNotExist :
                    print("error")

    def chat_message(self, event):
       message = event['message']
       self.send(message)


