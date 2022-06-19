import React,{useEffect} from 'react'
import {logout} from '../features/auth/authSlice'
import {useSelector,useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
function DashBoard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user} = useSelector(s=>s.auth)
    const handleClick=(e)=>{
        dispatch(logout())
    }
    useEffect(()=>{
        if(!user){
            navigate('/login')
        }
    },[dispatch,user,navigate])
    return <div><Button onClick={e=>handleClick(e)}>logout</Button></div>
}

export default DashBoard
