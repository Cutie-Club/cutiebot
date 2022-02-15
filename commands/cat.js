const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');
const { getRequest } = require('../utils/webRequest.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Cat as a service.')
		.addStringOption(option => 
			option.setName('tag')
				.setDescription('Search term for specific cat images')
		),
	async execute(interaction) {
		await interaction.deferReply();

		let catEmbed = embed('😻 **Here\'s your cat!**');
		const string = interaction.options.getString('tag');

		let tags = '?json=true';
		if (string != null) {
			tags = `/${string}?json=true`;
			catEmbed.setFooter({
				text: `tag: ${string}`
			});
		}

		await getRequest(`https://cataas.com/cat${tags}`)
			.then(data => {
				catEmbed.setImage(`https://cataas.com${data.url}`);
			})
			.catch(err => {
				log.error(err);
			});

		await interaction.editReply({
			embeds: [catEmbed]
		});
	},
};
