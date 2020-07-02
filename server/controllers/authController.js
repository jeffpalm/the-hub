require('dotenv').config()
const bcrypt = require('bcrypt')
const keygen = require('keygen')
const addDays = require('date-fns/addDays')
const compareAsc = require('date-fns/compareAsc')
const nodemailer = require('nodemailer')
const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env
const hbs = require('nodemailer-express-handlebars')
const options = {
	viewEngine: {
		extname: '.hbs',
		layoutsDir: __dirname + '/../templates',
		defaultLayout: 'activation',
		partialsDir: __dirname + '/../templates'
	},
	viewPath: __dirname + '/../templates',
	extName: '.hbs'
}

const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: 465,
	secure: true,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS
	}
})
transporter.use('compile', hbs(options))

// const transporterTest = nodemailer.createTransport({
// 	host: 'smtp.ethereal.email',
// 	port: 587,
// 	auth: {
// 		user: 'darrin79@ethereal.email',
// 		pass: 'baRPQ8ZFc5sZ1uPJmW'
// 	}
// })

module.exports = {
	createUser: async (req, res) => {
		const { email, name, phone, role } = req.body,
			db = req.app.get('db'),
			activation = keygen.url(keygen.large),
			activationHash = bcrypt.hashSync(activation, bcrypt.genSaltSync(10)),
			newUser = await db.users.insert({
				email,
				name,
				phone,
				role,
				available: false,
				activated: false
			}),
			message = {
				from: SMTP_USER,
				to: email,
				subject: 'Hub Account Activation',
				template: 'activation',
				context: {
					first: name.substring(0, name.indexOf(' ')),
					activation: `http://localhost:9000/auth/activate?a=${activation}&id=${newUser.id}`
				}
			},
			activationEmail = await db.email_activation.insert({
				user_id: newUser.id,
				activation: activationHash,
				to: email,
				expiration: addDays(new Date(), 1)
			})

		await db.users.update(newUser.id, { activation: activationEmail.id })

		transporter.sendMail(message, async (error, info) => {
			await db.email_log.insert({ error, info, message })
			if (error) return res.status(500).send(error)
			console.log(`Registration email sent`)
		})

		const response = await db.get_all_users()

		res.status(200).send(response)
	},
	activate: async (req, res) => {
		const { a, id } = req.query,
			db = req.app.get('db'),
			user = await db.users.findOne({
				id
			})

		if (!user) return res.status(404).send('User does not exist')

		// Get activation from email_activation table

		const activation = await db.email_activation.findOne(user.activation)

		const authenticated = bcrypt.compareSync(a, activation.activation)

		console.log('activation: ', activation.activation)
		console.log('a: ', a)

		if (!authenticated) return res.status(403).send('Forbidden')

		// * check if email expired
		if (compareAsc(new Date(), activation.expiration) === 1) {
			return res.status(412).send('Email expired')
		}

		delete user.activation
		delete user.password

		req.session.user = user

		res.status(200).redirect(`/#/activate/complete`)
	},
	register: async (req, res) => {
		const { id, name, phone, password } = req.body,
			db = req.app.get('db'),
			user = await db.users.findOne({ id })

		if (!user) return res.status(404).send('User does not exist')

		const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

		const registeredUser = await db.users.update(id, {
			name,
			phone,
			password: hash,
			activation: null,
			activated: true,
			last_visit: new Date()
		})

		await db.email_activation.destroy(user.activation)

		delete registeredUser.password
		delete registeredUser.activation

		req.session.user = registeredUser

		res.status(200).send(req.session)
	},
	login: async (req, res) => {
		const { email, password } = req.body,
			db = req.app.get('db'),
			user = await db.users.findOne({ email })

		if (!user) return res.status(404).send('User does not exist')

		const authenticated = bcrypt.compareSync(password, user.password)

		if (!authenticated) return res.status(403).send('User or pass wrong')

		delete user.password
		delete user.activation

		req.session.user = user

		const now = new Date()

		await db.users.update(user.id, { last_visit: now })

		res.status(200).send(req.session.user)
	},
	getUser: (req, res) => {
		if (!req.session.user) return res.status(403).send('No user logged in')

		res.status(200).send(req.session.user)
	},
	logout: (req, res) => {
		req.session.destroy()
		res.sendStatus(200)
	},
	// TODO: Write and test activation process
	resendActivation: async (req, res) => {
		const db = req.app.get('db'),
			{ id, name, email } = req.body,
			activation = keygen.url(keygen.large), // * Generate new activation token
			activationHash = bcrypt.hashSync(activation, bcrypt.genSaltSync(10))

		// * Generate new message

		const message = {
			from: SMTP_USER,
			to: email,
			subject: 'Hub Account Activation',
			template: 'activation',
			context: {
				first: name.substring(0, name.indexOf(' ')),
				activation: `http://localhost:9000/auth/activate?a=${activation}&id=${id}`
			}
		}

		// * Get old email activation record ID

		const { activation: oldActivation } = await db.users.findOne(id)

		// * Insert new email activation record

		const newActivation = await db.email_activation.insert({
			user_id: id,
			activation: activationHash,
			to: email,
			expiration: addDays(new Date(), 1)
		})

		// * Send new message
		transporter.sendMail(message, async (error, info) => {
			await db.email_log.insert({ error, info, message })
			if (error) return res.status(500).send(error)
			console.log(`Registration email sent`)
		})
		// * Update user with new activation ID
		await db.users.update(id, { activation: newActivation.id })

		// * Delete old email activation record

		await db.email_activation.destroy(oldActivation)

		res.sendStatus(200)
	},
	deleteUser: async (req, res) => {
		const db = req.app.get('db'),
			{ id } = req.params,
			{ modified_by } = req.body,
			user = await db.users.findOne(id)

		try {
			await db.delete_user(id)
		} catch (err) {
			console.error(err)
			return res
				.status(500)
				.send(
					'Whoops! Something went wrong when trying to delete. Check server console'
				)
		}

		try {
			await db.user_modification_log.insert({
				action: 'deleted',
				previous: user,
				modified_by
			})
		} catch (err) {
			console.log('Error when trying to add to user_modification_log', err)
		}
		res.sendStatus(200)
	}
}
