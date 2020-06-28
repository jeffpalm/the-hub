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

module.exports = {
	createUser: async (req, res) => {
		const { email, first, last, created_by, user_group } = req.body,
			db = req.app.get('db'),
			activation = keygen.url(keygen.large),
			newUser = await db.users.insert({
				email,
				first,
				last,
				created_by,
				user_group,
				activation: bcrypt.hashSync(activation, bcrypt.genSaltSync(10))
			}),
			message = {
				from: SMTP_USER,
				to: email,
				subject: 'The Hub Account Activation',
				text: `Hey ${first}! Please visit the following link to confirm your registration: http://localhost:9000/auth/register?a=${activation}`,
				html: `<h2>Hey ${first}!</h2><br><br><a href="http://localhost:9000/auth/activate?a=${activation}&id=${newUser.id}">Click here to complete your Hub account registration.</a>`
			}

		transporter.sendMail(message, () => {
			console.log(`Registration email sent to: ${email}`)
		})

		res.sendStatus(200)
	},
	activate: async (req, res) => {
		const { a, id } = req.query,
			db = req.app.get('db'),
			user = await db.users.findOne({
				id
			})

		if (!user) return res.status(404).send('User does not exist')

		const authenticated = bcrypt.compareSync(a, user.activation)

		if (!authenticated) return res.status(403).send('Forbidden')

		delete user.activation
		delete user.password

		req.session.user = user

		res.status(200).redirect('/#/')
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

		db.users.update(user.id, { last_visit: now })

		res.status(200).send(req.session.user)
	},
	getUser: (req, res) => {
		if (!req.session.user) return res.status(403).send('No user logged in')

		res.status(200).send(req.session.user)
	},
	logout: (req, res) => {
		req.session.destroy()
		res.sendStatus(200)
	}
}
