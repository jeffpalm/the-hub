import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { updateUser } from '../../redux/actions'
import { ToastContainer, toast } from 'react-toastify'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: 375
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
	},
	field: {
		padding: theme.spacing(1),
		textAlign: 'center',
		width: '80%',
		'& input': {
			textAlign: 'center'
		}
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
				props.updateUser(res.data)
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
			className={classes.login}
		>
			<Grid item>
				<Grid className={classes.root}>
					<CardMedia
						image='/assets/img/The_Hub.png'
						className={classes.media}
					/>
					<CardContent>
						<form className={classes.container} onSubmit={login}>
							<Grid
								container
								direction='column'
								justify='center'
								align='center'
								spacing={2}
							>
								<Grid item>
									<TextField
										className={classes.field}
										variant='outlined'
										label='Email'
										value={email}
										type='text'
										autoFocus
										onChange={e => setEmail(e.target.value)}
									/>
								</Grid>
								<Grid item>
									<TextField
										className={classes.field}
										variant='outlined'
										label='Password'
										value={password}
										type='password'
										onChange={e => setPassword(e.target.value)}
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
				</Grid>
			</Grid>
			<ToastContainer />
		</Grid>
	)
}

const mapStateToProps = state => state.auth

export default connect(mapStateToProps, { updateUser })(Login)
