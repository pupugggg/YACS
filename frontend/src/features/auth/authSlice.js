import { createSlice } from '@reduxjs/toolkit'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = {
    user: user ? user : null,
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
            localStorage.removeItem('user')
            state.user = null
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ''
            return state
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth') &&
                    action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.isLoading = false
                    state.isError = false
                    state.isSuccess = true
                    state.message = ''
                    state.user = action.payload
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true
                    state.isError = false
                    state.isSuccess = false
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    state.isError = true
                    state.isSuccess = false
                    state.message = action.payload
                    state.user = null
                }
            )
    },
})

export const { reset, logout } = authSlice.actions
export default authSlice.reducer
