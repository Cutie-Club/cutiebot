const embed = require("../utils/embed.js");

module.exports = {
	name: "flip",
	description: "Flips a coin!",
	cooldown: 5,
	guildOnly: false,
	execute(message) {
		const flip = () => {
		  return (Math.random() >= 0.5) ? 'Heads' : 'Tails';
		};

		message.channel.send({
			embeds: [embed(`💞 **Flipping a coin...**`)]
		})
		  .then(msg => {
		    setTimeout(() => {
		      msg.edit({
						embeds: [embed(`💖 **${flip()}!**`)]
					});
		    }, 2000);
			});
	}
};
