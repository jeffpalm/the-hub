import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
// import Tooltip from '@material-ui/core/ToolTip'
import copy from 'copy-to-clipboard'
import { toast } from 'react-toastify'
// import Button from '@material-ui/core/Button'

const TabPanel = ({ children, value, index, ...props }) => {
	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`full-width-tab-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...props}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	)
}

const phoneMask = /^\(?(\d{3})\)?[ -]?\.?(\d{3})[ -]?\.?(\d{4})$/gi

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
}

const tabProps = index => {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`
	}
}

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		width: '100%'
	},
	btn: {
		'&:hover': {
			cursor: 'pointer'
		}
	}
}))

const QueueCardTabs = ({ ticket, ...props }) => {
	const classes = useStyles()
	const theme = useTheme()

	const copyToClipboard = text => {
		copy(text)
		toast.success(`${text} Copied!`, { position: 'bottom-left' })
	}

	const {
		// id,
		// guest,
		// guest_id,
		// guest_phone,
		// cosigner_name,
		// cosigner_id,
		// cosigner_phone,
		sales,
		sales_phone,
		// sales_id,
		// manager,
		// manager_id,
		// type,
		// type_id,
		// status,
		// status_id,
		vin,
		year,
		make,
		model,
		vehicle_ticket_count,
		// created,
		// last_update,
		// showroom
	} = ticket

	const [curValue, setCurValue] = useState(0)

	const handleChange = (event, newValue) => {
		setCurValue(newValue)
	}

	// const handleIndex = index => {
	// 	setCurValue(index)
	// }

	return (
		<div className={classes.root}>
			<AppBar position='static' color='transparent' variant='outlined'>
				<Tabs
					value={curValue}
					onChange={handleChange}
					indicatorColor='primary'
					textColor='primary'
					variant='fullWidth'
				>
					<Tab label='Internal' {...tabProps(0)} />
					<Tab label='Vehicle' {...tabProps(1)} />
					<Tab label='Attachments' {...tabProps(2)} />
				</Tabs>
			</AppBar>
			<TabPanel value={curValue} index={0} dir={theme.direction}>
				<Grid>
					<Typography variant='subtitle1' color='textSecondary'>
						EG: {sales}
					</Typography>
					<Typography variant='subtitle2'>
						{sales_phone.replace(phoneMask, `($1) $2-$3`)}
					</Typography>
				</Grid>
			</TabPanel>
			<TabPanel value={curValue} index={1} dir={theme.direction}>
				<Grid container direction='column' alignItems='center'>
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

					<Typography variant='caption'>
						Other apps on this vehicle: {vehicle_ticket_count || '0'}
					</Typography>
				</Grid>
			</TabPanel>
			<TabPanel value={curValue} index={2} dir={theme.direction}></TabPanel>
		</div>
	)
}

export default QueueCardTabs
