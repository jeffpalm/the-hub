module.exports = {
	getTickets: async (req, res) => {
		const { type, guest, sales, manager, status, vin } = req.query,
			db = req.app.get('db'),
			tickets = await db.get_all_tickets()

		res.status(200).send(tickets)
	},
	createTicket: async (req, res) => {},
	getTicket: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db'),
			[ticket] = await db.get_ticket(id),
			{
				type,
				status,
				created,
				updated,
				closed,
				sales_id,
				sales_name,
				manager_id,
				manager_name,
				guest_id,
				guest_name,
				guest_phone,
				cosigner_id,
				vin,
				year,
				make,
				model,
				ticket_count
			} = ticket,
			ticketObj = {
				ticket: {
					id,
					type,
					status,
					created,
					updated,
					closed
				},
				sales: {
					id: sales_id,
					name: sales_name
				},
				manager: {
					id: manager_id,
					name: manager_name
				},
				guest: {
					id: guest_id,
					name: guest_name,
					phone: guest_phone
				},
				cosigner: {
					id: cosigner_id
				},
				vehicle: {
					vin,
					year,
					make,
					model,
					ticketCount: ticket_count
				}
			}

		res.status(200).send(ticketObj)
	},
	updateTicket: async (req, res) => {},
	deleteTicket: async (req, res) => {}
}
