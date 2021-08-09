const db = require("../utils/database.js");
const embed = require("../utils/embed.js");

const reminderObject = {};

const createReminder = db.prepare(`
  INSERT INTO reminders (
    user_id,
    channel_id,
    guild_id,
    message,
    start_time,
		end_time
	) VALUES (?, ?, ?, ?, ?, ?)`
);

const removeReminder = db.prepare("DELETE FROM reminders WHERE id = (?)");
const removeUserReminder = db.prepare("DELETE FROM reminders WHERE id = (?) AND user_id = (?)");

const messageFunction = (channel, user, content) => channel.send({
	content: `💖 **${user.toString()}, here's your reminder:**`,
	embeds: [embed(`⏰ ${content}`)]
});
    
module.exports = {
	getReminders: userID => {
		if (!userID) return db.prepare("SELECT * from reminders").all();
		return db.prepare("SELECT * from reminders WHERE user_id = (?)").all(userID);
	},
	registerReminder: (user, channel, guild, content, duration, id) => {
		if (duration <= 0) {
			if (id !== undefined) removeReminder.run(id);
			return messageFunction(channel, user, content);
		}
    
		let reminderID = id;
		if (reminderID === undefined) {
			// if no id is supplied add to database in turn generating one
			let guildID = "DM";
			if (channel.type !== "DM") guildID = guild.id;
			const startTime = Date.now();
			const endTime = startTime + duration;
			reminderID = createReminder.run(user.id, channel.id, guildID, content, startTime, endTime).lastInsertRowid;
		}
    
		const timeoutID = setTimeout(() => {
			messageFunction(channel, user, content);
			removeReminder.run(reminderID);
		}, duration);
    
		reminderObject[reminderID] = timeoutID;
	},
  
	killReminder: (id, userID) => {
		const deleteResult = removeUserReminder.run(id, userID);
		clearTimeout(reminderObject[id]);
		delete reminderObject[id];
		return Boolean (deleteResult.changes);
	}
};