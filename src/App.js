import React from 'react'
import Routes from './Routes'
import Header from './components/Header/Header'
import { useLocation } from 'react-router-dom'

const App = props => {
	
	const { pathname } = useLocation()
	return (
		<>
			{pathname === '/' ? null : <Header />}
			{<Routes />}
		</>
	)
}

export default App