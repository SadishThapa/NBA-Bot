import pandas as pd
from nba_api.stats.static import players

# Retrieve all players
all_players = players.get_players()

# Converts the list of dictionaries to a Pandas DataFrame
df = pd.DataFrame(all_players)

# Filter for active NBA players only
active_players = df[df['is_active'] == True]

# Save the filtered DataFrame to a CSV file
output_file = './active_players.csv'
active_players.to_csv(output_file, index=False)