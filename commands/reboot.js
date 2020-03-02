module.exports = {
	name: "reboot",
	description: "Restarts Cutiebot.",
	cooldown: 0,
	guildOnly: true,
	modOnly: true,
	execute(message) {
		message.channel.send("💞 **Shutting down.** 📴");
		setTimeout(() => {
			process.exit(1);
		}, 1000);
	}
};
