module.exports = {
	getFields: async (req, res) => {
		const { id } = req.params,
			db = req.app.get('db')

		res.status(200).send([])
	},
	createFields: async (req, res) => {},
	updateFields: async (req, res) => {}
}
