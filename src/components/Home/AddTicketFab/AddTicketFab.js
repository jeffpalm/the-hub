import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
	fab: {
		position: 'fixed',
		bottom: 10,
		right: 10
	}
}))

const AddTicketFab = props => {
	const classes = useStyles()
	return (
		<Tooltip title='New Ticket' placement='left-start'>
			<Fab
				className={classes.fab}
				color='primary'
				onClick={() => props.history.push('/new')}
			>
				<AddIcon />
			</Fab>
		</Tooltip>
	)
}

export default withRouter(AddTicketFab)
