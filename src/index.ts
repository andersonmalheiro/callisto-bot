import { client } from '@core/client';
import { Events } from 'discord.js';
import { config } from 'dotenv';
import { onInteraction, onReady } from '@events';
import { getEnv } from '@utils/functions/getEnv';

config();

const token = getEnv('DISCORD_TOKEN');

client.on(Events.ClientReady, onReady);
client.on(Events.InteractionCreate, onInteraction);

client.login(token);
