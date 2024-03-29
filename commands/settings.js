const { PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const settings = require('../utils/settings.js');
const embed = require('../utils/embed.js');

const idResolver = (collection, id) => {
	const item = collection.get(id);
	if (item) return item.name;
	throw new Error('ID not resolvable.', id);
};

const rolesFormatter = (roles, message) =>
	roles
		.map((id) => {
			try {
				const roleName = idResolver(message.guild.roles.cache, id);
				return roleName;
			} catch (error) {
				log.error(error);
				return `ID not found (${id})`;
			}
		})
		.join('\n');

const settingsTransformer = {
	role_cmds: (value) => Boolean(value),
	welcome_msgs: (value) => Boolean(value),
	role_blacklist: rolesFormatter,
	mod_role: rolesFormatter,
	welcome_channel_id: (id, message) => {
		try {
			const channelName = idResolver(message.guild.channels.cache, id);
			return `#${channelName}`;
		} catch (error) {
			log.error(error);
			return;
		}
	},
};

const settingStringify = {
	role_blacklist: 'Role Blacklist',
	mod_role: 'Mod Roles',
	role_cmds: 'Role Commands',
	welcome_msgs: 'Welcome Messages',
	welcome_channel_id: 'Welcome Message Channel',
};

const transformer = (setting, value, message) => {
	if (value === null || value === undefined) return 'not set';
	if (Object.keys(settingsTransformer).includes(setting))
		return settingsTransformer[setting](value, message);
	return value;
};

const updateSettings = (interaction, guildSettings) => {
	const chosenSetting = interaction.options.getString('setting');
	let chosenValue = interaction.options.getString('value');

	const idExtractionRequired = [
		'role_blacklist',
		'mod_role',
		'welcome_channel_id',
	];

	const idRegex = /^<(?:@&|#)(\d+)>$/;

	if (idExtractionRequired.includes(chosenSetting)) {
		chosenValue = chosenValue.match(idRegex)[1];
	}

	const result = settings.updateSetting(interaction.guild, chosenSetting, [
		chosenValue,
	]);

	if (result !== 0) {
		const errorEmbed = embed(
			'❣️ **There was an error updating that setting.**'
		);

		errorEmbed.setFields({ name: 'Error:', value: result });

		return interaction.editReply({
			embeds: [errorEmbed],
		});
	}

	guildSettings = settings.getSettings(interaction.guild.id);

	return interaction.editReply({
		embeds: [
			embed(
				`💖 **Settings updated:** set ${
					settingStringify[chosenSetting]
				} to \`${transformer(
					chosenSetting,
					guildSettings[chosenSetting],
					interaction
				)}\``
			),
		],
	});
};

const viewSettings = (interaction, guildSettings) => {
	const settingsArray = Object.entries(guildSettings);

	const settingsEmbed = embed('')
		.setTitle(`⚙️ Settings for ${interaction.guild.name}`)
		.setThumbnail(interaction.guild.iconURL());

	settingsArray.forEach(([settingName, settingValue]) => {
		settingsEmbed.addFields({
			name: `**${settingStringify[settingName]}**`,
			// space at the end of the formatted setting
			// to prevent empty codeblock becoming a series of backticks
			value: `\`\`\`js\n${transformer(
				settingName,
				settingValue,
				interaction
			)} \`\`\``,
		});
	});

	return interaction.editReply({ embeds: [settingsEmbed] });
};

const settingChoices = Object.entries(settingStringify).map(
	([settingDatabaseName, settingName]) => ({
		name: settingName,
		value: settingDatabaseName,
	})
);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Change Cutiebot settings for your server.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setDescription('View settings for your server.')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('update')
				.setDescription('Update settings for your server.')
				.addStringOption((option) =>
					option
						.setName('setting')
						.setDescription('The setting to update.')
						.setRequired(true)
						.addChoices(...settingChoices)
				)
				.addStringOption((option) =>
					option
						.setName('value')
						.setDescription('The value to set.')
						.setRequired(true)
				)
		),
	async execute(interaction) {
		await interaction.deferReply({
			ephemeral: true,
		});

		if (
			!interaction.memberPermissions.has(
				PermissionsBitField.Flags.Administrator,
				true
			)
		) {
			return interaction.editReply({
				embeds: [embed("❣️ **You don't have permission to manage settings.**")],
			});
		}

		let guildSettings = settings.getSettings(interaction.guild.id);

		switch (interaction.options.getSubcommand()) {
			case 'view':
				viewSettings(interaction, guildSettings);
				break;

			case 'update':
				updateSettings(interaction, guildSettings);
				break;
		}
	},
};
