require('dotenv').config();
const loggerInit = require('./utils/logger.js');
loggerInit();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const commands = [];
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		if (process.env.NODE_ENV == 'production') {
			log.info('Refreshing global commands.');
			await rest.put(Routes.applicationCommands(clientId), {
				body: commands,
			});
		} else {
			log.info('Refreshing guild commands.');
			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: commands,
			});
		}

		log.info(
			`Successfully reloaded ${
				process.env.NODE_ENV == 'production' ? 'global' : 'guild'
			} commands.`
		);
	} catch (error) {
		console.error(error);
	}
})();
