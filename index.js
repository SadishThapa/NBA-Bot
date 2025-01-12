const { Client, Events, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { token } = require("YOUR_PATH_TO_CONFIG.JSON");
const client = new Client({ intents: [] });
const players = require('./filterId/player_id.json');
const { spawn } = require("child_process");

client.once(Events.ClientReady, (c) => {
  // verifies login was successful
  console.log(`Logged in as ${c.user.username}`);

  // ./player command used to search for players
  const player = new SlashCommandBuilder()
    .setName("player")
    .setDescription("Gets Statistics and Fantasy Points of the Player you Specify")
    .addStringOption(option =>
      option.setName("player")
        .setDescription("Enter the full name of the Player")
        .setRequired(true)
    );

  client.application.commands.create(player.toJSON());
});

client.on(Events.InteractionCreate, async interaction => {
  // if player command initiated
  if (interaction.commandName === "player") {
    const playerName = interaction.options.getString("player");

    // ignores accent ascii symbols
    const playerSpecified = players.find(p =>
      p.full_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ===
      playerName.toLowerCase()
  );
  
    if (playerSpecified) {
      // Spawns the Python process to fetch the player's stats
      const pythonProcess = spawn('python3', ['./stats.py', playerSpecified.id]);

      // Initialize variables to hold stats
      let ppg, apg, rpg, fantasyPoints;

      pythonProcess.stdout.on('data', (data) => {
        try {
          const result = JSON.parse(data.toString());
          console.log(result);
          ppg = result.ppg;
          apg = result.apg;
          rpg = result.rpg;
          fantasyPoints = result.fantasyPoints;
        } catch (error) {
          console.error("Error parsing Python data:", error);
        }
      });

      pythonProcess.on('close', () => {
        // Create the embed with player stats
        const embed = new EmbedBuilder()
          .setTitle(`${playerName} Fantasy Points This Season`)
          .setDescription(`🏀 Stats for the 2024-2025 season 🏀`)
          .setColor('#7289DA')
          .setThumbnail('https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExanZ1amdnYTB4NGR4ZWY0eWVpZHJhNm1kb2Y5a2JzdWQ0emR3cXd6NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/xT9IgCfqoMQEWOUef6/giphy.gif')
          .addFields(
            { name: 'Points Per Game', value: `${ppg}` },
            { name: 'Assists Per Game', value: `${apg}` },
            { name: 'Rebounds Per Game', value: `${rpg}` },
            { name: 'Average Fantasy Points', value: `${fantasyPoints}` }
          )
          .setImage(`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerSpecified.id}.png`)
          .setTimestamp()
          .setFooter({ text: 'NBA Fantasy Bot', iconURL: 'https://i.pinimg.com/736x/8f/42/96/8f42962302981ec6fac5b718a33e768c.jpg' });

        // Only reply after the Python process finishes
        interaction.reply({ embeds: [embed] });
      });

      pythonProcess.on('error', (err) => {
        console.error('Python process error:', err);
        interaction.reply({ content: "There was an error fetching the player's stats." });
      });
    } else {
      // Handle case where player is not found
      interaction.reply(`Player ${playerName} not found/not currently active!`);
    }
  }
});

client.login(token);