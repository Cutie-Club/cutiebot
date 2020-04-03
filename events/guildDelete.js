const db = require("../utils/database.js");
const settings = require("../utils/settings.js");

module.exports = (client, guild) => {
	log.info(`Left ${guild.name}, owned by ${guild.owner.user.username}.`);

	db.prepare("DELETE FROM settings WHERE guild_id = (?);").run(guild.id);
	settings.init(client.guilds.cache.array());

	log.info(`Removed settings for ${guild.name}`);
};