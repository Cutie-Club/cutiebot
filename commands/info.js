const { SlashCommandBuilder } = require('@discordjs/builders');
const embed = require('../utils/embed.js');
const ms = require('ms');
const wait = require('util').promisify(setTimeout);

const gitSha =
	process.env.GIT_SHA || '0ed46333853d1aaab845c769a88845b4fd7b9dde';
const commitMessage =
	process.env.COMMIT_MESSAGE ||
	`Remove Arm images, we no longer need these (#40)

* Remove Arm images, we no longer need these
* Remove strings that aren't needed`;

const uptime = async () => {
	if (!process.uptime) await wait(1000);
	return ms(Math.floor(process.uptime() * 1000), { long: true });
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Prints metadata.'),
	async execute(interaction) {
		await interaction.reply({
			embeds: [
				embed('🖨️ **Printing Metadata...**')
					.addField(
						'Git SHA',
						`Built from [\`${gitSha.substring(
							0,
							8
						)}\`](https://github.com/Cutie-Club/cutiebot/commit/${gitSha})`
					)
					.addField('Commit message', `\`\`\`text\n${commitMessage}\n\`\`\``)
					.addField('Uptime', `${await uptime()}`),
			],
			ephemeral: true,
		});
	},
};
