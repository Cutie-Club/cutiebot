const settings = require("../utils/settings.js");

module.exports = (client, member) => {
	let guildSettings = settings.getSettings(member.guild.id);

	if (!guildSettings.welcome_msgs) return;
	if (!guildSettings.welcome_channel_id) return;

	const welcomeChannel = member.guild.channels.cache.get(guildSettings.welcome_channel_id);

	welcomeChannel.send(
		`**${member.user.username} has left the server.** 💔`
	);
};
