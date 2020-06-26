import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import { ToastContainer, toast } from 'react-toastify'
import copy from 'copy-to-clipboard'

const useStylesTextField = makeStyles(theme => ({
	root: {
		width: '100%',
		display: 'flex',
		'& .MuiTextField-root': {
			margin: theme.spacing(1)
		}
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
	const submitMessage = e => {
		e.preventDefault()
		axios
			.post(`/api/ticket/${ticketid}/message`, {
				created_by: props.user.id,
				private: privateMsg,
				message: newMessage
			})
			.then(() => {
				setNewMessage('')
			})
	}

	const copyToClipboard = text => {
		copy(text)
		toast.success(`${text} Copied!`, { position: 'bottom-left' })
	}

	useEffect(() => {
		axios.get(`/api/ticket/${ticketid}`).then(res => {
			setTicket(res.data)
		})
		axios.get(`/api/ticket/${ticketid}/messages`).then(res => {
			setMessages(res.data)
		})
		axios.get(`/api/ticket/${ticketid}/attachments`).then(res => {
			setAttachments(res.data)
		})
		axios.get(`/api/ticket/${ticketid}/fields`).then(res => {
			setFields(res.data)
		})
	}, [ticketid])

	const { ticket: tick, sales, manager, guest, cosigner, vehicle } = ticket
	//#endregion
	return (
		<Container
			p={10}
			style={{
				marginTop: '20px'
			}}>
			<ToastContainer autoClose={3000} />
			<Grid
				container
				direction='column'
				justify='center'
				align='center'
				spacing={3}>
				<Grid container item direction='row' justify='space-around' spacing={3}>
					<Grid item xs={12} sm={6}>
						<Grid container direction='column' justify='center' spacing={3}>
							<Grid item>
								<Paper>
									<List>
										<ListSubheader>Guest Details</ListSubheader>
										<ListItem>
											<ListItemText primary={guest.name} secondary='Guest' />
										</ListItem>
										<ListItem
											button
											onClick={() => {
												copyToClipboard(guest.phone)
											}}>
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
													}}>
													<ListItemText
														primary={cosigner.phone}
														secondary='Co-Signer Phone'
													/>
												</ListItem>
											</>
										) : null}
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
											}}>
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
								<ListItem>
									<ListItemText primary={tick.type} secondary='Type' />
								</ListItem>
								<ListItem>
									<ListItemText primary={tick.status} secondary='Status' />
								</ListItem>
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
								<ListItem>
									<ListItemText
										primary={sales.name}
										secondary='Experience Guide'
									/>
								</ListItem>
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
									<ListItem key={i}>
										<ListItemText
											primary={m.message}
											secondary={`By ${m.created_by} on ${new Date(
												m.created
											).toLocaleString()}`}
										/>
									</ListItem>
								)
							})}
						</List>
						<form className={classes.root} onSubmit={submitMessage}>
							<TextField
								id='outlined-multiline-static'
								label={privateMsg ? 'New Private Message' : 'New Message'}
								fullWidth={true}
								color={privateMsg ? 'secondary' : 'primary'}
								variant='filled'
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
		</Container>
	)
}

const mapStateToProps = state => state.authReducer

export default connect(mapStateToProps)(Ticket)
