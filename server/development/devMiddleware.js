module.exports = async (req, res, next) => {
	const { email } = req.body,
		db = req.app.get('db')

	switch (email) {
		case 'admin':
			req.session.user = await db.users.findOne(
				{
					email: 'admin@the-hub.io'
				},
				{
					fields: [
						'id',
						'available',
						'email',
						'phone',
						'name',
						'role',
						'last_reset',
						'last_visit',
						'require_reset'
					]
				}
			)
			return res.status(200).send(req.session.user)
		case 'sales':
			req.session.user = await db.users.findOne(
				{
					email: 'sales@the-hub.io'
				},
				{
					fields: [
						'id',
						'available',
						'email',
						'phone',
						'name',
						'role',
						'last_reset',
						'last_visit',
						'require_reset'
					]
				}
			)
			return res.status(200).send(req.session.user)
		case 'mgr':
			req.session.user = await db.users.findOne(
				{
					email: 'manager@the-hub.io'
				},
				{
					fields: [
						'id',
						'available',
						'email',
						'phone',
						'name',
						'role',
						'last_reset',
						'last_visit',
						'require_reset'
					]
				}
			)
			return res.status(200).send(req.session.user)
		default:
			return next()
	}
}
