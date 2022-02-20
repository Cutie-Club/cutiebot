const { SlashCommandBuilder } = require('@discordjs/builders');
const reminders = require('../utils/reminders.js');
const embed = require('../utils/embed.js');
const ms = require('ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Create, view, and manage reminders.')
		.addSubcommand(subcommand =>
			subcommand.setName('create')
				.setDescription('Create a reminder.')
				.addStringOption(option =>
					option.setName('reminder')
						.setDescription('What should I remind you about?')
						.setRequired(true)
				)
				.addStringOption(option =>
					option.setName('time')
						.setDescription('When should I remind you? (e.g. 5m, 1h, 2d)')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('view')
				.setDescription('View reminders.')
		)
		.addSubcommand(subcommand =>
			subcommand.setName('clear')
				.setDescription('Clear upcoming reminders.')
				.addIntegerOption(option =>
					option.setName('id')
						.setDescription('The reminder you wish to clear\'s id.'))
		),
	async execute(interaction) {
		await interaction.deferReply({
			ephemeral: true
		});

		if (interaction.options.getSubcommand() === 'create') { // create reminder
			const content = interaction.options.getString('reminder');
			const duration = ms(interaction.options.getString('time'));

			reminders.registerReminder(
				interaction.user,
				interaction.channel,
				interaction.guild,
				content,
				duration
			);

			// tell user their reminder was set
			return await interaction.editReply({
				embeds: [embed(`💞 **${interaction.user.username}**, I'll remind you in ${ms(duration, { long: true })}: **${content}**. ⏰`)]
			});
		}

		const userReminders = reminders.getReminders(interaction.user.id);

		let guildId = 'DM';
		if (interaction.channel.type !== 'DM') guildId = interaction.guild.id;

		let validReminders = userReminders.filter(reminder => {
			if (reminder.guild_id === guildId) return true;
			return false;
		});
		
		if (interaction.options.getSubcommand() === 'view') { // show reminders
			if (!validReminders.length) {
				return await interaction.editReply({
					embeds: [embed(`💖 **${interaction.user.username}**, you don't have any upcoming reminders! ⏰`)]
				});
			}

			const reminderEmbed = embed(`💞 **${interaction.user.username}**, here are your upcoming reminders: ⏰`);
			validReminders.forEach(reminder => {
				const duration = ms(reminder.end_time - Date.now(), { long: true });
				reminderEmbed.addField(`Reminder ${reminder.id}, in ${duration}`, reminder.message);
			});
			
			return await interaction.editReply({
				embeds: [reminderEmbed]
			});
		}

		// subcommand must now be 'clear'
		const reminderId = interaction.options.getInteger('id');

		if (reminderId) {
			const result = reminders.killReminder(reminderId, interaction.user.id);

			if (!result) {
				return interaction.editReply({
					embeds: [embed(`❣️ **${interaction.user.username}**, ${reminderId} could not be cleared. ⏰`)]
				});
			}

			return interaction.editReply({
				embeds: [embed(`💞 **${interaction.user.username}**, I cleared reminder **${reminderId}**. ⏰`)]
			});
		}

		const clearEmbed = embed(`💖 **${interaction.user.username}**, I cleared all your upcoming reminders. ⏰`);

		validReminders.forEach(({ id }) => {
			let result = reminders.killReminder(id, interaction.user.id);
			if (!result) clearEmbed.addField(`**Reminder ${id}**`, 'Could not be cleared.');
		});
		
		return interaction.editReply({
			embeds: [clearEmbed]
		});

	}
};
