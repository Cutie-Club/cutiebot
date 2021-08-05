const embed = require("../utils/embed.js");

module.exports = {
	name: "ban",
	description: "Bans a very naughty user.",
	usage: "[@user]",
	cooldown: 0,
	guildOnly: true,
	modOnly: true,
	execute(message) {
		const user = message.mentions.members.first();

		if (!message.mentions.users.size) {
			return message.channel.send({
				embeds: [embed("❣ **You need to mention a user in order to ban them!**")]
			});
		}

		if (user) {
			const member = message.guild.member(user);
			if (!member) {
				return message.channel.send({
					embeds: [embed("❣ **I can't find that user. Are they in this server?**")]
				});
			}

			if (!member.manageable) {
				return message.channel.send({
					embeds: [embed("❣ **I don't have the correct permissions to do that.**")]
				});
			}

			member.ban({
				reason: `Banned by ${message.author.username} via command.`
			})
				.then(() => {
					message.channel.send({
						embeds: [embed(`💖 **${user.tag} was banned.** 🔨`)]
					});
				})
				.catch(err => {
					log.error(err);
					message.channel.send({
						embeds: [embed("💔 **There was an error trying to ban that user!**")]
					});
				});
		}
	}
};
