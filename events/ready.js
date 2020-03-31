const settings = require("../utils/settings.js");
const reminders = require("../utils/reminders.js");
const allReminders = reminders.getReminders();

module.exports = client => {
	log.time("completed");
	log.info(`Logged in as ${client.user.tag} at ${new Date().toLocaleString("en-GB", {
		weekday: "long",
		month: "long",
		year: "numeric",
		day: "numeric"
	})}`);
	log.timeBetween("startup", "completed");

	// should return a promise so we can check state, and how many settings we loaded
	// and we should also check how many settings we had to create entries for
	settings.init(client.guilds.cache.array());
	log.info(`Loaded settings for x guilds.`);

	client.user.setActivity(`${client.guilds.cache.size} server${client.guilds.cache.size !== 1 ? "s" : ""}.`, { type: "WATCHING" })
		.then(activity => log.info(`Set activity to ${activity.activities[0].type} ${activity.activities[0].name}`))
		.catch(log.error);

	// set up pending reminders
	allReminders.forEach(async (reminder) => {
		const userToRemind = await client.users.fetch(reminder.user_id);
		const channelToPost = await client.channels.fetch(reminder.channel_id);
		const duration = reminder.end_time - Date.now();
		reminders.registerReminder(
			userToRemind,
			channelToPost,
			undefined,
			reminder.message,
			duration,
			reminder.id
		);
	});

	log.info(`Set up ${allReminders.length} reminder${allReminders.size !== 1 ? "s": ""} from database.`); 
};
