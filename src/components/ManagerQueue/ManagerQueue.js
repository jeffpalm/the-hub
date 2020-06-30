import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'

const useStyles = makeStyles(theme => ({
	root: {
		boxSizing: 'border-box',
		width: '100vw',
		minHeight: 'calc(100vh - 64px)',
		margin: 0,
		padding: 0
	},
	workStacks: {
		height: '100%'
	},
	doneZone: {
		height: 'calc(10vh)'
	},
	pos: {
		marginBottom: 12
	},
	newWip: {
		width: '100vw',
		height: 'calc(100vh - 64px)'
	},
	appCard: {},
	workStackBg: {
		width: '95%',
		height: '100%',
		border: `2px solid ${theme.palette.secondary.dark}`
	}
}))

const ManagerQueue = props => {
	const classes = useStyles()

	const [tickets, setTickets] = useState([])

	const {
		user: { id }
	} = useSelector(state => state.auth)

	const config = useSelector(state => state.config)

	useEffect(() => {
		const CancelToken = axios.CancelToken
		const source = CancelToken.source()

		const loadTickets = () => {
			try {
				axios
					.get(`/api/tickets?manager_id=${id}`, { cancelToken: source.token })
					.then(res => {
						setTickets(res.data)
					})
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
	}, [id])

	const [newTickets, setNewTickets] = useState([])
	const [workingTickets, setWorkingTickets] = useState([])

	useEffect(() => {
		if (tickets[0]) {
			setNewTickets(tickets.filter(tick => tick.status === 'New'))
			setWorkingTickets(tickets.filter(tick => tick.status === 'Working'))
		}
	}, [tickets])

	return (
		<Grid
			className={classes.root}
			container
			direction='column'
			justify='center'
		>
			<Grid
				className={classes.newWip}
				container
				item
				direction='row'
				alignItems='center'
				justify='center'
			>
				<Grid
					className={classes.workStacks}
					item
					container
					xs={12}
					sm={6}
					direction='column'
					justify='flex-start'
					alignItems='center'
				>
					<Paper
						variant='outlined'
						component={Grid}
						item
						
						className={classes.workStackBg}
					>
						<Typography align='center' variant='h3' component={Grid} item>
							New
						</Typography>
						{newTickets.map((tick, i) => (
							<Box m={1} key={i}>
								<Card variant='outlined' component={Grid} item>
									<CardContent>
										<Grid container direction='row' justify='space-between'>
											<Typography
												variant='h5'
												component={Grid}
												item
												color='textSecondary'
												gutterBottom
											>
												{tick.guest}
											</Typography>
											<Typography
												component={Grid}
												item
												color='textSecondary'
												gutterBottom
											>
												{tick.guest_phone}
											</Typography>
										</Grid>
										<Typography variant='h5' component='h2'></Typography>
										<Typography className={classes.pos} color='textSecondary'>
											EG: {tick.sales}
										</Typography>
										<Typography variant='body2' component='p'>
											well meaning and kindly.
											<br />
											{'"a benevolent smile"'}
										</Typography>
									</CardContent>
									<CardActions>
										<Button size='small'>Learn More</Button>
									</CardActions>
								</Card>
							</Box>
						))}
					</Paper>
				</Grid>
				<Grid
					className={classes.workStacks}
					item
					container
					xs={12}
					sm={6}
					direction='column'
					justify='flex-start'
					alignItems='center'
				>
					<Paper
						variant='outlined'
						component={Grid}
						item
						className={classes.workStackBg}
					>
						<Typography align='center' variant='h3' component={Grid} item>
							Working
						</Typography>
						{workingTickets.map((tick, i) => (
							<Box m={1} key={i}>
								<Card variant='outlined' component={Grid} item>
									<CardContent>
										<Grid container direction='row' justify='space-between'>
											<Typography
												variant='h5'
												component={Grid}
												item
												color='textSecondary'
												gutterBottom
											>
												{tick.guest}
											</Typography>
											<Typography
												component={Grid}
												item
												color='textSecondary'
												gutterBottom
											>
												{tick.guest}
											</Typography>
										</Grid>
										<Typography variant='h5' component='h2'></Typography>
										<Typography className={classes.pos} color='textSecondary'>
											EG: {tick.sales}
										</Typography>
										<Typography variant='body2' component='p'>
											well meaning and kindly.
											<br />
											{'"a benevolent smile"'}
										</Typography>
									</CardContent>
									<CardActions>
										<Button size='small'>Learn More</Button>
									</CardActions>
								</Card>
							</Box>
						))}
					</Paper>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default ManagerQueue
