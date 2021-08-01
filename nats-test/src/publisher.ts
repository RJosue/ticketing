import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './event/ticket-created-publisher';
console.clear();

const stan = nats.connect('ticketing', 'abc', {
	url: 'http://localhost:4222',
});

stan.on('connect', async () => {
	console.log('Publisher connect to NATS');
	try {
		const publisher = new TicketCreatedPublisher(stan);
		await publisher.publish({
			id: '123',
			title: 'concert',
			price: 20,
		});
	} catch (err) {
		console.log(err);
	}
});
