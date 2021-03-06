import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createRoom, getRoomsFromUser } from './Reducers'
const initialState = {
    rooms: [],
    room: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
}
export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) =>
                    action.type.startsWith('room') &&
                    action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.isLoading = false
                    state.isError = false
                    state.isSuccess = true
                    state.message = ''
                    state.room = action.payload.room
                        ? action.payload.room
                        : state.room
                    state.rooms = action.payload.rooms
                        ? action.payload.rooms
                        : state.rooms
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith('room') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true
                    state.isError = false
                    state.isSuccess = false
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith('room') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    state.isError = true
                    state.isSuccess = false
                    state.message = action.payload
                    state.room = null
                    state.rooms = []
                    if (state.message === 'Room not found') {
                        console.log('not found')
                        window.location.replace('/')
                    }
                }
            )
    },
})

// Action creators are generated for each case reducer function
export const { reset } = roomSlice.actions

export default roomSlice.reducer
