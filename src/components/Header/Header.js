import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const Header = () => {
	return (
		<div className='tickets'>
			<Navbar fixed='top' bg='primary' expand='lg'>
				<Nav className='mr-auto' variant='pills'>
					<Nav.Link as={Link} to='/home'>
						Home
					</Nav.Link>
					<Nav.Link as={Link} to='/new'>New Ticket</Nav.Link>
				</Nav>
				<Form inline>
					<Form.Control type='text' placeholder='Search tickets' />
					<Button variant='outline-light'>Search</Button>
				</Form>
			</Navbar>
		</div>
	)
}

export default Header
