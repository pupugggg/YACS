import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    pendingQueue: [],
    sent: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
}
export const collabSlice = createSlice({
    name: 'collab',
    initialState,
    reducers: {
        reset: (state) => initialState,
        enqueue: {
            reducer: (state, action) => {
                const {change,socket} = action.payload
                if(!state.sent){
                    state.sent = change
                    socket.emit('change',{change:change})
                }else{
                    state.pendingQueue.push(change)
                }
            },
            prepare: (change, socket) => {
                return { payload: { change:change,socket: socket } }
            },
        },
        ackThenSendNext:{
            reducer: (state,action) => {
                const {socket} = action.payload
                state.sent = null
                if(state.pendingQueue.length!==0){
                    state.sent = state.pendingQueue.shift()
                    socket.emit('change',{change:state.sent})
                }
            },
            prepare: (socket) => {
                return { payload: {socket: socket } }
            },
        }
    },
})

// Action creators are generated for each case reducer function
export const { reset,enqueue,ackThenSendNext } = collabSlice.actions

export default collabSlice.reducer
