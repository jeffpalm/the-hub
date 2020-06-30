import React, { useEffect } from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { requestUser, requestConfig } from '../redux/actions'

const ProtectedRoute = ({ exact = false, path, component, roles }) => {
	const {
			isAuthenticated,
			loading,
			user: { role }
		} = useSelector(state => state.auth),
		dispatch = useDispatch(),
		location = useLocation()

	const checkRole = roles => {
		if (roles) {
			return roles.includes(role)
		}
		return true
	}
	useEffect(() => {
		dispatch(requestUser())
		dispatch(requestConfig())
	}, [dispatch])

	return (
		<>
			{(() => {
				if (isAuthenticated && checkRole(roles)) {
					return <Route exact={exact} path={path} component={component} />
				} else if (loading) {
					return null
				} else {
					return (
						<Redirect
							to={{
								pathname: location.state
									? location.state.from
										? location.state.from
										: '/'
									: '/',
								state: { from: location.pathname }
							}}
						/>
					)
				}
			})()}
		</>
	)
}

export default ProtectedRoute
