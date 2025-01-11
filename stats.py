import sys

from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players

player_id = sys.argv[1]

if player_id:
    career = playercareerstats.PlayerCareerStats(player_id=player_id) 

    df = career.get_data_frames()[0]  # Get the DataFrame
    last_row = df.tail(1)

    games_played = last_row['GP'].values[0]
    fgm = last_row['FGM'].values[0]
    fga = last_row['FGA'].values[0]
    fg3m = last_row['FG3M'].values[0]
    fg3a = last_row['FG3A'].values[0]
    ftm = last_row['FTM'].values[0]
    fta = last_row['FTA'].values[0]
    points = last_row['PTS'].values[0]  # Extract Points
    assists = last_row['AST'].values[0]  # Extract Assists
    rebounds = last_row['REB'].values[0]  # Extract Rebounds
    stl = last_row['STL'].values[0]  # Extract Points
    block = last_row['BLK'].values[0]  # Extract Assists
    to = last_row['TOV'].values[0]  # Extract Rebounds

    season_total = (2 * fgm) - (fga) + (ftm) - (fta) + (fg3m) + (rebounds) + (2 * assists) + (4 * stl) + (4 * block) + (-2 * to) + (points)
    season_average = season_total / games_played
    print(f"{season_average:.2f}")
else:
    print("Player Not Found")



