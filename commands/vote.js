const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Start a vote. Reacts with 👍 and 👎.')
		.addStringOption((option) =>
			option
				.setName('topic')
				.setDescription('What should users vote on?')
				.setRequired(true)
		),
	async execute(interaction) {
		const topic = interaction.options.getString('topic');

		interaction
			.reply({
				embeds: [
					embed(topic).setTitle(
						`${interaction.user.username} has started a vote! 🗳`
					),
				],
				fetchReply: true,
			})
			.then((reply) => {
				reply.react('👍');
				reply.react('👎');
			});
	},
};
