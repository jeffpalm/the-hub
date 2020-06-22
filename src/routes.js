import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import Hub from './components/Hub/Hub'

export default (
	<Switch>
		<Route exact path='/' component={Login} />
		<Route path='/hub' component={Hub} />
	</Switch>
)
