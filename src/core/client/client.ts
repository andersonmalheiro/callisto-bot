import { IntentOptions } from '@config/IntentOptions';
import { Client } from 'discord.js';

const client = new Client({ intents: IntentOptions });

export default client;
