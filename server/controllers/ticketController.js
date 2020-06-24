module.exports = {
	getTickets: async (req, res) => {
		const db = req.app.get('db')

		let output = await db.get_all_tickets()

		if (req.query) {
			const {
				type,
				type_id,
				guest,
				guest_id,
				sales,
				sales_id,
				manager,
				manager_id,
				status,
				status_id,
				vin
			} = req.query
			for (let q in req.query) {
				switch (q) {
					case 'type':
						output = output.filter(t => t.type.includes(type))
						break
					case 'guest':
						output = output.filter(t => t.guest.includes(guest))
						break
					case 'sales':
						output = output.filter(t => t.sales.includes(sales))
						break
					case 'manager':
						output = output.filter(t => t.manager.includes(manager))
						break
					case 'status':
						output = output.filter(t => t.status.includes(status))
						break
					case 'vin':
						output = output.filter(t => t.vin.includes(vin))
						break
					case 'type_id':
						output = output.filter(t => t.type_id === +type_id)
						break
					case 'guest_id':
						output = output.filter(t => t.guest_id === +guest_id)
						break
					case 'sales_id':
						output = output.filter(t => t.sales_id === +sales_id)
						break
					case 'manager_id':
						output = output.filter(t => t.manager_id === +manager_id)
						break
					case 'status_id':
						output = output.filter(t => t.status_id === +status_id)
						break
					default:
						break
				}
			}
		}

		res.status(200).send(output)
	},
	createTicket: async (req, res) => {},
	getTicket: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db')

		let output = {}

		if (id) {
			const [ticket] = await db.get_ticket(id),
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
				} = ticket
			output = {
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
		}

		res.status(200).send(output)
	},
	updateTicket: async (req, res) => {},
	deleteTicket: async (req, res) => {},
	ticketInfo: async (req, res) => {
		const db = req.app.get('db'),
			output = {}

		if (req.query) {
			for (let q in req.query) {
				switch (q) {
					case 'statuses':
						output.statuses = await db.get_ticket_statuses()
						break
					case 'types':
						output.types = await db.get_ticket_types()
						break
					case 'field-types':
						output.fieldTypes = await db.get_ticket_field_types()
						break
					case 'attachment-types':
						output.attachmentTypes = await db.get_ticket_attachment_types()
						break
					default:
						output.unknownQueries = output.unknownQueries
							? [...output.unknownQueries, q]
							: [q]
				}
			}
		}

		res.status(200).send(output)
	}
}
