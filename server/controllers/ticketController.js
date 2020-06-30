const { newTicketVehicle } = require('./vehicleController')
const { newTicketMessage } = require('./msgController')
const { handleTicketAssignment } = require('./userController')

module.exports = {
	getTickets: async (req, res) => {
		const db = req.app.get('db')

		let output = await db.get_all_tickets()

		if (Object.keys(req.query).length) {
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
						output = output.filter(t =>
							t.type.toLowerCase().includes(type.toLowerCase())
						)
						break
					case 'guest':
						output = await db.all_tickets.find({
							or: [
								{ 'guest ilike': `%${guest}%` },
								{ 'guest ilike': `${guest}%` },
								{ 'guest ilike': `%${guest}` }
							]
						})
						output = output.sort((a, b) => a.guest.indexOf(guest) - b.guest.indexOf(guest))
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
						output = output.filter(t => t.type_id === type_id)
						break
					case 'guest_id':
						output = output.filter(t => t.guest_id === guest_id)
						break
					case 'sales_id':
						output = output.filter(t => t.sales_id === sales_id)
						break
					case 'manager_id':
						output = output.filter(t => t.manager_id === manager_id)
						break
					case 'status_id':
						output = output.filter(t => t.status_id === status_id)
						break
					default:
						break
				}
			}
		}

		res.status(200).send(output)
	},
	createTicket: async (req, res) => {
		const db = req.app.get('db'),
			{
				sales_id,
				type,
				message,
				vin,
				guest,
				cosigner,
				showroom,
				appointment,
				fields,
				attachments
			} = req.body,
			existingGuest = await db.guests.findOne({ phone: guest.phone }),
			newTicket = {
				sales_id,
				type,
				showroom,
				appointment,
				created_by: sales_id
			}

		// Handle Guest
		if (existingGuest) {
			newTicket.guest_id = existingGuest.id
		} else {
			const newGuest = await db.guests.insert({
				name: guest.name,
				phone: guest.phone,
				sales_id,
				created_by: sales_id
			})
			newTicket.guest_id = newGuest.id
		}
		// Handle Cosigner
		if (cosigner.phone) {
			const existingCox = await db.guests.findOne({ phone: cosigner.phone })
			if (existingCox) {
				newTicket.cosigner_id = existingCox.id
			} else {
				const newCox = await db.guests.insert({
					name: cosigner.name,
					phone: cosigner.phone,
					sales_id,
					created_by: sales_id
				})
				newTicket.cosigner_id = newCox.id
			}
		}
		// Handle Vehicle
		const vehicle = await newTicketVehicle(vin, req)
		newTicket.vin = vehicle.vin

		// Handle Ticket Status
		const current_status = await db.ticket_status.findOne({
			type,
			new_ticket: true
		})
		newTicket.current_status = current_status.id

		// Handle Manager Assignment
		const assignedMgr = await handleTicketAssignment(req)
		newTicket.manager_id = assignedMgr.manager_id

		// Create ticket in database
		const dbTicket = await db.tickets.insert(newTicket)

		// Handle Message
		if (message) {
			newTicketMessage(message, dbTicket.id, sales_id, req)
		}

		// Handle Fields
		if (fields[0]) {
			fields.forEach(f => {
				db.ticket_fields.insert({
					ticket_id: dbTicket.id,
					field_type: f.field_type,
					content: f.content
				})
			})
		}

		// Handle Attachments
		if (attachments[0]) {
			attachments.forEach(a => {
				db.ticket_attachments.insert({
					ticket_id: dbTicket.id,
					guest_id: dbTicket.guest_id,
					type: a.type,
					filepath: a.filepath,
					created_by: sales_id
				})
			})
		}

		res.status(200).send(dbTicket)
	},
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
					cosigner_name,
					cosigner_phone,
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
					id: cosigner_id,
					name: cosigner_name,
					phone: cosigner_phone
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
	searchTest: async (req, res) => {
		const db = req.app.get('db'),
			{ guest } = req.query

		await db.all_tickets.refresh(true)
		const result = await db.all_tickets.find({ 'guest ~*': `${guest}` })

		res.status(200).send(result)
	}
}
