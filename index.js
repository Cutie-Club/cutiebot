const fs = require("fs");
const db = require("better-sqlite3")("./database/cutiebot.db");
const Discord = require("discord.js");
const { prefix, token, modRole } = require("./config.json");

// setup command handler
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs
	.readdirSync("./commands")
	.filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

process.on("unhandledRejection", error =>
	console.error("Uncaught Promise Rejection", error)
);

// on ready
client.once("ready", () => {
	console.log(`Started at ${new Date().toUTCString()}`);
	// check for db file
	const tableResult = db.prepare("SELECT count(*) from sqlite_master WHERE type='table' AND name = 'reminders';").get();

	if (!tableResult['count(*)']) {
		db.prepare(
			"CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, channel_id TEXT NOT NULL, message TEXT NOT NULL, start_time INTEGER NOT NULL, end_time INTEGER NOT NULL);"
		).run();
		// prep db
		db.pragma("journal_mode = WAL");
	}

	global.reminderObj = {};

	// select all from reminders
	const reminders = db.prepare("SELECT * from reminders").all();
	const currentTime = Date.now();
	reminders.forEach(async (reminder) => {
		const userToRemind = await client.users.fetch(reminder.user_id, true);
		const channelToPost = await client.channels.fetch(reminder.channel_id, true);
		const timeToRun = reminder.end_time - currentTime;
		const removeReminder = db.prepare("DELETE FROM reminders WHERE id = (?)");

		const onCompletion = () => {
			channelToPost.send(`💖 **${userToRemind.toString()}, here's your reminder: ${reminder.message}.**`, { disableMentions: "everyone" });
			removeReminder.run(reminder.id);
		}

		if (timeToRun <= 0) {
			onCompletion();
		} else {
			let timeoutID = setTimeout(onCompletion, timeToRun);
			reminderObj[reminder.id] = timeoutID;
		}
	});

});

// when a user joins
client.on("guildMemberAdd", member => {
	const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === "general");
	if (!welcomeChannel) return;
	welcomeChannel.send(
		`**${member.user.username} has joined the server. Henlo new fren!** 👋🏻`
	);
});

// when a user leaves
client.on("guildMemberRemove", member => {
	const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === "general");
	if (!welcomeChannel) return;
	welcomeChannel.send(`**${member.user.username} has left the server.** 💔`);
});

// message handler
client.on("message", message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
    client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== "text") {
		return message.channel.send(
			"💔 **We can't do that here. Try it on the server instead!**"
		);
	}

	if (command.modOnly && !message.member.roles.cache.has(modRole)) {
		return message.channel.send(
			"❣ **That command is restricted to moderators.**"
		)
	}

	if (command.args && !args.length) {
		let reply = `❣ **This command needs some arguments.**`;
		if (command.usage) {
			reply += `\nTo use it, type: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	const cooldowns = new Discord.Collection();

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.delete({
				timeout: 0,
				reason: "Command called during cooldown. Deleted to prevent spam."
			}).then(() => {
				message.channel.send(`❣ **Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.**`)
					.then(msg => {
						msg.delete({
							timeout: 3000,
							reason: "Cooldown warning deleted."
						});
					});
			});
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.channel.send(
			"💔 **I couldn't execute that command. Maybe ask for help?**"
		);
	}
});

client.login(token);
