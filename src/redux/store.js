import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import promiseMiddleware from 'redux-promise-middleware'
import rootReducer from './reducers'

export default createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(promiseMiddleware))
)