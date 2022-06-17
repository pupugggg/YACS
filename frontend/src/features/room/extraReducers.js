import { createAsyncThunk } from '@reduxjs/toolkit'
import {createRoomService} from './roomService';
export const createRoom = createAsyncThunk(
    'room/create',
    async (_, thunkAPI) => {
        try {
            return await createRoomService()
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
