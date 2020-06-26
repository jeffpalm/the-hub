import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
// import Card from '@material-ui/core/Card'
// import OutlinedInput from '@material-ui/core/OutlinedInput'
// import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
// import RadioGroup from '@material-ui/core/RadioGroup'
// import Switch from '@material-ui/core/Switch'
import { DateTimePicker } from 'formik-material-ui-pickers'
import { Formik, Form, Field } from 'formik'
import { TextField, Switch, RadioGroup } from 'formik-material-ui'
import UpperCasingTextField from './custom/UpperCasingTextField'
import * as Yup from 'yup'

const useStyles = makeStyles(theme => ({
	root: {
		padding: 20,
		flexGrow: 1
	},
	form: {
		padding: theme.spacing(1)
	},
	field: {
		margin: theme.spacing(1),
		padding: theme.spacing(1),
		textAlign: 'center',
		width: '90%',
		'& input': {
			textAlign: 'center'
		}
	}
}))

const NewTicket = props => {
	const classes = useStyles()

	const [ticketSettings, setTicketSettings] = useState({})

	useEffect(() => {
		axios.get('api/ticket?statuses&types&attachment-types').then(res => {
			setTicketSettings(res.data)
		})
	}, [])

	return (
		<div className={classes.root}>
			<Formik
				initialValues={{
					sales_id: props.user.id,
					type: 0,
					message: '',
					vin: '',
					showroom: false,
					isAppointment: false,
					appointment: null,
					guestName: '',
					guestPhone: '',
					isCosigner: false,
					cosignerName: '',
					cosignerPhone: '',
					attachments: []
				}}
				validationSchema={Yup.object({
					guestName: Yup.string().required('Guest Name Required'),
					guestPhone: Yup.string()
						.required('Guest Phone Required')
						.matches(
							/^(?:(\+1)[ -])?\(?(\d{3})\)?[ -]?\.?(\d{3})[ -]?\.?(\d{4})$/,
							'Must be valid Phone Number'
						),
					cosignerName: Yup.string().when('isCosigner', {
						is: true,
						then: Yup.string().required(),
						otherwise: Yup.string()
					}),
					vin: Yup.string()
						.matches(/[A-HJ-NPR-Za-hj-npr-z0-9]{17,17}/g)
						.required('Required'),
					type: Yup.number().required('Please select deal type')
				})}
				onSubmit={(values, { setSubmitting }) => {
					values.guestPhone = values.guestPhone.replace(/[() -]/g, '')
					const {
						sales_id,
						type,
						message,
						vin,
						showroom,
						appointment,
						guestName,
						guestPhone,
						cosignerName,
						cosignerPhone,
						attachments
					} = values

					const output = {
						sales_id: values.sales_id,
						ticket_type: values.type,
						message: values.message,
						vin,
						guest,
						cosigner,
						showroom,
						appointment,
						fields,
						attachments
					}
				}}
			>
				{({ values, submitForm, isSubmitting }) => (
					<Form onSubmit={submitForm}>
						<Grid
							className={classes.form}
							container
							direction='row'
							justify='center'
							alignItems='flex-start'
							spacing={3}
						>
							<Grid item sm={6} xs={12}>
								<Paper>
									<Grid
										item
										container
										direction='column'
										justify='center'
										alignItems='center'
									>
										<FormLabel className={classes.field}>
											Guest Information
										</FormLabel>
										<Field
											autoFocus
											className={classes.field}
											variant='outlined'
											component={TextField}
											name='guestName'
											label='First and Last Name'
										/>
										<Field
											className={classes.field}
											component={TextField}
											variant='outlined'
											name='guestPhone'
											label='Phone'
										/>
									</Grid>
									<Grid
										item
										container
										justify='center'
										alignItems='center'
										direction='column'
									>
										<FormLabel className={classes.field}>Cosigner</FormLabel>
										<Field
											component={Switch}
											type='checkbox'
											name='isCosigner'
										/>
										{values.isCosigner ? (
											<>
												<Field
													variant='outlined'
													className={classes.field}
													component={TextField}
													name='cosignerName'
													label='First and Last Name'
												/>
												<Field
													variant='outlined'
													className={classes.field}
													component={TextField}
													name='cosignerPhone'
													label='Phone'
												/>
											</>
										) : null}
									</Grid>
									<Grid
										item
										container
										direction='column'
										alignItems='center'
										justify='center'
									>
										<FormLabel className={classes.field}>
											Vehicle Information
										</FormLabel>
										<Field
											component={UpperCasingTextField}
											name='vin'
											label='VIN'
											className={classes.field}
											variant='outlined'
										/>
									</Grid>
								</Paper>
							</Grid>
							<Grid item sm={6} xs={12}>
								<Paper>
									<Grid
										item
										container
										direction='column'
										justify='center'
										alignItems='center'
									>
										<FormLabel className={classes.field}>Deal Type</FormLabel>
										<Field
											className={classes.field}
											component={RadioGroup}
											label='Deal Type'
											name='type'
										>
											<Grid container direction='column' alignItems='center'>
												{ticketSettings.types
													? ticketSettings.types.map(type => (
															<FormControlLabel
																color='primary'
																key={type.id}
																label={type.name}
																value={+type.id}
																checked={+values.type === type.id}
																disabled={isSubmitting}
																control={<Radio disabled={isSubmitting} />}
															/>
													  ))
													: null}
											</Grid>
										</Field>
									</Grid>
									<Grid
										item
										container
										justify='center'
										alignItems='center'
										direction='column'
									>
										<FormLabel className={classes.field}>Appointment</FormLabel>
										<Field
											component={Switch}
											name='isAppointment'
											type='checkbox'
										/>
										{values.isAppointment ? (
											<Field
												className={classes.field}
												component={DateTimePicker}
												name='appointment'
												label='Appointmet Date/Time'
												inputVariant='outlined'
												minutesStep={15}
											/>
										) : null}
									</Grid>
									<Grid
										item
										container
										direction='column'
										justify='center'
										alignItems='center'
									>
										<FormLabel className={classes.field}>In Showroom</FormLabel>
										<Field component={Switch} name='showroom' type='checkbox' />
									</Grid>
									<Grid
										item
										container
										direction='column'
										justify='center'
										alignItems='center'
									>
										<FormLabel className={classes.field}>
											Message to Finance Manager
										</FormLabel>
										<Field
											className={classes.field}
											component={TextField}
											multiline
											variant='outlined'
											label='Message to Finance'
											name='message'
											type='textarea'
										/>
									</Grid>
									<Grid
										item
										container
										direction='column'
										justify='center'
										alignItems='center'
									>
										<Button
											className={classes.field}
											color='primary'
											variant='outlined'
											name='Submit'
											label='Submit'
											disabled={isSubmitting}
											onClick={submitForm}
										>
											Submit
										</Button>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</div>
	)
}

const mapStateToProps = state => state.authReducer

export default connect(mapStateToProps)(NewTicket)
