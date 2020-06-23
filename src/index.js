import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import * as serviceWorker from './serviceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme({
	palette: {
		primary: { main: '#62A60A' },
		type: 'dark',
		background: {
			default: '#303030'
		}
	},
	overrides: {
		MuiCssBaseline: {
			'@global': {
				body: {
					background: '#303030'
				}
			}
		}
	}
})

ReactDOM.render(
	<React.StrictMode>
		<MuiThemeProvider theme={theme}>
			<Provider store={store}>
				<HashRouter>
					<CssBaseline />
					<App />
				</HashRouter>
			</Provider>
		</MuiThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
