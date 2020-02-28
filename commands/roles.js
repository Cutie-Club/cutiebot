const { roleBlacklist } = require('../config.json');

module.exports = {
	name: 'roles',
	description: 'Lists all self-assignable roles.',
	aliases: [],
	usage: '[roles]',
	cooldown: 5,
	guildOnly: true,
	execute(message) {

		let roles = Array.from(message.guild.roles.values());
		let assignableRoles = roles
			.filter(role=>!roleBlacklist.includes(role.name))
			.map(role=>role.name).slice(1).sort();

		let assignableRoleNames = `\`${assignableRoles.join("`, `")}\``;

		return message.channel.send(`💖 **Here's a list of all the available roles, cutie:**\n${assignableRoleNames}`)

	}
};
