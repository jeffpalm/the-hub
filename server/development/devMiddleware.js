module.exports = (req, res, next) => {
  const { email } = req.body

	switch (email) {
		case 'admin':
      req.session.user = {
				id: '1a74d18d-c1bd-4d3c-bfae-81da6f79cb8d',
				available: false,
				email: 'admin@the-hub.io',
				phone: '9721111111',
				name: 'Admin Dev',
				role: 1,
				last_reset: null,
				last_visit: new Date(),
				require_reset: false
			}
			return res.status(200).send(req.session.user)
		case 'sales':
      req.session.user = {
				id: '4c2fd054-9b5e-4e3d-9c1d-08b90a682022',
				available: false,
				email: 'sales@the-hub.io',
				phone: '2149076302',
				name: 'Sales Dev',
				role: 3,
				last_reset: null,
				last_visit: new Date(),
				require_reset: false
			}
			return res.status(200).send(req.session.user)
		case 'mgr':
      req.session.user = {
				id: 'd6cbf941-608a-42e8-bf9b-db17bd3375f7',
				available: false,
				email: 'manager@the-hub.io',
				phone: '9726749323',
				name: 'Manager Dev',
				role: 2,
				last_reset: null,
				last_visit: new Date(),
				require_reset: false
			}
			return res.status(200).send(req.session.user)
		default:
			return next()
	}
}
