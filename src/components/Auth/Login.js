import React, { useState } from 'react'
import { TextField, FormGroup, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { loginUser } from '../../redux/authReducer'
import axios from 'axios'

const Login = props => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const login = e => {
		e.preventDefault()
		axios
			.post('/auth/login', { email, password })
			.then(res => {
				props.history.push('/hub')
				props.loginUser(res.data)
			})
			.catch(err => console.log(err))
	}

	return (
		<div className='login'>
			<img src='/assets/img/The_Hub.png' alt='Hub logo' />
			<form onSubmit={login}>
				<FormGroup className='loginformgroup'>
					<TextField
						label='Email'
						variant='outlined'
						autoFocus
						onChange={e => setEmail(e.target.value)}
					/>
				</FormGroup>
				<FormGroup className='loginformgroup'>
					<TextField
						label='Password'
						variant='outlined'
						type='password'
						onChange={e => setPassword(e.target.value)}
					/>
				</FormGroup>
				<Button variant='outlined' type='submit'>
					Login
				</Button>
			</form>
		</div>
	)
}

const mapStateToProps = state => state

export default connect(mapStateToProps, { loginUser })(Login)
