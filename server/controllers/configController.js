// const writeConfig = require('../util/writeConfig')
// const curConfig = require('../util/config.json')
const ADMIN = 1, FINANCE_MGR = 2, EG = 3
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
	},
	getConfig: async (req, res) => {
		const db = req.app.get('db')
		const config = {}

		config.admins = await db.get_users_by_role(ADMIN)
		config.managers = await db.get_users_by_role(FINANCE_MGR)
		config.sales = await db.get_users_by_role(EG)
		config.roles = await db.user_role.find()
		config.types = await db.admin_ticket_type.find()
		config.statuses = await db.admin_ticket_status.find()
		config.attachmentTypes = await db.admin_attachment_type.find()

		res.status(200).send(config)
	},
	getUser: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db'),
			user = await db.users.findOne(id)

		delete user.password
		delete user.activation

		res.status(200).send(user)
	}
}
