import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import * as Yup from 'yup'

const useStyles = makeStyles(theme => ({
	field: {
		margin: theme.spacing(1),
		padding: theme.spacing(1),
		textAlign: 'center',
		width: '90%',
		'& input': {
			textAlign: 'center'
		}
	}
}))

const Activate = props => {
	const classes = useStyles()

	const [userInfo, setUserInfo] = useState({})
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const CancelToken = axios.CancelToken
		const source = CancelToken.source()

		const loadUser = async () => {
			try {
				const res = await axios.get('/auth/user')

				setUserInfo(res.data)
			} catch (err) {
				throw err
			} finally {
				setIsLoading(false)
			}
		}

		loadUser()
		return () => {
			source.cancel()
		}
	}, [])

	return (
		<Box>
			{isLoading ? null : (
				<Formik initialValues={{
          name: userInfo.name,
          phone: userInfo.phone,
          password: '',
          passwordConfirm: ''
        }}
        validationSchema={Yup.object({
          phone: Yup.string()
          .required('Guest Phone Required')
          .matches(
            /^(?:(\+1)[ -])?\(?(\d{3})\)?[ -]?\.?(\d{3})[ -]?\.?(\d{4})$/,
            'Must be valid Phone Number'
          ),
          password: Yup.string().required(),
          confirmPassword: Yup.string().required()
        })}
        >
					{({ values, submitForm, isSubmitting, setFieldValue }) => (
						<Form>
							<Field
								className={classes.field}
								name='name'
								label='First and Last Name'
								component={TextField}
								variant='outlined'
							/>
							<Field
								className={classes.field}
								name='phone'
								label='Phone'
								component={TextField}
								variant='outlined'
							/>
							<Field
								className={classes.field}
								name='password'
								label='New Password'
								component={TextField}
                variant='outlined'
                type='password'
							/>
							<Field
								className={classes.field}
								name='passwordConfirm'
                label='Confirm Password'
								component={TextField}
								variant='outlined'
                type='password'
							/>
						</Form>
					)}
				</Formik>
			)}
		</Box>
	)
}

export default Activate
