import { Publisher, OrderCreatedEvent, Subjects } from '@rjosuetickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}