module.exports = {
	name: 'say',
	description: 'Says anything you want in a channel of your choice!',
	usage: '[#channel][message]',
	cooldown: 0,
	guildOnly: true,
	execute(message, args) {
		const chanId = message.mentions.channels.first();
	  let thingToSay;

	  if (!args[0]) {
			return message.channel.send("❣ **You need to tell me what to say!**");
	  }

		if (!chanId) {
			message.delete();
			thingToSay = args.join(" ");
			message.channel.send(thingToSay);
	  } else {
	    thingToSay = args.slice(1).join(" ");
	    chanId.send(thingToSay);
	    message.channel.send("💖 **Message sent.**");
	  }

	},
};
