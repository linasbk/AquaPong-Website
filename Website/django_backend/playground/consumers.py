import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import WebsocketConsumer
from collections import deque
import uuid
import threading
from .models import Game
import collections
from datetime import datetime
from .models import User
from channels.exceptions import StopConsumer
from channels.layers import get_channel_layer
import random
import asyncio
from asgiref.sync import async_to_sync
from urllib.parse import parse_qs
from django.db.models.signals import post_save
from django.dispatch import receiver
from playground.models import Tournaments
from channels.exceptions import StopConsumer
import time
from Dashboard_home.game import win, lose

waiting_players = deque()



class MatchConsumer(AsyncWebsocketConsumer):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.GameID = None

    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add('matchmaking_pool', self.channel_name)
        player = {'socket' : self.channel_name , "data" :{}}
        waiting_players.append(player)
        await self.send(text_data=json.dumps({
            'type': 'connected',
            'message': "Connected to matchmaking pool"
        }))

    async def disconnect(self, close_code):
        rem = {}
        if self.GameID:
            await self.channel_layer.group_discard(self.GameID,self.channel_name)
        await self.channel_layer.group_discard('matchmaking_pool', self.channel_name)
        for player in waiting_players :
            if(player['socket'] == self.channel_name):
                rem = player
                break
        if(rem) :
            waiting_players.remove(rem)
        await self.close()
        
        
        
    async def receive(self, text_data):
            try:
                text_data_json = json.loads(text_data)
                player_data = text_data_json
                for players in waiting_players :
                    if(players.get("socket")== self.channel_name):
                        players.update({"data" : player_data})
            except json.JSONDecodeError:
                print("Received data is not a valid JSON string")
            await self.check_for_match() 
        

    async def match_found(self, event):
        game = event['game']
        await self.send(text_data=json.dumps({
            'type': 'match_found',
            'game': game
        }))
        
        
        
        
            
        

    async def check_for_match(self):
        if len(waiting_players) >= 2 :
            player_1 = waiting_players.popleft()
            player_2 = waiting_players.popleft()
            if(player_1.get('data') and player_2.get('data')) :
                local = player_1.get('data').get('id')
                guest = player_2.get('data').get('id')
                first_player = User.objects.get(userID=local)
                second_player = User.objects.get(userID=guest)
                if(first_player and second_player and first_player != second_player) :
                    self.GameID = str(uuid.uuid4())
                    game = Game.objects.create(gameID=self.GameID,first_player=first_player,second_player=second_player,date_created=datetime.now(),fplayer_score=0,scplayer_score=0,status='full')
                    game.save()
                await self.channel_layer.group_add(self.GameID, player_1.get("socket"))
                await self.channel_layer.group_add(self.GameID, player_2.get("socket"))

                await self.channel_layer.group_send(
                    self.GameID, {
                        "type": "match_found",
                        "game": game.to_dic()
                    }
                )
                await self.channel_layer.group_discard('matchmaking_pool', player_1.get("socket"))
                await self.channel_layer.group_discard('matchmaking_pool', player_2.get("socket"))
                self.disconnect(1000)
            else :
                waiting_players.append(player_1)
                waiting_players.append(player_2)
                self.check_for_match()

        else:
            
            await self.send(text_data=json.dumps({
                'type': 'waiting_for_match',
                'message': 'Waiting for other player...'
            }))
            
def g_r_f():

    if random.choice([True, False]):
        return random.uniform(-0.1, -0.2)
    else:
        return random.uniform(0.2, 0.1) 

