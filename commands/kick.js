module.exports = {
	name: "kick",
	description: "Kicks a naughty user.",
	aliases: ["boot", "begone"],
	usage: "[@user]",
	cooldown: 0,
	guildOnly: true,
	execute(message) {
		const taggedUser = message.mentions.users.first();

		if (!message.member.roles.some(role => role.name === "Admin")) {
			return message.channel.send("❣ **You can't use that command.**");
		}

		if (!message.mentions.users.size) {
			return message.channel.send(
				"❣ **You need to mention a user in order to kick them!**"
			);
		}

		if (!message.guild.member(taggedUser).kickable) {
			return message.channel.send("💔 **I can't kick this user.**");
		}

		message.guild
			.member(taggedUser)
			.kick()
			.catch(err => {
				console.error(err);
				message.channel.send(
					"💔 **There was an error trying to kick that user!**"
				);
			});

		message.channel.send("💖 **Kicked.** 👟");
	}
};
