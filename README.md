# NBA Fantasy Bot

A simple Discord bot that fetches NBA player data and fantasy points. Built using `discord.js`.

## Features

- Responds to a basic slash command `/player` (currently in v1).
- Fetches NBA player information and displays fantasy-related data.
- Displays points, rebounds, assists, and average fantasy in an embedded format

## Setup

1. Clone the repo:
```bash
   git clone https://github.com/yourusername/NBA-Bot.git
   cd nba-fantasy-bot
```

2. Install dependencies
```bash
  npm install 
```

2. Acquire Discord Token and use OAuth02 to invite to server, put token inside config.json file
```bash
{
  "token": "YOUR_BOT_TOKEN",
}
```

2. Run Bot In Server
```bash
  node index.js 
```

1. Current Commands:
/player