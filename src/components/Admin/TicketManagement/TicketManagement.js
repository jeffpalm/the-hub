import React from 'react'
import MaterialTable from 'material-table'
import { useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
// import Dialog from '@material-ui/core/Dialog'
// import DialogTitle from '@material-ui/core/DialogTitle'

const TicketManagement = props => {
	// const [open, setOpen] = useState(false)

	const { config } = useSelector(state => state)

	const statusColumns = [
		{
			grouping: false,
			title: 'Status',
			field: 'name',
			filtering: false,
			searchable: true,
			cellStyle: {
				textAlign: 'center'
			},
			headerStyle: {
				textAlign: 'center'
			}
		},
		{
			grouping: true,
			title: 'Deal Type',
			field: 'ticket_type',
			filtering: true,
			lookup: { 1: 'Finance', 2: 'Cash', 3: 'OSF' },
			cellStyle: {
				textAlign: 'center',
				borderRight: '1px solid grey',
				borderLeft: '1px solid grey'
			},
			headerStyle: {
				textAlign: 'center'
			}
		},
		{
			grouping: false,
			title: 'Lifecycle',
			field: 'lifecycle',
			filtering: false,
			searchable: false,
			cellStyle: {
				textAlign: 'center'
			},
			headerStyle: {
				textAlign: 'center'
			}
		}
	]

	const typeColumns = [
		{
			title: 'Deal Type',
			field: 'name',
			cellStyle: {
				textAlign: 'center'
			},
			headerStyle: {
				textAlign: 'center'
			}
		},
		{
			title: 'Weight',
			field: 'weight',
			cellStyle: {
				textAlign: 'center',
				borderRight: '1px solid grey',
				borderLeft: '1px solid grey'
			},
			headerStyle: {
				textAlign: 'center'
			}
		}
	]

	console.log(config)

	return (
		<Box mt={9} p={1}>
			<Grid container justify='space-around'>
				<MaterialTable
					title='Finance App Statuses'
					columns={statusColumns}
					data={config.statuses}
					options={{
						paging: false,
						search: false,
						minBodyHeight: 400
					}}
					style={{
						minWidth: 600
					}}
				/>
				<MaterialTable
					title='Deal Types'
					columns={typeColumns}
					data={config.types}
					options={{
						paging: false,
						search: false,
						minBodyHeight: 400
					}}
					style={{
						minWidth: 400
					}}
				/>
			</Grid>
		</Box>
	)
}

export default TicketManagement
