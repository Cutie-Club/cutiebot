module.exports = {
	name: "flip",
	description: "Flips a coin!",
	cooldown: 5,
	guildOnly: false,
	execute(message) {
		const flip = () => {
		  return (Math.random() >= 0.5) ? 'Heads' : 'Tails';
		}
		message.channel.send(`💞 **Flipping a coin...**`)
		  .then(msg => {
		    setTimeout(() => {
		      msg.edit(`💖 **${flip()}!**`)
		    }, 2000)
			});
	}
}
