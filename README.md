# Callisto Bot

A Discord bot built with discord.js v14 and TypeScript, featuring a modular command handler system for slash commands.

## Features

- TypeScript-based Discord bot with strict type checking
- Slash command support with automatic registration
- Modular command architecture for easy extensibility
- Voice channel audio playback (plays custom audio when users join channels)
- Docker support for containerized deployment
- Path aliases for clean imports

## Prerequisites

- Node.js 18 or higher
- A Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications)
- A Discord server (guild) ID where the bot will operate
- FFmpeg installed on your system (required for audio playback)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd callisto-bot
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
DISCORD_TOKEN=your_discord_bot_token_here
GUILD_ID=your_discord_server_id_here
```

4. Add your custom audio file to the `audio/` directory:
```bash
# Place your welcome audio file (supported formats: MP3, WAV, OGG)
cp /path/to/your/audio.mp3 audio/welcome.mp3
```

## Development

Start the bot in development mode with hot reload:
```bash
npm run dev
```

## Building and Running

Build the TypeScript project:
```bash
npm run build
```

Run the built project:
```bash
npm run serve
# or build and run
npm start
```

## Code Quality

Format code with Prettier:
```bash
npm run format
```

Check formatting:
```bash
npm run format:check
```

Lint code with ESLint:
```bash
npm run lint
```

## Project Structure

```
src/
├── commands/          # Bot commands
│   ├── commandList.ts # Central registry of all commands
│   └── ping.ts        # Example ping command
├── config/            # Configuration files
│   └── IntentOptions.ts
├── core/              # Core bot initialization
│   └── client/        # Discord client singleton
├── events/            # Event handlers
│   ├── onReady.ts           # Bot ready event & command registration
│   ├── onInteraction.ts     # Command interaction routing
│   └── onVoiceStateUpdate.ts # Voice channel audio playback
├── interfaces/        # TypeScript interfaces
│   └── Command.ts     # Command interface definition
├── utils/             # Utility functions
│   ├── assertions/
│   └── functions/
└── index.ts           # Application entry point

audio/                 # Audio files for voice playback
└── welcome.mp3        # Default audio played when users join
```

## Adding New Commands

1. Create a new command file in `src/commands/`:

```typescript
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '@interfaces/Command';

export const myCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('Description of my command'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Response from my command');
  },
};
```

2. Register the command in `src/commands/commandList.ts`:

```typescript
import { Command } from '@interfaces/Command';
import { ping } from './ping';
import { myCommand } from './myCommand';

export const CommandList: Command[] = [ping, myCommand];
```

3. Restart the bot. Commands are automatically registered when the bot starts.

## Voice Features

The bot automatically plays a custom audio file when any user joins a voice channel.

**Setup:**
1. Place your audio file (MP3, WAV, or OGG) in the `audio/` directory as `welcome.mp3`
2. Make sure the bot has permissions to connect and speak in voice channels
3. The bot will join, play the audio, and automatically disconnect

**Customization:**
To use a different audio file or customize behavior, edit [src/events/onVoiceStateUpdate.ts](src/events/onVoiceStateUpdate.ts):
- Change `audioPath` (line 46) to point to your desired audio file
- Adjust the timeout duration (currently 5 seconds)
- Modify connection logic as needed

## Docker Deployment

Build the Docker image:
```bash
docker build -t callisto-bot .
```

Run the container:
```bash
docker run -e DISCORD_TOKEN=your_token -e GUILD_ID=your_guild_id callisto-bot
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Bot token from Discord Developer Portal | Yes |
| `GUILD_ID` | Discord server ID where commands are registered | Yes |

## License

MIT

## Author

andersonmalheiro
