module.exports = {
	ticket: async (req, res) => {
		const db = req.app.get('db'),
			output = {}

		console.log(req.query)
		if (Object.keys(req.query).length) {
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
						break
				}
			}
		} else {
			output.attachmentTypes = await db.get_ticket_attachment_types()
			output.statuses = await db.get_ticket_statuses()
			output.fieldTypes = await db.get_ticket_field_types()
			output.types = await db.get_ticket_types()
		}

		res.status(200).send(output)
	}
}
