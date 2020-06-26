import React, { useEffect } from 'react'
import axios from 'axios'
import routes from './routes'
import Header from './components/Header/Header'
import { connect } from 'react-redux'
import { userToRedux } from './redux/authReducer'
import { withRouter } from 'react-router-dom'


const App = props => {
	useEffect(() => {
		axios.get('/auth/user').then(res => {
			if (res.data !== 'No user logged in') {
				props.userToRedux(res.data)
			}
		})
		if (props.isAuthenticated && props.location.pathname === '/') {
			props.history.push('/home')
		}
	}, [props])
	return (
		<>
			{props.isAuthenticated ? <Header /> : null}
			{routes}
		</>
	)
}

const mapStateToProps = state => state.authReducer

export default connect(mapStateToProps, { userToRedux })(withRouter(App))
