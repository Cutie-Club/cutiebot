module.exports = {
	name: 'reboot',
	description: 'Shuts down the bot. If running under PM2, bot will restart automatically!',
	cooldown: 0,
	guildOnly: true,
	execute(message, args) {
		if (message.author.id !== "190917462265430016") {
			return message.channel.send('❣ **You can\'t use that command.**');
		}

		message.channel.send("💖 **Shutting down.** 📴");
  	setTimeout(() => {
			process.exit(1)
		}, 1000);
	},
};
