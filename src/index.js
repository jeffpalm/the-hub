import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import * as serviceWorker from './serviceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
// import './style/reset.css'
import './style/App.scss'

const theme = unstable_createMuiStrictModeTheme({
	spacing: 8,
	palette: {
		primary: { main: '#62A60A' },
		secondary: { main: '#333d47' },
		type: 'dark',
		background: {
			default: 'rgba(51, 61, 71, .9)',
			paper: 'rgba(51, 61, 71)'
		}
	},
	overrides: {
		MuiCssBaseline: {
			'@global': {
				body: {
					background: '#303030'
				}
			}
		},
		MuiInputLabel: {
			outlined: {
				transform: 'translate(0px, 25px) scale(1)',
				transformOrigin: 'center',
				'&.MuiInputLabel-shrink': {
					transform: 'translate(0px, 0px) scale(0.75)'
				}
			},
			shrink: {
				transformOrigin: 'center'
			},
			animated: {
				transition: 'transform linear 100ms'
			}
		}
	},
	props: {
		MuiInputLabel: {
			style: {
				textAlign: 'center',
				width: '100%'
			}
		}
	}
})

ReactDOM.render(
	<React.StrictMode>
		<MuiThemeProvider theme={theme}>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<Provider store={store}>
					<HashRouter>
						<CssBaseline />
						<App />
					</HashRouter>
				</Provider>
			</MuiPickersUtilsProvider>
		</MuiThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
