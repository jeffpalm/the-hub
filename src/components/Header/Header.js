import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { logoutUser, requestUser } from '../../redux/actions'
import clsx from 'clsx'
import { makeStyles, fade } from '@material-ui/core/styles'
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import PowerSettingsNewOutlinedIcon from '@material-ui/icons/PowerSettingsNewOutlined'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'
import * as roles from '../../constants/ROLES'
import Switch from '@material-ui/core/Switch'
// import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	grow: {
		flexGrow: 1
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'& :focus': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto'
		}
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	inputRoot: {
		color: 'inherit'
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch'
		}
	},
	resultsRootContainer: {
		zIndex: theme.zIndex.tooltip,
		position: 'absolute',
		top: '100%',
		width: '100%',
		margin: 0
	},
	resultsContainer: {
		padding: 0,
		margin: 0,
		position: 'relative',
		zIndex: theme.zIndex.tooltip,
		width: '100%'
	},
	resultsList: {
		paddingTop: 15,
		backgroundColor: theme.palette.primary.main,
		borderBottomLeftRadius: theme.shape.borderRadius,
		borderBottomRightRadius: theme.shape.borderRadius,
		width: '100%'
	},
	resultsListAlt: {
		backgroundColor: theme.palette.secondary.main
	},
	results: {
		'&:hover': { backgroundColor: fade(theme.palette.common.white, 0.25) }
	},
	active: {
		backgroundColor: fade(theme.palette.common.white, 0.25)
	},
	resultTransition: {
		transition: 'all 100ms linear'
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	switchBase: {
		color: 'rgba(244,36,52)'
	},
	track: {
		backgroundColor: 'rgba(244,36,52)'
	},
	checked: {
		switchBase: {
			color: 'rgba(0, 113, 151)'
		}
	},
	searchBackdrop: {
		zIndex: theme.zIndex.appBar - 1
	}
}))

const drawerStyles = makeStyles({
	list: {
		width: 250
	},
	fullList: {
		width: 'auto'
	}
})

