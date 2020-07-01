import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import ManagerQueueCard from './ManagerQueueCard'

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
	newWip: {
		width: '100vw',
		height: 'calc(100vh - 80px)'
	},
	appCard: {},
	workStackBg: {
		width: '98%',
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

	// const config = useSelector(state => state.config)

	useEffect(() => {
		const CancelToken = axios.CancelToken
		const source = CancelToken.source()

		const loadTickets = async () => {
			try {
				const resTickets = await axios.get(`/api/tickets?manager_id=${id}`, {
					cancelToken: source.token
				})

				setTickets(resTickets.data)
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
						<Grid container wrap='wrap' justify='center' spacing={2}>
							{newTickets.map((tick, i) => (
								<Grid key={i} item>
									<ManagerQueueCard key={i} ticket={tick} />
								</Grid>
							))}
						</Grid>
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
						<Grid container wrap='wrap' justify='center' spacing={1}>
							{workingTickets.map((tick, i) => (
								<Grid key={i} item>
									<ManagerQueueCard key={i} ticket={tick} />
								</Grid>
							))}
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default ManagerQueue
