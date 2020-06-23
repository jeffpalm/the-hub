import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Table from 'react-bootstrap/Table'
import { withRouter } from 'react-router-dom'

const Tickets = props => {
	const [tickets, setTickets] = useState([])

	useEffect(() => {
		axios.get('/api/tickets').then(res => {
			setTickets(res.data)
		})
	}, [])
	return (
		<div>
			<div>Tickets Component</div>
			<Table responsive='md' borderless hover striped size='md'>
				<thead>
					<tr>
						<th>Guest</th>
						<th>EG</th>
						<th>Finance</th>
						<th>Type</th>
						<th>Status</th>
						<th>VIN</th>
						<th>Last Update</th>
					</tr>
				</thead>
				<tbody>
					{tickets.map(t => {
						return (
							<tr key={t.id} onClick={() => props.history.push(`/ticket/${t.id}`)}>
								<td>{t.guest}</td>
								<td>{t.sales}</td>
								<td>{t.manager}</td>
								<td>{t.tickettype}</td>
								<td>{t.ticketstatus}</td>
								<td>{t.vin}</td>
								<td>{t.lastupdate}</td>
							</tr>
						)
					})}
				</tbody>
			</Table>
		</div>
	)
}

const mapStateToProps = state => state.authReducer

export default connect(mapStateToProps)(withRouter(Tickets))
