from django.http import JsonResponse
from .models import notification
from Dashboard_home.models import *
from Sign_up import * 
from django.views.decorators.csrf import csrf_exempt
from groups.models import Group
from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.
from django.shortcuts import render
from playground.models  import  *
from django.db.models import Q
from Sign_up.models import  User
from groups.models import Group
from rest_framework.decorators import api_view
 
@csrf_exempt
@api_view(['POST'])
def add_friend(request,friendID):
    userID = request.user.userID
    try:
        userID = User.objects.get(userID=userID)
        friendID = User.objects.get(userID=friendID)
        if not notification.objects.filter(userID=userID,notificationUserID=friendID, message='add_friend').exists() and not notification.objects.filter(userID=friendID,notificationUserID=userID, message='add_friend').exists():
            notification.objects.create(userID=userID,  notificationUserID=friendID, message='add_friend',display = 0)
        
        return JsonResponse({'success': True, 'message': 'Invitation sent successfully'})
    except Exception as e:
      
        return JsonResponse({'success': False, 'message': str(e)})

@csrf_exempt
@api_view(['POST'])
def change_user_status(request):
    userID = request.user.userID
    try:
        userID = User.objects.get(userID=userID)
        userID.status = "ingame"
        userID.save()
        return JsonResponse({'success': True, 'message': 'status changed successfully'})
    except Exception as e:
      
        return JsonResponse({'success': False, 'message': str(e)})

@csrf_exempt
@api_view(['POST'])
def accept_game_req(request,friendID):
    userID = request.user.userID
    try:
        userID = User.objects.get(userID=userID)
        friendID = User.objects.get(userID=friendID)
        notification.objects.create(userID=userID,  notificationUserID=friendID, message='accept_game_req')
        game_notif = notification.objects.get(userID=userID, notificationUserID=friendID, message='accept_game_req')
        game_notif.delete()
        return JsonResponse({'status': friendID.status})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})



@csrf_exempt
def invite_prv_game(request,friendID):
    userID = request.user.userID
    try:
        userID = User.objects.get(userID=userID)
        friendID = User.objects.get(userID=friendID)
        if not notification.objects.filter(userID=userID,notificationUserID=friendID, message='play_prv_game').exists() and not notification.objects.filter(userID=friendID,notificationUserID=userID, message='play_prv_game').exists():
            notification.objects.create(userID=userID,  notificationUserID=friendID, message='play_prv_game',display = 0)
            notifcationn  =  notification.objects.get(userID=userID,  notificationUserID=friendID, message='play_prv_game')
            notifcationn.delete()
        return JsonResponse({'success': True, 'message': 'notif sent successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})


@csrf_exempt
@api_view(['POST'])
def change_user_status(request):
    userID = request.user.userID
    try:
        user = User.objects.get(userID=userID)
        user.status = "ingame"
        user.save()
        return JsonResponse({'success': True, 'message': 'status changed successfully'})
    except Exception as e:
      
        return JsonResponse({'success': False, 'message': str(e)})

@csrf_exempt
@api_view(['POST'])
def accept_game_req(request,friendID):
    userID = request.user.userID
    try:
        userID = User.objects.get(userID=userID)
        friendID = User.objects.get(userID=friendID)
        notification.objects.create(userID=userID,  notificationUserID=friendID, message='accept_game_req')
        game_notif = notification.objects.get(userID=userID, notificationUserID=friendID, message='accept_game_req')
        game_notif.delete()
        return JsonResponse({'status': friendID.status})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})



