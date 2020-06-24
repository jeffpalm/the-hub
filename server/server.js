require('dotenv').config()
const express = require('express'),
	app = express(),
	massive = require('massive'),
	session = require('express-session'),
	authController = require('./controllers/authController'),
	ticketController = require('./controllers/ticketController'),
	vehicleController = require('./controllers/vehicleController'),
	attachController = require('./controllers/attachController'),
	fieldController = require('./controllers/fieldController'),
	msgController = require('./controllers/msgController'),
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

// Ticket Endpoints
app.get('/api/tickets', ticketController.getTickets)
app.get('/api/ticket', ticketController.ticketInfo)
app.get('/api/ticket/:id', ticketController.getTicket)
app.get('/api/ticket/:id/fields', fieldController.getFields)
app.get('/api/ticket/:id/attachments', attachController.getAttachments)
app.post('/api/ticket', ticketController.createTicket)

// Vehicle Endpoints
app.post('/api/vehicle', vehicleController)

// Message Enpoints
app.get('/api/ticket/:id/messages', msgController.getMessages)
app.post('/api/ticket/:id/message', msgController.createMessage)

// Utility Endpoints
app.get('/api/user/:id', async (req, res) => {
	const {id} = req.params,
		db = req.app.get('db'),
		user = await db.users.findOne(id)

	delete user.password
	delete user.activation

	res.status(200).send(user)
})

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
