import React, { useEffect } from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { requestUser } from '../redux/actions'

const ProtectedRoute = ({ exact = false, path, component, roles }) => {
	const {
			isAuthenticated,
			loading,
			user: { user_group: userGroup }
		} = useSelector(state => state.auth),
		dispatch = useDispatch(),
		location = useLocation()

	const checkRole = roles => {
		if (roles) {
			return roles.includes(userGroup)
		}
		return true
	}
	useEffect(() => {
		dispatch(requestUser())
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
