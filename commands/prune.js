module.exports = {
	name: 'prune',
	description: 'Prune up to 99 messages.',
	aliases: ['purge', 'delete', 'burn', 'clear', 'cls'],
	usage: '[number]',
	cooldown: 0,
	guildOnly: true,
	modOnly: true,
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.channel.send('❣ **You need to specify a number of messages for me to delete!**');
		} else if (amount <= 1 || amount > 100) {
			return message.channel.send('❣ **You need to input a number between 1 and 99.**');
		}

		message.channel.bulkDelete(amount, true)
			.then(messages => {
				log.info(`${message.author.username} deleted ${messages.size} messages in #${message.channel.name}, on ${message.guild.name}.`);
				message.channel.send(`💖 **Deleted ${messages.size} message(s).** 🔥`).then(msg => {
					msg.delete({
						timeout: 5000,
						reason: "Prune command invoked."
					});
				});
			})
			.catch(err => {
				log.error(err);
				message.channel.send('💔 **There was an error trying to prune messages in this channel!**');
			});
	},
};
