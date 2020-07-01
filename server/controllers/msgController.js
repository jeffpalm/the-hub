module.exports = {
	getMessages: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db'),
			messages = await db.get_ticket_messages(id)

		res.status(200).send(messages)
	},
	createMessage: async (req, res) => {
		const { id } = req.params,
			{ created_by, private: privateMsg, message } = req.body,
			db = req.app.get('db')

		// TODO: Edit new_ticket_msg query after writing ticket activity middleware

		const newMessages = await db.new_ticket_msg(
			id,
			created_by,
			privateMsg,
			message
		)

		res.status(200).send(newMessages)
	},
	updateMessage: async (req, res) => {},
	deleteMessage: async (req, res) => {}
}
