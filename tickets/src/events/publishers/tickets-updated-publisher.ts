import { Publisher, Subjects, TicketUpdatedEvent } from '@rjosuetickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
