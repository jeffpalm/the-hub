import React from 'react'
// import Tickets from '../Tickets/Tickets'
import ManagerQueue from '../ManagerQueue/ManagerQueue'
import Box from '@material-ui/core/Box'
import { FINANCE_MGR } from '../../constants/ROLES'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	root: {
		boxSizing: 'border-box',
		width: '100vw',
		height: '100vh',
		marginLeft: 0,
		marginRight: 0,
		paddingTop: 64
	}
}))

const Home = () => {
	const classes = useStyles()

	const {
		user: { role }
	} = useSelector(state => state.auth)

	return (
		<Box className={classes.root}>
			{role === FINANCE_MGR ? <ManagerQueue /> : null}
			{/* <Tickets /> */}
		</Box>
	)
}

export default Home
