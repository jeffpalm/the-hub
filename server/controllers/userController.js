module.exports = {
	getUsers: async (req, res) => {
		const db = req.app.get('db'),
			output = {}

		if (Object.keys(req.query).length) {
			for (let query in req.query) {
				switch (query) {
					case 'role':
						output.users = await db.get_users_by_role(req.query.role)
						break
					default:
						break
				}
			}
		} else {
			output.users = await db.get_all_users()
		}
		res.status(200).send(output)
	},
	getManagers: async (req, res) => {
		const db = req.app.get('db'),
			output = {}

		if (Object.keys(req.query).length) {
			for (let q in req.query) {
				switch (q) {
					case 'available':
						output.available = await db.available_mgrs_by_active()
						break
					case 'all':
						output.all = await db.get_all_mgrs()
						break
					default:
						output.unknownQueries = output.unknownQueries
							? [...output.unknownQueries, q]
							: [q]
						break
				}
			}
		}
		res.status(200).send(output)
	},
	handleTicketAssignment: async req => {
		const db = req.app.get('db'),
			availableMgrsByActive = await db.available_mgrs_by_active(),
			availableMgrsByTotal = await db.available_mgrs_by_total()

		const leastActive = availableMgrsByActive.filter(
			mgr => mgr.active_count === availableMgrsByActive[0].active_count
		)

		if (leastActive.length === 1) {
			return availableMgrsByActive[0]
		}

		const leastTotal = availableMgrsByTotal.filter(
			mgr => mgr.total_count === availableMgrsByTotal[0].total_count
		)
		if (leastTotal.length === 1) {
			return availableMgrsByTotal[0]
		}

		const rand = Math.floor(Math.random() * leastTotal.length)

		return availableMgrsByTotal[rand]
	},
	updateUser: async (req, res) => {
		const db = req.app.get('db'),
			{ id } = req.params

		let output

		if (Object.keys(req.body).length) {
			const { available, phone, email } = req.body
			for (let key in req.body) {
				switch (key) {
					case 'available':
						output = await db.users.update(id, {
							available
						})
						delete output.password
						delete output.activation
						req.session.user = output
						break
					case 'phone':
						await db.users.update(id, { phone: phone })
						break
					case 'email':
						await db.users.update(id, { email: email })
						break
					default:
						break
				}
			}
		}
		res.status(200).send(output)
	},
	adminUpdateUser: async (req, res) => {
		const db = req.app.get('db')
		const { id, email, name, phone, role, available, require_reset } = req.body

		console.log(req.body)

		const updatedUser = await db.users.update(id, {
			email,
			name,
			phone,
			role,
			available,
			require_reset
		})

		delete updatedUser.password
		delete updatedUser.activation

		res.status(200).send(updatedUser)
	}
}
