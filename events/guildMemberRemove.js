const settings = require('../utils/settings.js');
const embed = require('../utils/embed.js');

module.exports = {
	name: 'guildMemberRemove',
	execute(member) {
		log.debug(`${member.user.username} left ${member.guild.name}.`);

		let guildSettings = settings.getSettings(member.guild.id);

		if (!guildSettings.welcome_msgs) return;
		if (!guildSettings.welcome_channel_id) return;

		const welcomeChannel = member.guild.channels.cache.get(
			guildSettings.welcome_channel_id
		);

		welcomeChannel.send({
			embeds: [embed(`**${member.user.username} has left the server.** 💔`)],
		});
	},
};
