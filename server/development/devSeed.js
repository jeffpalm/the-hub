const axios = require('axios'),
	fs = require('fs'),
	vehicles = require('./vehicles.json'),
	path = require('path')

// * 1) GENERATE USERS AND GUESTS. *PULLS USER_IDS FROM UUID DATASETS*
// * 2) GENERATE TICKETS. *TICKETS PULLED FROM TICKET DATASET*
// * 3) GENERATE TICKET MESSAGES. *TICKETS PULLED FROM HUB_MESSAGES DATASET*
// * 6) GENERATE TICKET APPOINTMENTS
// * 4) GENERATE TICKET CREATION ACTIVITY. * GENERATES RANDOM TICKET CREATION DATES * * APPENDS TICKET ACTIVITY DATASET*
// * 5) GENERATE TICKET MESSAGE ACTIVITY.

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
		console.log('Getting managers')
		const managers = await axios
			.get('https://api.mockaroo.com/api/45314cb0?count=10&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))
		console.log('Getting sales')
		const sales = await axios
			.get('https://api.mockaroo.com/api/be2e6ea0?count=20&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		console.log('Getting admins')
		const admin = await axios
			.get('https://api.mockaroo.com/api/9ad857e0?count=1&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		console.log('Getting tickets')
		const tickets = await axios
			.get('https://api.mockaroo.com/api/319c90b0?count=100&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		console.log('Getting guests')
		const guests = await axios
			.get('https://api.mockaroo.com/api/c110e040?count=100&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		console.log('Getting messages')
		const messages = await axios
			.get('https://api.mockaroo.com/api/a6477d30?count=500&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		console.log('Getting ticket creation activity')
		const ticketCreationActivity = await axios
			.get('https://api.mockaroo.com/api/058892b0?count=100&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		console.log('Getting message activity')
		const messageActivity = await axios
			.get('https://api.mockaroo.com/api/4b418370?count=500&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		console.log('Getting ticket appointments')
		const appointments = await axios
			.get('https://api.mockaroo.com/api/36522f30?count=50&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		console.log('Getting appointment activity')
		const appointmentActivity = await axios
			.get('https://api.mockaroo.com/api/f35d5b50?count=50&key=b1ad4120')
			.then(res => res.data)
			.catch(err => console.log(err))

		console.log('Writing dev_seed_users.sql')
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
		console.log('Writing dev_seed_data.sql')
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
			appointments
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			`\n\n`
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			ticketCreationActivity
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			`\n\n`
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			messageActivity
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			`\n\n`
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			appointmentActivity
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			`\n\n`
		)
		fs.appendFileSync(
			path.join(__dirname, `../../db/dev_seed_data.sql`),
			`ALTER SEQUENCE admin_ticket_type_id_seq RESTART WITH 4;\n\n
			ALTER SEQUENCE ticket_messages_id_seq RESTART WITH 501;\n\n
			ALTER SEQUENCE tickets_id_seq RESTART WITH 10000;\n\n
			ALTER SEQUENCE user_role_id_seq RESTART WITH 4;`
		)
		console.log('Finished writing SQL files')
		next()
	},
	seedDb: async (req, res) => {
		const db = req.app.get('db')
		console.log('Running SQL queries')
		await db.dev_seed_users().catch(err => console.log(err))
		console.log('dev_seed_users Successful')
		await db.dev_seed_data().catch(err => console.log(err))
		console.log('dev_seed_data Successful')
		console.log('The seed has been planted')

		res.status(200).send(`The seed has been planted.`)
	}
}
