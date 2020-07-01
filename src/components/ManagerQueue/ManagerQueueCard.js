import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
// import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import copy from 'copy-to-clipboard'
import { ToastContainer, toast } from 'react-toastify'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(theme => ({
	root: {
		width: 429
	},
	pos: {
		marginBottom: 12
	},
	btn: {
		'&:hover': {
			cursor: 'pointer'
		}
	}
}))

const phoneMask = /^\(?(\d{3})\)?[ -]?\.?(\d{3})[ -]?\.?(\d{4})$/gi

const ManagerQueueCard = ({ ticket, ...props }) => {
	const classes = useStyles()

	const copyToClipboard = text => {
		copy(text)
		toast.success(`${text} Copied!`, { position: 'bottom-left' })
	}

	const {
		id,
		guest,
		guest_id,
		guest_phone,
		cosigner_name,
		cosigner_id,
		cosigner_phone,
		sales,
		sales_phone,
		sales_id,
		manager,
		manager_id,
		type,
		type_id,
		status,
		status_id,
		vin,
		year,
		make,
		model,
		vehicle_ticket_count,
		created,
		last_update,
		showroom
	} = ticket

	return (
		<Card className={classes.root} variant='outlined' {...props}>
			<CardHeader
				title={guest}
				subheader={guest_phone.replace(phoneMask, `($1) $2-$3`)}
				subheaderTypographyProps={{
					className: classes.btn,
					onClick: () => {
						copyToClipboard(guest_phone)
					}
				}}
				avatar={
					<Avatar variant='rounded'>
						{`${guest.substring(0, 1)}${guest.substring(
							guest.indexOf(' ') + 1,
							guest.indexOf(' ') + 2
						)}`}
					</Avatar>
				}
			/>
			<Divider />
			<CardContent>
				<Typography
					className={classes.pos}
					variant='subtitle1'
					color='textSecondary'
				>
					EG: {sales}
				</Typography>
				<Typography variant='body2' component='p'>
					{`${year} ${make} ${model}`}
				</Typography>
				<Typography
					className={classes.btn}
					variant='button'
					component='p'
					onClick={() => copyToClipboard(vin)}
				>
					{vin}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size='small'>Learn More</Button>
			</CardActions>
			<ToastContainer />
		</Card>
	)
}

export default ManagerQueueCard
