# Contributing

Please read the [Discord.js documentation](https://discord.js.org)! If you are not used to developer documentation, this may be daunting at first, but may have the answers you are looking for.

#### Commands

If you are writing new commands, please bear in mind the following;

1. Cutebot "writes" in **bold**. This helps to separate bot messages from user messages at a glance.

2. Cutiebot uses unicode emoji to relay the state of a command to a user. Currently, there are four states;

```
💞 pending
💖 success
💔 failure
❣️ warning
```

3. When giving the user feedback on the state of a running command, you should include the state at any given time, before any text. For example; in `flip.js`, an initial pending state is given whilst the coin is "flipped", before a success state is returned after the `setTimeout` is executed.

```js
const flip = () => {
	return (Math.random() >= 0.5) ? 'Heads' : 'Tails';
}
message.channel.send(`💞 **Flipping a coin...**`)
	.then(msg => {
		setTimeout(() => {
			msg.edit(`💖 **${flip()}!**`)
		}, 2000)
	});
```

4. Commands are loaded as modules, with properties and an `execute` function. The basic structure for a command file is as follows;

```js
// remember to require any modules you need before the export statement
module.exports = {
	name: "name",
	description: "A short description of the command",
	aliases: ["An", "array", "of", "alternative", "command", "names"],
	usage: "command-line style usage description",
	cooldown: 0, // optional, defaults to 3 seconds
	guildOnly: true, // optional, defaults to false
	modOnly: true, // optional, defaults to false
	execute(message, args) { // args required if your command needs arguments
		// command code
		// more command code
	}
}
```
