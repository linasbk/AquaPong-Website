import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import User, Friends, Leaderbord
from django.core.serializers.json import DjangoJSONEncoder
from asgiref.sync import sync_to_async
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()
connected = False
class ProfileImageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            user_id = data['userid']  
            friends = []
            list_friends = []
            
            await channel_layer.group_add(
                str(user_id),
                self.channel_name
            )
            global connected
            connected = True
            user = User.objects.get(userID=user_id)
            
            if Friends.objects.filter(user=user, status=True).exists():
                friends = list(Friends.objects.filter(user=user, status=True))
                for friend in friends:
                    list_friends.append({
                        'id': friend.friend.userID,
                        'image': friend.friend.profile_image.url,
                        'username': friend.friend.username,
                        'status': friend.friend.status,
                    })
                    
            if Friends.objects.filter(friend=user, status=True).exists():
                friends += list(Friends.objects.filter(friend=user, status=True))
                for friend in friends:
                    if friend.user.userID != user_id:
                        list_friends.append({
                            'id': friend.user.userID,
                            'image': friend.user.profile_image.url,
                            'username': friend.user.username,
                            'status': friend.user.status,
                        })
            
            await self.send(text_data=json.dumps({'list_friends': list_friends}, cls=DjangoJSONEncoder))
        except Exception as e:
            await self.send(text_data=json.dumps({'error': str(e)}))

    async def user_update(self, event):
        await self.send(text_data=json.dumps(event, cls=DjangoJSONEncoder))


# @receiver(post_save, sender=Friends)
# def handle_user_update(sender, instance, created, **kwargs):
#     if connected:
#         user_id = instance.user.userID
#         list_friends = []
#         friends = []
#         user = User.objects.get(userID=user_id)
#         if Friends.objects.filter(user=user, status=True).exists():
#             friends = list(Friends.objects.filter(user=user, status=True))
#             for friend in friends:
#                 list_friends.append({
#                     'id': friend.friend.userID,
#                     'image': friend.friend.profile_image.url,
#                     'username': friend.friend.username,
#                     'status': friend.friend.status,
#                 })

#         if Friends.objects.filter(friend=user, status=True).exists():
#             friends += list(Friends.objects.filter(friend=user, status=True))
#             for friend in friends:
#                 if friend.user.userID != user_id:
#                     list_friends.append({
#                         'id': friend.user.userID,
#                         'image': friend.user.profile_image.url,
#                         'username': friend.user.username,
#                         'status': friend.user.status,
#                     })

#         async_to_sync(channel_layer.group_send)(
#             str(user_id), {'type': 'user_update', 'list_friends': list_friends}
#         )
#         print("))__________________________________=",user)

#         user_id = instance.friend.userID
#         list_friends = []
#         friends = []
#         user = User.objects.get(userID=user_id)

#         if Friends.objects.filter(user=user, status=True).exists():
#             friends = list(Friends.objects.filter(user=user, status=True))
#             for friend in friends:
#                 list_friends.append({
#                     'id': friend.friend.userID,
#                     'image': friend.friend.profile_image.url,
#                     'username': friend.friend.username,
#                     'status': friend.friend.status,
#                 })

#         if Friends.objects.filter(friend=user, status=True).exists():
#             friends += list(Friends.objects.filter(friend=user, status=True))
#             for friend in friends:
#                 if friend.user.userID != user_id:
#                     list_friends.append({
#                         'id': friend.user.userID,
#                         'image': friend.user.profile_image.url,
#                         'username': friend.user.username,
#                         'status': friend.user.status,
#                     })

#         async_to_sync(channel_layer.group_send)(
#             str(user_id), {'type': 'user_update', 'list_friends': list_friends}
#         )