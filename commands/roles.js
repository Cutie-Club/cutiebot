const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');
const settings = require('../utils/settings.js');

const addRole = async (interaction, chosenRole) => {
	if (
		interaction.member.roles.cache.some((role) => role.name === chosenRole.name)
	) {
		return interaction.editReply({
			embeds: [embed('❣️ **You already have that role.**')],
		});
	}

	await interaction.member.roles
		.add(chosenRole)
		.then(() => {
			interaction.editReply({
				embeds: [embed(`💖 \`${chosenRole.name}\` **role added.**`)],
			});
		})
		.catch(() =>
			interaction.editReply({
				embeds: [
					embed("💔 **I don't have the correct permissions to do that.**"),
				],
			})
		);
};

const removeRole = async (interaction, chosenRole) => {
	if (
		!interaction.member.roles.cache.some(
			(role) => role.name === chosenRole.name
		)
	) {
		return interaction.editReply({
			embeds: [embed("❣️ **You don't have that role.**")],
		});
	}

	await interaction.member.roles
		.remove(chosenRole)
		.then(() => {
			interaction.editReply({
				embeds: [embed(`💖 \`${chosenRole.name}\` **role removed.**`)],
			});
		})
		.catch(() =>
			interaction.editReply({
				embeds: [
					embed("💔 **I don't have the correct permissions to do that.**"),
				],
			})
		);
};

const viewRoles = async (interaction, guildSettings) => {
	const rolesEmbed = embed('').setTitle(
		"💖 **Here's a list of all the assignable roles:**"
	);

	rolesEmbed.addField(
		`Roles in ${interaction.guild.name}:`,
		assignableRoles.join('\n')
	);

	let roles = Array.from(interaction.guild.roles.cache.values());
	let assignableRoles = roles.slice();

	if (guildSettings.role_blacklist) {
		assignableRoles = assignableRoles.filter(
			(role) => !guildSettings.role_blacklist.includes(role.id)
		);
	}

	assignableRoles = assignableRoles.filter(filterManagedRoles);

	let userRoles = Array.from(interaction.member.roles.cache.values());
	let cleanedUserRoles = userRoles.filter(filterManagedRoles);

	if (cleanedUserRoles.length) {
		rolesEmbed.addField('Your roles:', `${cleanedUserRoles.join(', ')}`);
	} else {
		rolesEmbed.addField("You don't have any assigned roles.");
	}

	await interaction.editReply({ embeds: [rolesEmbed] });
};

const filterManagedRoles = (role) => {
	if (role.name === '@everyone') return false;
	if (role.managed) return false;
	return true;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('View and manage your roles.')
		.addSubcommand((subcommand) =>
			subcommand.setName('view').setDescription('View roles.')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Add a role.')
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription('Select a role to add.')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove a role.')
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription('Select a role to remove.')
						.setRequired(true)
				)
		),
	async execute(interaction) {
		await interaction.deferReply({
			ephemeral: true,
		});

		const guildSettings = settings.getSettings(interaction.guild.id);

		if (!guildSettings.role_cmds) {
			return interaction.editReply({
				embeds: [embed('❣️ **Role commands are disabled.**')],
			});
		}

		if (
			!interaction.channel
				.permissionsFor(interaction.guild.me)
				.has('MANAGE_ROLES', false)
		) {
			return interaction.editReply({
				embeds: [embed("❣️ **I don't have permission to manage roles.**")],
			});
		}

		const chosenRole = interaction.options.getRole('role');

		if (!chosenRole) {
			return interaction.editReply({
				embeds: [
					embed("❣️ **I can't find that role. Did you type it correctly?**"),
				],
			});
		}

		if (chosenRole.name === '@everyone' || chosenRole.managed) {
			return interaction.editReply({
				embeds: [embed("💔 **You can't add that role.**")],
			});
		}

		if (guildSettings.role_blacklist) {
			if (guildSettings.role_blacklist.includes(chosenRole.id)) {
				return interaction.editReply({
					embeds: [embed("💔 **That role isn't self-assignable.**")],
				});
			}
		}

		switch (interaction.options.getSubcommand()) {
			case 'view':
				viewRoles(interaction, guildSettings);
				break;

			case 'add':
				addRole(interaction, chosenRole);
				break;

			case 'remove':
				removeRole(interaction, chosenRole);
				break;
		}
	},
};
