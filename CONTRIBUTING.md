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

When giving the user feedback on the state of a running command, you should include the state at any given time, before any text. For example; in `flip.js`, an initial pending state is given whilst the coin is "flipped", before a success state is returned after the `setTimeout` is executed.

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
