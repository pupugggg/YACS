import React, { useEffect } from 'react'
import { logout } from '../features/auth/authSlice'
import { createRoom } from '../features/room/Reducers'
import { reset } from '../features/room/roomSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Box, Link } from '@mui/material'
import { getRoomsFromUser } from '../features/room/Reducers'
import CssBaseline from '@mui/material/CssBaseline'
function DashBoard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((s) => s.auth)
    const { rooms } = useSelector((s) => s.room)
    const handleClick = (e) => {
        e.preventDefault()
        dispatch(logout())
    }
    const handleCreate = (e) => {
        e.preventDefault()
        dispatch(createRoom())
    }
    useEffect(() => {
        dispatch(getRoomsFromUser())
        if (!user) {
            navigate('/login')
        }

        return () => {
            dispatch(reset())
        }
    }, [dispatch, user, navigate])
    return (
        <>
            <CssBaseline />
            <Button variant="contained" onClick={(e) => handleClick(e)}>
                logout
            </Button>
            <Button variant="contained" onClick={(e) => handleCreate(e)}>
                create workspace
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {rooms && rooms[0] ? (
                    rooms.map((e,index) => (
                        <Button key = {index} variant="contained">
                            <Link
                                sx={{ color: 'white' }}
                                key={e}
                                href={`/room/${e}`}
                            >
                                {e}
                            </Link>
                        </Button>
                    ))
                ) : (
                    <></>
                )}
            </Box>
        </>
    )
}

export default DashBoard
