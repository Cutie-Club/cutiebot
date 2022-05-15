const db = require('../utils/database.js');
const setActivity = require('../utils/setActivity.js');
const settings = require('../utils/settings.js');

module.exports = {
	name: 'guildDelete',
	execute(guild) {
		log.info(`Left ${guild.name}`);

		db.prepare('DELETE FROM settings WHERE guild_id = (?);').run(guild.id);

		const currentGuilds = Array.from(guild.client.guilds.cache.values());
		settings.init(currentGuilds);

		log.info(`Removed settings for ${guild.name}`);

		setActivity(guild);
	},
};