class PongGame(WebsocketConsumer) :
    
    def __init__(self):
        self.width = 400
        self.height = 400
        self.paddel_width = self.width/5
        self.paddel_raduis = 2
        self.ball_raduis = 5
        self.ball_speed = 2
        self.paddel_speed = 1
        self.players = []
        self.gameID =None
        self.mygame = None
        self.name = None
        self.ball = {
            'x' : 0,
            'y' : 0,
            'xdire' : self.ball_speed * g_r_f(),
            'ydire' : self.ball_speed * random.choice([-1,1]),
        }
        self.score = {
            'first_player' : 0,
            'second_player' : 0,
        }       
            
    def add_player(self,player_id): 
        if(len(self.players) == 0) :
           self.players.append ({
                'id' : player_id,
                'x' : 0,
                'y' : -(self.height/2)  + 5, 
                'xdire': 1
           })
        elif(len(self.players) == 1) :
           self.players.append ({
                'id' : player_id,
                'x' : 0,
                'y' : (self.height/2) - 5,
                'xdire' : 1
           })

    def game_state(self):
        return{
            'players': self.players,
            'ball' : self.ball,
        }
    def reset_ball(self):
        self.ball = {
            'x' : 0,
            'y' : 0,
            'xdire' : self.ball_speed * g_r_f(),
            'ydire' : self.ball_speed * random.choice([-1,1]),
        }
    def game_update(self) :
        
        # ** ball collision in sides
        if(self.ball['x'] <= -(self.width/2) or self.ball['x'] >= self.width/2):
            self.ball['xdire'] *= -1
        
        # ** ball collision in top and bottom
        elif self.ball['y'] <= self.players[0]['y'] - 10 :
                self.check_how_score(self.players[0]['id'])
                self.reset_ball()
                
        elif self.ball['y'] >= self.players[1]['y'] + 10 :
                self.check_how_score(self.players[1]['id'])
                self.reset_ball()
                
        # ** ball collision with paddels 
        if (self.ball['y'] >= self.players[1]['y']) :
            if (self.ball['x'] + self.ball_raduis <= self.players[1]['x'] + self.paddel_width/2) and (self.ball['x'] + self.ball_raduis >= self.players[1]['x'] - self.paddel_width/2) :
                self.ball['xdire'] = self.players[0]['xdire'] * self.ball_speed + self.ball['xdire']
                self.ball['ydire'] *= -1
        elif (self.ball['y'] <= self.players[0]['y']) :
            if (self.ball['x'] + self.ball_raduis  >= self.players[0]['x'] - self.paddel_width/2)  and (self.ball['x'] + self.ball_raduis <= self.players[0]['x'] + self.paddel_width/2):
                self.ball['xdire'] = self.players[0]['xdire'] * self.ball_speed + self.ball['xdire']
                self.ball['ydire'] *= -1
        
            
        self.ball['y'] += self.ball_speed * self.ball['ydire']
        self.ball['x'] += self.ball_speed * self.ball['xdire']
        
    def wakeup(self) :
        if self.gameID :
            self.mygame = Game.objects.get(gameID=self.gameID)
            self.mygame.running = True
            self.mygame.fplayer_score = 0
            self.mygame.scplayer_score = 0
        self.mygame.save()
            
    def check_how_score(self,loser_id) :
        first_ID = self.mygame.first_player.userID
        second_ID = self.mygame.second_player.userID
        if(loser_id == first_ID) :
            self.mygame.scplayer_score += 1
        elif second_ID == loser_id :
            self.mygame.fplayer_score += 1
        self.mygame.save()
        if self.mygame.fplayer_score == 7 :
            self.mygame.running = False
            self.mygame.status = "finished"
            self.mygame.save()
            win(self.mygame.first_player.userID,'darkaqua',self.mygame.fplayer_score)
            lose(self.mygame.second_player.userID,'darkaqua',self.mygame.scplayer_score)
        elif self.mygame.scplayer_score == 7 :
            self.mygame.running = False
            self.mygame.status = "finished"
            self.mygame.save()
            win(self.mygame.second_player.userID,'darkaqua',self.mygame.scplayer_score)
            lose(self.mygame.first_player.userID,'darkaqua',self.mygame.fplayer_score)
       
            
    def reset_players(self) :
        self.players[0]['x'] = 0
        self.players[1]['x'] = 0
        
        
        


            
 ## ! /////////////////////////
 
