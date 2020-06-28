module.exports = {
	managers: async (req, res) => {
		const db = req.app.get('db'),
			output = {}
			

		if (Object.keys(req.query).length) {
			for(let q in req.query){
				switch(q){
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
	}
}
