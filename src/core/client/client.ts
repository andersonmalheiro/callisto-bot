import { IntentOptions } from 'config/IntentOptions';
import { Client } from 'discord.js';

export const client = new Client({ intents: IntentOptions });
