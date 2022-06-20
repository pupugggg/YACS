import axios from 'axios'
const BASE_URL = '/api/v1/room'
export async function createRoomService(token){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(BASE_URL,null,config)
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
export async function getRoomFromIdService(token,Id){
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(`${BASE_URL}/join/${Id}`,config)
    return response.data
}