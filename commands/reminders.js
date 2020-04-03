const reminders = require("../utils/reminders.js");
const embed = require("../utils/embed.js");
const ms = require('ms');

module.exports = {
	name: "reminders",
	description: "Shows all reminders. Optionally, clears reminders.",
	aliases: [],
	usage: '<clear> [id]',
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		const userReminders = reminders.getReminders(message.author.id);

		let guildID = "dm";
		if (message.channel.type !== "dm") guildID = message.guild.id;


		let validReminders = userReminders.filter(reminder => {
			if (reminder.guild_id === guildID) return true;
			return false;
		});

		if (!validReminders.length) {
			return message.channel.send({
				embed: embed(`💖 **${message.author.username}**, you don't have any upcoming reminders! ⏰`)
			});
		}

		if (args[0] === "clear") {
			if (args.length === 2) {
				const result = reminders.killReminder(args[1], message.author.id);

				if (!result) {
					return message.channel.send({
						embed: embed(`❣️ **${message.author.username}**, ${args[1]} could not be cleared. ⏰`)
					});
				}

				return message.channel.send({
					embed: embed(`💞 **${message.author.username}**, I cleared reminder **${args[1]}**. ⏰`)
				});
			}

			const clearEmbed = embed(`💖 **${message.author.username}**, I cleared all your upcoming reminders. ⏰`);

			validReminders.forEach(({ id }) => {
				let result = reminders.killReminder(id, message.author.id);
				if (!result) clearEmbed.addField(`**Reminder ${id}**`, `Could not be cleared.`);
			});
			
			return message.channel.send({
				embed: clearEmbed
			});
		}

		if (validReminders.length) {
			const reminderEmbed = embed(`💞 **${message.author.username}**, here are your upcoming reminders: ⏰`);
			validReminders.forEach(reminder => {
				const duration = ms(reminder.end_time - Date.now(), { long: true });
				reminderEmbed.addField(`Reminder ${reminder.id}, in ${duration}`, reminder.message);
			});
			
			return message.channel.send({
				embed: reminderEmbed
			});
		}
	}
};
