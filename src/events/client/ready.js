const { rpc } = require('../../rpc/rpc.js')

module.exports = {
	name: 'ready',
	once: true,

	async execute(client) {
		rpc(client);

		setInterval(() => {
			rpc(client);
		}, 60000);

		console.log('[DISCORD] RPC connected to Discord!');
	}
};