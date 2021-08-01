import { Subjects } from './subjects';

export interface TicketCreatedEvent {
	subject: Subjects.TickerCreated;
	data: {
		id: string;
		title: string;
		price: number;
	};
}
