import './App.css'
import { io } from 'socket.io-client'
import { useEffect,useState } from 'react'
import Peer from 'simple-peer'
import {Box} from '@mui/material'
import {
  BrowserRouter as Router,
  Route,
  Routes
  ,
} from "react-router-dom";
import SignInSide from './components/main'
function App() {
    const [s,setS] = useState(null)
    useEffect(() => {
        const socket = io('http://localhost:5000')
        setS(socket)
        socket.emit('join','r1')
        socket.on('joined',(room,socketID)=>{
          console.log('joined',room,socketID)
        })
        socket.on('leave', (room, socketID) => {
            console.log('leave',room, socketID)
        })

        socket.on('disconnect',(reason)=>{
          console.log(reason)
        })
        return () => {
            socket.emit('leave','r1')
        }
    }, [])
    return <Box>
      <Router>
        <Routes>
        <Route path='*' element={<SignInSide/>}/>
        <Route path='/room/:id' element={<SignInSide/>}/>
        </Routes>
      </Router>
    </Box>
}

export default App
