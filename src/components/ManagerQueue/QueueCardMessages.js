 import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import CardContent from '@material-ui/core/CardContent'
import actions from '../../constants/ACTIONS'
import activities from '../../constants/ACTIVITY'
import NewTicketMessage from './NewTicketMessage'

const useStyles = makeStyles(theme => ({
	message: {},
	privateMsg: {
		textAlign: 'right',
		color: theme.palette.getContrastText(theme.palette.background.paper)
	},
	root: {
		maxWidth: 516
	}
}))

const QueueCardMessages = ({ ticketId, ...props }) => {
	const classes = useStyles()
	const [activity, setActivity] = useState([])

	useEffect(() => {
		const CancelToken = axios.CancelToken
		const source = CancelToken.source()

		const loadTickets = async () => {
			try {
				const res = await axios.get(`/api/ticket/${ticketId}/messages?desc=true`, {
					cancelToken: source.token
				})

				setActivity(res.data)
			} catch (err) {
				if (axios.isCancel(err)) {
					console.log('cancelled')
				} else {
					throw err
				}
			}
		}
		loadTickets()
		return () => {
			source.cancel()
		}
	}, [ticketId])

	const handleNewMessage = (e, privateMsg, newMessage) => {
		e.preventDefault()
		axios
			.post(`/api/ticket/${ticketId}/message?desc=true`, {
				created_by: props.userid,
				private: privateMsg,
				message: newMessage
			})
			.then(res => {
				setActivity(res.data)
			})
	}

	return (
		<CardContent {...props} className={classes.root}>
			<NewTicketMessage handleSubmit={handleNewMessage} />
			<List>
				<ListSubheader>Finance App Activity</ListSubheader>
				{activity.map((a, i) => (
					<ListItem key={i} divider>
						<ListItemText
							className={a.private ? classes.privateMsg : classes.message}
							primary={a.current}
							secondary={`${activities[a.activity]} ${actions[a.action]} By ${
								a.user
							} on ${new Date(a.logged).toLocaleString()}`}
						/>
					</ListItem>
				))}
			</List>
		</CardContent>
	)
}

export default QueueCardMessages
