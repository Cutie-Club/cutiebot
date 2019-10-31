module.exports = {
	name: 'role',
	description: 'Adds (or removes) a role from a user.',
	aliases: ['roles'],
	usage: '[role name]',
	cooldown: 5,
	guildOnly: true,
	execute(message, args) {
		const titleCase = (str) => str.replace(/\b\S/g, t => t.toUpperCase());
  	const role = message.guild.roles.find(r => r.name === (titleCase(args.join(" ").toLowerCase())));
		var blacklist = ['Admin', 'Cutiebot', 'Nitro Booster'];

		if (!args[0]) {
			return message.channel.send("❣ **You have to specify a role!**");
		}

		if (blacklist.includes(titleCase(args[0].toLowerCase()))) {
			return message.channel.send("💔 **That role isn't self-assignable.**");
		}

		if (!role) {
			return message.channel.send("❣ **I can't find that role. Did you type it correctly?**");
		}

		if (message.member.roles.has(role.id)) {
			message.member.removeRole(role)
				.then(message.channel.send(`💖 \`${role.name}\` **role removed.**`));
		} else {
			message.member.addRole(role)
				.then(message.channel.send(`💖 \`${role.name}\` **role added.**`));
		}

	},
};
