import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const useStyles = makeStyles(theme => ({
	newMessage: {
		width: '100%',
		display: 'flex'
	},
	field: {
		margin: theme.spacing(1),
		textAlign: 'center',
		width: '90%',
		'& input': {
			textAlign: 'center'
		}
	}
}))

const NewTicketMessage = ({ handleSubmit, props }) => {
	const classes = useStyles()
	const [newMessage, setNewMessage] = useState('')
	const [privateMsg, setPrivateMsg] = useState(false)

	return (
		<form
			className={classes.newMessage}
			onSubmit={(e) => {
				handleSubmit(e, privateMsg, newMessage)
				setNewMessage('')
			}}
			{...props}
		>
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
	)
}

export default NewTicketMessage
