import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUser } from '../../redux/authReducer'
import MainMenu from './MainMenu'

const Header = props => {
  const {getUser} = props

	useEffect(() => {
		getUser()
	}, [])
	return (
		<div>
			<MainMenu />
		</div>
	)
}

const mapStateToProps = state => state

export default connect(mapStateToProps, { getUser })(Header)
