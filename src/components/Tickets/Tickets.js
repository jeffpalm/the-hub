import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MaterialTable from 'material-table'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
	fab: {
		position: 'fixed',
		bottom: 10,
		right: 10
	}
}))

const Tickets = props => {
	const classes = useStyles()
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
			searchable: true
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
			lookup: {Finance: 'Finance', OSF: 'OSF', Cash: 'Cash'}
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
		axios.get('/api/tickets').then(res => {
			setTickets(
				res.data.map(t => {
					setIsLoading(false)
					return {
						...t,
						created: new Date(t.created).toLocaleString(),
						lastupdate: t.lastupdate
							? new Date(t.lastupdate).toLocaleString()
							: null
					}
				})
			)
		})
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
			<Tooltip title='New Ticket' placement='left-start'>
				<Fab
					className={classes.fab}
					color='primary'
					onClick={() => props.history.push('/new')}
				>
					<AddIcon />
				</Fab>
			</Tooltip>
		</div>
	)
}

const mapStateToProps = state => state.auth

export default connect(mapStateToProps)(withRouter(Tickets))
