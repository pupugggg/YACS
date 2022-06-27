import { createAsyncThunk } from '@reduxjs/toolkit'
import {createRoomService,getRoomsFromUserService,getRoomFromIdService,userQuitRoomService} from './roomService';
export const createRoom = createAsyncThunk(
    'room/create',
    async (data, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await createRoomService(token,data)
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
export const getRoomFromId = createAsyncThunk(
    'room/getRoomFromId',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await getRoomFromIdService(token,id)
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
export const userQuitRoom = createAsyncThunk(
    'room/userQuitRoom',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await userQuitRoomService(token,id)
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
