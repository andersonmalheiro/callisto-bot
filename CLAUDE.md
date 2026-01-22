# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Discord bot built with discord.js v14 and TypeScript. The bot uses a command handler pattern with slash commands registered to Discord guilds.

## Development Commands

**Local development:**
```bash
npm run dev  # Watch mode with ts-node-dev and path resolution
```

**Building:**
```bash
npm run build  # Compiles TypeScript and resolves path aliases
```

**Running production build:**
```bash
npm run serve  # Runs the compiled dist/index.js
npm start      # Builds then runs
```

**Code quality:**
```bash
npm run lint          # ESLint checks
npm run format        # Auto-format with Prettier
npm run format:check  # Check formatting without changes
```

## Architecture

### Entry Point Flow
1. [src/index.ts](src/index.ts) - Application entry point
   - Loads environment variables via dotenv
   - Registers event handlers (onReady, onInteraction)
   - Logs in to Discord with token

### Core Components

**Client Singleton** ([src/core/client/client.ts](src/core/client/client.ts))
- Exports a single Discord.js Client instance configured with intents from [src/config/IntentOptions.ts](src/config/IntentOptions.ts)

**Event System** ([src/events/](src/events/))
- `onReady` - Registers slash commands to Discord via REST API when bot connects
- `onInteraction` - Routes incoming interactions to appropriate command handlers
- `onVoiceStateUpdate` - Handles voice channel events, plays audio when users join channels
- Commands are registered per-guild (not globally) using GUILD_ID env var

**Command Pattern** ([src/commands/](src/commands/))
- All commands implement the `Command` interface ([src/interfaces/Command.ts](src/interfaces/Command.ts))
- Each command exports an object with `data` (SlashCommandBuilder) and `execute` function
- Commands are aggregated in [src/commands/commandList.ts](src/commands/commandList.ts)
- The command list is used both for registration (onReady) and routing (onInteraction)

### Path Aliases

The project uses TypeScript path aliases (defined in [tsconfig.json](tsconfig.json)):
- `@core/*` → `src/core/*`
- `@commands/*` → `src/commands/*`
- `@config/*` → `src/config/*`
- `@interfaces/*` → `src/interfaces/*`
- `@events/*` → `src/events/*`
- `@utils/*` → `src/utils/*`

**Important:** Path aliases are resolved at build time using `tsconfig-replace-paths`. Always use these aliases in imports.

### Environment Variables

Required variables (loaded via dotenv):
- `DISCORD_TOKEN` - Bot token from Discord Developer Portal
- `GUILD_ID` - Discord server/guild ID where commands are registered

The `getEnv()` utility ([src/utils/functions/getEnv.ts](src/utils/functions/getEnv.ts)) asserts environment variables exist at runtime.

## Adding New Commands

1. Create a new file in [src/commands/](src/commands/) implementing the `Command` interface
2. Add the command to the `CommandList` array in [src/commands/commandList.ts](src/commands/commandList.ts)
3. Commands are auto-registered on bot startup via the onReady event

## Voice Features

The bot plays custom audio when users join voice channels:

**Audio File Location:** Place audio files in the [audio/](audio/) directory (MP3, WAV, or OGG format)

**Default Audio:** The bot looks for `audio/welcome.mp3` by default when a user joins

**Voice Dependencies:** Uses `@discordjs/voice` for audio playback with `libsodium-wrappers` for encryption

**How it Works:**
1. User joins a voice channel (triggers VoiceStateUpdate event)
2. Bot joins the same channel using `joinVoiceChannel`
3. Bot plays the audio file using `createAudioPlayer` and `createAudioResource`
4. Bot automatically disconnects after playback completes or after 5 seconds (safety timeout)

**Customizing Audio:** Modify the `audioPath` in [src/events/onVoiceStateUpdate.ts:46](src/events/onVoiceStateUpdate.ts#L46) to change which file is played

## Docker Deployment

The bot includes a multi-stage Dockerfile:
- Uses Node 18 Alpine
- Builds with yarn and frozen lockfile
- Runs as non-root user in production
- Requires `DISCORD_TOKEN` and `GUILD_ID` build args or runtime env vars
