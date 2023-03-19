const { PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');

const pluraliser = (string, itemCount) => {
	if (itemCount > 1) return `${string}s`;
	return string;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Delete messages.')
		.addIntegerOption((option) =>
			option
				.setName('amount')
				.setDescription('The amount of messages to delete (1-99).')
				.setRequired(true)
		),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');

		await interaction.reply({
			embeds: [
				embed(
					`💞 **Attempting to delete ${amount} ${pluraliser(
						'message',
						amount
					)}...**`
				),
			],
			ephemeral: true,
		});

		if (
			!interaction.memberPermissions.has(
				PermissionsBitField.Flags.ManageMessages,
				true
			)
		) {
			return await interaction.editReply({
				embeds: [
					embed(
						"❣️ **You don't have permission to manage messages in this channel.**"
					),
				],
			});
		}

		if (
			!interaction.channel
				.permissionsFor(interaction.guild.members.me)
				.has(PermissionsBitField.Flags.ManageMessages, false)
		) {
			return await interaction.editReply({
				embeds: [
					embed(
						"❣️ **I don't have permission to manage messages in this channel.**"
					),
				],
			});
		}

		if (amount < 1 || amount > 99) {
			return await interaction.editReply({
				embeds: [embed('❣️ **You need to input a number between 1 and 99.**')],
			});
		}

		try {
			let messages;

			if (amount > 1) {
				messages = await interaction.channel.bulkDelete(amount, true);
			} else {
				messages = await interaction.channel.messages.fetch({ limit: 1 });
				const messageToDelete = messages.first();
				await messageToDelete.delete();
			}

			log.info(
				`${interaction.user.username} deleted ${messages.size} ${pluraliser(
					'message',
					amount
				)} in #${interaction.channel.name}, on ${interaction.guild.name}.`
			);

			await interaction.editReply({
				embeds: [
					embed(
						`💖 **Deleted ${messages.size} ${pluraliser(
							'message',
							amount
						)}.** 🔥`
					),
				],
			});
		} catch (error) {
			log.error(error);
			interaction.editReply({
				embeds: [
					embed(
						'💔 **There was an error trying to prune messages in this channel!**'
					),
				],
			});
		}
	},
};
