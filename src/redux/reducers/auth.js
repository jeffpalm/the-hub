import { UPDATE_USER, LOGOUT_USER, REQUEST_USER } from '../actionTypes'

const initialState = {
	user: {},
	isAuthenticated: false,
	loading: true
}

export default function (state = initialState, action) {
	switch (action.type) {
		case REQUEST_USER + '_FULFILLED':
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				loading: false
			}
		case REQUEST_USER + '_REJECTED':
			return { ...initialState, loading: false }
		case REQUEST_USER + '_PENDING':
			return { ...state, loading: true }
		case UPDATE_USER:
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				loading: false
			}
		case LOGOUT_USER:
			return { ...state, ...action.payload, loading: false }
		default:
			return initialState
	}
}
