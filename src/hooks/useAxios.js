import { useEffect, useReducer, useCallback } from 'react'
import axios from 'axios'

const REQUEST_START = 'REQUEST_START'
const REQUEST_END = 'REQUEST_END'

const reducer = (state, action) => {
	const { type, payload, error } = action

	switch (type) {
		case REQUEST_START:
			return { ...state, isLoading: true }
		case REQUEST_END:
			return {
				...state,
				isLoading: false,
				data: error ? null : payload.data,
				error: error ? payload.data : null,
				response: payload
			}
		default:
			return state
	}
}

const executeRequest = async (axiosConfig, dispatch) => {
	try {
		dispatch({ type: REQUEST_START })
		const response = await axios(axiosConfig)
		dispatch({ type: REQUEST_END, payload: response })
	} catch (error) {
		dispatch({ type: REQUEST_END, payload: error.response, error: true })
	}
}

const useAxios = (config, options) => {
	if (typeof config === 'string') {
		config = {
			url: config
		}
	}

	const stringifiedConfig = JSON.stringify(config)

	options = { manual: false, ...options }

	const [state, dispatch] = useReducer(reducer, {
		data: null,
		error: null,
		isLoading: !options.manual,
		response: null
	})
	const { manual } = options

	useEffect(() => {
		if (!manual) {
			executeRequest(config, dispatch)
		}
	}, [manual, config])

	const reexecute = useCallback(
		configOverride => {
			return executeRequest(
				{
					...config,
					...configOverride
				},
				dispatch
			)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[stringifiedConfig]
	)
	return [state, reexecute]
}

export default useAxios
