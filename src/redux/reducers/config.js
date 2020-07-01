import { REQUEST_CONFIG } from '../actionTypes'

const initialState = {
	admins: [],
	managers: [],
	sales: [],
	roles: [],
	guests: [],
	vehicles: [],
	ticket_types: [],
	ticket_statuses: [],
	attachment_types: [],
	configLoading: true
}

export default function (state = initialState, action) {
	switch (action.type) {
		case REQUEST_CONFIG + '_FULFILLED':
			return { ...state, ...action.payload, configLoading: false }
		case REQUEST_CONFIG + '_PENDING':
			return { ...state, configLoading: true }
		case REQUEST_CONFIG + '_REJECTED':
			return { ...state, configLoading: false }
		default:
			return state
	}
}
