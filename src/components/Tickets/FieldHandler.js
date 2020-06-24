import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

const FieldHandler = ({
	id,
	variant,
	handleFieldChange,
	value,
	name,
	description,
	type,
	isValidated,
	regex,
	validOptions,
	defaultOption
}) => {
	switch (type) {
		case 'text':
			return (
				<TextField
					name={name}
					label={name}
					value={value}
					onChange={e => {
						handleFieldChange(e.target.name, e.target.value)
					}}
					variant={variant}
					helperText={description}
				/>
			)
		case 'number':
			return (
				<TextField
					name={name}
					label={name}
					value={value}
					onChange={e => {
						handleFieldChange(e.target.name, e.target.value)
					}}
					variant={variant}
					helperText={description}
					type='number'
				/>
			)
		case 'list':
      // console.log(value)
			return (
				<Autocomplete
					autoComplete
					autoSelect
					disableClearable
					name={name}
					options={validOptions}
					getOptionLabel={option => option}
					defaultValue={defaultOption}
					onChange={(e, v) => {
						handleFieldChange(id, v)
					}}
					renderInput={params => (
						<TextField
							{...params}
							value={value}
							error={!validOptions.includes(value)}
							label={name}
							variant={variant}
							helperText={description}
						/>
					)}
				/>
			)
		case 'date':
			break
		default:
			break
	}
}

export default FieldHandler
