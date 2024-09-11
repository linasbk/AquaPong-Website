from .models import Cleans
from django.shortcuts import render
from .models  import Leaderbord
from django.views.decorators.csrf import csrf_exempt
from Sign_up.models import User
from django.core.serializers.json import DjangoJSONEncoder
from .models import Friends,selected_map
from notification.models import notification
from django.http import JsonResponse
from django.db.models import Max
from django.http import JsonResponse
from .models import User
import json
from django.db.models import Q
from groups.models import Group 
from playground.models import Game, Tournaments
from chat.serlializers import UsersSerializer
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

@api_view(['GET'])
@csrf_exempt
def Lead_board(request):
    try:
        leaderboard_data = Leaderbord.objects.order_by('-score')[:10].select_related('userID')  # Ensure to select related user data
        list_score = []
        for user in leaderboard_data:
            list_score.append({
                'score': user.score,
                'username': user.userID.username
              
            })

        return JsonResponse(list_score, safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
@api_view(['GET'])
def get_image_profil(request): 
    userID = request.user.userID
    print('userID',userID)
    try :
        user= User.objects.get(userID=userID)
        if user.profile_image:
            image = user.profile_image.url
            return JsonResponse({'image_url':image})
        else :
            return JsonResponse({'error':'User not ipload an image'})
    except Exception as e:
            return JsonResponse({'error':str(e)})

@api_view(['GET'])
@csrf_exempt
def search(request,username):
    userID = request.user.userID
    search = username
    if search :
        try :
    
            results = User.objects.filter(Q(username__icontains=username) & ~Q(userID=userID))
            list_search=[]
            for result in results:
                friends_status = Friends.objects.filter(user=userID, friend=result.userID, status=True).exists()
                friends = Friends.objects.filter(user=result.userID, friend=userID, status=True).exists()   
                notfriends_status = Friends.objects.filter(user=userID, friend=result.userID, status=False).exists()
                notfriends = Friends.objects.filter(user=result.userID, friend=userID, status=False).exists()  
                notification_status = notification.objects.filter(userID = userID ,  notificationUserID=result.userID, message='add_friend', display = 0).exists()
                notifications = notification.objects.filter(userID = result.userID ,  notificationUserID=   userID , message='add_friend', display = 0).exists()
                if (friends_status == 0  and notification_status)  or     (friends == 0  and notifications) :
                    friends_status =  2       #---' deja sent_invitation'
                elif    friends_status ==  0 and  friends == 0 and notfriends_status == 0 and notfriends == 0:
                        friends_status =   0      #'no friend'
                elif  friends_status  or friends : 
                        friends_status =  1
                else :
                     friends_status =  3
                        #'alredy_friends'
                if ( Friends.objects.filter(user=userID, friend=result.userID, status=False, blocked_by = result).exists() == False and Friends.objects.filter(user=result.userID, friend=userID, status=False, blocked_by = result).exists() == False):
                    list_search.append({
                    'id': result.userID,
                    'image': result.profile_image.url,
                    'status': result.status,
                    'username':result.username,
                    'friends':friends_status
                    })
            if len(list_search) > 5 :
                list_search = list_search[:5]
            return JsonResponse({'search': list_search}, encoder=DjangoJSONEncoder)
        except Exception as e:
            print(e)
            return JsonResponse({'errors': str(e)})
    return JsonResponse({'results': []})


@csrf_exempt
@permission_classes([AllowAny])
def Statistic(request , username):
    username = username
    try :
        try :
            userID = User.objects.get(username=username).userID
        except Exception as e:
            return JsonResponse({'erros':str(e)},status=404)
        if  Leaderbord.objects.filter(  userID=userID).exists():
            Lead_board =  Leaderbord.objects.get(userID=userID)
           
            if  Lead_board.match :
                statistic = (Lead_board.win * 100 / Lead_board.match)
            else :
                statistic = 0
            list_statistic  = { 
                        'match':Lead_board.match,
                        'statistic':statistic,
                        'score':Lead_board.score,
                        'win':Lead_board.win,
                        'lose':Lead_board.lose,
                        
                       }
            board = Leaderbord.objects.all().order_by('-score')
            list_informations=[  { 'id':user.userID , 'score':user.score}for user in board ]
            ordre =  [ index+1   for index , item in enumerate(list_informations) if item['id'].userID == userID  ]
            goldaqua_value = Leaderbord.objects.aggregate(max_goldaqua=Max('goldaqua'))['max_goldaqua']
            darkaqua_value = Leaderbord.objects.aggregate(max_darkaqua=Max('darkaqua'))['max_darkaqua']
            aqua_value = Leaderbord.objects.aggregate(max_aqua=Max('aqua'))['max_aqua']
            arena_names = {
                        goldaqua_value: 'Goldaqua',
                        darkaqua_value: 'DarkAqua',
                        aqua_value: 'Aqua'
                    }
            max_value = max(goldaqua_value, darkaqua_value, aqua_value)
            Best_Arena = arena_names[max_value]
            user= User.objects.get(userID=userID)
            list_info = {
                'level':Lead_board.level,
                'Best_Arena': Best_Arena ,
                'ordre':int(ordre[0]) ,
                'user_image_url':  user.profile_image.url,
                'mainLvl' : Lead_board.mainLvl 
            }
            
            list_backend = {}
            list_backend['list_info'] = list_info
            list_backend['list_statistic'] = list_statistic
            return JsonResponse({'list_backend': list_backend })
        else :
            return JsonResponse({'error':'Not Found'})
    except Exception as e:
        print('erros ' , e )
        return JsonResponse({'erros':str(e)},status=500)


@api_view(['POST'])
@csrf_exempt
def update_image(request):
    userID = request.user.userID
    if request.method == 'POST':
        try:
            image = request.FILES.get('image')
            if not image:
                return JsonResponse({'error': 'No image file provided'}, status=400)
            
            user = User.objects.get(userID=userID)
            user.profile_image = image
            user.save()

            return JsonResponse({'success': 'Image updated successfully'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            print('Error:', str(e))
            return JsonResponse({'error': 'An error occurred while updating the image'}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

        

@api_view(['POST'])
@csrf_exempt
def update_fullname(request):
    userID = request.user.userID
    print('userID',userID)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            fullname = data.get('fullname')
            user = User.objects.get(userID=userID)
            if fullname:
                user.fullName = fullname
                user.save()
                return JsonResponse({'success': 'Profile updated successfully'})
            else:
                return JsonResponse({'error': 'Fullname not provided'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
@api_view(['POST'])
@csrf_exempt
def update_username(request):
    userID = request.user.userID
    if request.method == 'POST':
        try:
            data_body = json.loads(request.body)
            username = data_body.get('username')
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error':   'Alardy exists '}, status=400)
            user = User.objects.get(userID= userID)
            if username:
                user.username = username
                user.save()
                return JsonResponse({'success': 'Username updated successfully'}, status=200)
            else:
                return JsonResponse({'error': 'Username field is required'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)



#profiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiile


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def group_info(request, username):
    username = username
    try:
        user = User.objects.get(username=username)
        group = Group.objects.get(users=user)
        
        group_data = {
            'group_name': group.name,
            'group_image': group.icon, 
            'admin':group.admin.userID
        }
        return JsonResponse(group_data, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist.'}, status=200)
    except Group.DoesNotExist:
        return JsonResponse({'group_name': 'No clan',
                                'group_image': 'No clan'}, status=200)
    except Group.MultipleObjectsReturned:
        return JsonResponse({'error': 'User is in multiple groups.'}, status=200)
        





@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def user_info(request , username):
    username = username
    try:
        user = User.objects.get(username=username)
        return JsonResponse({'data':'true'}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'data': 'false'}, status=200)
    

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def MatchHistorySolo(request , username):
    MatchResault = None
    username = username
    try:
        user = User.objects.get(username=username)
        games = Game.objects.filter(Q(first_player=user) | Q(second_player=user))
        games_data = []
        if games.exists():
            for game in games:
                if game.first_player and game.second_player:
                    if user == game.first_player:
                        if game.fplayer_score > game.scplayer_score:
                            StatusMatch = 'Win'
                        else:
                            StatusMatch = 'Lose'
                        TargetUser = game.second_player
                        MatchResault = f'{game.fplayer_score}/{game.scplayer_score}'
                    else:
                        if game.fplayer_score < game.scplayer_score:
                            StatusMatch = 'Win'
                        else:
                            StatusMatch = 'Lose'
                        MatchResault = f'{game.scplayer_score}/{game.fplayer_score}'
                        TargetUser = game.first_player
                    group_data = {
                        'CurrentUser': UsersSerializer(user).data,
                        'TargetUser' : UsersSerializer(TargetUser).data,
                        'MatchResault':MatchResault,
                        'StatusMatch':StatusMatch,
                        'Ranking': 1,
                        'time':game.date_created
                    }
                    games_data.append(group_data)
        return JsonResponse(games_data, safe=False, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist.'}, status=200)
    except Group.MultipleObjectsReturned:
        return JsonResponse({'error': 'User is in multiple groups.'}, status=200)
    



@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def History_tournaments(request, username):
    user = get_object_or_404(User, username=username)
    participating_tournaments = []
    tournaments = Tournaments.objects.all()
    for tournament in tournaments:
        TargetUser = None
        StatusMatch = None
        MatchResult = None
        Ranking = 2
        match_data = {}
        if tournament.final and (tournament.final.first_player == user or tournament.final.second_player == user):
                if tournament.final.first_player == user:
                    TargetUser = tournament.final.second_player
                    StatusMatch = 'Win' if tournament.final.fplayer_score > tournament.final.scplayer_score else 'Lose'
                elif tournament.final.second_player == user:
                    TargetUser = tournament.final.first_player
                    StatusMatch = 'Win' if tournament.final.fplayer_score < tournament.final.scplayer_score else 'Lose'
                MatchResult = f'{tournament.final.fplayer_score}/{tournament.final.scplayer_score}'
                if StatusMatch == 'Win':
                        Ranking =  1
                match_data = {
                    'CurrentUser': UsersSerializer(user).data,
                    'TargetUser': UsersSerializer(TargetUser).data if TargetUser else None,
                    'MatchResult': MatchResult,
                    'StatusMatch': StatusMatch,
                    'Ranking': Ranking,
                    'time': tournament.final.date_created
                }
                if tournament.final.first_player  and  tournament.final.second_player:
                    participating_tournaments.append(match_data)
        if tournament.first_demi_final and tournament.first_demi_final.first_player == user or tournament.first_demi_final.second_player == user:
                if tournament.first_demi_final.first_player == user:
                    TargetUser = tournament.first_demi_final.second_player
                    StatusMatch = 'Win' if tournament.first_demi_final.fplayer_score > tournament.first_demi_final.scplayer_score else 'Lose'
                elif tournament.first_demi_final.second_player == user:
                    TargetUser = tournament.first_demi_final.first_player
                    StatusMatch = 'Win' if tournament.first_demi_final.fplayer_score < tournament.first_demi_final.scplayer_score else 'Lose'
                
                MatchResult = f'{tournament.first_demi_final.fplayer_score}/{tournament.first_demi_final.scplayer_score}'

                match_data = {
                    'CurrentUser': UsersSerializer(user).data,
                    'TargetUser': UsersSerializer(TargetUser).data if TargetUser else None,
                    'MatchResult': MatchResult,
                    'StatusMatch': StatusMatch,
                    'Ranking': Ranking,
                    'time': tournament.first_demi_final.date_created
                }
                if tournament.first_demi_final.first_player and tournament.first_demi_final.second_player:
                    participating_tournaments.append(match_data)
        elif tournament.second_demi_final and tournament.second_demi_final.first_player == user or tournament.second_demi_final.second_player == user:
                if tournament.second_demi_final.first_player == user:
                    TargetUser = tournament.second_demi_final.second_player
                    StatusMatch = 'Win' if tournament.second_demi_final.fplayer_score > tournament.second_demi_final.scplayer_score else 'Lose'
                elif tournament.second_demi_final.second_player == user:
                    TargetUser = tournament.second_demi_final.first_player
                    StatusMatch = 'Win' if tournament.second_demi_final.fplayer_score < tournament.second_demi_final.scplayer_score else 'Lose'
                MatchResult = f'{tournament.second_demi_final.fplayer_score}/{tournament.second_demi_final.scplayer_score}'

                match_data = {
                    'CurrentUser': UsersSerializer(user).data,
                    'TargetUser': UsersSerializer(TargetUser).data if TargetUser else None,
                    'MatchResult': MatchResult,
                    'StatusMatch': StatusMatch,
                    'Ranking': Ranking,
                    'time': tournament.second_demi_final.date_created
                }
                if tournament.second_demi_final.first_player and tournament.second_demi_final.second_player:
                    participating_tournaments.append(match_data)
 
    return JsonResponse(participating_tournaments, safe=False, status=200)

# set the selected_map here 

@api_view(['POST'])
@csrf_exempt
def set_selected_map(request):
    map_name = request.data.get('map_name')
    if not map_name:
        return JsonResponse({'status': 'error', 'message': 'Map name not provided'}, status=200)
    selected_mapp = selected_map.objects.all()
    if map_name == 'get_map' and selected_mapp.exists():
        return JsonResponse({'map_name': selected_mapp.first().selected_map}, status=200)
    selected_mapp = selected_map.objects.all()
    if not selected_mapp.exists():
        selected_map.objects.create(selected_map = map_name)
        return JsonResponse({'status': 'success', 'message': 'Map created'})
    else:
        first_map = selected_mapp.first()
        first_map.selected_map = map_name
        first_map.save()
        return JsonResponse({'status': 'success', 'message': 'Map updated'})

