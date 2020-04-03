const embed = require("../utils/embed.js");
const settings = require("../utils/settings.js");

module.exports = {
	name: "help",
	description: "List all of my commands or info about a specific command.",
	aliases: ["h", "halp"],
	usage: "[command name]",
	cooldown: 5,
	execute(message, args) {
		let guildSettings = {};
		if (message.channel.type !== "dm") guildSettings = settings.getSettings(message.guild.id);
		const { commands } = message.client;

		if (!args.length) {
			const helpEmbed = embed(`You can send \`!help [command name]\` to get info on a specific command!`);
			helpEmbed.setTitle("💖 **Here's a list of all my commands:**");
			
			commands
				.filter(command => !command.modOnly)
				.forEach(command => helpEmbed.addField(`**${command.name}**`, command.description || "\u200b"));

			return message.author
				.send({
					embed: helpEmbed
				}).then(() => {
					if (message.channel.type === "dm") return;
					message.channel.send({
						embed: embed("💖 **I've sent you a message with all my commands!~**")
					});
				})
				.catch(error => {
					log.error(
						`Could not send help DM to ${message.author.tag}.\n`,
						error
					);
					message.channel.send({
						embed: embed("💔 **I wish I could tell you, but I can't message you. Change that, or ask for help!**")
					});
				});
		}

		const name = args[0].toLowerCase();
		const command =
      commands.get(name) ||
      commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.channel.send({
				embed: embed("❣ **I'm sorry, I don't know that one.**")
			});
		}

		const commandEmbed = embed(`**Command:** \`${command.name}\``);
		commandEmbed.setTitle(`💖 **Cutiebot Help~**`);

		if (command.aliases) {
			commandEmbed.addField("**Aliases:**", `\`${command.aliases.join("`, `")}\``);
		}

		if (command.description) {
			commandEmbed.addField("**Description:**", `${command.description}`);
		}
		
		if (command.usage) {
			commandEmbed.addField("**Usage:**", `\`${guildSettings.prefix || "!"}${command.name}\` \`${command.usage}\``);
		}

		commandEmbed.addField("**Cooldown:**", `\`${command.cooldown || 3}\` second${command.cooldown != 1 ? "s" : ""}.`);

		message.channel.send({
			embed: commandEmbed
		});
	}
};
