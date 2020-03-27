module.exports = member => {
	const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === "general");
	if (!welcomeChannel) return;
	welcomeChannel.send(`**${member.user.username} has left the server.** 💔`);
};
