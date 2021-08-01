import mongoose from 'mongoose';
import { ExpirationCompleteEvent } from '@rjosuetickets/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { OrderStatus } from '@rjosuetickets/common';

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client);
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 10,
	});

	await ticket.save();

	const order = Order.build({
		userId: 'asaddad',
		status: OrderStatus.Created,
		expiresAt: new Date(),
		ticket,
	});

	await order.save();
	const data: ExpirationCompleteEvent['data'] = {
		orderId: order.id,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, order, ticket };
};

it('updates the order status to cancelled', async () => {
	const { listener, data, msg, order } = await setup();

	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
	const { listener, data, msg, order } = await setup();

	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
	expect(eventData.id).toEqual(order.id);
});

it('acks the messages', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
