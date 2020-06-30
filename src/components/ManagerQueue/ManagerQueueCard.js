import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

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

const ManagerQueueCard = ({ ticket, ...props }) => {
	const classes = useStyles()
	return (
		<Card variant='outlined' component={Grid} item {...props}>
			<CardContent>
				<Grid container direction='row' justify='space-between'>
					<Typography
						variant='h5'
						component={Grid}
						item
						color='textSecondary'
						gutterBottom
					>
						{ticket.guest}
					</Typography>
					<Typography component={Grid} item color='textSecondary' gutterBottom>
						{ticket.guest_phone}
					</Typography>
				</Grid>
				<Typography variant='h5' component='h2'></Typography>
				<Typography className={classes.pos} color='textSecondary'>
					EG: {ticket.sales}
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
	)
}

export default ManagerQueueCard
