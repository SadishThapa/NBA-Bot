import csv
import json

# File paths
csv_file_path = '/root/NBA-Bot/active_players.csv'  # Replace with your CSV file path
json_file_path = '/root/NBA-Bot/player_id.json'  # Path to save the JSON file

# Read the CSV file and convert to a list of dictionaries
with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)  # Automatically handles the header
    data = [row for row in reader]  # Convert each row to a dictionary

# Convert the list of dictionaries to JSON format
json_data = json.dumps(data, indent=4)

# Save to a JSON file
with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
    jsonfile.write(json_data)

print(f"Data has been successfully converted to {json_file_path}")
