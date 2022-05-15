const db = require('../utils/database.js');
const setActivity = require('../utils/setActivity.js');
const settings = require('../utils/settings.js');

module.exports = {
	name: 'guildCreate',
	execute(guild) {
		guild.fetchOwner().then((owner) => {
			log.info(`Joined ${guild.name}, owned by ${owner.user.username}.`);

			db.prepare('INSERT INTO settings (guild_id) VALUES (?);').run(guild.id);

			const currentGuilds = Array.from(guild.client.guilds.cache.values());
			settings.init(currentGuilds);

			log.info(`Created settings for ${guild.name}`);

			setActivity(guild);
		});
	},
};
