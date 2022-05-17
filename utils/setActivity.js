module.exports = (guild) => {
	guild.client.user.setActivity(
		`${guild.client.guilds.cache.size} server${
			guild.client.guilds.cache.size !== 1 ? 's' : ''
		}.`,
		{ type: 'WATCHING' }
	);
};
