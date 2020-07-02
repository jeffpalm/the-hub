import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'

export const ConfirmationDialog = ({
	onClose,
	value: valueProp,
  options,
  tickfieldtype,
	open,
	...rest
}) => {
	const [value, setValue] = React.useState(valueProp)
  const radioGroupRef = React.useRef(null)
  
  const titles = {
    type: 'Update Deal Type',
    status: 'Update App Status',
    sales: 'Re-assign Experience Guide',
    finance: 'Re-assign Finance Manager'
  }

	React.useEffect(() => {
		if (!open) {
			setValue(valueProp)
		}
	}, [valueProp, open])

	const handleEntering = () => {
		if (radioGroupRef.current !== null) {
			radioGroupRef.current.focus()
		}
	}

	const handleCancel = () => {
		onClose(tickfieldtype)
	}

	const handleOk = () => {
		onClose(tickfieldtype, value)
	}

	const handleChange = event => {
		setValue(event.target.value)
		// console.log(event.target.value)
	}

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			maxWidth='xs'
			onEntering={handleEntering}
			open={open}
			{...rest}
		>
			<DialogTitle>{titles[tickfieldtype]}</DialogTitle>
			<DialogContent dividers>
				<RadioGroup
					ref={radioGroupRef}
					value={value}
					onChange={handleChange}
				>
					{options.map((option, index) => (
						<FormControlLabel
							value={option.value}
							key={option.value}
							control={<Radio />}
							label={option.label}
							checked={value === option.value}
						/>
					))}
				</RadioGroup>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleCancel} color='primary'>
					Cancel
				</Button>
				<Button onClick={handleOk} color='primary'>
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	)
}

ConfirmationDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	value: PropTypes.any,
	options: PropTypes.array.isRequired
}
