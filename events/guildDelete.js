const db = require("../utils/database.js");
const settings = require("../utils/settings.js");

module.exports = (client, guild) => {
	log.info(`Left ${guild.name}`);

	db.prepare("DELETE FROM settings WHERE guild_id = (?);").run(guild.id);

	
	const currentGuilds = Array.from(client.guilds.cache.values());
	settings.init(currentGuilds);

	log.info(`Removed settings for ${guild.name}`);

	client.user.setActivity(`${client.guilds.cache.size} server${client.guilds.cache.size !== 1 ? "s" : ""}.`, { type: "WATCHING" })
		.then(activity => log.info(`Set activity to ${activity.activities[0].type} ${activity.activities[0].name}`))
		.catch(log.error);
};