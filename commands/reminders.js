const Discord = require("discord.js");
const ms = require('ms');
const reminders = require("../utils/reminders.js");

module.exports = {
	name: "reminders",
	description: "Shows all reminders. Optionally, clears reminders.",
	aliases: [],
	usage: '<clear> [id]',
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor("#36393f");
		// select all from reminders
		// const reminders = db.prepare("SELECT * from reminders WHERE user_id = (?)").all(message.author.id);
		const userReminders = reminders.getReminders(message.author.id);

		let guildID = "dm";
		if (message.channel.type !== "dm") guildID = message.guild.id;

		if (args[0] === "clear") {
			if (args.length === 2) {
				const result = reminders.killReminder(args[1], message.author.id);
				if (!result) embed.setDescription(
					`❣️ **${message.author.username}**, ${args[1]} could not be cleared. ⏰`
				);
				embed.setDescription(`💞 **${message.author.username}**, I cleared reminder **${args[1]}**. ⏰`);
				return message.channel.send({ embed: embed });
			}

			userReminders.forEach(({ id }) => {
				let result = reminders.killReminder(id, message.author.id);
				if (!result) embed.addField(`**Reminder ${id}**`, `Could not be cleared.`);
			});
			
			embed.setDescription(`💖 **${message.author.username}**, I cleared all your upcoming reminders. ⏰`);
			return message.channel.send({ embed: embed });
		}

		console.log(userReminders);

		let validReminders = userReminders.filter(reminder => {
			if (reminder.guild_id === guildID) return true;
			return false;
		});

		console.log(validReminders);

		if (validReminders.length) {
			embed.setDescription(`💞 **${message.author.username}**, here are your upcoming reminders: ⏰`);
			validReminders.forEach(reminder => {
				const duration = ms(reminder.end_time - Date.now(), { long: true });
				embed.addField(`Reminder ${reminder.id}, in ${duration}`, reminder.message);
			});
		} else {
			embed.setDescription(`💖 **${message.author.username}**, you don't have any upcoming reminders! ⏰`);
		}

		// tell user about their reminders
		message.channel.send({ embed: embed });
	}
};
