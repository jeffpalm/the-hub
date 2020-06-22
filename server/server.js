require('dotenv').config()
const express = require('express'),
	app = express(),
	massive = require('massive'),
	session = require('express-session'),
	authController = require('./controllers/authController'),
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

// Development endpoints
app.post('/seed', (req, res) => {
	const db = req.app.get('db')
	db.seed()
	res.sendStatus(200)
})

// Auth Endpoints
app.post('/auth/new', authController.createUser)
app.get('/auth/activate', authController.activate)
app.post('/auth/register', authController.register)
app.post('/auth/login', authController.login)
app.get('/auth/user', authController.getUser)

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
