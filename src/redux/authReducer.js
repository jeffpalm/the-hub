import axios from 'axios'

const initialState = {
	user: {},
	isLoading: false
}

const LOGIN_USER = 'LOGIN_USER'
const GET_USER = 'GET_USER'

export function loginUser(user) {
	return {
		type: LOGIN_USER,
		payload: user
	}
}

export const getUser = () => {
	const res = axios.get('/auth/user')
	return {
		type: GET_USER,
		payload: res.data
	}
}

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_USER + '_PENDING':
			return { ...state, isLoading: true }
		case GET_USER + '_REJECTED':
			return initialState
		case GET_USER + '_FULFILLED':
			return { ...state, isLoading: false, user: action.payload }
		case LOGIN_USER:
			return { ...state, user: action.payload }
		default:
			return initialState
	}
}
