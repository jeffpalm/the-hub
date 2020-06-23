import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Table from 'react-bootstrap/Table'
import { withRouter } from 'react-router-dom'
import MaterialTable from 'material-table'

const Tickets = props => {
	const [tickets, setTickets] = useState([])
	const columns = [
		{ title: 'ID', field: 'id' },
		{ title: 'Guest', field: 'guest' },
		{ title: 'EG', field: 'sales' },
		{ title: 'Finance', field: 'manager' },
		{ title: 'Type', field: 'tickettype' },
		{ title: 'Status', field: 'ticketstatus' },
		{ title: 'VIN', field: 'vin' },
		{ title: 'Created', field: 'created' },
		{ title: 'Last update', field: 'lastupdate' }
	]

	useEffect(() => {
		axios.get('/api/tickets').then(res => {
			setTickets(res.data)
		})
	}, [])
	return (
		<div>
			<MaterialTable
				columns={columns}
				data={tickets.map(t => {
					return {
						...t,
						created: new Date(t.created).toLocaleString(),
						lastupdate: t.lastupdate
							? new Date(t.lastupdate).toLocaleString()
							: null
					}
				})}
				onRowClick={(e, rowData) => {
					props.history.push(`/ticket/${rowData.id}`)
				}}
			/>
		</div>
	)
}

const mapStateToProps = state => state.authReducer

export default connect(mapStateToProps)(withRouter(Tickets))
