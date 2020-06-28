import { createSelector } from 'reselect'

const user = store => store.auth.user
const authenticated = store => store.auth.isAuthenticated

export const getUser = createSelector(user)
export const getAuth = createSelector(authenticated)