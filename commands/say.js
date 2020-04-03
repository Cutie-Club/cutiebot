const embed = require("../utils/embed.js");

module.exports = {
	name: "say",
	description: "Says anything you want in a channel of your choice!",
	usage: "[#channel][message]",
	cooldown: 0,
	guildOnly: true,
	modOnly: true,
	execute(message, args) {
		const channelID = message.mentions.channels.first();
		let thingToSay;

		if (!args[0]) {
			return message.channel.send({
				embed: embed("❣ **You need to tell me what to say!**")
			});
		}

		if (!channelID) {
			thingToSay = args.join(" ");
			message.delete().then(() => message.channel.send(thingToSay));
		} else {
			thingToSay = args.slice(1).join(" ");
			let perms = channelID.permissionsFor(message.guild.me).has("SEND_MESSAGES", false);

			if (!perms) {
				return message.channel.send({
					embed: embed("💔 **I can't send a message in that channel.**")
				});
			} else {
				channelID.send(thingToSay).then(() => {
					message.channel.send({
						embed: embed("💖 **Message sent.**")
					});
				});
			}
		}
	}
};
