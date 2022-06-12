const { auth, settings } = require('../../config.js')

module.exports = {
	init: () => {
		function containsNumber(string) {
			return /\d/.test(string);
		};

		if (!auth.discord.clientID) {
			console.error('[HANDLER] No client ID provided. Please provide a client ID.');

			process.exit();
		};

		if (auth.discord.clientID && !containsNumber(auth.discord.clientID)) {
			console.error('[HANDLER] The client ID provided is not valid. Please provide a valid client ID.');

			process.exit();
		};

		if (auth.discord.clientID !== '839894528953810944') {
			console.error('[HANDLER] The client ID provided is not the BSRPC one. Please provide the BSRPC client ID by going to the config file and changing the clientID value to 839894528953810944');

			process.exit();
		};

		if (!auth.brawlstars.token || auth.brawlstars.token === 'YOUR API KEY') {
			console.error('[HANDLER] No Brawl Stars API key provided. Please provide a Brawl Stars API key.');

			process.exit();
		};

		if (!settings.user.playerTag || settings.user.playerTag === 'YOUR PLAYER TAG') {
			console.error('[HANDLER] No Brawl Stars Player tag provided. Please provide a Brawl Stars Player tag.');

			process.exit();
		};
	}
};