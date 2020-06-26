import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const NewTicketFormik = props => {
	return (
		<>
			<Formik
				initialValues={{
					sales_id: props.user.id,
					ticket_type: '',
					message: '',
					vin: '',
					showroom: false,
					appointment: '',
					guest: {
						name: '',
						phone: ''
					},
					cosigner: {
						name: '',
						phone: ''
					},
					fields: [],
					attachments: []
				}}
				validationSchema={Yup.object({
					vin: Yup.string()
						.matches(/[A-HJ-NPR-Za-hj-npr-z0-9]{17,17}/g)
						.required('Required')
				})}>
          
        </Formik>
		</>
	)
}
