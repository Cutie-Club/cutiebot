/* eslint-disable no-console */

const chalk = require('chalk');
const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((list) => {
	// listen for measurements
	const measurement = list.getEntries()[0]; //get measurement
	const marks = measurement.name.match(/(.+)(?: to )(.+)/);
	const start = marks[1];
	const end = marks[2];
	console.log(
		`${timestamp.iso()} ${chalk.bgBlue(' TIMR ')} time between '${chalk.bold(
			start
		)}' and '${chalk.bold(end)}': ${chalk.blue.bold(
			Math.round(measurement.duration) + 'ms'
		)}`
	);
});

obs.observe({
	entryTypes: ['measure'],
	buffered: false,
});

const timestamp = {
	time: () => {
		return `[${new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		})}]`;
	},
	date: () => {
		let options = {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		};
		return `${new Date().toLocaleString('en-GB', options)}`;
	},
	iso: () => {
		return `[${new Date().toISOString()}]`;
	},
};

const presets = {
	debug: (message) =>
		console.debug(`${timestamp.iso()} ${chalk.bgCyan(' DBUG ')} ${message}`),
	error: (message) =>
		console.error(`${timestamp.iso()} ${chalk.bgRed(' ERR! ')} ${message}`),
	info: (message) =>
		console.info(`${timestamp.iso()} ${chalk.bgGreen(' INFO ')} ${message}`),
	warn: (message) =>
		console.warn(`${timestamp.iso()} ${chalk.bgYellow(' WARN ')} ${message}`),
	table: (tableArray) => {
		console.log(`${timestamp.iso()} ${chalk.bgMagenta(' TABL ')}`);
		console.table(tableArray);
		console.log('');
	},
	time: (label) => performance.mark(label),
	timeBetween: (start, end) => {
		const measurementName = `${start} to ${end}`;
		performance.measure(measurementName, start, end); // create measurement
	},
};

// disable debug logging if we're in prod
if (process.env.NODE_ENV === 'production') {
	presets.debug = () => {};
}

const init = () => (global.log = presets);
module.exports = init;
