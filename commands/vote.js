const embed = require("../utils/embed.js");

module.exports = {
	name: "vote",
	description: "Starts a vote!",
	usage: "[topic]",
	cooldown: 180,
	guildOnly: true,
	execute(message, args) {
		if (!args[0]) {
			return message.channel.send({
				embed: embed("❣ **You have to specify a topic!**")
			});
		}

		message.channel.send({
			embed: embed(args.join(" ")).setTitle(`${message.author.username} has started a vote! 🗳`)
		}).then(msg => {
			msg.react("👍");
			msg.react("👎");
		});
	}
};