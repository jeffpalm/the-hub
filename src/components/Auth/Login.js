import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { loginUser } from '../../redux/authReducer'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'

const Login = props => {
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
		<div className='login'>
			<img src='/assets/img/The_Hub.png' alt='Hub logo' />
			<Form onSubmit={login}>
				<Form.Group>
					<Form.Control
						className='login-field'
						size='sm'
						placeholder='Email'
						value={email}
						autoFocus
						onChange={e => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
						className='login-field'
						size='sm'
						placeholder='Password'
						value={password}
						type='password'
						onChange={e => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Button variant='outlined' type='submit'>
					Login
				</Button>
			</Form>
			<ToastContainer />
		</div>
	)
}

const mapStateToProps = state => state

export default connect(mapStateToProps, { loginUser })(Login)
