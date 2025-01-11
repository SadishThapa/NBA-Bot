const { Client, Events, SlashCommandBuilder } = require("discord.js");
const { token, rapidApiKey } = require("./config.json");
const client = new Client({ intents: [] });
const fs = require("fs");
const players = require('/root/NBA-Bot/player_id.json'); // (with path)
const { spawn } = require("child_process"); // Import the spawn function to run the Python script

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.username}`);
  
  // Build the player command
  const player = new SlashCommandBuilder()
    .setName("player")
    .setDescription("Gets fantasy points of the player you specify")
    .addStringOption(option =>
      option.setName("player")
        .setDescription("The full name of the Player")
        .setRequired(true) // You can make this optional if needed
    );

  // Register the 'player' command with the Discord API
  client.application.commands.create(player.toJSON()); // Convert SlashCommandBuilder to JSON
});

client.on(Events.InteractionCreate, (interaction) => {
  if (interaction.commandName === "player") {
    const playerName = interaction.options.getString("player");
    console.log(playerName);
    
    // Defer the reply to allow for processing time
    interaction.deferReply();

    const playerSpecified = players.find(p => p.full_name.toLowerCase() === playerName.toLowerCase());
    if (playerSpecified) {
      const player_id = playerSpecified.id;
      
      // Spawn the Python process to fetch the player's stats
      const pythonProcess = spawn('python3', ['/root/NBA-Bot/stats.py', player_id]);

      // Handle the Python process output
      pythonProcess.stdout.on('data', (data) => {
        const result = data.toString();  // Assuming result is in the format you want
        console.log(result);

        // Reply with the result after the Python process finishes
        interaction.editReply(`${playerName} Fantasy Points This Season Is: ${result}`);
      });

      // Handle errors from Python process
      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        interaction.editReply("An error occurred while fetching the player's stats.");
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          interaction.editReply("An error occurred during the Python script execution.");
        }
      });
    } else {
      interaction.editReply("Player not found.");
    }
  }
});

client.login(token);
