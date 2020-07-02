import React, { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
// ! MATERIAL UI IMPORTS
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import IconButton from '@material-ui/core/IconButton'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
// ! MISC IMPORTS
import { ToastContainer, toast } from 'react-toastify'
import copy from 'copy-to-clipboard'
// Icon Imports
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
// ! Custom Component Imports
import { ConfirmationDialog } from './ConfirmationDialog'
// ! CONSTANTS
import actions from '../../constants/ACTIONS'
import activities from '../../constants/ACTIVITY'

export const TicketEditContext = createContext()

const useStylesTextField = makeStyles(theme => ({
	root: {
		marginTop: 80
	},
	newMessage: {
		width: '100%',
		display: 'flex',
		'& .MuiTextField-root': {
			margin: theme.spacing(1)
		}
	},
	field: {
		margin: theme.spacing(1),
		// padding: theme.spacing(1),
		textAlign: 'center',
		width: '90%',
		'& input': {
			textAlign: 'center'
		}
	},
	message: {},
	privateMsg: {
		textAlign: 'right'
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: 'white'
	},
	addCosigner: {
		textAlign: 'right'
	},
	editField: {
		margin: theme.spacing(1),
		padding: theme.spacing(1),
		textAlign: 'center',
		width: '90%',
		'& input': {
			textAlign: 'center'
		}
	},
	paper: {
		width: '80%',
		maxHeight: 435
	}
}))

const Ticket = props => {
	const classes = useStylesTextField()
	//#region
	const [ticket, setTicket] = useState({
		sales: '',
		manager: '',
		guest: '',
		id: 0,
		guest_id: 0,
		guest_phone: '',
		cosigner_name: '',
		cosigner_id: 0,
		cosigner_phone: '',
		sales_phone: '',
		sales_id: 0,
		manager_id: 0,
		type: '',
		type_id: 0,
		type_weight: '',
		status: '',
		status_lifecycle: '',
		status_id: 0,
		vin: '',
		year: '',
		make: '',
		model: '',
		vehicle_ticket_count: '',
		created: '',
		last_update: '',
		showroom: ''
	})
	const [activity, setActivity] = useState([])
	const [attachments, setAttachments] = useState([])

	const { ticketid } = props.match.params

	//New Ticket Message
	const [newMessage, setNewMessage] = useState('')
	const [privateMsg, setPrivateMsg] = useState(false)

	const [editStatus, setEditStatus] = useState({
		guest: false,
		cosigner: false,
		sales: false,
		manager: false,
		type: false,
		status: false,
		vehicle: false
	})

	const statusLookup = {
		Approved: 9,
		Closed: 15,
		Declined: 8,
		New: 1,
		Rehash: 7,
		Sold: 12,
		Working: 4
	}

	// const [edits, setEdits] = useState({ ticketid })

	const submitMessage = e => {
		e.preventDefault()
		axios
			.post(`/api/ticket/${ticketid}/message`, {
				created_by: props.auth.user.id,
				private: privateMsg,
				message: newMessage
			})
			.then(res => {
				setNewMessage('')
				setActivity(res.data)
			})
	}

	const copyToClipboard = text => {
		copy(text)
		toast.success(`${text} Copied!`, { position: 'bottom-left' })
	}

	useEffect(() => {
		axios.get(`/api/ticket/${ticketid}`).then(res => {
			setTicket({ ...ticket, ...res.data })
		})
		axios.get(`/api/ticket/${ticketid}/messages`).then(res => {
			setActivity(res.data)
		})
		axios.get(`/api/ticket/${ticketid}/attachments`).then(res => {
			setAttachments(res.data)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticketid])

	// const handleClose = (type, newValue) => {
	// 	setEditStatus({ ...editStatus, [type]: false })
	// 	if (newValue) {
	// 		setEdits({ ...edits, [type]: newValue })
	// 		axios.put(`/api/ticket/${ticketid}`, edits).then(res => {
	// 			setTicket({ ...ticket, ...res.data })
	// 			setEdits({ ticketid })
	// 		})
	// 	}
	// }
	const { guest } = ticket
	//#endregion
	return (
		<Container className={classes.root} p={10}>
			{/* <Backdrop open={editing} className={classes.backdrop} /> */}
			<ToastContainer autoClose={3000} />
			<TicketEditContext.Provider value={[editStatus, setEditStatus]}>
				<Grid
					container
					direction='column'
					justify='center'
					align='center'
					spacing={3}
				>
					<Grid
						container
						item
						direction='row'
						justify='space-around'
						spacing={3}
					>
						<Grid item xs={12} sm={6}>
							<Grid container direction='column' justify='center' spacing={3}>
								<Grid item>
									<Paper>
										<List>
											<ListSubheader>Guest Details</ListSubheader>
											<ListItem>
												<ListItemText primary={guest} secondary='Guest' />
												<ListItemSecondaryAction>
													<IconButton
														onClick={() => {
															setEditStatus({ ...editStatus, guest: true })
														}}
													>
														<EditIcon />
													</IconButton>
												</ListItemSecondaryAction>
											</ListItem>
											<ListItem
												button
												onClick={() => {
													copyToClipboard(ticket.guest_phone)
												}}
											>
												<ListItemText
													primary={ticket.guest_phone}
													secondary='Guest Phone'
												/>
											</ListItem>
											{ticket.cosigner_id ? (
												<>
													<ListItem>
														<ListItemText
															primary={ticket.cosigner_name}
															secondary='Co-Signer Name'
														/>
													</ListItem>
													<ListItem
														button
														onClick={() => {
															copyToClipboard(ticket.cosigner_phone)
														}}
													>
														<ListItemText
															primary={ticket.cosigner_phone}
															secondary='Co-Signer Phone'
														/>
													</ListItem>
												</>
											) : (
												<ListItem>
													<Button // TODO: ADD ADD COSIGNER ACTION
														variant='outlined'
														color='primary'
														endIcon={<AddIcon />}
													>
														Add Co-signer
													</Button>
												</ListItem>
											)}
										</List>
									</Paper>
								</Grid>
								<Grid item>
									<Paper>
										<List>
											<ListSubheader>Vehicle Details</ListSubheader>
											<ListItem>
												<ListItemText
													primary={`${ticket.year} ${ticket.make} ${ticket.model}`}
												/>
											</ListItem>
											<ListItem
												button
												onClick={() => {
													copyToClipboard(ticket.vin)
												}}
											>
												<ListItemText primary={ticket.vin} secondary='VIN' />
											</ListItem>
										</List>
									</Paper>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Paper>
								<List>
									<ListSubheader>App Details</ListSubheader>
									<ListItem>
										<ListItemText primary={ticket.id} secondary='Ticket ID#' />
									</ListItem>
									<ListItem
										button
										onClick={() => {
											setEditStatus({
												...editStatus,
												type: !editStatus.type
											})
										}}
									>
										<ListItemText primary={ticket.type} secondary='Type' />
									</ListItem>
									<ConfirmationDialog
										keepMounted
										classes={{ paper: classes.paper }}
										open={editStatus.type}
										value={ticket.type_id}
										options={[
											{ label: 'Finance', value: 1 },
											{ label: 'OSF', value: 2 },
											{ label: 'Cash', value: 3 }
										]}
										onClose={async (type, value) => {
											setEditStatus({ ...editStatus, [type]: false })
											if (value) {
												try {
													const res = await axios.put(
														`/api/ticket/${ticket.id}/type`,
														{ new_type_id: value }
													)

													setTicket(res.data)
												} catch (err) {
													if (axios.isCancel(err)) {
														console.log('Update type failed')
													} else {
														throw err
													}
												}
											}
										}}
										tickfieldtype='type'
									/>
									<ListItem
										button
										onClick={() => {
											setEditStatus({
												...editStatus,
												status: !editStatus.status
											})
										}}
									>
										<ListItemText primary={ticket.status} secondary='Status' />
									</ListItem>
									<ConfirmationDialog
										keepMounted
										classes={{ paper: classes.paper }}
										open={editStatus.status}
										value={ticket.status_id}
										options={
											ticket.type_id
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
											setEditStatus({ ...editStatus, [type]: false })
											if (value) {
												try {
													const res = await axios.put(
														`/api/ticket/${ticket.id}/status`,
														{ new_status_id: value }
													)

													setTicket(res.data)
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
									<ListItem>
										<ListItemText
											primary={new Date(ticket.created).toLocaleString()}
											secondary='Created'
										/>
									</ListItem>
									<ListItem>
										<ListItemText
											primary={
												ticket.updated
													? new Date(ticket.updated).toLocaleString()
													: null
											}
											secondary='Updated'
										/>
									</ListItem>
									<ListItem>
										<ListItemText
											primary={
												ticket.closed
													? new Date(ticket.closed).toLocaleString()
													: null
											}
											secondary='Closed'
										/>
									</ListItem>
									<ListItem
										button
										onClick={() => {
											setEditStatus({
												...editStatus,
												sales: !editStatus.sales
											})
										}}
									>
										<ListItemText
											primary={ticket.sales}
											secondary='Experience Guide'
										/>
									</ListItem>
									<ConfirmationDialog
										keepMounted
										classes={{ paper: classes.paper }}
										open={editStatus.sales}
										value={ticket.sales_id}
										options={props.config.sales.map((s, i) => ({
											label: s.name,
											value: s.id
										}))}
										onClose={async (type, value) => {
											setEditStatus({ ...editStatus, [type]: false })
											if (value) {
												try {
													const res = await axios.put(
														`/api/ticket/${ticket.id}/sales`,
														{ new_sales_id: value }
													)

													setTicket(res.data)
												} catch (err) {
													if (axios.isCancel(err)) {
														console.log('Update sales failed')
													} else {
														throw err
													}
												}
											}
										}}
										tickfieldtype='sales'
									/>
									<ListItem>
										<ListItemText
											primary={ticket.manager}
											secondary='Finance Manager'
										/>
									</ListItem>
								</List>
							</Paper>
						</Grid>
					</Grid>
					<Grid item>
						<Paper sm={2} xs={1}>
							<List>
								<ListItem>
									<Button
										variant='outlined'
										color='primary'
										endIcon={<AddIcon />}
									>
										Add Attachment
									</Button>
								</ListItem>
								<ListSubheader>Attachments</ListSubheader>
								{attachments.map(a => {
									return (
										<ListItem key={a.id}>
											<ListItemText primary={a.filepath} secondary={a.name} />
										</ListItem>
									)
								})}
							</List>
						</Paper>
					</Grid>

					<Grid item>
						<Paper>
							<List>
								<ListSubheader>Finance App Activity</ListSubheader>
								{activity.map((a, i) => {
									return (
										<ListItem divider key={i}>
											{a.private ? (
												<ListItemIcon>
													<ErrorOutlineOutlinedIcon />
												</ListItemIcon>
											) : null}
											<ListItemText
												className={
													a.private ? classes.privateMsg : classes.message
												}
												primary={a.current}
												secondary={`${activities[a.activity]} ${
													actions[a.action]
												} By ${a.user} on ${new Date(
													a.logged
												).toLocaleString()}`}
											/>
										</ListItem>
									)
								})}
							</List>
							<form className={classes.newMessage} onSubmit={submitMessage}>
								<TextField
									className={classes.field}
									label={privateMsg ? 'New Private Message' : 'New Message'}
									color={privateMsg ? 'secondary' : 'primary'}
									variant='outlined'
									value={newMessage}
									error={privateMsg}
									onChange={e => setNewMessage(e.target.value)}
								/>
								<FormControlLabel
									control={
										<Switch
											checked={privateMsg}
											color='secondary'
											onChange={() => setPrivateMsg(!privateMsg)}
										/>
									}
									label='Private'
									color={privateMsg ? 'secondary' : 'primary'}
									variant='filled'
								/>
							</form>
						</Paper>
					</Grid>
				</Grid>
			</TicketEditContext.Provider>
		</Container>
	)
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Ticket)
