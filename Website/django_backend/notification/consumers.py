import json
from channels.generic.websocket import WebsocketConsumer
from .models import notification
from Sign_up.models import User
from django.core.serializers.json import DjangoJSONEncoder
from asgiref.sync import sync_to_async
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from asgiref.sync import async_to_sync
from .serlializers import notificationSerializer
channel_layer = get_channel_layer()
from django.db.models.signals import  post_delete

class notificationConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()


    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        user_id = data.get('userid')
        try:
            if user_id is not None and user_id != "None":
                async_to_sync(self.channel_layer.group_add)(
                    str(user_id), self.channel_name
                )

                friendID = User.objects.get(userID=user_id)

                queryset = notification.objects.filter(notificationUserID=friendID)
                serializer = notificationSerializer(queryset, many=True)
                serialized_data = json.dumps(serializer.data)
                async_to_sync(self.channel_layer.group_send)(
                    str(user_id), 
                    {
                        "type": "chat_message", 
                        "message": serialized_data
                    }
                )
        except Exception as e:
            print("Error in receive method:", e)

    def chat_message(self, event):
        
        message = event['message']
       
        self.send(message)




@receiver(post_save, sender=notification)
@receiver(post_delete, sender=notification)
def handle_notification_update(sender, instance, **kwargs):
    print(f"Signal triggered: instance={instance}, created={kwargs.get('created', False)}, deleted={kwargs.get('signal', None) == post_delete}")
    try:
        friendID = instance.notificationUserID.userID
        queryset = notification.objects.filter(notificationUserID=instance.notificationUserID)
        serializer = notificationSerializer(queryset, many=True)
        serialized_data = json.dumps(serializer.data)
        
        async_to_sync(channel_layer.group_send)(
            str(friendID), 
            {
                "type": "chat_message", 
                "message": serialized_data
            }
        )
        
        print(f"Message sent to group: {friendID}")
    except Exception as e:
        print("Error in handle_notification_update:", e)

