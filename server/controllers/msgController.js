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

		const newMessage = await db.ticket_msgs.insert({
			ticket_id: id,
			created_by,
			private: privateMsg,
			message
		})

		res.status(200).send(newMessage)
	},
	editMessage: async (req, res) => {},
	deleteMessage: async (req, res) => {},
	newTicketMessage: async (message, ticket_id, created_by, req) => {
		const db = req.app.get('db')

		const newMessage = await db.ticket_msgs.insert({
			ticket_id,
			created_by,
			private: false,
			message
		})

		return newMessage
	}
}
