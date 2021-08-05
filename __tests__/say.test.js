const say = require("../commands/say.js");
const embed = require("../utils/embed.js");

function logMessage(string, user) {
	let minute = new Date().getMinutes().toString();
	if (minute.length === 1) {
		minute = `0${minute}`;
	}
	console.log(
		`${user.username} [Today at ${new Date().getHours()}:${minute}] ${string}`
	);
}

const fakeChannel = {
	send: jest.fn(message => {
		return new Promise(resolve => {
			logMessage(message, { username: "Cutiebot" });
			resolve();
		});
	}),
	permissionsFor: jest.fn(() => {
		return {
			has: jest.fn(() => {
				 return true;
			})
		};
	})
};

const fakeArgs = ["how", "do", "i", "make", "the", "bot", "work"];
const fakeMessage = {
	guild: {
		me: undefined
	},
	mentions: {
		everyone: false,
		channels: {
			first: jest.fn(() => undefined)
		}
	},
	channel: fakeChannel,
	delete: jest.fn(() => {
		return new Promise(resolve => {
	    console.log("Deleted a message!");
			resolve();
		});
	})
};

afterEach(() => {
	jest.clearAllMocks();
});

describe("!say command executes correctly", () => {
	test("When not provided a channel argument, deletes the users command message", async () => {
		await say.execute(fakeMessage, fakeArgs);
		expect(fakeMessage.delete).toHaveBeenCalled();
	});

	test("!say command echos back user input", async () => {
		await say.execute(fakeMessage, fakeArgs);
		expect(fakeMessage.channel.send).toHaveBeenCalledWith(
			"how do i make the bot work"
		);
	});

	test("If user input is not provided, the bot informs the user", () => {
		say.execute(fakeMessage, []);
		expect(fakeMessage.channel.send).toHaveBeenCalledWith({
			embeds: [embed("❣ **You need to tell me what to say!**")]
		});
	});

	test("If a channel is mentioned, the bot sends the message to that channel", async () => {
		const fakeMessageClone = fakeMessage;
		const fakeArgsClone = ["#channel", ...fakeArgs];
		fakeMessageClone.mentions.channels.first = jest.fn(() => fakeChannel);
		await say.execute(fakeMessageClone, fakeArgsClone);

		expect(fakeMessage.mentions.channels.first().send).toHaveBeenCalledWith("how do i make the bot work");
		expect(fakeMessage.channel.send).toHaveBeenCalledWith({
			embeds: [embed("💖 **Message sent.**")]
		});
	});

	test("If the bot lacks permissions to send the message, the bot informs the user", async () => {
		const fakeMessageClone = fakeMessage;
		const fakeArgsClone = ["#channelICantPostIn", ...fakeArgs];
		const fakeChannelBanned = fakeChannel;
		fakeChannelBanned.permissionsFor = jest.fn(() => {
			return {
				has: jest.fn(() => {
					 return false;
				})
			};});

		fakeMessageClone.mentions.channels.first = jest.fn(() => fakeChannelBanned);

		await say.execute(fakeMessageClone, fakeArgsClone);
		expect(fakeMessageClone.channel.send).toHaveBeenCalledWith({
			embeds: [embed("💔 **I can't send a message in that channel.**")]
		});
	});
});
