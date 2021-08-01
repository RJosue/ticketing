import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('return a 404 if the provider id not exist', async () => {
	const id = mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'assadd',
			price: 20,
		})
		.expect(404);
});
it('return a 401 if the user is not authenticated', async () => {
	const id = mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'assadd',
			price: 20,
		})
		.expect(401);
});
it('return a 401 if the user dopnt own the ticket', async () => {
	const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
		title: 'dasad',
		price: 20,
	});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'sdasdasdad',
			price: 2500,
		})
		.expect(401);
});
it('return a 400 if the user provides an invalid title or price', async () => {
	const cookie = global.signin();
	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
		title: 'dasad',
		price: 20,
	});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 2500,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'asasaa',
			price: -2500,
		})
		.expect(400);
});
it('updates the ticket valid inputs', async () => {
	const cookie = global.signin();
	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
		title: 'dasad',
		price: 20,
	});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100,
		})
		.expect(200);
	const responseTicket = await request(app).get(`/api/tickets/${response.body.id}`).send();

	expect(responseTicket.body.title).toEqual('new title');
	expect(responseTicket.body.price).toEqual(100);
});

it('publishes an event', async () => {
	const cookie = global.signin();
	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
		title: 'dasad',
		price: 20,
	});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100,
		})
		.expect(200);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updated if the ticket is reserved', async () => {
	const cookie = global.signin();
	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
		title: 'dasad',
		price: 20,
	});

	const ticket = await Ticket.findById(response.body.id);
	ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString()});
	await ticket!.save();

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100,
		})
		.expect(400);
});
