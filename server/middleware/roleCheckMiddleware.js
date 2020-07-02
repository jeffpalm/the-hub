module.exports = {
	adminsOnly: async (req, res, next) => {
		if (!req.session.user) return res.status(401).send('No no no... Must be logged in!')

		const db = req.app.get('db'),
			{ role } = req.session.user,
			adminRoles = await db.user_role.find({
				admin: true
			})

		let authorized = false

		adminRoles.forEach(r => {
			if (r.id === role) authorized = true
		})

		if (!authorized) return res.status(401).send('No no no... Not allowed')

		next()
	},
	managersOnly: async (req, res, next) => {
		if (!req.session.user) return res.status(401).send('No no no... Must be logged in!')

		const db = req.app.get('db'),
			{ role } = req.session.user,
			managerRoles = await db.user_role.find({
				or: [{ manager: true }, { admin: true }]
			})

		let authorized = false

		managerRoles.forEach(r => {
			if (r.id === role) authorized = true
		})

		if (!authorized) return res.status(401).send('No no no... Not allowed')

		next()
	},
	usersOnly: async (req, res, next) => {
		if (!req.session.user) return res.status(401).send('No no no... Not allowed. Must be logged in')

		next()
	}
}
