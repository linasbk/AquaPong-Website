import json 
from Dashboard_home.models import User
from .models import  C_Message,Channels, G_Message, P_Message, UserInteraction
from .serlializers import UsersSerializer,UserInteractionSerializer,Serialser_P_Message, Serialser_G_Message, Serialser_C_Message, friendsSerializer
from asgiref.sync import sync_to_async
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer

from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from django.shortcuts import get_object_or_404
from datetime import datetime
import os 
from django.db.models.signals import post_delete
import random
import string
import time
from django.db.models import Q

from Dashboard_home.models import Friends
channel_layer = get_channel_layer()


def get_user_id_by_name(username):
    try:
        user = User.objects.get(username=username)
        return user.userID
    except Exception as e:
        return None



def serialized_UserInteraction(userID):
        queryset = UserInteraction.objects.filter(userID=userID).order_by('-interaction_time')
        serializer = UserInteractionSerializer(queryset, many=True)
        serialized_data = json.dumps(serializer.data)
        return serialized_data


def serialized_UserFriends(userID):
    try:
        user = User.objects.get(userID=userID)
        queryset = Friends.objects.filter(Q(user=user) | Q(friend=user), status=True)

        list_of_my_users = []
        
        for userr in queryset:
            if user == userr.user:
                list_of_my_users.append(userr.friend)
            else:
                list_of_my_users.append(userr.user)
        serializer = UsersSerializer(list_of_my_users, many=True)
        serialized_data = serializer.data
        serialized_json = json.dumps(serialized_data)
        return serialized_json
    except User.DoesNotExist:
        return {"error": "User not found"}
    



def send_data_to_group(userID):
    serialized_data = serialized_UserInteraction(userID)
    group_name = f"user_{userID}"
    try:
            async_to_sync(channel_layer.group_send)(
                group_name, 
                {
                    "type": "chat.message",
                    "message": serialized_data
                }
            )
    except Exception as e:
            print(f"Error sending data to group: {group_name} - {e}")


class get_Users_ws(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.group_name = None
        self.online = None
        self.My_token = None
        self.user = None
    def receive(self, text_data):
        try :
            data = json.loads(text_data)
            self.My_token = get_user_id_by_name(data.get('my_username'))
            self.online = data.get('online')
            if  self.My_token :
                if self.online:
                    self.user = User.objects.get(userID=self.My_token)
                    self.user.status = self.online
                    self.user.status = self.online
                    self.user.save()
                self.group_name = f"user_{self.My_token}"
                async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
                serialized_data = serialized_UserInteraction(self.My_token)
                async_to_sync(self.channel_layer.group_send)(
                    self.group_name, 
                    {
                        "type": "chat_message", 
                        "message": serialized_data
                    }
                )
                serialized_data = serialized_UserFriends(self.My_token)
                async_to_sync(self.channel_layer.group_send)(
                    self.group_name, 
                    {
                        "type": "chat_message", 
                        "message": serialized_data
                    }
                )
        except Exception as e:
            print(f"Error in receive method: {str(e)}")


    def disconnect(self, close_code):
        if self.online:
            if User.objects.filter(userID=self.My_token).exists() :
                self.user = User.objects.get(userID=self.My_token)
                if self.user.status == "online":
                    self.user.status = "offline"
                    self.user.save()
        if self.group_name :
            async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)

              
    def chat_message(self, event):
        message = event['message']
        self.send(message)


@receiver(post_save, sender=UserInteraction)
def user_interaction_update(sender, instance, created, **kwargs):
    send_data_to_group(instance.userID)



@receiver(post_save, sender=Friends)
@receiver(post_delete, sender=Friends)
def handle_user_update(sender, instance, **kwargs):
    created = kwargs.get('created', None)
    is_deleted = kwargs.get('signal') == post_delete
    def update_user(user_id,another_user):
        if created or is_deleted:
            try:
                another_user = User.objects.get(userID=another_user)
                userinteraction = UserInteraction.objects.get(userID=user_id,user=another_user)
                if not userinteraction.friends and created:
                     userinteraction.friends = instance
                elif  userinteraction.friends and is_deleted:
                     userinteraction.friends = None
                userinteraction.save()
            except Exception as e:
                print(f"Error in receive method: {str(e)}")
        serialized_data = serialized_UserFriends(user_id)
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}",
            {
                "type": "chat_message",
                "message": serialized_data
            }
        )
    update_user(instance.user.userID,instance.friend.userID)
    update_user(instance.friend.userID,instance.user.userID)





