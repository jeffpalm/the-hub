module.exports = {
	getFields: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db'),
			fields = await db.get_ticket_fields(id)

		res.status(200).send(fields)
	},
	createFields: async (req, res) => {},
	updateFields: async (req, res) => {}
}
