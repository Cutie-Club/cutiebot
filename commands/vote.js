const Discord = require("discord.js");

module.exports = {
	name: "vote",
	description: "Starts a vote!",
	usage: "[topic]",
	cooldown: 180,
	guildOnly: true,
	execute(message, args) {
		if (!args[0]) {
			return message.channel.send("❣ **You have to specify a topic!**");
		}

		const embed = new Discord.MessageEmbed()
			.setColor("#FF86F1")
			.setTitle(`${message.author.username} has started a vote! 🗳`)
			.setDescription(args.join(" "));

		message.delete({
			timeout: 0,
			reason: "Vote command setup deleted."
		});
		message.channel.send({ embed }).then(msg => {
			msg.react("👍");
			msg.react("👎");
		});
	}
};
