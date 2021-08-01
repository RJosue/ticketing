import { PaymentCreatedEvent, Publisher, Subjects } from '@rjosuetickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
