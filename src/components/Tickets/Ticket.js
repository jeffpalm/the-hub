import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { connect } from 'react-redux'

const Ticket = props => {
	const [ticket, setTicket] = useState({
		ticket: {
			id: '',
			type: '',
			status: '',
			created: '',
			updated: '',
			closed: ''
		},
		sales: {
			id: '',
			name: ''
		},
		manager: {
			id: '',
			name: ''
		},
		guest: {
			id: '',
			name: '',
			phone: ''
		},
		cosigner: {
			id: '',
			name: '',
			phone: ''
		},
		vehicle: {
			vin: '',
			year: '',
			make: '',
			model: '',
			ticketCount: 0
		}
	})
	const [messages, setMessages] = useState([])
	const [fields, setFields] = useState([])
	const [attachments, setAttachments] = useState([])

	const { ticketid } = props.match.params

	//New Ticket Message
	const [newMessage, setNewMessage] = useState('')
	const [privateMsg, setPrivateMsg] = useState(false)
	const submitMessage = e => {
		e.preventDefault()
		axios
			.post(`/api/ticket/${ticketid}/message`, {
				created_by: props.user.id,
				private: privateMsg,
				message: newMessage
			})
			.then(() => {
				setNewMessage('')
			})
	}

	useEffect(() => {
		axios.get(`/api/ticket/${ticketid}`).then(res => {
			setTicket(res.data)
		})
		axios.get(`/api/ticket/${ticketid}/messages`).then(res => {
			setMessages(res.data)
		})
		axios.get(`/api/ticket/${ticketid}/attachments`).then(res => {
			setAttachments(res.data)
		})
		axios.get(`/api/ticket/${ticketid}/fields`).then(res => {
			setFields(res.data)
		})
	}, [])

	const { ticket: tick, sales, manager, guest, cosigner, vehicle } = ticket

	return (
		<main>
			<Container fluid='md' className='ticket'>
				<Row sm={2} xs={1}>
					<Col>
						<h3>{guest.name}</h3>
						<h3>{guest.phone}</h3>
						{cosigner.id ? (
							<>
								<h3>Cosigner</h3>
								<h4>{cosigner.name}</h4>
								<h4>{cosigner.phone}</h4>
							</>
						) : null}
					</Col>
					<Col style={{ textAlign: 'right' }}>
						<h3>#{tick.id}</h3>
						<ListGroup>
							<ListGroup.Item variant='dark'>{tick.type}</ListGroup.Item>
							<ListGroup.Item variant='dark'>{tick.status}</ListGroup.Item>
							<ListGroup.Item variant='dark'>
								Created: {new Date(tick.created).toLocaleString()}
							</ListGroup.Item>
							<ListGroup.Item variant='dark'>
								Updated:{' '}
								{tick.updated ? new Date(tick.updated).toLocaleString() : null}
							</ListGroup.Item>
							<ListGroup.Item variant='dark'>
								Closed:{' '}
								{tick.closed ? new Date(tick.closed).toLocaleString() : null}
							</ListGroup.Item>
							<ListGroup.Item variant='dark'>EG: {sales.name}</ListGroup.Item>
							<ListGroup.Item variant='dark'>
								Finance: {manager.name}
							</ListGroup.Item>
							{fields.map(f => {
								return <ListGroup.Item variant='dark'>{f.name}</ListGroup.Item>
							})}
						</ListGroup>
					</Col>
				</Row>
				<Row>
					<Col>
						<h4>Vehicle Details</h4>
						<h4>{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h4>
						<h4>{vehicle.vin}</h4>
					</Col>
					<Col></Col>
				</Row>
				<Row>
					<h3>Attachments</h3>
					{attachments.map(a => {
						return <div key={a.id}>Attachments</div>
					})}
				</Row>
				<Row>
					<h3>Messages</h3>
				</Row>
				{messages.map((m, i) => {
					return (
						<Row key={i}>
							<Col>{m.message}</Col>
							<Col>{new Date(m.created).toLocaleString()}</Col>
							<Col>by {m.created_by}</Col>
						</Row>
					)
				})}

				<Row>
					<Form onSubmit={submitMessage}>
						<InputGroup>
							<InputGroup.Prepend>
								<InputGroup.Text>New Message</InputGroup.Text>
							</InputGroup.Prepend>
							<InputGroup.Prepend>
								<Form.Check
									type='checkbox'
									label='private'
									onChange={() => setPrivateMsg(!privateMsg)}
								/>
							</InputGroup.Prepend>
							<Form.Control
								aria-describedby='basic-addon1'
								value={newMessage}
								onChange={e => setNewMessage(e.target.value)}
							/>
						</InputGroup>
					</Form>
				</Row>
			</Container>
		</main>
	)
}

const mapStateToProps = state => state.authReducer

export default connect(mapStateToProps)(Ticket)
