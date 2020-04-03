const embed = require("../utils/embed.js");
const settings = require("../utils/settings.js");

module.exports = {
	name: 'roles',
	description: 'Lists all self-assignable roles.',
	usage: '[roles]',
	cooldown: 5,
	guildOnly: true,
	execute(message) {
		const guildSettings = settings.getSettings(message.guild.id);

		if (!guildSettings.role_cmds) {
			return message.channel.send({ embed: embed("❣ **Role commands are disabled.**") });
		}

		let roles = Array.from(message.guild.roles.cache.values());
		let assignableRoles = roles.slice();

		if (guildSettings.role_blacklist) {
			assignableRoles = assignableRoles.filter(role => !guildSettings.role_blacklist.includes(role.id));
		}

		assignableRoles = assignableRoles.filter(role => {
			if (role.name === "@everyone") return false;
			return true;
		});

		const rolesEmbed = embed("Roles are mapped with their IDs, so you can blacklist them in settings.")
			.setTitle(`💖 **Here's a list of all the assignable roles:**`);

		assignableRoles.forEach((role) => {
			rolesEmbed.addField(role.id, `**${role.name}**`);
		});

		return message.channel.send({ embed: rolesEmbed });
	}
};
