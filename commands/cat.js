const { getRequest } = require("../utils/webRequest.js");
// const embed = require("../utils/embed.js");
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "cat",
	description: "Cat as a service",
	cooldown: 15,
	guildOnly: false,
	execute(message, args) {
		let tags = '';

		if (args.length > 0) {
			tags = `/${args[0]}?json=true`;
		} else {
			tags = `?json=true`;
		}
		
		const catEmbed = new MessageEmbed().setDescription(`😻 **Here's your cat!**`);

		getRequest(`https://cataas.com/cat${tags}`)
			.then((data) => {
				catEmbed.setImage(`https://cataas.com${data.url}`);
				message.channel.send({
					embeds: [catEmbed]
				});
			})
			.catch((err) => {
				message.channel.send(JSON.stringify(err.message));
			});
	}
};