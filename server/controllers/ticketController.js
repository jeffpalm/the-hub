const { newTicketVehicle } = require('./vehicleController')
const { handleTicketAssignment } = require('./userController')

// * Ticket life cycle stages:
// * new
// * queued
// * accepted
// * disposed
// * closed
// * sold
// * archived

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
						output = output.sort(
							(a, b) => a.guest.indexOf(guest) - b.guest.indexOf(guest)
						)
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
				attachments
			} = req.body,
			existingGuest = await db.guests.findOne({ phone: guest.phone }),
			newTicket = {
				sales_id,
				type,
				showroom
			}

		// Handle Guest
		if (existingGuest) {
			newTicket.guest_id = existingGuest.id
		} else {
			const newGuest = await db.guests.insert({
				name: guest.name,
				phone: guest.phone
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
					phone: cosigner.phone
				})
				newTicket.cosigner_id = newCox.id
			}
		}
		// Handle Vehicle
		const vehicle = await newTicketVehicle(vin, req)
		newTicket.vin = vehicle.vin

		// Handle Ticket Status

		const status = await db.admin_ticket_status.findOne({
			ticket_type: type,
			lifecycle: 'new'
		})
		newTicket.status = status.id

		// Handle Manager Assignment
		const assignedMgr = await handleTicketAssignment(req)
		newTicket.manager_id = assignedMgr.manager_id

		// ! Create ticket in database
		const dbTicket = await db.tickets.insert(newTicket)

		// Handle Message
		if (message) {
			await db.ticket_messages.insert({
				ticket_id: dbTicket.id,
				private: false,
				message
			})
		}

		// Handle Appointment
		if (appointment) {
			await db.ticket_appointments.insert({
				ticket_id: dbTicket.id,
				appointment
			})
		}

		// Handle Attachments
		if (attachments[0]) {
			attachments.forEach(a => {
				db.ticket_attachments.insert({
					ticket_id: dbTicket.id,
					type: a.type,
					filepath: a.filepath
				})
			})
		}

		res.status(200).send(dbTicket)
	},
	getTicket: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db')

		let output = {}

		// if (id) {
		// 	const [ticket] = await db.get_ticket(id),
		// 		{
		// 			type,
		// 			status,
		// 			created,
		// 			updated,
		// 			closed,
		// 			sales_id,
		// 			sales_name,
		// 			manager_id,
		// 			manager_name,
		// 			guest_id,
		// 			guest_name,
		// 			guest_phone,
		// 			cosigner_id,
		// 			cosigner_name,
		// 			cosigner_phone,
		// 			vin,
		// 			year,
		// 			make,
		// 			model,
		// 			ticket_count
		// 		} = ticket
		// 	output = {
		// 		ticket: {
		// 			id,
		// 			type,
		// 			status,
		// 			created,
		// 			updated,
		// 			closed
		// 		},
		// 		sales: {
		// 			id: sales_id,
		// 			name: sales_name
		// 		},
		// 		manager: {
		// 			id: manager_id,
		// 			name: manager_name
		// 		},
		// 		guest: {
		// 			id: guest_id,
		// 			name: guest_name,
		// 			phone: guest_phone
		// 		},
		// 		cosigner: {
		// 			id: cosigner_id,
		// 			name: cosigner_name,
		// 			phone: cosigner_phone
		// 		},
		// 		vehicle: {
		// 			vin,
		// 			year,
		// 			make,
		// 			model,
		// 			ticketCount: ticket_count
		// 		}
		// 	}
		// }

		await db.reload()
		output = await db.all_tickets.findOne({id})
	
		res.status(200).send(output)
	},
	updateTicket: async (req, res) => {
		const db = req.app.get('db'),
			{ id } = req.params,
			{ path } = req.route

		switch (path) {
			case '/api/ticket/:id/status':
				const { new_status_id } = req.body
				try {
					await db.tickets.update(id, {
						status: new_status_id
					})
				} catch (err) {
					console.log(err)
					res.status(500).send(err)
				}
				break
			case '/api/ticket/:id/type':
				const { new_type_id } = req.body
				try {
					await db.tickets.update(id, {
						type: new_type_id
					})
				} catch (err) {
					console.log(err)
					res.status(500).send(err)
				}
				break
			case '/api/ticket/:id/sales':
				const { new_sales_id } = req.body
				try {
					await db.tickets.update(id, {
						sales_id: new_sales_id
					})
				} catch (err) {
					console.log(err)
					res.status(500).send(err)
				}
				break
			case '/api/ticket/:id/manager':
				const { new_manager_id } = req.body
				try {
					await db.tickets.update(id, {
						manager_id: new_manager_id
					})
				} catch (err) {
					console.log(err)
					res.status(500).send(err)
				}
				break
			case '/api/ticket/:id/guest':
				const { guest_id, guest_name, guest_phone } = req.body
				try {
					await db.tickets.update(id, {
						guest_id
					})
					if (guest_name) {
						await db.guests.update(guest_id, {
							name: guest_name
						})
					}
					if (guest_phone) {
						await db.guests.update(guest_id, {
							phone: guest_phone
						})
					}
				} catch (err) {
					console.log(err)
					res.status(500).send(err)
				}
				break
			case '/api/ticket/:id/cosigner':
				const { cosigner_id, cosigner_name, cosigner_phone } = req.body
				try {
					await db.tickets.update(id, {
						cosigner_id
					})
					if (cosigner_name) {
						await db.guests.update(cosigner_id, {
							name: cosigner_name
						})
					}
					if (cosigner_phone) {
						await db.guests.update(cosigner_id, {
							phone: cosigner_phone
						})
					}
				} catch (err) {
					console.log(err)
					res.status(500).send(err)
				}
				break
			case '/api/ticket/:id/vehicle':
				const { vin } = req.body
				try {
					await newTicketVehicle(vin, req)
				} catch (err) {
					console.log(err)
					res.status(500).send(err)
				}
				break
			default:
				break
		}

		const output = await db.all_tickets.findOne({id})
		res.status(200).send(output)
	},
	deleteTicket: async (req, res) => {
		const db = req.app.get('db'),
			{ id } = req.params

		db.tickets.destroy(id)

		res.sendStatus(200)
	}
}
