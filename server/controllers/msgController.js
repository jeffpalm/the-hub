module.exports = {
	getMessages: async (req, res) => {
		const { id } = req.params,
			{ desc } = req.query,
			db = req.app.get('db')
		let messages

		if (desc) {
			messages = await db
				.get_ticket_messages_desc(id)
				.catch(err => console.error(err))
		} else {
			messages = await db
				.get_ticket_messages(id)
				.catch(err => console.error(err))
		}

		res.status(200).send(messages)
	},
	createMessage: async (req, res) => {
		const { id } = req.params,
			{ created_by, private: privateMsg, message } = req.body,
			{ desc } = req.query,
			db = req.app.get('db')

		// TODO: Edit new_ticket_msg query after writing ticket activity middleware

		await db.new_ticket_msg(id, created_by, privateMsg, message)

		let output

		if (desc) {
			output = await db
				.get_ticket_messages_desc(id)
				.catch(err => console.error(err))
		} else {
			output = await db.get_ticket_messages(id).catch(err => console.error(err))
		}

		res.status(200).send(output)
	},
	updateMessage: async (req, res) => {},
	deleteMessage: async (req, res) => {}
}
