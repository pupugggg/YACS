import './App.css'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import Peer from 'simple-peer'
import { Box } from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignInSide from './components/Login'
import RegisterSide from './components/Register'
import { createTheme, ThemeProvider } from '@mui/material/styles'
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
})
function App() {
    const [s, setS] = useState(null)
    useEffect(() => {
        const socket = io('http://localhost:5000')
        setS(socket)
        socket.emit('join', 'r1')
        socket.on('joined', (room, socketID) => {
            console.log('joined', room, socketID)
        })
        socket.on('leave', (room, socketID) => {
            console.log('leave', room, socketID)
        })

        socket.on('disconnect', (reason) => {
            console.log(reason)
        })
        return () => {
            socket.emit('leave', 'r1')
        }
    }, [])
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/login" element={<SignInSide />} />
                    <Route path="/register" element={<RegisterSide />} />
                    <Route path="*" element={<SignInSide />} />
                    <Route path="/room/:id" element={<SignInSide />} />
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App
