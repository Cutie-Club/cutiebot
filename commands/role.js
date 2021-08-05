const embed = require("../utils/embed.js");
const settings = require("../utils/settings.js");

module.exports = {
	name: "role",
	description: "Adds (or removes) a role from a user.",
	usage: "[role name]",
	cooldown: 5,
	guildOnly: true,
	execute(message, args) {
		const guildSettings = settings.getSettings(message.guild.id);
		let reason = "Requested via command.";
		let userInput = args.join(" ");
		let chosenRole;

		if (!guildSettings.role_cmds) {
			return message.channel.send({
				embeds: [embed("❣ **Role commands are disabled.**")]
			});
		}
		
		if (!message.channel.permissionsFor(message.client.user).has("MANAGE_ROLES", false)) {
			return message.channel.send({
				embeds: [embed("❣ **I don't have permission to manage roles.**")]
			});
		}

		for (let role of message.guild.roles.cache.values()) {
			if (userInput.toLowerCase() === role.name.toLowerCase()) {
				chosenRole = role;
			}
		}
		
		if (guildSettings.role_blacklist) {
			if (guildSettings.role_blacklist.includes(chosenRole.id)) {
				return message.channel.send({ embeds: [embed("💔 **That role isn't self-assignable.**")] });
			}
		}

		if (!userInput) {
			return message.channel.send({
				embeds: [embed("❣ **You have to specify a role.**")]
			});
		}

		if (!chosenRole) {
			return message.channel.send({
				embeds: [embed("❣ **I can't find that role. Did you type it correctly?**")]
			});
		}

		const failedPermission = () => message.channel.send({
			embeds: [embed("💔 **I don't have the correct permissions to do that.**")]
		});

		if (message.member.roles.cache.has(chosenRole.id)) {
			message.member.roles
				.remove(chosenRole, reason)
				.then(() => {
					message.channel.send({
						embeds: [embed(`💖 \`${chosenRole.name}\` **role removed.**`)]
					});
				})
				.catch(failedPermission);
		} else {
			message.member.roles
				.add(chosenRole, reason)
				.then(() => {
					message.channel.send({
						embeds: [embed(`💖 \`${chosenRole.name}\` **role added.**`)]
					});
				})
				.catch(failedPermission);
		}
	}
};
