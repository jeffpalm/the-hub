// ! ACTION TYPES
// *  created
// *  read
// *  updated
// *  deleted
// ! ACTIVITY TYPES
// *  ticket
// *  guest
// *  cosigner
// *  sales
// *  manager
// *  type
// *  status
// *  vin
// *  showroom
// *  attachment
// *  appointment
// *  message

// // TODO: WRITE TICKET ACTIVITY LOGGING MIDDLEWARE

module.exports = async (req, res, next) => {
	const db = req.app.get('db'),
		{ user_id, message, private: isPrivate } = req.body,
		{ id, messageid, attachmentid, appointmentid } = req.params,
		{ path } = req.route,
		{ method } = req

	// ! Make sure ticket exists
	const ticket = await db.tickets.findOne({ id })
	if (!ticket) return res.status(404).send('Ticket not found')

	// * Handle Action

	const actions = {
			POST: 'created',
			PUT: 'updated',
			DELETE: 'deleted'
		},
		action = actions[method]

	// * Handle Activity, current, and previous

	let activity, current, previous

	switch (path) {
		case '/api/ticket':
			activity = 'ticket'
			if (message) current = message
			break
		case '/api/ticket/:id/sales':
			activity = 'sales'
			previous = (await db.all_tickets.findOne({ id })).sales
			current = req.body.new_sales_id
			break
		case '/api/ticket/:id/manager':
			activity = 'manager'
			previous = (await db.all_tickets.findOne({ id })).manager
			current = req.body.new_manager_id
			break
		case '/api/ticket/:id/guest':
			activity = 'guest'
			previous = (await db.all_tickets.findOne({ id })).guest
			current = req.body.new_guest_id
			break
		case '/api/ticket/:id/cosigner':
			activity = 'cosigner'
			previous = (await db.all_tickets.findOne({ id })).cosigner
			current = req.body.new_cosigner_id
			break
		case '/api/ticket/:id/status':
			activity = 'status'
			previous = (await db.all_tickets.findOne({ id })).status
			current = req.body.new_status_id
			break
		case '/api/ticket/:id/type':
			activity = 'type'
			previous = (await db.all_tickets.findOne({ id })).type
			current = req.body.new_type_id
			break
		case '/api/ticket/:id/vehicle':
			activity = 'vehicle'
			previous = (await db.all_tickets.findOne({ id })).vin
			current = req.body.new_vin
			break
		case '/api/ticket/:id/message':
			activity = 'message'
			current = message
			break
		case '/api/ticket/:id/message/:messageid':
			activity = 'message'
			previous = (await db.ticket_messages.findOne({ id: messageid })).message
			current = message
			break
		case '/api/ticket/:id/attachment/:attachmentid':
			activity = 'attachment'
			previous = (await db.ticket_attachments.findOne({ id: attachmentid }))
				.type
			current =
				action === 'updated'
					? req.body.new_attachment_type
					: 'Deleted attachment'
			// ! Handle PUT and DELETE cases
			break
		case '/api/ticket/:id/appointment/:appointmentid':
			activity = 'appointment'
			previous = (await db.ticket_appointments.findOne({ id: appointmentid }))
				.appointmentid
			current =
				action === 'updated' ? req.body.new_appointment : 'Deleted message'
			// ! Handle PUT and DELETE cases
			break
		case '/api/ticket/:id/attachment':
			activity = 'attachment'
			current = req.body.type
			break
		case '/api/ticket/:id/appointment':
			activity = 'appointment'
			current = req.body.appointment
			break
		default:
			break
	}

	req.ticketActivityId = (await db.ticket_activity.insert({
		ticket_id: id,
		action,
		activity,
		current,
		previous,
		user_id,
		private: isPrivate || false
	})).id

	next()
}
