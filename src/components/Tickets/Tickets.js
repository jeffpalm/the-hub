import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MaterialTable from 'material-table'

const Tickets = props => {
	const [tickets, setTickets] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const columns = [
		{
			title: 'ID',
			field: 'id',
			filtering: false,
			searchable: false
		},
		{
			title: 'Guest',
			field: 'guest',
			filtering: true,
			searchable: true
		},
		{
			title: 'EG',
			field: 'sales',
			filtering: true,
			searchable: true,
			defaultFilter: props.user.role === 3 ? props.user.name : ''
		},
		{
			title: 'Finance',
			field: 'manager',
			filtering: true,
			searchable: true
		},
		{
			title: 'Type',
			field: 'type',
			filtering: true,
			searchable: false,
			lookup: { Finance: 'Finance', OSF: 'OSF', Cash: 'Cash' }
		},
		{
			title: 'Status',
			field: 'status',
			filtering: true,
			searchable: false
		},
		{
			title: 'VIN',
			field: 'vin',
			filtering: false,
			searchable: true
		},
		{
			title: 'Created',
			field: 'created',
			type: 'date',
			filtering: true,
			searchable: false
		},
		{
			title: 'Last update',
			field: 'lastupdate',
			type: 'date',
			filtering: true,
			searchable: false
		}
	]

	useEffect(() => {
		const CancelToken = axios.CancelToken
		const source = CancelToken.source()

		const loadTickets = () => {
			try {
				axios.get('/api/tickets', { cancelToken: source.token }).then(res => {
					setTickets(
						res.data.map(t => {
							setIsLoading(false)
							return {
								...t,
								created: new Date(t.created).toLocaleString(),
								lastupdate: t.last_update
									? new Date(t.last_update).toLocaleString()
									: null
							}
						})
					)
				})
			} catch (err) {
				if (axios.isCancel(err)) {
					console.log('cancelled')
				} else {
					throw err
				}
			}
		}
		loadTickets()

		return () => {
			source.cancel()
		}
	}, [])

	return (
		<div>
			<MaterialTable
				onRowClick={(e, rowData) => {
					props.history.push(`/ticket/${rowData.id}`)
				}}
				isLoading={isLoading}
				style={{
					margin: '20px'
				}}
				title='All Tickets'
				columns={columns}
				data={tickets}
				options={{
					pageSize: 20,
					paginationType: 'stepped',
					filtering: true,
					searchFieldVariant: 'outlined'
				}}
			/>
		</div>
	)
}

const mapStateToProps = state => state.auth

export default connect(mapStateToProps)(withRouter(Tickets))
