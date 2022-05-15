// otherwise deploy-commands.js throws an error
const loggerInit = require('./logger.js');
loggerInit();

const Database = require('better-sqlite3');
const fs = require('fs');

const dbFolder = process.env.DB_FOLDER || './database';
const dbFile = process.env.DB_FILE || 'cutiebot.db';
const dbFullPath = `${dbFolder}/${dbFile}`;
if (!fs.existsSync(dbFolder)) {
	fs.mkdirSync(dbFolder);
}

// attempt to open db file
let db;
try {
	db = new Database(dbFullPath, { fileMustExist: true });
} catch (error) {
	log.warn('Database file does not exist!');
	log.info('Attempting to create database file...');
	db = new Database(dbFullPath);
	db.pragma('journal_mode = WAL'); //set journaling mode
}

db.prepare(
	`CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL, 
        channel_id TEXT NOT NULL, 
        guild_id TEXT NOT NULL, 
        message TEXT NOT NULL, 
        start_time INTEGER NOT NULL, 
        end_time INTEGER NOT NULL);`
).run();

db.prepare(
	`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        mod_role TEXT,
        role_cmds INTEGER NOT NULL DEFAULT 0,
        role_blacklist TEXT,
        welcome_msgs INTEGER NOT NULL DEFAULT 0,
        welcome_channel_id TEXT);`
).run();

const tableInfo = db.pragma('table_info(settings)');

if (tableInfo.find(({ name }) => name === 'prefix')) {
	log.warn('Legacy settings table found, dropping prefix column...');
	db.prepare('ALTER TABLE settings DROP COLUMN prefix;').run();
}

module.exports = db;
