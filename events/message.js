const Discord = require("discord.js");
const settings = require("../utils/settings.js");
const embed = require("../utils/embed.js");

module.exports = (client, message) => {
	if (message.author.bot) return;

	let guildSettings;
	if (message.channel.type === "dm") {
		guildSettings = {
			prefix: "!",
			mod_role: null
		};
	} else {
		guildSettings = settings.getSettings(message.guild.id);
	}

	if (!message.content.startsWith(guildSettings.prefix)) return;

	const args = message.content.slice(guildSettings.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
    client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== "text") {
		return message.channel.send({
			embed: embed("💔 **We can't do that here. Try it on the server instead!**")
		});
	}

	if (command.modOnly) {
		let modStatus = false;

		if (guildSettings.mod_role) {
			message.member.roles.cache.each((role) => {
				if (guildSettings.mod_role.includes(role.id)) modStatus = true;
			});
		}

		if ( !(modStatus || message.member.hasPermission("ADMINISTRATOR")) ) {
			return message.channel.send({
				embed: embed("❣ **That command is restricted to moderators.**")
			});
		}
	}

	if (command.args && !args.length) {
		let reply = `❣ **This command needs some arguments.**`;
		if (command.usage) {
			reply += `\nTo use it, type: \`${guildSettings.prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send({
			embed: embed(reply)
		});
	}

	const cooldowns = new Discord.Collection();

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.delete({
				timeout: 0,
				reason: "Command called during cooldown. Deleted to prevent spam."
			}).then(() => {
				message.channel.send({
					embed: embed(`❣ **Please wait ${timeLeft.toFixed(1)} more second${timeLeft.toFixed(1) !== 1 ? "s" : ""} before reusing the \`${command.name}\` command.**`)
				})
					.then(msg => {
						msg.delete({
							timeout: 3000,
							reason: "Cooldown warning deleted."
						});
					});
			});
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	log.info(`In ${message.guild}, ${message.author.tag} used '${command.name}'.`);

	try {
		command.execute(message, args);
	} catch (error) {
		log.error(error);
		message.channel.send({
			embed: embed("💔 **I couldn't execute that command. Maybe ask for help?**")
		});
	}
};
