module.exports = {
	name: "ban",
	description: "Bans a very naughty user.",
	usage: "[@user]",
	cooldown: 0,
	guildOnly: true,
	modOnly: true,
	execute(message) {
		const taggedUser = message.mentions.users.first();

		if (!message.member.roles.some(role => role.name === "Admin")) {
			return message.channel.send("❣ **You can't use that command.**");
		}

		if (!message.mentions.users.size) {
			return message.channel.send(
				"❣ **You need to mention a user in order to ban them!**"
			);
		}

		if (!message.guild.member(taggedUser).banable) {
			return message.channel.send("💔 **I can't ban this user.**");
		}

		message.guild
			.member(taggedUser)
			.ban()
			.catch(err => {
				console.error(err);
				message.channel.send(
					"💔 **There was an error trying to ban that user!**"
				);
			});

		message.channel.send("💖 **Banned.** 🔨");
	}
};
