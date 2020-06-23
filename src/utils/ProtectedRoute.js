import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ exact = false, path, component, roles }) => {
	const {
		isAuthenticated,
		user: { userGroup }
	} = useSelector(state => state.authReducer)

	const location = useLocation()

	const checkRole = roles => {
		if (roles) {
			return roles.includes(userGroup)
		}
		return true
	}

	return (
		<>
			{isAuthenticated && checkRole(roles) ? (
				<Route exact={exact} path={path} component={component} />
			) : (
				<Redirect to={location ? location.pathname : '/'} />
			)}
		</>
	)
}

export default ProtectedRoute
