const embed = require("../utils/embed.js");

module.exports = {
	name: "reboot",
	description: "Restarts Cutiebot.",
	cooldown: 0,
	guildOnly: false,
	modOnly: true,
	execute(message) {
		// return silently if not Sierra#0001
		if (message.author.id !== "190917462265430016") return;
		
		message.channel.send({
			embed: embed("💞 **Shutting down.** 📴")
		}).then(() => {
			log.warn(`Rebooted via command at ${new Date().toUTCString()}`);
			process.exit();
		});
	}
};
