const db = require("better-sqlite3")("./database/cutiebot.db");
const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
	name: "remind",
	description: "",
	aliases: ["reminder", "remindme"],
	usage: '<time> <reminder>',
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		const startTime = Date.now();
		let idToRemove;
		const createReminder = db.prepare("INSERT INTO reminders (user_id, channel_id, guild_id, message, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)");
		const removeReminder = db.prepare("DELETE FROM reminders WHERE id = (?)");

		let userInputTime = ms(`${args[0]} ${args[1]}`);
		let userReminder = args.slice(2).join(" ");

		if (!userInputTime) {
			userInputTime = ms(args[0]);
			userReminder = args.slice(1).join(" ");
		}

		if (!userReminder) {
			return message.channel.send("❣ **You need to tell me what to remind you about!**");
		}

		if (!userInputTime) {
			return message.channel.send("❣ **You need to specify a time for me to remind you about that.**");
		}

		const endTime = startTime + userInputTime;
		let guild_id;
		if (message.channel.type == "dm") {
			guild_id = "dm";
		} else {
			guild_id = message.guild.id;
		}

		idToRemove = createReminder.run(message.author.id, message.channel.id, guild_id, userReminder, startTime, endTime).lastInsertRowid;

		const reminderEmbed = new Discord.MessageEmbed()
			.setColor("#36393f")
			.setDescription(`⏰ ${userReminder}`)

		let timeoutID = setTimeout(() => {
			message.channel.send(`💖 **${message.author.toString()}**, here's your reminder:`, { embed: reminderEmbed });
			removeReminder.run(idToRemove);
		}, userInputTime);

		reminderObj[idToRemove] = timeoutID;

		const reminderSet = new Discord.MessageEmbed()
			.setColor("#36393f")
			.setDescription(`💞 **${message.author.username}**, I'll remind you in ${ms(userInputTime, { long:true })}: **${userReminder}**. ⏰`)

		// tell user their reminder was set
		message.channel.send({ embed: reminderSet });
	}
};