players_dimension = []
games = []
class gameLunch(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.player_id = None
        self.room_name = 'default'
        self.game_loop_task = None
        self.player_name = None
        self.gameID =None
        self.game = None
        self.scalX = None
        self.scalX = None
        self.dimEvent = asyncio.Event()
        


    async def connect(self):
        await self.accept()
        self.room_name = f'game_group_{self.scope["url_route"]["kwargs"]["game"]}'
        self.gameID = self.scope["url_route"]["kwargs"]["game"]
        if any(game for game in games  if game['ID'] == self.gameID) :
            searched_game = next(game for game in games if self.gameID == game["ID"])
            self.game = searched_game['mygame']
        else :
            games.append({'ID': self.gameID , "mygame" : PongGame(),"running":{"value":False}})
            searched_game = next(game for game in games if self.gameID == game["ID"])
            self.game = searched_game['mygame']
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.send(text_data=json.dumps({
            'type': 'connected',
            'message': "Connected to game"
        }))
        

    async def disconnect(self, close_code):
        searched_game = next(game for game in games if self.gameID == game["ID"])
        searched_game['running']['value'] = False
        await self.channel_layer.group_send(self.room_name, {"type": "game_stoped", "message": self.player_id})
        if self.game_loop_task:
            self.game_loop_task.cancel()
            try:
                await asyncio.wait_for(self.game_loop_task, timeout=50.0)
            except asyncio.TimeoutError:
                print("Game loop task took too long to cancel, forcing stop")
            except asyncio.CancelledError:
                pass
            except Exception as e:
                print(f"Unexpected error while stopping game loop: {e}")
            self.game_loop_task.done()
        if any([dimension['id'] == self.player_id for dimension in players_dimension]):
            players_dimension.remove(next(player for player in players_dimension if player['id'] == self.player_id))
            print("disconnected",self.player_name)

        
    
    async def recieve_game_start(self,event) :
        await self.send(text_data=json.dumps({
            'type': 'recieve_game_start',
            'message': 'Game has been started'
        }))
#** handling users data
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            type = text_data_json['type']
            data = text_data_json['data']
        except json.JSONDecodeError:
            print("Received data is not a valid JSON string")
            return
        
# ** Set Game players

        if type == "game_initialization":
            searched_game = next(game for game in games if self.gameID == game["ID"])
            self.player_id = data['id']
            self.player_name = data['name']
            if len(self.game.players) < 2:
                self.game.add_player(self.player_id)
                self.game.name = self.player_name
            if len(self.game.players) == 2  and  searched_game['running']['value']== False :
                self.game.gameID = self.gameID
                self.game.wakeup()
                await self.channel_layer.group_send(self.room_name, {"type": "recieve_game_start", "message": "Game has been started"})
              
                

# ** Set Game dimension for every player     
                
        elif type in ['set_dimension', 'resize']:
            searched_game = next(game for game in games if self.gameID == game["ID"])
            if any([dimension['id'] == self.player_id for dimension in players_dimension]):
                players_dimension.remove(next(player for player in players_dimension if player['id'] == self.player_id))
            players_dimension.append({'id': self.player_id, 'width': data['width'], 'height': data['height'] , 'ball_raduis' : data['ball_raduis']})
            dim = next(player for player in players_dimension if player['id'] == self.player_id)
            self.scalX = dim['width'] / self.game.width
            self.scalY = dim['height'] / self.game.height
            self.dimEvent.set()
            await self.channel_layer.group_send(self.room_name,{"type":"resize","message":"resize"})
            if self.game_loop_task == None and searched_game['running']['value']== False and len(players_dimension) >= 2 and len(self.game.players) == 2:
                await self.dimEvent.wait()
                searched_game['running']['value']= True
                self.game_loop_task = asyncio.create_task(self.game_loop())  
            
# ** recive Players position
            
        elif type == 'paddle_move':
            for player in self.game.players:
                if player['id'] == self.player_id:
                    if self.scalX:
                        player['x'] = data['x'] / self.scalX
                        player['xdire'] = data['dire']
                        await self.channel_layer.group_send(self.room_name, {"type": "player_move", "message": player})
                    else :
                        print("self.scalX is None")
                    
        else:
            print("Invalid data received")

# ** sent player postion
    async def player_move(self, event):
        mvplayer = event['message']
        # ** set new player position for his own game
        if mvplayer['id'] != self.player_id:
            for p in self.game.players :
                if p['id'] == mvplayer['id'] :
                   p['x'] = mvplayer['x']
                   # ** send new player position
                   currentplayer = self.Paddel_scal(mvplayer)
                   await self.send(text_data=json.dumps({
                        'type' : 'player_move',
                        'message': currentplayer
                        }))

# ** paddel scaling dimension

    def Paddel_scal(self,mvplayer) :
        for dimension in players_dimension:
                if dimension['id'] == self.player_id:
                    ScalPad = dimension['width'] / self.game.width
                    x = mvplayer['x'] * ScalPad
                    return {'id': mvplayer['id'], 'x': x }   


# ** game_loop 
    async def game_loop(self):
        searched_game = next(game for game in games if self.gameID == game["ID"])
        try :
            while searched_game['running']['value'] :
                self.game.game_update()
                await self.winning_game()
                await self.channel_layer.group_send( self.room_name, 
                    { 'type': 'game_up',
                    'message': self.player_id
                    })
                await asyncio.sleep(1/60)
        except asyncio.CancelledError:
            searched_game['running']['value']  = False
        except Exception as e:
            searched_game['running']['value']  = False
            print("An error occurred in game loop")

 
# ** ball update

    async def game_up(self, event):
        searched_game = next(game for game in games if self.gameID == game["ID"])
        if searched_game['running']['value']  == True :
            host = event['message'] == self.player_id
            ball_state = self.game_scale(self.player_id,host)
            await self.send(text_data=json.dumps({
                'type': 'game_update',
                'message': ball_state 
            }))
 


    
    
# **** game_finish

    async def winning_game(self) :
        searched_game = next(game for game in games if self.gameID == game["ID"])
        if searched_game['running']['value']  :
            fplayer =self.game.mygame.first_player.userID
            scplayer=self.game.mygame.second_player.userID
            if self.game.mygame.fplayer_score == 7 and self.game.mygame.status == 'finished':
                await self.finish_game(fplayer)
                searched_game['running']['value']  = False
                game = Game.objects.get(gameID=self.gameID)
                game.winner = User.objects.get(userID=fplayer)
                game.save()
            elif self.game.mygame.scplayer_score  == 7 and self.game.mygame.status == 'finished':
                await self.finish_game(scplayer)
                searched_game['running']['value']  = False
                game = Game.objects.get(gameID=self.gameID)
                game.winner = User.objects.get(userID=scplayer)
                game.save()
               
    
    async def finish_game(self,player_id) :
        searched_game = next(game for game in games if self.gameID == game["ID"])
        if searched_game['running']['value']  == True :
            await self.channel_layer.group_send(self.room_name,{
                        "type" : "hows_win",
                        "message" : player_id
                    })
        self.game_loop_task.cancel()
        try:
            await asyncio.wait_for(self.game_loop_task, timeout=50.0)
        except asyncio.TimeoutError:
            print("Game loop task took too long to cancel, forcing stop")
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print(f"Unexpected error while stopping game loop") 
        self.game_loop_task.done()
        searched_game['running']['value']  = False
            
            
    async def hows_win(self,text_data) :
            searched_game = next(game for game in games if self.gameID == game["ID"])
            win = text_data['message'] == self.player_id
            message = "WIN" if win else "LOSE"
            await self.send(text_data=json.dumps({
                "type" : "game result",
                "message" : message
            }))
            await self.close()
            
        
#** scal ball dimension
    def game_scale(self, player_id,host):
        dir = 1 if self.game.players[0]['id'] == player_id else -1
        for dimension in players_dimension:
            if dimension['id'] == player_id:
                self.game.ball_raduis = dimension['ball_raduis'] / self.scalY
                scball = self.game.ball
                return {'x': scball['x'] * self.scalX   , 'y': scball['y'] * self.scalY * dir}

        
# ** stop game loop when user disconnect

    async def game_stoped(self, event):
        stop_id = event['message']
        game = Game.objects.get(gameID=self.gameID)
        if game  and game.winner == None:
            if(game.first_player.userID == stop_id) :
                game.winner = game.second_player
            else :
                game.winner = game.first_player
            game.running = False
            game.status = "stopped"
            game.save()
        searched_game = next(game for game in games if self.gameID == game["ID"])
        if searched_game :
            searched_game['running']['value']  = False
            await self.channel_layer.group_send(self.room_name,{
                'type' : "hows_win",
                'message' : self.player_id
            })
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        if self.game_loop_task:
            try:
                await asyncio.wait_for(self.game_loop_task, timeout=50.0)
            except asyncio.TimeoutError:
                print("Game loop task took too long to cancel, forcing stop")
            except asyncio.CancelledError:
                pass
            except Exception as e:
                print(f"Unexpected error while stopping game loop")
        self.close()
    
                   
        
    async def resize(self,event) :
        players = []
        mydim = 1
        
        for dim in players_dimension:
            if dim['id'] == self.player_id:
                mydim = dim['width']
                
        gamedim = self.game.width
        
        for p in self.game.players :
                    players.append(
                        {   'id' : p['id'],
                            'x' : p['x'] * mydim/gamedim
                        }
                    )
        searched_game = next(game for game in games if self.gameID == game["ID"])
        if searched_game['running']['value']  == True :
            await self.send(text_data=json.dumps({
                'type':"resize",
                "message" : players
            }))





class GameScore(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.gameID = None

    def disconnect(self, close_code):
        if self.gameID:
            async_to_sync(self.channel_layer.group_discard)(
                f"game_{self.gameID}",
                self.channel_name
            )
            self.close()

    def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            type = text_data_json['type']
            self.gameID = text_data_json['data']
        except json.JSONDecodeError:
            print("Received data is not a valid JSON string")
            return

        if type == "game_score":
            try:
                game = Game.objects.get(gameID=self.gameID)
                scores = {
                    'fplayer_score': game.fplayer_score,
                    'scplayer_score': game.scplayer_score
                }
                async_to_sync(self.channel_layer.group_add)(
                    f"game_{self.gameID}",
                    self.channel_name
                )
                self.send(text_data=json.dumps({
                    'type': 'game_score',
                    'message': scores
                }))
            except Game.DoesNotExist:
                print("Game does not exist")
        else:
            print("Invalid data received")

    def game_score_update(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'game_score',
            'message': message
        }))