#kndoz 3la ga3 dok userintract  li 3ndhom had user 3ad knjbd token dyalhom 3ad knsyft lihom 
@receiver(post_save, sender=User)
def user_update(sender, instance, created, **kwargs):
    grouo = G_Message.objects.filter(sender=instance).first()
    if grouo:
        grouo.save()

    user_interactions = UserInteraction.objects.filter(user=instance)
    for interaction in user_interactions:
        userID = interaction.userID
        send_data_to_group(userID)
    friends = Friends.objects.filter(Q(user=instance) | Q(friend=instance))
    for friend in friends:
        friend.save() 

@receiver(post_save, sender=Friends)
def user_update(sender, instance, created, **kwargs):
    user_interactions = UserInteraction.objects.filter(friends=instance)
    for interaction in user_interactions:
        userID = interaction.userID
        send_data_to_group(userID)

#nsave 3ndi m3amn hdart wkdalk 3nd users lokhrin anhom hdro m3aya 

# dik unread_messages mli nsyft lchi wahd wnbghi nupditi 3ndo dak unread_messages wdyalo 3ndi ana nrdo  l 0

class update_or_create_user_interaction(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.user_token = None
        self.my_token = None



    def receive(self, text_data):
        data = json.loads(text_data)
        self.user_token = get_user_id_by_name(data.get('user_username'))
        self.my_token = get_user_id_by_name(data.get('my_username'))
        time = data.get('Unread_messages')
        typing = data.get('typing')
        
        if self.user_token and self.my_token:
            userr = get_object_or_404(User, userID=self.user_token)
            me = get_object_or_404(User, userID=self.my_token)
            current_time = datetime.now()
            try:
                if Friends.objects.filter(user=me,friend=userr).exists():
                    friends =Friends.objects.get(user=me,friend=userr)
                elif Friends.objects.filter(user=userr,friend=me).exists():
                    friends =Friends.objects.get(user=userr,friend=me)
                else:
                    friends = None
                me_save_user = UserInteraction.objects.get(user=userr, userID=self.my_token)
                user_save_me = UserInteraction.objects.get(user=me, userID=self.user_token)
                if (time == "unread_messages"):
                    me_save_user.unread_messages = 0
                    me_save_user.friends = friends
                    me_save_user.save()
                    if (typing > 1):
                        user_save_me.typing = True
                        user_save_me.save()
                    elif (typing == 0):
                        user_save_me.typing = False
                        user_save_me.save()
                else:
                    print("User Interaction exists for:", userr.username)
                    me_save_user.interaction_time = current_time
                    me_save_user.friends = friends
                    me_save_user.unread_messages = 0
                    me_save_user.save()
                    ######
                    user_save_me.interaction_time = current_time
                    user_save_me.friends = friends
                    user_save_me.unread_messages += 1
                    user_save_me.typing = False
                    user_save_me.save()

            except UserInteraction.DoesNotExist:
                if not UserInteraction.objects.filter(userID = self.my_token, user=userr).exists() and (self.my_token != self.user_token):
                    me_save_user = UserInteraction.objects.create( userID = self.my_token, user=userr, interaction_time=current_time,friends=friends)
                elif  not UserInteraction.objects.filter(userID = self.user_token, user=me).exists() and (self.my_token != self.user_token):
                    user_save_me = UserInteraction.objects.create(userID = self.user_token, user=me, interaction_time=current_time,friends=friends)

    def disconnect(self, close_code):
        if User.objects.filter(userID=self.user_token).exists() and User.objects.filter(userID=self.my_token).exists():
            userr = User.objects.get(userID=self.user_token)
            me = User.objects.get( userID=self.my_token)

            user_save_me = UserInteraction.objects.get(user=me, userID=self.user_token)
            user_save_me.typing = False
            user_save_me.save()
            self.my_token = None
            self.user_token = None

    
    def send_response(self, data):
        self.send(json.dumps(data))


def generate_random_string(length):
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for _ in range(length))





