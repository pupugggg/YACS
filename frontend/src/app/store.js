import { configureStore } from '@reduxjs/toolkit'
import roomReducer from '../features/room/roomSlice'
import authReducer from '../features/auth/authSlice'
import collabReducer from '../features/collab/collabSlice'
export default configureStore({
  reducer: {
    room:roomReducer,
    auth:authReducer,
    collab:collabReducer,
  },
})