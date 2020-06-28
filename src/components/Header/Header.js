import React, { useState } from 'react'
import { connect } from 'react-redux'
import { logoutUser } from '../../redux/actions'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
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

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
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
			</List>
		</div>
	)

	const logout = () => {
		axios.delete('/auth/logout').then(() => {
			logoutUser()
			props.history.push('/')
		})
	}

	return (
		<>
			{props.isAuthenticated ? (
				<div className={classes.root}>
					<AppBar position='fixed'>
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
							<IconButton edge='end' onClick={logout}>
								<PowerSettingsNewOutlinedIcon />
							</IconButton>
						</Toolbar>
					</AppBar>
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

export default connect(mapStateToProps, { logoutUser })(
	withRouter(Header)
)
