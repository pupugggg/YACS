import React ,{useEffect}from 'react'
import {useNavigate,useParams} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import {getRoomFromId} from '../features/room/Reducers'
function Room() {
    let {id} = useParams()
    const dispatch = useDispatch()
    const {isError,room} = useSelector(s=>s.room)
    useEffect(()=>{
        dispatch(getRoomFromId(id))
    },[dispatch])
   
    return <div>Room {id}</div>
}

export default Room