const Header = props => {
	const [state, setState] = useState({})

	const classes = useStyles()
	const drawerClasses = drawerStyles()
	const anchor = 'left'

	const ForwardedLink = React.forwardRef((props, ref) => (
		<Link ref={ref} {...props}>
			{props.children}
		</Link>
	))

	const toggleDrawer = (anchor, open) => event => {
		if (
			event.type === 'keydown' &&
			(event.key === 'Tab' || event.key === 'Shift')
		) {
			return
		}
		setState({ ...state, [anchor]: open })
	}

	const list = anchor => (
		<div
			className={clsx(drawerClasses.list, {
				[drawerClasses.fullList]: anchor === 'top' || anchor === 'bottom'
			})}
			role='presentation'
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				<ListItem button>
					<ListItemText
						primary='Home'
						onClick={() => props.history.push('/home')}
					/>
				</ListItem>
				{props.user.role === 1 ? (
					<ListItem button>
						<ListItemText
							primary='User Management'
							onClick={() => props.history.push('/config/users')}
						/>
					</ListItem>
				) : null}
				{props.user.role === 1 ? (
					<ListItem button>
						<ListItemText
							primary='Ticket Management'
							onClick={() => props.history.push('/config/tickets')}
						/>
					</ListItem>
				) : null}
			</List>
		</div>
	)

	const logout = async () => {
		try {
			await axios.put(`/api/user/${userId}`, { available: !available })
			await axios.delete('/auth/logout')
		} catch (err) {
			console.log(err)
		} finally {
			logoutUser()
			props.history.push('/')
		}
	}

	// Handle search bar
	const [query, setQuery] = useState('')
	const [results, setResults] = useState([])
	const [cursor, setCursor] = useState(-1)

	const handleSearchInput = e => {
		setQuery(e.target.value)
	}
	const handleKeyDown = e => {
		if (e.keyCode === 38 && cursor !== -1) {
			setCursor(cursor - 1)
		} else if (e.keyCode === 40 && cursor < results.length - 1) {
			setCursor(cursor + 1)
		} else if (e.keyCode === 13 && cursor !== -1 && results.length) {
			setCursor(-1)
			setResults([])
			setQuery('')
			props.history.push(`/ticket/${results[cursor].id}`)
		}
	}

	useEffect(() => {
		if (!query) {
			setResults([])
		}
	}, [query])

	useEffect(() => {
		if (query) {
			axios.get(`/api/tickets?guest=${query}`).then(res => {
				setResults(res.data)
			})
		} else {
			setResults([])
		}
	}, [query])

	// TODO: Handle Availability Toggle
	// Handle Availability Toggle

	const { available, id: userId } = props.user

	const [availabilityLoading, setAvailabilityLoading] = useState(false)

	const handleAvailabilityToggle = async () => {
		setAvailabilityLoading(true)
		try {
			await axios.put(`/api/user/${userId}`, { available: !available })
			await props.requestUser()
		} catch (err) {
			throw err
		} finally {
			setAvailabilityLoading(false)
		}
	}

	return (
		<>
			{props.isAuthenticated ? (
				<div className={classes.root}>
					<AppBar
						color={
							props.user.role !== roles.FINANCE_MGR
								? 'primary'
								: available
								? 'primary'
								: 'secondary'
						}
						position='fixed'
					>
						<Toolbar>
							<IconButton
								edge='start'
								className={classes.menuButton}
								color='inherit'
								aria-label='menu'
								onClick={toggleDrawer(anchor, true)}
							>
								<MenuIcon />
							</IconButton>
							<Button color='inherit' component={ForwardedLink} to='/home'>
								Home
							</Button>
							<div className={classes.search}>
								<div className={classes.searchIcon}>
									<SearchIcon />
								</div>
								<InputBase
									placeholder='Search all apps…'
									classes={{
										root: classes.inputRoot,
										input: classes.inputInput
									}}
									inputProps={{ 'aria-label': 'search' }}
									onChange={handleSearchInput}
									onKeyDown={handleKeyDown}
									value={query}
								/>
								<Grid
									className={classes.resultsRootContainer}
									container
									justify='center'
								>
									<Grid item className={classes.resultsContainer}>
										{results.length ? (
											<Collapse
												in={results.length ? true : false}
												className={classes.resultTransition}
											>
												<List
													component='div'
													className={`${classes.resultsList} ${
														props.user.role !== roles.FINANCE_MGR
															? ''
															: available
															? ''
															: classes.resultsListAlt
													}`}
												>
													{results.map((r, i) => (
														<ListItem
															className={`${classes.results} ${
																cursor === i ? classes.active : ''
															}`}
															focusRipple
															key={i}
															button
															onClick={() => {
																setCursor(-1)
																setResults([])
																setQuery('')
																props.history.push(`/ticket/${r.id}`)
															}}
														>
															<ListItemText
																value={r.id}
																primary={r.guest}
																secondary={
																	<>
																		<Typography
																			variant='body2'
																			component='span'
																		>
																			{`EG: ${r.sales}`}
																		</Typography>
																		<br />
																		<Typography
																			variant='body2'
																			component='span'
																		>
																			{`Finance: ${r.manager}`}
																		</Typography>
																		<br />
																		<Typography
																			variant='body2'
																			component='span'
																		>
																			{`Last Update: ${new Date(
																				r.last_update
																			).toLocaleString()}`}
																		</Typography>
																	</>
																}
															/>
														</ListItem>
													))}
												</List>
											</Collapse>
										) : null}
									</Grid>
								</Grid>
							</div>

							<div className={classes.grow} />
							{props.user.role === roles.FINANCE_MGR &&
							(available === false || available === true) ? (
								<>
				
										<Switch
											checked={available}
											onChange={handleAvailabilityToggle}
											value={available}
											classes={{
												switchBase: classes.switchBase,
												track: classes.track,
												checked: classes.checked
											}}
											color={available ? 'secondary' : 'secondary'}
										/>
					
								</>
							) : null}
							<IconButton edge='end' onClick={logout}>
								<PowerSettingsNewOutlinedIcon />
							</IconButton>
						</Toolbar>
					</AppBar>
					<Fade in={availabilityLoading}>
						<Backdrop className={classes.backdrop} open={availabilityLoading}>
							<CircularProgress color='primary' />
						</Backdrop>
					</Fade>
					<Fade in={query ? true : false}>
						<Backdrop
							className={classes.searchBackdrop}
							open={query ? true : false}
						></Backdrop>
					</Fade>
					<Drawer
						anchor={anchor}
						open={state[anchor]}
						onClose={toggleDrawer(anchor, false)}
					>
						{list(anchor)}
					</Drawer>
				</div>
			) : null}
		</>
	)
}

const mapStateToProps = state => state.auth

export default connect(mapStateToProps, { logoutUser, requestUser })(
	withRouter(Header)
)
