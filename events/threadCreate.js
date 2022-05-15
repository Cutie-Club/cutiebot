module.exports = {
	name: 'threadCreate',
	async execute(thread) {
		log.debug(
			`New thread '${thread.name}' created under #${thread.parent.name}, in ${thread.guild.name}.`
		);
		if (thread.joinable) await thread.join();
	},
};
