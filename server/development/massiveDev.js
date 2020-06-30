require('dotenv').config()
const massive = require('massive'),
	{ CONNECTION_STRING } = process.env

module.exports = async () => {
	const db = await massive({
		connectionString: CONNECTION_STRING,
		application_name: 'the-hub',
		ssl: { rejectUnauthorized: false }
  })
  
  return db.users.find
}
