import { createSlice } from '@reduxjs/toolkit'
import { logout as logoutReducer} from './Reducers'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = {
    user: user ? user : null,
    loggedIn: false,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => initialState,
        logout: (state) => {
            logoutReducer()
            return initialState
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state,action) => {
                    state.isLoading = false
                    state.isError = false
                    state.isSuccess = true
                    state.message = ''
                    state.loggedIn = true
                    state.user = action.payload
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true
                    state.isError = false
                    state.isSuccess = false
                    state.loggedIn = false
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    state.isError = true
                    state.isSuccess = false
                    state.message = action.payload
                    state.loggedIn = false
                    state.user = null
                }
            )
    },
})

export const { reset, logout } = authSlice.actions
export default authSlice.reducer
