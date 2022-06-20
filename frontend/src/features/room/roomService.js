import axios from 'axios'
const BASE_URL = '/api/v1/room'
export async function createRoomService(token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(BASE_URL+'all')
    return response.data
}
export async function getRoomsFromUserService(token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(BASE_URL,config)
    return response.data
}