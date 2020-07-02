require('dotenv').config()
const express = require('express'),
	app = express(),
	massive = require('massive'),
	session = require('express-session'),
	// aws = require('aws-sdk'),
	authCtrl = require('./controllers/authController'),
	ticketCtrl = require('./controllers/ticketController'),
	vehicleCtrl = require('./controllers/vehicleController'),
	attachCtrl = require('./controllers/attachController'),
	msgCtrl = require('./controllers/msgController'),
	userCtrl = require('./controllers/userController'),
	configCtrl = require('./controllers/configController'),
	apptCtrl = require('./controllers/appointmentController'),
	devMiddleware = require('./development/devMiddleware'),
	devSeed = require('./development/devSeed'),
	tickActivity = require('./middleware/ticketActivityMiddleware'),
	role = require('./middleware/roleCheckMiddleware'),
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

// // TODO: WRITE ACTIVITY LOGGING FUNCTION
// // TODO: WRITE TICKET SEARCH ENDPOINT
// // TODO: Write update type endpoint
// // TODO: Write update message endpoint
// // TODO: Write delete message endpoint
// // TODO: Write update status endpoint

app.use(express.static(`${__dirname}/../build`))

app.use(express.json())
app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: SESSION_SECRET,
		cookie: { maxAge: 1000 * 60 * 60 * 24 }
	})
)

const testMiddleWare = async (req, res, next) => {
	// req.testActivityId = (await db.test_table.insert({name: 'something'})).id
	next()
}
app.get('/something', testMiddleWare, authCtrl.resendActivation)

// TODO: DON'T LEAVE THIS ENDPOINT AVAILABLE
// ! Development endpoints
app.post('/seed', devSeed.writeSql, devSeed.seedDb)

// TODO: USER CREATION
// * Auth Endpoints
// TODO: ADD ADMIN ROLE MIDDLEWARE BACK AFTER TESTING
app.post('/auth/new',  authCtrl.createUser)
app.get('/auth/activate', authCtrl.activate)
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', devMiddleware, authCtrl.login)
app.get('/auth/user', authCtrl.getUser)
app.delete('/auth/logout', authCtrl.logout)
app.post('/auth/reactivate', role.adminsOnly, authCtrl.resendActivation)
app.delete('/auth/user/:id', role.adminsOnly, authCtrl.deleteUser)


// * Ticket Endpoints
app.get('/api/tickets', role.usersOnly, ticketCtrl.getTickets)
app.get('/api/ticket/:id', role.usersOnly, ticketCtrl.getTicket)
app.get(
	'/api/ticket/:id/attachments',
	role.usersOnly,
	attachCtrl.getAttachments
)
app.get('/api/ticket/:id/messages', role.usersOnly, msgCtrl.getMessages)
// * POST TICKET ENDPOINTS
app.post('/api/ticket', ticketCtrl.createTicket)
app.post(
	'/api/ticket/:id/message',
	role.usersOnly,
	tickActivity,
	msgCtrl.createMessage
)
app.post(
	'/api/ticket/:id/attachment',
	role.usersOnly,
	tickActivity,
	attachCtrl.createAttachment
)
app.post(
	'/api/ticket/:id/appointment',
	role.usersOnly,
	tickActivity,
	apptCtrl.createAppointment
)

// * PUT TICKET ENDPOINTS
app.put(
	'/api/ticket/:id/attachment/:attachmentid',
	role.usersOnly,
	tickActivity,
	attachCtrl.updateAttachmentType
)
app.put(
	'/api/ticket/:id/message/:messageid',
	role.usersOnly,
	tickActivity,
	msgCtrl.updateMessage
)
app.put(
	'/api/ticket/:id/status',
	role.managersOnly,
	tickActivity,
	ticketCtrl.updateTicket
)
app.put('/api/ticket/:id/type', tickActivity, ticketCtrl.updateTicket)
app.put(
	'/api/ticket/:id/sales',
	role.managersOnly,
	tickActivity,
	ticketCtrl.updateTicket
)
app.put(
	'/api/ticket/:id/manager',
	role.managersOnly,
	tickActivity,
	ticketCtrl.updateTicket
)
app.put(
	'/api/ticket/:id/guest',
	role.usersOnly,
	tickActivity,
	ticketCtrl.updateTicket
)
app.put(
	'/api/ticket/:id/cosigner',
	role.usersOnly,
	tickActivity,
	ticketCtrl.updateTicket
)
app.put(
	'/api/ticket/:id/vehicle',
	role.usersOnly,
	tickActivity,
	ticketCtrl.updateTicket
)
app.put(
	'/api/ticket/:id/appointment/:appointmentid',
	tickActivity,
	apptCtrl.updateAppointment
)

// * DELETE TICKET ENDPOINTS
app.delete(
	'/api/ticket/:id',
	role.adminsOnly,
	tickActivity,
	ticketCtrl.deleteTicket
)
app.delete(
	'/api/ticket/:id/message/:messageid',
	role.adminsOnly,
	tickActivity,
	msgCtrl.deleteMessage
)
app.delete(
	'/api/ticket/:id/attachment/:attachmentid',
	tickActivity,
	attachCtrl.deleteAttachment
)
app.delete(
	'/api/ticket/:id/appointment/:appointmentid',
	tickActivity,
	apptCtrl.deleteAppointment
)

// * Config Endpoints
app.get('/api/config', role.usersOnly, configCtrl.getConfig)
app.get('/api/settings/ticket', role.usersOnly, configCtrl.ticket)
app.get('/api/users', role.usersOnly, userCtrl.getUsers)
app.get('/api/users/managers', role.usersOnly, userCtrl.getManagers)
app.put('/api/user/:id', role.usersOnly, userCtrl.updateUser)
app.get('/api/user/:id', role.usersOnly, configCtrl.getUser)
app.put('/api/admin/user/:id', role.adminsOnly, userCtrl.adminUpdateUser)

// * Vehicle Endpoints
app.post('/api/vehicle', role.usersOnly, vehicleCtrl.newVehicle)

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
