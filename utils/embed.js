const { MessageEmbed } = require('discord.js');

module.exports = (text) => {
	let embed = new MessageEmbed().setColor('#36393f').setDescription(text);
	return embed;
};
