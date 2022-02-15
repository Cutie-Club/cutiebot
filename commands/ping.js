const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Shows round trip latency.'),
	async execute(interaction) {
		await interaction.reply({
			embeds: [embed('**💖 Ping!**').addFields(
				{
					name: 'Bot Latency',
					value: `\`${Date.now() - interaction.createdTimestamp}ms\``
				},
				{
					name: 'API Latency',
					value: `\`${interaction.client.ws.ping}ms\``
				}
			)],
			ephemeral: true
		});
	},
};
