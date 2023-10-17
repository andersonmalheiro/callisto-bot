import { CommandList } from 'commands/commandList';
import { Interaction } from 'discord.js';

const onInteraction = async (interaction: Interaction) => {
	if (interaction.isCommand()) {
		for (const Command of CommandList) {
			if (interaction.commandName === Command.data.name) {
				await Command.execute(interaction);
				break;
			}
		}
	}
};

export default onInteraction;
