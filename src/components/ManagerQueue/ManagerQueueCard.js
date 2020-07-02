import React, { useState } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import copy from 'copy-to-clipboard'
import { ToastContainer, toast } from 'react-toastify'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import QueueCardMessages from './QueueCardMessages'
// import Tooltip from '@material-ui/core/Tooltip'
import QueueCardTabs from './QueueCardTabs'
import { ConfirmationDialog } from '../Tickets/ConfirmationDialog'
import {useHistory} from 'react-router-dom'


const useStyles = makeStyles(theme => ({
	root: {
		// width: 530
	},
	pos: {
		marginBottom: 12
	},
	btn: {
		'&:hover': {
			cursor: 'pointer'
		}
	}
}))

const phoneMask = /^\(?(\d{3})\)?[ -]?\.?(\d{3})[ -]?\.?(\d{4})$/gi

const ManagerQueueCard = ({ ticket, ...props }) => {
	const history = useHistory()
	const classes = useStyles()

	const copyToClipboard = text => {
		copy(text)
		toast.success(`${text} Copied!`, { position: 'bottom-left' })
	}
	const statusLookup = {
		Approved: 9,
		Closed: 15,
		Declined: 8,
		New: 1,
		Rehash: 7,
		Sold: 12,
		Working: 4
	}

	const [editStatus, setEditStatus] = useState({
		guest: false,
		cosigner: false,
		sales: false,
		manager: false,
		type: false,
		status: false,
		vehicle: false
	})

	const [expanded, setExpanded] = useState(false)

	const handleExpand = () => setExpanded(!expanded)

	const {
		id,
		guest,
		// guest_id,
		guest_phone,
		// cosigner_name,
		// cosigner_id,
		// cosigner_phone,
		// sales,
		// sales_phone,
		// sales_id,
		// manager,
		// manager_id,
		type,
		// type_id,
		status,
		// status_id,
		// vin,
		// year,
		// make,
		// model,
		// vehicle_ticket_count,
		// created,
		// last_update,
		// showroom
	} = ticket

	return (
		<Card className={classes.root} variant='outlined' {...props}>
			<CardHeader
				title={guest}
				subheader={guest_phone.replace(phoneMask, `($1) $2-$3`)}
				subheaderTypographyProps={{
					className: classes.btn,
					onClick: () => {
						copyToClipboard(guest_phone)
					}
				}}
				avatar={
					<Avatar variant='rounded'>
						{`${guest.substring(0, 1)}${guest.substring(
							guest.indexOf(' ') + 1,
							guest.indexOf(' ') + 2
						)}`}
					</Avatar>
				}
				action={
					<Grid container direction='column' justify='space-between'>
						<Button
							onClick={() => setEditStatus({ ...editStatus, status: true })}
						>
							<Typography variant='h6'>{status}</Typography>
						</Button>
						<ConfirmationDialog
							keepMounted
							classes={{ paper: classes.paper }}
							open={editStatus.status}
							value={ticket.status_id}
							options={
								ticket.status_id
									? [
											{
												label: 'Working',
												value: statusLookup['Working']
											},
											{
												label: 'Approved',
												value: statusLookup['Approved']
											},
											{
												label: 'Declined',
												value: statusLookup['Declined']
											},
											{
												label: 'Rehash',
												value: statusLookup['Rehash']
											},
											{
												label: 'Sold',
												value: statusLookup['Sold']
											}
									  ]
									: []
							}
							onClose={async (type, value) => {
								setEditStatus({ ...editStatus, status: false })

								if (value) {
									try {
										await axios.put(
											`/api/ticket/${ticket.id}/status`,
											{ new_status_id: value }
										)
									} catch (err) {
										if (axios.isCancel(err)) {
											console.log('Update status failed')
										} else {
											throw err
										}
									}
								}
							}}
							tickfieldtype='status'
						/>
						<Button>
							<Typography variant='button'>{type}</Typography>
						</Button>
					</Grid>
				}
			/>
			<Divider />
			<CardContent>
				<QueueCardTabs ticket={ticket} />
			</CardContent>
			<CardActions>
				<Button onClick={() => history.push(`/ticket/${id}`) }>
					Open App
				</Button>
				<IconButton onClick={handleExpand}>
					<ExpandMoreIcon />
				</IconButton>
			</CardActions>
			<Collapse in={expanded} timeout='auto' unmountOnExit>
				<QueueCardMessages ticketId={id} userid={props.userid} />
			</Collapse>
			<ToastContainer />
		</Card>
	)
}

export default ManagerQueueCard
