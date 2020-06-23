const axios = require('axios')

module.exports = async (req, res) => {
	const { vin } = req.body,
		db = req.app.get('db'),
		vehicle = await db.vehicles.findOne({ vin })

	if (vehicle) {
		vehicle.ticket_count++
		db.vehicles.update({ vin }, { ticket_count: vehicle.ticket_count })
		return res.status(200).send(vehicle)
	}

	const { data } = await axios.get(
		`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`
	)

	const { Make, Model, ModelYear, Trim, VIN } = data.Results[0]

	const output = {
		vin: VIN,
		make: Make,
		model: Model,
		year: ModelYear,
		trim: Trim,
		ticket_count: 1
	}

	db.vehicles.insert(output)

	res.status(200).send(output)
}
