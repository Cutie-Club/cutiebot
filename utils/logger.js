const chalk = require('chalk');
const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((list) => {
	// listen for measurements
	const measurement = list.getEntries()[0]; //get measurement
	const marks = measurement.name.match(/(.+)(?: to )(.+)/);
	const start = marks[1];
	const end = marks[2];
	console.log(
		`${timestamp.time()} ${chalk.bgBlue(' TIMR ')} time between '${chalk.bold(
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
};

const presets = {
	debug: (message) =>
		console.debug(`${timestamp.time()} ${chalk.bgCyan(' DBUG ')} ${message}`),
	error: (message) =>
		console.error(`${timestamp.time()} ${chalk.bgRed(' ERR! ')} ${message}`),
	info: (message) =>
		console.info(`${timestamp.time()} ${chalk.bgGreen(' INFO ')} ${message}`),
	warn: (message) =>
		console.warn(`${timestamp.time()} ${chalk.bgYellow(' WARN ')} ${message}`),
	table: (tableArray) => {
		console.log(`${timestamp.time()} ${chalk.bgMagenta(' TABL ')}`);
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
