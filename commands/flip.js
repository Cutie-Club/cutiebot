const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');
const wait = require('util').promisify(setTimeout);

const flip = () => {
	return (Math.random() >= 0.5) ? 'Heads' : 'Tails';
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flips a coin.'),
	async execute(interaction) {
		await interaction.reply({
			embeds: [embed('💞 **Flipping a coin...**')]
		});
		await wait(2000);
		await interaction.editReply({
			embeds: [embed(`💖 **${flip()}!**`)]
		});
	},
};
