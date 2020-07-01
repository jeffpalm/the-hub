import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(() => ({
	root: {
		width: '100vw',
		height: '100vh'
	},
	img: {
		marginBottom: 10
	}
}))

const NoNoNo = () => {
	const classes = useStyles()
	const history = useHistory()

	return (
		<Grid
			className={classes.root}
			container
			direction='column'
			justify='center'
			alignItems='center'
		>
			<img
				className={classes.img}
				src='./assets/img/nonono.gif'
				alt='no no no finger wave'
			/>
			<Button onClick={() => history.goBack()} variant='outlined'>
				Get outta here
			</Button>
		</Grid>
	)
}

export default NoNoNo
