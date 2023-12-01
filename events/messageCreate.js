const db = require('../utils/database.js');
const arrayUtils = require('../utils/array.js');

const fetchFilters = db.prepare(
	'SELECT (filter, response, regex) WHERE guild_id = (?);'
);

module.exports = {
	name: 'messageCreate',
	execute(message) {
		const guildId = message.guildId;
		const filters = fetchFilters.run(guildId);

		const messages = filters
			.map(({ message_filter, message_response, regex }) => {
				if (regex === 1) {
					const match = message_filter.match(/\/(.*)\/(.*)/);
					const messageRegex = new RegExp(match[1], match[2]);
					if (message.content.match(messageRegex)) {
						message.content.replace(messageRegex, message_response);
					}
				} else {
					if (message.content === message_filter) return message_response;
				}
			})
			.filter((response) => response !== undefined);

		console.log(arrayUtils.randomElement(messages));
	},
};
