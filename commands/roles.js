const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');
const settings = require('../utils/settings.js');

const viewRoles = async (interaction, guildSettings) => {
	const rolesEmbed = embed('').setTitle(
		"💖 **Here's a list of all the assignable roles:**"
	);

	const roles = Array.from(interaction.guild.roles.cache.values());
	const assignableRoles = roles.filter((role) =>
		isAssignableRole(role, guildSettings)
	);

	rolesEmbed.addField(
		`Roles in ${interaction.guild.name}:`,
		assignableRoles.join('\n')
	);

	const unmanagedUserRoles = Array.from(
		interaction.member.roles.cache.values()
	).filter((role) => !isManagedRole(role));

	if (unmanagedUserRoles.length) {
		rolesEmbed.addField('Your roles:', `${cleanedUserRoles.join(', ')}`);
	} else {
		rolesEmbed.addField("You don't have any assigned roles.");
	}

	await interaction.editReply({ embeds: [rolesEmbed] });
};

const addRole = async (interaction, guildSettings) => {
	const roleProvided = interaction.options.getRole('role');

	if (!roleProvided) {
		return interaction.editReply({
			embeds: [
				embed("❣️ **I can't find that role. Did you type it correctly?**"),
			],
		});
	}

	if (!isAssignableRole(roleProvided, guildSettings)) {
		return interaction.editReply({
			embeds: [embed("💔 **You can't add that role.**")],
		});
	}

	if (memberHasRole(interaction.member, roleProvided)) {
		return interaction.editReply({
			embeds: [embed('❣️ **You already have that role.**')],
		});
	}

	await interaction.member.roles
		.add(roleProvided)
		.then(() => {
			interaction.editReply({
				embeds: [embed(`💖 \`${roleProvided.name}\` **role added.**`)],
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

const removeRole = async (interaction, guildSettings) => {
	const roleProvided = interaction.options.getRole('role');

	if (!memberHasRole(interaction.member, roleProvided)) {
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

const memberHasRole = (member, role) =>
	member.roles.cache.some((memberRole) => memberRole.id === role.id);

const isAssignableRole = (role, guildSettings) => {
	if (isManagedRole(role)) return false;
	if (
		guildSettings.role_blacklist &&
		guildSettings.role_blacklist.includes(role.id)
	)
		return false;
	return true;
};

const isManagedRole = (role) => role.name === '@everyone' || role.managed;

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

		switch (interaction.options.getSubcommand()) {
			case 'view':
				viewRoles(interaction, guildSettings);
				break;

			case 'add':
				addRole(interaction, guildSettings);
				break;

			case 'remove':
				removeRole(interaction, guildSettings);
				break;
		}
	},
};
