const { auth } = require('./config.js');
const { readdirSync } = require('node:fs');
const { Client } = require('discord-rpc');
const client = new Client({
	transport: 'ipc'
});

function loadEvents(path = './src/events') {
	const categories = readdirSync(path);

	for (const category of categories) {
		const events = readdirSync(`${path}/${category}`);

		for (const event of events) {
			const evt = require(`${path}/${category}/${event}`);

			if (event.once) {
				client.once(evt.name, (...args) => evt.execute(client, ...args));
			} else {
				client.on(evt.name, (...args) => evt.execute(client, ...args));
			};
		};
	};
};

loadEvents();

client.configVerificator = require('./src/utils/configVerificator.js');

client.configVerificator.init(client);

client.login({
	clientId: auth.discord.clientID
}).catch(error => {
	if (error.message === 'RPC_CONNECTION_TIMEOUT') {
		console.error(`[DISCORD] An error has occurred.\n➜ ERROR: ${error}`);

		process.exit();
	};
});