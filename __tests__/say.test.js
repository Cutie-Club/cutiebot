const say = require("../commands/say.js");

function logMessage(string, user) {
	let minute = new Date().getMinutes().toString();
	if (minute.length === 1) {
		minute = `0${minute}`;
	}
	console.log(
		`${user.username} [Today at ${new Date().getHours()}:${minute}] ${string}`
	);
}

let fakeArgs = ["how", "do", "i", "make", "the", "bot", "work"];

let fakeMessage = {
	mentions: {
		everyone: false,
		channels: {
			first: () => undefined
		}
	},
	channel: {
		send: jest.fn(message => logMessage(message, { username: "Cutiebot" }))
	},
	delete: jest.fn(() => console.log("Deleted a message!"))
};

afterEach(() => {
	jest.clearAllMocks();
});

describe("!say command executes correctly", () => {
	test("!say command echos back user input", () => {
		say.execute(fakeMessage, fakeArgs);
		expect(fakeMessage.channel.send).toHaveBeenCalledWith(
			"how do i make the bot work"
		);
	});

	test("If user input is not provided, the bot informs the user", () => {
		say.execute(fakeMessage, []);
		expect(fakeMessage.channel.send).toHaveBeenCalledWith(
			"❣ **You need to tell me what to say!**"
		);
	});

	test("If a channel is mentioned, the bot sends the message to that channel", () => {
		let fakeMessageClone = fakeMessage;
		let fakeArgsClone = ["#channel", ...fakeArgs];
		let sendObject = {
			send: jest.fn(message => logMessage(message, { username: "Cutiebot" }))
		};
		fakeMessageClone.mentions.channels.first = () => sendObject;

		say.execute(fakeMessageClone, fakeArgsClone);
		expect(
			fakeMessageClone.mentions.channels.first().send
		).toHaveBeenCalledWith("how do i make the bot work");
		expect(fakeMessageClone.channel.send).toHaveBeenCalledWith(
			"💖 **Message sent.**"
		);
	});

	test("If the bot lacks permissions to send the message, the bot informs the user", () => {
		let fakeMessageClone = fakeMessage;
		let fakeArgsClone = ["#channelICantPostIn", ...fakeArgs];
		let sendObject = {
			send: jest.fn(() => new Promise((resolve, reject) => reject("DiscordAPIError: Missing Permissions")))
		};
		fakeMessageClone.mentions.channels.first = () => sendObject;

		say.execute(fakeMessageClone, fakeArgsClone);
		expect(fakeMessageClone.channel.send).toHaveBeenCalledWith(
			"💔 **I can't send a message in that channel.**"
		);
	});
});
