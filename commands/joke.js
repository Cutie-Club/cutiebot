const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');
const { getRequest } = require('../utils/webRequest.js');

const jokeCategories = ['Misc', 'Programming', 'Pun', 'Spooky', 'Christmas'];

const categoryChoices = jokeCategories.map((item) => ({
	name: item,
	value: item,
}));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Fetch a joke from jokeapi.dev')
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('Choose a category of joke.')
				.addChoices(...categoryChoices)
		)
		.addStringOption((option) =>
			option
				.setName('type')
				.setDescription('Choose a type of joke.')
				.addChoices(
					{ name: 'One-liner', value: 'single' },
					{ name: 'Two-parter', value: 'twopart' }
				)
		),
	async execute(interaction) {
		await interaction.deferReply();

		let jokeEmbed = embed("😹 **Here's your joke!**");
		const category = interaction.options.getString('category');
		const jokeType = interaction.options.getString('type');

		// always filter out racist and sexist jokes. ew.
		// if the channel isn't marked nsfw, blacklist nsfw.
		let parameters = `?format=json&?blacklistFlags=racist+sexist+religious${
			!interaction.channel.nsfw ? '+nsfw+explicit&safe-mode' : ''
		}${jokeType != null ? `&type=${jokeType}` : ''}`;

		let url = `https://v2.jokeapi.dev/joke/${
			category != null ? category : jokeCategories.join(',')
		}${parameters}`;

		try {
			const data = await getRequest(url);

			if (data.error)
				throw new Error(data.message, { cause: data.additionalInfo });

			switch (data.type) {
				case 'single':
					jokeEmbed.addFields({ name: 'Joke', value: data.joke });
					break;
				case 'twopart':
					jokeEmbed.addFields([
						{ name: 'Setup', value: data.setup },
						{ name: 'Punchline', value: `||${data.delivery}||` },
					]);
					break;
			}

			jokeEmbed.setFooter({
				text: `Category: ${data.category}`,
			});

			await interaction.editReply({
				embeds: [jokeEmbed],
			});
		} catch (error) {
			log.error(error);

			let errorReply = `🔎 **${error.message}**`;
			let errorEmbed = embed(errorReply);

			if (error.cause) {
				errorEmbed.addFields({ name: 'Cause:', value: error.cause });
			}

			await interaction.editReply({
				embeds: [errorEmbed],
				ephemeral: true,
			});
		}
	},
};
