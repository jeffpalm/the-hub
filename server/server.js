require('dotenv').config()
const express = require('express'),
	app = express(),
	massive = require('massive'),
	session = require('express-session'),
	{ SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

app.use(express.json())
app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: SESSION_SECRET,
		cookie: { maxAge: 1000 * 60 * 60 * 24 }
	})
)

massive({
	connectionString: CONNECTION_STRING,
	ssl: { rejectUnauthorized: false }
}).then(db => {
	app.set('db', db)
	console.log('Database in place')
	app.listen(SERVER_PORT, () => {
		console.log(`Servin and observin port ${SERVER_PORT}`)
	})
})
