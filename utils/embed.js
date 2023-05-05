const { EmbedBuilder } = require('discord.js');

module.exports = (text) => {
	let embed = new EmbedBuilder().setColor('#36393f').setDescription(text);
	return embed;
};
