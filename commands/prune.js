const embed = require("../utils/embed.js");

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
			return message.channel.send({
				embeds: [embed('❣ **You need to specify a number of messages for me to delete!**')]
			});
		} else if (amount <= 1 || amount > 100) {
			return message.channel.send({
				embeds: [embed('❣ **You need to input a number between 1 and 99.**')]
			});
		}

		if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES", false)) {
			return message.channel.send({
				embeds: [embed("❣️ **I don't have permission to manage messages in this channel.**")]
			});
		}

		message.channel.bulkDelete(amount, true)
			.then(messages => {
				log.info(`${message.author.username} deleted ${messages.size - 1} messages in #${message.channel.name}, on ${message.guild.name}.`);
				message.channel.send({
					embeds: [embed(`💖 **Deleted ${messages.size - 1} message(s).** 🔥`)]
				}).then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			})
			.catch(err => {
				log.error(err);
				message.channel.send({
					embeds: [embed('💔 **There was an error trying to prune messages in this channel!**')]
				});
			});
	},
};
