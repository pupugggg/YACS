import { createAsyncThunk } from '@reduxjs/toolkit'
import {createRoomService,getRoomsFromUserService} from './roomService';
export const createRoom = createAsyncThunk(
    'room/create',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await createRoomService(token)
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const getRoomsFromUser = createAsyncThunk(
    'room/getRoomsFromUser',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await getRoomsFromUserService(token)
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)
