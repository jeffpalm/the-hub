import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputBase from '@material-ui/core/InputBase'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import CustomTextMask from './CustomTextMask/CustomTextMask'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
	root: {
		width: '100vw'
	},
	main: {
		width: '100%'
	},
	field: {
		fontSize: theme.typography.h2.fontSize,
		margin: theme.spacing(1),
		textAlign: 'center',
		width: '90%',
		transition: '150ms color linear',
		color: '#f42434',
		'& input': {
			textAlign: 'center'
		},
		'& :disabled': {
			color: 'white'
		},
		'&confirmed': {
			'& :disabled': {
				color: theme.palette.primary.main,
				fontSize: theme.typography.h2.fontSize,
				margin: theme.spacing(1),
				textAlign: 'center',
				width: '100%',
				transition: '150ms color linear'
			}
		}
	},
	password: {
		fontSize: theme.typography.h5.fontSize,
		margin: theme.spacing(1),
		textAlign: 'center',
		width: '90%',
		maxWidth: 450,
		'& input': {
			textAlign: 'center'
		}
	},
	red: {
		color: '#f42434',
		borderColor: '#f42434'
	},
	buttons: {
		margin: theme.spacing(1)
	},
	summaryField: {
		fontSize: theme.typography.h4.fontSize,
		margin: theme.spacing(1),
		textAlign: 'center',
		width: '90%',
		transition: '150ms color linear'
	},
	summaryDialog: {
		width: '90%',
		maxWidth: 500,
		minHeight: 400
	},
	summaryTitle: {
		fontSize: theme.typography.h3.fontSize
	},
	backdrop: {
		zIndex: theme.zIndex.appBar + 1
	}
}))

