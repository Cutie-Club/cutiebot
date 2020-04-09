const embed = require("../utils/embed.js");

module.exports = {
	name: "eval",
	description: "Evaluates arbitrary JavaScript.",
	cooldown: 0,
	guildOnly: true,
	modOnly: true,
	hidden: true,
	execute(message, args) {
		// return silently if not Sierra#0001
		// due to the nature of eval
		if (message.author.id !== "190917462265430016") return;

		const data = [];
		const clean = text => {
			if (typeof text === "string") {
				return text
					.replace(/`/g, "`" + String.fromCharCode(8203))
					.replace(/@/g, "@" + String.fromCharCode(8203));
			} else {
				return text;
			}
		};

		try {
			const code = args.join(" ");
			let evaled = eval(code);
			if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
			data.push(clean(evaled), { code: "js" });

			log.debug(data);
			message.channel.send(data, {
				disableEveryone: true,
				code: "js",
				split: true
			});
		} catch (err) {
			message.channel.send({
				embed: embed(`💔 **ERROR** \`\`\`xl\n${clean(err)}\n\`\`\``)
			});
		}
	}
};
