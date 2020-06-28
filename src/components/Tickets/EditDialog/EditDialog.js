import React, { useState, useEffect, useContext } from 'react'
import { TicketEditContext } from '../Ticket'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const EditDialog = props => {
	const { edit, open, ticket, ...rest } = props

	const [ticketEdit, setTicketEdit] = useContext(TicketEditContext)

	const [fields, setFields] = useState([])


	const closeDialog = () => {
		setTicketEdit({ ...ticketEdit, [edit]: false })
	}

	// ? onClose parameter for Dialog?
	return (
		<Dialog {...props} open={open}>
			<DialogTitle>Edit Ticket</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Any changes you make will be saved
				</DialogContentText>
				{(() => {
					switch (edit) {
						case 'guest':
							return (
								<>
									<TextField
										{...rest}
										autoFocus
										variant='outlined'
										name='guestName'
										label='First and Last Name'
									/>
									<TextField
										{...rest}
										variant='outlined'
										name='guestPhone'
										label='Phone'
									/>
								</>
							)
						case 'cosigner':
							return (
								<>
									<TextField
										{...rest}
										autoFocus
										variant='outlined'
										name='cosignerName'
										label='First and Last Name'
									/>
									<TextField
										{...rest}
										variant='outlined'
										name='cosignerPhone'
										label='Phone'
									/>
								</>
							)
						case 'vehicle':
							return (
								<TextField
									{...rest}
									autoFocus
									variant='outlined'
									name='vin'
									label='First and Last Name'
								/>
							)
						default:
							throw new Error()
					}
				})()}
			</DialogContent>
			<DialogActions>
				<Button onClick={() => closeDialog()} color='secondary'>
					Cancel
				</Button>
				<Button onClick={() => closeDialog()} color='primary'>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default EditDialog
