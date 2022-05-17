const settings = require('../utils/settings.js');
const reminders = require('../utils/reminders.js');
const allReminders = reminders.getReminders();

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		log.time('completed');
		log.info(
			`Logged in as ${client.user.tag}, on ${new Date().toLocaleString(
				'en-GB',
				{
					weekday: 'long',
					month: 'long',
					year: 'numeric',
					day: 'numeric',
				}
			)}.`
		);
		log.timeBetween('startup', 'completed');

		//TODO: move all this to live in settings.js and handle caching there
		const currentGuilds = Array.from(client.guilds.cache.values());
		const guildSettings = settings.init(currentGuilds);

		if (guildSettings.cached > 0) {
			log.info(
				`Loaded settings for ${guildSettings.cached} server${
					guildSettings.cached != 1 ? 's' : ''
				}.`
			);
		}

		if (guildSettings.created > 0) {
			log.info(
				`Created settings for ${guildSettings.created} server${
					guildSettings.created != 1 ? 's' : ''
				}.`
			);
		}

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

		if (allReminders.length) {
			log.info(
				`Set up ${allReminders.length} reminder${
					allReminders.size !== 1 ? 's' : ''
				} from database.`
			);
		}

		client.user.setActivity(
			`${client.guilds.cache.size} server${
				client.guilds.cache.size !== 1 ? 's' : ''
			}.`,
			{ type: 'WATCHING' }
		);
	},
};
