module.exports = {
	getAttachments: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db'),
			attachments = await db.get_ticket_attachments(id)

		res.status(200).send(attachments)
	},
	createAttachment: async (req, res) => {},
	deleteAttachment: async (req, res) => {}
}
