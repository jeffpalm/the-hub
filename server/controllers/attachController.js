module.exports = {
	getAttachments: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db'),
			attachments = await db.ticket_attachments.find({ ticket_id: id })

		res.status(200).send(attachments)
	},
	createAttachment: async (req, res) => {},
	deleteAttachment: async (req, res) => {}
}
