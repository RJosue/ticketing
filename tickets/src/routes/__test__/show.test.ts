import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 it a ticket is not fount', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	const res = await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('return the ticket is the ticket is found', async () => {
	const price = 20;
	const title = 'fruits';
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title,
			price,
		})
		.expect(201);
	const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);

	expect(ticketResponse.body.title).toEqual(title);
	expect(ticketResponse.body.price).toEqual(price);
});
