import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const builtTicket = async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();
	return ticket;
};

it('fetches orders fro an particular uiser', async () => {
	// Create Three tickets

	const ticketOne = await builtTicket();
	const ticketTwo = await builtTicket();
	const ticketThree = await builtTicket();

	const userOne = global.signin();
	const userTwo = global.signin();

	// Create one orders as User #1
	await request(app)
		.post('/api/orders')
		.set('Cookie', userOne)
		.send({ ticketId: ticketOne.id })
		.expect(201);

	// Create one orders as User #2
	const { body: OrderOne } = await request(app)
		.post('/api/orders')
		.set('Cookie', userTwo)
		.send({ ticketId: ticketTwo.id })
		.expect(201);

	const { body: OrderTwo } = await request(app)
		.post('/api/orders')
		.set('Cookie', userTwo)
		.send({ ticketId: ticketThree.id })
		.expect(201);
	// Make request to get orders for User #2
	const response = await request(app).get('/api/orders').set('Cookie', userTwo).expect(200);

	// Make user we only got the orders for User #2
	expect(response.body.length).toEqual(2);
	expect(response.body[0].id).toEqual(OrderOne.id);
	expect(response.body[1].id).toEqual(OrderTwo.id);
	expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
	expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
