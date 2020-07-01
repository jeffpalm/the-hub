import { UPDATE_USER, LOGOUT_USER, REQUEST_USER } from '../actionTypes'

const initialState = {
	user: {},
	isAuthenticated: false,
	userLoading: true
}

export default function (state = initialState, action) {
	switch (action.type) {
		case REQUEST_USER + '_FULFILLED':
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				userLoading: false
			}
		case REQUEST_USER + '_REJECTED':
			return { ...initialState, userLoading: false }
		case REQUEST_USER + '_PENDING':
			return { ...state, userLoading: true }
		case UPDATE_USER:
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				userLoading: false
			}
		case LOGOUT_USER:
			return { ...state, ...action.payload, userLoading: false }
		default:
			return state
	}
}
