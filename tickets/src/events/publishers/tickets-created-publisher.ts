import {
	Publisher,
	Subjects,
	TicketCreatedEvent,
} from '@rjosuetickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
