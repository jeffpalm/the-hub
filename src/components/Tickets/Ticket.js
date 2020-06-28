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
		padding: theme.spacing(1),
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
		ticket: {
			id: '',
			type: '',
			status: '',
			created: '',
			updated: '',
			closed: ''
		},
		sales: {
			id: '',
			name: ''
		},
		manager: {
			id: '',
			name: ''
		},
		guest: {
			id: '',
			name: '',
			phone: ''
		},
		cosigner: {
			id: '',
			name: '',
			phone: ''
		},
		vehicle: {
			vin: '',
			year: '',
			make: '',
			model: '',
			ticketCount: 0
		}
	})
	const [messages, setMessages] = useState([])
	const [fields, setFields] = useState([])
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

	const [edits, setEdits] = useState({ ticketid })

	const submitMessage = e => {
		e.preventDefault()
		axios
			.post(`/api/ticket/${ticketid}/message`, {
				created_by: props.user.id,
				private: privateMsg,
				message: newMessage
			})
			.then(res => {
				setNewMessage('')
				setMessages(res.data)
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
		// ! If user group is manager, get from history endpoint
		axios.get(`/api/ticket/${ticketid}/messages`).then(res => {
			setMessages(res.data)
		})
		axios.get(`/api/ticket/${ticketid}/attachments`).then(res => {
			setAttachments(res.data)
		})
		axios.get(`/api/ticket/${ticketid}/fields`).then(res => {
			setFields(res.data)
		})
	}, [ticketid, ticket])

	const handleClose = (type, newValue) => {
		setEditStatus({ ...editStatus, [type]: false })
		if (newValue) {
			setEdits({ ...edits, [type]: newValue })
			axios.put(`/api/ticket/${ticketid}`, edits).then(res => {
				setTicket({ ...ticket, ...res.data })
				setEdits({ ticketid })
			})
		}
	}

	const { ticket: tick, sales, manager, guest, cosigner, vehicle } = ticket
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
												<ListItemText primary={guest.name} secondary='Guest' />
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
													copyToClipboard(guest.phone)
												}}
											>
												<ListItemText
													primary={guest.phone}
													secondary='Guest Phone'
												/>
											</ListItem>
											{cosigner.id ? (
												<>
													<ListItem>
														<ListItemText
															primary={cosigner.name}
															secondary='Co-Signer Name'
														/>
													</ListItem>
													<ListItem
														button
														onClick={() => {
															copyToClipboard(cosigner.phone)
														}}
													>
														<ListItemText
															primary={cosigner.phone}
															secondary='Co-Signer Phone'
														/>
													</ListItem>
												</>
											) : (
												<ListItem>
													<Button
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
													primary={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
												/>
											</ListItem>
											<ListItem
												button
												onClick={() => {
													copyToClipboard(vehicle.vin)
												}}
											>
												<ListItemText primary={vehicle.vin} secondary='VIN' />
											</ListItem>
										</List>
									</Paper>
								</Grid>
								<Grid item>
									<Paper>
										<List>
											<ListSubheader>App Fields</ListSubheader>
											{fields.map(f => (
												<ListItem key={f.id}>
													<ListItemText
														primary={f.content}
														secondary={f.field_name}
													/>
												</ListItem>
											))}
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
										<ListItemText primary={tick.id} secondary='Ticket ID#' />
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
										<ListItemText primary={tick.type} secondary='Type' />
									</ListItem>
									<ConfirmationDialog
										classes={{ paper: classes.paper }}
										keepMounted
										open={editStatus.type}
										value={tick.type}
										options={['Finance', 'OSF', 'Cash']}
										onClose={handleClose}
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
										<ListItemText primary={tick.status} secondary='Status' />
									</ListItem>
									<ConfirmationDialog
										classes={{ paper: classes.paper }}
										keepMounted
										open={editStatus.status}
										value={tick.status}
										options={[
											'Working',
											'Approved',
											'Declined',
											'Rehash',
											'Sold'
										]}
										onClose={handleClose}
										tickfieldtype='status'
									/>
									<ListItem>
										<ListItemText
											primary={new Date(tick.created).toLocaleString()}
											secondary='Created'
										/>
									</ListItem>
									<ListItem>
										<ListItemText
											primary={
												tick.updated
													? new Date(tick.updated).toLocaleString()
													: null
											}
											secondary='Updated'
										/>
									</ListItem>
									<ListItem>
										<ListItemText
											primary={
												tick.closed
													? new Date(tick.closed).toLocaleString()
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
											primary={sales.name}
											secondary='Experience Guide'
										/>
									</ListItem>
									<ConfirmationDialog
										classes={{ paper: classes.paper }}
										keepMounted
										open={editStatus.sales}
										value={tick.sales}
										options={['SP 1', 'SP 2', 'SP 3', 'SP 4', 'SP 6']}
										onClose={handleClose}
										tickfieldtype='sales'
									/>
									<ListItem>
										<ListItemText
											primary={manager.name}
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
								<ListSubheader>Messages</ListSubheader>
								{messages.map((m, i) => {
									return (
										<ListItem divider key={i}>
											{m.private ? (
												<ListItemIcon>
													<ErrorOutlineOutlinedIcon />
												</ListItemIcon>
											) : null}
											<ListItemText
												className={
													m.private ? classes.privateMsg : classes.message
												}
												primary={m.message}
												secondary={`By ${m.created_by} on ${new Date(
													m.created
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

const mapStateToProps = state => state.auth

export default connect(mapStateToProps)(Ticket)
