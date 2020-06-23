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
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'

const useStylesTextField = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '25ch'
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
		<Container p={10}>
			<Grid container direction='row' justify='space-around' spacing={3}>
				<Grid item xs={12} sm={6}>
					<Grid container direction='column' justify='center' spacing={3}>
						<Grid item>
							<Paper>
								<List>
									<ListSubheader>Guest Details</ListSubheader>
									<ListItem>
										<ListItemText primary={guest.name} secondary='Guest' />
									</ListItem>
									<ListItem>
										<ListItemText primary={guest.phone} />
									</ListItem>
									{cosigner.id ? (
										<>
											<h3>Cosigner</h3>
											<h4>{cosigner.name}</h4>
											<h4>{cosigner.phone}</h4>
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
									<ListItem>
										<ListItemText primary={vehicle.vin} secondary='VIN' />
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
										tick.closed ? new Date(tick.closed).toLocaleString() : null
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
							{fields.map(f => {
								return <ListItem>{f.name}</ListItem>
							})}
						</List>
					</Paper>
				</Grid>
			</Grid>
			<Grid item sm={2} xs={1}>
				<Paper></Paper>
			</Grid>
			<Grid item sm={2} xs={1}>
				<h3>Attachments</h3>
				{attachments.map(a => {
					return <div key={a.id}>Attachments</div>
				})}
			</Grid>
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
			</Paper>
			<Paper m={1}>
				<form className={classes.root} onSubmit={submitMessage}>
					<TextField
						id='outlined-multiline-static'
						label='New Message'
						multiline
						fullWidth={true}
						variant='outlined'
						value={newMessage}
						onChange={e => setNewMessage(e.target.value)}
					/>
					<Switch
						checked={privateMsg}
						color='default'
						label='private'
						onChange={() => setPrivateMsg(!privateMsg)}
					/>
				</form>
			</Paper>
		</Container>
	)
}

const mapStateToProps = state => state.authReducer

export default connect(mapStateToProps)(Ticket)
