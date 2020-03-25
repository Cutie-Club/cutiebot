const db = require("better-sqlite3")("./database/cutiebot.db");
const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
	name: "reminders",
	description: "Shows all reminders. Optionally, clears reminders.",
	aliases: [],
	usage: '<clear> [id]',
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		// select all from reminders
		const reminders = db.prepare("SELECT * from reminders WHERE user_id = (?)").all(message.author.id);

		if (reminders.length <= 0) {
			return message.channel.send("💖 **You don't have any upcoming reminders.**");
		}

		if (args[0] === "clear") {
			if (args.length === 2) {
				const deleteResult = db.prepare("DELETE FROM reminders WHERE user_id = (?) AND id = (?)").run(message.author.id, args[1]);

				if (!deleteResult.changes) return message.channel.send(`❣️ **Reminder ${args[1]} could not be cleared.**`);

				clearTimeout(reminderObj[args[1]]);
				delete reminderObj[args[1]];

				return message.channel.send(`💖 **Reminder ${args[1]} cleared.**`);
			}

			reminders.forEach(({ id }) => {
				db.prepare("DELETE FROM reminders WHERE user_id = (?) AND id = (?)").run(message.author.id, id);
				
				clearTimeout(reminderObj[id]);
				delete reminderObj[id];
			});
			return message.channel.send("💖 **Reminders cleared.**");
		}

		const currentTime = Date.now();
		const embed = new Discord.MessageEmbed()
			.setColor("#36393f")
			.setDescription(`💞 **${message.author.username}**, here are your upcoming reminders: ⏰`)

		reminders.forEach(async (reminder) => {
			const timeToRun = ms(reminder.end_time - currentTime, { long: true });
			embed.addField(`ID ${reminder.id}, in ${timeToRun}`, reminder.message);
		});

		// tell user about their reminders
		message.channel.send({ embed });
	}
};
