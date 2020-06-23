const initialState = {
	user: {},
	isAuthenticated: false
}

const LOGIN_USER = 'LOGIN_USER'
const USER_TO_REDUX = 'USER_TO_REDUX'

export function loginUser(user) {
	return {
		type: LOGIN_USER,
		payload: user
	}
}

export const userToRedux = user => {
	return {
		type: USER_TO_REDUX,
		payload: user
	}
}

export default function (state = initialState, action) {
	switch (action.type) {
		case USER_TO_REDUX:
			return { ...state, user: action.payload, isAuthenticated: true }
		case LOGIN_USER:
			return { ...state, user: action.payload, isAuthenticated: true }
		default:
			return initialState
	}
}
