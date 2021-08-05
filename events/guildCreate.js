const db = require("../utils/database.js");
const settings = require("../utils/settings.js");

module.exports = (client, guild) => {
	guild.members.fetch({ user: guild.ownerID }).then((owner) => {
		console.log(owner);
		log.info(`Joined ${guild.name}, owned by ${owner.user.username}.`);

		db.prepare("INSERT INTO settings (guild_id) VALUES (?);").run(guild.id);
		
		const currentGuilds = Array.from(client.guilds.cache.values());
		settings.init(currentGuilds);

		log.info(`Created settings for ${guild.name}`);

		client.user.setActivity(`${client.guilds.cache.size} server${client.guilds.cache.size !== 1 ? "s" : ""}.`, { type: "WATCHING" })
			.then(activity => log.info(`Set activity to ${activity.activities[0].type} ${activity.activities[0].name}`))
			.catch(log.error);
	});
};