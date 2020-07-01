import React from 'react'
// import Tickets from '../Tickets/Tickets'
import ManagerQueue from '../ManagerQueue/ManagerQueue'
import Box from '@material-ui/core/Box'
import { FINANCE_MGR, EG, ADMIN } from '../../constants/ROLES'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import AddTicketFab from './AddTicketFab/AddTicketFab'

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
			{role === EG || role === ADMIN ? <AddTicketFab /> : null}
		</Box>
	)
}

export default Home
