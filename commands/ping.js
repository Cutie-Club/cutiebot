const embed = require("../utils/embed.js");

module.exports = {
	name: "ping",
	description: "Shows round trip latency",
	cooldown: 5,
	guildOnly: false,
	execute(message) {
		message.channel.send({
			embed: embed(`**💖 Ping!**`).addFields(
				{ name: `Bot Latency`, value: `\`${Date.now() - message.createdTimestamp}ms\`` },
				{ name: `API Latency`, value: `\`${message.client.ws.ping}ms\`` }
			)
		});
	}
};