# 3rfet user_token w self.my_token bach n9dr nkhznhom mli nsyft text bohdo w morah lfile 
class Private_ws_update(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.user_token = None  
        self.my_token = None
        self.chat_id = None
        self.contentt = None
        self.file = None 
        self.message_id = None
        self.imoji = None  
        self.vu = None 
        print("WebSocket connected")

    async def disconnect(self, close_code):
        self.user_token = None  
        self.my_token = None
        self.chat_id = None
        self.contentt = None
        self.file = None
        self.message_id = None
        self.imoji = None 
        print("WebSocket disconnected")

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)
            self.user_token =  get_user_id_by_name(data.get('user_username'))
            self.my_token =  get_user_id_by_name(data.get('my_username'))
            self.contentt = data.get('Content')
            self.file = data.get('File')
            self.imoji = data.get('Imoji')
            self.message_id = data.get('id')  
            self.vu = data.get('vu')         
            self.chat_id = f'{min(self.my_token, self.user_token)}_{max(self.my_token, self.user_token)}'

            if self.user_token and self.my_token and self.contentt and self.contentt != "" and not self.file and not self.imoji:
                try:
                    self.group_name = self.chat_id
                    userr = await User.objects.aget(userID=self.user_token)
                    me = await User.objects.aget(userID=self.my_token)
                    message = await P_Message.objects.acreate(
                        chat_id=self.chat_id,
                        sender=me,
                        receiver=userr,
                        content=self.contentt,
                    )
                except Exception as e:
                    print("Error while creating message:", e)

            elif self.message_id and self.imoji or self.vu:
                try:
                    message = await P_Message.objects.aget(id=self.message_id)
                    if self.imoji:
                        message.imoji = self.imoji
                    message.vu = self.vu
                    message.id = self.message_id
                    await message.asave()
                except P_Message.DoesNotExist:
                    print(f"Message with ID {self.message_id} does not exist.")
                except Exception as e:
                    print("Error while updating emoji:", e)

        elif bytes_data:
            try:
                if self.user_token and self.my_token:
                    userr = await User.objects.aget(userID=self.user_token)
                    me = await User.objects.aget(userID=self.my_token)

                    # Handle image file data
                    image_data = bytes_data
                    image_name = generate_random_string(10) + '.jpg'
                    file_path = os.path.join('./media/private_messages/', image_name)
                    with open(file_path, 'wb') as f:
                        f.write(image_data)
                    
                    message = await P_Message.objects.acreate(
                        chat_id=self.chat_id,
                        sender=me,
                        receiver=userr,
                        content=self.contentt,
                        image=file_path,
                    )
                    self.contentt = ""
                    self.file = None 
            except Exception as e:
                print("Error while handling bytes data:", e)
           
            



class Private_ws_get(WebsocketConsumer):
    def connect(self):
        self.group_name = None
        self.group_name = None
        self.accept()

    def disconnect(self, close_code):
        if self.group_name:
            async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)
        if self.group_name:
            async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)
        print("WebSocket disconnected")

    def receive(self, text_data,   bytes_data=None): 
        if (text_data) :
            if self.group_name:
                async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)      
        if (text_data) :
            if self.group_name:
                async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)      
            data = json.loads(text_data)
            user_token = get_user_id_by_name(data.get('user_username'))
            my_token = get_user_id_by_name(data.get('my_username'))
        try:
            if user_token and my_token:
                chat_id = f'{min(my_token, user_token)}_{max(my_token, user_token)}'
                self.group_name = chat_id
                async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
                queryset = P_Message.objects.filter(chat_id=chat_id).order_by('id')
                serializer = Serialser_P_Message(queryset, many=True)
                serialized_data = json.dumps(serializer.data)
                group_name = chat_id
                try:
                    async_to_sync(channel_layer.group_send)(
                     group_name, 
                    {
                        "type": "chat.message", 
                        "message": serialized_data
                    }
                    )
                except Exception as e:
                    print("Error:", e)
        except Exception as e:
            print("Error:", e)

    def chat_message(self, event):
       message = event['message']
       self.send(message)


