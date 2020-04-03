const Discord = require("discord.js");

module.exports = text => {
	let embed = new Discord.MessageEmbed().setColor("#36393f").setDescription(text);
	return embed;
};