import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
	private _client?: Stan;

	get client() {
		if (!this._client) {
			throw new Error('Cannot acces NATS client before connect');
		}
		return this._client;
	}

	connect(clusterId: string, clientId: string, url: string) {
		this._client = nats.connect(clusterId, clientId, {
			url,
		});

		return new Promise((resolve, reject) => {
			this.client.on('connect', () => {
				console.log('Connected to Nats');
				resolve(true);
			});

			this.client.on('error', (error: any) => {
				reject(error);
			});
		});
	}
}

export const natsWrapper = new NatsWrapper();
