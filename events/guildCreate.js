const db = require("../utils/database.js");
const settings = require("../utils/settings.js");

module.exports = (client, guild) => {
	log.info(`Joined ${guild.name}, owned by ${guild.owner.user.username}.`);

	db.prepare("INSERT INTO settings (guild_id) VALUES (?);").run(guild.id);
	settings.init(client.guilds.cache.array());

	log.info(`Created settings for ${guild.name}`);
};