@csrf_exempt
@api_view(['POST'])
def invite_prv_game(request,friendID):
    userID = request.user.userID
    try:
        userID = User.objects.get(userID=userID)
        friendID = User.objects.get(userID=friendID)
        if not notification.objects.filter(userID=userID,notificationUserID=friendID, message='play_prv_game').exists() and not notification.objects.filter(userID=friendID,notificationUserID=userID, message='play_prv_game').exists():
            notification.objects.create(userID=userID,  notificationUserID=friendID, message='play_prv_game',display = 0)
            notifcationn  =  notification.objects.get(userID=userID,  notificationUserID=friendID, message='play_prv_game')
            notifcationn.delete()
        return JsonResponse({'success': True, 'message': 'notif sent successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})


@csrf_exempt
@api_view(['POST'])
def remove_frined(request ,friendID):
    userID = request.user.userID
    try :
        userID = User.objects.get(userID=userID)
        friendID = User.objects.get(userID=friendID)
        if  Friends.objects.filter(user=userID, friend = friendID).exists():
            friend =  Friends.objects.filter(user=userID, friend = friendID)
            friend.delete()
        elif Friends.objects.filter(friend=userID, user  = friendID).exists():
            friend =  Friends.objects.filter(user=friendID, friend = userID)
            friend.delete()

        return JsonResponse({'success':False, 'message' : 'user arlydy remove '})
    except Exception as e:
        return JsonResponse({'success':False , 'message':str(e)})



#join_group
#add_friend
@csrf_exempt
@api_view(['POST'])
def accpter_friend(request, friendID, a):
    current_user_id = request.user.userID
    target_user_id = friendID
    try:
        current_user = User.objects.get(userID=current_user_id)
        target_user = User.objects.get(userID=target_user_id)

        if a == "add_friend" and notification.objects.filter(userID=target_user, notificationUserID=current_user, message='add_friend').exists() and not Friends.objects.filter(user=target_user, friend=current_user).exists():
            if notification.objects.filter(userID=target_user, notificationUserID=current_user, message='add_friend').exists():
                notifications = notification.objects.filter(userID=target_user, notificationUserID=current_user, message='add_friend')
                notifications.delete()
            if notification.objects.filter(userID=current_user, notificationUserID=target_user, message='add_friend').exists():
                notifications = notification.objects.filter (userID=current_user, notificationUserID=target_user, message='add_friend')
                notifications.delete()
            if not Friends.objects.filter(user=current_user, friend=target_user).exists():
                Friends.objects.create(user=target_user, friend=current_user, status=1, blocked_by=None)

        if a == "join_group" and notification.objects.filter(userID=target_user, notificationUserID=current_user, message='join_group').exists():
            Groups = Group.objects.get(admin=current_user)
            if Groups.users.count() >= 10:
                return JsonResponse("more then 10 mambers")
            elif not Group.objects.filter(users=target_user).exists():
                Groups.users.add(target_user)
                notif_for_accept =  notification.objects.create(userID=current_user, notificationUserID=target_user, message='accept_join_group')
                notif_for_accept.delete()
            if notification.objects.filter(userID=target_user, notificationUserID=current_user, message='join_group').exists():
                notifications = notification.objects.get(userID=target_user, notificationUserID=current_user, message='join_group')
                notifications.delete()

        return JsonResponse({'succer': 'accpter friend'})
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)})



@csrf_exempt
@api_view(['POST'])
def refus_friend(request,friendID,a):
    userID = request.user.userID
    try:
        userID = User.objects.get(userID=userID)
        friendID = User.objects.get(userID=friendID)
        if a == "add_friend" and notification.objects.filter(userID=userID,notificationUserID=friendID, message='add_friend').exists():
            notifications =notification.objects.get(userID=userID,notificationUserID=friendID, message='add_friend')
            notifications.delete()
        elif a == "add_friend" :
            notifications =notification.objects.get(userID=friendID,notificationUserID=userID, message='add_friend')
            notifications.delete()
        elif a == "join_group" and notification.objects.filter(userID=userID,notificationUserID=friendID, message='join_group').exists():
            notifications =notification.objects.get(userID=userID,notificationUserID=friendID, message='join_group')
            notifications.delete()
        elif a == "join_group" :
            notifications =notification.objects.get(userID=friendID,notificationUserID=userID, message='join_group')
            notifications.delete()
        return JsonResponse({'message':'refuse friend'})
    except Exception as e:
        return JsonResponse({'error':str(e)})




