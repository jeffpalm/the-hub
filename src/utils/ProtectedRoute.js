import React, { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { requestUser, requestConfig } from '../redux/actions'

const ProtectedRoute = ({ exact = false, path, component, roles }) => {
	const {
			isAuthenticated,
			userLoading,
			user: { role }
		} = useSelector(state => state.auth),
		dispatch = useDispatch()

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
				} else if (userLoading) {
					return null
				} else if (isAuthenticated && !checkRole(roles)) {
					return <Redirect to='/unauthorized' />
				} else {
					return <Redirect to='/' />
				}
			})()}
		</>
	)
}

export default ProtectedRoute
