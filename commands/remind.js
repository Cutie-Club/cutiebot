const ms = require('ms');
const reminders = require("../utils/reminders.js");
const embed = require("../utils/embed.js");

module.exports = {
	name: "remind",
	description: "Create reminders",
	aliases: ["reminder", "remindme"],
	usage: '<time> <reminder>',
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		let duration = ms(`${args[0]} ${args[1]}`);
		let content = args.slice(2).join(" ");

		if (!duration) {
			duration = ms(args[0]);
			content = args.slice(1).join(" ");
		}

		if (!content) {
			return message.channel.send({
				embed: embed("❣ **You need to tell me what to remind you about!**")
			});
		}

		if (!duration) {
			return message.channel.send({
				embed: embed("❣ **You need to specify a time for me to remind you about that.**")
			});
		}
		
		reminders.registerReminder(message.author, message.channel, message.guild, content, duration);

		// tell user their reminder was set
		message.channel.send({
			embed: embed(`💞 **${message.author.username}**, I'll remind you in ${ms(duration, { long: true })}: **${content}**. ⏰`)
		});
	}
};
