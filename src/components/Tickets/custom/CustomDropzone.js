import React from 'react'
import { useDropzone } from 'react-dropzone'
import Typography from '@material-ui/core/Typography'

const CustomDropzone = props => {
	const { setValue, values, field } = props
	const { getRootProps, getInputProps } = useDropzone({
		accept: ['image/*', '.pdf'],
		onDrop: acceptedFiles => {
			if (values[field].length) {
				setValue(field, [...values[field], ...acceptedFiles])
			} else {
				setValue(field, acceptedFiles)
			}
		}
	})
	return (
		<>
			<div {...getRootProps()} className={props.className}>
				<input {...getInputProps()} />
				<Typography>
					Drag and drop some files here, or click to select files
				</Typography>
			</div>
		</>
	)
}

export default CustomDropzone
