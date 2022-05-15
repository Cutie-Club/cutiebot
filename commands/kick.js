const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user.')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The user to kick.')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('The reason for kicking this user.')
		),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
		const user = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason');

		await interaction.reply({
			embeds: [embed(`💞 **Attempting to kick ${user}...**`)],
			ephemeral: true,
		});

		if (
			!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS, true)
		) {
			return await interaction.editReply({
				embeds: [embed("❣️ **You don't have permission to kick users.**")],
			});
		}

		if (
			!interaction.channel
				.permissionsFor(interaction.guild.me)
				.has('KICK_MEMBERS', false)
		) {
			return await interaction.editReply({
				embeds: [embed("❣️ **I don't have permission to kick users.**")],
			});
		}

		let withReason = `, with reason "${reason}".`;

		try {
			member.kick(`${reason}`);
			log.info(
				`${interaction.user.username} kicked ${user.tag}, in #${
					interaction.channel.name
				}, on ${interaction.guild.name}${reason === null ? '.' : withReason}`
			);
			interaction.editReply({
				embeds: [
					embed(`💖 **Kicked ${user}.** 👟`).addField(
						'Reason',
						reason || 'No reason provided.'
					),
				],
			});
		} catch (err) {
			log.error(err);
			interaction.editReply({
				embeds: [embed('💔 **There was an error trying to kick that user.**')],
			});
		}
	},
};