@receiver(post_save, sender=P_Message)
def user_interaction_saved(sender, instance, created, **kwargs):
        chat_id = instance.chat_id
        queryset = P_Message.objects.filter(chat_id=chat_id).order_by('id')
        serializer = Serialser_P_Message(queryset, many=True)
        serialized_data = json.dumps(serializer.data)
        group_name = chat_id
        try:
            async_to_sync(channel_layer.group_send)(
                group_name, 
                {
                    "type": "chat.message", 
                    "message": serialized_data
                }
            )
        except Exception as e:
            print(f"Error sending data to group: {group_name} - {e}")
    









def send_to_global():
        queryset = G_Message.objects.all().order_by('timestamp')
        serializer = Serialser_G_Message(queryset, many=True)
        serialized_data = json.dumps(serializer.data)
        group_name = "GLOBAL_CHAT_WS_PRV"
        try:
            async_to_sync(channel_layer.group_send)(
                group_name, 
                {
                    "type": "chat.message",
                    "message": serialized_data
                }
            )
        except Exception as e:
            print(f"Error sending data to group: {group_name} - {e}")







class Global_ws(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.group_name = "GLOBAL_CHAT_WS_PRV"
        self.my_token = None
        self.content = None
        self.file = None  

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)
        self.my_token = None
        self.content = None
        self.file = None

    def receive(self, text_data):
        data = json.loads(text_data)
        self.my_token = get_user_id_by_name(data.get('my_username'))
        self.content = data.get('Content')
        


        if  self.my_token:   
            async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
            try:
                if self.my_token and self.content and self.content != "":
                    me = User.objects.get(userID=self.my_token)
                    message = G_Message.objects.create(
                        sender=me,
                        content=self.content,
                    )
                    print("-----Content:", self.content)
                elif self.my_token :
                    send_to_global()
            except Exception as e:
                print("Error:", e)
            
    def chat_message(self, event):
        message = event['message']
        self.send(message)




@receiver(post_save, sender=G_Message)
def user_interaction_update(sender, instance, created, **kwargs):
            send_to_global()









def send_to_Channel(Channel_name):
        queryset = C_Message.objects.filter(channel=Channel_name).order_by('timestamp')
        serializer = Serialser_C_Message(queryset, many=True)
        serialized_data = json.dumps(serializer.data)
        group_name = Channel_name
        print("------------------------>")
        try:
            async_to_sync(channel_layer.group_send)(
                group_name, 
                {
                    "type": "Channel_send",
                    "message": serialized_data
                }
            )
        except Exception as e:
            print(f"Error sending data to group: {group_name} - {e}")




class Channel_ws(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.group_name = "a"
        self.my_token = None
        self.content = None
        self.file = None  

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)
        self.my_token = None
        self.content = None
        self.file = None
        print(f"WebSocket disconnected from group: {self.group_name}")

    def receive(self, text_data):
        data = json.loads(text_data)
        self.my_token = get_user_id_by_name(data.get('my_username'))
        self.content = data.get('Content')
        self.group_name = data.get('Channel')
        if  self.my_token:   
            async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
            try:                
                if self.my_token and self.group_name and not self.content:
                    me = get_object_or_404(User, userID=self.my_token)
                    messages = C_Message.objects.exclude(sender=me)
                    for message in messages:
                        if me not in message.viewed_by.all():
                            message.viewed_by.add(me)
                            message.save()
                    send_to_Channel(self.group_name)
                elif self.my_token and self.content and self.content != "":
                        me = get_object_or_404(User, userID=self.my_token)
                        last_message = C_Message.objects.exclude(sender=me).last()
                        if last_message:
                            if me not in last_message.viewed_by.all():
                                last_message.viewed_by.add(me)
                                last_message.save()
                        message = C_Message.objects.create(
                            channel=self.group_name,
                            sender=me,
                            content=self.content,
                        )
            except Exception as e:
                print("Error:", e)
            
    def Channel_send(self, event):
        message = event['message']
        self.send(message)





@receiver(post_save, sender=C_Message)
def user_interaction_update(sender, instance, created, **kwargs):
            send_to_Channel(instance.channel) 
            send_to_Channel(instance.channel) 