import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'
import Login from './components/Auth/Login'
import Home from './components/Home/Home'
import Ticket from './components/Tickets/Ticket'
import NewTicket from './components/Tickets/NewTicket'

// Check if user is in redux

const Routes = props => {

	return (
		<Switch>
			<Route exact path='/' component={Login} />
			<ProtectedRoute path='/home' component={Home} />
			<ProtectedRoute path='/ticket/:ticketid' component={Ticket} />
			<ProtectedRoute path='/new' component={NewTicket} />
			<Redirect to='/' />
		</Switch>
	)
}

export default Routes