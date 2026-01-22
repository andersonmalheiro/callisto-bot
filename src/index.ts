import { client } from '@core/client';
import { Events } from 'discord.js';
import { config } from 'dotenv';
import { onInteraction, onReady, onVoiceStateUpdate } from '@events';
import { getEnv } from '@utils/functions/getEnv';

config();

const token = getEnv('DISCORD_TOKEN');

client.on(Events.ClientReady, onReady);
client.on(Events.InteractionCreate, onInteraction);
client.on(Events.VoiceStateUpdate, onVoiceStateUpdate);

client.login(token);
