import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import MaterialTable, { MTableEditField } from 'material-table'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import EmailIcon from '@material-ui/icons/Email'
// import Tooltip from '@material-ui/core/Tooltip'
import { toast, ToastContainer } from 'react-toastify'

const UserManagement = props => {
	const columns = [
		{
			grouping: false,
			title: 'Name',
			field: 'name',
			filtering: false,
			searchable: true
		},
		{
			grouping: false,
			title: 'Email',
			field: 'email',
			filtering: false,
			searchable: false
		},
		{
			grouping: false,
			title: 'Phone',
			field: 'phone',
			filtering: false,
			searchable: false
		},
		{
			title: 'Role',
			grouping: true,
			field: 'role',
			filtering: true,
			searchable: false,
			lookup: { 1: 'Admin', 2: 'Finance Manager', 3: 'Experience Guide' }
		},
		{
			title: 'Activated',
			field: 'activated',
			cellStyle: cellData => ({
				backgroundColor: cellData ? '' : '#F4243450'
			}),
			render: rowData =>
				rowData.activated ? null : (

						<IconButton
							onClick={async () => {
								const { id, name, email } = rowData
								setIsLoading(true)
								try {
									await axios.post('/auth/reactivate', {
										id,
										name,
										email
									})
								} catch (err) {
									throw err
								} finally {
									setIsLoading(false)
									toast.success(`New activation email send to: ${email}`, {
										position: 'bottom-left'
									})
								}
							}}
						>
							<EmailIcon />
						</IconButton>

				)
		}
	]

	const [data, setData] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const CancelToken = axios.CancelToken
		const source = CancelToken.source()
		const loadData = async () => {
			try {
				const res = await axios.get('/api/users', { cancelToken: source.token })

				setData(res.data.users)
			} catch (err) {
				if (axios.isCancel(err)) {
					console.log('User management request cancelled')
				} else {
					throw err
				}
			} finally {
				setIsLoading(false)
			}
		}
		if (isLoading) {
			loadData()
		}

		return () => {
			source.cancel()
		}
	}, [isLoading])

	return (
		<Box mt={9} mr={1} ml={1}>
			<MaterialTable
				title='User Management'
				columns={columns}
				data={data}
				options={{
					paging: false,
					actionsColumnIndex: 6,
					addRowPosition: 'first',
					searchFieldVariant: 'outlined'
				}}
				editable={{
					onRowUpdate: async (newData, oldData) => {
						setIsLoading(true)
						const index = oldData.tableData.id
						const dataUpdate = [...data]
						try {
							const { data: updatedUser } = await axios.put(
								`/api/admin/user/${dataUpdate[index].id}`,
								newData
							)
							dataUpdate[index] = updatedUser
							setData([...dataUpdate])
						} catch (err) {
							throw err
						} finally {
							setIsLoading(false)
						}
					},
					onRowAdd: async newData => {
						setIsLoading(true)
						try {
							const response = await axios.post('/auth/new', newData)

							setData(response.data)
						} catch (err) {
							throw err
						} finally {
							setIsLoading(false)
						}
					}
				}}
				actions={[
					_rowData => ({
						icon: 'delete',
						tooltip: 'Delete user',
						onClick: async (_e, rowData) => {
							const confirm = window
								.confirm(
									`Are you sure you want to delete ${rowData.name}? All their open tickets will be reassigned.`
								)
								.valueOf()
							if (confirm) {
								setIsLoading(true)
								const { id: modified_by } = props.auth.user,
									CancelToken = axios.CancelToken,
									source = CancelToken.source()

								try {
									await axios.delete(`/auth/user/${rowData.id}`, {
										data: { modified_by },
										cancelToken: source.token
									})
								} catch (err) {
									if (axios.isCancel(err)) {
										console.log('User management request cancelled')
									} else {
										throw err
									}
								}
							}
						}
					})
				]}
				isLoading={isLoading}
				components={{
					EditField: props => (
						<div style={{ width: '100%' }}>
							<MTableEditField variant='outlined' {...props} />
						</div>
					)
				}}
			/>
			<ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} autoClose={3000} />
		</Box>
	)
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(UserManagement)
