import React from 'react'
import { Switch, Route } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'
import Login from './components/Auth/Login'
import Home from './components/Home/Home'
import Ticket from './components/Tickets/Ticket'
import NewTicket from './components/Tickets/NewTicket'

export default (
	<Switch>
		<Route exact path='/' component={Login} />
		<ProtectedRoute path='/home' component={Home} />
		<ProtectedRoute path='/ticket/:ticketid' component={Ticket} />
		<ProtectedRoute path='/new' component={NewTicket} />
	</Switch>
)
