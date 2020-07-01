require('dotenv').config()
const bcrypt = require('bcrypt')
const keygen = require('keygen')
const nodemailer = require('nodemailer')
const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env
const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: 465,
	secure: true,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS
	}
})

const addDays = require('date-fns/addDays')
const compareAsc = require('date-fns/compareAsc')

module.exports = {
	createUser: async (req, res) => {
		const { email, name, phone, role } = req.body,
			db = req.app.get('db'),
			activation = keygen.url(keygen.large),
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
				subject: 'The Hub Account Activation',
				text: `Hey ${name.substring(
					0,
					name.indexOf(' ')
				)}! Please visit the following link to confirm your registration: http://localhost:9000/auth/register?a=${activation}`,
				html: `<h2>Hey ${name.substring(
					0,
					name.indexOf(' ')
				)}!</h2><br><br><a href="http://localhost:9000/auth/activate?a=${activation}&id=${
					newUser.id
				}">Click here to complete your Hub account registration.</a>`
			},
			activationEmail = await db.email_activation.insert({
				user_id: newUser.id,
				activation: activation,
				message,
				expiration: addDays(new Date(), 1)
			})

		transporter.sendMail(message, () => {
			console.log(`Registration email sent to: ${email}`)
		})
		await db.users.update(newUser.id, { activation: activationEmail.id })

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

		const activation = db.email_activation.findOne(user.activation)

		// const authenticated = bcrypt.compareSync(a, activation.activation)

		if (a !== activation.activation) return res.status(403).send('Forbidden')

		// * check if email expired
		if (compareAsc(new Date(), activation.expiration) === 1) {
			return res.status(412).send('Email expired')
		}

		delete user.activation
		delete user.password

		req.session.user = user

		res.status(200).redirect(`/activate`)
	},
	register: async (req, res) => {
		const { id, first, last, phone, password, email } = req.body,
			db = req.app.get('db'),
			user = await db.users.findOne({ email })

		if (!user) return res.status(404).send('User does not exist')

		const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

		const registeredUser = await db.users.update(id, {
			first,
			last,
			phone,
			password: hash,
			activation: ''
		})

		delete registeredUser.password

		req.session.user = registeredUser

		res.status(200).send(req.session)
	},
	login: async (req, res) => {
		const { email, password } = req.body,
			db = req.app.get('db'),
			user = await db.users.findOne({ email })

		if (!user) return res.status(404).send('User does not exist')

		const auth = bcrypt.compareSync(password, user.password)

		if (!auth) return res.status(403).send('User or pass wrong')

		delete user.password

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
	resendActivation: async (req, res) => {}
}
