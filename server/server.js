require('dotenv').config()
const express = require('express'),
	app = express(),
	massive = require('massive'),
	session = require('express-session'),
	// aws = require('aws-sdk'),
	authController = require('./controllers/authController'),
	ticketController = require('./controllers/ticketController'),
	vehicleController = require('./controllers/vehicleController'),
	attachController = require('./controllers/attachController'),
	fieldController = require('./controllers/fieldController'),
	msgController = require('./controllers/msgController'),
	userController = require('./controllers/userController'),
	configController = require('./controllers/configController'),
	devMiddleware = require('./development/devMiddleware'),
	devSeed = require('./development/devSeed'),
	{ SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

// const awsTest = async () => {
// 	try {
// 		aws.config.setPromisesDependency()
// 		const s3 = new aws.S3()
// 		const response = await s3
// 			.listObjectsV2({
// 				Bucket: 'the-hub-development-27ada4be-f93c-4480-920d-21fc583879a1'
// 			})
// 			.promise()
// 		console.log(response)
// 		debugger
// 	} catch (err) {
// 		console.log(err)
// 	}
// }

// TODO: WRITE ACTIVITY LOGGING FUNCTION
// TODO: WRITE TICKET SEARCH ENDPOINT

app.use(express.static(`${__dirname}/../build`));


app.use(express.json())
app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: SESSION_SECRET,
		cookie: { maxAge: 1000 * 60 * 60 * 24 }
	})
)

app.post('/something', (req, res, next) => {
	console.log(req.method)
})

// * Development endpoints
app.post('/seed', devSeed.writeSql, devSeed.seedDb)

// * Auth Endpoints
app.post('/auth/new', authController.createUser)
app.get('/auth/activate', authController.activate)
app.post('/auth/register', authController.register)
app.post('/auth/login', devMiddleware, authController.login)
app.get('/auth/user', authController.getUser)
app.delete('/auth/logout', authController.logout)

// * Ticket Endpoints
app.get('/api/tickets', ticketController.getTickets)
app.get('/api/ticket/:id', ticketController.getTicket)
app.get('/api/ticket/:id/fields', fieldController.getFields)
app.get('/api/ticket/:id/attachments', attachController.getAttachments)
app.post('/api/ticket', ticketController.createTicket)
app.put('/api/ticket/:id', ticketController.updateTicket)
app.get('/api/ticket/:id/messages', msgController.getMessages)
app.post('/api/ticket/:id/message', msgController.createMessage)

// * Config Endpoints
app.get('/api/config', configController.getConfig)
app.get('/api/settings/ticket', configController.ticket)
app.get('/api/users', userController.getUsers)
app.put('/api/users/:id', userController.updateUser)
app.get('/api/users/managers', userController.getManagers)
app.get('/api/user/:id', configController.getUser)

// * Vehicle Endpoints
app.post('/api/vehicle', vehicleController.newVehicle)

massive({
	connectionString: CONNECTION_STRING,
	application_name: 'the-hub',
	ssl: { rejectUnauthorized: false }
}).then(db => {
	app.set('db', db)
	console.log('Database in place')
	app.listen(SERVER_PORT, () => {
		console.log(`Servin and observin port ${SERVER_PORT}`)
	})
})
