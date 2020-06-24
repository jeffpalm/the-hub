import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MaterialTable from 'material-table'
import { makeStyles } from '@material-ui/core/styles'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded'

const useStyles = makeStyles(theme => ({
	speedDial: {
		position: 'absolute',
		'&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
			bottom: theme.spacing(2),
			right: theme.spacing(2)
		},
		'&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
			top: theme.spacing(2),
			left: theme.spacing(2)
		}
	}
}))

const Tickets = props => {
	const classes = useStyles()
	const [tickets, setTickets] = useState([])
	const [open, setOpen] = useState(false)

	const columns = [
		{ title: 'ID', field: 'id' },
		{ title: 'Guest', field: 'guest' },
		{ title: 'EG', field: 'sales' },
		{ title: 'Finance', field: 'manager' },
		{ title: 'Type', field: 'tickettype' },
		{ title: 'Status', field: 'ticketstatus' },
		{ title: 'VIN', field: 'vin' },
		{ title: 'Created', field: 'created' },
		{ title: 'Last update', field: 'lastupdate' }
	]

	const actions = [{ icon: <AddCircleOutlineRoundedIcon />, name: 'New Ticket' , clickAction: () => props.history.push('/new')}]

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	useEffect(() => {
		axios.get('/api/tickets').then(res => {
			setTickets(res.data)
		})
	}, [])
	return (
		<div>
			<MaterialTable
				style={{
					margin: '20px'
				}}
				title='All Tickets'
				columns={columns}
				data={tickets.map(t => {
					return {
						...t,
						created: new Date(t.created).toLocaleString(),
						lastupdate: t.lastupdate
							? new Date(t.lastupdate).toLocaleString()
							: null
					}
				})}
				onRowClick={(e, rowData) => {
					props.history.push(`/ticket/${rowData.id}`)
				}}
			/>
			<SpeedDial
				icon={<SpeedDialIcon />}
				className={classes.speedDial}
				ariaLabel='SpeedDial'
				direction='up'
				onClose={handleClose}
				onOpen={handleOpen}
				open={open}>
				{actions.map(a => (
					<SpeedDialAction
						key={a.name}
						icon={a.icon}
						tooltipTitle={a.name}
						tooltipOpen
						onClick={a.clickAction}
					/>
				))}
			</SpeedDial>
		</div>
	)
}

const mapStateToProps = state => state.authReducer

export default connect(mapStateToProps)(withRouter(Tickets))
