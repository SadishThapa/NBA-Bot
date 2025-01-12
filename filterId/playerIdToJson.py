import csv
import json

# File paths
csv_file_path = './active_players.csv'
json_file_path = './player_id.json'

# Read the CSV file and convert to a list of dictionaries
with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    data = [row for row in reader]

# Convert the list of dictionaries to JSON format
json_data = json.dumps(data, indent=4, ensure_ascii=False)

# Save to a JSON file
with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
    jsonfile.write(json_data)