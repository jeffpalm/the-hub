import axios from 'axios'
import { UPDATE_USER, LOGOUT_USER, REQUEST_USER } from './actionTypes'

export const updateUser = user => {
	return {
		type: UPDATE_USER,
		payload: user
	}
}

export const logoutUser = () => {
	return {
		type: LOGOUT_USER,
		payload: { isAuthenticated: false, user: {} }
	}
}

export const requestUser = () => {
	const payload = axios.get('/auth/user').then(res => res.data)
	return {
		type: REQUEST_USER,
		payload
	}
}
