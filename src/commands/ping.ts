import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from 'interfaces/Command';

export const ping: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong'),
	async execute(interaction: CommandInteraction) {
		await interaction.reply('Pong');
	},
};
