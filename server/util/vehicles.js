const vehicles = require('./vehicles.json')
const axios = require('axios')

vehicles.forEach(vehicle => {
	axios
		.post('http://localhost:9000/api/vehicle', { vin: vehicle.vin })
		.then(res => console.log(`${res.data.vin} added`))
})
