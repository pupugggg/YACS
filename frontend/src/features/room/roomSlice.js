import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createRoom } from './Reducers'
const initialState = {
    roomId: null,
    me: null,
    members: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    massage: '',
}
export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRoom.pending, (state) => {
                state.isError = false
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(createRoom.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.isSuccess = true
                state.products = action.payload
            })
    },
})

// Action creators are generated for each case reducer function
export const { reset } = roomSlice.actions

export default roomSlice.reducer
