import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import { DateTimePicker } from '@material-ui/pickers'
import FieldHandler from './FieldHandler'

const useStyles = makeStyles(theme => ({
	root: {
		'& > *': {
			margin: theme.spacing(1)
		},
		marginTop: '20px',
		padding: '20px'
	},
	form: {
		width: '100%',
		padding: theme.spacing(2),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	field: {
		margin: theme.spacing(2)
	}
}))

const NewTicket = props => {
	const classes = useStyles()
	const [newTicket, setNewTicket] = useState({
		sales_id: props.user.id,
		ticket_type: '',
		message: '',
		vin: '',
		showroom: false,
		appointment: '',
		guest: {
			name: '',
			phone: ''
		},
		cosigner: {
			name: '',
			phone: ''
		},
		fields: {},
		attachments: {}
	})
	const [ticketSettings, setTicketSettings] = useState({})
	const [cosigner, setCosigner] = useState(false)
	const [appointment, setAppointment] = useState(false)
	const [showroom, setShowroom] = useState(false)
	const [selectedDate, handleDateChange] = useState(new Date())

	const handleTypes = e => {
		setNewTicket({ ...newTicket, ticket_type: +e.target.value })
	}

	const handleFieldChange = (name, value) => {
		setNewTicket({
			...newTicket,
			fields: { ...newTicket.fields, [name]: value }
		})
	}
	const submitForm = e => {
		e.preventDefault()
	}

	useEffect(() => {
		axios
			.get('api/ticket?statuses&field-types&types&attachment-types')
			.then(res => {
				setTicketSettings(res.data)
			})
	}, [])

	return (
		<Grid
			container
			direction='column'
			alignItems='center'
			justify='center'
			className={classes.root}>
			<Paper style={{ width: '100%', padding: '20px' }}>
				<Typography variant='h3'>New Ticket</Typography>
				<form className={classes.form} onSubmit={submitForm}>
					<Grid item container direction='column'>
						<FormControl required className={classes.field}>
							<FormLabel>Guest Information</FormLabel>
							<TextField
								name='guestName'
								label='First and Last Name'
								fullWidth
								onChange={e =>
									setNewTicket({
										...newTicket,
										guest: {
											...newTicket.guest,
											name: e.target.value
										}
									})
								}
							/>
						</FormControl>
						<FormControl required className={classes.field}>
							<TextField
								name='guestPhone'
								label='Phone'
								fullWidth
								onChange={e =>
									setNewTicket({
										...newTicket,
										guest: {
											...newTicket.guest,
											phone: e.target.value
										}
									})
								}
							/>
						</FormControl>
						<FormControl className={classes.field}>
							<FormControlLabel
								control={
									<Switch
										onChange={() => setCosigner(!cosigner)}
										checked={cosigner}
									/>
								}
								label='Cosigner'
							/>
						</FormControl>
					</Grid>
					{cosigner ? (
						<Grid item container direction='column' justify='center'>
							<FormControl required className={classes.field}>
								<FormLabel>Cosigner Information</FormLabel>
								<TextField
									name='cosignerName'
									label='First and Last Name'
									fullWidth
									onChange={e =>
										setNewTicket({
											...newTicket,
											cosigner: {
												...newTicket.guest,
												name: e.target.value
											}
										})
									}
								/>
							</FormControl>
							<FormControl required className={classes.field}>
								<TextField
									maxLength={10}
									name='cosignerPhone'
									label='Phone'
									fullWidth
									onChange={e =>
										setNewTicket({
											...newTicket,
											cosigner: {
												...newTicket.guest,
												phone: e.target.value
											}
										})
									}
								/>
							</FormControl>
						</Grid>
					) : null}
					<Grid item container direction='column' justify='center'>
						<FormControl required className={classes.field}>
							<FormLabel component='legend'>Vehicle Information</FormLabel>
							<TextField name='vin' label='VIN' fullWidth />
						</FormControl>
					</Grid>
					<Grid item container direction='row' justify='space-around'>
						<FormControl
							required
							className={classes.field}
							component='fieldset'>
							<FormLabel component='legend'>Deal Type</FormLabel>
							<RadioGroup
								label='Deal Type'
								name='type'
								value={newTicket.ticket_type}
								onChange={handleTypes}>
								{ticketSettings.types
									? ticketSettings.types.map(type => (
											<FormControlLabel
												color='primary'
												key={type.id}
												label={type.name}
												value={type.id}
												checked={
													type.id === newTicket.ticket_type ? true : false
												}
												control={<Radio />}
											/>
									  ))
									: null}
							</RadioGroup>
						</FormControl>
						<FormControl required className={classes.field}>
							<FormLabel>Appointment</FormLabel>
							<FormControlLabel
								control={
									<Switch
										onChange={() => setAppointment(!appointment)}
										checked={appointment}
									/>
								}
							/>
							{appointment ? (
								<DateTimePicker
									label='Appointmet Date/Time'
									inputVariant='outlined'
									value={selectedDate}
									onChange={handleDateChange}
									minutesStep={15}
								/>
							) : null}
						</FormControl>
						<FormControl required className={classes.field}>
							<FormLabel>In Showroom</FormLabel>
							<FormControlLabel
								control={
									<Switch
										onChange={() => setShowroom(!showroom)}
										checked={showroom}
									/>
								}
							/>
						</FormControl>
					</Grid>
					<Grid item container direction='column' justify='center'>
						{newTicket.ticket_type
							? ticketSettings.fieldTypes.map(field =>
									field.ticket_type === newTicket.ticket_type ? (
										<FormControl key={field.id} required={field.required}>
											<FieldHandler
												variant='filled'
												handleFieldChange={handleFieldChange}
												value={
													newTicket.fields[field.id]
														? newTicket.fields[field.id]
														: field.default_option
														? field.default_option
														: ''
												}
												name={field.name}
												description={field.description}
												type={field.type}
												isValidated={field.is_validated}
												validOptions={field.valid_options}
												defaultOption={field.default_option}
												id={field.id}
											/>
										</FormControl>
									) : null
							  )
							: null}
					</Grid>
					<Grid item container direction='column' justify='center'>
						<Input type='submit' name='Submit' />
					</Grid>
				</form>
			</Paper>
		</Grid>
	)
}

const mapStateToProps = state => state.authReducer

export default connect(mapStateToProps)(NewTicket)
