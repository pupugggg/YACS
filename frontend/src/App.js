import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignInSide from './components/Login'
import RegisterSide from './components/Register'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Room from './components/Room'
import Main from './components/Main'
import Header from './components/Header'
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
    return (
        <ThemeProvider theme={theme}>
            <Router>
            <Header
                main={
                    
                        <Routes>
                            <Route path="/login" element={<SignInSide />} />
                            <Route
                                path="/register"
                                element={<RegisterSide />}
                            />
                            <Route path="/room/:id" element={<Room />} />
                            <Route path="*" element={<Main />} />
                        </Routes>
                   
                }
            />
             </Router>
        </ThemeProvider>
    )
}

export default App
