import React from 'react'
import routes from './routes'
import Header from './components/Header/Header'
import { useLocation } from 'react-router-dom'

const App = props => {
	
	const { pathname } = useLocation()
	return (
		<>
			{pathname === '/' ? null : <Header />}
			{routes}
		</>
	)
}

export default App