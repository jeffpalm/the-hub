import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { createUseStyles } from 'react-jss'
import Card from '@material-ui/core/Card'

const POSITION = {x: 0, y:0}

const useStyles = createUseStyles({
	still: props => ({
		transform: `translate(${props.x}, ${props.y})`,
		cursor: 'grab'
	}),
	dragging: {
		cursor: 'grabbing !important'
	}
})

const CustomCard = ({ children, isDragging, ...props }) => {
	
	let classes = useStyles(props)

	return (
		<Card
			className={`${classes.still} ${isDragging ? classes.dragging : ''}`}
			{...props}
		>
			{children}
		</Card>
	)
}

CustomCard.defaultProps = {
	x: 0,
	y: 0
}


const DraggableCard = ({
	onDrag,
	onDragStart,
	onDragEnd,
	children,
	component,
	...props
}) => {
	const [state, setState] = useState({
		isDragging: false,
		oX: 0, // Original X and Y
		oY: 0,
		tX: 0, // Translate X and Y
		tY: 0,
		lastTX: 0,
		lastTY: 0
	})

	const classes = useStyles(props)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleMouseMove = ({ clientX, clientY }) => {
		if (!state.isDragging) return

		setState(prevState => {
			return {
				...state,
				tX: clientX - prevState.oX + prevState.lastTX,
				tY: clientY - prevState.oY + prevState.lastTY
			}
		})

		if (onDrag) onDrag({ ...state })
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleMouseUp = () => {
		window.removeEventListener('mousemove', handleMouseMove)
		window.removeEventListener('mouseup', handleMouseUp)
		setState({
			...state,
			oX: 0,
			oY: 0,
			lastTX: state.tX,
			lastTY: state.tY,
			isDragging: false
		})
		if (onDragEnd) {
			onDragEnd()
		}
	}

	const handleMouseDown = e => {
		e.preventDefault()

		if (onDragStart) {
			onDragStart()
		}

		setState({ ...state, oX: e.clientX, oY: e.clientY, isDragging: true })
	}

	useEffect(() => {
		if (state.isDragging) {
			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('mouseup', handleMouseUp)
		}
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [state, classes, handleMouseMove, handleMouseUp])

	return (
		<CustomCard
			variant='outlined'
			component={component}
			item
			onMouseDown={handleMouseDown}
			x={state.tX}
			y={state.tY}
			isDragging={state.isDragging}
			children={children}
			{...props}
		/>
	)
}



export default DraggableCard
