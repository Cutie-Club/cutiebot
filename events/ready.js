const Discord = require("discord.js");
const db = require("better-sqlite3")("./database/cutiebot.db");

module.exports = client => {
	// check for db file
	const tableResult = db.prepare("SELECT count(*) from sqlite_master WHERE type='table' AND name = 'reminders';").get();
	if (!tableResult['count(*)']) {
		db.prepare(
			"CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, channel_id TEXT NOT NULL, guild_id TEXT NOT NULL, message TEXT NOT NULL, start_time INTEGER NOT NULL, end_time INTEGER NOT NULL);"
		).run();
		// prep db
		db.pragma("journal_mode = WAL");
	}

	log.time("completed");
	log.info(`Started at ${new Date().toUTCString()}`);
	log.timeBetween("startup", "completed");

	// set up pending reminders
	global.reminderObj = {};
	const reminders = db.prepare("SELECT * from reminders").all();
	const currentTime = Date.now();
	reminders.forEach(async (reminder) => {
		const userToRemind = await client.users.fetch(reminder.user_id);
		const channelToPost = await client.channels.fetch(reminder.channel_id);
		const timeToRun = reminder.end_time - currentTime;
		const removeReminder = db.prepare("DELETE FROM reminders WHERE id = (?)");
		const reminderEmbed = new Discord.MessageEmbed()
			.setColor("#36393f")
			.setDescription(`⏰ ${reminder.message}`);

		const onCompletion = () => {
			channelToPost.send(`💖 **${userToRemind.toString()}**, here's your reminder:`, { embed: reminderEmbed });
			removeReminder.run(reminder.id);
		};

		if (timeToRun <= 0) {
			onCompletion();
		} else {
			let timeoutID = setTimeout(onCompletion, timeToRun);
			reminderObj[reminder.id] = timeoutID;
			log.info(`Set up ${reminders.length} reminder from database.`);
		}
	});
};
