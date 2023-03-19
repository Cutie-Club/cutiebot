require('dotenv').config();

const loggerInit = require('./utils/logger.js');
loggerInit();
log.time('startup');
log.info('Starting Cutiebot!');

const {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
} = require('discord.js');
const token = process.env.DISCORD_TOKEN;

if (!token) {
	log.error(
		'Token not provided. Set the DISCORD_TOKEN environment variable and restart.'
	);
	process.exit(1);
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
	],
});

const fs = require('fs');
const chalk = require('chalk');

client.commands = new Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));
log.info(`Loading a total of ${chalk.bold(commandFiles.length)} commands.`);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
	log.debug(`Loaded ${chalk.bold(command.data.name)} command.`);
}

const eventFiles = fs
	.readdirSync('./events/')
	.filter((file) => file.endsWith('.js'));
log.info(`Loading a total of ${chalk.bold(eventFiles.length)} events.`);

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	log.debug(`Loaded ${chalk.bold(event.name)} event.`);
}

process.on('unhandledRejection', (error) => {
	log.error('Uncaught Promise Rejection');
	log.error(error);
});

client
	.on('disconnect', () => log.warn('Bot is disconnecting...'))
	.on('reconnecting', () => log.info('Bot reconnecting...'))
	.on('debug', (debug) => log.debug(debug))
	.on('error', (e) => {
		log.error(e);
		console.trace();
	})
	.on('warn', (info) => log.warn(info));

client.login(token);
