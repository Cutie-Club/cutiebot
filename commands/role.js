const { roleBlacklist } = require('../config.json');

module.exports = {
	name: 'role',
	description: 'Adds (or removes) a role from a user.',
	aliases: ['roles'],
	usage: '[role name]',
	cooldown: 5,
	guildOnly: true,
	execute(message, args) {
		let userInput = args.join(" ");
		let chosenRole;

		for (let role of message.guild.roles.values()) {
			if (userInput.toLowerCase() === role.name.toLowerCase()) {
				chosenRole = role;
			}
		};

		if (!userInput) {
			return message.channel.send("❣ **You have to specify a role!**");
		}

		if (!chosenRole) {
			return message.channel.send("❣ **I can't find that role. Did you type it correctly?**");
		}

		if (roleBlacklist.includes(chosenRole.name)) {
			return message.channel.send("💔 **That role isn't self-assignable.**");
		}

		if (message.member.roles.has(chosenRole.id)) {
			message.member.removeRole(chosenRole)
				.then(
					message.channel.send(`💖 \`${chosenRole.name}\` **role removed.**`)
				);
		} else {
			message.member.addRole(chosenRole)
				.then(
					message.channel.send(`💖 \`${chosenRole.name}\` **role added.**`)
				);
		}
	},
};