@receiver(post_save, sender=Game)
def game_update(sender, instance, created, **kwargs):
    def handle_signal():
        gameID = instance.gameID
        scores = {
            'fplayer_score': instance.fplayer_score,
            'scplayer_score': instance.scplayer_score
        }

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"game_{gameID}",
            {
                'type': 'game_score_update',
                'message': scores
            }
        )
    threading.Thread(target=handle_signal).start()
    
    
## **** Private Game 
privateGames = deque()   
    
class privateGame(AsyncWebsocketConsumer) :
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game_ID = None
        self.firstPlayer = None
        self.secondPlayer = None
        self.first_ID = None
        self.second_ID = None
        self.game_runner = False
        
        
        
    async def connect(self) :
        await self.accept()
        
        await self.send(text_data=json.dumps({
            'type' : "connected",
            'message' : "connected too PrivateGame"
        }))
       

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            type = text_data_json['type']
            players = text_data_json['message']
        except json.JSONDecodeError:
            print("Received data is not a valid JSON string")
            return
        if type == 'private_game' :
            if players != None  and players.get("hostplayer") and players.get("inviteplayer") :
                self.firstPlayer = players["hostplayer"]
                self.secondPlayer = players["inviteplayer"]
                self.first_ID = self.firstPlayer.get("userID") or self.firstPlayer.get("id")
                self.second_ID = self.secondPlayer.get("userID") or self.secondPlayer.get("id")
                if self.first_ID and self.second_ID :
                    self.game_ID = f'{min(self.first_ID, self.second_ID)}_game_{max(self.first_ID, self.second_ID)}'
            if any([game['gameID'] == self.game_ID for game in privateGames]):
                desiredGame = next(game for game in privateGames if game['gameID'] == self.game_ID)
                desiredGame['inviteSocket'] = self.channel_name
                await self.channel_layer.group_add(self.game_ID,desiredGame['inviteSocket'])
                await self.channel_layer.group_add(self.game_ID,desiredGame['hostSocket'])
                created_game = await self.add_game_to_database()
                if created_game != None :
                    await self.channel_layer.group_send(self.game_ID,{
                        'type' : "created_private_game",
                        'message' : json.dumps(created_game)
                        }) 
            else :
                    privateGames.append({
                    "gameID":self.game_ID,
                    "hostSocket":self.channel_name,
                    "inviteSocket":None
                    })
                
            
    async def created_private_game(self,event) :
        game = event['message']
        player = User.objects.get(userID=self.first_ID)
        data = {
            'game' : game,
            'val' : 'match_found',
            'user' : json.dumps(self.firstPlayer)
        }
        await self.send(text_data=json.dumps({
            "type" : "created_private_game",
            "message" : data
        }))
        
        
    async def add_game_to_database(self) :
        private_game = next(game for game in privateGames if game['gameID'] == self.game_ID)
        
        if private_game :
            fplayer = User.objects.get(userID=self.first_ID)
            scplayer = User.objects.get(userID=self.second_ID)
            if fplayer and scplayer :
                created_game = Game.objects.create(gameID=f'{self.game_ID}{datetime.now().strftime("%Y%m%d%H%M%S")}',first_player=fplayer,second_player=scplayer,date_created=datetime.now(),fplayer_score=0,scplayer_score=0)
                created_game.save()
                privateGames.clear()
                return created_game.to_dic()
            else :
                print("Can't Find the players for private Game")
                return (None)
        else :
                print("Can't Find the private Game ")
                return(None)
            
            
    async def disconnect(self, close_code):
        if self.game_ID :
            await self.channel_layer.group_discard(self.game_ID,self.channel_name)
            if any([game['gameID'] == self.game_ID for game in privateGames]):
                privateGames.remove(next(game for game in privateGames if game['gameID'] == self.game_ID))
            await self.close()


