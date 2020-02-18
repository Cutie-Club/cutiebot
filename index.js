const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

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

const cooldowns = new Discord.Collection();

process.on("unhandledRejection", error =>
  console.error("Uncaught Promise Rejection", error)
);

// on ready
client.once("ready", () => {
  console.log("Ready!");
});

// when a user joins
client.on("guildMemberAdd", member => {
  const welcomeChannel = member.guild.channels.find(
    channel => channel.name === "general"
  );
  if (!welcomeChannel) return;
  welcomeChannel.send(
    `**${member.user.username} has joined the server. Henlo new fren!** :wave_tone1:`
  );
});

// when a user leaves
client.on("guildMemberRemove", member => {
  const welcomeChannel = member.guild.channels.find(
    channel => channel.name === "general"
  );
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
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.guildOnly && message.channel.type !== "text") {
    return message.channel.send(
      ":broken_heart: **We can't do that here. Try it on the server instead!**"
    );
  }

  if (command.args && !args.length) {
    let reply = `❣ **You didn't provide any arguments!**`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

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
      return message.channel
        .send(
          `❣ **Please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.**`
        )
        .then(msg => {
          msg.delete(5000);
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
