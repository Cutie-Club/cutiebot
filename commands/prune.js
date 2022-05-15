const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');

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
			embeds: [embed(`💞 **Attempting to delete ${amount} messages...**`)],
			ephemeral: true,
		});

		if (
			!interaction.member.permissions.has(
				Permissions.FLAGS.MANAGE_MESSAGES,
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
				.permissionsFor(interaction.guild.me)
				.has('MANAGE_MESSAGES', false)
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

		if (amount > 1) {
			try {
				const messages = await interaction.channel.bulkDelete(amount, true);
				log.info(
					`${interaction.user.username} deleted ${messages.size} messages in #${interaction.channel.name}, on ${interaction.guild.name}.`
				);
				await interaction.editReply({
					embeds: [
						embed(
							`💖 **Deleted ${messages.size} message${
								messages.size === 1 ? '' : 's'
							}.** 🔥`
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
		} else {
			const messages = await interaction.channel.messages.fetch({ limit: 1 });
			const messageToDelete = messages.first();

			if (messageToDelete === undefined) {
				return interaction.editReply({
					embeds: [embed('❣️ **No message found.**')],
				});
			}

			try {
				await messageToDelete.delete();
				log.info(
					`${interaction.user.username} deleted 1 message in #${interaction.channel.name}, on ${interaction.guild.name}.`
				);
				interaction.editReply({
					embeds: [embed('💖 **Deleted 1 message.** 🔥')],
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
		}
	},
};
