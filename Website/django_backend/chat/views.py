from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User,UserInteraction
from .serlializers import UsersSerializer,UserInteractionSerializer
from rest_framework.response import Response
from rest_framework import status 
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.db.models import Q
from Dashboard_home.models import Friends
from rest_framework.permissions import AllowAny
from notification.models import notification
import json



@csrf_exempt
@api_view(['POST'])
def display_all_users(request):
    name = request.data.get('username', None)
    if not name:
        return Response({"error": "Name parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        
        me = User.objects.get(username=name)
        users = User.objects.exclude(Q(fullName__icontains=name) | Q(username__icontains=name))
        user_data = []
        for user in users:            
            if notification.objects.filter(userID=me,notificationUserID=user, message='add_friend').exists() :
                    friends_status = '2'
            else:
                    friends_status = '1'
            if not Friends.objects.filter(user=me, friend = user).exists() and not  Friends.objects.filter(user=user, friend = me).exists():
                try:
                    user_dict = {
                        'userID': str(user.userID),
                        'username': str(user.username),
                        'fullName': str(user.fullName),
                        'friends': friends_status,
                        'status':str(user.status),
                        'profile_image': "/media/"+str(user.profile_image)
                    }
                    json.dumps(user_dict)
                    user_data.append(user_dict)
                except (TypeError, UnicodeEncodeError, UnicodeDecodeError) as e:
                    print(f"Error processing user {user.userID}: {str(e)}")
        return Response(user_data, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

