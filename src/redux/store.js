import { createStore, applyMiddleware } from 'redux'
import authReducer from './authReducer'
import promiseMiddleware from 'redux-promise-middleware'

export default createStore(authReducer, applyMiddleware(promiseMiddleware))
