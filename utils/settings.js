const db = require('./database.js');
const settings = {};

const keyWords = {
	true: ['1','on','true'],
	false: ['0','off','false']
};

const boolParser = input => {
	if (keyWords.true.includes(input)) return 1;
	if (keyWords.false.includes(input)) return 0;
	throw `Invalid argument \`${input}\`, argument should be of type: \`bool\`.`;
};

const collectionContainsId = (collection, id) => collection.has(id);

const mutateArrayOfIds = (arrayToModify, itemArray, validIdCollection) => {
	itemArray.forEach(item => {
		const itemExistsInArray = arrayToModify.includes(item);
		if (!itemExistsInArray) {
			if (collectionContainsId(validIdCollection, item)) {
				// valid id supplied, add item into arrayToModify
				arrayToModify.push(item);
			} else {
				// invalid id supplied, throw err
				throw `Could not find \`${item}\` on this server.`;
			}
		} else {
			// item does exist, remove it
			let index = arrayToModify.indexOf(item);
			arrayToModify.splice(index, 1);
		}
	});
};

const roleListHandler = (guildId, input, settingName, validIdCollection) => {
	const roles = (settings[guildId][settingName] || '').slice();
	mutateArrayOfIds(roles, input, validIdCollection);
	if (roles.length === 0) return null;
	return roles;
};

// settings validators
const validSettings = {
	'role_blacklist': (guild, input) => roleListHandler(guild.id, input, 'role_blacklist', guild.roles.cache),
	'mod_role': (guild, input) => roleListHandler(guild.id, input, 'mod_role', guild.roles.cache),
	'role_cmds': (guild, [input]) => boolParser(input),
	'welcome_msgs': (guild, [input]) => boolParser(input),
	'welcome_channel_id': (guild, [input]) => {
		collectionContainsId(guild.channels.cache, input);
		return input;
	},
};

// settings helpers
const generateParameterString = len => {
	const questionMarkArray = new Array(len).fill('?');
	return `(${questionMarkArray})`;
};

const initFunction = currentGuilds => {
	// fetch Guilds in db
	const expectedGuilds = db.prepare('SELECT guild_id FROM settings').all();
	const expectedGuildIDs = expectedGuilds.map(guildOptions => guildOptions.guild_id);

	// fetch Guilds bot is on
	const currentGuildIDs = currentGuilds.map(guild => guild.id);
	const numberOfGuilds = Math.max(expectedGuilds.length, currentGuilds.length);
	let newGuilds = 0;

	for (let i = 0; i < numberOfGuilds; i++) {
		const currentGuild = currentGuilds[i];
		if (currentGuilds.length > i) {
			if (!expectedGuildIDs.includes(currentGuild.id)) {
				log.warn(`${currentGuild.name} missing from database, adding...`);
				// add guild to database here
				newGuilds = db.prepare('INSERT INTO settings (guild_id) VALUES (?);').run(currentGuild.id);
			}
		}

		const expectedGuild = expectedGuilds[i];
		if (expectedGuilds.length > i) {
			if (!currentGuildIDs.includes(expectedGuild.guild_id)) {
				log.warn(`Extraneous guild in database with ID: ${expectedGuild.guild_id} will be removed`);
				// remove guild from database here
				db.prepare('DELETE FROM settings WHERE guild_id = ?;').run(expectedGuild.guild_id);
			}
		}
	}

	const guildOptions = db.prepare(
		`SELECT ${Object.keys(validSettings).join(',')} FROM settings WHERE guild_id IN ${generateParameterString(currentGuildIDs.length)}`
	).all(...currentGuildIDs);

	currentGuilds.forEach((guild,i) => {
		let guildOptionsParsed = {};
		Object.entries(guildOptions[i]).forEach(([key, value]) => {
			guildOptionsParsed[key] = value;

			if (key === 'mod_role' || key === 'role_blacklist') guildOptionsParsed[key] = JSON.parse(value);
		});

		settings[guild.id] = guildOptionsParsed;
	});

	let result = {
		cached: expectedGuilds.length,
		created: `${newGuilds.length !== undefined ? newGuilds.length : 0}`
	};

	return result;
};

const updateSetting = (guild, setting, valueArray) => {
	// check if supplied setting is allowed
	if (!Object.keys(validSettings).includes(setting)) throw `Setting \`${setting}\` was not found.`;

	let transformedInput;
	try {
		transformedInput = validSettings[setting](guild, valueArray);
		settings[guild.id][setting] = transformedInput;
		if (Array.isArray(transformedInput)) transformedInput = JSON.stringify(transformedInput);
		db.prepare(`UPDATE settings SET ${setting} = ? WHERE guild_id = ?`).run(transformedInput, guild.id);
		return 0;
	} catch (error) {
		return error;
	}
};

module.exports = {
	init: currentGuilds => initFunction(currentGuilds),
	getSettings: id => settings[id],
	updateSetting: updateSetting
};
