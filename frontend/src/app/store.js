import { configureStore } from '@reduxjs/toolkit'
import roomReducer from '../features/room/roomSlice'
import authReducer from '../features/auth/authSlice'
export default configureStore({
  reducer: {
    room:roomReducer,
    auth:authReducer,
  },
})