import { CommandList } from '@commands/commandList';
import { Client, REST, Routes } from 'discord.js';
import { getEnv } from '@utils/functions/getEnv';

const onReady = async (BOT: Client) => {
	console.log(`Connected to discord as ${BOT.user?.tag}`);
	const token = getEnv('DISCORD_TOKEN');

	const api = new REST({ version: '9' }).setToken(token);

	const commandData = CommandList.map((command) => command.data);

	await api.put(
		Routes.applicationCommands(BOT.user?.id ?? ''),
		{ body: commandData },
	);
};

export default onReady;