@csrf_exempt
@api_view(['POST'])
def block_friend(request, friendID):
    userID = request.user.userID
    userID = User.objects.get(userID=userID)
    if Friends.objects.filter(user=userID,friend=friendID).exists() :
        friends =Friends.objects.get(user=userID,friend=friendID)
        if friends.blocked_by == None:
            friends.status = 0
            friends.blocked_by = userID
            friends.save()
    elif Friends.objects.filter(user=friendID,friend=userID).exists() :
        friends =Friends.objects.get(user=friendID,friend=userID)
        if friends.blocked_by == None:
            friends.status = 0
            friends.blocked_by = userID
            friends.save()
    return JsonResponse({'message':'friend blocker'})






@csrf_exempt
@api_view(['POST'])
def deblocker_friend(request,friendID):
    userID = request.user.userID
    userID = User.objects.get(userID=userID)
    if Friends.objects.filter(user=userID,friend=friendID,status=0).exists():
        friends =Friends.objects.get(user=userID,friend=friendID,status=0)
        if userID == friends.blocked_by:
            friends.status = 1
            friends.blocked_by = None
            friends.save()
    elif Friends.objects.filter(user=friendID,friend=userID,status=0).exists():
        friends =Friends.objects.get(user=friendID,friend=userID,status=0)
        if userID == friends.blocked_by:
            friends.status = 1
            friends.blocked_by = None
            friends.save()
    return JsonResponse({'message':'friend deblocker'})






# apostille 








@api_view(['POST'])
@csrf_exempt
def  show_block(request,friendID):
    userID = request.user.userID
    
    userID = User.objects.get(userID=userID)
    friendID = User.objects.get(userID=friendID)
    if Friends.objects.filter(friend=friendID, user=userID, status=0, blocked_by=userID).exists() or Friends.objects.filter(friend=userID, user=friendID, status=0, blocked_by=userID).exists():
        return JsonResponse({'status':1})
    elif Friends.objects.filter(friend=userID, user=friendID).exists() or Friends.objects.filter(friend=friendID, user=userID).exists():
        return JsonResponse({'status':0})
    else:
        return JsonResponse({'status':2})




@csrf_exempt
def join_group(requset,admin):
    try:
        userID = User.objects.get(userID=userID)
        admin = User.objects.get(userID=admin)
        if notification.objects.filter(userID=userID,notificationUserID=admin, message='join').exists():
            notifications =notification.objects.get(userID=userID,notificationUserID=admin, message='join')
            notifications.delete()
        Groups = Group.objects.get(admin=admin)
        if  Groups.user.count() >= 10:
            return JsonResponse({'message':'Maximum Number of Users is 10'})
        else:
            Group.users.add(userID)
    except  Group.DoesNotExist :              
       return JsonResponse({'message':'refuse friend'})
    except Exception as e:
        return JsonResponse({'error':str(e)})





#statsci 
@csrf_exempt

def   get_statistical_solo(request):
    userID = User.objects.get(userID=userID)
    staticals = Game.objects.filter(Q(first_player=userID) | Q(second_player=userID) ).order_by('-date_created')
    soloData  = []
    for statical in staticals :

        if statical.first_player != userID :
                TargetUserName  = statical.first_player
                scplayer_score = statical.fplayer_score 
                fplayer_score = statical.scplayer_score 
        else : 
                TargetUserName  = statical.second_player
                scplayer_score = statical.second_player
                fplayer_score = statical.first_player

        soloData.append({
            'CurrentUser': User.username,  
            'TargetUserName':   TargetUserName.username,
            'TargetUserImage': TargetUserName.profile_image.url,
            'fplayer_score' :fplayer_score,
            'scplayer_score' : scplayer_score,
        })
        print(soloData)
        return JsonResponse(soloData, safe=False)