const Activate = props => {
	const classes = useStyles()
	const history = useHistory()

	const [userInfo, setUserInfo] = useState({})
	const [userPassword, setUserPassword] = useState('')
	const [passwordVisible, setPasswordVisible] = useState(false)

	const [transitions, setTransitions] = useState({})

	const [confirmations, setConfirmations] = useState({
		name: null,
		phone: null,
		password: null,
		summary: null
	})

	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async () => {
		const output = {
			...userInfo,
			phone: userInfo.phone.replace(/[() -]/g, ''),
			password: userPassword
		}
		try {
			await axios.post('/auth/register', { ...output })
		} catch (err) {
			alert('Whoops! Something went wrong...')
			throw err
		} finally {
			setTimeout(() => {
				history.push('/home')
			}, 1000)
		}
	}
	const phoneRegex = /^(?:(\+1)[ -])?\(?(\d{3})\)?[ -]?\.?(\d{3})[ -]?\.?(\d{4})$/

	const timing = {
		welcome: { enter: 3000, exit: 500 },
		preName: { enter: 1000, exit: 500 },
		name: { enter: 500, exit: 500 },
		nameConfirmBtn: { enter: 500, exit: 500 },
		nameEditBtn: { enter: 500, exit: 500 },
		nameError: { enter: 500, exit: 500 },
		prePhone: { enter: 1000, exit: 1000 },
		phone: { enter: 500, exit: 500 },
		phoneConfirmBtn: { enter: 500, exit: 500 },
		phoneEditBtn: { enter: 500, exit: 500 },
		phoneError: { enter: 1000, exit: 500 },
		prePass: { enter: 1000, exit: 500 },
		password: { enter: 1000, exit: 500 },
		passwordConfirmBtn: { enter: 500, exit: 500 },
		summary: { enter: 1000, exit: 1000 },
		submitBtn: { enter: 500, exit: 500 },
		lastStepOne: { enter: 1000, exit: 1000 },
		lastStepTwo: { enter: 1000, exit: 1000 },
		lastStepThree: { enter: 1500, exit: 1500 }
	}

	const text = {
		welcome: `Welcome!`,
		preName: `First, let's make sure we have your name is spelled correctly`,
		name: null,
		nameConfirmBtn: `Spelled Correctly`,
		nameEditBtn: `I see a typo`,
		nameError: `Good eye! Go ahead make it right`,
		prePhone: `How about your phone number?`,
		phone: null,
		phoneConfirmBtn: `Looks good!`,
		phoneEditBtn: `That's not my number`,
		phoneError: `That would be no bueno! Glad you caught it!`,
		prePass: `Last and necessary to pass...`,
		passwordConfirmBtn: `I can remember this password`,
		password: `Pick a password por favor...`,
		summaryTitle: `Summary`,
		summary: `Everything look good?`,
		submitBtn: `Finish up`,
		lastStepOne: `Checking with my guy... Making sure you're legit...`,
		lastStepTwo: `Alright you good...`,
		lastStepThree: `The Hub is yours`
	}

	const onEntered = {
		welcome: () => {
			setTransitions({ ...transitions, preName: true })
		},
		preName: () => {
			setTransitions({ ...transitions, welcome: false, preName: false })
		},
		name: () =>
			setTransitions({
				...transitions,
				nameConfirmBtn: true,
				nameEditBtn: true
			}),
		nameConfirmBtn: null,
		nameEditBtn: null,
		nameError: null,
		prePhone: () => setTransitions({ ...transitions, prePhone: false }),
		phone: () =>
			setTransitions({
				...transitions,
				phoneConfirmBtn: true,
				phoneEditBtn: true
			}),
		phoneConfirmBtn: null,
		phoneEditBtn: null,
		phoneError: null,
		prePass: () => setTransitions({ ...transitions, prePass: false }),
		password: null,
		passwordConfirmBtn: null,
		summary: () => setTransitions({ ...transitions, lastStepOne: true }),
		submitBtn: null,
		lastStepOne: () => setTransitions({ ...transitions, lastStepOne: false }),
		lastStepTwo: () => setTransitions({ ...transitions, lastStepTwo: false }),
		lastStepThree: () => {
			setTransitions({ ...transitions, lastStepThree: false })
			handleSubmit()
		}
	}

	const onExited = {
		welcome: null,
		preName: () => setTransitions({ ...transitions, name: true }),
		name: () => setTransitions({ ...transitions, prePhone: true }),
		nameConfirmBtn: null,
		nameEditBtn: null,
		nameError: null,
		prePhone: () => setTransitions({ ...transitions, phone: true }),
		phone: () => setTransitions({ ...transitions, prePass: true }),
		phoneConfirmBtn: null,
		phoneEditBtn: null,
		phoneError: null,
		prePass: () => setTransitions({ ...transitions, password: true }),
		password: null,
		passwordConfirmBtn: null,
		summary: null,
		submitBtn: null,
		lastStepOne: () => setTransitions({ ...transitions, lastStepTwo: true }),
		lastStepTwo: () => setTransitions({ ...transitions, lastStepThree: true }),
		lastStepThree: () => setIsSubmitting(false)
	}

	const btnClick = {
		nameConfirmBtn: () => {
			setConfirmations({ ...confirmations, name: true })
			setTransitions({
				...transitions,
				name: false,
				nameConfirmBtn: false,
				nameEditBtn: false,
				nameError: false
			})
		},
		nameEditBtn: () => {
			setConfirmations({ ...confirmations, name: false })
			setTransitions({ ...transitions, nameEditBtn: false, nameError: true })
		},
		phoneConfirmBtn: () => {
			if (userInfo.phone.match(phoneRegex)) {
				setConfirmations({ ...confirmations, phone: true })
				setTransitions({
					...transitions,
					phone: false,
					phoneConfirmBtn: false,
					phoneEditBtn: false,
					phoneError: false
				})
			} else {
				toast.error('Whoops! You gotta enter a valid phone number there!', {
					position: 'top-center'
				})
			}
		},
		phoneEditBtn: () => {
			setConfirmations({ ...confirmations, phone: false })
			setTransitions({ ...transitions, phoneEditBtn: false, phoneError: true })
		},
		passwordConfirmBtn: () => {
			if (userPassword.length >= 8) {
				setTransitions({
					...transitions,
					password: false,
					summary: true
				})
				setConfirmations({ ...confirmations, password: true, summary: true })
				setIsSubmitting(true)
			} else {
				toast.error(`You sure are 1 of the 8 characters needed to pass...`)
			}
		}
	}

	const onChange = {
		name: e => {
			setUserInfo({ ...userInfo, name: e.target.value })
		},
		phone: e => {
			setUserInfo({ ...userInfo, phone: e.target.value })
		},
		password: e => {
			setUserPassword(e.target.value)
		}
	}

	useEffect(() => {
		const CancelToken = axios.CancelToken
		const source = CancelToken.source()

		const loadUser = async () => {
			try {
				const res = await axios.get('/auth/user')

				setUserInfo(res.data)
			} catch (err) {
				throw err
			} finally {
				setTransitions({
					welcome: true,
					preName: false,
					name: false,
					nameConfirmBtn: false,
					nameEditBtn: false,
					nameError: false,
					prePhone: false,
					phone: false,
					phoneConfirmBtn: false,
					phoneEditBtn: false,
					phoneError: false,
					prePass: false,
					password: false,
					passwordConfirmBtn: false,
					summary: false,
					lastStepOne: false,
					lastStepTwo: false,
					lastStepThree: false
				})
			}
		}
		loadUser()
		return () => {
			source.cancel()
		}
	}, [])

	return (
		<Box className={classes.root} mt={3}>
			<Fade // ! WELCOME MESSAGE
				timeout={timing.welcome}
				in={transitions.welcome}
				onEntered={onEntered.welcome}
				onExited={onExited.welcome}
			>
				<Typography variant='h1' align='center'>
					{text.welcome}
				</Typography>
			</Fade>
			<Fade // ! PRE-NAME
				timeout={timing.preName}
				in={transitions.preName}
				onEntered={onEntered.preName}
				onExited={onExited.preName}
			>
				<Typography variant='h4' align='center'>
					{text.preName}
				</Typography>
			</Fade>
			<Fade // ! NAME ERROR
				timeout={timing.nameError}
				in={transitions.nameError}
				onEntered={onEntered.nameError}
				onExited={onExited.nameError}
			>
				<Typography variant='subtitle1' align='center'>
					{text.nameError}
				</Typography>
			</Fade>
			<Grid
				className={classes.main}
				container
				direction='column'
				alignItems='center'
			>
				<Fade // ! NAME
					timeout={timing.name}
					in={transitions.name}
					onEntered={onEntered.name}
					onExited={onExited.name}
					unmountOnExit
				>
					<FormControl
						component={Grid}
						container
						direction='column'
						alignItems='center'
						focused={confirmations.name === false}
						disabled={confirmations.name !== false}
					>
						<InputBase
							autoFocus
							fullWidth
							className={`${classes.field}${
								confirmations.name ? 'confirmed' : ''
							}`}
							value={userInfo.name}
							onChange={onChange.name}
							onKeyDown={e => {
								if (e.keyCode === 13) {
									btnClick.nameConfirmBtn()
								}
							}}
							inputProps={{ 'aria-label': 'naked' }}
						/>
					</FormControl>
				</Fade>
				<Fade // ! NAME BUTTONS
					mountOnEnter
					timeout={timing.nameConfirmBtn}
					in={transitions.nameConfirmBtn}
					onEntered={onEntered.nameConfirmBtn}
					onExited={onExited.nameConfirmBtn}
					unmountOnExit
				>
					<FormControl
						component={Grid}
						container
						direction='column'
						alignItems='center'
					>
						<Button
							className={classes.buttons}
							onClick={btnClick.nameConfirmBtn}
							variant='outlined'
							color='primary'
						>
							{text.nameConfirmBtn}
						</Button>
						<Fade // ! EDIT NAME BUTTON
							mountOnEnter
							in={transitions.nameEditBtn}
							timeout={timing.nameEditBtn}
							onEntered={onEntered.nameEditBtn}
							onExited={onExited.nameEditBtn}
							unmountOnExit
						>
							<Button
								className={classes.red}
								variant='outlined'
								onClick={btnClick.nameEditBtn}
							>
								{text.nameEditBtn}
							</Button>
						</Fade>
					</FormControl>
				</Fade>
				<Fade // ! PRE PHONE
					mountOnEnter
					timeout={timing.prePhone}
					in={transitions.prePhone}
					onEntered={onEntered.prePhone}
					onExited={onExited.prePhone}
					unmountOnExit
				>
					<Typography variant='h4' align='center'>
						{text.prePhone}
					</Typography>
				</Fade>
				<Fade // ! PHONE ERROR
					timeout={timing.phoneError}
					in={transitions.phoneError}
					onEntered={onEntered.phoneError}
					onExited={onExited.phoneError}
				>
					<Typography variant='subtitle1' align='center'>
						{text.phoneError}
					</Typography>
				</Fade>
				<Fade // ! PHONE
					mountOnEnter
					timeout={timing.phone}
					in={transitions.phone}
					onEntered={onEntered.phone}
					onExited={onExited.phone}
					unmountOnExit
				>
					<InputBase // ! PHONE FIELD
						disabled={confirmations.phone === null || confirmations.phone}
						className={`${classes.field}${
							confirmations.phone ? 'confirmed' : ''
						}`}
						value={userInfo.phone}
						onChange={onChange.phone}
						inputProps={{ 'aria-label': 'naked' }}
						inputComponent={CustomTextMask}
						onKeyDown={e => {
							if (e.keyCode === 13) {
								btnClick.phoneConfirmBtn()
							}
						}}
					/>
				</Fade>
				<Fade // ! PHONE BUTTONS
					mountOnEnter
					timeout={timing.phoneConfirmBtn}
					in={transitions.phoneConfirmBtn}
					onEntered={onEntered.phoneConfirmBtn}
					onExited={onExited.phoneConfirmBtn}
					unmountOnExit
				>
					<FormControl
						component={Grid}
						container
						direction='column'
						alignItems='center'
					>
						<Button
							className={classes.buttons}
							onClick={btnClick.phoneConfirmBtn}
							variant='outlined'
							color='primary'
						>
							{text.phoneConfirmBtn}
						</Button>
						<Fade
							mountOnEnter
							in={transitions.phoneEditBtn}
							timeout={timing.phoneEditBtn}
							onEntered={onEntered.phoneEditBtn}
							onExited={onExited.phoneEditBtn}
							unmountOnExit
						>
							<Button
								className={classes.red}
								variant='outlined'
								onClick={btnClick.phoneEditBtn}
							>
								{text.phoneEditBtn}
							</Button>
						</Fade>
					</FormControl>
				</Fade>
				<Fade // ! PRE - PASSWORD
					mountOnEnter
					timeout={timing.prePass}
					in={transitions.prePass}
					onEntered={onEntered.prePass}
					onExited={onExited.prePass}
					unmountOnExit
				>
					<Typography variant='h4' align='center'>
						{text.prePass}
					</Typography>
				</Fade>
				<Fade // ! PASSWORD
					mountOnEnter
					timeout={timing.password}
					in={transitions.password}
					onEntered={onEntered.password}
					onExited={onExited.password}
					unmountOnExit
				>
					<TextField
						placeholder={text.password}
						variant='outlined'
						InputProps={{
							className: classes.password,
							type: passwordVisible ? 'text' : 'password',
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										edge='end'
										onMouseDown={() => setPasswordVisible(true)}
										onMouseUp={() => setPasswordVisible(false)}
									>
										{passwordVisible ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							)
						}}
						component={Grid}
						container
						direction='column'
						alignItems='center'
						autoFocus
						error={userPassword.length < 8 && userPassword.length !== 0}
						helperText='Password must be at least 8 characters'
						required
						value={userPassword}
						onChange={onChange.password}
						onKeyDown={e => {
							if (e.keyCode === 13) {
								btnClick.passwordConfirmBtn()
							}
						}}
					/>
				</Fade>
				<Fade // ! PASSWORD
					mountOnEnter
					timeout={timing.password}
					in={transitions.password}
					onEntered={onEntered.password}
					onExited={onExited.password}
					unmountOnExit
				>
					<FormControl
						component={Grid}
						container
						direction='column'
						alignItems='center'
					>
						<Button
							className={classes.buttons}
							onClick={btnClick.passwordConfirmBtn}
							variant='outlined'
							color='primary'
						>
							{text.passwordConfirmBtn}
						</Button>
					</FormControl>
				</Fade>

				<Backdrop
					mountOnEnter
					timeout={timing.summary}
					open={isSubmitting}
					onEntered={onEntered.summary}
					onExited={onExited.summary}
					unmountOnExit
				>
					<Grid
						container
						spacing={1}
						direction='column'
						justify='center'
						alignItems='center'
						alignContent='center'
						wrap='nowrap'
					>
						<CircularProgress color='inherit' />
						<Fade
							mountOnEnter
							timeout={timing.lastStepOne}
							in={transitions.lastStepOne}
							onEntered={onEntered.lastStepOne}
							onExited={onExited.lastStepOne}
							unmountOnExit
						>
							<Typography variant='h4'>{text.lastStepOne}</Typography>
						</Fade>
						<Fade
							mountOnEnter
							timeout={timing.lastStepTwo}
							in={transitions.lastStepTwo}
							onEntered={onEntered.lastStepTwo}
							onExited={onExited.lastStepTwo}
							unmountOnExit
						>
							<Typography variant='h4'>{text.lastStepTwo}</Typography>
						</Fade>
						<Fade
							mountOnEnter
							timeout={timing.lastStepThree}
							in={transitions.lastStepThree}
							onEntered={onEntered.lastStepThree}
							onExited={onExited.lastStepThree}
							unmountOnExit
						>
							<Typography variant='h1'>{text.lastStepThree}</Typography>
						</Fade>
					</Grid>
				</Backdrop>
			</Grid>
			<ToastContainer />
		</Box>
	)
}

export default Activate