# ! TOURNAMENT

list_of_tournaments = deque()

class Tournament(AsyncWebsocketConsumer) :
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_tour = None
        self.name = None
        self.final_joined = None
        self.id = None
        
    
    
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            'type' : "connected",
            'message' : "connected too Tournament"
        }))
        
    
    
    
    async def disconnect(self, close_code): 
        await self.check_tour_cancel() 
        if any(tour for tour in list_of_tournaments if tour['tour_ID'] == self.current_tour and tour['status'] == 'open') :
            tour = next(tour for tour in list_of_tournaments if tour['tour_ID'] == self.current_tour and tour['status'] == 'open')
            if tour :
                players_list = tour['players_sockets']
                if players_list != None :
                    rem = next(player for player in players_list if player['id'] == self.id)
                    players_list.remove(rem)
                    if tour['nbr_players'] > 0 :
                        tour['nbr_players'] -= 1
                    if tour['nbr_players'] == 0 :
                        list_of_tournaments.remove(tour)
        await self.close()

    def check_if_player_exist(self,id) :
        list_of_players = []
        if list_of_tournaments :
            tour = next(tour for tour in list_of_tournaments if tour['status'] == 'open')
            if tour :
                list_of_players = tour['players_sockets']
                if list_of_players != None:
                    if any([player['id'] == id for player in list_of_players]) :
                        return False
                    else :
                        print("Player not in the tournament")
                        return True
                else :
                    print("NO players in the tournament")
                    return True
        else :
                print("can't found tour")
                return True

    async def receive(self, text_data):
        try:
            json_data = json.loads(text_data)
            type = json_data['type']
            data = json_data['data']
        except json.JSONDecodeError:
            print("Received data is not a valid JSON string")
            return
        if type == 'join_or_create_tournament':
            self.name = data['username']
            self.id = data['id']
            if self.check_if_tournament_exist() and self.check_if_player_exist(data['id']) :
                self.current_tour =  self.join_tournament(data)
                if self.current_tour != None :
                    self.add_new_player(data['id'])
                    if any([tournament['status'] == 'full' for tournament in list_of_tournaments]) :
                        await self.luanch_tournament()
                    else :
                        await self.waiting_players()
                else :
                    print("NO Tournament too join it")
            else:
                    self.current_tour = self.create_tournament(data)
                    self.channel_layer.group_add(self.current_tour,self.channel_name)
                    self.add_new_tour(data['id'])
                    await self.waiting_players()
                    
        elif type == "finished"  and self.current_tour :
                await self.qualified_to_final(data)
                
        elif type == "cancel" :
            await self.disconnect(1000)

                
        else:
            print("Invalid data received-------")
            
            
            

    async def check_tour_cancel(self) :
        tour = Tournaments.objects.get(tourID=self.current_tour)
        if tour.first_demi_final.first_player and tour.first_demi_final.first_player.userID == self.id \
            and tour.first_demi_final.winner == None :
            tour.first_demi_final.first_player = None
            tour.first_demi_final.status = 'open'
            tour.first_demi_final.save()
            await self.cancel(tour)
        elif tour.first_demi_final.second_player and tour.first_demi_final.second_player.userID == self.id \
            and tour.first_demi_final.winner == None :
            tour.first_demi_final.second_player = None
            tour.first_demi_final.status = 'open'
            tour.first_demi_final.save()
            await self.cancel(tour)
        elif tour.second_demi_final.first_player and  tour.second_demi_final.first_player.userID == self.id \
            and tour.second_demi_final.winner == None :
            tour.second_demi_final.first_player = None
            tour.second_demi_final.status = 'open'
            tour.second_demi_final.save()
            await self.cancel(tour)
        elif tour.final and tour.final.first_player and tour.final.first_player.userID == self.id \
            and tour.final.winner == None :
            tour.final.status = 'cancelled'
            tour.final.save()
            await self.cancel(tour)
        else :
            print("can't found user in cancel")
        if tour.first_demi_final.first_player == None and tour.first_demi_final.second_player == None and \
            tour.second_demi_final.first_player == None and tour.second_demi_final.second_player == None:
                tour.delete()
        await self.channel_layer.group_send(self.current_tour,{
            'type' :"waiting",
            'tour' : tour.to_dic()
        })
            

    async def cancel(self,tour) :
        await self.channel_layer.group_send(self.current_tour,{
            'type' : "cancel_game",
            'data' : tour.to_dic() 
        })
        await self.channel_layer.group_discard(self.current_tour,self.channel_name)
        
    async def cancel_game(self,event) :
        tour = event['data']
        await self.send(text_data=json.dumps({
            'type': 'cancel',
            "tour" : tour
        }))
        
    
    def join_tournament(self,data) :
        joined_tour = next(tour for tour in list_of_tournaments if tour['status'] == 'open')
        if joined_tour and joined_tour['status'] == 'open' and  joined_tour['nbr_players'] < 4 :
            self.channel_layer.group_add(joined_tour['tour_ID'],self.channel_name)
            joined_tour['nbr_players'] += 1
            joined_tour['players_sockets'].append({'id': data['id'] ,'socket':self.channel_name})
            if joined_tour['nbr_players'] == 4 :
                joined_tour['status'] = 'full'
            return(joined_tour['tour_ID'])
        else :
            print("Can't found a open tournamet too join it")

       
    def add_new_player(self,id) :
        added_player = User.objects.get(userID=id)
        tour = Tournaments.objects.get(tourID=self.current_tour)
        if added_player and tour:
            
            if tour.first_demi_final.first_player == None  and tour.first_demi_final.status != 'full':
                tour.first_demi_final.first_player = added_player
                tour.first_demi_final.save()
            elif tour.first_demi_final.second_player == None  and tour.first_demi_final.status != 'full':
                tour.first_demi_final.second_player = added_player
                if tour.first_demi_final.first_player and tour.first_demi_final.second_player :
                    tour.first_demi_final.status = 'full'
                tour.first_demi_final.save()
            elif tour.second_demi_final.first_player == None  and tour.second_demi_final.status != 'full':
                tour.second_demi_final.first_player = added_player
                tour.second_demi_final.save()
            elif tour.second_demi_final.second_player == None and tour.second_demi_final.status != 'full':
                tour.second_demi_final.second_player = added_player
                if tour.second_demi_final.first_player and tour.second_demi_final.second_player :
                    tour.first_demi_final.status = 'full'
                tour.second_demi_final.save()
                tour.status = 'closed'
        tour.save()
                
       
       
       
    def create_tournament(self,data) :
        created_tour = {
            'tour_ID' : str(uuid.uuid4()),
            'nbr_players' : 0,
            'status' : 'open',
            'players_sockets' : [{'id': data['id'] ,'socket' : self.channel_name}]
        }
        list_of_tournaments.append(created_tour)
        self.channel_layer.group_add(created_tour['tour_ID'],self.channel_name)
        created_tour['nbr_players'] =+ 1
        return created_tour['tour_ID']
       
       
    def check_if_tournament_exist(self):
        if list_of_tournaments :
            return any([tournament['status'] == 'open' for tournament in list_of_tournaments])
        else :
            return False 
    
    def add_new_tour(self,id) :
            added_player = User.objects.get(userID=id)
            new_tour = Tournaments.objects.create(tourID=self.current_tour,date_created=datetime.now)
            if added_player :
                new_tour.first_demi_final = Game.objects.create(gameID=str(uuid.uuid4()),first_player=added_player,second_player=None,date_created=datetime.now(),fplayer_score=0,scplayer_score=0,status='open')
                new_tour.first_demi_final.save()
                new_tour.second_demi_final = Game.objects.create(gameID=str(uuid.uuid4()),first_player=None,second_player=None,date_created=datetime.now(),fplayer_score=0,scplayer_score=0,status='open')
                new_tour.second_demi_final.save()
                new_tour.final = Game.objects.create(gameID=str(uuid.uuid4()),first_player=None,second_player=None,date_created=datetime.now(),fplayer_score=0,scplayer_score=0,status='open')
                new_tour.final.save()
                new_tour.save()
            else :
                print("can't found player ID in add_new_tour")
  
  
    async def luanch_tournament(self) :
        tour = Tournaments.objects.get(tourID=self.current_tour)
        if tour.first_demi_final.running == False and tour.second_demi_final.running == False :
            if tour.first_demi_final.first_player.userID and tour.first_demi_final.second_player.userID :
                first_player = tour.first_demi_final.first_player.userID
                second_player = tour.first_demi_final.second_player.userID
                tour.first_demi_final.running = True
                tour.first_demi_final.save()
                await self.start_game_tour(first_player,second_player,tour.first_demi_final)
        if  tour.first_demi_final.running == True and tour.second_demi_final.running == False :
            if tour.second_demi_final.first_player.userID and tour.second_demi_final.second_player.userID :
                first_player = tour.second_demi_final.first_player.userID
                second_player = tour.second_demi_final.second_player.userID
                tour.second_demi_final.running = True
                tour.second_demi_final.save()
                await self.start_game_tour(first_player,second_player,tour.second_demi_final)
            tmp_tour = next(tmp for tmp in list_of_tournaments if tmp['tour_ID'] == self.current_tour)
            channels = tmp_tour['players_sockets']
            if channels :
                for channel in channels :
                    await self.channel_layer.group_discard(self.current_tour,channel['socket'])
                list_of_tournaments.remove(tmp_tour)
            else :
                print("Can't Find tmp tour channel")
            
    async def start_game_tour(self,first_player,second_player,game) :
            tour = next(tour for tour in list_of_tournaments if tour['tour_ID'] == self.current_tour)
            sockets = tour['players_sockets']
            if sockets :
                first_socket = next(player for player in sockets if player['id'] == first_player)
                second_socket = next(player for player in sockets if player['id'] == second_player)
                if first_socket and second_socket :
                    await self.channel_layer.group_add(game.gameID,first_socket['socket'])
                    await self.channel_layer.group_add(game.gameID,second_socket['socket'])
                    await self.channel_layer.group_send(game.gameID,{
                        'type':"match_found",
                        "game" : game.to_dic()
                    })
                else :
                    print("C'ant found players socket too lunch Game in tournament")
            else :
                print("list of running tournaments not found")

    async def match_found(self, event):
        game = event['game']
        await self.send(text_data=json.dumps({
            'type': 'match_found',
            'game': game
        }))
        

    async def waiting_players(self) :
        tour = Tournaments.objects.get(tourID=self.current_tour)
        stour = next(stour for stour in list_of_tournaments if stour['tour_ID'] == self.current_tour)
        if stour:
            for player in stour['players_sockets'] :
                await self.channel_layer.group_add(self.current_tour,player['socket'])
        await self.channel_layer.group_send(self.current_tour,{
            "type" : "waiting",
            "tour" : tour.to_dic()
        })
        
    async def waiting(self,event) :
        tour = event['tour']
        await self.send(text_data=json.dumps({
            "type" : "waiting_for_tour",
            'tour' : tour
        }))
        
        
    async def qualified_to_final(self,data) :
            if 'game' and 'userID' in data :
                game_to_check = data['game']
                player_request = data['userID']
                game_obj = Game.objects.get(gameID=game_to_check)
                if game_obj.winner and game_to_check and game_obj.winner.userID == player_request:
                        played_tour = Tournaments.objects.get(tourID=self.current_tour)
                        if played_tour.final  and played_tour.final.first_player != None and played_tour.final.winner == None \
                            and played_tour.final.status == 'open' :
                            await self.channel_layer.group_discard(game_to_check,self.channel_name)
                            played_tour.final.second_player = game_obj.winner
                            played_tour.final.running = True
                            played_tour.final.save()
                            await self.add_player_to_final(game_to_check,played_tour.final.gameID)
                        elif played_tour.final and   played_tour.final.first_player == None and played_tour.final.status == 'open' :
                            await self.channel_layer.group_discard(game_to_check,self.channel_name)
                            played_tour.final.first_player = game_obj.winner
                            played_tour.final.save()
                            await self.waiting_final(game_to_check,played_tour.final.gameID)
                        elif played_tour.final and played_tour.final.winner != None and \
                            played_tour.final.first_player != None and played_tour.final.second_player != None \
                            and played_tour.final.status == 'finished' :
                            played_tour.winner = played_tour.final.winner
                        elif played_tour.final and played_tour.final.status == 'cancelled' :
                            played_tour.final.second_player = game_obj.winner
                            played_tour.winner = game_obj.winner
                        played_tour.save()
                else :
                    await self.send(text_data=json.dumps({
                        "type" : "eliminated",
                        "message" : "YOU ARE ELIMINATED FROM TOURNAMENT GOOD LUCK NEXT TIME"
                    }))
                    await self.channel_layer.group_discard(game_to_check,self.channel_name)
                    await self.disconnect(1000)
    
    async def add_player_to_final(self,discared_game,game_to_add) :
        await self.channel_layer.group_add(game_to_add,self.channel_name)
        second_round_tour = Tournaments.objects.get(tourID=self.current_tour)
        if second_round_tour :
            await self.channel_layer.group_send(game_to_add,{
                'type' : "to_final",
                'tour' :  second_round_tour.to_dic()
            })
            
            
    async def to_final(self,event) :
        game = event['tour']
        await self.send(text_data=json.dumps({
            'type' : 'final',
            'tour' : game
        }))
        
    async def waiting_final(self,discared_game,game_to_add) :
        await self.channel_layer.group_discard(discared_game,self.channel_name)
        await self.channel_layer.group_add(game_to_add,self.channel_name)
        second_round_tour = Tournaments.objects.get(tourID=self.current_tour)
        if second_round_tour :
            await self.channel_layer.group_send(game_to_add,{
                'type' : "waiting",
                'tour' :  second_round_tour.to_dic()
            })
        
        