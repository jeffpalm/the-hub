import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'
import { ADMIN } from './constants/ROLES'
import NoNoNo from './utils/NoNoNo'
import Login from './components/Auth/Login'
import Home from './components/Home/Home'
import Ticket from './components/Tickets/Ticket'
import NewTicket from './components/Tickets/NewTicket'
import UserManagement from './components/UserManagement/UserManagement'
import Activate from './components/Auth/Activate'

export default (
	<Switch>
		<Route exact path='/' component={Login} />
		<ProtectedRoute path='/home' component={Home} />
		<ProtectedRoute path='/ticket/:ticketid' component={Ticket} />
		<ProtectedRoute path='/new' component={NewTicket} />
		<ProtectedRoute path='/users' roles={[ADMIN]} component={UserManagement} />
		<ProtectedRoute exact path='/activate/complete' component={Activate}/>
		<Route exact path='/unauthorized' component={NoNoNo} />
		<Redirect to='/' />
	</Switch>
)
