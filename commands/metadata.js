const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');
const ms = require('ms');

const gitSha = process.env.GIT_SHA;
const commitMessage = process.env.COMMIT_MESSAGE;

const uptimeString = () => {
	return ms(process.uptime() * 1000, { long: true });
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('metadata')
		.setDescription('Prints metadata.'),
	async execute(interaction) {
		await interaction.reply({
			embeds: [
				embed('🖨️ **Printing Metadata...**').addFields(
					{
						name: 'Git SHA',
						value: `Built from [\`${gitSha.substring(
							0,
							8
						)}\`](https://github.com/Cutie-Club/cutiebot/commit/${gitSha})`,
					},
					{
						name: 'Commit message',
						value: `\`\`\`text\n${commitMessage}\n\`\`\``,
					},
					{
						name: 'Uptime',
						value: uptimeString(),
					}
				),
			],
			ephemeral: true,
		});
	},
};
