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
	loading: true
}

export default function (state = initialState, action) {
	switch (action.type) {
		case REQUEST_CONFIG + '_FULFILLED':
			return { ...action.payload, loading: false }
		case REQUEST_CONFIG + '_PENDING':
			return { ...state, loading: true }
		case REQUEST_CONFIG + '_REJECTED':
			return { ...initialState, loading: false }
		default:
			return initialState
	}
}
