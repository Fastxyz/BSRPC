const { auth, settings } = require('../../config.js')
const version = require('../../package.json').version;
const fetch = require('node-fetch-commonjs');

const rpc = async function setActivity(client) {
	const response = await fetch(`https://api.brawlstars.com/v1/players/%23${settings.user.playerTag.replace('#', '')}`, {
		headers: {
			'Authorization': `Bearer ${auth.brawlstars.token}`,
			'Content-Type': 'application/json',
			'User-Agent': `BSRPC v${version}`
		}
	});

	if (response.status !== 200) {
		const error = await response.json();

		if (response.status === 400) {
			console.error(`[BRAWL STARS API] The RPC Client is providing incorrect parameters for the request. Report this at https://github.com/Fastxyz/BSRPC/issues\n➜ ERROR: ${response.status} - ${error.message} (${error.reason})`);

			process.exit();
		} else if (response.status === 403 && error.reason === 'accessDenied') {
			console.error(`[BRAWL STARS API] You provided an invalid API key. Check if it is correct in the config file, or go to https://developer.brawlstars.com/#/new-key to create a new one.\n➜ ERROR: ${response.status} - ${error.message} (${error.reason})`);

			process.exit();
		} else if (response.status === 403 && error.reason === 'accessDenied.invalidIp') {
			console.error(`[BRAWL STARS API] The API key does not allow access for your IP. Check if your IP is in the list of authorized IPs to access the API with your API key at https://developer.brawlstars.com/#/account. To check your IP, go to https://nordvpn.com/what-is-my-ip\n➜ ERROR: ${response.status} - ${error.message} (${error.reason})`);

			process.exit();
		} else if (response.status === 404) {
			console.error(`[BRAWL STARS API] You provided an invalid player tag. Check if it is correct in the config file.\n➜ ERROR: ${response.status} - ${error.message} (${error.reason})`);

			process.exit();
		} else if (response.status === 429) {
			console.error(`[BRAWL STARS API] The API is at its maximum capacity. Please, try again later!\n➜ ERROR: ${response.status} - ${error.message} (${error.reason})`);

			process.exit();
		} else if (response.status === 500) {
			console.error(`[BRAWL STARS API] An unknown error happened when handling the request. Please, try again! If the error persists, please try again later!\n➜ ERROR: ${response.status} - ${error.message} (${error.reason})`);

			process.exit();
		} else if (response.status === 503) {
			console.error(`[BRAWL STARS API] Brawl Stars is currently under maintenance, so it is not possible to access the API. Wait for the maintenance to finish before you can access the API.\n➜ ERROR: ${response.status} - ${error.message} (${error.reason})`);

			process.exit();
		} else {
			console.error(`[BRAWL STARS API] An error has occurred. Report this at https://github.com/Fastxyz/BSRPC/issues\n➜ ERROR: ${response.status} - ${error.message} (${error.reason})`);

			process.exit();
		};
	} else {
		const player = await response.json();

		const expMax = 40 + 10 * (player.expLevel - 1);

		let number = 0;
		let i;
		for (i = 0; i < (player.expLevel - 1); i++) {
			number = number + i;
		};

		const expNeeded = Math.abs((40 * (player.expLevel - 1)) + (10 * number) - player.expPoints);

		client.request('SET_ACTIVITY', {
			pid: process.pid,
			activity: {
				details: `🏆 Trophies: ${player.trophies}/${player.highestTrophies} • ⭐ Level: ${player.expLevel} (${expNeeded}/${expMax})`,
				state: `🥊 3v3 Wins: ${player['3vs3Victories']} • 👤 Solo Wins: ${player.soloVictories} • 👥 Duo Wins: ${player.duoVictories}`,
				timestamps: {
					start: Date.now()
				},
				assets: {
					large_image: 'logo',
					large_text: `BSRPC v${version}`,
					small_image: `${player.icon.id}`,
					small_text: `${player.name} (${player.tag})`
				},
				buttons: [
					{
						label: '🚀 Download',
						url: 'https://github.com/Fastxyz/BSRPC'
					}
				]
			}
		}).catch(error => {
			if (error.message === 'RPC_CONNECTION_TIMEOUT') {
				console.error(`[DISCORD] An error has occurred!\n➜ ERROR: ${error}`);

				process.exit();
			};
		});
	};
};

module.exports = {
	rpc
};