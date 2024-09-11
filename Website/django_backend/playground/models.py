from django.db import models

from Sign_up.models import User


class Game(models.Model) :
    gameID = models.SlugField(unique=True,primary_key=True)
    first_player = models.ForeignKey(User,related_name='firstPlyer' ,on_delete=models.RESTRICT , null=True)
    second_player = models.ForeignKey(User,related_name='secondPlayer' ,on_delete=models.RESTRICT , null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    fplayer_score = models.PositiveIntegerField()
    scplayer_score = models.PositiveIntegerField()
    status = models.CharField(verbose_name="status",default="open" , max_length=400)
    running  = models.BooleanField(default=False)
    winner = models.ForeignKey(User,related_name='game_winner',on_delete=models.RESTRICT , null=True)

    
    class Meta:
     ordering = ['date_created']
     
    def __str__(self):
     return str(self.gameID)
 
    def to_dic(self):
     return {
         'gameID' : self.gameID,
         'first_player' : self.first_player.username if self.first_player != None and self.first_player != 'waiting' else 'waiting',
         'second_player' : self.second_player.username if self.second_player != None and self.second_player != 'waiting' else 'waiting' ,
         'fplayer_score' : self.fplayer_score,
         'scplayer_score' : self.scplayer_score,
         'first_image' : str(self.first_player.profile_image.url) if self.first_player!= None and self.first_player != 'waiting' else 'waiting' ,
         'second_image' : str(self.second_player.profile_image.url) if self.second_player != None and self.second_player != 'waiting' else 'waiting',
         'running' : self.running,
         'status' : self.status,
         'winner' :  self.winner.username if self.winner != None and self.winner != 'waiting' else 'waiting' ,
     }



    
    
  


class Tournaments(models.Model) :
    tourID = models.SlugField(unique=True,primary_key=True)
    date_created = models.DateField(auto_now_add=True)
    first_demi_final = models.ForeignKey(Game,related_name='firstDemiFinal',on_delete=models.RESTRICT , null=True)
    second_demi_final = models.ForeignKey(Game,related_name='secondDemiFinal',on_delete=models.RESTRICT , null=True)
    final = models.ForeignKey(Game,related_name='final',on_delete=models.RESTRICT , null=True)
    winner = models.ForeignKey(User,related_name='Tournament_winner',on_delete=models.RESTRICT , null=True)
    status = models.CharField(verbose_name="status",default="open", max_length=400)

    def to_dic(self):
     return {
        'tournamentID' : self.tourID,
        'first_demi_final' : self.first_demi_final.to_dic(),
        'second_demi_final' : self.second_demi_final.to_dic(),
        'final' : self.final.to_dic() if self.final else None,
        'winner' : self.winner
     }
    