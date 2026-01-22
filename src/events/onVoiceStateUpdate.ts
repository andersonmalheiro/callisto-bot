import logger from '@core/logs/logger';
import {
	AudioPlayerStatus,
	DiscordGatewayAdapterCreator,
	VoiceConnectionStatus,
	createAudioPlayer,
	createAudioResource,
	entersState,
	joinVoiceChannel,
} from '@discordjs/voice';
import { ChannelType, VoiceState } from 'discord.js';
import { join } from 'path';

const onVoiceStateUpdate = async (
	oldState: VoiceState,
	newState: VoiceState,
) => {
	// Check if user joined a voice channel (wasn't in a channel before, now is)
	const userJoinedChannel =
		(!oldState.channelId && newState.channelId) ||
		oldState.channelId !== newState.channelId;

	// Ignore bot's own voice state changes
	if (newState.member?.user.bot) return;

	if (userJoinedChannel) {
		const channel = newState.channel;

		// Ensure it's a voice or stage channel
		if (
			!channel ||
			(channel.type !== ChannelType.GuildVoice &&
				channel.type !== ChannelType.GuildStageVoice)
		) {
			return;
		}

		try {
			// Join the voice channel
			const connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild
					.voiceAdapterCreator as DiscordGatewayAdapterCreator,
			});

			// Wait for the connection to be ready
			await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

			// Create an audio player
			const player = createAudioPlayer();

			// Path to the audio file (you can customize this)
			const audioPath = join(process.cwd(), 'audio', 'welcome.mp3');

			// Create audio resource
			const resource = createAudioResource(audioPath);

			// Subscribe the connection to the audio player
			connection.subscribe(player);

			// Play the audio
			player.play(resource);
			logger.log({
				level: 'info',
				message: 'Played welcome message',
			});

			// When audio finishes, disconnect
			player.on(AudioPlayerStatus.Idle, () => {
				connection.destroy();
				logger.log({
					level: 'info',
					message: 'disconnected from channel',
				});
			});

			// Handle errors
			player.on('error', (error) => {
				console.error('Audio player error:', error);
				connection.destroy();
				logger.log({
					level: 'error',
					message: 'audio player error',
					error,
				});
			});

			// Auto-disconnect after 5 seconds as a safety measure
			setTimeout(() => {
				if (
					connection.state.status !== VoiceConnectionStatus.Destroyed
				) {
					connection.destroy();
				}
			}, 5000);
		} catch (error) {
			logger.log({
				level: 'error',
				message: 'audio player error',
				error,
			});
		}
	}
};

export default onVoiceStateUpdate;
