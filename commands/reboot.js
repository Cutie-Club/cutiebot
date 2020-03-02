module.exports = {
	name: "reboot",
	description: "Restarts Cutiebot.",
	cooldown: 0,
	guildOnly: true,
	modOnly: true,
	execute(message) {
		message.channel.send("💞 **Shutting down.** 📴")
			.then(() => {
				console.warn(`Rebooted via command at ${new Date().toUTCString()}`);
				process.exit();
			})
	}
};
