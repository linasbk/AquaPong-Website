from .models import Leaderbord
from Sign_up.models import User 
def update_leaderboard(userID, name_table, score_of_match, win=False):

    userID = User.objects.get(userID=userID)
    lead_board = Leaderbord.objects.get(userID=userID)
    if name_table == 'goldaqua':
        lead_board.goldaqua += 1
    elif name_table == 'darkaqua':
       
        lead_board.darkaqua += 1
    elif name_table == 'aqua':
      
        lead_board.aqua += 1
    
    lead_board.match += 1
    lead_board.score += score_of_match
    
    #-----
    lead_board.level += ((score_of_match * 100) / lead_board.maxlvl)
    if (lead_board.level >= lead_board.maxlvl):

        temp = lead_board.level- lead_board.maxlvl
        lead_board.maxlvl += 100
        lead_board.level = 0
        lead_board.level = ((temp * 100) / lead_board.maxlvl)
        lead_board.mainLvl += 1
    if win:
        lead_board.win += 1
    else:
        lead_board.lose += 1
    lead_board.save()

def win(userID, name_table, score_of_match):
    update_leaderboard(userID, name_table, score_of_match, win=True)

def lose(userID, name_table, score_of_match):
    update_leaderboard(userID, name_table, score_of_match)
