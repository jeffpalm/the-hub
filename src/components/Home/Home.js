import React from 'react'
import Tickets from '../Tickets/Tickets'
import { connect } from 'react-redux'

const Hub = props => {
	return (
		<main>
			<h1>Hub Component</h1>
			<Tickets />
		</main>
	)
}

const mapStateToProps = state => state.auth

export default connect(mapStateToProps)(Hub)
