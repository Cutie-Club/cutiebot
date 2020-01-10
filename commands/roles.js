const { roleBlacklist } = require('../config.json');

module.exports = {
	name: 'roles',
	description: 'Lists all self-assignable roles.',
	aliases: [],
	usage: '[roles]',
	cooldown: 5,
	guildOnly: true,
	execute(message, args) {

        let assignableRoles = message.guild.roles.values()
            .filter(role=>!roleBlacklist.includes(role.name))
            .map(role=>role.name);

        let assignableRoleNames = assignableRoles.reduce((a,b)=>`\`${a}\`, \`${b}\``);

        return message.channel.send(`💖**Here's a list of all the available roles cutie**\n${assignableRoleNames}`)

		}
	},
};
