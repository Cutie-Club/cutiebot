const embed = require('../utils/embed');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			log.error(error);
			await interaction.reply({
				embeds: [
					embed(
						'😿 **There was an error while executing this command!**'
					).addField(
						'🐛',
						`If you could, [report this bug](https://github.com/Cutie-Club/cutiebot/issues/new/choose)! Let us know what you were doing.\n\`\`\`text\n${error}\n\`\`\``
					),
				],
				ephemeral: true,
			});
		}
	},
};
