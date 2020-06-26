module.exports = {
	availableMgrs: async (req, res) => {
		const db = req.app.get('db'),
			availableMgrs = await db.available_mgrs_by_active()

		res.status(200).send(availableMgrs)
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

		const rand = Math.floor(Math.rand() * leastTotal.length)

		return availableMgrsByTotal[rand]
	}
}
