const settings = require("../utils/settings.js");
const embed = require("../utils/embed.js");

const rolesFormatter = (roles, message) => roles.map(id => {
	const role = message.guild.roles.cache.get(id);
	return `${role.name} (${role.id})`;
}).join('\n');

const transformations = {
	"role_cmds": value => Boolean(value),
	"welcome_msgs": value => Boolean(value),
	"role_blacklist": rolesFormatter,
	"mod_role": rolesFormatter,
	"welcome_channel_id": (id, message) => `#${message.guild.channels.cache.get(id).name} (${id})`
};

const settingsPrettifier = {
	"prefix": "Prefix",
	"role_blacklist": "Role Blacklist",
	"mod_role": "Mod Roles",
	"role_cmds": "Enable Role Commands",
	"welcome_msgs": "Enable Welcome Messages",
	"welcome_channel_id": "Welcome Message Channel"
};

const transformer = (setting, value, message) => {
	if (Object.keys(transformations).includes(setting)) return transformations[setting](value, message);
	if (value == null || undefined) return "not set";
	return value;
};

module.exports = {
	name: "settings",
	description: "Change the bot settings for your server.",
	aliases: ["setting", "config"],
	usage: '<setting> <option>',
	cooldown: 10,
	guildOnly: true,
	modOnly: true,
	execute(message, args) {
		let settingsEmbed = embed("❣ Roles and channels are stored by their ID; you must use IDs when modifying these settings.")
			.setTitle(`⚙️ Settings for ${message.guild.name}`)
			.setThumbnail(message.guild.iconURL());

		let guildSettings = settings.getSettings(message.guild.id);
		
		if (args.length === 0) {
			let settingArray = Object.entries(guildSettings);
			settingArray.forEach(([settingName, settingValue]) => {
				settingsEmbed.addField(`**${settingsPrettifier[settingName]}** (${settingName})`, `\`\`\`js\n${transformer(settingName,settingValue,message)}\`\`\``);
			});
			return message.channel.send({ embed: settingsEmbed });
		}

		if (args.length >= 1) { // setting supplied
			const setting = args[0];
			if (!Object.keys(guildSettings).includes(setting)) {
				return message.channel.send({
					embed: embed("❣ That setting is not configurable, or doesn't exist.")
				});
			}

			if (args.length >= 2) { // value supplied
				const value = args.slice(1);
				const result = settings.updateSetting(message.guild.id, setting, value);
				if (result !== 0) {
					const errorEmbed = embed("❣ There was an error updating that setting.");
					errorEmbed.addField("Error:", result);
					return message.channel.send({ embed: errorEmbed });
				}
				
				guildSettings = settings.getSettings(message.guild.id);
				return message.channel.send({
					embed: embed(`💖 **Settings updated:** set ${setting} to \`${transformer(setting, guildSettings[setting])}\``)
				});
			}

			return message.channel.send({
				embed: embed(`💖 **Currently, ${setting} is \`${transformer(setting, guildSettings[setting])}\`.**`)
			});
		}
	}	
};
