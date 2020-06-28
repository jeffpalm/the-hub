const axios = require('axios'),
	fs = require('fs'),
	vehicles = require('./vehicles.json'),
	path = require('path')

module.exports = {
	writeSql: async (req, res, next) => {
		const db = req.app.get('db')

		await db.seed().catch(err => console.log(err))

		vehicles.forEach(async vehicle => {
			await axios
				.post('http://localhost:9000/api/vehicle', { vin: vehicle.vin })
				.then(res => console.log(`${res.data.vin} added`))
				.catch(err => console.log(err))
		})
		const managers = await axios
			.get('https://api.mockaroo.com/api/45314cb0?count=10&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		const sales = await axios
			.get('https://api.mockaroo.com/api/be2e6ea0?count=20&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		const admin = await axios
			.get('https://api.mockaroo.com/api/9ad857e0?count=1&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		const tickets = await axios
			.get('https://api.mockaroo.com/api/319c90b0?count=100&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		const guests = await axios
			.get('https://api.mockaroo.com/api/c110e040?count=100&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		const messages = await axios
			.get('https://api.mockaroo.com/api/a6477d30?count=500&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		const activity = await axios
			.get('https://api.mockaroo.com/api/4b418370?count=500&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		fs.writeFileSync(
			path.join(__dirname, `../../db/dev_seed_users.sql`),
			managers
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_users.sql`),
			`\n\n`
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_users.sql`),
			sales
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_users.sql`),
			`\n\n`
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_users.sql`),
			admin
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_users.sql`),
			`\n\n`
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_users.sql`),
			guests
		)

		fs.writeFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			tickets
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			`\n\n`
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			messages
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			`\n\n`
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			activity
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			`\n\n`
		)

		next()
	},
	seedDb: async (req, res) => {
		const db = req.app.get('db')

		await db.dev_seed_users().catch(err => console.log(err))
		await db.dev_seed_data().catch(err => console.log(err))

		res.sendStatus(200)
	}
}
