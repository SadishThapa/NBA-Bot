import sys
import json
from nba_api.stats.endpoints import playercareerstats

player_id = sys.argv[1]

def findPlayerId():
    career = playercareerstats.PlayerCareerStats(player_id=player_id) 


    df = career.get_data_frames()[0]
    filtered_df = df[df["SEASON_ID"] == "2024-25"]

    last_row = filtered_df

    if last_row.empty:
        result = {
            "ppg": "N/A, has not played this season",
            "apg": "N/A, has not played this season",
            "rpg": "N/A, has not played this season",
            "fantasyPoints": "N/A, has not played this season"
        }
        print(json.dumps(result))
        return

    games_played = last_row['GP'].values[0]
    fgm = last_row['FGM'].values[0]
    fga = last_row['FGA'].values[0]
    fg3m = last_row['FG3M'].values[0]
    fg3a = last_row['FG3A'].values[0]
    ftm = last_row['FTM'].values[0]
    fta = last_row['FTA'].values[0]
    points = last_row['PTS'].values[0]
    assists = last_row['AST'].values[0]
    rebounds = last_row['REB'].values[0]
    stl = last_row['STL'].values[0]
    block = last_row['BLK'].values[0]
    to = last_row['TOV'].values[0]

    season_total = (2 * fgm) - (fga) + (ftm) - (fta) + (fg3m) + (rebounds) + (2 * assists) + (4 * stl) + (4 * block) + (-2 * to) + (points)
    season_average = season_total / games_played
    result = {
        "ppg": round(points / games_played, 2),
        "apg": round(assists / games_played, 2),
        "rpg": round(rebounds / games_played, 2),
        "fantasyPoints": round(season_average, 2)
    }
    print(json.dumps(result))
    return
  
findPlayerId()
