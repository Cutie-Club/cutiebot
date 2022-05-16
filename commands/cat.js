const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');
const { getRequest } = require('../utils/webRequest.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Cat as a service.')
		.addStringOption((option) =>
			option
				.setName('tag')
				.setDescription('Search term for specific cat images')
		),
	async execute(interaction) {
		await interaction.deferReply();

		let catEmbed = embed("😻 **Here's your cat!**");
		const string = interaction.options.getString('tag');

		let tags = '?json=true';
		if (string != null) {
			tags = `/${string}?json=true`;
			catEmbed.setFooter({
				text: `tag: ${string}`,
			});
		}

		try {
			const data = await getRequest(`https://cataas.com/cat${tags}`);
			catEmbed.setImage(`https://cataas.com${data.url}`);
			await interaction.editReply({
				embeds: [catEmbed],
			});
		} catch (error) {
			log.error(error);

			let errorReply = `🙀 **No ${string} cats found!**`;

			if (string == undefined || string == null) {
				errorReply = '🙀 **No cats found!**';
			}

			let errorEmbed = embed(errorReply);

			await interaction.editReply({
				embeds: [errorEmbed],
				ephemeral: true,
			});
		}
	},
};
