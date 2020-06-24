import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { loginUser } from '../../redux/authReducer'
import { ToastContainer, toast } from 'react-toastify'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import 'react-toastify/dist/ReactToastify.css'

const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: 345
	},
	media: {
		width: 200,
		height: 40,
		margin: 30
	},
	container: {
		height: '10rem',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	login: {
		height: '100vh',
		width: '100vw'
	}
}))

const Login = props => {
	const classes = useStyles()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const login = e => {
		e.preventDefault()
		axios
			.post('/auth/login', { email, password })
			.then(res => {
				props.loginUser(res.data)
				props.history.push('/home')
			})
			.catch(err => {
				console.log(err)
				toast.error('Invalid User or Password')
			})
	}

	return (
		<Grid
			container
			direction='column'
			justify='center'
			align='center'
			className={classes.login}>
			<Grid item>
				<Card className={classes.root}>
					<CardMedia image='/assets/img/The_Hub.png' className={classes.media} />
					<CardContent>
						<form className={classes.container} onSubmit={login}>
							<Grid
								container
								direction='column'
								justify='center'
								align='center'
								spacing={2}>
								<Grid item>
									<TextField
										variant='filled'
										label='Email'
										value={email}
										type='text'
										autoFocus
										onChange={e => setEmail(e.target.value)}
										inputProps={{
											style: { textAlign: 'center' }
										}}
									/>
								</Grid>
								<Grid item>
									<TextField
										variant='filled'
										label='Password'
										value={password}
										type='password'
										onChange={e => setPassword(e.target.value)}
										inputProps={{
											style: { textAlign: 'center' }
										}}
										InputLabelProps={{
											style: { textAlign: 'center' }
										}}
									/>
								</Grid>
								<Grid item>
									<Button variant='outlined' type='submit'>
										Login
									</Button>
								</Grid>
							</Grid>
						</form>
					</CardContent>
				</Card>
			</Grid>
			<ToastContainer />
		</Grid>
	)
}

const mapStateToProps = state => state

export default connect(mapStateToProps, { loginUser })(Login)
