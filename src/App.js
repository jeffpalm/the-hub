import React from 'react'
import routes from './routes'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import './style/reset.css'
import './style/App.scss'

const dark = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			main: '#62A60A'
		}
	}
})

function App() {
	return (
		<>
			<ThemeProvider theme={dark}>{routes}</ThemeProvider>
		</>
	)
}

export default App
