module.exports = {
	getFields: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db'),
			fields = await db.ticket_fields.find({ ticket_id: id })

		res.status(200).send(fields)
    },
    createFields: async (req, res) => {

    },
    updateFields: async (req, res) => {
        
    }
}
