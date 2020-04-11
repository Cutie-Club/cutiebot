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
			if (role.managed) return false;
			return true;
		});

		const rolesEmbed = embed(`You can assign or remove these roles with the \`${guildSettings.prefix}role\` command.`)
			.setTitle(`💖 **Here's a list of all the assignable roles:**`);

		let roleList = [];
		assignableRoles.forEach((role) => {
			roleList.push(`**${role.name}** \u2013 ${role.id}`);
		});

		rolesEmbed.addField(`Roles in ${message.guild.name}:`, roleList.join(`\n`));

		let userRoles = Array.from(message.member.roles.cache.values());
		let cleanedUserRoles = userRoles.filter(role => {
			if (role.name === "@everyone") return false;
			return true;
		});

		if (cleanedUserRoles.length) {
			rolesEmbed.addField(`Your roles:`, `${cleanedUserRoles.join(", ")}`);
		} else {
			rolesEmbed.addField(`Your roles:`, "You don't have any assigned roles.");
		}
		

		return message.channel.send({ embed: rolesEmbed });
	}
};
