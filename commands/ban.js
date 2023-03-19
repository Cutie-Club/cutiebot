const { PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user.')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The user to ban.')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('The reason for banning this user.')
		)
		.addIntegerOption((option) =>
			option
				.setName('days')
				.setDescription("Days of user's messages to delete (0-7).")
		),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
		const user = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason');
		const days = interaction.options.getInteger('days');

		await interaction.reply({
			embeds: [embed(`💞 **Attempting to ban ${user}...**`)],
			ephemeral: true,
		});

		if (
			!interaction.memberPermissions.has(
				PermissionsBitField.Flags.BanMembers,
				true
			)
		) {
			return await interaction.editReply({
				embeds: [embed("❣️ **You don't have permission to ban users.**")],
			});
		}

		if (
			!interaction.channel
				.permissionsFor(interaction.guild.members.me)
				.has('BAN_MEMBERS', false)
		) {
			return await interaction.editReply({
				embeds: [embed("❣️ **I don't have permission to ban users.**")],
			});
		}

		if (days != null && days > 7) {
			return await interaction.editReply({
				embeds: [
					embed("❣️ **I can only delete up to a week's worth of messages.**"),
				],
			});
		}

		let withReason = `, with reason "${reason}".`;

		try {
			member.ban({
				days: days || 0,
				reason: reason,
			});
			log.info(
				`${interaction.user.username} banned ${user.tag}, in #${
					interaction.channel.name
				}, on ${interaction.guild.name}${reason === null ? '.' : withReason}`
			);
			interaction.editReply({
				embeds: [
					embed(`💖 **Banned ${user}.** 🔨`).addFields(
						{
							name: 'Reason',
							value: reason || 'No reason provided.',
						},
						{
							name: 'Days of messages deleted',
							value: days || 'None.',
						}
					),
				],
			});
		} catch (err) {
			log.error(err);
			interaction.editReply({
				embeds: [embed('💔 **There was an error trying to ban that user.**')],
			});
		}
	},
};
