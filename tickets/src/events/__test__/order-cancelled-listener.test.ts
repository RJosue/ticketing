import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { OrderCancelledListener } from '../listeners/order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from '@rjosuetickets/common';
import { natsWrapper } from '../../nats-wrapper';
const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);
	const orderId = mongoose.Types.ObjectId().toHexString();
	// create and save a ticket
	const ticket = Ticket.build({
		title: 'concert',
		price: 99,
		userId: 'dddd',
	});

	ticket.set({ orderId });

	await ticket.save();

	// create the fake data event
	const data: OrderCancelledEvent['data'] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, msg, orderId };
};


it('updated the ticket, publishes an event, and acks the messafe', async () => {
     const { listener, ticket, data, msg, orderId } = await setup();

     await listener.onMessage(data, msg);

     const updatedTicket = await Ticket.findById(ticket.id);
     expect(updatedTicket!.orderId).not.toBeDefined();
     expect(msg.ack).toHaveBeenCalled();
     expect(natsWrapper.client.publish).toHaveBeenCalled();
})