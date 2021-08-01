import { Ticket } from '../ticket';

it('implements optimistic concurency control', async (done) => {
	// create an instance of a ticket
	const ticket = Ticket.build({
		title: 'concert',
		price: 5,
		userId: '123',
	});
	// save the ticker to the database
	await ticket.save();
	// fetch the ticket model
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);
	// make tow separete changes to the tickets we fetched
	firstInstance!.set({ price: 10 });
	secondInstance!.set({ price: 15 });
	// save the first fetched ticket
	await firstInstance!.save();

	// save the second fetched ticket an expect an error
	try {
		await secondInstance!.save();
	} catch (err) {
		return done();
	}

	throw new Error('Shold not reach this point');
});

it('increments the version number on multiple saves', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		userId: '123',
	});

	await ticket.save();
	expect(ticket.version).toEqual(0);
	await ticket.save();
	expect(ticket.version).toEqual(1);
	await ticket.save();
	expect(ticket.version).toEqual(2);
});
