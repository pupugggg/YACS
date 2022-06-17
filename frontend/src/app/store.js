import { configureStore } from '@reduxjs/toolkit'
import roomReducer from '../features/room/roomSlice'
export default configureStore({
  reducer: {
    room:roomReducer
  },
})